import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

interface ScreenshotSelectorProps {
  isSelectionMode: boolean;
  setIsSelectionMode: (mode: boolean) => void;
  containerRef: React.RefObject<HTMLElement>;
}

// Check if screen capture is supported
const isScreenCaptureSupported = () => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
};

// Check if we're in a secure context (required for screen capture)
const isSecureContext = () => {
  return window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost';
};

export const ScreenshotSelector = memo(
  ({ isSelectionMode, setIsSelectionMode, containerRef }: ScreenshotSelectorProps) => {
    const [isCapturing, setIsCapturing] = useState(false);
    const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<{ x: number; y: number } | null>(null);
    const [_permissionDenied, setPermissionDenied] = useState(false);
    const [showPermissionHelp, setShowPermissionHelp] = useState(false);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
      // Cleanup function to stop all tracks when component unmounts
      return () => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.srcObject = null;
          videoRef.current.remove();
          videoRef.current = null;
        }

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
      };
    }, []);

    const initializeStream = async () => {
      if (!mediaStreamRef.current) {
        try {
          // Check if the API is supported
          if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
            throw new Error('Screen capture is not supported in this browser');
          }

          const stream = await navigator.mediaDevices.getDisplayMedia({
            audio: false,
            video: {
              displaySurface: 'window',
              preferCurrentTab: true,
              surfaceSwitching: 'include',
              systemAudio: 'exclude',
            },
          } as MediaStreamConstraints);

          // Add handler for when sharing stops
          stream.addEventListener('inactive', () => {
            if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.srcObject = null;
              videoRef.current.remove();
              videoRef.current = null;
            }

            if (mediaStreamRef.current) {
              mediaStreamRef.current.getTracks().forEach((track) => track.stop());
              mediaStreamRef.current = null;
            }

            setIsSelectionMode(false);
            setSelectionStart(null);
            setSelectionEnd(null);
            setIsCapturing(false);
          });

          mediaStreamRef.current = stream;

          // Initialize video element if needed
          if (!videoRef.current) {
            const video = document.createElement('video');
            video.style.opacity = '0';
            video.style.position = 'fixed';
            video.style.pointerEvents = 'none';
            video.style.zIndex = '-1';
            document.body.appendChild(video);
            videoRef.current = video;
          }

          // Set up video with the stream
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        } catch (error: any) {
          console.error('Failed to initialize stream:', error);

          // Handle different types of errors with specific messages
          let errorMessage = 'Failed to initialize screen capture';
          let isPermissionError = false;

          if (error.name === 'NotAllowedError') {
            errorMessage = 'Screen capture permission denied. Please allow screen sharing to use this feature.';
            isPermissionError = true;
          } else if (error.name === 'NotSupportedError') {
            errorMessage = 'Screen capture is not supported in this browser or context.';
          } else if (error.name === 'NotFoundError') {
            errorMessage = 'No screen capture source available.';
          } else if (error.name === 'AbortError') {
            errorMessage = 'Screen capture was cancelled by the user.';
          } else if (error.name === 'NotReadableError') {
            errorMessage = 'Screen capture source is already in use.';
          } else if (error.name === 'OverconstrainedError') {
            errorMessage = 'Screen capture constraints could not be satisfied.';
          } else if (error.name === 'SecurityError') {
            errorMessage = 'Screen capture blocked due to security restrictions.';
          } else if (error.message?.includes('not supported')) {
            errorMessage = 'Screen capture is not supported in this browser';
          }

          // Set permission state for UI feedback
          if (isPermissionError) {
            setPermissionDenied(true);
            setShowPermissionHelp(true);
          }

          setIsSelectionMode(false);
          toast.error(errorMessage);

          // Clean up any partial state
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = null;
          }
        }
      }

      return mediaStreamRef.current;
    };

    const handleRetryPermission = useCallback(async () => {
      setPermissionDenied(false);
      setShowPermissionHelp(false);

      // Clear any existing stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }

      // Try to initialize stream again
      await initializeStream();
    }, []);

    const handleCopySelection = useCallback(async () => {
      if (!isSelectionMode || !selectionStart || !selectionEnd || !containerRef.current) {
        return;
      }

      // Early validation checks
      if (!isScreenCaptureSupported()) {
        toast.error('Screen capture is not supported in this browser');
        setIsSelectionMode(false);

        return;
      }

      if (!isSecureContext()) {
        toast.error('Screen capture requires a secure context (HTTPS or localhost)');
        setIsSelectionMode(false);

        return;
      }

      setIsCapturing(true);

      try {
        const stream = await initializeStream();

        if (!stream || !videoRef.current) {
          return;
        }

        // Wait for video to be ready
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Create temporary canvas for full screenshot
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = videoRef.current.videoWidth;
        tempCanvas.height = videoRef.current.videoHeight;

        const tempCtx = tempCanvas.getContext('2d');

        if (!tempCtx) {
          throw new Error('Failed to get temporary canvas context');
        }

        // Draw the full video frame
        tempCtx.drawImage(videoRef.current, 0, 0);

        // Calculate scale factor between video and screen
        const scaleX = videoRef.current.videoWidth / window.innerWidth;
        const scaleY = videoRef.current.videoHeight / window.innerHeight;

        // Get window scroll position
        const scrollX = window.scrollX;
        const scrollY = window.scrollY + 40;

        // Get the container's position in the page
        const containerRect = containerRef.current.getBoundingClientRect();

        // Offset adjustments for more accurate clipping
        const leftOffset = -9; // Adjust left position
        const bottomOffset = -14; // Adjust bottom position

        // Calculate the scaled coordinates with scroll offset and adjustments
        const scaledX = Math.round(
          (containerRect.left + Math.min(selectionStart.x, selectionEnd.x) + scrollX + leftOffset) * scaleX,
        );
        const scaledY = Math.round(
          (containerRect.top + Math.min(selectionStart.y, selectionEnd.y) + scrollY + bottomOffset) * scaleY,
        );
        const scaledWidth = Math.round(Math.abs(selectionEnd.x - selectionStart.x) * scaleX);
        const scaledHeight = Math.round(Math.abs(selectionEnd.y - selectionStart.y) * scaleY);

        // Create final canvas for the cropped area
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(Math.abs(selectionEnd.x - selectionStart.x));
        canvas.height = Math.round(Math.abs(selectionEnd.y - selectionStart.y));

        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // Draw the cropped area
        ctx.drawImage(tempCanvas, scaledX, scaledY, scaledWidth, scaledHeight, 0, 0, canvas.width, canvas.height);

        // Convert to blob
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          }, 'image/png');
        });

        // Create a FileReader to convert blob to base64
        const reader = new FileReader();

        reader.onload = (e) => {
          const base64Image = e.target?.result as string;

          // Find the textarea element
          const textarea = document.querySelector('textarea');

          if (textarea) {
            // Get the setters from the BaseChat component
            const setUploadedFiles = (window as any).__BOLT_SET_UPLOADED_FILES__;
            const setImageDataList = (window as any).__BOLT_SET_IMAGE_DATA_LIST__;
            const uploadedFiles = (window as any).__BOLT_UPLOADED_FILES__ || [];
            const imageDataList = (window as any).__BOLT_IMAGE_DATA_LIST__ || [];

            if (setUploadedFiles && setImageDataList) {
              // Update the files and image data
              const file = new File([blob], 'screenshot.png', { type: 'image/png' });
              setUploadedFiles([...uploadedFiles, file]);
              setImageDataList([...imageDataList, base64Image]);
              toast.success('Screenshot captured and added to chat');
            } else {
              toast.error('Could not add screenshot to chat');
            }
          }
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Failed to capture screenshot:', error);
        toast.error('Failed to capture screenshot');

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
      } finally {
        setIsCapturing(false);
        setSelectionStart(null);
        setSelectionEnd(null);
        setIsSelectionMode(false); // Turn off selection mode after capture
      }
    }, [isSelectionMode, selectionStart, selectionEnd, containerRef, setIsSelectionMode]);

    const handleSelectionStart = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isSelectionMode) {
          return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setSelectionStart({ x, y });
        setSelectionEnd({ x, y });
      },
      [isSelectionMode],
    );

    const handleSelectionMove = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isSelectionMode || !selectionStart) {
          return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setSelectionEnd({ x, y });
      },
      [isSelectionMode, selectionStart],
    );

    if (!isSelectionMode) {
      return null;
    }

    // Show permission help overlay if needed
    if (showPermissionHelp) {
      return (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <span className="i-ph:warning text-red-600 dark:text-red-400 w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Screen Capture Permission Required
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Allow screen sharing to capture screenshots</p>
              </div>
            </div>

            <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
              <p className="mb-2">To use the screenshot feature:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Click "Try Again" below</li>
                <li>Select "Allow" when prompted by your browser</li>
                <li>Choose the screen or window to capture</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleRetryPermission}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPermissionHelp(false);
                  setIsSelectionMode(false);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className="absolute inset-0 cursor-crosshair"
        onMouseDown={handleSelectionStart}
        onMouseMove={handleSelectionMove}
        onMouseUp={handleCopySelection}
        onMouseLeave={() => {
          if (selectionStart) {
            setSelectionStart(null);
          }
        }}
        style={{
          backgroundColor: isCapturing ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          pointerEvents: 'all',
          opacity: isCapturing ? 0 : 1,
          zIndex: 50,
          transition: 'opacity 0.1s ease-in-out',
        }}
      >
        {selectionStart && selectionEnd && !isCapturing && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-20"
            style={{
              left: Math.min(selectionStart.x, selectionEnd.x),
              top: Math.min(selectionStart.y, selectionEnd.y),
              width: Math.abs(selectionEnd.x - selectionStart.x),
              height: Math.abs(selectionEnd.y - selectionStart.y),
            }}
          />
        )}
      </div>
    );
  },
);

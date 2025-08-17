import { useEffect } from 'react';
import { useSearchParams } from '@remix-run/react';

export default function WebContainerConnect() {
  const [searchParams] = useSearchParams();
  const editorOrigin = searchParams.get('editorOrigin') || 'https://stackblitz.com';

  useEffect(() => {
    // Load and setup WebContainer connect on the client side
    const setupWebContainer = async () => {
      try {
        const { setupConnect } = await import('@webcontainer/api/connect');
        setupConnect({
          editorOrigin: editorOrigin
        });
      } catch (error) {
        console.error('Failed to setup WebContainer connect:', error);
      }
    };

    setupWebContainer();
  }, [editorOrigin]);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Connect to WebContainer</title>
      </head>
      <body>
        <div id="webcontainer-connect">
          <p>Connecting to WebContainer...</p>
        </div>
      </body>
    </html>
  );
}

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { classNames } from '~/utils/classNames';

export interface ToastProps {
  id: string;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  isVisible: boolean;
  onClose: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const toastVariants = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 20, scale: 0.95 },
};

const typeStyles = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    icon: 'i-ph:check-circle text-green-500',
    text: 'text-green-800 dark:text-green-200',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    icon: 'i-ph:x-circle text-red-500',
    text: 'text-red-800 dark:text-red-200',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    icon: 'i-ph:warning text-yellow-500',
    text: 'text-yellow-800 dark:text-yellow-200',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    icon: 'i-ph:info text-blue-500',
    text: 'text-blue-800 dark:text-blue-200',
  },
};

export function Toast({ title, message, type = 'info', isVisible, onClose, action }: ToastProps) {
  const styles = typeStyles[type];

  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={toastVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={classNames(
            'relative flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm',
            'max-w-md w-full',
            styles.bg,
          )}
        >
          {/* Icon */}
          <div className={classNames('flex-shrink-0 w-5 h-5 mt-0.5', styles.icon)} />

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && <h4 className={classNames('text-sm font-medium mb-1', styles.text)}>{title}</h4>}
            <p className={classNames('text-sm', styles.text, !title ? 'font-medium' : '')}>{message}</p>

            {action && (
              <button
                type="button"
                onClick={action.onClick}
                className={classNames(
                  'mt-2 text-sm font-medium underline hover:no-underline transition-all',
                  styles.text,
                )}
              >
                {action.label}
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className={classNames(
              'flex-shrink-0 w-5 h-5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors',
              'flex items-center justify-center',
            )}
          >
            <div className="i-ph:x w-3 h-3 opacity-60 hover:opacity-100" />
          </button>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-xl"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 5, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Toast container component
interface ToastContainerProps {
  toasts: ToastProps[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
};

export function ToastContainer({ toasts, position = 'top-right' }: ToastContainerProps) {
  return (
    <div className={classNames('fixed z-50 flex flex-col gap-2', positionClasses[position])}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastProps, 'id' | 'isVisible' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      ...toast,
      id,
      isVisible: true,
      onClose: () => removeToast(id),
    };
    setToasts((prev) => [...prev, newToast]);

    return id;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = React.useCallback(
    (message: string, options?: Partial<ToastProps>) => {
      return addToast({ ...options, message, type: 'success' });
    },
    [addToast],
  );

  const error = React.useCallback(
    (message: string, options?: Partial<ToastProps>) => {
      return addToast({ ...options, message, type: 'error' });
    },
    [addToast],
  );

  const warning = React.useCallback(
    (message: string, options?: Partial<ToastProps>) => {
      return addToast({ ...options, message, type: 'warning' });
    },
    [addToast],
  );

  const info = React.useCallback(
    (message: string, options?: Partial<ToastProps>) => {
      return addToast({ ...options, message, type: 'info' });
    },
    [addToast],
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}

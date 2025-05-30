import React from 'react';
import { classNames } from '~/utils/classNames';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'gradient' | 'pulse';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export function LoadingSpinner({ size = 'md', variant = 'default', className }: LoadingSpinnerProps) {
  if (variant === 'gradient') {
    return (
      <div className={classNames('relative', sizeClasses[size], className)}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 animate-spin">
          <div className="absolute inset-1 rounded-full bg-bolt-elements-background"></div>
        </div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={classNames('flex space-x-1', className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={classNames(
              'rounded-full bg-purple-500 animate-pulse',
              size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-4 h-4',
              i === 0 && 'animation-delay-0',
              i === 1 && 'animation-delay-150',
              i === 2 && 'animation-delay-300'
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={classNames(
        'animate-spin rounded-full border-2 border-gray-300 border-t-purple-500',
        sizeClasses[size],
        className
      )}
    />
  );
}

// Enhanced loading overlay component
interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  variant?: 'default' | 'blur';
  children?: React.ReactNode;
}

export function LoadingOverlay({ isVisible, message, variant = 'default', children }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      className={classNames(
        'fixed inset-0 z-50 flex items-center justify-center',
        variant === 'blur' ? 'backdrop-blur-sm bg-black/20' : 'bg-black/50'
      )}
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 max-w-sm mx-4">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" variant="gradient" />
          {message && (
            <p className="text-sm text-bolt-elements-textSecondary text-center">{message}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

// Skeleton loading component
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ className, variant = 'text', width, height, lines = 1 }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';
  
  if (variant === 'circular') {
    return (
      <div
        className={classNames(baseClasses, 'rounded-full', className)}
        style={{ width, height }}
      />
    );
  }

  if (variant === 'rectangular') {
    return (
      <div
        className={classNames(baseClasses, 'rounded-lg', className)}
        style={{ width, height }}
      />
    );
  }

  // Text variant with multiple lines
  return (
    <div className={classNames('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={classNames(
            baseClasses,
            'h-4 rounded',
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
          style={i === 0 ? { width } : undefined}
        />
      ))}
    </div>
  );
}

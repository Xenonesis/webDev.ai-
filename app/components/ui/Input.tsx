import { forwardRef } from 'react';
import { classNames } from '~/utils/classNames';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={classNames(
        'flex h-10 w-full rounded-lg border-2 border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-white/60 transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:border-purple-400/50 focus-visible:bg-white/15',
        'hover:border-white/30 hover:bg-white/12',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-white/5',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white',

        // Light theme overrides
        '[data-theme="light"] &:bg-gray-50 [data-theme="light"] &:text-gray-900 [data-theme="light"] &:border-gray-300',
        '[data-theme="light"] &:placeholder:text-gray-500 [data-theme="light"] &:focus-visible:border-purple-500',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };

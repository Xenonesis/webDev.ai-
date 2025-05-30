import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { classNames } from '~/utils/classNames';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/20 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-lg',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-white/10 to-white/5 text-white border border-white/20 hover:from-white/15 hover:to-white/10 hover:border-white/30 backdrop-blur-sm',
        destructive: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-red-500/25 hover:shadow-red-500/40',
        outline:
          'border border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm',
        secondary:
          'bg-gradient-to-r from-gray-600/20 to-gray-700/20 text-white border border-gray-500/30 hover:from-gray-600/30 hover:to-gray-700/30 backdrop-blur-sm',
        ghost: 'text-white hover:bg-white/10 rounded-lg',
        link: 'text-purple-400 underline-offset-4 hover:underline hover:text-purple-300',
        primary: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:from-purple-600 hover:to-violet-700 shadow-purple-500/25 hover:shadow-purple-500/40',
        success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-green-500/25 hover:shadow-green-500/40',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-8 rounded-lg px-4 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-10 w-10',
        xl: 'h-14 rounded-2xl px-12 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  _asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, _asChild = false, ...props }, ref) => {
    return <button className={classNames(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };

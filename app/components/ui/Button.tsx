import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { classNames } from '~/utils/classNames';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-lg',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-white/15 to-white/10 text-white border border-white/30 hover:from-white/25 hover:to-white/20 hover:border-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl',
        destructive:
          'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-red-500/25 hover:shadow-red-500/40 border border-red-400/20',
        outline:
          'border-2 border-white/40 bg-transparent text-white hover:bg-white/15 hover:border-white/60 backdrop-blur-sm shadow-md hover:shadow-lg',
        secondary:
          'bg-gradient-to-r from-gray-600/25 to-gray-700/25 text-white border border-gray-400/40 hover:from-gray-600/35 hover:to-gray-700/35 backdrop-blur-sm shadow-md hover:shadow-lg',
        ghost: 'text-white hover:bg-white/15 rounded-lg hover:shadow-md',
        link: 'text-purple-300 underline-offset-4 hover:underline hover:text-purple-200 font-medium',
        primary:
          'bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:from-purple-600 hover:to-violet-700 shadow-purple-500/30 hover:shadow-purple-500/50 border border-purple-400/20',
        success:
          'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-green-500/30 hover:shadow-green-500/50 border border-green-400/20',
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

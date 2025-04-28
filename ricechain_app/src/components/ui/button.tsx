import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  fullWidth?: boolean;
}

const getVariantClasses = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'default':
      return 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500';
    case 'secondary':
      return 'bg-secondary-600 text-white hover:bg-secondary-700 focus-visible:ring-secondary-500';
    case 'outline':
      return 'border border-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-gray-400';
    case 'ghost':
      return 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-gray-400';
    case 'link':
      return 'bg-transparent underline-offset-4 hover:underline text-primary-600 dark:text-primary-400 hover:bg-transparent';
    case 'destructive':
      return 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500';
    default:
      return 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500';
  }
};

const getSizeClasses = (size: ButtonProps['size']) => {
  switch (size) {
    case 'default':
      return 'h-10 py-2 px-4';
    case 'sm':
      return 'h-8 px-3 text-xs';
    case 'lg':
      return 'h-12 px-6 text-base';
    case 'icon':
      return 'h-10 w-10';
    default:
      return 'h-10 py-2 px-4';
  }
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', fullWidth = false, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          getVariantClasses(variant),
          getSizeClasses(size),
          fullWidth && 'w-full',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };

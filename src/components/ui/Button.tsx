import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

    const sizeStyles = {
      sm: 'text-[11px] px-2.5 py-1.5 rounded-md gap-1.5 leading-none',
      md: 'text-xs px-3.5 py-2 rounded-lg gap-2 leading-none',
      lg: 'text-sm px-4 py-2.5 rounded-lg gap-2.5 leading-none',
    };

    const variantStyles = {
      primary:
        'bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-sm active:bg-blue-800 border border-blue-700/20 font-semibold',
      secondary:
        'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 active:bg-slate-300 font-medium',
      outline:
        'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 active:bg-slate-100 font-medium',
      ghost:
        'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 active:bg-slate-200 font-medium',
      danger:
        'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-300 active:bg-red-200 font-semibold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-current" />
            <span>{loadingText || children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

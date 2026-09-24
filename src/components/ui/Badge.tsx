import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'brand' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 font-mono',
    md: 'text-[11px] px-2 py-0.5',
  };

  const variantStyles = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200/80',
    brand: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded border ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

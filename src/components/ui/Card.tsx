import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'muted' | 'interactive';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-white border-slate-200/90 shadow-2xs',
      muted: 'bg-slate-50/80 border-slate-200 shadow-none',
      interactive:
        'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all duration-150 cursor-pointer',
    };

    return (
      <div
        ref={ref}
        className={`rounded-xl border ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`p-4 border-b border-slate-100 flex flex-col gap-1 ${className}`} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', children, ...props }, ref) => (
    <h3 ref={ref} className={`text-xs font-semibold text-slate-900 leading-snug ${className}`} {...props}>
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', ...props }, ref) => (
    <p ref={ref} className={`text-[11px] text-slate-500 leading-normal ${className}`} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`p-4 ${className}`} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`p-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-2 rounded-b-xl ${className}`} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

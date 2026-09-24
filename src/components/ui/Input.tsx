import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, rightElement, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1 w-full text-xs">
        {label && (
          <label htmlFor={inputId} className="font-medium text-slate-700 text-[11px] flex items-center justify-between">
            <span>{label}</span>
            {helperText && <span className="text-slate-400 font-normal">{helperText}</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-2.5 pointer-events-none text-slate-400 flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full text-xs bg-white border rounded-lg px-2.5 py-1.5 text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-hidden ${
              leftIcon ? 'pl-8' : ''
            } ${rightElement ? 'pr-8' : ''} ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-2.5 text-slate-400 flex items-center text-[11px] font-mono pointer-events-none">
              {rightElement}
            </div>
          )}
        </div>
        {error && <span className="text-[11px] text-red-600 font-medium">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1 w-full text-xs">
        {label && (
          <label htmlFor={inputId} className="font-medium text-slate-700 text-[11px] flex items-center justify-between">
            <span>{label}</span>
            {helperText && <span className="text-slate-400 font-normal">{helperText}</span>}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={`w-full text-xs bg-white border rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-hidden ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
          } ${className}`}
          {...props}
        />
        {error && <span className="text-[11px] text-red-600 font-medium">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

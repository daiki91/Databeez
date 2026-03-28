import React from 'react';
import { AlertCircle } from 'lucide-react';

export const Input = React.forwardRef(({
  error,
  label,
  helperText,
  className = '',
  as = 'input',
  ...props
}, ref) => {
  const Component = as;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <Component
        ref={ref}
        className={`w-full px-4 py-2 bg-white dark:bg-slate-800 border rounded-lg 
          text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          dark:focus:ring-offset-slate-900 disabled:bg-slate-50 dark:disabled:bg-slate-800
          disabled:cursor-not-allowed transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700'}
          ${className}`}
        {...props}
      />
      {error && (
        <div className="flex items-center gap-1 mt-2 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error.message}</span>
        </div>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

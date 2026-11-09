import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-neutral-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl border px-4 py-3 text-sm bg-white/[0.05] text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 transition-all backdrop-blur-md',
            error
              ? 'border-rose-500/80 focus:ring-rose-500/50'
              : 'border-white/10 focus:border-white/30 focus:ring-indigo-500/40',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-400">{error}</p>}
        {helperText && !error && <p className="text-xs text-neutral-400">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

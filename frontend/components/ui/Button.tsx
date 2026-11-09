import React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-white text-black hover:bg-neutral-100 shadow-[0_0_25px_rgba(255,255,255,0.2)] font-semibold',
  secondary: 'bg-white/[0.08] text-white border border-white/20 hover:bg-white/[0.14] backdrop-blur-md',
  outline: 'bg-transparent text-white border border-white/20 hover:bg-white/[0.08] backdrop-blur-md',
  ghost: 'bg-transparent text-neutral-300 hover:text-white hover:bg-white/[0.08]',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-md',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-1.5 text-xs rounded-xl',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-8 py-3.5 text-base rounded-full',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading...
          </span>
        ) : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

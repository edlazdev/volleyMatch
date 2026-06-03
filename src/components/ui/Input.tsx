import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 transition-colors',
        'placeholder:text-slate-400',
        'focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500',
        'dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500',
        invalid
          ? 'border-rose-400 dark:border-rose-700'
          : 'border-slate-200 dark:border-slate-700',
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = 'Input';

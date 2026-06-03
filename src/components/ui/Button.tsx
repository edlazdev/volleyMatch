import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-soft focus-visible:ring-brand-500',
  secondary:
    'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 focus-visible:ring-slate-400',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-slate-400',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-soft focus-visible:ring-rose-500',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', fullWidth, className, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-semibold transition-all',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'active:scale-[0.98]',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = 'Button';

import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
  /** Clases de superficie (borde/fondo/texto) que reemplazan las por defecto. */
  accentClass?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, accentClass, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'h-11 w-full appearance-none rounded-xl border pl-3.5 pr-10 text-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/40',
          accentClass
            ? accentClass
            : cn(
                'bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100',
                invalid
                  ? 'border-rose-400 dark:border-rose-700'
                  : 'border-slate-200 dark:border-slate-700',
              ),
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden
      />
    </div>
  ),
);

Select.displayName = 'Select';

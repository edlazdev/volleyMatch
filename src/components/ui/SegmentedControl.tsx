import { cn } from '@/utils/cn';

interface Option<T extends string | number> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string | number> {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  className?: string;
}

/** Control segmentado accesible para elegir entre opciones discretas. */
export function SegmentedControl<T extends string | number>({
  value,
  options,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex w-full gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800',
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all',
              active
                ? 'bg-white text-brand-700 shadow-soft dark:bg-slate-950 dark:text-brand-300'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

import { cn } from '@/utils/cn';

interface ProgressBarProps {
  value: number;
  max: number;
  /** Tono según estado (ok = en objetivo, warn = fuera de objetivo). */
  tone?: 'brand' | 'ok' | 'warn';
  className?: string;
}

const TONES: Record<NonNullable<ProgressBarProps['tone']>, string> = {
  brand: 'bg-brand-500',
  ok: 'bg-emerald-500',
  warn: 'bg-amber-500',
};

export function ProgressBar({
  value,
  max,
  tone = 'brand',
  className,
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div
      className={cn(
        'h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800',
        className,
      )}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-500', TONES[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

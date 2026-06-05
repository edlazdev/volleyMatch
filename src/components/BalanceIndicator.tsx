import { CheckCircle2, Scale } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import { useI18n } from '@/i18n';

interface BalanceIndicatorProps {
  /** Diferencia de nivel total entre el equipo más fuerte y el más débil. */
  spread: number;
}

/** Clasifica el equilibrio según el spread de nivel total. */
function classify(spread: number): {
  labelKey: string;
  tone: string;
  bar: string;
  pct: number;
} {
  if (spread <= 1)
    return {
      labelKey: 'balance.excellent',
      tone: 'text-emerald-600 dark:text-emerald-400',
      bar: 'bg-emerald-500',
      pct: 100,
    };
  if (spread <= 3)
    return {
      labelKey: 'balance.good',
      tone: 'text-brand-600 dark:text-brand-400',
      bar: 'bg-brand-500',
      pct: 70,
    };
  if (spread <= 5)
    return {
      labelKey: 'balance.moderate',
      tone: 'text-amber-600 dark:text-amber-400',
      bar: 'bg-amber-500',
      pct: 45,
    };
  return {
    labelKey: 'balance.unbalanced',
    tone: 'text-rose-600 dark:text-rose-400',
    bar: 'bg-rose-500',
    pct: 20,
  };
}

export function BalanceIndicator({ spread }: BalanceIndicatorProps) {
  const { t } = useI18n();
  const status = classify(spread);
  const perfect = spread === 0;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800',
              status.tone,
            )}
          >
            {perfect ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Scale className="h-5 w-5" />
            )}
          </div>
          <div>
            <p className={cn('text-sm font-bold', status.tone)}>
              {perfect ? t('balance.perfect') : t(status.labelKey)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('balance.diff')}{' '}
              <span className="font-semibold">{spread}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className={cn('h-full rounded-full transition-all duration-500', status.bar)}
          style={{ width: `${perfect ? 100 : status.pct}%` }}
        />
      </div>
    </Card>
  );
}

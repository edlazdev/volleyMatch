import { Minus, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  /** Sufijo opcional junto al número (p. ej. "equipos"). */
  suffix?: string;
  className?: string;
}

/** Selector numérico con botones − / + para rangos amplios. */
export function Stepper({
  value,
  min,
  max,
  onChange,
  suffix,
  className,
}: StepperProps) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-xl bg-slate-100 p-1 dark:bg-slate-800',
        className,
      )}
    >
      <StepButton ariaLabel="Quitar uno" onClick={dec} disabled={value <= min}>
        <Minus className="h-5 w-5" />
      </StepButton>

      <div className="flex items-baseline gap-1.5 px-2">
        <span className="text-2xl font-extrabold tabular-nums text-slate-800 dark:text-slate-100">
          {value}
        </span>
        {suffix && (
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {suffix}
          </span>
        )}
      </div>

      <StepButton ariaLabel="Agregar uno" onClick={inc} disabled={value >= max}>
        <Plus className="h-5 w-5" />
      </StepButton>
    </div>
  );
}

function StepButton({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-slate-700 shadow-soft transition-all hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {children}
    </button>
  );
}

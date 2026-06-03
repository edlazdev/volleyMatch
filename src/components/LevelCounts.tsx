import { useMemo } from 'react';
import type { Player, PlayerLevel } from '@/types';
import { LEVELS, chicks } from '@/data/levels';
import { cn } from '@/utils/cn';

interface LevelCountsProps {
  players: Player[];
  /** Nivel actualmente seleccionado como filtro (null = todos). */
  selected?: PlayerLevel | null;
  /** Alterna el filtro al hacer clic en una tarjeta. */
  onSelect?: (level: PlayerLevel) => void;
}

/**
 * Tarjetas con la cantidad de jugadores en cada nivel.
 * Si se pasa `onSelect`, las tarjetas funcionan como filtro (toggle).
 */
export function LevelCounts({ players, selected, onSelect }: LevelCountsProps) {
  const counts = useMemo(() => {
    const map = new Map<PlayerLevel, number>();
    for (const lvl of LEVELS) map.set(lvl.value, 0);
    for (const p of players) map.set(p.level, (map.get(p.level) ?? 0) + 1);
    return map;
  }, [players]);

  const interactive = typeof onSelect === 'function';

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {LEVELS.map((lvl) => {
        const count = counts.get(lvl.value) ?? 0;
        const empty = count === 0;
        const active = selected === lvl.value;

        return (
          <button
            key={lvl.value}
            type="button"
            disabled={interactive && empty}
            aria-pressed={active}
            onClick={interactive ? () => onSelect!(lvl.value) : undefined}
            className={cn(
              'flex flex-col items-center rounded-xl border p-2 text-center transition-all',
              interactive && !empty && 'cursor-pointer hover:border-brand-300 dark:hover:border-brand-700',
              !interactive && 'cursor-default',
              active
                ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/30 dark:border-brand-500 dark:bg-brand-950/40'
                : empty
                  ? 'border-slate-200 bg-slate-50 opacity-60 dark:border-slate-800 dark:bg-slate-900'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
            )}
            title={
              interactive
                ? `Filtrar por ${lvl.label}`
                : lvl.label
            }
          >
            <span
              className={cn(
                'inline-flex max-w-full flex-wrap items-center justify-center gap-0 rounded-full px-1.5 py-0.5 text-[11px] leading-none',
                lvl.badgeClass,
              )}
              title={`Nivel ${lvl.value}`}
            >
              {chicks(lvl.value)}
            </span>
            <span className="mt-1 text-lg font-extrabold leading-none tabular-nums text-slate-800 dark:text-slate-100">
              {count}
            </span>
            <span className="mt-0.5 truncate text-[10px] font-medium text-slate-400 dark:text-slate-500">
              {lvl.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

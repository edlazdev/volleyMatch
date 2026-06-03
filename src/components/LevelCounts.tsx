import { useMemo } from 'react';
import type { Player, PlayerLevel } from '@/types';
import { LEVELS } from '@/data/levels';
import { cn } from '@/utils/cn';

interface LevelCountsProps {
  players: Player[];
}

/** Tarjetas con la cantidad de jugadores en cada nivel. */
export function LevelCounts({ players }: LevelCountsProps) {
  const counts = useMemo(() => {
    const map = new Map<PlayerLevel, number>();
    for (const lvl of LEVELS) map.set(lvl.value, 0);
    for (const p of players) map.set(p.level, (map.get(p.level) ?? 0) + 1);
    return map;
  }, [players]);

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {LEVELS.map((lvl) => {
        const count = counts.get(lvl.value) ?? 0;
        const empty = count === 0;
        return (
          <div
            key={lvl.value}
            className={cn(
              'flex flex-col items-center rounded-xl border p-2 text-center transition-all',
              empty
                ? 'border-slate-200 bg-slate-50 opacity-60 dark:border-slate-800 dark:bg-slate-900'
                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
            )}
            title={lvl.label}
          >
            <span
              className={cn(
                'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                lvl.badgeClass,
              )}
            >
              {lvl.value}
            </span>
            <span className="mt-1 text-lg font-extrabold leading-none tabular-nums text-slate-800 dark:text-slate-100">
              {count}
            </span>
            <span className="mt-0.5 truncate text-[10px] font-medium text-slate-400 dark:text-slate-500">
              {lvl.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

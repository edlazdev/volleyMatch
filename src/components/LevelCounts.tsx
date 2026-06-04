import { useMemo } from 'react';
import type { Player, PlayerLevel } from '@/types';
import {
  LEVELS,
  LEVEL_ACTIVE_CARD_CLASS,
  LEVEL_SOFT_CARD_CLASS,
  levelCode,
} from '@/data/levels';
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
              interactive && !empty && 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-600',
              !interactive && 'cursor-default',
              active
                ? LEVEL_ACTIVE_CARD_CLASS[lvl.value]
                : empty
                  ? 'border-slate-200 bg-slate-50 opacity-50 dark:border-slate-800 dark:bg-slate-900'
                  : LEVEL_SOFT_CARD_CLASS[lvl.value],
            )}
            title={
              interactive
                ? `Nivel ${levelCode(lvl.value)} · ${lvl.label} (filtrar)`
                : `Nivel ${levelCode(lvl.value)} · ${lvl.label}`
            }
          >
            <span
              className={cn(
                'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold leading-none',
                lvl.badgeClass,
              )}
              title={`Nivel ${levelCode(lvl.value)} · ${lvl.label}`}
            >
              {levelCode(lvl.value)}
            </span>
            <span className="mt-1 text-lg font-extrabold leading-none tabular-nums text-slate-800 dark:text-slate-100">
              {count}
            </span>
            <span className="mt-0.5 truncate text-[10px] font-medium leading-tight text-slate-500 dark:text-slate-400">
              {levelCode(lvl.value)} · {lvl.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

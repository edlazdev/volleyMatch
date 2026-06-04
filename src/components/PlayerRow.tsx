import { ArrowLeftRight } from 'lucide-react';
import type { Player } from '@/types';
import { LevelBadge } from '@/components/ui/LevelBadge';

interface PlayerRowProps {
  player: Player;
  /** Abre el modal de cambio/mover para este jugador. */
  onSwap?: () => void;
}

/** Fila de jugador dentro de un equipo (con botón de cambio). */
export function PlayerRow({ player, onSwap }: PlayerRowProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm dark:border-slate-700 dark:bg-slate-950">
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
        {player.name}
      </span>
      <LevelBadge level={player.level} />
      {onSwap && (
        <button
          type="button"
          onClick={onSwap}
          aria-label={`Cambiar a ${player.name}`}
          title="Cambiar o mover este jugador"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40 dark:hover:text-brand-300"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

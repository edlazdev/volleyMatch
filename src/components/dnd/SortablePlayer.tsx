import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowLeftRight, GripVertical } from 'lucide-react';
import type { Player } from '@/types';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { cn } from '@/utils/cn';

interface SortablePlayerProps {
  player: Player;
  teamId: string;
  /** Abre el modal para intercambiar este jugador. */
  onSwap?: () => void;
}

/**
 * Jugador dentro de un equipo. El arrastre se inicia solo desde el ícono de
 * agarre (handle); el resto de la fila no dispara drag para no interferir con
 * el botón de cambio.
 */
export function SortablePlayer({ player, teamId, onSwap }: SortablePlayerProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: player.id,
    data: { type: 'player', playerId: player.id, teamId },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-1.5 rounded-xl border bg-white px-2 py-2.5 shadow-sm transition-shadow',
        'border-slate-200 dark:border-slate-700 dark:bg-slate-950',
        isDragging
          ? 'opacity-40'
          : 'hover:border-brand-300 hover:shadow-soft dark:hover:border-brand-700',
      )}
    >
      {/* Handle de arrastre (opcional, secundario) */}
      <button
        type="button"
        aria-label="Arrastrar"
        className="dnd-touch-none -ml-1 flex h-7 w-5 shrink-0 cursor-grab touch-none items-center justify-center text-slate-300 active:cursor-grabbing dark:text-slate-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <span className="flex-1 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
        {player.name}
      </span>

      <LevelBadge level={player.level} />

      {onSwap && (
        <button
          type="button"
          onClick={onSwap}
          aria-label={`Cambiar a ${player.name}`}
          title="Cambiar por otro jugador"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40 dark:hover:text-brand-300"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { Player } from '@/types';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { cn } from '@/utils/cn';

interface SortablePlayerProps {
  player: Player;
  teamId: string;
}

/** Jugador arrastrable dentro de un equipo (sortable + transferible). */
export function SortablePlayer({ player, teamId }: SortablePlayerProps) {
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
      {...attributes}
      {...listeners}
      className={cn(
        'dnd-touch-none flex cursor-grab items-center gap-2 rounded-xl border bg-white px-3 py-2.5 shadow-sm transition-shadow active:cursor-grabbing',
        'border-slate-200 dark:border-slate-700 dark:bg-slate-950',
        isDragging
          ? 'opacity-40'
          : 'hover:border-brand-300 hover:shadow-soft dark:hover:border-brand-700',
      )}
    >
      <GripVertical className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
      <span className="flex-1 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
        {player.name}
      </span>
      <LevelBadge level={player.level} />
    </div>
  );
}

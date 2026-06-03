import { GripVertical } from 'lucide-react';
import type { Player } from '@/types';
import { LevelBadge } from '@/components/ui/LevelBadge';

/** Representación visual del jugador mientras se arrastra. */
export function PlayerDragOverlay({ player }: { player: Player }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-brand-300 bg-white px-3 py-2.5 shadow-glow dark:border-brand-600 dark:bg-slate-900">
      <GripVertical className="h-4 w-4 shrink-0 text-brand-400" />
      <span className="flex-1 truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
        {player.name}
      </span>
      <LevelBadge level={player.level} />
    </div>
  );
}

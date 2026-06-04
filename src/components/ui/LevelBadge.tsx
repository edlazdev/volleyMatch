import type { PlayerLevel } from '@/types';
import { getLevel, levelCode } from '@/data/levels';
import { cn } from '@/utils/cn';

interface LevelBadgeProps {
  level: PlayerLevel;
  /** Muestra el nombre del nivel además del número. */
  showLabel?: boolean;
  className?: string;
}

export function LevelBadge({
  level,
  showLabel = false,
  className,
}: LevelBadgeProps) {
  const def = getLevel(level);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
        def.badgeClass,
        className,
      )}
      title={`Nivel ${levelCode(level)} · ${def.label}`}
      aria-label={`Nivel ${levelCode(level)}: ${def.label}`}
    >
      <span className="font-bold leading-none">{levelCode(level)}</span>
      {showLabel && <span className="hidden sm:inline">· {def.label}</span>}
    </span>
  );
}

import type { PlayerLevel } from '@/types';
import { getLevel, levelCode } from '@/data/levels';
import { cn } from '@/utils/cn';
import { useI18n } from '@/i18n';

interface LevelBadgeProps {
  level: PlayerLevel;
  /** Muestra el nombre del nivel además de la letra. */
  showLabel?: boolean;
  className?: string;
}

export function LevelBadge({
  level,
  showLabel = false,
  className,
}: LevelBadgeProps) {
  const { t } = useI18n();
  const def = getLevel(level);
  const label = t(`level.${level}`);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
        def.badgeClass,
        className,
      )}
      title={t('level.tooltip', { code: levelCode(level), label })}
      aria-label={t('level.tooltip', { code: levelCode(level), label })}
    >
      <span className="font-bold leading-none">{levelCode(level)}</span>
      {showLabel && <span className="hidden sm:inline">· {label}</span>}
    </span>
  );
}

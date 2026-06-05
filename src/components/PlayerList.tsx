import { Trash2, Users } from 'lucide-react';
import type { Player, PlayerLevel } from '@/types';
import { LEVELS, LEVEL_SELECT_CLASS, levelCode } from '@/data/levels';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { useI18n } from '@/i18n';

interface PlayerListProps {
  players: Player[];
  onRemove: (id: string) => void;
  onChangeLevel: (id: string, level: PlayerLevel) => void;
}

export function PlayerList({
  players,
  onRemove,
  onChangeLevel,
}: PlayerListProps) {
  const { t } = useI18n();
  if (players.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={t('list.empty.title')}
        description={t('list.empty.desc')}
      />
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-x-4">
      {players.map((player, index) => (
        <li
          key={player.id}
          className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2 animate-fade-in dark:border-slate-800"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {index + 1}
          </span>

          <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
            {player.name}
          </span>

          <div className="w-20 shrink-0">
            <Select
              value={player.level}
              onChange={(e) =>
                onChangeLevel(player.id, Number(e.target.value) as PlayerLevel)
              }
              title={t(`level.${player.level}`)}
              accentClass={LEVEL_SELECT_CLASS[player.level]}
              className="h-9 text-xs font-semibold"
            >
              {LEVELS.map((lvl) => (
                <option
                  key={lvl.value}
                  value={lvl.value}
                  title={t(`level.${lvl.value}`)}
                >
                  {levelCode(lvl.value)}
                </option>
              ))}
            </Select>
          </div>

          <button
            onClick={() => onRemove(player.id)}
            aria-label={t('list.remove', { name: player.name })}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}

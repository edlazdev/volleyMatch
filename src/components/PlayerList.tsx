import { Trash2, Users } from 'lucide-react';
import type { Player, PlayerLevel } from '@/types';
import { LEVELS, LEVEL_SELECT_CLASS, chicks, getLevel } from '@/data/levels';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';

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
  if (players.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Aún no hay jugadores"
        description="Agrega participantes con el formulario de arriba para empezar."
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

          <div className="w-40 shrink-0">
            <Select
              value={player.level}
              onChange={(e) =>
                onChangeLevel(player.id, Number(e.target.value) as PlayerLevel)
              }
              title={getLevel(player.level).label}
              accentClass={LEVEL_SELECT_CLASS[player.level]}
              className="h-9 text-xs font-semibold"
            >
              {LEVELS.map((lvl) => (
                <option key={lvl.value} value={lvl.value} title={lvl.label}>
                  {chicks(lvl.value)}
                </option>
              ))}
            </Select>
          </div>

          <button
            onClick={() => onRemove(player.id)}
            aria-label={`Eliminar a ${player.name}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}

import { Pencil, Sigma, TrendingUp, Users } from 'lucide-react';
import type { Player, Team, TeamMetrics } from '@/types';
import { PlayerRow } from '@/components/PlayerRow';
import { PLAYERS_PER_TEAM } from '@/data/levels';
import { cn } from '@/utils/cn';
import { useI18n } from '@/i18n';

interface TeamCardProps {
  team: Team;
  players: Player[];
  metrics: TeamMetrics;
  /** Color de acento asignado por índice de equipo. */
  accentIndex: number;
  /** Marca el equipo más fuerte / más débil para el indicador de balance. */
  highlight?: 'strong' | 'weak' | null;
  /** Renombra el equipo. */
  onRename?: (name: string) => void;
  /** Abre el modal de cambio para un jugador. */
  onSwapPlayer?: (player: Player) => void;
  /** Jugadores por equipo (para el cupo). */
  teamSize?: number;
}

const ACCENTS = [
  'from-brand-500 to-sky-500',
  'from-violet-500 to-fuchsia-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-fuchsia-500 to-purple-500',
  'from-lime-500 to-green-500',
];

export function TeamCard({
  team,
  players,
  metrics,
  accentIndex,
  highlight,
  onRename,
  onSwapPlayer,
  teamSize = PLAYERS_PER_TEAM,
}: TeamCardProps) {
  const { t, tn } = useI18n();
  const accent = ACCENTS[accentIndex % ACCENTS.length];
  const isFull = team.playerIds.length >= teamSize;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition-all dark:border-slate-800 dark:bg-slate-900">
      {/* Cabecera con acento de color */}
      <div className={cn('bg-gradient-to-r px-4 py-3 text-white', accent)}>
        <div className="flex items-center gap-2">
          {onRename ? (
            <label className="group flex min-w-0 flex-1 items-center gap-1.5">
              <input
                value={team.name}
                onChange={(e) => onRename(e.target.value)}
                maxLength={24}
                aria-label={t('team.name')}
                placeholder={t('team.name')}
                className="min-w-0 flex-1 truncate rounded-md bg-transparent px-1 py-0.5 text-base font-extrabold tracking-tight text-white outline-none placeholder:text-white/60 hover:bg-white/10 focus:bg-white/15"
              />
              <Pencil className="h-3.5 w-3.5 shrink-0 text-white/50 transition-colors group-hover:text-white/80" />
            </label>
          ) : (
            <h3 className="min-w-0 flex-1 truncate text-base font-extrabold tracking-tight">
              {team.name}
            </h3>
          )}
          {highlight && (
            <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide backdrop-blur">
              {highlight === 'strong' ? t('team.strong') : t('team.weak')}
            </span>
          )}
        </div>

        {/* Métricas */}
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          <Metric icon={TrendingUp} label={t('team.avg')} value={metrics.teamAverageLevel.toFixed(1)} />
          <Metric icon={Sigma} label={t('team.total')} value={String(metrics.teamTotalLevel)} />
          <Metric
            icon={Users}
            label={t('team.players')}
            value={`${metrics.teamPlayerCount}/${teamSize}`}
          />
        </div>
      </div>

      {/* Lista de jugadores */}
      <div
        className={cn(
          'flex flex-1 flex-col gap-2 p-3',
          team.playerIds.length === 0 &&
            'items-center justify-center text-center',
        )}
      >
        {players.length === 0 ? (
          <p className="py-6 text-xs text-slate-400 dark:text-slate-500">
            {t('team.noPlayers')}
          </p>
        ) : (
          players.map((player) => (
            <PlayerRow
              key={player.id}
              player={player}
              onSwap={onSwapPlayer ? () => onSwapPlayer(player) : undefined}
            />
          ))
        )}

        {!isFull && players.length > 0 && (
          <p className="pt-1 text-center text-[11px] text-slate-400 dark:text-slate-500">
            {tn(teamSize - players.length, 'team.freeSlots', {
              n: teamSize - players.length,
            })}
          </p>
        )}
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-white/15 px-1 py-1.5 backdrop-blur">
      <div className="flex items-center justify-center gap-1 text-[10px] font-medium uppercase tracking-wide text-white/80">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p className="text-lg font-extrabold leading-tight">{value}</p>
    </div>
  );
}

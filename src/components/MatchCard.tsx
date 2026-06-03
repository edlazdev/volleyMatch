import type { Match, Team, TeamMetrics } from '@/types';
import { cn } from '@/utils/cn';

interface MatchCardProps {
  match: Match;
  teamsById: Map<string, Team>;
  metricsByTeam: Map<string, TeamMetrics>;
  accentByTeam: Map<string, number>;
}

const DOT_ACCENTS = [
  'bg-brand-500',
  'bg-violet-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
];

export function MatchCard({
  match,
  teamsById,
  metricsByTeam,
  accentByTeam,
}: MatchCardProps) {
  const home = teamsById.get(match.homeTeamId);
  const away = teamsById.get(match.awayTeamId);
  if (!home || !away) return null;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft transition-all hover:shadow-glow dark:border-slate-800 dark:bg-slate-900">
      <span className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:flex">
        {match.round}
      </span>

      <TeamSide
        team={home}
        avg={metricsByTeam.get(home.id)?.teamAverageLevel ?? 0}
        accent={accentByTeam.get(home.id) ?? 0}
        align="end"
      />

      <div className="flex shrink-0 flex-col items-center">
        <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-white dark:bg-white dark:text-slate-900">
          VS
        </span>
      </div>

      <TeamSide
        team={away}
        avg={metricsByTeam.get(away.id)?.teamAverageLevel ?? 0}
        accent={accentByTeam.get(away.id) ?? 0}
        align="start"
      />
    </div>
  );
}

function TeamSide({
  team,
  avg,
  accent,
  align,
}: {
  team: Team;
  avg: number;
  accent: number;
  align: 'start' | 'end';
}) {
  return (
    <div
      className={cn(
        'flex flex-1 items-center gap-2',
        align === 'end' ? 'justify-end text-right' : 'justify-start text-left',
      )}
    >
      {align === 'start' && (
        <span className={cn('h-3 w-3 shrink-0 rounded-full', DOT_ACCENTS[accent % DOT_ACCENTS.length])} />
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
          {team.name}
        </p>
        <p className="text-xs text-slate-400">Prom. {avg.toFixed(1)}</p>
      </div>
      {align === 'end' && (
        <span className={cn('h-3 w-3 shrink-0 rounded-full', DOT_ACCENTS[accent % DOT_ACCENTS.length])} />
      )}
    </div>
  );
}

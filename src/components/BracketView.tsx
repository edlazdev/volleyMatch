import { useMemo } from 'react';
import { RefreshCw, Trophy } from 'lucide-react';
import type { BracketMatch, Team } from '@/types';
import { bracketChampion, matchWinner, roundTitle } from '@/utils/bracket';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

interface BracketViewProps {
  bracket: BracketMatch[];
  teamsById: Map<string, Team>;
  accentByTeam: Map<string, number>;
  onPick: (matchId: string, teamId: string) => void;
  onRegenerate: () => void;
}

const DOTS = [
  'bg-brand-500',
  'bg-violet-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-sky-500',
  'bg-fuchsia-500',
  'bg-teal-500',
];

export function BracketView({
  bracket,
  teamsById,
  accentByTeam,
  onPick,
  onRegenerate,
}: BracketViewProps) {
  const rounds = useMemo(() => {
    const map = new Map<number, BracketMatch[]>();
    for (const m of bracket) {
      const arr = map.get(m.round);
      if (arr) arr.push(m);
      else map.set(m.round, [m]);
    }
    return [...map.entries()]
      .sort(([a], [b]) => a - b)
      .map(([round, matches]) => ({
        round,
        matches: matches.sort((a, b) => a.index - b.index),
      }));
  }, [bracket]);

  const champion = bracketChampion(bracket);
  const championTeam = champion ? teamsById.get(champion) : null;

  if (bracket.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Toca al ganador de cada partido para avanzarlo hasta la final. Los
          equipos están sembrados por nivel.
        </p>
        <Button variant="secondary" size="sm" onClick={onRegenerate}>
          <RefreshCw className="h-4 w-4" />
          Regenerar
        </Button>
      </div>

      <div className="overflow-x-auto pb-2 no-scrollbar">
        <div className="flex min-w-max items-stretch gap-4 md:gap-6">
          {rounds.map(({ round, matches }) => (
            <div key={round} className="flex min-w-[210px] flex-col">
              <h4 className="mb-2 text-center text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {roundTitle(matches.length * 2)}
              </h4>
              <div className="flex flex-1 flex-col justify-around gap-3">
                {matches.map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    teamsById={teamsById}
                    accentByTeam={accentByTeam}
                    onPick={onPick}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Columna del campeón */}
          <div className="flex min-w-[200px] flex-col">
            <h4 className="mb-2 text-center text-xs font-bold uppercase tracking-wide text-amber-500">
              Campeón
            </h4>
            <div className="flex flex-1 items-center justify-center">
              <ChampionCard name={championTeam?.name ?? null} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchCard({
  match,
  teamsById,
  accentByTeam,
  onPick,
}: {
  match: BracketMatch;
  teamsById: Map<string, Team>;
  accentByTeam: Map<string, number>;
  onPick: (matchId: string, teamId: string) => void;
}) {
  const winner = matchWinner(match);
  const ready = !!match.teamAId && !!match.teamBId;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <Slot
        teamId={match.teamAId}
        teamsById={teamsById}
        accentByTeam={accentByTeam}
        isWinner={!!winner && winner === match.teamAId}
        isLoser={!!winner && winner !== match.teamAId && !!match.teamAId}
        clickable={ready}
        onClick={() => match.teamAId && onPick(match.id, match.teamAId)}
      />
      <div className="h-px bg-slate-100 dark:bg-slate-800" />
      <Slot
        teamId={match.teamBId}
        teamsById={teamsById}
        accentByTeam={accentByTeam}
        isWinner={!!winner && winner === match.teamBId}
        isLoser={!!winner && winner !== match.teamBId && !!match.teamBId}
        clickable={ready}
        onClick={() => match.teamBId && onPick(match.id, match.teamBId)}
      />
    </div>
  );
}

function Slot({
  teamId,
  teamsById,
  accentByTeam,
  isWinner,
  isLoser,
  clickable,
  onClick,
}: {
  teamId: string | null;
  teamsById: Map<string, Team>;
  accentByTeam: Map<string, number>;
  isWinner: boolean;
  isLoser: boolean;
  clickable: boolean;
  onClick: () => void;
}) {
  const team = teamId ? teamsById.get(teamId) : null;
  const accent = teamId ? accentByTeam.get(teamId) ?? 0 : 0;

  return (
    <button
      type="button"
      disabled={!clickable || !team}
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors',
        clickable && team && 'hover:bg-slate-50 dark:hover:bg-slate-800',
        isWinner &&
          'bg-emerald-50 font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
        isLoser && 'text-slate-400 line-through dark:text-slate-600',
        !team && 'cursor-default text-slate-300 dark:text-slate-600',
      )}
    >
      <span
        className={cn(
          'h-2.5 w-2.5 shrink-0 rounded-full',
          team ? DOTS[accent % DOTS.length] : 'bg-slate-200 dark:bg-slate-700',
        )}
      />
      <span className="flex-1 truncate">{team?.name ?? 'Por definir'}</span>
      {isWinner && <Trophy className="h-3.5 w-3.5 shrink-0 text-emerald-500" />}
    </button>
  );
}

function ChampionCard({ name }: { name: string | null }) {
  const crowned = !!name;
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all',
        crowned
          ? 'border-amber-400 bg-gradient-to-b from-amber-50 to-white shadow-glow dark:from-amber-950/40 dark:to-slate-900'
          : 'border-dashed border-slate-300 dark:border-slate-700',
      )}
    >
      <div
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full',
          crowned
            ? 'bg-amber-400 text-white shadow-glow'
            : 'bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-600',
        )}
      >
        <Trophy className="h-7 w-7" />
      </div>
      {crowned ? (
        <>
          <p className="text-[11px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
            ¡Campeón!
          </p>
          <p className="text-base font-extrabold leading-tight text-slate-800 dark:text-slate-100">
            {name}
          </p>
        </>
      ) : (
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Campeón por definir
        </p>
      )}
    </div>
  );
}

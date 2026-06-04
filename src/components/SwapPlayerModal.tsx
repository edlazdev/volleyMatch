import { useMemo } from 'react';
import { ArrowLeftRight, Sparkles } from 'lucide-react';
import type { Player, Team } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { cn } from '@/utils/cn';

interface SwapPlayerModalProps {
  open: boolean;
  /** Jugador origen que se quiere cambiar. */
  source: Player | null;
  teams: Team[];
  playersById: Map<string, Player>;
  onSwap: (targetId: string) => void;
  onClose: () => void;
}

interface Candidate {
  player: Player;
  teamName: string;
  gap: number;
}

export function SwapPlayerModal({
  open,
  source,
  teams,
  playersById,
  onSwap,
  onClose,
}: SwapPlayerModalProps) {
  const sourceTeamId = useMemo(() => {
    if (!source) return null;
    return teams.find((t) => t.playerIds.includes(source.id))?.id ?? null;
  }, [teams, source]);

  // Candidatos: jugadores de OTROS equipos. Primero el mismo nivel, luego el
  // resto ordenado por cercanía de nivel y nombre.
  const { sameLevel, others } = useMemo(() => {
    const same: Candidate[] = [];
    const rest: Candidate[] = [];
    if (!source) return { sameLevel: same, others: rest };

    for (const team of teams) {
      if (team.id === sourceTeamId) continue;
      for (const id of team.playerIds) {
        const player = playersById.get(id);
        if (!player) continue;
        const cand: Candidate = {
          player,
          teamName: team.name,
          gap: Math.abs(player.level - source.level),
        };
        if (player.level === source.level) same.push(cand);
        else rest.push(cand);
      }
    }
    same.sort((a, b) => a.player.name.localeCompare(b.player.name));
    rest.sort((a, b) => a.gap - b.gap || a.player.name.localeCompare(b.player.name));
    return { sameLevel: same, others: rest };
  }, [teams, source, sourceTeamId, playersById]);

  return (
    <Modal
      open={open && !!source}
      title="Cambiar jugador"
      onClose={onClose}
    >
      {source && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/60">
            <ArrowLeftRight className="h-4 w-4 shrink-0 text-brand-500" />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Intercambiar a{' '}
              <span className="font-bold text-slate-900 dark:text-slate-50">
                {source.name}
              </span>{' '}
              por…
            </span>
            <LevelBadge level={source.level} className="ml-auto" />
          </div>

          {sameLevel.length > 0 && (
            <Section
              icon
              title="Mismo nivel · recomendado"
              candidates={sameLevel}
              onPick={onSwap}
            />
          )}

          <Section
            title={sameLevel.length > 0 ? 'Otros jugadores' : 'Jugadores'}
            candidates={others}
            onPick={onSwap}
          />

          {sameLevel.length === 0 && others.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-400">
              No hay otros jugadores para intercambiar.
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}

function Section({
  title,
  candidates,
  onPick,
  icon,
}: {
  title: string;
  candidates: Candidate[];
  onPick: (id: string) => void;
  icon?: boolean;
}) {
  if (candidates.length === 0) return null;
  return (
    <div>
      <p
        className={cn(
          'mb-2 flex items-center gap-1.5 text-xs font-semibold',
          icon
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-slate-500 dark:text-slate-400',
        )}
      >
        {icon && <Sparkles className="h-3.5 w-3.5" />}
        {title}
      </p>
      <ul className="space-y-1.5">
        {candidates.map(({ player, teamName }) => (
          <li key={player.id}>
            <button
              onClick={() => onPick(player.id)}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left transition-all hover:border-brand-300 hover:bg-brand-50/50 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-brand-700 dark:hover:bg-brand-950/30"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                  {player.name}
                </span>
                <span className="block truncate text-xs text-slate-400">
                  {teamName}
                </span>
              </span>
              <LevelBadge level={player.level} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

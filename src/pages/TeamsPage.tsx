import { useMemo, useState } from 'react';
import { RefreshCw, RotateCcw, Swords, Users } from 'lucide-react';
import { useVolleyStore } from '@/store/useVolleyStore';
import { useTeamData } from '@/hooks/useTeamData';
import { TeamCard } from '@/components/TeamCard';
import { BalanceIndicator } from '@/components/BalanceIndicator';
import { SuggestionCard } from '@/components/SuggestionCard';
import { SwapPlayerModal } from '@/components/SwapPlayerModal';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export function TeamsPage() {
  const generateTeams = useVolleyStore((s) => s.generateTeams);
  const applySuggestion = useVolleyStore((s) => s.applySuggestion);
  const renameTeam = useVolleyStore((s) => s.renameTeam);
  const resetTeamNames = useVolleyStore((s) => s.resetTeamNames);
  const swapPlayers = useVolleyStore((s) => s.swapPlayers);
  const movePlayer = useVolleyStore((s) => s.movePlayer);
  const setScreen = useVolleyStore((s) => s.setScreen);

  const [swapSourceId, setSwapSourceId] = useState<string | null>(null);

  const teamSize = useVolleyStore((s) => s.teamSize);

  const { teams, playersById, metricsByTeam, spread, suggestions } =
    useTeamData();

  const teamsById = useMemo(
    () => new Map(teams.map((t) => [t.id, t])),
    [teams],
  );

  // Escala invertida: menor nivel total = equipo más fuerte.
  const { strongId, weakId } = useMemo(() => {
    const entries = [...metricsByTeam.values()];
    if (entries.length < 2) return { strongId: null, weakId: null };
    const sorted = [...entries].sort(
      (a, b) => a.teamTotalLevel - b.teamTotalLevel,
    );
    const top = sorted[0];
    const bottom = sorted[sorted.length - 1];
    if (top.teamTotalLevel === bottom.teamTotalLevel)
      return { strongId: null, weakId: null };
    return { strongId: top.teamId, weakId: bottom.teamId };
  }, [metricsByTeam]);

  if (teams.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Todavía no hay equipos"
        description="Vuelve a la configuración para registrar jugadores y generar equipos."
        action={
          <Button onClick={() => setScreen('config')}>Ir a configuración</Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold tracking-tight">
          Equipos generados
        </h2>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={resetTeamNames}>
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reiniciar nombres</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={generateTeams}>
            <RefreshCw className="h-4 w-4" />
            Regenerar
          </Button>
        </div>
      </div>

      <BalanceIndicator spread={spread} />

      <SuggestionCard
        suggestions={suggestions}
        teamsById={teamsById}
        onApply={applySuggestion}
      />

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Usa el botón de cambio de cada jugador para intercambiarlo o moverlo a
        otro equipo. Se sugieren primero los del mismo nivel.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team, index) => (
          <TeamCard
            key={team.id}
            team={team}
            players={team.playerIds
              .map((id) => playersById.get(id))
              .filter((p): p is NonNullable<typeof p> => Boolean(p))}
            metrics={
              metricsByTeam.get(team.id) ?? {
                teamId: team.id,
                teamPlayerCount: 0,
                teamTotalLevel: 0,
                teamAverageLevel: 0,
              }
            }
            accentIndex={index}
            highlight={
              team.id === strongId
                ? 'strong'
                : team.id === weakId
                  ? 'weak'
                  : null
            }
            onRename={(name) => renameTeam(team.id, name)}
            onSwapPlayer={(player) => setSwapSourceId(player.id)}
            teamSize={teamSize}
          />
        ))}
      </div>

      <div className="sticky bottom-4 z-20 pt-2">
        <Button
          fullWidth
          size="lg"
          onClick={() => setScreen('matches')}
          className="shadow-glow"
        >
          <Swords className="h-5 w-5" />
          Ver enfrentamientos
        </Button>
      </div>

      <SwapPlayerModal
        open={swapSourceId !== null}
        source={swapSourceId ? playersById.get(swapSourceId) ?? null : null}
        teams={teams}
        playersById={playersById}
        onSwap={(targetId) => {
          if (swapSourceId) swapPlayers(swapSourceId, targetId);
          setSwapSourceId(null);
        }}
        onMove={(teamId) => {
          if (swapSourceId) movePlayer(swapSourceId, teamId);
          setSwapSourceId(null);
        }}
        teamSize={teamSize}
        onClose={() => setSwapSourceId(null)}
      />
    </div>
  );
}

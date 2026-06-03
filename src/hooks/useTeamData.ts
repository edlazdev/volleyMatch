import { useMemo } from 'react';
import { useVolleyStore, maxPlayersFor } from '@/store/useVolleyStore';
import {
  calculateSpread,
  calculateTeamMetrics,
  getBalanceSuggestions,
  indexPlayers,
} from '@/utils/teamBalance';
import type { TeamMetrics } from '@/types';

/** Resultado de la validación de la configuración de jugadores. */
export interface RosterValidation {
  required: number;
  current: number;
  isValid: boolean;
  /** Positivo = faltan jugadores, negativo = sobran. */
  diff: number;
  message: string | null;
}

/** Hook con toda la información derivada de jugadores y equipos. */
export function useTeamData() {
  const players = useVolleyStore((s) => s.players);
  const teams = useVolleyStore((s) => s.teams);
  const teamCount = useVolleyStore((s) => s.teamCount);

  const playersById = useMemo(() => indexPlayers(players), [players]);

  const validation = useMemo<RosterValidation>(() => {
    const required = maxPlayersFor(teamCount);
    const current = players.length;
    const diff = required - current;
    const isValid = diff === 0;

    let message: string | null = null;
    if (diff > 0) {
      message = `Faltan ${diff} ${diff === 1 ? 'jugador' : 'jugadores'} para completar ${teamCount} equipos.`;
    } else if (diff < 0) {
      const extra = Math.abs(diff);
      message = `Sobran ${extra} ${extra === 1 ? 'jugador' : 'jugadores'}. El máximo es ${required}.`;
    }

    return { required, current, isValid, diff, message };
  }, [players.length, teamCount]);

  const metricsByTeam = useMemo<Map<string, TeamMetrics>>(() => {
    return new Map(
      teams.map((t) => [t.id, calculateTeamMetrics(t, playersById)]),
    );
  }, [teams, playersById]);

  const spread = useMemo(
    () => calculateSpread([...metricsByTeam.values()]),
    [metricsByTeam],
  );

  const suggestions = useMemo(
    () => getBalanceSuggestions(teams, players),
    [teams, players],
  );

  return {
    players,
    teams,
    teamCount,
    playersById,
    validation,
    metricsByTeam,
    spread,
    suggestions,
  };
}

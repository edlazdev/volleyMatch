import { useMemo } from 'react';
import { useVolleyStore, maxPlayersFor } from '@/store/useVolleyStore';
import { PLAYERS_PER_TEAM } from '@/data/levels';
import { useI18n } from '@/i18n';
import {
  calculateSpread,
  calculateTeamMetrics,
  getBalanceSuggestions,
  indexPlayers,
} from '@/utils/teamBalance';
import type { TeamMetrics } from '@/types';

/** Resultado de la validación de la configuración de jugadores. */
export interface RosterValidation {
  /** Cupo máximo (equipos × tamaño). */
  required: number;
  current: number;
  /** Se pueden generar equipos parejos. */
  isValid: boolean;
  /** Jugadores que quedarían por equipo (si es parejo). */
  perTeam: number;
  message: string | null;
}

/** Hook con toda la información derivada de jugadores y equipos. */
export function useTeamData() {
  const { t, tn } = useI18n();
  const players = useVolleyStore((s) => s.players);
  const teams = useVolleyStore((s) => s.teams);
  const teamCount = useVolleyStore((s) => s.teamCount);
  const teamSize = PLAYERS_PER_TEAM;

  const playersById = useMemo(() => indexPlayers(players), [players]);

  const validation = useMemo<RosterValidation>(() => {
    const required = maxPlayersFor(teamCount, teamSize); // cupo máximo
    const current = players.length;
    const perTeam = teamCount > 0 ? Math.floor(current / teamCount) : 0;

    const even = current > 0 && current % teamCount === 0;
    const withinCap = current <= required;
    const enough = current >= teamCount; // al menos 1 por equipo
    const isValid = even && withinCap && enough;

    let message: string | null = null;

    if (current === 0) {
      message = t('valid.addPlayers');
    } else if (!enough) {
      message = t('valid.needMin', { n: teamCount });
    } else if (!withinCap) {
      const extra = current - required;
      message = tn(extra, 'valid.overflow', {
        extra,
        max: required,
        size: teamSize,
      });
    } else if (!even) {
      const toRemove = current % teamCount;
      const toAdd = teamCount - toRemove;
      message = t('valid.uneven', {
        remove: toRemove,
        add: toAdd,
        teams: teamCount,
      });
    } else if (teamCount === 2) {
      message = t('valid.readyVs', { n: perTeam });
    } else {
      message = t('valid.readyPerTeam', { n: perTeam, teams: teamCount });
    }

    return { required, current, isValid, perTeam, message };
  }, [players.length, teamCount, teamSize, t, tn]);

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

import type { Match, Team } from '@/types';
import { createId } from './id';

/**
 * Genera todos los enfrentamientos (round robin de una sola vuelta).
 * Cada equipo se enfrenta una vez contra cada otro equipo.
 *
 * Ej. 3 equipos -> 3 partidos; 4 equipos -> 6 partidos.
 */
export function generateMatches(teams: Team[]): Match[] {
  const matches: Match[] = [];

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({
        id: createId(),
        round: matches.length + 1,
        homeTeamId: teams[i].id,
        awayTeamId: teams[j].id,
      });
    }
  }

  return matches;
}

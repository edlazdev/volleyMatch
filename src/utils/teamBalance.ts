import type {
  Player,
  PlayerLevel,
  SwapSuggestion,
  Team,
  TeamMetrics,
} from '@/types';
import { createId } from './id';

/**
 * Agrupa jugadores por nivel.
 * Devuelve un mapa nivel -> jugadores. La escala es invertida:
 * 1 = Competitivo (más fuerte) … 6 = Principiante. Por eso ordenamos de
 * menor a mayor número, de modo que la distribución arranque por los
 * jugadores más fuertes.
 */
export function groupPlayersByLevel(
  players: Player[],
): Map<PlayerLevel, Player[]> {
  const groups = new Map<PlayerLevel, Player[]>();

  for (const player of players) {
    const bucket = groups.get(player.level);
    if (bucket) {
      bucket.push(player);
    } else {
      groups.set(player.level, [player]);
    }
  }

  // Menor número = mayor nivel: ordenamos ascendente (los más fuertes primero).
  return new Map(
    [...groups.entries()].sort(([a], [b]) => a - b),
  );
}

/**
 * Mezcla aleatoriamente una lista de jugadores (Fisher–Yates).
 * Devuelve una nueva lista sin mutar la original.
 */
export function shufflePlayers<T>(players: T[]): T[] {
  const result = [...players];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Genera equipos equilibrados.
 *
 * Estrategia:
 *  1. Agrupar por nivel (de mayor a menor).
 *  2. Mezclar aleatoriamente cada grupo.
 *  3. Repartir de forma circular (serpentina) entre los equipos.
 *
 * El reparto en "serpentina" (alternando la dirección en cada nivel)
 * reduce el sesgo acumulado frente a un reparto circular puro,
 * logrando equipos con niveles totales muy parejos.
 */
export function generateTeams(
  players: Player[],
  teamCount: number,
): Team[] {
  const teams: Team[] = Array.from({ length: teamCount }, (_, index) => ({
    id: createId(),
    name: `Equipo ${index + 1}`,
    playerIds: [],
  }));

  if (teamCount <= 0) return teams;

  const grouped = groupPlayersByLevel(players);

  let direction = 1; // 1 = izquierda→derecha, -1 = derecha→izquierda
  let cursor = 0;

  for (const [, levelPlayers] of grouped) {
    const shuffled = shufflePlayers(levelPlayers);

    for (const player of shuffled) {
      teams[cursor].playerIds.push(player.id);
      cursor += direction;

      // Al llegar a un extremo, invertimos la dirección (serpentina).
      if (cursor >= teamCount) {
        cursor = teamCount - 1;
        direction = -1;
      } else if (cursor < 0) {
        cursor = 0;
        direction = 1;
      }
    }
  }

  return teams;
}

/** Calcula las métricas de un equipo. */
export function calculateTeamMetrics(
  team: Team,
  playersById: Map<string, Player>,
): TeamMetrics {
  const teamPlayerCount = team.playerIds.length;
  const teamTotalLevel = team.playerIds.reduce((sum, id) => {
    const player = playersById.get(id);
    return sum + (player ? player.level : 0);
  }, 0);

  return {
    teamId: team.id,
    teamPlayerCount,
    teamTotalLevel,
    teamAverageLevel:
      teamPlayerCount > 0 ? teamTotalLevel / teamPlayerCount : 0,
  };
}

/** Construye un índice id -> Player para búsquedas O(1). */
export function indexPlayers(players: Player[]): Map<string, Player> {
  return new Map(players.map((p) => [p.id, p]));
}

/**
 * Calcula el "spread": diferencia entre el nivel total más alto
 * y el más bajo entre todos los equipos. Cuanto menor, más equilibrio.
 */
export function calculateSpread(metrics: TeamMetrics[]): number {
  if (metrics.length === 0) return 0;
  const totals = metrics.map((m) => m.teamTotalLevel);
  return Math.max(...totals) - Math.min(...totals);
}

/**
 * Genera sugerencias de intercambio para reducir el desbalance.
 *
 * Evalúa todos los pares de jugadores entre el equipo más fuerte y el
 * más débil, y devuelve aquellos intercambios que reducen el spread,
 * ordenados por mayor mejora.
 */
export function getBalanceSuggestions(
  teams: Team[],
  players: Player[],
  maxSuggestions = 3,
): SwapSuggestion[] {
  if (teams.length < 2) return [];

  const playersById = indexPlayers(players);
  const metrics = teams.map((t) => calculateTeamMetrics(t, playersById));
  const currentSpread = calculateSpread(metrics);

  if (currentSpread === 0) return [];

  const totalsByTeam = new Map(
    metrics.map((m) => [m.teamId, m.teamTotalLevel]),
  );

  const suggestions: SwapSuggestion[] = [];

  // Comparamos todos los pares de equipos distintos.
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const teamA = teams[i];
      const teamB = teams[j];
      const totalA = totalsByTeam.get(teamA.id) ?? 0;
      const totalB = totalsByTeam.get(teamB.id) ?? 0;

      for (const idA of teamA.playerIds) {
        for (const idB of teamB.playerIds) {
          const playerA = playersById.get(idA);
          const playerB = playersById.get(idB);
          if (!playerA || !playerB) continue;
          if (playerA.level === playerB.level) continue; // intercambio neutro

          // Nuevos totales tras mover A→B y B→A.
          const newTotalA = totalA - playerA.level + playerB.level;
          const newTotalB = totalB - playerB.level + playerA.level;

          const projectedTotals = metrics.map((m) => {
            if (m.teamId === teamA.id) return newTotalA;
            if (m.teamId === teamB.id) return newTotalB;
            return m.teamTotalLevel;
          });
          const projectedSpread =
            Math.max(...projectedTotals) - Math.min(...projectedTotals);

          if (projectedSpread < currentSpread) {
            suggestions.push({
              playerA,
              teamAId: teamA.id,
              playerB,
              teamBId: teamB.id,
              currentSpread,
              projectedSpread,
              improvement: currentSpread - projectedSpread,
            });
          }
        }
      }
    }
  }

  // Prioridad: intercambios entre niveles más parecidos (diferencia mínima),
  // y como desempate, los que más reducen el desbalance.
  const levelGap = (s: SwapSuggestion) =>
    Math.abs(s.playerA.level - s.playerB.level);

  return suggestions
    .sort((a, b) => {
      const gapDiff = levelGap(a) - levelGap(b);
      if (gapDiff !== 0) return gapDiff;
      return b.improvement - a.improvement;
    })
    .slice(0, maxSuggestions);
}

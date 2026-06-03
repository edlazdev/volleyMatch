import type { BracketMatch } from '@/types';
import { createId } from './id';

/** Menor potencia de 2 mayor o igual a n. */
function nextPow2(n: number): number {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

/**
 * Orden de siembra estándar para una llave de tamaño `size` (potencia de 2).
 * Devuelve los números de siembra (1..size) en el orden de las posiciones,
 * de modo que los mejores sembrados queden separados (1 vs último, etc.).
 */
function seedOrder(size: number): number[] {
  let seeds = [1, 2];
  while (seeds.length < size) {
    const sum = seeds.length * 2 + 1;
    const next: number[] = [];
    for (const s of seeds) {
      next.push(s);
      next.push(sum - s);
    }
    seeds = next;
  }
  return seeds;
}

/** Ganador efectivo de un partido (incluye avance automático por bye). */
function effectiveWinner(m: BracketMatch): string | null {
  if (m.winnerId) return m.winnerId;
  if (m.teamAId && !m.teamBId) return m.teamAId;
  if (m.teamBId && !m.teamAId) return m.teamBId;
  return null;
}

/**
 * Recalcula la llave: limpia las rondas superiores y propaga los ganadores
 * (elegidos o por bye) ronda por ronda. Invalida selecciones que dejaron de
 * ser coherentes. Muta y devuelve el mismo arreglo.
 */
export function recomputeBracket(matches: BracketMatch[]): BracketMatch[] {
  if (matches.length === 0) return matches;

  const maxRound = Math.max(...matches.map((m) => m.round));
  const byRound = new Map<number, BracketMatch[]>();
  for (const m of matches) {
    const arr = byRound.get(m.round);
    if (arr) arr.push(m);
    else byRound.set(m.round, [m]);
  }
  for (const arr of byRound.values()) arr.sort((a, b) => a.index - b.index);

  // Limpiamos los cupos de rondas superiores antes de rellenar.
  for (const m of matches) {
    if (m.round >= 1) {
      m.teamAId = null;
      m.teamBId = null;
    }
  }

  for (let r = 0; r < maxRound; r++) {
    for (const m of byRound.get(r) ?? []) {
      if (m.winnerId && m.winnerId !== m.teamAId && m.winnerId !== m.teamBId) {
        m.winnerId = null;
      }
      const w = effectiveWinner(m);
      const parent = (byRound.get(r + 1) ?? [])[Math.floor(m.index / 2)];
      if (!parent) continue;
      if (m.index % 2 === 0) parent.teamAId = w;
      else parent.teamBId = w;
    }
  }

  const final = (byRound.get(maxRound) ?? [])[0];
  if (
    final &&
    final.winnerId &&
    final.winnerId !== final.teamAId &&
    final.winnerId !== final.teamBId
  ) {
    final.winnerId = null;
  }

  return matches;
}

/**
 * Construye una llave de eliminación simple a partir de equipos ya ordenados
 * por fuerza (el más fuerte primero). Resuelve byes automáticamente.
 */
export function buildBracket(orderedTeamIds: string[]): BracketMatch[] {
  const n = orderedTeamIds.length;
  if (n < 2) return [];

  const size = nextPow2(n);
  const rounds = Math.round(Math.log2(size));
  const order = seedOrder(size);
  const slotTeams = order.map((s) => (s <= n ? orderedTeamIds[s - 1] : null));

  const matches: BracketMatch[] = [];

  // Primera ronda (con byes si el total no es potencia de 2).
  for (let i = 0; i < size / 2; i++) {
    matches.push({
      id: createId(),
      round: 0,
      index: i,
      teamAId: slotTeams[2 * i],
      teamBId: slotTeams[2 * i + 1],
      winnerId: null,
    });
  }

  // Rondas siguientes vacías.
  for (let r = 1; r < rounds; r++) {
    const count = size / Math.pow(2, r + 1);
    for (let i = 0; i < count; i++) {
      matches.push({
        id: createId(),
        round: r,
        index: i,
        teamAId: null,
        teamBId: null,
        winnerId: null,
      });
    }
  }

  return recomputeBracket(matches);
}

/** Marca (o desmarca) el ganador de un partido y recalcula. */
export function setBracketWinner(
  matches: BracketMatch[],
  matchId: string,
  teamId: string,
): BracketMatch[] {
  const copy = matches.map((m) => ({ ...m }));
  const m = copy.find((x) => x.id === matchId);
  if (!m) return matches;
  if (teamId !== m.teamAId && teamId !== m.teamBId) return matches;
  m.winnerId = m.winnerId === teamId ? null : teamId;
  return recomputeBracket(copy);
}

/** Devuelve el id del campeón si la final ya tiene ganador. */
export function bracketChampion(matches: BracketMatch[]): string | null {
  if (matches.length === 0) return null;
  const maxRound = Math.max(...matches.map((m) => m.round));
  const final = matches.find((m) => m.round === maxRound && m.index === 0);
  return final ? effectiveWinner(final) : null;
}

/** Ganador efectivo (para mostrar avances por bye en la UI). */
export function matchWinner(m: BracketMatch): string | null {
  return effectiveWinner(m);
}

/** Título de la ronda según cuántos equipos participan en ella. */
export function roundTitle(teamsInRound: number): string {
  switch (teamsInRound) {
    case 2:
      return 'Final';
    case 4:
      return 'Semifinales';
    case 8:
      return 'Cuartos de final';
    case 16:
      return 'Octavos de final';
    case 32:
      return 'Dieciseisavos';
    default:
      return `Ronda de ${teamsInRound}`;
  }
}

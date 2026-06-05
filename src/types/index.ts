/**
 * Niveles de juego soportados (1 a 6).
 * Se modela como union literal para garantizar seguridad de tipos.
 */
export type PlayerLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** Participante registrado en el sistema. */
export interface Player {
  id: string;
  name: string;
  level: PlayerLevel;
}

/** Equipo generado a partir de los participantes. */
export interface Team {
  id: string;
  name: string;
  playerIds: string[];
}

/** Métricas calculadas para un equipo. */
export interface TeamMetrics {
  teamId: string;
  teamPlayerCount: number;
  teamTotalLevel: number;
  teamAverageLevel: number;
}

/** Sugerencia de intercambio entre dos equipos para mejorar el balance. */
export interface SwapSuggestion {
  playerA: Player;
  teamAId: string;
  playerB: Player;
  teamBId: string;
  /** Diferencia (spread) actual entre el mejor y peor equipo. */
  currentSpread: number;
  /** Diferencia (spread) proyectada tras el intercambio. */
  projectedSpread: number;
  /** Mejora absoluta del spread (currentSpread - projectedSpread). */
  improvement: number;
}

/** Enfrentamiento (round robin) entre dos equipos. */
export interface Match {
  id: string;
  round: number;
  homeTeamId: string;
  awayTeamId: string;
}

/** Formato del torneo. */
export type TournamentFormat = 'round-robin' | 'knockout';

/** Partido dentro de una llave de eliminación. */
export interface BracketMatch {
  id: string;
  /** Ronda (0 = primera ronda; la última es la final). */
  round: number;
  /** Posición del partido dentro de su ronda. */
  index: number;
  teamAId: string | null;
  teamBId: string | null;
  /** Ganador elegido por el usuario (null = sin definir). */
  winnerId: string | null;
}

/** Pantallas / pasos de la aplicación. */
export type Screen = 'landing' | 'config' | 'teams' | 'matches';

/** Definición visual de un nivel. */
export interface LevelDefinition {
  value: PlayerLevel;
  label: string;
  shortLabel: string;
  /** Clases tailwind para el badge del nivel. */
  badgeClass: string;
}

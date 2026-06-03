import type { LevelDefinition, PlayerLevel } from '@/types';

/** Cantidad de jugadores por equipo en vóley (regla de negocio). */
export const PLAYERS_PER_TEAM = 6;

/** Rango permitido de equipos. */
export const MIN_TEAMS = 2;
export const MAX_TEAMS = 5;

/**
 * Catálogo de niveles disponibles.
 * Cada nivel incluye etiquetas y estilos para mostrarlo de forma consistente.
 */
export const LEVELS: LevelDefinition[] = [
  {
    value: 1,
    label: 'Principiante',
    shortLabel: 'Nivel 1',
    badgeClass:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  {
    value: 2,
    label: 'Básico',
    shortLabel: 'Nivel 2',
    badgeClass:
      'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
  },
  {
    value: 3,
    label: 'Intermedio',
    shortLabel: 'Nivel 3',
    badgeClass:
      'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
  },
  {
    value: 4,
    label: 'Intermedio Alto',
    shortLabel: 'Nivel 4',
    badgeClass:
      'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  },
  {
    value: 5,
    label: 'Avanzado',
    shortLabel: 'Nivel 5',
    badgeClass:
      'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  },
  {
    value: 6,
    label: 'Competitivo',
    shortLabel: 'Nivel 6',
    badgeClass:
      'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  },
];

const LEVEL_MAP = new Map<PlayerLevel, LevelDefinition>(
  LEVELS.map((l) => [l.value, l]),
);

/** Devuelve la definición de un nivel concreto. */
export function getLevel(level: PlayerLevel): LevelDefinition {
  // Todos los niveles válidos existen en el mapa; fallback defensivo al nivel 1.
  return LEVEL_MAP.get(level) ?? LEVELS[0];
}

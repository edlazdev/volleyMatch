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
    label: 'Competitivo',
    shortLabel: 'Nivel 1',
    badgeClass:
      'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  },
  {
    value: 2,
    label: 'Avanzado',
    shortLabel: 'Nivel 2',
    badgeClass:
      'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  },
  {
    value: 3,
    label: 'Intermedio Alto',
    shortLabel: 'Nivel 3',
    badgeClass:
      'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  },
  {
    value: 4,
    label: 'Intermedio',
    shortLabel: 'Nivel 4',
    badgeClass:
      'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
  },
  {
    value: 5,
    label: 'Básico',
    shortLabel: 'Nivel 5',
    badgeClass:
      'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
  },
  {
    value: 6,
    label: 'Principiante',
    shortLabel: 'Nivel 6',
    badgeClass:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
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

/** Emoji de pollito usado como unidad de nivel. */
export const CHICK = '🐤';

/** Representa el nivel como N pollitos (1 → 🐤, 2 → 🐤🐤, …). */
export function chicks(level: PlayerLevel): string {
  return CHICK.repeat(level);
}

/**
 * Clases para el dropdown de nivel teñido con el color propio del nivel.
 * (Cadenas literales para que Tailwind las incluya en el build.)
 */
export const LEVEL_SELECT_CLASS: Record<PlayerLevel, string> = {
  1: 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200',
  2: 'border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-200',
  3: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
  4: 'border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200',
  5: 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200',
  6: 'border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200',
};

/** Tarjeta de nivel en reposo: tinte suave del color propio (nunca blanca). */
export const LEVEL_SOFT_CARD_CLASS: Record<PlayerLevel, string> = {
  1: 'border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/20',
  2: 'border-orange-200 bg-orange-50 dark:border-orange-900/60 dark:bg-orange-950/20',
  3: 'border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/20',
  4: 'border-teal-200 bg-teal-50 dark:border-teal-900/60 dark:bg-teal-950/20',
  5: 'border-sky-200 bg-sky-50 dark:border-sky-900/60 dark:bg-sky-950/20',
  6: 'border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800/40',
};

/** Tarjeta de filtro seleccionada: color propio del nivel, más intenso + anillo. */
export const LEVEL_ACTIVE_CARD_CLASS: Record<PlayerLevel, string> = {
  1: 'border-rose-400 bg-rose-100 ring-2 ring-rose-400/40 dark:border-rose-500 dark:bg-rose-950/50',
  2: 'border-orange-400 bg-orange-100 ring-2 ring-orange-400/40 dark:border-orange-500 dark:bg-orange-950/50',
  3: 'border-amber-400 bg-amber-100 ring-2 ring-amber-400/40 dark:border-amber-500 dark:bg-amber-950/50',
  4: 'border-teal-400 bg-teal-100 ring-2 ring-teal-400/40 dark:border-teal-500 dark:bg-teal-950/50',
  5: 'border-sky-400 bg-sky-100 ring-2 ring-sky-400/40 dark:border-sky-500 dark:bg-sky-950/50',
  6: 'border-slate-400 bg-slate-200 ring-2 ring-slate-400/40 dark:border-slate-500 dark:bg-slate-800/70',
};

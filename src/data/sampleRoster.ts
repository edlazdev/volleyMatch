import type { PlayerLevel } from '@/types';

/**
 * Roster de ejemplo (12 jugadores = 2 equipos).
 * Sirve como lista predeterminada inicial hasta que el usuario guarde la suya.
 */
export const SAMPLE_ROSTER: { name: string; level: PlayerLevel }[] = [
  { name: 'Juan Pérez', level: 6 },
  { name: 'Pedro Gómez', level: 5 },
  { name: 'Carlos Ruiz', level: 5 },
  { name: 'Ana Torres', level: 4 },
  { name: 'María López', level: 4 },
  { name: 'Luis Díaz', level: 4 },
  { name: 'Sofía Castro', level: 3 },
  { name: 'Diego Vargas', level: 3 },
  { name: 'Valentina Ríos', level: 3 },
  { name: 'Andrés Mora', level: 2 },
  { name: 'Camila Soto', level: 2 },
  { name: 'Jorge Núñez', level: 1 },
];

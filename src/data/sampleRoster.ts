import type { PlayerLevel } from '@/types';

/**
 * Roster por defecto de fábrica (18 jugadores).
 * Se usa para "Elegir participantes" y como lista predeterminada inicial
 * mientras el usuario no guarde la suya.
 */
export const SAMPLE_ROSTER: { name: string; level: PlayerLevel }[] = [
  { name: 'Karol', level: 4 },
  { name: 'karina', level: 3 },
  { name: 'Luz', level: 5 },
  { name: 'Ricky', level: 2 },
  { name: 'Leydi', level: 4 },
  { name: 'Danixa', level: 6 },
  { name: 'Giorgino', level: 1 },
  { name: 'Carlos', level: 2 },
  { name: 'Paolo', level: 2 },
  { name: 'Denilson', level: 1 },
  { name: 'Kathy', level: 3 },
  { name: 'Gilda', level: 6 },
  { name: 'Samantha', level: 3 },
  { name: 'Maria', level: 5 },
  { name: 'Helen', level: 5 },
  { name: 'Anasely', level: 4 },
  { name: 'Alex', level: 1 },
  { name: 'Kiana', level: 6 },
  { name: 'Julio', level: 2 },
  { name: 'Napo', level: 2 },
  { name: 'Anghie', level: 4 },
  { name: 'Juan Miguel', level: 3 },
  { name: 'Leyda', level: 3 },
];

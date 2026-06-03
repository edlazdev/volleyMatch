import type { PlayerLevel } from '@/types';

export interface ParsedPlayer {
  name: string;
  level: PlayerLevel;
}

/** Nivel asignado cuando el texto no especifica uno. */
const DEFAULT_LEVEL: PlayerLevel = 3;

/**
 * Normaliza un valor numérico al rango de niveles válido (1-6).
 * Devuelve null si está fuera de rango.
 */
function toLevel(value: number): PlayerLevel | null {
  if (Number.isInteger(value) && value >= 1 && value <= 6) {
    return value as PlayerLevel;
  }
  return null;
}

/**
 * Parsea un bloque de texto (típicamente copiado de un grupo de WhatsApp)
 * y extrae jugadores con su nivel.
 *
 * Soporta formatos por línea como:
 *   - "Juan Pérez"
 *   - "1. Juan Pérez"        (numeración)
 *   - "1) Juan Pérez"
 *   - "- Juan Pérez"         (viñetas)
 *   - "Juan Pérez 5"         (nivel al final)
 *   - "Juan Pérez - 5"
 *   - "Juan Pérez (5)"
 *   - "Juan Pérez: 5"
 *
 * Ignora líneas vacías y descarta nombres duplicados (case-insensitive).
 */
export function parseRoster(text: string): ParsedPlayer[] {
  const seen = new Set<string>();
  const players: ParsedPlayer[] = [];

  for (const rawLine of text.split(/\r?\n/)) {
    let line = rawLine.trim();
    if (!line) continue;

    // Quitar numeración o viñetas al inicio: "1.", "1)", "-", "*", "•".
    line = line.replace(/^\s*(\d{1,3}[.)\-]\s*|[-*•]\s+)/, '').trim();
    if (!line) continue;

    // Detectar nivel al final: " 5", " - 5", " (5)", " : 5".
    let level: PlayerLevel = DEFAULT_LEVEL;
    const match = line.match(/^(.*?)[\s]*[-:(]?\s*(\d{1,2})\)?\s*$/);
    if (match && match[1].trim()) {
      const candidate = toLevel(Number(match[2]));
      if (candidate !== null) {
        line = match[1].trim();
        level = candidate;
      }
    }

    // Limpiar separadores residuales al final del nombre.
    const name = line.replace(/[\s\-:(]+$/, '').trim();
    if (!name) continue;

    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    players.push({ name: name.slice(0, 40), level });
  }

  return players;
}

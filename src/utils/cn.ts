/**
 * Une clases condicionalmente (helper minimalista tipo `clsx`).
 * Acepta strings, falsy y objetos { clase: condicion }.
 */
type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | Record<string, boolean | undefined | null>;

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string' || typeof input === 'number') {
      out.push(String(input));
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) out.push(key);
      }
    }
  }

  return out.join(' ');
}

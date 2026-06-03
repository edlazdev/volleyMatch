/**
 * Adaptador de almacenamiento seguro para `zustand/persist`.
 * Tolera entornos sin LocalStorage (SSR, modo privado) sin romper la app.
 */
import type { StateStorage } from 'zustand/middleware';

const memoryStore = new Map<string, string>();

function hasLocalStorage(): boolean {
  try {
    const testKey = '__vm_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const available = typeof window !== 'undefined' && hasLocalStorage();

export const safeStorage: StateStorage = {
  getItem: (name) =>
    available ? window.localStorage.getItem(name) : memoryStore.get(name) ?? null,
  setItem: (name, value) => {
    if (available) window.localStorage.setItem(name, value);
    else memoryStore.set(name, value);
  },
  removeItem: (name) => {
    if (available) window.localStorage.removeItem(name);
    else memoryStore.delete(name);
  },
};

/** Clave única bajo la que se persiste el estado de la app. */
export const STORAGE_KEY = 'volley-match:v1';

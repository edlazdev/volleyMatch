import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  BracketMatch,
  Match,
  Player,
  PlayerLevel,
  Screen,
  SwapSuggestion,
  Team,
  TournamentFormat,
} from '@/types';
import { MAX_TEAMS, MIN_TEAMS, PLAYERS_PER_TEAM } from '@/data/levels';
import { createId } from '@/utils/id';
import {
  calculateTeamMetrics,
  generateTeams as buildTeams,
  indexPlayers,
} from '@/utils/teamBalance';
import { generateMatches as buildMatches } from '@/utils/matches';
import { buildBracket, setBracketWinner } from '@/utils/bracket';
import { safeStorage, STORAGE_KEY } from '@/services/storage';
import { SAMPLE_ROSTER } from '@/data/sampleRoster';

/** Entrada de roster sin id (nombre + nivel). */
export interface RosterEntry {
  name: string;
  level: PlayerLevel;
}

/** Compara dos rosters por contenido (nombre + nivel, en orden). */
function rostersEqual(a: RosterEntry[], b: RosterEntry[]): boolean {
  if (a.length !== b.length) return false;
  return a.every(
    (e, i) => e.name === b[i].name && e.level === b[i].level,
  );
}

interface VolleyState {
  // --- Estado ---
  teamCount: number;
  /** Jugadores por equipo (6, 8 o 10). */
  teamSize: number;
  players: Player[];
  teams: Team[];
  matches: Match[];
  /** Llave de eliminación (torneo). */
  bracket: BracketMatch[];
  /** Formato de enfrentamientos mostrado. */
  format: TournamentFormat;
  screen: Screen;
  /**
   * Lista del usuario (persistida).
   * - `null`  → nunca personalizada: se usa la lista de fábrica.
   * - `[]`    → vaciada a propósito: se respeta vacía.
   * - `[...]` → lista propia guardada.
   */
  defaultRoster: RosterEntry[] | null;

  // --- Configuración ---
  setTeamCount: (count: number) => void;
  setTeamSize: (size: number) => void;
  setScreen: (screen: Screen) => void;

  // --- Jugadores ---
  addPlayer: (name: string, level: PlayerLevel) => void;
  /** Agrega varios jugadores (import por texto) respetando el cupo máximo. */
  addPlayers: (entries: RosterEntry[]) => number;
  /** Reemplaza la lista de jugadores por los participantes seleccionados. */
  setParticipants: (entries: RosterEntry[]) => void;
  updatePlayer: (id: string, patch: Partial<Omit<Player, 'id'>>) => void;
  removePlayer: (id: string) => void;
  clearPlayers: () => void;

  // --- Lista predeterminada ---
  /** Guarda los jugadores actuales como lista predeterminada (reemplaza). */
  saveAsDefault: () => void;
  /**
   * Fusiona entradas en la lista por defecto: agrega solo los nombres que aún
   * no existen (sin duplicar ni borrar). Devuelve cuántos se agregaron.
   */
  mergeIntoDefault: (entries: RosterEntry[]) => number;
  /** Carga la lista predeterminada (o el roster de ejemplo si no hay). */
  loadDefault: () => void;
  /** Vacía la lista a propósito (queda `[]`, se respeta vacía al refrescar). */
  clearDefault: () => void;
  /** Reemplaza por completo la lista. */
  setDefaultRoster: (entries: RosterEntry[]) => void;
  /** Agrega una persona (si nunca se personalizó, parte de la de fábrica). */
  addToDefault: (name: string, level: PlayerLevel) => void;
  /** Edita una entrada por índice. */
  updateDefaultEntry: (index: number, patch: Partial<RosterEntry>) => void;
  /** Quita una persona por índice. */
  removeFromDefault: (index: number) => void;
  /** Restaura la lista por defecto de fábrica (vuelve a `null`). */
  resetDefaultToFactory: () => void;

  // --- Generación ---
  generateTeams: () => void;
  regenerateMatches: () => void;
  /** Renombra un equipo. */
  renameTeam: (teamId: string, name: string) => void;
  /** Restaura los nombres a "Equipo 1", "Equipo 2", … */
  resetTeamNames: () => void;

  // --- Torneo / llaves ---
  setFormat: (format: TournamentFormat) => void;
  /** Reconstruye la llave a partir de los equipos actuales (re-siembra). */
  regenerateBracket: () => void;
  /** Elige (o desmarca) el ganador de un partido de la llave. */
  setMatchWinner: (matchId: string, teamId: string) => void;

  // --- Drag & Drop ---
  movePlayer: (
    playerId: string,
    targetTeamId: string,
    targetIndex?: number,
  ) => void;
  reorderWithinTeam: (
    teamId: string,
    fromIndex: number,
    toIndex: number,
  ) => void;
  swapPlayers: (playerAId: string, playerBId: string) => void;
  applySuggestion: (suggestion: SwapSuggestion) => void;

  // --- Utilidades ---
  reset: () => void;
}

/** Limita la cantidad de equipos al rango permitido. */
function clampTeamCount(count: number): number {
  if (Number.isNaN(count)) return MIN_TEAMS;
  return Math.min(MAX_TEAMS, Math.max(MIN_TEAMS, Math.round(count)));
}

/** Localiza el equipo que contiene a un jugador. */
function findTeamOfPlayer(
  teams: Team[],
  playerId: string,
): { team: Team; index: number } | null {
  for (const team of teams) {
    const index = team.playerIds.indexOf(playerId);
    if (index !== -1) return { team, index };
  }
  return null;
}

/**
 * Ordena los equipos por fuerza para sembrar la llave.
 * Escala invertida: menor nivel total = más fuerte → va primero.
 */
function seedTeamIds(teams: Team[], players: Player[]): string[] {
  const byId = indexPlayers(players);
  return [...teams]
    .sort(
      (a, b) =>
        calculateTeamMetrics(a, byId).teamTotalLevel -
        calculateTeamMetrics(b, byId).teamTotalLevel,
    )
    .map((t) => t.id);
}

export const useVolleyStore = create<VolleyState>()(
  persist(
    (set, get) => ({
      teamCount: 2,
      teamSize: PLAYERS_PER_TEAM,
      players: [],
      teams: [],
      matches: [],
      bracket: [],
      format: 'round-robin',
      screen: 'config',
      defaultRoster: null,

      setTeamCount: (count) =>
        set({ teamCount: clampTeamCount(count) }),

      setTeamSize: (size) => set({ teamSize: size }),

      setScreen: (screen) => set({ screen }),

      addPlayer: (name, level) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const player: Player = { id: createId(), name: trimmed, level };
        set((state) => ({ players: [...state.players, player] }));
      },

      addPlayers: (entries) => {
        const { players, teamCount, teamSize } = get();
        const capacity = maxPlayersFor(teamCount, teamSize);
        const room = Math.max(0, capacity - players.length);
        if (room === 0) return 0;

        const toAdd = entries
          .map((e) => ({ name: e.name.trim(), level: e.level }))
          .filter((e) => e.name.length > 0)
          .slice(0, room)
          .map<Player>((e) => ({ id: createId(), name: e.name, level: e.level }));

        if (toAdd.length === 0) return 0;
        set({ players: [...players, ...toAdd] });
        return toAdd.length;
      },

      setParticipants: (entries) => {
        const players = entries
          .map((e) => ({ name: e.name.trim(), level: e.level }))
          .filter((e) => e.name.length > 0)
          .map<Player>((e) => ({
            id: createId(),
            name: e.name,
            level: e.level,
          }));
        set({ players, teams: [], matches: [] });
      },

      saveAsDefault: () =>
        set((state) => ({
          defaultRoster: state.players.map(({ name, level }) => ({
            name,
            level,
          })),
        })),

      mergeIntoDefault: (entries) => {
        const base = get().defaultRoster ?? SAMPLE_ROSTER;
        const existing = new Set(
          base.map((e) => e.name.trim().toLowerCase()),
        );
        const additions: RosterEntry[] = [];
        for (const e of entries) {
          const name = e.name.trim();
          const key = name.toLowerCase();
          if (!name || existing.has(key)) continue;
          existing.add(key);
          additions.push({ name: name.slice(0, 40), level: e.level });
        }
        // Sin nombres nuevos: no materializamos (si era `null` sigue de fábrica).
        if (additions.length === 0) return 0;
        set({ defaultRoster: [...base.map((e) => ({ ...e })), ...additions] });
        return additions.length;
      },

      loadDefault: () => {
        const { defaultRoster, teamCount, teamSize } = get();
        const source =
          defaultRoster && defaultRoster.length > 0
            ? defaultRoster
            : SAMPLE_ROSTER;
        const capacity = maxPlayersFor(teamCount, teamSize);
        const players = source.slice(0, capacity).map<Player>((e) => ({
          id: createId(),
          name: e.name,
          level: e.level,
        }));
        set({ players, teams: [], matches: [] });
      },

      // Vaciar a propósito: queda `[]` (no `null`), así se respeta al refrescar.
      clearDefault: () => set({ defaultRoster: [] }),

      setDefaultRoster: (entries) =>
        set({
          defaultRoster: entries.map((e) => ({
            name: e.name.trim(),
            level: e.level,
          })),
        }),

      addToDefault: (name, level) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        // Si nunca se personalizó (null), partimos de la lista de fábrica.
        const base = get().defaultRoster ?? SAMPLE_ROSTER;
        set({
          defaultRoster: [
            ...base.map((e) => ({ ...e })),
            { name: trimmed.slice(0, 40), level },
          ],
        });
      },

      updateDefaultEntry: (index, patch) => {
        const base = get().defaultRoster ?? SAMPLE_ROSTER;
        set({
          defaultRoster: base.map((entry, i) =>
            i === index ? { ...entry, ...patch } : { ...entry },
          ),
        });
      },

      removeFromDefault: (index) => {
        const base = get().defaultRoster ?? SAMPLE_ROSTER;
        set({ defaultRoster: base.filter((_, i) => i !== index) });
      },

      // Volver a `null` = usar la lista de fábrica (también tras refrescar).
      resetDefaultToFactory: () => set({ defaultRoster: null }),

      updatePlayer: (id, patch) =>
        set((state) => ({
          players: state.players.map((p) =>
            p.id === id ? { ...p, ...patch } : p,
          ),
        })),

      removePlayer: (id) =>
        set((state) => ({
          players: state.players.filter((p) => p.id !== id),
          // Si ya había equipos, quitamos al jugador de ellos.
          teams: state.teams.map((t) => ({
            ...t,
            playerIds: t.playerIds.filter((pid) => pid !== id),
          })),
        })),

      clearPlayers: () => set({ players: [], teams: [], matches: [] }),

      generateTeams: () => {
        const { players, teamCount } = get();
        const teams = buildTeams(players, teamCount);
        const matches = buildMatches(teams);
        const bracket = buildBracket(seedTeamIds(teams, players));
        set({ teams, matches, bracket, screen: 'teams' });
      },

      regenerateMatches: () => {
        const { teams } = get();
        set({ matches: buildMatches(teams) });
      },

      renameTeam: (teamId, name) =>
        set((state) => ({
          teams: state.teams.map((t) =>
            t.id === teamId ? { ...t, name: name.slice(0, 24) } : t,
          ),
        })),

      resetTeamNames: () =>
        set((state) => ({
          teams: state.teams.map((t, i) => ({ ...t, name: `Equipo ${i + 1}` })),
        })),

      setFormat: (format) => set({ format }),

      regenerateBracket: () => {
        const { teams, players } = get();
        set({ bracket: buildBracket(seedTeamIds(teams, players)) });
      },

      setMatchWinner: (matchId, teamId) =>
        set((state) => ({
          bracket: setBracketWinner(state.bracket, matchId, teamId),
        })),

      movePlayer: (playerId, targetTeamId, targetIndex) =>
        set((state) => {
          const origin = findTeamOfPlayer(state.teams, playerId);
          if (!origin) return state;

          const teams = state.teams.map((team) => {
            // Quitamos al jugador de su equipo de origen.
            if (team.id === origin.team.id) {
              return {
                ...team,
                playerIds: team.playerIds.filter((id) => id !== playerId),
              };
            }
            return team;
          });

          const target = teams.find((t) => t.id === targetTeamId);
          if (!target) return state;

          const insertAt =
            targetIndex === undefined
              ? target.playerIds.length
              : Math.max(0, Math.min(targetIndex, target.playerIds.length));

          target.playerIds = [
            ...target.playerIds.slice(0, insertAt),
            playerId,
            ...target.playerIds.slice(insertAt),
          ];

          return { teams };
        }),

      reorderWithinTeam: (teamId, fromIndex, toIndex) =>
        set((state) => ({
          teams: state.teams.map((team) => {
            if (team.id !== teamId) return team;
            const ids = [...team.playerIds];
            const [moved] = ids.splice(fromIndex, 1);
            ids.splice(toIndex, 0, moved);
            return { ...team, playerIds: ids };
          }),
        })),

      swapPlayers: (playerAId, playerBId) =>
        set((state) => {
          const a = findTeamOfPlayer(state.teams, playerAId);
          const b = findTeamOfPlayer(state.teams, playerBId);
          if (!a || !b) return state;

          return {
            teams: state.teams.map((team) => {
              if (team.id === a.team.id) {
                const ids = [...team.playerIds];
                ids[a.index] = playerBId;
                return { ...team, playerIds: ids };
              }
              if (team.id === b.team.id) {
                const ids = [...team.playerIds];
                ids[b.index] = playerAId;
                return { ...team, playerIds: ids };
              }
              return team;
            }),
          };
        }),

      applySuggestion: (suggestion) =>
        get().swapPlayers(suggestion.playerA.id, suggestion.playerB.id),

      reset: () =>
        set({
          teamCount: 2,
          teamSize: PLAYERS_PER_TEAM,
          players: [],
          teams: [],
          matches: [],
          bracket: [],
          format: 'round-robin',
          screen: 'config',
        }),
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      storage: createJSONStorage(() => safeStorage),
      // v1 → v2: si la lista guardada coincide con la de fábrica (se sembraba
      // automáticamente al abrir el editor), la tratamos como "no personalizada"
      // poniéndola en null, para que la de fábrica siga vigente tras refrescar.
      migrate: (persisted, version) => {
        const state = (persisted ?? {}) as Partial<VolleyState>;
        if (
          version < 2 &&
          Array.isArray(state.defaultRoster) &&
          rostersEqual(state.defaultRoster, SAMPLE_ROSTER)
        ) {
          state.defaultRoster = null;
        }
        return state as VolleyState;
      },
      // Persistimos solo el dominio; nada de estado derivado de UI volátil.
      partialize: (state) => ({
        teamCount: state.teamCount,
        teamSize: state.teamSize,
        players: state.players,
        teams: state.teams,
        matches: state.matches,
        bracket: state.bracket,
        format: state.format,
        screen: state.screen,
        defaultRoster: state.defaultRoster,
      }),
    },
  ),
);

/** Cupo de jugadores requerido según cantidad de equipos y tamaño de equipo. */
export function maxPlayersFor(
  teamCount: number,
  teamSize: number = PLAYERS_PER_TEAM,
): number {
  return teamCount * teamSize;
}

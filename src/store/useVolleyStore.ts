import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Match,
  Player,
  PlayerLevel,
  Screen,
  SwapSuggestion,
  Team,
} from '@/types';
import { MAX_TEAMS, MIN_TEAMS, PLAYERS_PER_TEAM } from '@/data/levels';
import { createId } from '@/utils/id';
import { generateTeams as buildTeams } from '@/utils/teamBalance';
import { generateMatches as buildMatches } from '@/utils/matches';
import { safeStorage, STORAGE_KEY } from '@/services/storage';
import { SAMPLE_ROSTER } from '@/data/sampleRoster';

/** Entrada de roster sin id (nombre + nivel). */
export interface RosterEntry {
  name: string;
  level: PlayerLevel;
}

interface VolleyState {
  // --- Estado ---
  teamCount: number;
  players: Player[];
  teams: Team[];
  matches: Match[];
  screen: Screen;
  /** Lista predeterminada guardada por el usuario (persistida). */
  defaultRoster: RosterEntry[];

  // --- Configuración ---
  setTeamCount: (count: number) => void;
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
  /** Guarda los jugadores actuales como lista predeterminada. */
  saveAsDefault: () => void;
  /** Carga la lista predeterminada (o el roster de ejemplo si no hay). */
  loadDefault: () => void;
  /** Elimina la lista predeterminada guardada. */
  clearDefault: () => void;

  // --- Generación ---
  generateTeams: () => void;
  regenerateMatches: () => void;

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

export const useVolleyStore = create<VolleyState>()(
  persist(
    (set, get) => ({
      teamCount: 2,
      players: [],
      teams: [],
      matches: [],
      screen: 'config',
      defaultRoster: [],

      setTeamCount: (count) =>
        set({ teamCount: clampTeamCount(count) }),

      setScreen: (screen) => set({ screen }),

      addPlayer: (name, level) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const player: Player = { id: createId(), name: trimmed, level };
        set((state) => ({ players: [...state.players, player] }));
      },

      addPlayers: (entries) => {
        const { players, teamCount } = get();
        const capacity = maxPlayersFor(teamCount);
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

      loadDefault: () => {
        const { defaultRoster, teamCount } = get();
        const source =
          defaultRoster.length > 0 ? defaultRoster : SAMPLE_ROSTER;
        const capacity = maxPlayersFor(teamCount);
        const players = source.slice(0, capacity).map<Player>((e) => ({
          id: createId(),
          name: e.name,
          level: e.level,
        }));
        set({ players, teams: [], matches: [] });
      },

      clearDefault: () => set({ defaultRoster: [] }),

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
        set({ teams, matches, screen: 'teams' });
      },

      regenerateMatches: () => {
        const { teams } = get();
        set({ matches: buildMatches(teams) });
      },

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
          players: [],
          teams: [],
          matches: [],
          screen: 'config',
        }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      // Persistimos solo el dominio; nada de estado derivado de UI volátil.
      partialize: (state) => ({
        teamCount: state.teamCount,
        players: state.players,
        teams: state.teams,
        matches: state.matches,
        screen: state.screen,
        defaultRoster: state.defaultRoster,
      }),
    },
  ),
);

/** Cupo máximo de jugadores permitido según la cantidad de equipos. */
export function maxPlayersFor(teamCount: number): number {
  return teamCount * PLAYERS_PER_TEAM;
}

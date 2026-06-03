import { useCallback, useMemo, useState } from 'react';
import {
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { Player, Team } from '@/types';
import { useVolleyStore } from '@/store/useVolleyStore';

/**
 * Encapsula sensores y handlers de dnd-kit para mover/reordenar jugadores
 * entre equipos. Funciona con mouse, touch (móvil/tablet) y teclado.
 */
export function useTeamDnD(teams: Team[], playersById: Map<string, Player>) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const movePlayer = useVolleyStore((s) => s.movePlayer);
  const reorderWithinTeam = useVolleyStore((s) => s.reorderWithinTeam);

  const sensors = useSensors(
    // Pequeña distancia para no disparar drag al hacer tap/click.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    // En touch, exigimos una breve pulsación para distinguir scroll de drag.
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  /** Localiza el equipo que contiene a un jugador dado. */
  const findTeamId = useCallback(
    (playerId: string): string | null =>
      teams.find((t) => t.playerIds.includes(playerId))?.id ?? null,
    [teams],
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over) return;

      const activePlayerId = String(active.id);
      const sourceTeamId = findTeamId(activePlayerId);
      if (!sourceTeamId) return;

      const overId = String(over.id);

      // ¿Se soltó sobre un contenedor de equipo (vacío o zona libre)?
      const overTeam = teams.find((t) => t.id === overId);
      if (overTeam) {
        if (overTeam.id !== sourceTeamId) {
          movePlayer(activePlayerId, overTeam.id);
        }
        return;
      }

      // Se soltó sobre otro jugador: usamos su equipo e índice como destino.
      const targetTeamId = findTeamId(overId);
      if (!targetTeamId) return;

      const targetTeam = teams.find((t) => t.id === targetTeamId)!;
      const overIndex = targetTeam.playerIds.indexOf(overId);

      if (targetTeamId === sourceTeamId) {
        // Reordenar dentro del mismo equipo.
        const sourceTeam = teams.find((t) => t.id === sourceTeamId)!;
        const fromIndex = sourceTeam.playerIds.indexOf(activePlayerId);
        if (fromIndex !== overIndex && fromIndex !== -1) {
          reorderWithinTeam(sourceTeamId, fromIndex, overIndex);
        }
      } else {
        // Mover a otro equipo en la posición del jugador destino.
        movePlayer(activePlayerId, targetTeamId, overIndex);
      }
    },
    [teams, findTeamId, movePlayer, reorderWithinTeam],
  );

  const handleDragCancel = useCallback(() => setActiveId(null), []);

  const activePlayer = useMemo(
    () => (activeId ? playersById.get(activeId) ?? null : null),
    [activeId, playersById],
  );

  return {
    sensors,
    activePlayer,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
}

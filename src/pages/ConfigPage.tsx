import { useMemo, useState } from 'react';
import {
  AlertCircle,
  BookmarkPlus,
  CheckCircle2,
  ClipboardList,
  ListPlus,
  Sparkles,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { useVolleyStore, maxPlayersFor } from '@/store/useVolleyStore';
import { useTeamData } from '@/hooks/useTeamData';
import {
  MAX_TEAMS,
  MIN_TEAMS,
  TEAM_SIZE_OPTIONS,
  getLevel,
} from '@/data/levels';
import { SAMPLE_ROSTER } from '@/data/sampleRoster';
import type { PlayerLevel } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Stepper } from '@/components/ui/Stepper';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PlayerForm } from '@/components/PlayerForm';
import { PlayerList } from '@/components/PlayerList';
import { LevelCounts } from '@/components/LevelCounts';
import { ImportPlayersModal } from '@/components/ImportPlayersModal';
import { SelectParticipantsModal } from '@/components/SelectParticipantsModal';
import { ManageRosterModal } from '@/components/ManageRosterModal';

export function ConfigPage() {
  const teamCount = useVolleyStore((s) => s.teamCount);
  const setTeamCount = useVolleyStore((s) => s.setTeamCount);
  const teamSize = useVolleyStore((s) => s.teamSize);
  const setTeamSize = useVolleyStore((s) => s.setTeamSize);
  const addPlayer = useVolleyStore((s) => s.addPlayer);
  const addPlayers = useVolleyStore((s) => s.addPlayers);
  const removePlayer = useVolleyStore((s) => s.removePlayer);
  const updatePlayer = useVolleyStore((s) => s.updatePlayer);
  const clearPlayers = useVolleyStore((s) => s.clearPlayers);
  const generateTeams = useVolleyStore((s) => s.generateTeams);
  const setParticipants = useVolleyStore((s) => s.setParticipants);
  const mergeIntoDefault = useVolleyStore((s) => s.mergeIntoDefault);
  const defaultRoster = useVolleyStore((s) => s.defaultRoster);

  const { players, validation } = useTeamData();
  const [importOpen, setImportOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [addedHint, setAddedHint] = useState<number | null>(null);
  const [levelFilter, setLevelFilter] = useState<PlayerLevel | null>(null);

  /**
   * Lista base para elegir participantes:
   * `null` (nunca personalizada) → la de fábrica; si no, la del usuario.
   */
  const baseRoster = defaultRoster ?? SAMPLE_ROSTER;

  const visiblePlayers = useMemo(
    () =>
      levelFilter === null
        ? players
        : players.filter((p) => p.level === levelFilter),
    [players, levelFilter],
  );

  const handleAddToDefault = () => {
    const added = mergeIntoDefault(players);
    setAddedHint(added);
    window.setTimeout(() => setAddedHint(null), 2400);
  };

  const maxPlayers = maxPlayersFor(teamCount, teamSize);
  const atCapacity = players.length >= maxPlayers;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Configuración de equipos */}
      <Card className="p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Cantidad de equipos
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Se necesitan {teamSize} jugadores por equipo.
            </p>
          </div>
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
            {maxPlayers} jugadores
          </span>
        </div>
        <Stepper
          value={teamCount}
          min={MIN_TEAMS}
          max={MAX_TEAMS}
          onChange={setTeamCount}
          suffix="equipos"
        />

        <div className="mt-4">
          <p className="mb-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Jugadores por equipo
          </p>
          <SegmentedControl
            value={teamSize}
            options={TEAM_SIZE_OPTIONS.map((n) => ({
              value: n,
              label: `${n}`,
            }))}
            onChange={setTeamSize}
          />
        </div>
      </Card>

      {/* Armar la lista (acciones previas a agregar a mano) */}
      <Card className="p-4 sm:p-5">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Arma tu lista
        </h2>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          Elige del grupo, edita la lista por defecto o importa una lista.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setSelectOpen(true)}>
            <UserCheck className="h-4 w-4" />
            Elegir participantes
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setManageOpen(true)}
          >
            <ListPlus className="h-4 w-4" />
            Editar lista por defecto
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setImportOpen(true)}
            disabled={atCapacity}
          >
            <ClipboardList className="h-4 w-4" />
            Importar lista
          </Button>
        </div>
      </Card>

      {/* Agregar jugador a mano */}
      <Card className="p-4 sm:p-5">
        <h2 className="mb-3 text-sm font-bold text-slate-800 dark:text-slate-100">
          Agregar jugador
        </h2>
        <PlayerForm disabled={atCapacity} onSubmit={addPlayer} />
      </Card>

      {/* Contador + validación */}
      <Card className="p-4 sm:p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            Jugadores registrados
          </span>
          <span className="font-bold tabular-nums text-slate-800 dark:text-slate-100">
            {players.length} / {maxPlayers}
          </span>
        </div>
        <ProgressBar
          value={players.length}
          max={maxPlayers}
          tone={validation.isValid ? 'ok' : 'warn'}
        />

        {validation.message ? (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-sm text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{validation.message}</span>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>¡Listo! Tienes el número exacto de jugadores.</span>
          </div>
        )}
      </Card>

      {/* Lista de jugadores */}
      <Card className="p-4 sm:p-5">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Lista de jugadores
          </h2>
          {players.length > 0 && (
            <button
              onClick={clearPlayers}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Vaciar
            </button>
          )}
        </div>

        {players.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              Distribución por nivel{' '}
              <span className="font-normal text-slate-400">
                · toca un nivel para filtrar
              </span>
            </p>
            <LevelCounts
              players={players}
              selected={levelFilter}
              onSelect={(lvl) =>
                setLevelFilter((prev) => (prev === lvl ? null : lvl))
              }
            />
          </div>
        )}

        {levelFilter !== null && (
          <div className="mb-3 flex items-center justify-between rounded-xl bg-brand-50 px-3 py-2 text-sm dark:bg-brand-950/40">
            <span className="font-medium text-brand-700 dark:text-brand-300">
              Mostrando nivel {levelFilter} · {getLevel(levelFilter).label}
              <span className="ml-1 text-brand-500">
                ({visiblePlayers.length})
              </span>
            </span>
            <button
              onClick={() => setLevelFilter(null)}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              Ver todos
            </button>
          </div>
        )}

        <PlayerList
          players={visiblePlayers}
          onRemove={removePlayer}
          onChangeLevel={(id, level) => updatePlayer(id, { level })}
        />

        {players.length > 0 && (
          <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={handleAddToDefault}
              title="Agrega los jugadores nuevos a la lista por defecto (no la reemplaza)"
            >
              <BookmarkPlus className="h-4 w-4" />
              {addedHint === null
                ? 'Añadir jugadores a la lista por defecto'
                : addedHint > 0
                  ? `+${addedHint} añadido${addedHint === 1 ? '' : 's'} a la lista por defecto`
                  : 'Ya estaban todos en la lista por defecto'}
            </Button>
          </div>
        )}
      </Card>

      {/* CTA fija */}
      <div className="sticky bottom-4 z-20">
        <Button
          fullWidth
          size="lg"
          disabled={!validation.isValid}
          onClick={generateTeams}
          className="shadow-glow"
        >
          <Sparkles className="h-5 w-5" />
          Generar equipos equilibrados
        </Button>
      </div>

      <ImportPlayersModal
        open={importOpen}
        availableSlots={Math.max(0, maxPlayers - players.length)}
        onClose={() => setImportOpen(false)}
        onImport={addPlayers}
      />

      <SelectParticipantsModal
        open={selectOpen}
        roster={baseRoster}
        capacity={maxPlayers}
        teamCount={teamCount}
        onClose={() => setSelectOpen(false)}
        onConfirm={setParticipants}
        onEditList={() => {
          setSelectOpen(false);
          setManageOpen(true);
        }}
      />

      <ManageRosterModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
      />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Plus, RotateCcw, Trash2, Users } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { LEVELS, LEVEL_SELECT_CLASS, getLevel, levelCode } from '@/data/levels';
import { SAMPLE_ROSTER } from '@/data/sampleRoster';
import { useVolleyStore } from '@/store/useVolleyStore';
import type { PlayerLevel } from '@/types';

interface ManageRosterModalProps {
  open: boolean;
  onClose: () => void;
}

/** Editor CRUD de la lista por defecto, persistida en LocalStorage. */
export function ManageRosterModal({ open, onClose }: ManageRosterModalProps) {
  const defaultRoster = useVolleyStore((s) => s.defaultRoster);
  const addToDefault = useVolleyStore((s) => s.addToDefault);
  const updateDefaultEntry = useVolleyStore((s) => s.updateDefaultEntry);
  const removeFromDefault = useVolleyStore((s) => s.removeFromDefault);
  const resetDefaultToFactory = useVolleyStore((s) => s.resetDefaultToFactory);
  const clearDefault = useVolleyStore((s) => s.clearDefault);

  const [name, setName] = useState('');
  const [level, setLevel] = useState<PlayerLevel>(3);
  const [confirmClear, setConfirmClear] = useState(false);

  /**
   * Lista efectiva mostrada: si nunca se personalizó (`null`) mostramos la de
   * fábrica, pero NO la persistimos hasta que el usuario haga un cambio real.
   */
  const roster = defaultRoster ?? SAMPLE_ROSTER;
  const isCustom = defaultRoster !== null;

  // Al cerrar, limpiamos el estado de confirmación.
  useEffect(() => {
    if (!open) setConfirmClear(false);
  }, [open]);

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    addToDefault(trimmed, level);
    setName('');
  };

  return (
    <Modal
      open={open}
      title="Editar lista por defecto"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={resetDefaultToFactory}
            disabled={!isCustom}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-40 dark:text-slate-400 dark:hover:text-slate-200"
            title="Vuelve a la lista por defecto original"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restaurar lista por defecto
          </button>
          <Button size="sm" onClick={onClose}>
            Listo ({roster.length})
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        {/* Alta de persona */}
        <div className="flex gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="Nombre"
            maxLength={40}
            className="flex-1"
          />
          <div className="w-40 shrink-0">
            <Select
              value={level}
              onChange={(e) => setLevel(Number(e.target.value) as PlayerLevel)}
              title={getLevel(level).label}
              accentClass={LEVEL_SELECT_CLASS[level]}
              className="font-semibold"
            >
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value} title={l.label}>
                  {levelCode(l.value)} · {l.label}
                </option>
              ))}
            </Select>
          </div>
          <Button size="md" onClick={handleAdd} disabled={!name.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Cabecera del listado con borrado masivo */}
        {roster.length > 0 && (
          <div className="flex min-h-[28px] items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {roster.length} {roster.length === 1 ? 'persona' : 'personas'}
            </span>

            {confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  ¿Vaciar la lista?
                </span>
                <button
                  onClick={() => {
                    clearDefault();
                    setConfirmClear(false);
                  }}
                  className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-rose-700"
                >
                  Sí, vaciar
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Vaciar todo
              </button>
            )}
          </div>
        )}

        {/* Listado editable */}
        {roster.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Lista vacía"
            description="Agrega personas con el formulario de arriba o restaura la lista por defecto."
          />
        ) : (
          <ul className="max-h-[50vh] space-y-1.5 overflow-y-auto">
            {roster.map((entry, i) => (
              <li
                key={i}
                className="flex items-center gap-2 rounded-xl border border-slate-200 p-2 dark:border-slate-700"
              >
                <Input
                  value={entry.name}
                  onChange={(e) =>
                    updateDefaultEntry(i, { name: e.target.value })
                  }
                  maxLength={40}
                  className="h-9 flex-1"
                />
                <div className="w-36 shrink-0">
                  <Select
                    value={entry.level}
                    onChange={(e) =>
                      updateDefaultEntry(i, {
                        level: Number(e.target.value) as PlayerLevel,
                      })
                    }
                    title={getLevel(entry.level).label}
                    accentClass={LEVEL_SELECT_CLASS[entry.level]}
                    className="h-9 text-xs font-semibold"
                  >
                    {LEVELS.map((l) => (
                      <option key={l.value} value={l.value} title={l.label}>
                        {levelCode(l.value)} · {l.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <button
                  onClick={() => removeFromDefault(i)}
                  aria-label={`Quitar a ${entry.name}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}

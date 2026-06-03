import { useEffect, useState } from 'react';
import { Plus, RotateCcw, Trash2, Users } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { LEVELS, chicks } from '@/data/levels';
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
  const setDefaultRoster = useVolleyStore((s) => s.setDefaultRoster);
  const addToDefault = useVolleyStore((s) => s.addToDefault);
  const updateDefaultEntry = useVolleyStore((s) => s.updateDefaultEntry);
  const removeFromDefault = useVolleyStore((s) => s.removeFromDefault);
  const resetDefaultToFactory = useVolleyStore((s) => s.resetDefaultToFactory);

  const [name, setName] = useState('');
  const [level, setLevel] = useState<PlayerLevel>(3);

  // Al abrir por primera vez sin lista guardada, sembramos la de fábrica.
  useEffect(() => {
    if (open && defaultRoster.length === 0) {
      setDefaultRoster(SAMPLE_ROSTER);
    }
  }, [open, defaultRoster.length, setDefaultRoster]);

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
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restaurar de fábrica
          </button>
          <Button size="sm" onClick={onClose}>
            Listo ({defaultRoster.length})
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
          <div className="w-28 shrink-0">
            <Select
              value={level}
              onChange={(e) => setLevel(Number(e.target.value) as PlayerLevel)}
            >
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {chicks(l.value)} {l.label}
                </option>
              ))}
            </Select>
          </div>
          <Button size="md" onClick={handleAdd} disabled={!name.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Listado editable */}
        {defaultRoster.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Lista vacía"
            description="Agrega personas con el formulario de arriba."
          />
        ) : (
          <ul className="max-h-[50vh] space-y-1.5 overflow-y-auto">
            {defaultRoster.map((entry, i) => (
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
                <div className="w-28 shrink-0">
                  <Select
                    value={entry.level}
                    onChange={(e) =>
                      updateDefaultEntry(i, {
                        level: Number(e.target.value) as PlayerLevel,
                      })
                    }
                    className="h-9 text-xs"
                  >
                    {LEVELS.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.value} · {l.label}
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

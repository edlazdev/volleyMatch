import { useEffect, useMemo, useState } from 'react';
import { Check, CheckCheck, UserCheck } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { cn } from '@/utils/cn';
import type { RosterEntry } from '@/store/useVolleyStore';

interface SelectParticipantsModalProps {
  open: boolean;
  /** Lista base de la que se eligen los participantes. */
  roster: RosterEntry[];
  /** Cupo exacto requerido (equipos × 6). */
  capacity: number;
  teamCount: number;
  onClose: () => void;
  onConfirm: (entries: RosterEntry[]) => void;
}

export function SelectParticipantsModal({
  open,
  roster,
  capacity,
  teamCount,
  onClose,
  onConfirm,
}: SelectParticipantsModalProps) {
  // Conjunto de índices seleccionados.
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // Al abrir, preseleccionamos hasta llenar el cupo.
  useEffect(() => {
    if (!open) return;
    const initial = new Set<number>();
    for (let i = 0; i < roster.length && i < capacity; i++) initial.add(i);
    setSelected(initial);
  }, [open, roster, capacity]);

  const toggle = (index: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  const allSelected = selected.size === roster.length && roster.length > 0;

  const toggleAll = () =>
    setSelected(
      allSelected ? new Set() : new Set(roster.map((_, i) => i)),
    );

  const chosen = useMemo(
    () => roster.filter((_, i) => selected.has(i)),
    [roster, selected],
  );

  const count = chosen.length;
  const exact = count === capacity;
  const tone = exact
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-amber-600 dark:text-amber-400';

  const handleConfirm = () => {
    if (count === 0) return;
    onConfirm(chosen);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Elegir participantes"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className={cn('text-xs font-semibold', tone)}>
            {count} / {capacity} seleccionados
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleConfirm} disabled={count === 0}>
              <UserCheck className="h-4 w-4" />
              Usar {count || ''}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Marca a los que jugarán. Cupo para{' '}
            <span className="font-semibold">{teamCount} equipos</span> ={' '}
            <span className="font-semibold">{capacity}</span>.
          </p>
          <button
            onClick={toggleAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            {allSelected ? 'Ninguno' : 'Todos'}
          </button>
        </div>

        <ul className="max-h-[55vh] space-y-1.5 overflow-y-auto">
          {roster.map((p, i) => {
            const isOn = selected.has(i);
            return (
              <li key={`${p.name}-${i}`}>
                <button
                  onClick={() => toggle(i)}
                  aria-pressed={isOn}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all',
                    isOn
                      ? 'border-brand-400 bg-brand-50 dark:border-brand-600 dark:bg-brand-950/40'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors',
                      isOn
                        ? 'border-brand-500 bg-brand-500 text-white'
                        : 'border-slate-300 text-transparent dark:border-slate-600',
                    )}
                  >
                    {isOn && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </span>
                  <span className="flex-1 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                    {p.name}
                  </span>
                  <LevelBadge level={p.level} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
}

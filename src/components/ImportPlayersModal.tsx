import { useMemo, useState } from 'react';
import { ClipboardList, Info } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { parseRoster } from '@/utils/parseRoster';
import type { RosterEntry } from '@/store/useVolleyStore';

interface ImportPlayersModalProps {
  open: boolean;
  /** Lugares disponibles para no exceder el cupo. */
  availableSlots: number;
  onClose: () => void;
  onImport: (entries: RosterEntry[]) => void;
}

const PLACEHOLDER = `Pega aquí tu lista (uno por línea). Ejemplos válidos:

1. Juan Pérez 6
2. Pedro Gómez - 5
Carlos Ruiz (4)
Ana Torres`;

export function ImportPlayersModal({
  open,
  availableSlots,
  onClose,
  onImport,
}: ImportPlayersModalProps) {
  const [text, setText] = useState('');

  const parsed = useMemo(() => parseRoster(text), [text]);
  const willImport = parsed.slice(0, availableSlots);
  const overflow = parsed.length - willImport.length;

  const handleImport = () => {
    if (willImport.length === 0) return;
    onImport(willImport);
    setText('');
    onClose();
  };

  const handleClose = () => {
    setText('');
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Importar jugadores"
      onClose={handleClose}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {parsed.length > 0
              ? `${willImport.length} de ${parsed.length} se importarán`
              : 'Sin jugadores detectados'}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleImport}
              disabled={willImport.length === 0}
            >
              <ClipboardList className="h-4 w-4" />
              Importar {willImport.length || ''}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        <div className="flex items-start gap-2 rounded-xl bg-brand-50 px-3 py-2.5 text-xs text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Copia la lista de tu grupo de WhatsApp y pégala. Detectamos el
            nivel si aparece al final del nombre (1–6); si no, se asigna nivel 3
            por defecto.
          </span>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={7}
          autoFocus
          className="w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
        />

        {parsed.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              Vista previa
            </p>
            <ul className="max-h-44 space-y-1 overflow-y-auto rounded-xl border border-slate-100 p-2 dark:border-slate-800">
              {parsed.map((p, i) => {
                const included = i < availableSlots;
                return (
                  <li
                    key={`${p.name}-${i}`}
                    className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-sm ${
                      included
                        ? 'text-slate-800 dark:text-slate-100'
                        : 'text-slate-300 line-through dark:text-slate-600'
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    <LevelBadge level={p.level} />
                  </li>
                );
              })}
            </ul>
            {overflow > 0 && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                {overflow} jugador(es) exceden el cupo disponible
                ({availableSlots}) y no se importarán.
              </p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

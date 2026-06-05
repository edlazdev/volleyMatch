import { useMemo, useState } from 'react';
import { ClipboardList, Info } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { parseRoster } from '@/utils/parseRoster';
import type { RosterEntry } from '@/store/useVolleyStore';
import { useI18n } from '@/i18n';

interface ImportPlayersModalProps {
  open: boolean;
  /** Lugares disponibles para no exceder el cupo. */
  availableSlots: number;
  onClose: () => void;
  onImport: (entries: RosterEntry[]) => void;
}

export function ImportPlayersModal({
  open,
  availableSlots,
  onClose,
  onImport,
}: ImportPlayersModalProps) {
  const { t, tn } = useI18n();
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
      title={t('import.title')}
      onClose={handleClose}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {parsed.length > 0
              ? t('import.willImport', {
                  n: willImport.length,
                  total: parsed.length,
                })
              : t('import.noneDetected')}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            <Button
              size="sm"
              onClick={handleImport}
              disabled={willImport.length === 0}
            >
              <ClipboardList className="h-4 w-4" />
              {t('import.button')} {willImport.length || ''}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        <div className="flex items-start gap-2 rounded-xl bg-brand-50 px-3 py-2.5 text-xs text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{t('import.help')}</span>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('import.placeholder')}
          rows={7}
          autoFocus
          className="w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
        />

        {parsed.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t('import.preview')}
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
                {tn(overflow, 'import.overflow', {
                  n: overflow,
                  slots: availableSlots,
                })}
              </p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

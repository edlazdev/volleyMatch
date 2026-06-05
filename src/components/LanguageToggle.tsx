import { Languages } from 'lucide-react';
import { useI18n, LANGS, LANG_LABELS } from '@/i18n';
import { cn } from '@/utils/cn';

/** Selector de idioma (es/en). */
export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();

  const next = LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length];

  return (
    <button
      onClick={() => setLang(next)}
      aria-label={t('lang.toggle')}
      title={t('lang.toggle')}
      className={cn(
        'inline-flex h-10 items-center gap-1.5 rounded-xl border px-2.5 text-sm font-bold transition-colors',
        'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
        'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
        className,
      )}
    >
      <Languages className="h-4 w-4" />
      {LANG_LABELS[lang]}
    </button>
  );
}

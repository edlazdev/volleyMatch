import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { translations } from './translations';
import type { Lang } from './translations';

export type { Lang } from './translations';
export { LANGS, LANG_LABELS } from './translations';

type Vars = Record<string, string | number>;

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Traduce una clave, interpolando {vars}. */
  t: (key: string, vars?: Vars) => string;
  /** Traduce con plural: usa `${key}_plural` cuando count !== 1. */
  tn: (count: number, key: string, vars?: Vars) => string;
}

const LANG_KEY = 'volley-match:lang';

function getInitialLang(): Lang {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(LANG_KEY);
    if (stored === 'es' || stored === 'en') return stored;
    if (navigator.language?.toLowerCase().startsWith('en')) return 'en';
  }
  return 'es';
}

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getInitialLang);

  useEffect(() => {
    window.localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key: string, vars?: Vars) => {
      const dict = translations[lang];
      const template = dict[key] ?? translations.es[key] ?? key;
      return interpolate(template, vars);
    },
    [lang],
  );

  const tn = useCallback(
    (count: number, key: string, vars?: Vars) => {
      const finalKey = count === 1 ? key : `${key}_plural`;
      return t(finalKey, { count, ...vars });
    },
    [t],
  );

  const value = useMemo(
    () => ({ lang, setLang, t, tn }),
    [lang, t, tn],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

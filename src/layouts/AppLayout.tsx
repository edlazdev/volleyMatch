import type { ReactNode } from 'react';
import { Dribbble, Github, Instagram } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { StepNav } from '@/components/StepNav';
import { useTheme } from '@/hooks/useTheme';
import { useVolleyStore } from '@/store/useVolleyStore';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const screen = useVolleyStore((s) => s.screen);
  const setScreen = useVolleyStore((s) => s.setScreen);
  const hasTeams = useVolleyStore((s) => s.teams.length > 0);

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-slate-50/80 backdrop-blur-lg dark:border-slate-800/70 dark:bg-slate-950/80">
        <div className="mx-auto w-full max-w-5xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-glow">
                <Dribbble className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <h1 className="text-base font-extrabold tracking-tight">
                  Volley<span className="text-brand-600 dark:text-brand-400">Match</span>
                </h1>
                <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                  Equipos equilibrados por nivel
                </p>
              </div>
            </div>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>

          <div className="mt-3">
            <StepNav screen={screen} hasTeams={hasTeams} onChange={setScreen} />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-5 pb-24">
        {children}
      </main>

      <footer className="border-t border-slate-200/70 py-6 dark:border-slate-800/70">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/edlazdev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub de edlazdev"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/_edgar.lazaro/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Edgar Lazaro"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-pink-50 hover:text-pink-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-pink-950/40 dark:hover:text-pink-400"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
          <p className="text-center text-xs text-slate-400">
            Volley Match · Hecho por{' '}
            <a
              href="https://github.com/edlazdev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
            >
              edlazdev
            </a>{' '}
            · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

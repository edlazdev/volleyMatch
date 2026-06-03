import { Moon, Sun } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
  className?: string;
}

export function ThemeToggle({ theme, onToggle, className }: ThemeToggleProps) {
  const isDark = theme === 'dark';
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors',
        'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
        'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
        className,
      )}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

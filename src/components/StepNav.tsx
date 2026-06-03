import { ListChecks, Swords, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Screen } from '@/types';
import { cn } from '@/utils/cn';

interface StepNavProps {
  screen: Screen;
  hasTeams: boolean;
  onChange: (screen: Screen) => void;
}

const STEPS: { key: Screen; label: string; icon: LucideIcon }[] = [
  { key: 'config', label: 'Configuración', icon: ListChecks },
  { key: 'teams', label: 'Equipos', icon: Users },
  { key: 'matches', label: 'Enfrentamientos', icon: Swords },
];

export function StepNav({ screen, hasTeams, onChange }: StepNavProps) {
  return (
    <nav className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
      {STEPS.map((step) => {
        const active = step.key === screen;
        const locked = step.key !== 'config' && !hasTeams;
        const Icon = step.icon;
        return (
          <button
            key={step.key}
            disabled={locked}
            onClick={() => onChange(step.key)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold transition-all sm:text-sm',
              active
                ? 'bg-white text-brand-700 shadow-soft dark:bg-slate-950 dark:text-brand-300'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
              locked && 'cursor-not-allowed opacity-40 hover:text-slate-500',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="hidden xs:inline sm:inline">{step.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

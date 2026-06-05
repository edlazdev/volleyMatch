import { ArrowLeftRight, Lightbulb } from 'lucide-react';
import type { SwapSuggestion, Team } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { useI18n } from '@/i18n';

interface SuggestionCardProps {
  suggestions: SwapSuggestion[];
  teamsById: Map<string, Team>;
  onApply: (suggestion: SwapSuggestion) => void;
}

export function SuggestionCard({
  suggestions,
  teamsById,
  onApply,
}: SuggestionCardProps) {
  const { t } = useI18n();
  if (suggestions.length === 0) return null;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-amber-50/60 px-4 py-3 dark:border-slate-800 dark:bg-amber-950/30">
        <Lightbulb className="h-4 w-4 text-amber-500" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {t('suggest.title')}
        </h3>
      </div>

      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {suggestions.map((s, i) => {
          const teamA = teamsById.get(s.teamAId);
          const teamB = teamsById.get(s.teamBId);
          return (
            <li key={i} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-800 dark:text-slate-100">
                    {s.playerA.name}{' '}
                    <LevelBadge level={s.playerA.level} className="ml-0.5" />
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {teamA?.name}
                  </p>
                </div>

                <ArrowLeftRight className="h-4 w-4 shrink-0 text-brand-500" />

                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-800 dark:text-slate-100">
                    {s.playerB.name}{' '}
                    <LevelBadge level={s.playerB.level} className="ml-0.5" />
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {teamB?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('suggest.diff')}{' '}
                  <span className="font-semibold text-rose-500">
                    {s.currentSpread}
                  </span>{' '}
                  →{' '}
                  <span className="font-semibold text-emerald-500">
                    {s.projectedSpread}
                  </span>
                </p>
                <Button size="sm" variant="secondary" onClick={() => onApply(s)}>
                  {t('suggest.apply')}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

import { useEffect, useMemo } from 'react';
import { Swords, Trophy, Users } from 'lucide-react';
import { useVolleyStore } from '@/store/useVolleyStore';
import { useTeamData } from '@/hooks/useTeamData';
import { MatchCard } from '@/components/MatchCard';
import { BracketView } from '@/components/BracketView';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useI18n } from '@/i18n';

export function MatchesPage() {
  const { t, tn } = useI18n();
  const matches = useVolleyStore((s) => s.matches);
  const bracket = useVolleyStore((s) => s.bracket);
  const format = useVolleyStore((s) => s.format);
  const setFormat = useVolleyStore((s) => s.setFormat);
  const setMatchWinner = useVolleyStore((s) => s.setMatchWinner);
  const regenerateBracket = useVolleyStore((s) => s.regenerateBracket);
  const setScreen = useVolleyStore((s) => s.setScreen);

  const { teams, metricsByTeam } = useTeamData();

  const teamsById = useMemo(
    () => new Map(teams.map((t) => [t.id, t])),
    [teams],
  );

  const accentByTeam = useMemo(
    () => new Map(teams.map((t, i) => [t.id, i])),
    [teams],
  );

  // Si se pide la llave y aún no existe (estado previo), la generamos.
  useEffect(() => {
    if (format === 'knockout' && bracket.length === 0 && teams.length >= 2) {
      regenerateBracket();
    }
  }, [format, bracket.length, teams.length, regenerateBracket]);

  if (teams.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={t('matches.empty.title')}
        description={t('matches.empty.desc')}
        action={
          <Button onClick={() => setScreen('config')}>
            {t('teams.goConfig')}
          </Button>
        }
      />
    );
  }

  const isKnockout = format === 'knockout';

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">
            {t('matches.title')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isKnockout
              ? t('matches.knockoutSub')
              : tn(matches.length, 'matches.rrSub', { n: matches.length })}
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
          {isKnockout ? (
            <Trophy className="h-3.5 w-3.5" />
          ) : (
            <Swords className="h-3.5 w-3.5" />
          )}
          {t('matches.teamsBadge', { n: teams.length })}
        </span>
      </div>

      <SegmentedControl
        value={format}
        options={[
          { value: 'round-robin', label: t('matches.format.rr') },
          { value: 'knockout', label: t('matches.format.ko') },
        ]}
        onChange={setFormat}
      />

      {isKnockout ? (
        <BracketView
          bracket={bracket}
          teamsById={teamsById}
          accentByTeam={accentByTeam}
          onPick={setMatchWinner}
          onRegenerate={regenerateBracket}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              teamsById={teamsById}
              metricsByTeam={metricsByTeam}
              accentByTeam={accentByTeam}
            />
          ))}
        </div>
      )}

      <div className="sticky bottom-4 z-20 pt-2">
        <Button
          fullWidth
          size="lg"
          variant="secondary"
          onClick={() => setScreen('teams')}
        >
          <Users className="h-5 w-5" />
          {t('matches.back')}
        </Button>
      </div>
    </div>
  );
}

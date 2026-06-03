import { useMemo } from 'react';
import { Swords, Users } from 'lucide-react';
import { useVolleyStore } from '@/store/useVolleyStore';
import { useTeamData } from '@/hooks/useTeamData';
import { MatchCard } from '@/components/MatchCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';

export function MatchesPage() {
  const matches = useVolleyStore((s) => s.matches);
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

  if (teams.length === 0 || matches.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No hay enfrentamientos"
        description="Genera los equipos primero para calcular el calendario de partidos."
        action={
          <Button onClick={() => setScreen('config')}>Ir a configuración</Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">
            Enfrentamientos
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Round robin · {matches.length}{' '}
            {matches.length === 1 ? 'partido' : 'partidos'}
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
          <Swords className="h-3.5 w-3.5" />
          {teams.length} equipos
        </span>
      </div>

      <Card className="space-y-3 bg-transparent p-0 shadow-none dark:bg-transparent" style={{ border: 'none' }}>
        <div className="grid grid-cols-1 gap-3">
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
      </Card>

      <div className="sticky bottom-4 z-20 pt-2">
        <Button
          fullWidth
          size="lg"
          variant="secondary"
          onClick={() => setScreen('teams')}
        >
          <Users className="h-5 w-5" />
          Volver a equipos
        </Button>
      </div>
    </div>
  );
}

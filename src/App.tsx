import { AppLayout } from '@/layouts/AppLayout';
import { ConfigPage } from '@/pages/ConfigPage';
import { TeamsPage } from '@/pages/TeamsPage';
import { MatchesPage } from '@/pages/MatchesPage';
import { useVolleyStore } from '@/store/useVolleyStore';

export default function App() {
  const screen = useVolleyStore((s) => s.screen);

  return (
    <AppLayout>
      {screen === 'config' && <ConfigPage />}
      {screen === 'teams' && <TeamsPage />}
      {screen === 'matches' && <MatchesPage />}
    </AppLayout>
  );
}

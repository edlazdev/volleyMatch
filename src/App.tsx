import { AppLayout } from '@/layouts/AppLayout';
import { LandingPage } from '@/pages/LandingPage';
import { ConfigPage } from '@/pages/ConfigPage';
import { TeamsPage } from '@/pages/TeamsPage';
import { MatchesPage } from '@/pages/MatchesPage';
import { useVolleyStore } from '@/store/useVolleyStore';

export default function App() {
  const screen = useVolleyStore((s) => s.screen);

  return (
    <AppLayout>
      {screen === 'landing' && <LandingPage />}
      {screen === 'config' && <ConfigPage />}
      {screen === 'teams' && <TeamsPage />}
      {screen === 'matches' && <MatchesPage />}
    </AppLayout>
  );
}

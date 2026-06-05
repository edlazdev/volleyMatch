import {
  ArrowLeftRight,
  ClipboardList,
  Globe,
  ListChecks,
  Scale,
  Sparkles,
  Trophy,
  Users,
  WifiOff,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useVolleyStore } from '@/store/useVolleyStore';
import { useI18n } from '@/i18n';
import { LEVELS } from '@/data/levels';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LevelBadge } from '@/components/ui/LevelBadge';

interface Feature {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  accent: string;
}

// Orden por impacto: balance y torneo primero.
const FEATURES: Feature[] = [
  { icon: Scale, titleKey: 'landing.f.balance.title', descKey: 'landing.f.balance.desc', accent: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300' },
  { icon: Trophy, titleKey: 'landing.f.tournament.title', descKey: 'landing.f.tournament.desc', accent: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300' },
  { icon: ArrowLeftRight, titleKey: 'landing.f.suggest.title', descKey: 'landing.f.suggest.desc', accent: 'bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300' },
  { icon: ClipboardList, titleKey: 'landing.f.import.title', descKey: 'landing.f.import.desc', accent: 'bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300' },
  { icon: Users, titleKey: 'landing.f.roster.title', descKey: 'landing.f.roster.desc', accent: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300' },
  { icon: Sparkles, titleKey: 'landing.f.levels.title', descKey: 'landing.f.levels.desc', accent: 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300' },
  { icon: Globe, titleKey: 'landing.f.i18n.title', descKey: 'landing.f.i18n.desc', accent: 'bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300' },
  { icon: WifiOff, titleKey: 'landing.f.offline.title', descKey: 'landing.f.offline.desc', accent: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' },
];

const STEPS = [
  { icon: ListChecks, titleKey: 'landing.how.s1.title', descKey: 'landing.how.s1.desc' },
  { icon: Users, titleKey: 'landing.how.s2.title', descKey: 'landing.how.s2.desc' },
  { icon: Trophy, titleKey: 'landing.how.s3.title', descKey: 'landing.how.s3.desc' },
];

const STATS = [
  'landing.stats.teams',
  'landing.stats.levels',
  'landing.stats.langs',
  'landing.stats.offline',
];

export function LandingPage() {
  const { t } = useI18n();
  const setScreen = useVolleyStore((s) => s.setScreen);
  const start = () => setScreen('config');

  return (
    <div className="space-y-14 animate-fade-in pb-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-brand-700 via-brand-600 to-accent-500 px-6 py-12 text-white shadow-glow dark:border-slate-800 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_15%_15%,white,transparent_35%),radial-gradient(circle_at_85%_0%,white,transparent_30%)]" />
        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">
              {t('landing.hero.badge')}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              {t('landing.hero.title')}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/90 lg:mx-0 sm:text-base">
              {t('landing.hero.subtitle')}
            </p>
            <div className="mt-6 flex justify-center lg:justify-start">
              <Button
                variant="secondary"
                size="lg"
                onClick={start}
                className="!border-transparent !bg-white !text-brand-700 hover:!bg-white/90 active:!bg-white/80"
              >
                <Sparkles className="h-5 w-5" />
                {t('landing.hero.cta')}
              </Button>
            </div>
            <p className="mt-3 text-xs text-white/80">{t('landing.hero.note')}</p>

            {/* Stats */}
            <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
              {STATS.map((k) => (
                <span
                  key={k}
                  className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur"
                >
                  {t(k)}
                </span>
              ))}
            </div>
          </div>

          {/* Product preview */}
          <div className="relative">
            <img
              src="/screenshots/teams.png"
              alt={t('landing.preview.alt')}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="w-full rounded-2xl border border-white/20 shadow-2xl ring-1 ring-black/5"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <h3 className="mb-6 text-center text-lg font-extrabold tracking-tight sm:text-2xl">
          {t('landing.features.title')}
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, titleKey, descKey, accent }) => (
            <Card
              key={titleKey}
              className="p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow"
            >
              <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {t(titleKey)}
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t(descKey)}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section>
        <h3 className="mb-6 text-center text-lg font-extrabold tracking-tight sm:text-2xl">
          {t('landing.how.title')}
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, titleKey, descKey }, i) => (
            <Card key={titleKey} className="relative p-5 text-center">
              <span className="absolute right-3 top-2 text-3xl font-black text-slate-100 dark:text-slate-800">
                {i + 1}
              </span>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-sky-500 text-white shadow-soft">
                <Icon className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {t(titleKey)}
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t(descKey)}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Levels showcase */}
      <section>
        <h3 className="mb-4 text-center text-lg font-extrabold tracking-tight sm:text-2xl">
          {t('landing.levels.title')}
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {LEVELS.map((lvl) => (
            <LevelBadge key={lvl.value} level={lvl.value} showLabel />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl">
          {t('landing.cta.title')}
        </h3>
        <div className="mt-5 flex justify-center">
          <Button size="lg" onClick={start} className="shadow-glow">
            <Sparkles className="h-5 w-5" />
            {t('landing.cta.button')}
          </Button>
        </div>
      </section>
    </div>
  );
}

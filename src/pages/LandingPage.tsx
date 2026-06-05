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
}

const FEATURES: Feature[] = [
  { icon: Scale, titleKey: 'landing.f.balance.title', descKey: 'landing.f.balance.desc' },
  { icon: ArrowLeftRight, titleKey: 'landing.f.suggest.title', descKey: 'landing.f.suggest.desc' },
  { icon: ClipboardList, titleKey: 'landing.f.import.title', descKey: 'landing.f.import.desc' },
  { icon: Users, titleKey: 'landing.f.roster.title', descKey: 'landing.f.roster.desc' },
  { icon: Trophy, titleKey: 'landing.f.tournament.title', descKey: 'landing.f.tournament.desc' },
  { icon: Sparkles, titleKey: 'landing.f.levels.title', descKey: 'landing.f.levels.desc' },
  { icon: Globe, titleKey: 'landing.f.i18n.title', descKey: 'landing.f.i18n.desc' },
  { icon: WifiOff, titleKey: 'landing.f.offline.title', descKey: 'landing.f.offline.desc' },
];

const STEPS = [
  { icon: ListChecks, titleKey: 'landing.how.s1.title', descKey: 'landing.how.s1.desc' },
  { icon: Users, titleKey: 'landing.how.s2.title', descKey: 'landing.how.s2.desc' },
  { icon: Trophy, titleKey: 'landing.how.s3.title', descKey: 'landing.how.s3.desc' },
];

export function LandingPage() {
  const { t } = useI18n();
  const setScreen = useVolleyStore((s) => s.setScreen);
  const start = () => setScreen('config');

  return (
    <div className="space-y-12 animate-fade-in pb-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-brand-600 to-sky-500 px-6 py-12 text-center text-white shadow-glow dark:border-slate-800 sm:py-16">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_0%,white,transparent_30%)]" />
        <div className="relative mx-auto max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">
            {t('landing.hero.badge')}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {t('landing.hero.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/90 sm:text-base">
            {t('landing.hero.subtitle')}
          </p>
          <div className="mt-6 flex justify-center">
            <Button
              size="lg"
              onClick={start}
              className="bg-white text-brand-700 hover:bg-white/90 active:bg-white/80 focus-visible:ring-white"
            >
              <Sparkles className="h-5 w-5" />
              {t('landing.hero.cta')}
            </Button>
          </div>
          <p className="mt-3 text-xs text-white/80">{t('landing.hero.note')}</p>
        </div>
      </section>

      {/* Features */}
      <section>
        <h3 className="mb-5 text-center text-lg font-extrabold tracking-tight sm:text-xl">
          {t('landing.features.title')}
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, titleKey, descKey }) => (
            <Card key={titleKey} className="p-4">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
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
        <h3 className="mb-5 text-center text-lg font-extrabold tracking-tight sm:text-xl">
          {t('landing.how.title')}
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, titleKey, descKey }, i) => (
            <Card key={titleKey} className="relative p-5 text-center">
              <span className="absolute right-3 top-3 text-3xl font-black text-slate-100 dark:text-slate-800">
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
        <h3 className="mb-4 text-center text-lg font-extrabold tracking-tight sm:text-xl">
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
        <h3 className="text-xl font-extrabold tracking-tight">
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

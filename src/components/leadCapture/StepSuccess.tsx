import { useEffect, useState } from 'react';
import { CheckCircle2, BookOpen, PoundSterling, Users, ArrowRight, ShoppingBag, Download } from 'lucide-react';
import type { CareerTrack } from './inference';
import type { EbookViewData } from '../../contexts/ClickTrackingContext';

interface RecommendedEbook {
  slug: string;
  title: string;
  price_gbp: number;
  short_description: string;
}

interface StepSuccessProps {
  primaryTrack: CareerTrack | null;
  onClose: () => void;
  recordedEbookData: EbookViewData[];
}

const nextSteps = [
  {
    icon: BookOpen,
    label: 'Explore Career Guides',
    sub: 'Step-by-step progression guides',
    href: '/guides',
    color: 'text-brand-600',
    bg: 'bg-brand-50',
  },
  {
    icon: PoundSterling,
    label: 'Check Your Funding',
    sub: 'See what grants you qualify for',
    href: '/funding',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Users,
    label: 'Browse Roles',
    sub: 'Find your next step in care',
    href: '/roles',
    color: 'text-accent-600',
    bg: 'bg-accent-50',
  },
];

const categoryToSlug: Record<string, string> = {
  family_behaviour_support: 'calm-in-the-storm',
  home_care_recovery: 'living-well-with-dementia',
  navigating_care_system: 'finding-and-funding-care',
  carer_wellbeing: 'running-on-empty',
  printable_packs: 'ultimate-caregiver-binder',
};

export default function StepSuccess({ primaryTrack, onClose, recordedEbookData }: StepSuccessProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onClose]);

  const trackMessage = primaryTrack
    ? `Your ${primaryTrack.label} guide is on its way`
    : 'Your personalised guide is on its way';

  const progress = ((5 - countdown) / 5) * 100;

  const seenCategories = recordedEbookData.map((e) => e.category).filter(Boolean);
  const topCategory = seenCategories.length > 0
    ? seenCategories.sort((a, b) =>
        seenCategories.filter((v) => v === a).length - seenCategories.filter((v) => v === b).length
      )[0]
    : null;
  const recommendedSlug = topCategory ? categoryToSlug[topCategory] : 'home-safety-checklist-dementia';

  const recommendations: RecommendedEbook[] = [
    {
      slug: recommendedSlug,
      title: topCategory === 'family_behaviour_support'
        ? 'Calm in the Storm'
        : topCategory === 'home_care_recovery'
        ? 'Living Well with Dementia at Home'
        : topCategory === 'navigating_care_system'
        ? 'Finding & Funding Care'
        : topCategory === 'carer_wellbeing'
        ? 'Running on Empty'
        : 'Home Safety Checklist for Dementia',
      price_gbp: topCategory ? 14.99 : 0,
      short_description: topCategory
        ? 'The complete guide with printable toolkit sheets you can use today.'
        : 'A free room-by-room safety checklist you can print right now.',
    },
  ];

  return (
    <div className="px-6 py-8 animate-fade-in-up space-y-6 text-center">
      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20 mb-4">
          <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30" />
          <div className="relative w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
            <CheckCircle2 size={36} className="text-emerald-500" strokeWidth={1.5} />
          </div>
        </div>
        <h2 className="text-2xl font-display font-bold text-slate-900">{trackMessage}</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-xs leading-relaxed">
          Check your inbox shortly. In the meantime, here is a guide we think will help:
        </p>
      </div>

      <div className="space-y-2 text-left">
        {recommendations.map((rec) => {
          const isFree = Number(rec.price_gbp) === 0;
          return (
            <a
              key={rec.slug}
              href={`/ebooks/${rec.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-teal-100 bg-teal-50/50 hover:border-teal-300 hover:shadow-sm transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                {isFree ? <Download size={16} className="text-teal-600" /> : <ShoppingBag size={16} className="text-teal-600" />}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-slate-800">{rec.title}</p>
                <p className="text-xs text-slate-500">{rec.short_description}</p>
                <p className="text-[11px] font-semibold text-teal-600 mt-0.5">
                  {isFree ? 'Free Download' : `£${rec.price_gbp.toFixed(2)}`}
                </p>
              </div>
              <ArrowRight size={14} className="text-slate-300 group-hover:text-teal-500 transition-colors" />
            </a>
          );
        })}
      </div>

      <div className="space-y-2 text-left">
        {nextSteps.map((step) => {
          const Icon = step.icon;
          return (
            <a
              key={step.href}
              href={step.href}
              onClick={onClose}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm transition-all group"
            >
              <div className={`w-9 h-9 rounded-xl ${step.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={16} className={step.color} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-slate-800">{step.label}</p>
                <p className="text-xs text-slate-500">{step.sub}</p>
              </div>
              <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </a>
          );
        })}
      </div>

      <div className="space-y-2">
        <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
          <div
            className="h-1 bg-emerald-400 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-400">Closing in {countdown}s</p>
      </div>
    </div>
  );
}

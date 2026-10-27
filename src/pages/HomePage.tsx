import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { createCheckoutSession } from '../services/stripeCheckout';
import SEOHead from '../components/SEOHead';
import NewsTicker from '../components/NewsTicker';
import { useClickTracking } from '../contexts/ClickTrackingContext';
import {
  BookOpen,
  Download,
  ShoppingBag,
  FileText,
  Heart,
  Home as HomeIcon,
  Brain,
  ArrowRight,
  Check,
  Star,
  Loader2,
  Lock,
  Sparkles,
  Sun,
  HelpCircle,
} from 'lucide-react';

interface Ebook {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  cover_image_url: string | null;
  price_gbp: number;
  stripe_price_id: string | null;
  page_count: number | null;
  category: string;
  included_toolkit_items: string[];
  is_featured: boolean;
  format: string;
}

const categoryLabels: Record<string, string> = {
  family_behaviour_support: 'Family & Behaviour Support',
  home_care_recovery: 'Home Care & Recovery',
  navigating_care_system: 'Navigating the Care System',
  carer_wellbeing: 'Carer Wellbeing',
  printable_packs: 'Digital Packs',
};

const categoryCards = [
  {
    key: 'family_behaviour_support',
    label: 'Family & Behaviour Support',
    description: 'De-escalation, communication, and sensory support for parents and support workers.',
    icon: Brain,
    span: 'md:col-span-2',
  },
  {
    key: 'home_care_recovery',
    label: 'Home Care & Recovery',
    description: 'Dementia, hospital discharge, mobility, and mealtimes.',
    icon: HomeIcon,
    span: '',
  },
  {
    key: 'navigating_care_system',
    label: 'Navigating the Care System',
    description: 'Funding, assessments, and care coordination.',
    icon: FileText,
    span: '',
  },
  {
    key: 'carer_wellbeing',
    label: 'Carer Wellbeing',
    description: 'Activities, burnout, and self-care for the long run.',
    icon: Heart,
    span: '',
  },
];

const situationFinder = [
  { label: 'Caring for someone with dementia', category: 'home_care_recovery' },
  { label: 'Managing challenging behaviour', category: 'family_behaviour_support' },
  { label: 'Recovering after hospital or stroke', category: 'home_care_recovery' },
  { label: 'Feeling burned out and exhausted', category: 'carer_wellbeing' },
  { label: 'Navigating care funding and assessments', category: 'navigating_care_system' },
  { label: 'Looking for activities and engagement ideas', category: 'carer_wellbeing' },
];

const testimonials = [
  {
    name: 'Rachel M.',
    role: 'Daughter caring for Mum with dementia',
    text: "The dementia guide was the first thing I read that actually made me feel capable instead of terrified. The conversation scripts for sundowning alone were worth every penny.",
    img: 'https://images.pexels.com/photos/5960133/pexels-photo-5960133.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'James O.',
    role: 'Support Worker, Supported Living',
    text: "I work 12-hour shifts and do not have time for theory. The de-escalation guide gave me practical steps I used on my very next shift. The ABC tracker is now in every handover folder.",
    img: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Priya K.',
    role: 'Parent of a neurodivergent teenager',
    text: "Beyond Words completely changed how I communicate with my son. The visual schedule cards transformed our mornings from chaos to calm. I cried reading it — in a good way.",
    img: 'https://images.pexels.com/photos/5960345/pexels-photo-5960345.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Tom B.',
    role: "Son managing Dad's care after stroke",
    text: "Bringing Dad home from hospital was terrifying. The First 30 Days guide told me exactly what to do, what to watch for, and when to call the GP. I cannot recommend it enough.",
    img: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

const HERO_PHOTO =
  'https://images.pexels.com/photos/8088598/pexels-photo-8088598.jpeg?auto=compress&cs=tinysrgb&w=1600';

const floatingQuestions = [
  { text: 'How do I handle sundowning?', top: '14%', left: '8%', delay: '0s' },
  { text: 'Is this a meltdown or a shutdown?', top: '22%', left: '62%', delay: '1.5s' },
  { text: 'What do I say to the GP?', top: '40%', left: '14%', delay: '3s' },
  { text: 'How do I get respite?', top: '30%', left: '72%', delay: '2.2s' },
  { text: 'Will he ever eat again?', top: '52%', left: '8%', delay: '4.5s' },
  { text: 'Am I doing this wrong?', top: '58%', left: '66%', delay: '6s' },
];

// ─── Reveal-on-scroll hook ────────────────────────────────────────────────────

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

// ─── Shoppable guide card ─────────────────────────────────────────────────────

function GuideCard({
  ebook,
  onBuy,
  onDownload,
  buyingSlug,
}: {
  ebook: Ebook;
  onBuy: (e: Ebook) => void;
  onDownload: (e: Ebook) => void;
  buyingSlug: string | null;
}) {
  const isFree = Number(ebook.price_gbp) === 0;
  const price = Number(ebook.price_gbp);
  return (
    <article className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_4px_20px_0_rgba(15,23,42,0.05)] hover:shadow-[0_10px_30px_0_rgba(15,23,42,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="relative h-52 overflow-hidden">
        {ebook.cover_image_url && (
          <img
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={ebook.cover_image_url}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-on-surface px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight">
            {categoryLabels[ebook.category] || 'Guide'}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          {isFree ? (
            <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-[11px] font-bold uppercase">
              Free
            </span>
          ) : (
            <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-[11px] font-bold">
              £{price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-headline font-semibold text-on-surface leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {ebook.title}
        </h3>
        <p className="text-sm text-on-surface-variant mb-3 line-clamp-2 flex-1">
          {ebook.short_description}
        </p>
        {ebook.included_toolkit_items && ebook.included_toolkit_items.length > 0 && (
          <div className="mb-4 p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/20">
            <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1 flex items-center gap-1">
              <FileText size={11} /> Includes Toolkit
            </p>
            <p className="text-[11px] text-on-surface-variant line-clamp-1">
              {ebook.included_toolkit_items[0]}
            </p>
          </div>
        )}
        {isFree ? (
          <button
            onClick={() => onDownload(ebook)}
            className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-secondary border border-secondary rounded-lg px-4 py-2.5 hover:bg-secondary-container transition-all"
          >
            <Download size={16} /> Download Free
          </button>
        ) : (
          <button
            onClick={() => onBuy(ebook)}
            disabled={buyingSlug === ebook.slug || !ebook.stripe_price_id}
            className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-on-primary bg-primary rounded-lg px-4 py-2.5 hover:bg-primary-container transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {buyingSlug === ebook.slug ? (
              <><Loader2 size={16} className="animate-spin" /> Redirecting...</>
            ) : !ebook.stripe_price_id ? (
              <><Lock size={16} /> Coming Soon</>
            ) : (
              <><ShoppingBag size={16} /> Buy Now — £{price.toFixed(2)}</>
            )}
          </button>
        )}
      </div>
    </article>
  );
}

// ─── Clarity story section ────────────────────────────────────────────────────

function ClarityStory() {
  const beat1 = useReveal<HTMLDivElement>();
  const beat2 = useReveal<HTMLDivElement>();
  const beat3 = useReveal<HTMLDivElement>();

  return (
    <section className="relative py-24 bg-gradient-to-b from-surface-container-low via-surface-container-low to-surface overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-hero-pulse" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl animate-hero-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-secondary-container/60 text-on-secondary-container rounded-full text-[11px] font-semibold uppercase tracking-wider mb-4">
            Why These Guides
          </span>
          <h2 className="text-headline-lg font-headline text-on-surface mb-3">
            From confusion to clarity
          </h2>
          <p className="text-body-md text-on-surface-variant max-w-2xl mx-auto">
            Every guide is written for the moment you are in — not a textbook for a course you might take one day.
          </p>
        </div>

        {/* Beat 1 — overwhelmed */}
        <div ref={beat1.ref} className={`mb-20 transition-all duration-700 ${beat1.shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 order-2 md:order-1">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle size={18} className="text-tertiary" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-tertiary">1 · You are overwhelmed</span>
              </div>
              <h3 className="text-headline-md font-headline text-on-surface mb-3">
                The house is quiet. The questions are loud.
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                It is 11pm. You are sitting at the kitchen table searching the internet for the fifth time this week.
                Everyone has an opinion. Nobody has a plan. The appointments, the forms, the worry — it piles up.
              </p>
            </div>
            <div className="flex-1 order-1 md:order-2 relative h-56 w-full rounded-2xl bg-white/60 border border-outline-variant/30 overflow-hidden">
              {floatingQuestions.slice(0, 4).map((q, i) => (
                <div
                  key={i}
                  className="absolute bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-on-surface-variant shadow-card border border-slate-100 max-w-[200px] animate-slow-float"
                  style={{ top: q.top, left: q.left, animationDelay: `${i * 0.8}s` }}
                >
                  {q.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Beat 2 — open the guide */}
        <div ref={beat2.ref} className={`mb-20 transition-all duration-700 ${beat2.shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 relative h-64 w-full rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-outline-variant/30 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-48 h-1 bg-gradient-to-r from-transparent via-amber-200/60 to-transparent animate-light-sweep" />
              </div>
              <div className={`relative z-10 ${beat2.shown ? 'animate-book-rise' : 'opacity-0'}`}>
                <div className="w-28 h-36 rounded-lg bg-gradient-to-br from-primary to-secondary shadow-glow-lg animate-book-glow flex items-center justify-center">
                  <BookOpen size={40} className="text-white" />
                </div>
              </div>
              <Sparkles size={20} className="absolute top-6 right-8 text-amber-400 animate-pulse-soft" />
              <Sun size={18} className="absolute bottom-8 left-10 text-amber-300 animate-pulse-soft" style={{ animationDelay: '1s' }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={18} className="text-primary" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">2 · Open the guide</span>
              </div>
              <h3 className="text-headline-md font-headline text-on-surface mb-3">
                Then you open the right guide.
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                No jargon, no theory you cannot use. Just plain English written by people who have sat at that same table.
                You read the chapter that matches your tonight. The questions start to thin out. Something loosens.
              </p>
            </div>
          </div>
        </div>

        {/* Beat 3 — you have a plan */}
        <div ref={beat3.ref} className={`transition-all duration-700 ${beat3.shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 order-2 md:order-1">
              <div className="flex items-center gap-2 mb-3">
                <Check size={18} className="text-secondary" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">3 · You have a plan</span>
              </div>
              <h3 className="text-headline-md font-headline text-on-surface mb-3">
                Now you know exactly what to do tonight.
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Print the toolkit sheet. Stick it on the fridge. Bring it to the next handover. The guide told you what to do,
                what to watch for, and when to call for help. You are still tired — but you are not lost.
              </p>
              <Link to="/ebooks" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                Find your guide <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex-1 order-1 md:order-2 relative h-64 w-full rounded-2xl bg-white/70 border border-outline-variant/30 overflow-hidden p-6">
              {[
                { label: 'Sundowning — evening routine', delay: '0s' },
                { label: 'GP call checklist', delay: '0.15s' },
                { label: 'Medication tracker', delay: '0.3s' },
              ].map((sheet, i) => (
                <div
                  key={i}
                  className={`mb-3 bg-white rounded-lg border border-slate-200 shadow-card px-4 py-3 flex items-center gap-3 ${beat3.shown ? 'animate-clarity-sheet' : 'opacity-0'}`}
                  style={{ animationDelay: sheet.delay, animationFillMode: 'forwards' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                    <FileText size={14} />
                  </div>
                  <span className="text-sm font-medium text-on-surface">{sheet.label}</span>
                  <Check size={14} className="text-secondary ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingSlug, setBuyingSlug] = useState<string | null>(null);
  const { recordEbookView } = useClickTracking();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('ebooks')
        .select('id, title, slug, short_description, cover_image_url, price_gbp, stripe_price_id, page_count, category, included_toolkit_items, is_featured, format')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });
      setEbooks((data || []) as unknown as Ebook[]);
      setLoading(false);
    })();
  }, []);

  const freeGuide = ebooks.find((e) => Number(e.price_gbp) === 0);
  const popularGuides = ebooks.filter((e) => Number(e.price_gbp) > 0).slice(0, 4);

  const handleBuy = async (ebook: Ebook) => {
    recordEbookView(ebook.title, { slug: ebook.slug, category: ebook.category });
    if (!ebook.stripe_price_id) return;
    setBuyingSlug(ebook.slug);
    try {
      const { url } = await createCheckoutSession(ebook.stripe_price_id, ebook.slug);
      window.location.href = url;
    } catch {
      setBuyingSlug(null);
    }
  };

  const handleDownload = (ebook: Ebook) => {
    recordEbookView(ebook.title, { slug: ebook.slug, category: ebook.category });
    window.open(`/read/${ebook.slug}`, '_blank', 'noopener,noreferrer');
  };

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'CareLearn — Practical Care Guides for Families and Carers',
    description: 'Plain-English care ebooks and toolkits for families, unpaid carers, and frontline support workers.',
    url: 'https://carelearn.site/',
  };

  return (
    <>
      <SEOHead
        title="CareLearn — Practical Care Guides for Families and Carers"
        description="Plain-English care ebooks with toolkits. De-escalation, dementia care, hospital recovery, burnout, and more. Read the guide, use the toolkit today."
        canonical="/"
        jsonLd={homeJsonLd}
      />
      <div className="bg-surface">
        {/* ─── Cinematic Hero ─── */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-slate-900">
          {/* Background family photo */}
          <div className="absolute inset-0">
            <img
              src={HERO_PHOTO}
              alt="A carer comforting a loved one at home"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-primary/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/40" />
          </div>

          {/* Floating question fragments */}
          <div className="absolute inset-0 pointer-events-none hidden md:block">
            {floatingQuestions.map((q, i) => (
              <div
                key={i}
                className="absolute bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white/80 shadow-lg animate-question-drift"
                style={{ top: q.top, left: q.left, animationDelay: q.delay }}
              >
                {q.text}
              </div>
            ))}
          </div>

          {/* Warm glow + light sweep */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-amber-300/10 rounded-full blur-3xl animate-hero-pulse" />
            <div className="absolute left-0 top-0 w-full h-full overflow-hidden">
              <div className="absolute top-0 h-full w-40 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-light-sweep" />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20 pb-12">
            <div className="hidden md:block mb-4">
              <div className="max-w-md">
                <NewsTicker />
              </div>
            </div>
            <div className="md:hidden mb-4">
              <NewsTicker />
            </div>

            <div className="max-w-2xl">
              <span className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-1.5 rounded-full text-label-sm uppercase tracking-wider mb-6">
                Practical Care Guides
              </span>
              <h1 className="text-4xl sm:text-5xl font-headline font-bold text-white mb-6 leading-[1.15]">
                Practical care guides <span className="text-amber-300">you can use today</span>.
              </h1>
              <p className="text-lg text-slate-200 mb-8 max-w-xl leading-relaxed">
                Plain-English, jargon-free ebooks with toolkits for families, unpaid carers, and frontline support workers. Read the guide, use the sheets today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/ebooks" className="btn-primary inline-flex items-center justify-center gap-2 text-label-md !bg-white !text-primary hover:!bg-slate-100">
                  <BookOpen size={18} /> Browse All Guides
                </Link>
                {freeGuide && (
                  <Link to="/ebooks" className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 text-white text-label-md font-semibold px-6 py-3 hover:bg-white/10 transition-all">
                    <Download size={18} /> Get a Free Guide
                  </Link>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-label-sm text-slate-300">Loved by families and carers</span>
                </div>
                <div className="flex items-center gap-2 text-label-sm text-slate-300">
                  <Check size={14} className="text-amber-300" /> Read + Use formula
                </div>
                <div className="flex items-center gap-2 text-label-sm text-slate-300">
                  <Check size={14} className="text-amber-300" /> Toolkits included
                </div>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-white/50">
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
          </div>
        </section>

        {/* ─── Shoppable All Guides ─── */}
        <section className="py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={18} className="text-secondary" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Ready to Buy</span>
                </div>
                <h2 className="text-headline-lg font-headline text-on-surface mb-2">
                  Every guide, ready right now
                </h2>
                <p className="text-body-md text-on-surface-variant max-w-xl">
                  Buy any guide instantly and open it in your browser — no waiting, no app. Each one comes with a printable toolkit.
                </p>
              </div>
              <Link to="/ebooks" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all shrink-0">
                View All Guides <ArrowRight size={16} />
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : ebooks.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen size={40} className="text-on-surface-variant opacity-30 mx-auto mb-3" />
                <p className="text-body-md text-on-surface-variant">Guides are on the way. Check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ebooks.map((ebook) => (
                  <GuideCard
                    key={ebook.id}
                    ebook={ebook}
                    onBuy={handleBuy}
                    onDownload={handleDownload}
                    buyingSlug={buyingSlug}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── Clarity Story ─── */}
        <ClarityStory />

        {/* ─── Situation Finder ─── */}
        <section className="py-20 bg-surface-container-low">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-headline-lg font-headline text-on-surface mb-3">Find the Right Guide for Your Situation</h2>
            <p className="text-body-md text-on-surface-variant mb-10 max-w-2xl mx-auto">
              Pick the situation that sounds most like yours and we will show you the guides that can help.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {situationFinder.map((sit) => {
                const Icon = categoryCards.find((c) => c.key === sit.category)?.icon || BookOpen;
                return (
                  <Link
                    key={sit.label}
                    to={`/ebooks?category=${sit.category}`}
                    className="group bg-white rounded-xl border border-slate-200 p-5 text-left hover:border-secondary hover:shadow-elevation-2 transition-all flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-label-md font-medium text-on-surface group-hover:text-primary transition-colors">{sit.label}</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">{categoryLabels[sit.category]}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Category Bento ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-headline-lg font-headline text-on-surface mb-4">Browse by Life Situation</h2>
              <p className="text-body-md text-on-surface-variant max-w-2xl mx-auto">
                Our guides are organized around real-life care situations — not clinical jargon. Find exactly what you need.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[520px]">
              {categoryCards.map((cat, i) => {
                const Icon = cat.icon;
                const count = ebooks.filter((e) => e.category === cat.key).length;
                return (
                  <Link
                    key={cat.key}
                    to={`/ebooks?category=${cat.key}`}
                    className={`${cat.span} ${i === 0 ? 'md:row-span-2' : ''} bg-white rounded-[1rem] border border-slate-200 p-8 flex flex-col justify-between group cursor-pointer hover:border-secondary hover:shadow-elevation-2 transition-all relative overflow-hidden`}
                  >
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-secondary-container/30 group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10 flex justify-between items-start">
                      <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                        <Icon size={24} />
                      </div>
                      {cat.span && (
                        <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full text-label-sm">Most Popular</span>
                      )}
                    </div>
                    <div className="relative z-10">
                      <h3 className={`text-headline-md font-headline text-on-surface mb-2 ${i === 0 ? 'text-headline-lg' : ''}`}>{cat.label}</h3>
                      <p className="text-body-md text-on-surface-variant mb-3">{cat.description}</p>
                      <span className="text-label-sm text-secondary flex items-center gap-1 group-hover:gap-2 transition-all">
                        {count > 0 ? `${count} guide${count !== 1 ? 's' : ''}` : 'Browse guides'} <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── How It Works ─── */}
        <section className="py-20 bg-surface-container-low">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-headline-lg font-headline text-on-surface mb-3">The Read + Use Formula</h2>
              <p className="text-body-md text-on-surface-variant max-w-2xl mx-auto">
                Every guide follows the same simple approach: practical advice you can read in an evening, paired with toolkit sheets you can use the very next day.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: BookOpen, title: 'Read the Guide', desc: '30-50 pages of plain-English, jargon-free advice written for real families and carers — not textbooks.' },
                { icon: FileText, title: 'Use the Toolkit', desc: 'Every guide includes checklists, trackers, and templates. Stick them on the fridge or keep them in a handover folder.' },
                { icon: Check, title: 'Use It Today', desc: 'No theory, no exams. Just practical steps you can apply on your next shift or the next time things get tough at home.' },
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="bg-white rounded-2xl p-8 border border-slate-200 text-center relative shadow-card hover:shadow-elevation-2 transition-shadow">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-label-sm font-bold">
                      {i + 1}
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto mb-4 mt-2">
                      <Icon size={28} />
                    </div>
                    <h3 className="text-headline-md font-headline font-semibold text-on-surface mb-2">{step.title}</h3>
                    <p className="text-body-md text-on-surface-variant">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Testimonials ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-headline-lg font-headline text-on-surface mb-4">Trusted by Families and Carers</h2>
              <p className="text-body-md text-on-surface-variant">Real people, real care situations, real results.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((t) => (
                <div key={t.name} className="bg-surface-container-low rounded-2xl p-8 border border-slate-100 hover:shadow-card transition-shadow">
                  <div className="flex text-amber-400 mb-6">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-body-lg text-on-surface mb-8 italic">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <img alt={t.name} className="w-12 h-12 rounded-full object-cover" src={t.img} />
                    <div>
                      <h5 className="text-headline-md font-headline text-sm text-on-surface">{t.name}</h5>
                      <p className="text-label-sm text-on-surface-variant">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Community callout ─── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="rounded-2xl bg-gradient-to-br from-primary to-secondary p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8 overflow-hidden relative">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full" />
              <div className="absolute -bottom-8 right-32 w-32 h-32 bg-white/5 rounded-full" />
              <div className="flex-1 text-white relative z-10">
                <span className="inline-block px-3 py-1 bg-white/15 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">Community Hub</span>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">Have a question about caring for someone?</h2>
                <p className="text-slate-100 text-sm sm:text-base leading-relaxed max-w-lg">
                  Get answers from the CareLearn community. Browse real Q&amp;As from families and carers, read in-depth articles, and ask anything — no account required.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 relative z-10 shrink-0">
                <Link to="/community?tab=qa" className="px-6 py-3 bg-white text-primary text-sm font-semibold rounded-xl hover:bg-slate-100 transition-colors text-center">
                  Ask a Question
                </Link>
                <Link to="/community?tab=blog" className="px-6 py-3 bg-white/15 border border-white/30 text-white text-sm font-semibold rounded-xl hover:bg-white/25 transition-colors text-center">
                  Read Articles
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-6 bg-primary rounded-[2rem] p-12 text-center text-on-primary relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary opacity-30 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-tertiary-container opacity-20 rounded-full blur-3xl" />
            <h2 className="text-headline-lg font-headline mb-6 relative z-10">Get your first free guide today</h2>
            <p className="text-body-lg mb-10 text-blue-100 max-w-xl mx-auto relative z-10">
              Join thousands of families and carers using CareLearn. Start with a free download — no sign-up required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link to="/ebooks" className="bg-white text-primary px-8 py-4 rounded-xl text-label-md font-semibold hover:bg-blue-50 transition-all inline-flex items-center justify-center gap-2">
                <Download size={18} /> Get Free Guide
              </Link>
              <Link to="/ebooks" className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-xl text-label-md font-semibold hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2">
                <BookOpen size={18} /> Browse All Guides
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

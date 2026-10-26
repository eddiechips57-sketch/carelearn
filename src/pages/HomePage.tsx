import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import SEOHead from '../components/SEOHead';
import NewsTicker from '../components/NewsTicker';
import { BookOpen, Download, ShoppingBag, FileText, Heart, Home, Brain, Users, ArrowRight, Check, Star } from 'lucide-react';

interface Ebook {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  cover_image_url: string | null;
  price_gbp: number;
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
};

const categoryCards = [
  {
    key: 'family_behaviour_support',
    label: 'Family & Behaviour Support',
    description: 'De-escalation, communication, and sensory support for parents and support workers.',
    icon: Brain,
    image: 'https://images.pexels.com/photos/5960133/pexels-photo-5960133.jpeg?auto=compress&cs=tinysrgb&w=800',
    span: 'md:col-span-2',
  },
  {
    key: 'home_care_recovery',
    label: 'Home Care & Recovery',
    description: 'Dementia, hospital discharge, mobility, and mealtimes.',
    icon: Home,
    image: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=800',
    span: '',
  },
  {
    key: 'navigating_care_system',
    label: 'Navigating the Care System',
    description: 'Funding, assessments, and care coordination.',
    icon: FileText,
    image: 'https://images.pexels.com/photos/7593372/pexels-photo-7593372.jpeg?auto=compress&cs=tinysrgb&w=800',
    span: '',
  },
  {
    key: 'carer_wellbeing',
    label: 'Carer Wellbeing',
    description: 'Activities, burnout, and self-care for the long run.',
    icon: Heart,
    image: 'https://images.pexels.com/photos/7593448/pexels-photo-7593448.jpeg?auto=compress&cs=tinysrgb&w=800',
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

export default function HomePage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('ebooks')
        .select('id, title, slug, short_description, cover_image_url, price_gbp, page_count, category, included_toolkit_items, is_featured, format')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });
      setEbooks((data || []) as unknown as Ebook[]);
      setLoading(false);
    })();
  }, []);

  const freeGuide = ebooks.find((e) => Number(e.price_gbp) === 0);
  const popularGuides = ebooks.filter((e) => Number(e.price_gbp) > 0).slice(0, 4);

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
        {/* Hero */}
        <section className="relative bg-white pt-16 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 flex justify-end pt-4 pb-2">
            <div className="hidden md:block">
              <NewsTicker />
            </div>
          </div>
          <div className="md:hidden px-4 pb-4">
            <NewsTicker />
          </div>
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <span className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-label-sm inline-block mb-6 uppercase tracking-wider">
                Practical Care Guides
              </span>
              <h1 className="text-headline-xl font-headline text-on-surface mb-6">
                Practical care guides <span className="text-primary">you can use today</span>.
              </h1>
              <p className="text-body-lg text-on-surface-variant mb-8 max-w-xl">
                Plain-English, jargon-free ebooks with toolkits for families, unpaid carers, and frontline support workers. Read the guide, use the sheets today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/ebooks" className="btn-primary inline-flex items-center justify-center gap-2 text-label-md">
                  <BookOpen size={18} /> Browse All Guides
                </Link>
                {freeGuide && (
                  <Link to="/ebooks" className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-secondary text-secondary text-label-md font-semibold px-6 py-3 hover:bg-secondary-container transition-all">
                    <Download size={18} /> Get a Free Guide
                  </Link>
                )}
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-label-sm text-on-surface-variant">Loved by families and carers</span>
                </div>
                <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                  <Check size={14} className="text-secondary" /> Read + Use formula
                </div>
                <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                  <Check size={14} className="text-secondary" /> Toolkits included
                </div>
              </div>
            </div>

            {/* Free guide highlight */}
            <div className="flex flex-col gap-4">
              {freeGuide && (
                <div className="bg-gradient-to-br from-secondary-container to-surface-container rounded-2xl p-6 border border-secondary/20 shadow-sm">
                  <span className="inline-block bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
                    Free Download
                  </span>
                  <h3 className="text-headline-md font-headline font-semibold text-on-surface mb-2">{freeGuide.title}</h3>
                  <p className="text-label-md text-on-surface-variant mb-4">{freeGuide.short_description}</p>
                  {freeGuide.included_toolkit_items && freeGuide.included_toolkit_items.length > 0 && (
                    <div className="mb-4 space-y-1.5">
                      {freeGuide.included_toolkit_items.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                          <Check size={14} className="text-secondary shrink-0" /> {item}
                        </div>
                      ))}
                    </div>
                  )}
                  <Link to="/ebooks" className="inline-flex items-center gap-2 rounded-lg bg-secondary text-on-secondary text-label-md font-semibold px-5 py-2.5 hover:opacity-90 transition-all">
                    <Download size={16} /> Download Free Guide
                  </Link>
                </div>
              )}
              {!loading && popularGuides.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-label-md font-headline font-semibold text-on-surface">Popular This Week</h4>
                    <Link to="/ebooks" className="text-secondary text-label-sm flex items-center gap-1 hover:underline">
                      View all <ArrowRight size={12} />
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {popularGuides.slice(0, 3).map((ebook) => (
                      <Link key={ebook.id} to="/ebooks" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          {ebook.cover_image_url && (
                            <img alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" src={ebook.cover_image_url} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-label-sm font-medium text-on-surface line-clamp-1 group-hover:text-primary transition-colors">{ebook.title}</p>
                          <p className="text-[11px] text-on-surface-variant">£{Number(ebook.price_gbp).toFixed(2)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Situation Finder */}
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
                    className="group bg-white rounded-xl border border-slate-200 p-5 text-left hover:border-secondary hover:shadow-md transition-all flex items-start gap-3"
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

        {/* Category Bento */}
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
                    className={`${cat.span} ${i === 0 ? 'md:row-span-2' : ''} bg-white rounded-[1rem] border border-slate-200 p-8 flex flex-col justify-between group cursor-pointer hover:border-secondary hover:shadow-md transition-all relative overflow-hidden`}
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

        {/* How It Works */}
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
                  <div key={i} className="bg-white rounded-2xl p-8 border border-slate-200 text-center relative">
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

        {/* Testimonials */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-headline-lg font-headline text-on-surface mb-4">Trusted by Families and Carers</h2>
              <p className="text-body-md text-on-surface-variant">Real people, real care situations, real results.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((t) => (
                <div key={t.name} className="bg-surface-container-low rounded-2xl p-8 border border-slate-100">
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

        {/* Community callout */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8 overflow-hidden relative">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full" />
              <div className="absolute -bottom-8 right-32 w-32 h-32 bg-white/5 rounded-full" />
              <div className="flex-1 text-white relative z-10">
                <span className="inline-block px-3 py-1 bg-white/15 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">Community Hub</span>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">Have a question about caring for someone?</h2>
                <p className="text-teal-100 text-sm sm:text-base leading-relaxed max-w-lg">
                  Get answers from the CareLearn community. Browse real Q&amp;As from families and carers, read in-depth articles, and ask anything — no account required.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 relative z-10 shrink-0">
                <Link to="/community?tab=qa" className="px-6 py-3 bg-white text-teal-700 text-sm font-semibold rounded-xl hover:bg-teal-50 transition-colors text-center">
                  Ask a Question
                </Link>
                <Link to="/community?tab=blog" className="px-6 py-3 bg-white/15 border border-white/30 text-white text-sm font-semibold rounded-xl hover:bg-white/25 transition-colors text-center">
                  Read Articles
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
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

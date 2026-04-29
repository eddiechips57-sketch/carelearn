import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

interface AtAGlance {
  duration?: string;
  cost?: string;
  funding_available?: string;
  regulatory_body?: string;
  typical_salary?: string;
}

interface Step {
  step: number;
  title: string;
  content: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface Occupation {
  occupation_title: string;
  slug: string;
}

interface GuideListItem {
  id: string;
  title: string;
  slug: string;
  opening_paragraph: string;
  hero_image_url: string;
  at_a_glance: AtAGlance;
}

interface GuideDetail {
  id: string;
  title: string;
  slug: string;
  opening_paragraph: string;
  hero_image_url: string;
  at_a_glance: AtAGlance;
  steps: Step[];
  funding_section: string;
  faq: FaqItem[];
  from_occupation: Occupation | null;
  to_occupation: Occupation | null;
}

const stepColors = ['bg-primary text-white', 'bg-secondary text-white', 'bg-secondary-container text-on-secondary-container', 'bg-tertiary text-white', 'bg-tertiary-container text-white'];

function GuideListView() {
  const [guides, setGuides] = useState<GuideListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('career_guides')
      .select('id, title, slug, opening_paragraph, hero_image_url, at_a_glance')
      .eq('is_published', true)
      .order('title')
      .then(({ data }) => { setGuides(data || []); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-sm mb-4">
            CAREER GUIDES
          </div>
          <h1 className="text-headline-xl font-headline text-primary mb-4">Chart your career journey.</h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            Step-by-step guides to the UK's most rewarding health and social care careers.
            Discover the qualifications, funding, and pathways you need.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '32px' }}>progress_activity</span>
          </div>
        ) : guides.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-on-surface-variant mb-4 block" style={{ fontSize: '48px', opacity: 0.3 }}>menu_book</span>
            <h3 className="text-headline-md font-headline font-semibold text-on-surface mb-1">No guides available yet</h3>
            <p className="text-body-md text-on-surface-variant">Check back soon for new career guides</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Link
                key={guide.id}
                to={`/guides/${guide.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 block"
              >
                <div className="aspect-[16/9] bg-surface-container overflow-hidden">
                  {guide.hero_image_url && (
                    <img src={guide.hero_image_url} alt={guide.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  )}
                </div>
                <div className="p-6">
                  {guide.at_a_glance?.duration && (
                    <div className="flex items-center gap-1 text-label-sm text-on-surface-variant mb-2">
                      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>schedule</span>
                      <span className="uppercase tracking-wider">{guide.at_a_glance.duration}</span>
                    </div>
                  )}
                  <h3 className="text-headline-md font-headline text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {guide.title}
                  </h3>
                  <p className="text-body-md text-on-surface-variant line-clamp-2 leading-relaxed">
                    {guide.opening_paragraph}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GuideDetailView({ slug }: { slug: string }) {
  const [guide, setGuide] = useState<GuideDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('career_guides')
        .select('*, from_occupation:occupation_levels!career_guides_from_occupation_id_fkey(occupation_title, slug), to_occupation:occupation_levels!career_guides_to_occupation_id_fkey(occupation_title, slug)')
        .eq('slug', slug)
        .maybeSingle();
      setGuide(data);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '32px' }}>progress_activity</span>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-on-surface-variant mb-4" style={{ fontSize: '48px', opacity: 0.3 }}>menu_book</span>
        <h2 className="text-headline-md font-headline font-bold text-on-surface mb-2">Guide not found</h2>
        <p className="text-body-md text-on-surface-variant mb-6">This guide may have been removed or the URL is incorrect.</p>
        <Link to="/guides" className="btn-primary">Back to Guides</Link>
      </div>
    );
  }

  const glance = guide.at_a_glance || {};

  return (
    <div className="min-h-screen bg-surface">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-sm">
                PATHWAY GUIDE
              </div>
              <h1 className="text-headline-xl font-headline text-primary">{guide.title}</h1>
              <p className="text-body-lg text-on-surface-variant max-w-2xl">{guide.opening_paragraph}</p>
              {guide.from_occupation && guide.to_occupation && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Link to={`/roles/${guide.from_occupation.slug}`} className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-label-sm hover:bg-slate-200 transition-colors">
                    {guide.from_occupation.occupation_title}
                  </Link>
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '14px' }}>arrow_forward</span>
                  <Link to={`/roles/${guide.to_occupation.slug}`} className="inline-flex items-center px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-label-sm hover:brightness-105 transition-all">
                    {guide.to_occupation.occupation_title}
                  </Link>
                </div>
              )}
            </div>
            <div className="flex-shrink-0 w-full md:w-96 h-64 rounded-xl overflow-hidden shadow-xl">
              <img
                alt={guide.title}
                className="w-full h-full object-cover"
                src={guide.hero_image_url || 'https://images.pexels.com/photos/5214935/pexels-photo-5214935.jpeg?auto=compress&cs=tinysrgb&w=1200'}
              />
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: 'payments', label: 'Typical Salary', value: glance.typical_salary || 'Varies' },
            { icon: 'schedule', label: 'Time to Complete', value: glance.duration || 'Varies' },
            { icon: 'school', label: 'Education Level', value: glance.regulatory_body || 'Degree or Apprenticeship' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-8 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-center items-center text-center">
              <span className="material-symbols-outlined text-4xl text-secondary mb-2">{stat.icon}</span>
              <p className="text-label-sm text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
              <p className="text-headline-md font-headline text-primary mt-1">{stat.value}</p>
            </div>
          ))}
        </section>

        {/* Qualifications */}
        <section className="mb-12">
          <h2 className="text-headline-lg font-headline text-primary mb-6">Qualifications Needed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-low p-8 rounded-xl flex gap-6 border border-slate-100">
              <div className="bg-primary text-on-primary w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div>
                <h3 className="text-headline-md font-headline text-xl mb-2">Essential Basics</h3>
                <p className="text-body-md text-on-surface-variant">
                  GCSEs in English, Maths, and Science (Grade C/4 or above) or Functional Skills Level 2 equivalent.
                </p>
              </div>
            </div>
            <div className="bg-surface-container-low p-8 rounded-xl flex gap-6 border border-slate-100">
              <div className="bg-secondary text-on-secondary w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined">clinical_notes</span>
              </div>
              <div>
                <h3 className="text-headline-md font-headline text-xl mb-2">Experience</h3>
                <p className="text-body-md text-on-surface-variant">
                  Minimum 6-12 months practical experience or equivalent placement hours to demonstrate aptitude.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        {guide.steps && guide.steps.length > 0 && (
          <section className="mb-12 bg-white p-10 rounded-2xl shadow-sm border border-outline-variant">
            <h2 className="text-headline-lg font-headline text-primary mb-12 text-center">Your Pathway Journey</h2>
            <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-secondary before:to-surface-variant">
              {guide.steps.map((step, idx) => (
                <div key={step.step} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${stepColors[idx % stepColors.length]}`}>
                    <span className="font-bold">{step.step}</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm">
                    <div className="flex items-center justify-between mb-2 gap-4">
                      <h4 className="text-headline-md font-headline text-lg text-primary">{step.title}</h4>
                    </div>
                    <p className="text-body-md text-on-surface-variant">{step.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Funding */}
        {guide.funding_section && (
          <section className="mb-12 bg-white p-10 rounded-2xl shadow-sm border border-outline-variant">
            <h2 className="text-headline-lg font-headline text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">payments</span>
              Funding Your Journey
            </h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">{guide.funding_section}</p>
          </section>
        )}

        {/* Success Stories */}
        <section className="mb-12">
          <h2 className="text-headline-lg font-headline text-primary mb-6">Success Stories</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-tertiary-fixed text-on-tertiary-fixed-variant p-10 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-4xl mb-6">format_quote</span>
                <p className="text-headline-md font-headline italic mb-8">
                  "I started as a care assistant, and CareLearn helped me find the funding for my next qualification. Today, I'm working in the specialist role I always wanted."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                  <img
                    alt=""
                    className="w-full h-full object-cover"
                    src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=200"
                  />
                </div>
                <div>
                  <p className="font-bold">Sarah Jenkins</p>
                  <p className="text-sm opacity-80">Registered Nurse, NHS Trust</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/3 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant">
                <p className="text-body-md mb-4">
                  "The step-by-step guidance made the daunting transition feel manageable. I knew exactly what I needed at each stage."
                </p>
                <p className="font-bold text-primary">— David K., Nursing Student</p>
              </div>
              <div className="bg-primary-container text-on-primary-container p-6 rounded-2xl shadow-sm">
                <h4 className="font-bold mb-2 text-white">Start your journey today</h4>
                <p className="text-sm mb-4 text-white/80">Join 5,000+ people using CareLearn to level up.</p>
                <Link to="/courses" className="block w-full text-center bg-white text-primary font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all">
                  Browse Courses
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        {guide.faq && guide.faq.length > 0 && (
          <section className="mb-12 bg-white p-10 rounded-2xl shadow-sm border border-outline-variant">
            <h2 className="text-headline-lg font-headline text-primary mb-6">Frequently Asked Questions</h2>
            <FaqList items={guide.faq} />
          </section>
        )}
      </main>
    </div>
  );
}

function FaqList({ items }: { items: FaqItem[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-outline-variant overflow-hidden">
          <button
            onClick={() => setOpenFaq(openFaq === i ? null : i)}
            className="flex items-center justify-between w-full px-5 py-4 text-left bg-white hover:bg-surface-container-low transition-colors"
          >
            <span className="text-label-md font-semibold text-on-surface pr-4">{item.question}</span>
            <span className={`material-symbols-outlined text-on-surface-variant flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} style={{ fontSize: '16px' }}>expand_more</span>
          </button>
          {openFaq === i && (
            <div className="px-5 pb-4 bg-surface-container-low">
              <p className="text-body-md text-on-surface-variant leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function CareerGuides() {
  const { slug } = useParams<{ slug: string }>();
  if (slug) return <GuideDetailView slug={slug} />;
  return <GuideListView />;
}

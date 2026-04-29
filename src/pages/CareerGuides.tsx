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
        <div className="section-container py-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container text-primary">
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>menu_book</span>
            </div>
            <h1 className="text-headline-lg font-headline font-bold text-on-surface">Career Guides</h1>
          </div>
          <p className="text-body-md text-on-surface-variant max-w-lg">
            Step-by-step guides to the UK's most rewarding health and social care careers.
            Discover the qualifications, funding, and pathways you need.
          </p>
        </div>
      </div>

      <div className="section-container py-8 pb-16">
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
              <Link key={guide.id} to={`/guides/${guide.slug}`} className="group card-base p-0 overflow-hidden text-left block">
                <div className="aspect-[16/9] bg-surface-container overflow-hidden">
                  {guide.hero_image_url ? (
                    <img src={guide.hero_image_url} alt={guide.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '36px', opacity: 0.3 }}>menu_book</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  {guide.at_a_glance?.duration && (
                    <div className="flex items-center gap-1 text-label-sm text-on-surface-variant mb-2">
                      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>schedule</span>
                      <span className="uppercase tracking-wider">{guide.at_a_glance.duration}</span>
                    </div>
                  )}
                  <h3 className="text-label-md font-semibold text-on-surface mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
                    {guide.title}
                  </h3>
                  <p className="text-label-sm text-on-surface-variant line-clamp-2 leading-relaxed">
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
        <Link to="/guides" className="btn-primary">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
          Back to Guides
        </Link>
      </div>
    );
  }

  const glance = guide.at_a_glance || {};

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-slate-200">
        <div className="section-container py-4">
          <div className="flex items-center gap-1.5 text-label-md text-on-surface-variant">
            <Link to="/guides" className="hover:text-primary transition-colors">Career Guides</Link>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
            <span className="text-on-surface font-medium truncate">{guide.title}</span>
          </div>
        </div>
      </div>

      <div className="section-container py-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Hero card */}
            <div className="card-base overflow-hidden">
              {guide.hero_image_url && (
                <div className="aspect-[21/9] overflow-hidden">
                  <img src={guide.hero_image_url} alt={guide.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6 sm:p-8">
                {guide.from_occupation && guide.to_occupation && (
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    <Link to={`/roles/${guide.from_occupation.slug}`} className="badge-slate hover:opacity-80 transition-opacity">
                      {guide.from_occupation.occupation_title}
                    </Link>
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '14px' }}>arrow_forward</span>
                    <Link to={`/roles/${guide.to_occupation.slug}`} className="badge-brand hover:opacity-80 transition-opacity">
                      {guide.to_occupation.occupation_title}
                    </Link>
                  </div>
                )}
                <div className="inline-flex items-center gap-1.5 bg-surface-container text-primary px-3 py-1 rounded-full text-label-sm mb-4">
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>bookmark</span>
                  PATHWAY GUIDE
                </div>
                <h1 className="text-headline-lg font-headline font-bold text-on-surface mb-4">{guide.title}</h1>
                <p className="text-body-md text-on-surface-variant leading-relaxed">{guide.opening_paragraph}</p>
              </div>
            </div>

            {/* Steps */}
            {guide.steps && guide.steps.length > 0 && (
              <div className="card-base p-6 sm:p-8">
                <h2 className="text-headline-md font-headline font-semibold text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>route</span>
                  Your Pathway Journey
                </h2>
                <div className="relative">
                  <div className="absolute left-[19px] top-0 bottom-0 w-px bg-surface-container-high" />
                  <div className="space-y-8">
                    {guide.steps.map((step) => (
                      <div key={step.step} className="flex items-start gap-4 relative">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-label-sm font-bold flex-shrink-0 relative z-10">
                          {step.step}
                        </span>
                        <div className="flex-1 min-w-0 bg-surface-container-low rounded-xl p-4 border border-outline-variant">
                          <h3 className="text-label-md font-semibold text-on-surface mb-1">{step.title}</h3>
                          <p className="text-label-sm text-on-surface-variant leading-relaxed">{step.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Funding */}
            {guide.funding_section && (
              <div className="card-base p-6 sm:p-8">
                <h2 className="text-headline-md font-headline font-semibold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>payments</span>
                  Funding
                </h2>
                <p className="text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">{guide.funding_section}</p>
              </div>
            )}

            {/* FAQ */}
            {guide.faq && guide.faq.length > 0 && (
              <div className="card-base p-6 sm:p-8">
                <h2 className="text-headline-md font-headline font-semibold text-on-surface mb-5">Frequently Asked Questions</h2>
                <div className="space-y-2">
                  {guide.faq.map((item, i) => (
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
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {Object.keys(glance).length > 0 && (
              <div className="card-base p-6">
                <h3 className="text-label-md font-semibold text-on-surface mb-4">At a Glance</h3>
                <div className="space-y-4">
                  {[
                    { key: 'duration', icon: 'schedule', label: 'Duration' },
                    { key: 'cost', icon: 'payments', label: 'Cost' },
                    { key: 'funding_available', icon: 'school', label: 'Funding Available' },
                    { key: 'regulatory_body', icon: 'verified', label: 'Regulatory Body' },
                    { key: 'typical_salary', icon: 'work', label: 'Typical Salary' },
                  ].map(({ key, icon, label }) => (glance as Record<string, string | undefined>)[key] ? (
                    <div key={key} className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant flex-shrink-0 mt-0.5" style={{ fontSize: '16px' }}>{icon}</span>
                      <div>
                        <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-0.5">{label}</p>
                        <p className="text-label-md font-medium text-on-surface">{(glance as Record<string, string | undefined>)[key]}</p>
                      </div>
                    </div>
                  ) : null)}
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-primary p-6 text-white">
              <span className="material-symbols-outlined mb-3 block" style={{ fontSize: '24px' }}>school</span>
              <h3 className="text-label-md font-semibold mb-2">Find Matching Courses</h3>
              <p className="text-label-sm leading-relaxed mb-4 opacity-80">
                Browse courses and training programmes that align with this career pathway.
              </p>
              <Link to="/courses" className="inline-flex items-center gap-2 rounded-xl bg-white text-primary px-5 py-2.5 text-label-md font-semibold w-full justify-center hover:opacity-90 transition-opacity">
                Browse Courses
              </Link>
            </div>

            <div className="card-base p-6">
              <span className="material-symbols-outlined text-on-surface-variant mb-3 block" style={{ fontSize: '20px' }}>payments</span>
              <h3 className="text-label-md font-semibold text-on-surface mb-2">Check Your Funding</h3>
              <p className="text-label-sm text-on-surface-variant leading-relaxed mb-3">
                Use our eligibility checker to see which funding schemes can support your career change.
              </p>
              <Link to="/funding" className="text-label-md font-medium text-primary hover:opacity-80 transition-opacity flex items-center gap-1">
                Funding Hub <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CareerGuides() {
  const { slug } = useParams<{ slug: string }>();
  if (slug) return <GuideDetailView slug={slug} />;
  return <GuideListView />;
}

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Clock, PoundSterling, ShieldCheck, Briefcase,
  ChevronDown, ChevronRight, Loader2, GraduationCap,
} from 'lucide-react';
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
      .then(({ data }) => {
        setGuides(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="bg-white border-b border-slate-100">
        <div className="section-container py-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <BookOpen size={22} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">Career Guides</h1>
            </div>
          </div>
          <p className="text-slate-500 max-w-lg">
            Step-by-step guides to the UK's most rewarding health and social care careers.
            Discover the qualifications, funding, and pathways you need.
          </p>
        </div>
      </div>

      <div className="section-container py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
          </div>
        ) : guides.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={40} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-1">No guides available yet</h3>
            <p className="text-sm text-slate-500">Check back soon for new career guides</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Link
                key={guide.id}
                to={`/guides/${guide.slug}`}
                className="card-base p-0 overflow-hidden group text-left"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-brand-50 to-brand-100 overflow-hidden">
                  {guide.hero_image_url ? (
                    <img
                      src={guide.hero_image_url}
                      alt={guide.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <GraduationCap size={36} className="text-brand-300" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-slate-900 mb-1.5 group-hover:text-brand-700 transition-colors line-clamp-2">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {guide.opening_paragraph}
                  </p>
                  {guide.at_a_glance?.duration && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock size={12} />
                      <span>{guide.at_a_glance.duration}</span>
                    </div>
                  )}
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
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <BookOpen size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-display font-bold text-slate-800 mb-2">Guide not found</h2>
        <p className="text-sm text-slate-500 mb-6">This guide may have been removed or the URL is incorrect.</p>
        <Link to="/guides" className="btn-primary">
          <ArrowLeft size={16} />
          Back to Guides
        </Link>
      </div>
    );
  }

  const glance = guide.at_a_glance || {};

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="bg-white border-b border-slate-100">
        <div className="section-container py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/guides" className="hover:text-brand-600 transition-colors">Career Guides</Link>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-medium truncate">{guide.title}</span>
          </div>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="card-base p-6 sm:p-8">
              {guide.from_occupation && guide.to_occupation && (
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <Link to={`/roles/${guide.from_occupation.slug}`} className="badge-slate">
                    {guide.from_occupation.occupation_title}
                  </Link>
                  <ChevronRight size={14} className="text-slate-400" />
                  <Link to={`/roles/${guide.to_occupation.slug}`} className="badge-brand">
                    {guide.to_occupation.occupation_title}
                  </Link>
                </div>
              )}

              <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-4">
                {guide.title}
              </h1>

              <p className="text-slate-600 leading-relaxed text-base">
                {guide.opening_paragraph}
              </p>
            </div>

            {guide.steps && guide.steps.length > 0 && (
              <div className="card-base p-6 sm:p-8">
                <h2 className="text-lg font-display font-bold text-slate-900 mb-6">Steps to Get There</h2>
                <div className="space-y-6">
                  {guide.steps.map((step) => (
                    <div key={step.step} className="flex items-start gap-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-700 text-sm font-bold flex-shrink-0 mt-0.5">
                        {step.step}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 mb-1">{step.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{step.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {guide.funding_section && (
              <div className="card-base p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <PoundSterling size={18} className="text-brand-600" />
                  <h2 className="text-lg font-display font-bold text-slate-900">Funding</h2>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {guide.funding_section}
                </p>
              </div>
            )}

            {guide.faq && guide.faq.length > 0 && (
              <div className="card-base p-6 sm:p-8">
                <h2 className="text-lg font-display font-bold text-slate-900 mb-5">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {guide.faq.map((item, i) => (
                    <div key={i} className="rounded-xl border border-slate-100 overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="flex items-center justify-between w-full px-5 py-4 text-left"
                      >
                        <span className="text-sm font-semibold text-slate-900 pr-4">{item.question}</span>
                        <ChevronDown
                          size={16}
                          className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {openFaq === i && (
                        <div className="px-5 pb-4">
                          <p className="text-sm text-slate-600 leading-relaxed">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="card-base p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">At a Glance</h3>
              <div className="space-y-4">
                {glance.duration && (
                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Duration</p>
                      <p className="text-sm font-medium text-slate-800">{glance.duration}</p>
                    </div>
                  </div>
                )}
                {glance.cost && (
                  <div className="flex items-start gap-3">
                    <PoundSterling size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Cost</p>
                      <p className="text-sm font-medium text-slate-800">{glance.cost}</p>
                    </div>
                  </div>
                )}
                {glance.funding_available && (
                  <div className="flex items-start gap-3">
                    <GraduationCap size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Funding Available</p>
                      <p className="text-sm font-medium text-slate-800">{glance.funding_available}</p>
                    </div>
                  </div>
                )}
                {glance.regulatory_body && (
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Regulatory Body</p>
                      <p className="text-sm font-medium text-slate-800">{glance.regulatory_body}</p>
                    </div>
                  </div>
                )}
                {glance.typical_salary && (
                  <div className="flex items-start gap-3">
                    <Briefcase size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Typical Salary</p>
                      <p className="text-sm font-medium text-slate-800">{glance.typical_salary}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 p-6">
              <GraduationCap size={24} className="text-brand-600 mb-3" />
              <h3 className="text-sm font-semibold text-brand-900 mb-2">Find Matching Courses</h3>
              <p className="text-xs text-brand-700 leading-relaxed mb-4">
                Browse courses and training programmes that align with this career pathway.
              </p>
              <Link to="/courses" className="btn-primary !bg-brand-700 !text-xs w-full">
                Browse Courses
              </Link>
            </div>

            <div className="card-base p-6">
              <PoundSterling size={20} className="text-slate-400 mb-3" />
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Check Your Funding</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Use our eligibility checker to see which funding schemes can support your career change.
              </p>
              <Link to="/funding" className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
                Funding Hub
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

  if (slug) {
    return <GuideDetailView slug={slug} />;
  }

  return <GuideListView />;
}

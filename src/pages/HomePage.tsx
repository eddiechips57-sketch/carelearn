import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, PoundSterling, Map, TrendingUp,
  Users, GraduationCap, CheckCircle, ChevronRight,
  Clock, Star, Quote, Award,
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import PathFinder from '../components/PathFinder';
import FloatingEmojis from '../components/FloatingEmojis';

interface FreeCourse {
  id: string;
  course_title: string;
  description: string;
  duration_weeks: number;
  qualification_level: string;
  delivery_mode: string;
  cost_gbp: number | null;
  funding_tags: string[];
  provider: { provider_name: string } | null;
}

interface CareerGuide {
  id: string;
  title: string;
  slug: string;
  opening_paragraph: string;
  at_a_glance: { duration?: string; typical_salary?: string };
  hero_image_url: string;
}

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Registered Nurse, NHS Trust',
    text: 'CareLearn helped me find the exact funded pathway from HCA to Registered Nurse. I had no idea the NHS Learning Support Fund existed until I used the Path-Finder tool.',
    rating: 5,
    avatar: 'SM',
  },
  {
    name: 'James Okonkwo',
    role: 'Senior Care Worker',
    text: 'The free courses section was a game-changer. I completed my Level 3 Diploma without paying a penny thanks to the funding information on CareLearn.',
    rating: 5,
    avatar: 'JO',
  },
  {
    name: 'Priya Sharma',
    role: 'Trainee Nursing Associate',
    text: 'I was stuck in my career until I discovered the career guides here. The step-by-step roadmap made everything so clear and achievable.',
    rating: 5,
    avatar: 'PS',
  },
  {
    name: 'David Williams',
    role: 'Registered Manager',
    text: 'Going from care worker to registered manager seemed impossible. CareLearn showed me the exact qualifications and funding available. Now I manage my own care home.',
    rating: 5,
    avatar: 'DW',
  },
];

const stats = [
  { value: '50+', label: 'Curated Courses' },
  { value: '20+', label: 'Career Roles' },
  { value: '6', label: 'Funding Schemes' },
  { value: '5,000+', label: 'Career Explorers' },
];

const steps = [
  { icon: Users, title: 'Tell us your role', desc: 'Select your current position and where you want to go in health and social care.' },
  { icon: Map, title: 'Get your roadmap', desc: 'Receive a personalised step-by-step career pathway with matched courses and funding.' },
  { icon: GraduationCap, title: 'Start learning', desc: 'Enrol on funded courses and track your progress towards your dream career.' },
];

const fundingHighlights = [
  { name: 'LDSS', amount: 'Up to \u00a31,500/year', desc: 'For adult social care workers. Many don\'t know this exists.', icon: PoundSterling },
  { name: 'NHS Learning Support Fund', amount: '\u00a35,000/year grant', desc: 'Non-repayable grant for nursing and AHP students.', icon: Award },
  { name: 'Free Courses for Jobs', amount: 'Fully funded', desc: 'Level 3 courses for adults without existing L3 qualifications.', icon: GraduationCap },
];

const levelLabels: Record<string, string> = {
  L2: 'Level 2',
  L3: 'Level 3',
  L4: 'Level 4',
  L5: 'Level 5',
  HE_UG: 'Undergraduate',
  HE_PG: 'Postgraduate',
  CPD: 'CPD',
};

export default function HomePage() {
  const [freeCourses, setFreeCourses] = useState<FreeCourse[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [guides, setGuides] = useState<CareerGuide[]>([]);

  useEffect(() => {
    (async () => {
      const [coursesRes, guidesRes] = await Promise.all([
        supabase
          .from('courses')
          .select('id, course_title, description, duration_weeks, qualification_level, delivery_mode, cost_gbp, funding_tags, provider:course_providers(provider_name)')
          .eq('is_active', true)
          .filter('funding_tags', 'cs', '["free_courses"]')
          .order('created_at', { ascending: false })
          .limit(6),
        supabase
          .from('career_guides')
          .select('id, title, slug, opening_paragraph, at_a_glance, hero_image_url')
          .eq('is_published', true)
          .limit(4),
      ]);
      if (coursesRes.error) console.error('Free courses query error:', coursesRes.error);
      if (coursesRes.data && !coursesRes.error) setFreeCourses(coursesRes.data as FreeCourse[]);
      setCoursesLoading(false);
      if (guidesRes.data) setGuides(guidesRes.data);
    })();
  }, []);

  return (
    <div className="bg-white">
      <HeroSection />
      <StatsBar />
      <FreeCoursesSection courses={freeCourses} loading={coursesLoading} />
      <TestimonialsSection />
      <PathFinderSection />
      <HowItWorksSection />
      <FundingSection />
      {guides.length > 0 && <GuidesSection guides={guides} />}
      <CTASection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-28">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800" />
      <div className="absolute inset-0 mesh-gradient opacity-60" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-400/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-400/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
      <FloatingEmojis />

      <div className="section-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block mb-8">
            <span className="block text-base sm:text-lg font-semibold tracking-widest uppercase text-accent-300 letter-spacing-wide">
              Your GPS for Health &amp; Social Care Careers
            </span>
            <div className="mt-2 h-0.5 w-full bg-gradient-to-r from-transparent via-accent-300/60 to-transparent" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white mb-6 leading-tight">
            Map Your Career in{' '}
            <span className="bg-gradient-to-r from-accent-300 to-cyan-300 bg-clip-text text-transparent">
              Health & Social Care
            </span>
          </h1>

          <p className="text-lg text-cyan-100/80 max-w-2xl mx-auto mb-10">
            Discover free courses, unlock hidden funding, and build a step-by-step career
            roadmap across the UK's entire health and social care workforce.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-brand-700 shadow-lg hover:shadow-xl hover:bg-cyan-50 transition-all duration-300 hover:-translate-y-0.5"
            >
              <BookOpen size={16} />
              Browse Free Courses
            </Link>
            <a
              href="#pathfinder"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 backdrop-blur-sm px-7 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Map size={16} />
              Try Path-Finder
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <div className="relative -mt-8 z-20">
      <div className="section-container">
        <div className="perspective-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((s, i) => (
              <div
                key={i}
                className="card-3d rounded-2xl bg-white p-5 text-center"
              >
                <p className="text-2xl sm:text-3xl font-display font-extrabold text-brand-600 mb-1">
                  {s.value}
                </p>
                <p className="text-xs font-medium text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FreeCoursesSection({ courses, loading }: { courses: FreeCourse[]; loading: boolean }) {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-brand-50/30">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 border border-cyan-100 px-3 py-1 mb-3">
              <GraduationCap size={12} className="text-cyan-600" />
              <span className="text-xs font-semibold text-cyan-700">Most Popular</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-2">
              Free Healthcare Courses
            </h2>
            <p className="text-sm text-slate-500 max-w-lg">
              The most in-demand funded courses in UK health and social care. No tuition fees required.
            </p>
          </div>
          <Link to="/courses" className="btn-secondary !py-2.5 !px-5 !text-xs whitespace-nowrap group">
            View All Courses <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-2xl border border-slate-100 bg-white p-6 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-16 mb-4" />
                <div className="h-5 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-50 rounded w-full mb-1" />
                <div className="h-3 bg-slate-50 rounded w-2/3 mb-4" />
                <div className="flex justify-between pt-3 border-t border-slate-100">
                  <div className="h-3 bg-slate-100 rounded w-24" />
                  <div className="h-3 bg-slate-100 rounded w-10" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="perspective-container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, i) => (
                <Link
                  key={course.id}
                  to="/courses"
                  className="card-3d p-6 group"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-bold px-2.5 py-1">
                      <CheckCircle size={10} />
                      {course.cost_gbp ? 'FUNDED' : 'FREE'}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-50 rounded-full px-2 py-0.5">
                      {levelLabels[course.qualification_level] || course.qualification_level}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                    {course.course_title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium">
                      {course.provider?.provider_name}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock size={10} />
                      {course.duration_weeks}w
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <BookOpen size={24} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">No courses available right now</p>
            <p className="text-xs text-slate-400 mb-4">Check back soon for funded healthcare courses</p>
            <Link to="/courses" className="btn-primary !py-2 !px-5 !text-xs">
              Browse All Courses
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-950 to-slate-900" />
      <div className="absolute inset-0 mesh-gradient opacity-40" />

      <span className="absolute top-10 left-[10%] text-4xl emote-float opacity-30" aria-hidden="true">💙</span>
      <span className="absolute bottom-12 right-[8%] text-3xl emote-drift opacity-30" aria-hidden="true">🌟</span>
      <span className="absolute top-1/2 left-[4%] text-2xl emote-bounce opacity-20" aria-hidden="true">🎓</span>

      <div className="section-container relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm px-4 py-1.5 mb-4">
            <Quote size={12} className="text-accent-300" />
            <span className="text-xs font-medium text-cyan-200">Real Stories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3">
            Trusted by Healthcare Professionals
          </h2>
          <p className="text-sm text-cyan-200/70 max-w-md mx-auto">
            Hear from care workers and nurses who transformed their careers with CareLearn.
          </p>
        </div>

        <div className="perspective-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="glass-card p-6"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-cyan-100/90 leading-relaxed mb-5 line-clamp-4">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/30 text-xs font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{t.name}</p>
                    <p className="text-[10px] text-cyan-300/70">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PathFinderSection() {
  return (
    <section id="pathfinder" className="section-padding bg-gradient-to-b from-brand-50/40 to-white">
      <div className="section-container">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-100 px-4 py-1.5 mb-4">
            <Map size={14} className="text-brand-600" />
            <span className="text-xs font-semibold text-brand-700">Career Roadmap Tool</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-3">
            Find Your Path with Path-Finder
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Tell us where you are and where you want to go. We'll map the qualifications,
            courses, and funding to get you there.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="perspective-container">
            <div className="card-3d rounded-2xl bg-white/95 backdrop-blur-sm p-6 sm:p-8 shadow-3d">
              <div className="flex items-center gap-2 mb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
                  <Map size={18} />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-slate-900">Path-Finder</h3>
                  <p className="text-[10px] text-slate-400">No sign-up required</p>
                </div>
              </div>
              <PathFinder />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-3">How CareLearn Works</h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">Three steps from where you are to where you want to be.</p>
        </div>
        <div className="perspective-container">
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center group">
                <div className="relative mx-auto mb-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 mx-auto transition-all duration-500 group-hover:from-brand-500 group-hover:to-brand-700 group-hover:text-white group-hover:scale-110 group-hover:shadow-glow">
                    <step.icon size={28} />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-bold shadow-md">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FundingSection() {
  return (
    <section className="section-padding bg-gradient-to-b from-brand-50/30 to-white">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-2">
              Funding You Might Be Missing
            </h2>
            <p className="text-sm text-slate-500">Thousands of care workers miss out on free training. Don't be one of them.</p>
          </div>
          <Link to="/funding" className="btn-secondary !py-2 !px-4 !text-xs whitespace-nowrap group">
            Explore All Funding <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="perspective-container">
          <div className="grid md:grid-cols-3 gap-6">
            {fundingHighlights.map((fund, i) => (
              <div
                key={i}
                className="card-3d p-6 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 group-hover:from-brand-500 group-hover:to-brand-700 group-hover:text-white transition-all duration-500">
                    <fund.icon size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{fund.name}</h3>
                </div>
                <p className="text-2xl font-display font-extrabold text-brand-600 mb-2">{fund.amount}</p>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{fund.desc}</p>
                <Link to="/funding" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors group/link">
                  Check eligibility <ChevronRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GuidesSection({ guides }: { guides: CareerGuide[] }) {
  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-2">Popular Career Pathways</h2>
            <p className="text-sm text-slate-500">Step-by-step guides to the UK's most in-demand healthcare careers.</p>
          </div>
          <Link to="/guides" className="btn-secondary !py-2 !px-4 !text-xs whitespace-nowrap group">
            All Guides <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="perspective-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides.map((guide) => (
              <Link
                key={guide.id}
                to={`/guides/${guide.slug}`}
                className="card-3d overflow-hidden group"
              >
                <div className="aspect-[16/9] overflow-hidden bg-brand-50">
                  <img
                    src={guide.hero_image_url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                    {guide.title.replace(': Complete UK Guide 2026', '')}
                  </h3>
                  {guide.at_a_glance?.duration && (
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={10} />
                      {guide.at_a_glance.duration}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-700 via-brand-600 to-accent-600 animate-gradient" />
      <div className="absolute inset-0">
        <span className="absolute top-8 left-[15%] text-3xl emote-float opacity-30" aria-hidden="true">🎓</span>
        <span className="absolute bottom-10 right-[12%] text-2xl emote-bounce opacity-30" aria-hidden="true">💙</span>
        <span className="absolute top-1/3 right-[20%] text-2xl emote-drift opacity-20" aria-hidden="true">🩺</span>
      </div>

      <div className="section-container relative z-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">Ready to Take the Next Step?</h2>
        <p className="text-cyan-100/80 mb-8 max-w-lg mx-auto">
          Whether you're a care worker looking for your first qualification or a nurse planning
          your route to advanced practice, CareLearn has your roadmap.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-brand-700 shadow-lg hover:shadow-xl hover:bg-cyan-50 transition-all duration-300 hover:-translate-y-0.5"
          >
            <BookOpen size={16} />
            Browse Courses
          </Link>
          <Link
            to="/roles"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm px-7 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5"
          >
            <TrendingUp size={16} />
            Explore Roles
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
          {['50+ Curated Courses', '20+ Career Roles', '6 Funding Schemes'].map((stat, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-cyan-200" />
              <span className="text-xs text-cyan-100">{stat}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

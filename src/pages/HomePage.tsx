import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import PathFinder from '../components/PathFinder';

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

const levelLabels: Record<string, string> = {
  L2: 'Level 2',
  L3: 'Level 3',
  L4: 'Level 4',
  L5: 'Level 5',
  HE_UG: 'Undergraduate',
  HE_PG: 'Postgraduate',
  CPD: 'CPD',
};

const testimonials = [
  {
    name: 'Dr. Sarah Jenkins',
    role: 'Senior Resident Physician',
    text: "CareLearn made it incredibly easy to balance my professional development with my 12-hour shifts. The courses are concise, practical, and highly relevant to my daily clinical practice.",
    img: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Marcus Thompson',
    role: 'Nursing Assistant',
    text: "The Pathfinder tool helped me map out exactly what certifications I needed to move from a care assistant role into pediatric nursing. I feel supported in every step of my journey.",
    img: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

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
          .limit(3),
        supabase
          .from('career_guides')
          .select('id, title, slug, opening_paragraph, at_a_glance, hero_image_url')
          .eq('is_published', true)
          .limit(4),
      ]);
      if (coursesRes.data) setFreeCourses(coursesRes.data as unknown as FreeCourse[]);
      setCoursesLoading(false);
      if (guidesRes.data) setGuides(guidesRes.data);
    })();
  }, []);

  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="relative bg-white pt-16 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <span className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-label-sm inline-block mb-6 uppercase tracking-wider">Empowering Caregivers</span>
            <h1 className="text-headline-xl font-headline text-on-surface mb-6">
              All healthcare learning information <span className="text-primary">in one place</span>.
            </h1>
            <p className="text-body-lg text-on-surface-variant mb-10 max-w-xl">
              Expert-led education designed for the modern healthcare professional. Advance your career with accredited courses, from bedside care to clinical leadership.
            </p>

            <div id="pathfinder" className="bg-surface-container p-6 rounded-xl shadow-sm border border-outline-variant max-w-lg">
              <div className="flex items-center mb-4 gap-2">
                <span className="material-symbols-outlined text-primary">explore</span>
                <span className="text-headline-md font-headline font-semibold">Pathfinder Tool</span>
              </div>
              <p className="text-label-md text-on-surface-variant mb-6">Find the perfect learning path based on your role.</p>
              <PathFinder />
            </div>
          </div>

          <div className="relative h-[600px] lg:h-[700px] rounded-[2rem] overflow-hidden shadow-2xl">
            <img
              alt="Healthcare professional"
              className="w-full h-full object-cover"
              src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=1200"
            />
            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <img alt="" className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=80" />
                  <img alt="" className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=80" />
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed border-2 border-white flex items-center justify-center text-xs font-bold">+2k</div>
                </div>
                <div>
                  <p className="text-label-md text-on-surface">Trusted by 15,000+ professionals</p>
                  <div className="flex text-amber-400">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Pathways Bento */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-headline-lg font-headline text-on-surface mb-4">Popular Career Pathways</h2>
            <p className="text-body-md text-on-surface-variant max-w-2xl mx-auto">
              Explore structured learning paths designed to take you from entry-level to advanced clinical expertise.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
            <Link to="/guides" className="md:col-span-2 md:row-span-2 bg-primary rounded-[1rem] p-10 text-on-primary relative overflow-hidden flex flex-col justify-end group cursor-pointer shadow-lg hover:shadow-xl transition-all">
              <img
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
                src="https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg?auto=compress&cs=tinysrgb&w=1200"
              />
              <div className="relative z-10">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-label-sm mb-4 inline-block">Specialized Track</span>
                <h3 className="text-headline-lg font-headline mb-2">Emergency & Critical Care</h3>
                <p className="text-body-md text-blue-100 mb-6">Master life-saving skills and triage protocols in high-pressure environments.</p>
                <span className="flex items-center gap-2 text-label-md text-white group-hover:gap-4 transition-all">
                  Explore Track <span className="material-symbols-outlined">arrow_right_alt</span>
                </span>
              </div>
            </Link>

            <Link to="/guides" className="md:col-span-2 bg-white rounded-[1rem] p-8 border border-slate-200 flex flex-col justify-between group cursor-pointer hover:border-secondary transition-all">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-secondary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>child_care</span>
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm">Hot Trend</span>
              </div>
              <div>
                <h3 className="text-headline-md font-headline text-on-surface mb-2">Pediatric Specialization</h3>
                <p className="text-body-md text-on-surface-variant">Focus on the unique needs of infants, children, and adolescents.</p>
              </div>
            </Link>

            <Link to="/guides" className="bg-tertiary-fixed rounded-[1rem] p-8 flex flex-col justify-between group cursor-pointer hover:brightness-105 transition-all">
              <span className="material-symbols-outlined text-tertiary text-4xl">psychology</span>
              <div>
                <h3 className="text-headline-md font-headline text-on-tertiary-fixed-variant mb-1">Mental Health</h3>
                <p className="text-label-md text-on-tertiary-fixed opacity-80">12 Courses</p>
              </div>
            </Link>

            <Link to="/guides" className="bg-secondary-fixed rounded-[1rem] p-8 flex flex-col justify-between group cursor-pointer hover:brightness-105 transition-all">
              <span className="material-symbols-outlined text-on-secondary-container text-4xl">elderly</span>
              <div>
                <h3 className="text-headline-md font-headline text-on-secondary-container mb-1">Elderly Care</h3>
                <p className="text-label-md text-on-secondary-container opacity-80">8 Courses</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Free Courses */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-headline-lg font-headline text-on-surface mb-2">Free Healthcare Courses</h2>
              <p className="text-body-md text-on-surface-variant">Start your journey today with no-cost foundational education.</p>
            </div>
            <Link to="/courses" className="text-primary text-label-md flex items-center gap-2 hover:underline">
              View all free courses <span className="material-symbols-outlined">chevron_right</span>
            </Link>
          </div>

          {coursesLoading ? (
            <div className="flex items-center justify-center py-20">
              <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '32px' }}>progress_activity</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(freeCourses.length > 0 ? freeCourses : placeholderCourses).map((course, i) => (
                <div key={course.id || i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                  <div className="h-48 overflow-hidden relative">
                    <img
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={coursePlaceholderImages[i % coursePlaceholderImages.length]}
                    />
                    <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">Accredited</div>
                  </div>
                  <div className="p-6">
                    <div className="flex gap-2 mb-3">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter">
                        {levelLabels[course.qualification_level] || 'Healthcare'}
                      </span>
                    </div>
                    <h4 className="text-headline-md font-headline text-on-surface mb-3 line-clamp-2">{course.course_title}</h4>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center text-on-surface-variant text-label-sm">
                        <span className="material-symbols-outlined text-sm mr-1">schedule</span> {course.duration_weeks}w
                      </div>
                      <div className="flex items-center text-on-surface-variant text-label-sm">
                        <span className="material-symbols-outlined text-sm mr-1">signal_cellular_alt</span>
                        {levelLabels[course.qualification_level] || 'Beginner'}
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full mb-6">
                      <div className="bg-secondary h-full rounded-full w-0 group-hover:w-full transition-all duration-1000 ease-out" />
                    </div>
                    <Link to="/courses" className="block text-center w-full py-3 rounded-lg border-2 border-secondary text-secondary text-label-md hover:bg-secondary-container transition-all">
                      Start Free Course
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-surface-container-highest">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-headline-lg font-headline text-on-surface mb-4">Trusted by Healthcare Professionals</h2>
            <p className="text-body-md text-on-surface-variant">Hear from our community of learners who are transforming their careers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex text-amber-400 mb-6">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
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

      {/* Guides preview */}
      {guides.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-headline-lg font-headline text-on-surface mb-2">Career Guides</h2>
                <p className="text-body-md text-on-surface-variant">Step-by-step roadmaps to the UK's most in-demand healthcare careers.</p>
              </div>
              <Link to="/guides" className="text-primary text-label-md flex items-center gap-2 hover:underline">
                View all guides <span className="material-symbols-outlined">chevron_right</span>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {guides.map((guide) => (
                <Link key={guide.id} to={`/guides/${guide.slug}`} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                  <div className="aspect-[16/9] bg-surface-container overflow-hidden">
                    <img src={guide.hero_image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-label-md font-semibold text-on-surface mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {guide.title.replace(': Complete UK Guide 2026', '')}
                    </h3>
                    {guide.at_a_glance?.duration && (
                      <p className="text-label-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>schedule</span>
                        {guide.at_a_glance.duration}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community callout */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8 overflow-hidden relative">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full" />
            <div className="absolute -bottom-8 right-32 w-32 h-32 bg-white/5 rounded-full" />
            <div className="flex-1 text-white relative z-10">
              <span className="inline-block px-3 py-1 bg-white/15 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">Community Hub</span>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">Have a question about your care career?</h2>
              <p className="text-teal-100 text-sm sm:text-base leading-relaxed max-w-lg">
                Get expert answers from the CareLearn team. Browse real Q&amp;As from care professionals, read in-depth articles, and ask anything — no account required.
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
          <h2 className="text-headline-lg font-headline mb-6 relative z-10">Ready to advance your healthcare career?</h2>
          <p className="text-body-lg mb-10 text-blue-100 max-w-xl mx-auto relative z-10">
            Join thousands of professionals already learning on CareLearn. Get started with your first course today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link to="/courses" className="bg-white text-primary px-8 py-4 rounded-xl text-label-md hover:bg-blue-50 transition-all">Get Started for Free</Link>
            <Link to="/courses" className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-xl text-label-md hover:bg-white/10 transition-all">Browse All Courses</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const coursePlaceholderImages = [
  'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4421494/pexels-photo-4421494.jpeg?auto=compress&cs=tinysrgb&w=800',
];

const placeholderCourses: FreeCourse[] = [
  { id: 'p1', course_title: 'Standard Precautions & PPE', description: '', duration_weeks: 2, qualification_level: 'L2', delivery_mode: 'online', cost_gbp: 0, funding_tags: ['free_courses'], provider: null },
  { id: 'p2', course_title: 'Effective Communication in Care', description: '', duration_weeks: 4, qualification_level: 'L2', delivery_mode: 'online', cost_gbp: 0, funding_tags: ['free_courses'], provider: null },
  { id: 'p3', course_title: 'Data Privacy & Compliance', description: '', duration_weeks: 1, qualification_level: 'L3', delivery_mode: 'online', cost_gbp: 0, funding_tags: ['free_courses'], provider: null },
];

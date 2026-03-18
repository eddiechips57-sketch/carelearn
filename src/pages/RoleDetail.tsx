import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ChevronRight, Loader2, Briefcase, PoundSterling, GraduationCap, ShieldCheck,
  Heart, Clock, ArrowRight, BookOpen, ListChecks, MapPin,
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const pillarLabels: Record<string, string> = {
  adult_social_care: 'Adult Social Care',
  nursing_midwifery: 'Nursing & Midwifery',
  clinical_support: 'Clinical Support',
  allied_health: 'Allied Health',
};

const pillarColors: Record<string, string> = {
  adult_social_care: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  nursing_midwifery: 'bg-blue-50 text-blue-700 border-blue-200',
  clinical_support: 'bg-amber-50 text-amber-700 border-amber-200',
  allied_health: 'bg-teal-50 text-teal-700 border-teal-200',
};

interface Occupation {
  id: string;
  occupation_title: string;
  slug: string;
  pillar: string;
  description: string;
  nhs_band: string | null;
  typical_salary_range_gbp: string;
  minimum_qualification: string | null;
  regulatory_body: string | null;
  responsibilities: string[] | null;
}

interface Pathway {
  id: string;
  title: string;
  slug: string;
  pathway_type: string;
  estimated_total_months_min: number;
  estimated_total_months_max: number;
  from_occupation_id: string;
  to_occupation_id: string;
}

interface CourseProvider {
  provider_name: string;
}

interface Course {
  id: string;
  course_title: string;
  qualification_level: string;
  delivery_mode: string;
  occupation_ids: string[];
  course_providers: CourseProvider | null;
}

export default function RoleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [occupation, setOccupation] = useState<Occupation | null>(null);
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    (async () => {
      setLoading(true);

      const { data: occ } = await supabase
        .from('occupation_levels')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!occ) {
        setLoading(false);
        return;
      }

      setOccupation(occ);

      const [pathwaysRes, coursesRes] = await Promise.all([
        supabase
          .from('career_pathways')
          .select('*')
          .or(`from_occupation_id.eq.${occ.id},to_occupation_id.eq.${occ.id}`),
        supabase
          .from('courses')
          .select('id, course_title, qualification_level, delivery_mode, occupation_ids, course_providers(provider_name)')
          .eq('is_active', true),
      ]);

      if (pathwaysRes.data) setPathways(pathwaysRes.data);

      if (coursesRes.data) {
        const matched = coursesRes.data.filter(
          (c: any) => Array.isArray(c.occupation_ids) && c.occupation_ids.includes(occ.id)
        );
        setCourses(matched as Course[]);
      }

      setLoading(false);
    })();
  }, [slug]);

  useEffect(() => {
    if (!occupation) return;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Occupation',
      name: occupation.occupation_title,
      description: occupation.description,
      occupationalCategory: occupation.pillar,
      estimatedSalary: occupation.typical_salary_range_gbp
        ? {
            '@type': 'MonetaryAmountDistribution',
            currency: 'GBP',
            name: occupation.typical_salary_range_gbp,
            unitText: 'YEAR',
          }
        : undefined,
      qualifications: occupation.minimum_qualification || undefined,
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [occupation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!occupation) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20">
        <div className="section-container py-20 text-center">
          <Briefcase size={40} className="mx-auto text-slate-300 mb-4" />
          <h1 className="text-xl font-display font-bold text-slate-900 mb-2">Role Not Found</h1>
          <p className="text-sm text-slate-500 mb-6">The role you're looking for doesn't exist or has been moved.</p>
          <Link to="/roles" className="btn-primary">
            Browse All Roles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="bg-white border-b border-slate-100">
        <div className="section-container py-8">
          <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
            <Link to="/roles" className="hover:text-brand-600 transition-colors">Role Library</Link>
            <ChevronRight size={14} />
            <span className="text-slate-800 font-medium">{occupation.occupation_title}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-4">
            {occupation.occupation_title}
          </h1>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`badge text-xs border ${pillarColors[occupation.pillar] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
              {pillarLabels[occupation.pillar] || occupation.pillar}
            </span>
            {occupation.nhs_band && (
              <span className="badge-brand text-xs">
                NHS Band {occupation.nhs_band}
              </span>
            )}
            {occupation.regulatory_body && (
              <span className="badge-slate text-xs flex items-center gap-1">
                <ShieldCheck size={12} />
                {occupation.regulatory_body}
              </span>
            )}
          </div>

          {occupation.description && (
            <p className="text-slate-600 leading-relaxed mt-5 max-w-3xl">
              {occupation.description}
            </p>
          )}
        </div>
      </div>

      <div className="section-container py-8 space-y-10">
        <div>
          <h2 className="text-lg font-display font-bold text-slate-900 mb-5">At a Glance</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-base p-5 text-center">
              <PoundSterling size={20} className="mx-auto text-brand-600 mb-2" />
              <p className="text-xs text-slate-500 mb-1">Salary Range</p>
              <p className="text-sm font-semibold text-slate-900">
                {occupation.typical_salary_range_gbp || 'Not specified'}
              </p>
            </div>
            <div className="card-base p-5 text-center">
              <GraduationCap size={20} className="mx-auto text-emerald-600 mb-2" />
              <p className="text-xs text-slate-500 mb-1">Minimum Qualification</p>
              <p className="text-sm font-semibold text-slate-900">
                {occupation.minimum_qualification || 'Varies'}
              </p>
            </div>
            <div className="card-base p-5 text-center">
              <ShieldCheck size={20} className="mx-auto text-blue-600 mb-2" />
              <p className="text-xs text-slate-500 mb-1">Regulatory Body</p>
              <p className="text-sm font-semibold text-slate-900">
                {occupation.regulatory_body || 'None required'}
              </p>
            </div>
            <div className="card-base p-5 text-center">
              <Heart size={20} className="mx-auto text-warm-600 mb-2" />
              <p className="text-xs text-slate-500 mb-1">NHS Band</p>
              <p className="text-sm font-semibold text-slate-900">
                {occupation.nhs_band ? `Band ${occupation.nhs_band}` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {occupation.responsibilities && occupation.responsibilities.length > 0 && (
          <div>
            <h2 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ListChecks size={20} className="text-brand-600" />
              Responsibilities
            </h2>
            <div className="card-base p-6">
              <ul className="space-y-3">
                {occupation.responsibilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                    <ChevronRight size={14} className="text-brand-500 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {pathways.length > 0 && (
          <div>
            <h2 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-brand-600" />
              Career Pathways
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pathways.map((pw) => (
                <Link
                  key={pw.id}
                  to="/guides"
                  className="card-base p-5 group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge-brand text-[10px] capitalize">
                      {pw.pathway_type.replace('_', ' ')}
                    </span>
                    {pw.from_occupation_id === occupation.id ? (
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">From this role</span>
                    ) : (
                      <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">To this role</span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2 group-hover:text-brand-700 transition-colors line-clamp-2">
                    {pw.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {pw.estimated_total_months_min}-{pw.estimated_total_months_max} months
                    </span>
                    <span className="flex items-center gap-1 text-brand-600 font-medium group-hover:underline">
                      View Pathway <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {courses.length > 0 && (
          <div>
            <h2 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-brand-600" />
              Find Courses
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div key={course.id} className="card-base p-5">
                  <h3 className="text-sm font-semibold text-slate-900 mb-2 line-clamp-2">
                    {course.course_title}
                  </h3>
                  {course.course_providers && (
                    <p className="text-xs text-slate-500 mb-3">{course.course_providers.provider_name}</p>
                  )}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {course.qualification_level && (
                      <span className="badge-slate text-[10px]">{course.qualification_level}</span>
                    )}
                    {course.delivery_mode && (
                      <span className="badge-brand text-[10px] capitalize">{course.delivery_mode.replace('_', ' ')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

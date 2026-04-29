import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const pillarLabels: Record<string, string> = {
  adult_social_care: 'Adult Social Care',
  nursing_midwifery: 'Nursing & Midwifery',
  clinical_support: 'Clinical Support',
  allied_health: 'Allied Health',
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
      if (!occ) { setLoading(false); return; }
      setOccupation(occ);
      const [pathwaysRes, coursesRes] = await Promise.all([
        supabase.from('career_pathways').select('*').or(`from_occupation_id.eq.${occ.id},to_occupation_id.eq.${occ.id}`),
        supabase.from('courses').select('id, course_title, qualification_level, delivery_mode, occupation_ids, course_providers(provider_name)').eq('is_active', true),
      ]);
      if (pathwaysRes.data) setPathways(pathwaysRes.data);
      if (coursesRes.data) {
        const matched = coursesRes.data.filter((c: any) => Array.isArray(c.occupation_ids) && c.occupation_ids.includes(occ.id));
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
      estimatedSalary: occupation.typical_salary_range_gbp ? { '@type': 'MonetaryAmountDistribution', currency: 'GBP', name: occupation.typical_salary_range_gbp, unitText: 'YEAR' } : undefined,
      qualifications: occupation.minimum_qualification || undefined,
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [occupation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '32px' }}>progress_activity</span>
      </div>
    );
  }

  if (!occupation) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="section-container py-20 text-center">
          <span className="material-symbols-outlined text-on-surface-variant mb-4 block" style={{ fontSize: '48px', opacity: 0.3 }}>work</span>
          <h1 className="text-headline-md font-headline font-bold text-on-surface mb-2">Role Not Found</h1>
          <p className="text-body-md text-on-surface-variant mb-6">The role you're looking for doesn't exist or has been moved.</p>
          <Link to="/roles" className="btn-primary">Browse All Roles</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-slate-200">
        <div className="section-container py-8">
          <div className="flex items-center gap-1.5 text-label-sm text-on-surface-variant mb-4">
            <Link to="/roles" className="hover:text-primary transition-colors">Role Library</Link>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
            <span className="text-on-surface font-medium">{occupation.occupation_title}</span>
          </div>
          <h1 className="text-headline-lg font-headline font-bold text-on-surface mb-4">{occupation.occupation_title}</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm">
              {pillarLabels[occupation.pillar] || occupation.pillar}
            </span>
            {occupation.nhs_band && (
              <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-label-sm">
                NHS Band {occupation.nhs_band}
              </span>
            )}
            {occupation.regulatory_body && occupation.regulatory_body !== 'none' && (
              <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-label-sm flex items-center gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>verified</span>
                {occupation.regulatory_body}
              </span>
            )}
          </div>
          {occupation.description && (
            <p className="text-body-md text-on-surface-variant leading-relaxed mt-5 max-w-3xl">{occupation.description}</p>
          )}
        </div>
      </div>

      <div className="section-container py-8 pb-16 space-y-10">
        <div>
          <h2 className="text-headline-md font-headline font-semibold text-on-surface mb-5">At a Glance</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: 'payments', label: 'Salary Range', value: occupation.typical_salary_range_gbp || 'Not specified', color: 'text-primary' },
              { icon: 'school', label: 'Minimum Qualification', value: occupation.minimum_qualification || 'Varies', color: 'text-secondary' },
              { icon: 'shield', label: 'Regulatory Body', value: occupation.regulatory_body || 'None required', color: 'text-tertiary' },
              { icon: 'favorite', label: 'NHS Band', value: occupation.nhs_band ? `Band ${occupation.nhs_band}` : 'N/A', color: 'text-error' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-5 text-center shadow-card">
                <span className={`material-symbols-outlined ${item.color} mb-2`} style={{ fontSize: '22px' }}>{item.icon}</span>
                <p className="text-label-sm text-on-surface-variant mb-1">{item.label}</p>
                <p className="text-label-md font-semibold text-on-surface">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {occupation.responsibilities && occupation.responsibilities.length > 0 && (
          <div>
            <h2 className="text-headline-md font-headline font-semibold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>checklist</span>
              Responsibilities
            </h2>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card">
              <ul className="space-y-3">
                {occupation.responsibilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-body-md text-on-surface-variant leading-relaxed">
                    <span className="material-symbols-outlined text-primary mt-0.5 flex-shrink-0" style={{ fontSize: '14px' }}>chevron_right</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {pathways.length > 0 && (
          <div>
            <h2 className="text-headline-md font-headline font-semibold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>route</span>
              Career Pathways
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pathways.map((pw) => (
                <Link key={pw.id} to="/guides" className="group bg-white rounded-xl border border-slate-200 p-5 shadow-card hover:shadow-card-hover transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-surface-container text-on-surface-variant px-2.5 py-0.5 rounded-full text-label-sm capitalize">
                      {pw.pathway_type.replace('_', ' ')}
                    </span>
                    {pw.from_occupation_id === occupation.id ? (
                      <span className="bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full text-label-sm">From this role</span>
                    ) : (
                      <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-2.5 py-0.5 rounded-full text-label-sm">To this role</span>
                    )}
                  </div>
                  <h3 className="text-label-md font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-2">{pw.title}</h3>
                  <div className="flex items-center gap-3 text-label-sm text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>schedule</span>
                      {pw.estimated_total_months_min}-{pw.estimated_total_months_max} months
                    </span>
                    <span className="flex items-center gap-1 text-primary font-medium group-hover:underline ml-auto">
                      View Pathway <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>arrow_forward</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {courses.length > 0 && (
          <div>
            <h2 className="text-headline-md font-headline font-semibold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>menu_book</span>
              Find Courses
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-card">
                  <h3 className="text-label-md font-semibold text-on-surface mb-2 line-clamp-2">{course.course_title}</h3>
                  {course.course_providers && (
                    <p className="text-label-sm text-on-surface-variant mb-3">{course.course_providers.provider_name}</p>
                  )}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {course.qualification_level && (
                      <span className="bg-surface-container text-on-surface-variant px-2.5 py-0.5 rounded-full text-label-sm">{course.qualification_level}</span>
                    )}
                    {course.delivery_mode && (
                      <span className="bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full text-label-sm capitalize">{course.delivery_mode.replace('_', ' ')}</span>
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

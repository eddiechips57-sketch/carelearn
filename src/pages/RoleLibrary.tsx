import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Loader2, Users, Briefcase, PoundSterling, ShieldCheck,
  GraduationCap, HeartHandshake, Stethoscope, Activity, Bone,
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

type Pillar = 'all' | 'adult_social_care' | 'nursing_midwifery' | 'clinical_support' | 'allied_health';

interface OccupationLevel {
  id: string;
  occupation_title: string;
  slug: string;
  pillar: string;
  nhs_band: string | null;
  typical_salary_range_gbp: string;
  regulatory_body: string;
  minimum_qualification: string;
  description: string;
}

const pillarTabs: { key: Pillar; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'All', icon: Users },
  { key: 'adult_social_care', label: 'Adult Social Care', icon: HeartHandshake },
  { key: 'nursing_midwifery', label: 'Nursing & Midwifery', icon: Stethoscope },
  { key: 'clinical_support', label: 'Clinical Support', icon: Activity },
  { key: 'allied_health', label: 'Allied Health', icon: Bone },
];

const pillarColors: Record<string, string> = {
  adult_social_care: 'bg-emerald-100 text-emerald-700',
  nursing_midwifery: 'bg-blue-100 text-blue-700',
  clinical_support: 'bg-cyan-100 text-cyan-700',
  allied_health: 'bg-amber-100 text-amber-700',
};

const pillarLabels: Record<string, string> = {
  adult_social_care: 'Adult Social Care',
  nursing_midwifery: 'Nursing & Midwifery',
  clinical_support: 'Clinical Support',
  allied_health: 'Allied Health',
};

const regulatoryBadgeColors: Record<string, string> = {
  NMC: 'bg-blue-50 text-blue-700 border-blue-200',
  HCPC: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  SWE: 'bg-teal-50 text-teal-700 border-teal-200',
};

export default function RoleLibrary() {
  const [roles, setRoles] = useState<OccupationLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePillar, setActivePillar] = useState<Pillar>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('occupation_levels')
        .select('*')
        .order('occupation_title');
      if (data) setRoles(data);
      setLoading(false);
    })();
  }, []);

  const filtered = roles.filter((role) => {
    if (activePillar !== 'all' && role.pillar !== activePillar) return false;
    if (search.trim() && !role.occupation_title.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="bg-white border-b border-slate-100">
        <div className="section-container py-8">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-2">
            Role Library
          </h1>
          <p className="text-slate-500 mb-6 max-w-lg">
            Explore career roles across health and social care. Understand requirements, salary bands, and progression routes.
          </p>

          <div className="relative max-w-md mb-6">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roles by title..."
              className="input-base pl-10"
            />
          </div>

          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            {pillarTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActivePillar(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activePillar === tab.key
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="section-container py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase size={40} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-1">No roles found</h3>
            <p className="text-sm text-slate-500 mb-4">Try adjusting your search or filter</p>
            <button
              onClick={() => { setSearch(''); setActivePillar('all'); }}
              className="btn-secondary text-xs"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-5">
              {filtered.length} role{filtered.length !== 1 ? 's' : ''} found
              {activePillar !== 'all' && (
                <span className="font-medium text-slate-700"> in {pillarLabels[activePillar]}</span>
              )}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((role) => (
                <Link
                  key={role.id}
                  to={`/roles/${role.slug}`}
                  className="card-base p-5 group"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`badge text-[10px] ${pillarColors[role.pillar] || 'bg-slate-100 text-slate-600'}`}>
                      {pillarLabels[role.pillar] || role.pillar}
                    </span>
                    {role.regulatory_body && role.regulatory_body !== 'none' && (
                      <span className={`badge text-[10px] border ${regulatoryBadgeColors[role.regulatory_body] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        <ShieldCheck size={10} className="mr-0.5" />
                        {role.regulatory_body}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-brand-700 transition-colors mb-3">
                    {role.occupation_title}
                  </h3>

                  <div className="space-y-2 text-xs text-slate-500">
                    {role.nhs_band && (
                      <div className="flex items-center gap-1.5">
                        <Briefcase size={12} className="text-slate-400 flex-shrink-0" />
                        <span>NHS Band {role.nhs_band}</span>
                      </div>
                    )}
                    {role.typical_salary_range_gbp && (
                      <div className="flex items-center gap-1.5">
                        <PoundSterling size={12} className="text-slate-400 flex-shrink-0" />
                        <span>{role.typical_salary_range_gbp}</span>
                      </div>
                    )}
                    {role.minimum_qualification && (
                      <div className="flex items-center gap-1.5">
                        <GraduationCap size={12} className="text-slate-400 flex-shrink-0" />
                        <span className="line-clamp-1">{role.minimum_qualification}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

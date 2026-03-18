import { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight, MapPin, Clock, Sparkles, ArrowRight, GraduationCap, PoundSterling, Award, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface Occupation {
  id: string;
  occupation_title: string;
  pillar: string;
  slug: string;
}

interface PathwayStep {
  step_order: number;
  qualification_name: string;
  duration_months: number;
  cost_gbp: number;
  funding: string[];
  is_mandatory: boolean;
  description: string;
}

interface Pathway {
  id: string;
  title: string;
  slug: string;
  pathway_type: string;
  steps: PathwayStep[];
  estimated_total_months_min: number;
  estimated_total_months_max: number;
  editorial_notes: string;
}

const experienceOptions = ['0-6 months', '6-12 months', '1-3 years', '3-5 years', '5+ years'];
const learningModes = ['No Preference', 'Online', 'Blended', 'In-Person', 'Apprenticeship'];

const pillarLabels: Record<string, string> = {
  adult_social_care: 'Adult Social Care',
  nursing_midwifery: 'Nursing & Midwifery',
  clinical_support: 'Clinical Support',
  allied_health: 'Allied Health',
};

export default function PathFinder() {
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [currentRole, setCurrentRole] = useState('');
  const [goalRole, setGoalRole] = useState('');
  const [experience, setExperience] = useState('');
  const [learningMode, setLearningMode] = useState('No Preference');
  const [location, setLocation] = useState('');
  const [showCurrentDropdown, setShowCurrentDropdown] = useState(false);
  const [showGoalDropdown, setShowGoalDropdown] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');
  const [goalSearch, setGoalSearch] = useState('');
  const [selectedCurrent, setSelectedCurrent] = useState<Occupation | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Occupation | null>(null);
  const [pathway, setPathway] = useState<Pathway | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const currentRef = useRef<HTMLDivElement>(null);
  const goalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('occupation_levels')
        .select('id, occupation_title, pillar, slug')
        .order('occupation_title');
      if (data) setOccupations(data);
    })();
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (currentRef.current && !currentRef.current.contains(e.target as Node)) setShowCurrentDropdown(false);
      if (goalRef.current && !goalRef.current.contains(e.target as Node)) setShowGoalDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredCurrent = occupations.filter(o =>
    o.occupation_title.toLowerCase().includes(currentSearch.toLowerCase())
  );

  const filteredGoal = occupations.filter(o =>
    o.occupation_title.toLowerCase().includes(goalSearch.toLowerCase()) &&
    o.id !== selectedCurrent?.id
  );

  const handleFindPathway = async () => {
    if (!selectedCurrent || !selectedGoal) return;
    setLoading(true);

    const { data } = await supabase
      .from('career_pathways')
      .select('*')
      .eq('from_occupation_id', selectedCurrent.id)
      .eq('to_occupation_id', selectedGoal.id)
      .maybeSingle();

    if (!data) {
      const { data: anyPath } = await supabase
        .from('career_pathways')
        .select('*')
        .or(`from_occupation_id.eq.${selectedCurrent.id},to_occupation_id.eq.${selectedGoal.id}`)
        .limit(1)
        .maybeSingle();
      setPathway(anyPath);
    } else {
      setPathway(data);
    }

    setShowResults(true);
    setLoading(false);
  };

  if (showResults) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => { setShowResults(false); setPathway(null); }}
            className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
          >
            Start Over
          </button>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-sm text-slate-600">Your Career Roadmap</span>
        </div>

        {pathway ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h3 className="text-xl font-display font-bold text-slate-900">{pathway.title}</h3>
              <span className="badge-brand capitalize">{pathway.pathway_type.replace('_', ' ')}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-brand-50 border border-brand-100 p-3 text-center">
                <Clock size={18} className="mx-auto text-brand-600 mb-1" />
                <p className="text-xs text-slate-500">Duration</p>
                <p className="text-sm font-semibold text-slate-900">{pathway.estimated_total_months_min}-{pathway.estimated_total_months_max} months</p>
              </div>
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
                <PoundSterling size={18} className="mx-auto text-emerald-600 mb-1" />
                <p className="text-xs text-slate-500">Funding Available</p>
                <p className="text-sm font-semibold text-slate-900">Multiple Options</p>
              </div>
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-center">
                <GraduationCap size={18} className="mx-auto text-blue-600 mb-1" />
                <p className="text-xs text-slate-500">Steps</p>
                <p className="text-sm font-semibold text-slate-900">{(pathway.steps as PathwayStep[]).length} Qualifications</p>
              </div>
              <div className="rounded-xl bg-warm-50 border border-warm-100 p-3 text-center">
                <Award size={18} className="mx-auto text-warm-600 mb-1" />
                <p className="text-xs text-slate-500">Pathway Type</p>
                <p className="text-sm font-semibold text-slate-900 capitalize">{pathway.pathway_type.replace('_', ' ')}</p>
              </div>
            </div>

            {(pathway.steps as PathwayStep[]).find(s => s.step_order === 1) && (
              <div className="rounded-xl bg-gradient-to-r from-brand-50 to-brand-100 border border-brand-200 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white flex-shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-800 mb-1">Quick Win - Start This Week</p>
                    <p className="text-sm text-slate-700">{(pathway.steps as PathwayStep[])[0].description}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {(pathway.steps as PathwayStep[]).map((step, i) => (
                <div key={i} className="relative pl-10">
                  <div className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-bold">
                    {step.step_order}
                  </div>
                  {i < (pathway.steps as PathwayStep[]).length - 1 && (
                    <div className="absolute left-[13px] top-7 bottom-0 w-0.5 bg-brand-200" style={{ height: 'calc(100% + 16px)' }} />
                  )}
                  <div className="rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-200 hover:shadow-sm transition-all">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-semibold text-slate-900">{step.qualification_name}</h4>
                      {step.is_mandatory && <span className="text-[10px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Required</span>}
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{step.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                        <Clock size={12} /> {step.duration_months} months
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                        <PoundSterling size={12} /> {step.cost_gbp === 0 ? 'Free' : `£${step.cost_gbp.toLocaleString()}`}
                      </span>
                      {step.funding.map((f, fi) => (
                        <span key={fi} className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">{f}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pathway.editorial_notes && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800 mb-1">Expert Guidance</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{pathway.editorial_notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mx-auto mb-4">
              <Search size={24} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900 mb-2">Pathway Coming Soon</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              We're building the roadmap from {selectedCurrent?.occupation_title} to {selectedGoal?.occupation_title}.
              Check back soon, or browse our career guides for related pathways.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div ref={currentRef} className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Current Role</label>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
            <input
              type="text"
              value={selectedCurrent ? selectedCurrent.occupation_title : currentSearch}
              onChange={(e) => {
                setCurrentSearch(e.target.value);
                setSelectedCurrent(null);
                setShowCurrentDropdown(true);
              }}
              onFocus={() => setShowCurrentDropdown(true)}
              className="input-base pl-10"
              placeholder="e.g. Healthcare Support Worker"
            />
          </div>
          {showCurrentDropdown && filteredCurrent.length > 0 && !selectedCurrent && (
            <div className="absolute z-30 top-full mt-1 w-full max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-card-hover">
              {filteredCurrent.map((o) => (
                <button
                  key={o.id}
                  onClick={() => { setSelectedCurrent(o); setCurrentSearch(''); setShowCurrentDropdown(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <span className="text-slate-800">{o.occupation_title}</span>
                  <span className="text-[10px] text-slate-400">{pillarLabels[o.pillar]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={goalRef} className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Goal Role</label>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
            <input
              type="text"
              value={selectedGoal ? selectedGoal.occupation_title : goalSearch}
              onChange={(e) => {
                setGoalSearch(e.target.value);
                setSelectedGoal(null);
                setShowGoalDropdown(true);
              }}
              onFocus={() => setShowGoalDropdown(true)}
              className="input-base pl-10"
              placeholder="e.g. Registered Nurse"
            />
          </div>
          {showGoalDropdown && filteredGoal.length > 0 && !selectedGoal && (
            <div className="absolute z-30 top-full mt-1 w-full max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-card-hover">
              {filteredGoal.map((o) => (
                <button
                  key={o.id}
                  onClick={() => { setSelectedGoal(o); setGoalSearch(''); setShowGoalDropdown(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <span className="text-slate-800">{o.occupation_title}</span>
                  <span className="text-[10px] text-slate-400">{pillarLabels[o.pillar]}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Years of Experience</label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="input-base"
          >
            <option value="">Select...</option>
            {experienceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Preferred Learning Mode</label>
          <select
            value={learningMode}
            onChange={(e) => setLearningMode(e.target.value)}
            className="input-base"
          >
            {learningModes.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Location / Postcode</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-base pl-10"
              placeholder="e.g. SW1A 1AA"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleFindPathway}
        disabled={!selectedCurrent || !selectedGoal || loading}
        className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Finding your pathway...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Sparkles size={16} />
            Find My Career Pathway
            <ArrowRight size={16} />
          </span>
        )}
      </button>
    </div>
  );
}

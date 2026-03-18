import { useEffect, useState, useRef } from 'react';
import {
  Search, Filter, X, ChevronDown, Loader2, BookOpen, ExternalLink,
  GraduationCap, Clock, PoundSterling, Briefcase, SlidersHorizontal,
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { useClickTracking } from '../contexts/ClickTrackingContext';
import LeadCapture from '../components/LeadCapture';

type SearchMode = 'role' | 'skill' | 'funding';

interface CourseProvider {
  provider_name: string;
  provider_type: string;
}

interface Course {
  id: string;
  course_title: string;
  qualification_level: string;
  delivery_mode: string;
  duration_weeks: number | null;
  cost_gbp: number | null;
  funding_tags: string[];
  course_url: string;
  course_providers: CourseProvider | null;
}

interface OccupationLevel {
  id: string;
  occupation_title: string;
  slug: string;
}

const qualificationLevels = ['Entry', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'HE_UG', 'HE_PG'];
const deliveryModes = ['online', 'blended', 'in_person', 'apprenticeship', 'distance_learning'];
const providerTypes = ['university', 'college', 'private_training', 'awarding_body', 'nhs_trust', 'charity'];
const fundingOptions = ['LDSS', 'apprenticeship', 'LSF', 'advanced_learner_loan', 'free_courses', 'nhs_workforce_development'];
const intentOptions = ['Get Qualified', 'Get Promoted', 'Change Role', 'Understand Funding'];

const qualLevelLabels: Record<string, string> = {
  Entry: 'Entry', L1: 'Level 1', L2: 'Level 2', L3: 'Level 3',
  L4: 'Level 4', L5: 'Level 5', L6: 'Level 6', L7: 'Level 7',
  HE_UG: 'Undergraduate', HE_PG: 'Postgraduate',
};

const deliveryModeLabels: Record<string, string> = {
  online: 'Online', blended: 'Blended', in_person: 'In Person',
  apprenticeship: 'Apprenticeship', distance_learning: 'Distance Learning',
};

const providerTypeLabels: Record<string, string> = {
  university: 'University', college: 'College', private_training: 'Private Training',
  awarding_body: 'Awarding Body', nhs_trust: 'NHS Trust', charity: 'Charity',
};

const fundingTagLabels: Record<string, string> = {
  LDSS: 'LDSS',
  apprenticeship: 'Apprenticeship',
  LSF: 'LSF',
  advanced_learner_loan: 'Advanced Learner Loan',
  free_courses: 'Free Courses',
  nhs_workforce_development: 'NHS Workforce Dev',
};

const fundingChipColors: Record<string, string> = {
  LDSS: 'bg-emerald-100 text-emerald-700',
  apprenticeship: 'bg-blue-100 text-blue-700',
  LSF: 'bg-teal-100 text-teal-700',
  advanced_learner_loan: 'bg-amber-100 text-amber-700',
  free_courses: 'bg-cyan-100 text-cyan-700',
  nhs_workforce_development: 'bg-rose-100 text-rose-700',
};

const qualBadgeColors: Record<string, string> = {
  Entry: 'bg-slate-100 text-slate-600',
  L1: 'bg-slate-100 text-slate-700',
  L2: 'bg-blue-100 text-blue-700',
  L3: 'bg-teal-100 text-teal-700',
  L4: 'bg-cyan-100 text-cyan-700',
  L5: 'bg-sky-100 text-sky-700',
  L6: 'bg-blue-100 text-blue-700',
  L7: 'bg-slate-200 text-slate-700',
  HE_UG: 'bg-rose-100 text-rose-700',
  HE_PG: 'bg-red-100 text-red-700',
};

export default function FindCourses() {
  const [mode, setMode] = useState<SearchMode>('role');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);

  const { recordCourseClick, recordedCourses, shouldShowLeadCapture } = useClickTracking();

  const [roleSearch, setRoleSearch] = useState('');
  const [roleSuggestions, setRoleSuggestions] = useState<OccupationLevel[]>([]);
  const [selectedRole, setSelectedRole] = useState<OccupationLevel | null>(null);
  const [intent, setIntent] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const [skillSearch, setSkillSearch] = useState('');

  const [selectedFunding, setSelectedFunding] = useState<string[]>([]);

  const [selectedQualLevels, setSelectedQualLevels] = useState<string[]>([]);
  const [selectedDeliveryModes, setSelectedDeliveryModes] = useState<string[]>([]);
  const [selectedProviderType, setSelectedProviderType] = useState('');

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (roleSearch.trim().length < 2) {
      setRoleSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      const { data } = await supabase
        .from('occupation_levels')
        .select('id, occupation_title, slug')
        .ilike('occupation_title', `%${roleSearch.trim()}%`)
        .limit(8);
      if (data) {
        setRoleSuggestions(data);
        setShowSuggestions(true);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [roleSearch]);

  useEffect(() => {
    fetchCourses();
  }, [mode, selectedRole, intent, selectedFunding, selectedQualLevels, selectedDeliveryModes, selectedProviderType]);

  useEffect(() => {
    if (shouldShowLeadCapture) {
      setShowLeadCapture(true);
    }
  }, [shouldShowLeadCapture]);

  const fetchCourses = async () => {
    setLoading(true);
    let query = supabase
      .from('courses')
      .select('*, course_providers(provider_name, provider_type)')
      .eq('is_active', true)
      .order('course_title');

    if (mode === 'role' && selectedRole) {
      query = query.contains('occupation_ids', [selectedRole.id]);
    }

    if (mode === 'skill' && skillSearch.trim()) {
      query = query.ilike('course_title', `%${skillSearch.trim()}%`);
    }

    if (mode === 'funding' && selectedFunding.length > 0) {
      query = query.contains('funding_tags', selectedFunding);
    }

    if (selectedQualLevels.length > 0) {
      query = query.in('qualification_level', selectedQualLevels);
    }

    if (selectedDeliveryModes.length > 0) {
      query = query.in('delivery_mode', selectedDeliveryModes);
    }

    if (selectedProviderType) {
      query = query.eq('course_providers.provider_type', selectedProviderType);
    }

    const { data } = await query;
    setCourses(data || []);
    setLoading(false);
  };

  const handleSkillSearch = () => {
    fetchCourses();
  };

  const toggleMultiSelect = (value: string, selected: string[], setter: (v: string[]) => void) => {
    setter(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  const clearAllFilters = () => {
    setSelectedQualLevels([]);
    setSelectedDeliveryModes([]);
    setSelectedProviderType('');
    setRoleSearch('');
    setSelectedRole(null);
    setIntent('');
    setSkillSearch('');
    setSelectedFunding([]);
  };

  const hasActiveFilters = selectedQualLevels.length > 0 || selectedDeliveryModes.length > 0 || selectedProviderType;

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Qualification Level</h3>
        <div className="space-y-1.5">
          {qualificationLevels.map((level) => (
            <label key={level} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedQualLevels.includes(level)}
                onChange={() => toggleMultiSelect(level, selectedQualLevels, setSelectedQualLevels)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                {qualLevelLabels[level]}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Delivery Mode</h3>
        <div className="space-y-1.5">
          {deliveryModes.map((dm) => (
            <label key={dm} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedDeliveryModes.includes(dm)}
                onChange={() => toggleMultiSelect(dm, selectedDeliveryModes, setSelectedDeliveryModes)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                {deliveryModeLabels[dm]}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Provider Type</h3>
        <select
          value={selectedProviderType}
          onChange={(e) => setSelectedProviderType(e.target.value)}
          className="input-base"
        >
          <option value="">All Providers</option>
          {providerTypes.map((pt) => (
            <option key={pt} value={pt}>{providerTypeLabels[pt]}</option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          onClick={() => {
            setSelectedQualLevels([]);
            setSelectedDeliveryModes([]);
            setSelectedProviderType('');
          }}
          className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="bg-white border-b border-slate-100">
        <div className="section-container py-8">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-2">
            Find Courses
          </h1>
          <p className="text-slate-500 mb-6 max-w-lg">
            Discover funded training, qualifications, and CPD courses across health and social care
          </p>

          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
            {([
              { key: 'role' as SearchMode, label: 'Role-Based', icon: Briefcase },
              { key: 'skill' as SearchMode, label: 'Skill-Based', icon: Search },
              { key: 'funding' as SearchMode, label: 'Funding-Led', icon: PoundSterling },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setMode(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === tab.key
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-5">
            {mode === 'role' && (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1" ref={suggestionsRef}>
                  <Briefcase size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={roleSearch}
                    onChange={(e) => {
                      setRoleSearch(e.target.value);
                      setSelectedRole(null);
                    }}
                    placeholder="Start typing your job role..."
                    className="input-base pl-10"
                  />
                  {showSuggestions && roleSuggestions.length > 0 && (
                    <div className="absolute z-20 top-full mt-1 w-full bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                      {roleSuggestions.map((role) => (
                        <button
                          key={role.id}
                          onClick={() => {
                            setSelectedRole(role);
                            setRoleSearch(role.occupation_title);
                            setShowSuggestions(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                        >
                          {role.occupation_title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <select
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  className="input-base sm:max-w-[220px]"
                >
                  <option value="">What's your goal?</option>
                  {intentOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            )}

            {mode === 'skill' && (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSkillSearch()}
                    placeholder="Search by course title or skill..."
                    className="input-base pl-10"
                  />
                </div>
                <button onClick={handleSkillSearch} className="btn-primary flex-shrink-0">
                  <Search size={16} />
                  Search
                </button>
              </div>
            )}

            {mode === 'funding' && (
              <div className="flex flex-wrap gap-2">
                {fundingOptions.map((fund) => (
                  <label
                    key={fund}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                      selectedFunding.includes(fund)
                        ? 'border-brand-300 bg-brand-50 text-brand-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFunding.includes(fund)}
                      onChange={() => toggleMultiSelect(fund, selectedFunding, setSelectedFunding)}
                      className="sr-only"
                    />
                    {fundingTagLabels[fund] || fund}
                  </label>
                ))}
              </div>
            )}
          </div>

          {selectedRole && (
            <div className="flex items-center gap-2 mt-4">
              <span className="badge-brand flex items-center gap-1">
                <Briefcase size={10} />
                {selectedRole.occupation_title}
                <button onClick={() => { setSelectedRole(null); setRoleSearch(''); }}><X size={12} /></button>
              </span>
              {intent && (
                <span className="badge-brand flex items-center gap-1">
                  {intent}
                  <button onClick={() => setIntent('')}><X size={12} /></button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="section-container py-8">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
          <aside className="hidden lg:block">
            <div className="card-base p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal size={16} className="text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-900">Filters</h2>
              </div>
              {filterPanel}
            </div>
          </aside>

          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`btn-secondary w-full ${showMobileFilters ? 'border-brand-300 bg-brand-50 text-brand-700' : ''}`}
            >
              <Filter size={16} />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] text-white">
                  {selectedQualLevels.length + selectedDeliveryModes.length + (selectedProviderType ? 1 : 0)}
                </span>
              )}
              <ChevronDown size={14} className={`ml-auto transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
            </button>
            {showMobileFilters && (
              <div className="card-base p-5 mt-3 animate-fade-in-down">
                {filterPanel}
              </div>
            )}
          </div>

          <div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen size={40} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-1">No courses found</h3>
                <p className="text-sm text-slate-500 mb-4">Try adjusting your search or filters</p>
                <button onClick={clearAllFilters} className="btn-secondary text-xs">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-500 mb-5">
                  {courses.length} course{courses.length !== 1 ? 's' : ''} found
                </p>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {courses.map((course) => (
                    <div key={course.id} className="card-base p-5 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className={`badge text-[10px] ${qualBadgeColors[course.qualification_level] || 'bg-slate-100 text-slate-600'}`}>
                          {qualLevelLabels[course.qualification_level] || course.qualification_level}
                        </span>
                        <span className="badge-slate text-[10px]">
                          {deliveryModeLabels[course.delivery_mode] || course.delivery_mode}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1.5 line-clamp-2">
                        {course.course_title}
                      </h3>
                      {course.course_providers && (
                        <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                          <GraduationCap size={12} />
                          {course.course_providers.provider_name}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                        {course.duration_weeks != null && course.duration_weeks > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {course.duration_weeks} week{course.duration_weeks !== 1 ? 's' : ''}
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <PoundSterling size={12} />
                          {course.cost_gbp != null ? `\u00A3${Number(course.cost_gbp).toLocaleString()}` : 'Free'}
                        </span>
                      </div>
                      {Array.isArray(course.funding_tags) && course.funding_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {course.funding_tags.map((tag: string) => (
                            <span
                              key={tag}
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${fundingChipColors[tag] || 'bg-slate-100 text-slate-600'}`}
                            >
                              {fundingTagLabels[tag] || tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-auto pt-3 border-t border-slate-50">
                        {course.course_url ? (
                          <a
                            href={course.course_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => recordCourseClick(course.course_title)}
                            className="flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                          >
                            View Course
                            <ExternalLink size={13} />
                          </a>
                        ) : (
                          <span className="flex items-center justify-center text-sm text-slate-400">
                            No link available
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <LeadCapture
        isOpen={showLeadCapture}
        onClose={() => setShowLeadCapture(false)}
        recordedCourses={recordedCourses}
      />
    </div>
  );
}

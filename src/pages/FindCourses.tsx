import { useEffect, useState, useRef } from 'react';
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
  LDSS: 'LDSS', apprenticeship: 'Apprenticeship', LSF: 'LSF',
  advanced_learner_loan: 'Advanced Learner Loan', free_courses: 'Free Courses',
  nhs_workforce_development: 'NHS Workforce Dev',
};

const fundingChipBg: Record<string, string> = {
  LDSS: 'bg-secondary-container text-on-secondary-container',
  apprenticeship: 'bg-primary-fixed text-on-primary-fixed-variant',
  LSF: 'bg-secondary-fixed text-on-secondary-fixed',
  advanced_learner_loan: 'bg-warm-100 text-warm-700',
  free_courses: 'bg-surface-container-high text-on-surface-variant',
  nhs_workforce_development: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
};

export default function FindCourses() {
  const [mode, setMode] = useState<SearchMode>('role');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);

  const { recordCourseClick, recordedCourses, recordedCourseData, shouldShowLeadCapture, dismissLeadCapture } = useClickTracking();

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
    if (roleSearch.trim().length < 2) { setRoleSuggestions([]); return; }
    const timeout = setTimeout(async () => {
      const { data } = await supabase.from('occupation_levels').select('id, occupation_title, slug').ilike('occupation_title', `%${roleSearch.trim()}%`).limit(8);
      if (data) { setRoleSuggestions(data); setShowSuggestions(true); }
    }, 300);
    return () => clearTimeout(timeout);
  }, [roleSearch]);

  useEffect(() => { fetchCourses(); }, [mode, selectedRole, intent, selectedFunding, selectedQualLevels, selectedDeliveryModes, selectedProviderType]);

  useEffect(() => { if (shouldShowLeadCapture) setShowLeadCapture(true); }, [shouldShowLeadCapture]);

  const fetchCourses = async () => {
    setLoading(true);
    let query = supabase.from('courses').select('*, course_providers(provider_name, provider_type)').eq('is_active', true).order('course_title');
    if (mode === 'role' && selectedRole) query = query.contains('occupation_ids', [selectedRole.id]);
    if (mode === 'skill' && skillSearch.trim()) query = query.ilike('course_title', `%${skillSearch.trim()}%`);
    if (mode === 'funding' && selectedFunding.length > 0) query = query.contains('funding_tags', selectedFunding);
    if (selectedQualLevels.length > 0) query = query.in('qualification_level', selectedQualLevels);
    if (selectedDeliveryModes.length > 0) query = query.in('delivery_mode', selectedDeliveryModes);
    if (selectedProviderType) query = query.eq('course_providers.provider_type', selectedProviderType);
    const { data } = await query;
    setCourses(data || []);
    setLoading(false);
  };

  const toggleMultiSelect = (value: string, selected: string[], setter: (v: string[]) => void) => {
    setter(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  const clearAllFilters = () => {
    setSelectedQualLevels([]); setSelectedDeliveryModes([]); setSelectedProviderType('');
    setRoleSearch(''); setSelectedRole(null); setIntent(''); setSkillSearch(''); setSelectedFunding([]);
  };

  const hasActiveFilters = selectedQualLevels.length > 0 || selectedDeliveryModes.length > 0 || !!selectedProviderType;

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-3">Qualification Level</h3>
        <div className="space-y-1.5">
          {qualificationLevels.map((level) => (
            <label key={level} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={selectedQualLevels.includes(level)} onChange={() => toggleMultiSelect(level, selectedQualLevels, setSelectedQualLevels)} className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/20 accent-primary" />
              <span className="text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors">{qualLevelLabels[level]}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-3">Delivery Mode</h3>
        <div className="space-y-1.5">
          {deliveryModes.map((dm) => (
            <label key={dm} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={selectedDeliveryModes.includes(dm)} onChange={() => toggleMultiSelect(dm, selectedDeliveryModes, setSelectedDeliveryModes)} className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/20 accent-primary" />
              <span className="text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors">{deliveryModeLabels[dm]}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-3">Provider Type</h3>
        <select value={selectedProviderType} onChange={(e) => setSelectedProviderType(e.target.value)} className="input-base">
          <option value="">All Providers</option>
          {providerTypes.map((pt) => <option key={pt} value={pt}>{providerTypeLabels[pt]}</option>)}
        </select>
      </div>
      {hasActiveFilters && (
        <button onClick={() => { setSelectedQualLevels([]); setSelectedDeliveryModes([]); setSelectedProviderType(''); }} className="text-label-md font-medium text-primary hover:opacity-80 transition-opacity">
          Clear filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-slate-200">
        <div className="section-container py-8">
          <h1 className="text-headline-lg font-headline font-bold text-on-surface mb-2">Find Courses</h1>
          <p className="text-body-md text-on-surface-variant mb-6 max-w-lg">
            Discover funded training, qualifications, and CPD courses across health and social care
          </p>

          <div className="flex gap-1 p-1 bg-surface-container rounded-xl w-fit">
            {([
              { key: 'role' as SearchMode, label: 'Role-Based', icon: 'work' },
              { key: 'skill' as SearchMode, label: 'Skill-Based', icon: 'search' },
              { key: 'funding' as SearchMode, label: 'Funding-Led', icon: 'payments' },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setMode(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-label-md font-medium transition-all ${
                  mode === tab.key ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-5">
            {mode === 'role' && (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1" ref={suggestionsRef}>
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: '18px' }}>work</span>
                  <input type="text" value={roleSearch} onChange={(e) => { setRoleSearch(e.target.value); setSelectedRole(null); }} placeholder="Start typing your job role..." className="input-base pl-10" />
                  {showSuggestions && roleSuggestions.length > 0 && (
                    <div className="absolute z-20 top-full mt-1 w-full bg-white rounded-xl border border-outline-variant shadow-elevation-2 overflow-hidden">
                      {roleSuggestions.map((role) => (
                        <button key={role.id} onClick={() => { setSelectedRole(role); setRoleSearch(role.occupation_title); setShowSuggestions(false); }} className="w-full text-left px-4 py-2.5 text-label-md text-on-surface hover:bg-surface-container-low transition-colors">
                          {role.occupation_title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <select value={intent} onChange={(e) => setIntent(e.target.value)} className="input-base sm:max-w-[220px]">
                  <option value="">What's your goal?</option>
                  {intentOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            )}

            {mode === 'skill' && (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: '18px' }}>search</span>
                  <input type="text" value={skillSearch} onChange={(e) => setSkillSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchCourses()} placeholder="Search by course title or skill..." className="input-base pl-10" />
                </div>
                <button onClick={fetchCourses} className="btn-primary flex-shrink-0">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>search</span>
                  Search
                </button>
              </div>
            )}

            {mode === 'funding' && (
              <div className="flex flex-wrap gap-2">
                {fundingOptions.map((fund) => (
                  <label key={fund} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-label-md font-medium cursor-pointer transition-all ${selectedFunding.includes(fund) ? 'border-primary bg-primary-fixed text-on-primary-fixed-variant' : 'border-outline-variant bg-white text-on-surface-variant hover:border-outline'}`}>
                    <input type="checkbox" checked={selectedFunding.includes(fund)} onChange={() => toggleMultiSelect(fund, selectedFunding, setSelectedFunding)} className="sr-only" />
                    {fundingTagLabels[fund] || fund}
                  </label>
                ))}
              </div>
            )}
          </div>

          {selectedRole && (
            <div className="flex items-center gap-2 mt-4">
              <span className="badge-brand flex items-center gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>work</span>
                {selectedRole.occupation_title}
                <button onClick={() => { setSelectedRole(null); setRoleSearch(''); }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>close</span>
                </button>
              </span>
              {intent && (
                <span className="badge-brand flex items-center gap-1">
                  {intent}
                  <button onClick={() => setIntent('')}>
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>close</span>
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="section-container py-8 pb-16">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
          <aside className="hidden lg:block">
            <div className="card-base p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '16px' }}>tune</span>
                <h2 className="text-label-md font-semibold text-on-surface">Filters</h2>
              </div>
              {filterPanel}
            </div>
          </aside>

          <div className="lg:hidden mb-4">
            <button onClick={() => setShowMobileFilters(!showMobileFilters)} className={`btn-secondary w-full ${showMobileFilters ? 'border-primary bg-primary-fixed text-primary' : ''}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>tune</span>
              Filters
              {hasActiveFilters && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[10px]">
                  {selectedQualLevels.length + selectedDeliveryModes.length + (selectedProviderType ? 1 : 0)}
                </span>
              )}
              <span className={`material-symbols-outlined ml-auto transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} style={{ fontSize: '14px' }}>expand_more</span>
            </button>
            {showMobileFilters && <div className="card-base p-5 mt-3 animate-fade-in-down">{filterPanel}</div>}
          </div>

          <div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '32px' }}>progress_activity</span>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-on-surface-variant mb-4 block" style={{ fontSize: '48px', opacity: 0.3 }}>menu_book</span>
                <h3 className="text-headline-md font-headline font-semibold text-on-surface mb-1">No courses found</h3>
                <p className="text-body-md text-on-surface-variant mb-4">Try adjusting your search or filters</p>
                <button onClick={clearAllFilters} className="btn-secondary text-label-md">Clear All Filters</button>
              </div>
            ) : (
              <>
                <p className="text-label-md text-on-surface-variant mb-5">
                  {courses.length} course{courses.length !== 1 ? 's' : ''} found
                </p>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {courses.map((course) => (
                    <div key={course.id} className="card-base p-5 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="badge bg-surface-container text-on-surface-variant text-[10px]">
                          {qualLevelLabels[course.qualification_level] || course.qualification_level}
                        </span>
                        <span className="badge bg-surface-container-low text-on-surface-variant text-[10px]">
                          {deliveryModeLabels[course.delivery_mode] || course.delivery_mode}
                        </span>
                      </div>
                      <h3 className="text-label-md font-semibold text-on-surface mb-1.5 line-clamp-2">{course.course_title}</h3>
                      {course.course_providers && (
                        <p className="text-label-sm text-on-surface-variant mb-3 flex items-center gap-1">
                          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>school</span>
                          {course.course_providers.provider_name}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-label-sm text-on-surface-variant mb-3">
                        {course.duration_weeks != null && course.duration_weeks > 0 && (
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>schedule</span>
                            {course.duration_weeks} week{course.duration_weeks !== 1 ? 's' : ''}
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-semibold text-on-surface">
                          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>payments</span>
                          {course.cost_gbp != null ? `£${Number(course.cost_gbp).toLocaleString()}` : 'Free'}
                        </span>
                      </div>
                      {Array.isArray(course.funding_tags) && course.funding_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {course.funding_tags.map((tag: string) => (
                            <span key={tag} className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${fundingChipBg[tag] || 'bg-surface-container text-on-surface-variant'}`}>
                              {fundingTagLabels[tag] || tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-auto pt-3 border-t border-surface-container-high">
                        {course.course_url ? (
                          <a
                            href={course.course_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => recordCourseClick(course.course_title, { fundingTags: course.funding_tags, qualLevel: course.qualification_level })}
                            className="flex items-center justify-center gap-1.5 text-label-md font-semibold text-primary hover:opacity-80 transition-opacity"
                          >
                            View Course
                            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>open_in_new</span>
                          </a>
                        ) : (
                          <span className="flex items-center justify-center text-label-md text-on-surface-variant">No link available</span>
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
        onClose={() => { setShowLeadCapture(false); dismissLeadCapture(); }}
        recordedCourses={recordedCourses}
        recordedCourseData={recordedCourseData}
      />
    </div>
  );
}

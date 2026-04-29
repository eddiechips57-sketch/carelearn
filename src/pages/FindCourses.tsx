import { useEffect, useState, useRef, useMemo } from 'react';
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

const qualLevelLabels: Record<string, string> = {
  Entry: 'Entry', L1: 'Level 1', L2: 'Level 2', L3: 'Level 3',
  L4: 'Level 4', L5: 'Level 5', L6: 'Level 6', L7: 'Level 7',
  HE_UG: 'Undergraduate', HE_PG: 'Postgraduate',
};

const fundingTagLabels: Record<string, string> = {
  LDSS: 'LDSS', apprenticeship: 'Apprenticeship', LSF: 'LSF',
  advanced_learner_loan: 'Advanced Learner Loan', free_courses: 'Free Courses',
  nhs_workforce_development: 'NHS Workforce Dev',
};

const categories = ['Nursing', 'Mental Health', 'Elderly Care', 'Pediatrics'];
const filterLevels = ['Entry', 'L2', 'L3'];
const fundingOptions: Array<'all' | 'free' | 'funded'> = ['all', 'free', 'funded'];

const PAGE_SIZE = 6;

export default function FindCourses() {
  const [mode, setMode] = useState<SearchMode>('skill');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'duration'>('popular');

  const { recordCourseClick, recordedCourses, recordedCourseData, shouldShowLeadCapture, dismissLeadCapture } = useClickTracking();

  const [roleSearch, setRoleSearch] = useState('');
  const [roleSuggestions, setRoleSuggestions] = useState<OccupationLevel[]>([]);
  const [selectedRole, setSelectedRole] = useState<OccupationLevel | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const [skillSearch, setSkillSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [fundingFilter, setFundingFilter] = useState<'all' | 'free' | 'funded'>('all');

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

  useEffect(() => {
    (async () => {
      setLoading(true);
      let query = supabase.from('courses').select('*, course_providers(provider_name, provider_type)').eq('is_active', true);
      if (mode === 'role' && selectedRole) query = query.contains('occupation_ids', [selectedRole.id]);
      if (mode === 'skill' && skillSearch.trim()) query = query.ilike('course_title', `%${skillSearch.trim()}%`);
      if (selectedLevels.length > 0) query = query.in('qualification_level', selectedLevels);
      const { data } = await query;
      setCourses(data || []);
      setLoading(false);
      setPage(1);
    })();
  }, [mode, selectedRole, skillSearch, selectedLevels]);

  useEffect(() => { if (shouldShowLeadCapture) setShowLeadCapture(true); }, [shouldShowLeadCapture]);

  const toggle = (value: string, selected: string[], setter: (v: string[]) => void) => {
    setter(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  const filteredCourses = useMemo(() => {
    let list = courses;
    if (selectedCategories.length > 0) {
      list = list.filter((c) =>
        selectedCategories.some((cat) => c.course_title.toLowerCase().includes(cat.toLowerCase()))
      );
    }
    if (fundingFilter === 'free') list = list.filter((c) => !c.cost_gbp || c.cost_gbp === 0);
    if (fundingFilter === 'funded') list = list.filter((c) => Array.isArray(c.funding_tags) && c.funding_tags.length > 0);
    if (sortBy === 'duration') list = [...list].sort((a, b) => (a.duration_weeks || 0) - (b.duration_weeks || 0));
    return list;
  }, [courses, selectedCategories, fundingFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE));
  const pageCourses = filteredCourses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearAll = () => {
    setSelectedCategories([]); setSelectedLevels([]); setFundingFilter('all');
    setRoleSearch(''); setSelectedRole(null); setSkillSearch('');
  };

  return (
    <div className="min-h-screen bg-surface">
      <main className="max-w-7xl mx-auto px-6 pt-12">
        {/* Search mode tabs */}
        <div className="mb-8">
          <div className="flex gap-1 p-1 bg-surface-container rounded-xl w-fit mb-5">
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

          {mode === 'role' && (
            <div className="relative max-w-xl" ref={suggestionsRef}>
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: '18px' }}>work</span>
              <input
                type="text"
                value={roleSearch}
                onChange={(e) => { setRoleSearch(e.target.value); setSelectedRole(null); }}
                placeholder="Start typing your job role..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-label-md focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
              />
              {showSuggestions && roleSuggestions.length > 0 && (
                <div className="absolute z-20 top-full mt-1 w-full bg-white rounded-xl border border-outline-variant shadow-lg overflow-hidden">
                  {roleSuggestions.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => { setSelectedRole(role); setRoleSearch(role.occupation_title); setShowSuggestions(false); }}
                      className="w-full text-left px-4 py-2.5 text-label-md text-on-surface hover:bg-surface-container-low transition-colors"
                    >
                      {role.occupation_title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {mode === 'skill' && (
            <div className="relative max-w-xl">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: '18px' }}>search</span>
              <input
                type="text"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder="Search by course title or skill..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-label-md focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
              />
            </div>
          )}

          {mode === 'funding' && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(fundingTagLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => toggle(key, selectedCategories, setSelectedCategories)}
                  className={`px-4 py-2 rounded-xl border text-label-md font-medium transition-all ${
                    selectedCategories.includes(key)
                      ? 'border-primary bg-primary-fixed text-on-primary-fixed-variant'
                      : 'border-outline-variant bg-white text-on-surface-variant hover:border-outline'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-headline-md font-headline text-primary">Filters</h2>
                <button onClick={clearAll} className="text-label-sm text-secondary hover:underline">Clear all</button>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="text-headline-md font-headline text-base font-semibold text-on-surface">Category</h3>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggle(cat, selectedCategories, setSelectedCategories)}
                        className="w-5 h-5 rounded border-slate-300 text-secondary focus:ring-secondary"
                      />
                      <span className="text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="text-headline-md font-headline text-base font-semibold text-on-surface">Level</h3>
                <div className="space-y-3">
                  {filterLevels.map((level) => (
                    <label key={level} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedLevels.includes(level)}
                        onChange={() => toggle(level, selectedLevels, setSelectedLevels)}
                        className="w-5 h-5 rounded border-slate-300 text-secondary focus:ring-secondary"
                      />
                      <span className="text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors">{qualLevelLabels[level]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-headline-md font-headline text-base font-semibold text-on-surface">Funding Type</h3>
                <div className="space-y-3">
                  {fundingOptions.map((opt) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="funding"
                        checked={fundingFilter === opt}
                        onChange={() => setFundingFilter(opt)}
                        className="w-5 h-5 border-slate-300 text-secondary focus:ring-secondary"
                      />
                      <span className="text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors capitalize">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <section className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-headline-lg font-headline text-on-surface">Explore Courses</h1>
                <p className="text-body-md text-on-surface-variant">
                  Showing {filteredCourses.length} professional development pathway{filteredCourses.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200">
                <span className="text-label-md text-on-surface-variant">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="border-none bg-transparent text-label-md text-on-surface focus:ring-0 cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newly Added</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '32px' }}>progress_activity</span>
              </div>
            ) : pageCourses.length === 0 ? (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-on-surface-variant mb-4 block" style={{ fontSize: '48px', opacity: 0.3 }}>menu_book</span>
                <h3 className="text-headline-md font-headline font-semibold text-on-surface mb-1">No courses found</h3>
                <p className="text-body-md text-on-surface-variant mb-4">Try adjusting your search or filters</p>
                <button onClick={clearAll} className="btn-secondary text-label-md">Clear All Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pageCourses.map((course, i) => {
                    const isFree = !course.cost_gbp || course.cost_gbp === 0;
                    const cat = categoryFor(course.course_title);
                    return (
                      <article
                        key={course.id}
                        className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_4px_20px_0_rgba(15,23,42,0.05)] hover:shadow-[0_10px_30px_0_rgba(15,23,42,0.1)] hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src={courseImages[i % courseImages.length]}
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-secondary-container/90 backdrop-blur-sm text-on-secondary-container px-3 py-1 rounded-full text-label-sm">
                              {cat}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 space-y-4">
                          <h3 className="text-headline-md font-headline text-xl text-on-surface leading-tight line-clamp-2">
                            {course.course_title}
                          </h3>
                          <div className="flex items-center gap-4 text-on-surface-variant">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm">schedule</span>
                              <span className="text-label-md">{course.duration_weeks ?? 0}h</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm">stairs</span>
                              <span className="text-label-md">{qualLevelLabels[course.qualification_level] || course.qualification_level}</span>
                            </div>
                          </div>
                          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className={`text-label-md px-3 py-1 rounded-full ${
                              isFree ? 'bg-secondary-fixed text-on-secondary-fixed-variant' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                            }`}>
                              {isFree ? 'Free' : 'Funded'}
                            </span>
                            {course.course_url ? (
                              <a
                                href={course.course_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => recordCourseClick(course.course_title, { fundingTags: course.funding_tags, qualLevel: course.qualification_level })}
                                className="text-primary text-label-md flex items-center gap-1 hover:gap-2 transition-all"
                              >
                                View Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                              </a>
                            ) : (
                              <span className="text-on-surface-variant text-label-md">No link</span>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-12 pb-8">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-on-surface hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
                      const n = i + 1;
                      return (
                        <button
                          key={n}
                          onClick={() => setPage(n)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg text-label-md transition-all ${
                            page === n ? 'bg-primary text-white' : 'border border-slate-200 text-on-surface hover:bg-slate-50'
                          }`}
                        >
                          {n}
                        </button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="mx-2 text-slate-400">...</span>
                        <button
                          onClick={() => setPage(totalPages)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg text-label-md transition-all ${
                            page === totalPages ? 'bg-primary text-white' : 'border border-slate-200 text-on-surface hover:bg-slate-50'
                          }`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-on-surface hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <LeadCapture
        isOpen={showLeadCapture}
        onClose={() => { setShowLeadCapture(false); dismissLeadCapture(); }}
        recordedCourses={recordedCourses}
        recordedCourseData={recordedCourseData}
      />
    </div>
  );
}

const courseImages = [
  'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4421494/pexels-photo-4421494.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&w=800',
];

function categoryFor(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('nurs')) return 'Nursing';
  if (t.includes('mental') || t.includes('dementia') || t.includes('therap')) return 'Mental Health';
  if (t.includes('child') || t.includes('pediatr') || t.includes('paed')) return 'Pediatrics';
  if (t.includes('elder') || t.includes('aged') || t.includes('care')) return 'Elderly Care';
  return 'Healthcare';
}

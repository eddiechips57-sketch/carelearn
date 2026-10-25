import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useClickTracking } from '../contexts/ClickTrackingContext';
import { createCheckoutSession } from '../services/stripeCheckout';
import LeadCapture from '../components/LeadCapture';
import SEOHead from '../components/SEOHead';
import { BookOpen, Download, ShoppingBag, FileText, Search, Sparkles, Check, Loader2, Lock, CheckCircle2, X } from 'lucide-react';

interface Ebook {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  long_description: string | null;
  author: string;
  category: string;
  cover_image_url: string | null;
  price_gbp: number;
  stripe_price_id: string | null;
  pdf_url: string | null;
  page_count: number | null;
  format: string;
  target_audience: string[];
  included_toolkit_items: string[];
  tags: string[];
  is_featured: boolean;
  download_count: number;
  sort_order: number;
}

const categoryLabels: Record<string, string> = {
  family_behaviour_support: 'Family & Behaviour Support',
  home_care_recovery: 'Home Care & Recovery',
  navigating_care_system: 'Navigating the Care System',
  carer_wellbeing: 'Carer Wellbeing',
  printable_packs: 'Printable Packs',
};

const categoryDescriptions: Record<string, string> = {
  family_behaviour_support: 'De-escalation, communication, and sensory support',
  home_care_recovery: 'Dementia, recovery, mobility, and mealtimes',
  navigating_care_system: 'Funding, assessments, and care coordination',
  carer_wellbeing: 'Activities, burnout, and self-care',
  printable_packs: 'Standalone fillable templates and visual aids',
};

const audienceLabels: Record<string, string> = {
  parents_guardians: 'Parents & Guardians',
  family_carers: 'Family Carers',
  support_workers: 'Support Workers',
};

const categoryFilters = [
  { key: 'family_behaviour_support', label: 'Family & Behaviour Support' },
  { key: 'home_care_recovery', label: 'Home Care & Recovery' },
  { key: 'navigating_care_system', label: 'Navigating the Care System' },
  { key: 'carer_wellbeing', label: 'Carer Wellbeing' },
  { key: 'printable_packs', label: 'Printable Packs' },
];

const audienceFilters = [
  { key: 'parents_guardians', label: 'Parents & Guardians' },
  { key: 'family_carers', label: 'Family Carers' },
  { key: 'support_workers', label: 'Support Workers' },
];

const PAGE_SIZE = 9;

export default function EbookStore() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'shortest'>('popular');
  const [page, setPage] = useState(1);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [pendingReadSlug, setPendingReadSlug] = useState<string | null>(null);
  const [checkoutSlug, setCheckoutSlug] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'cancel' | null; slug: string }>({ type: null, slug: '' });
  const [searchParams, setSearchParams] = useSearchParams();

  const { user } = useAuth();
  const { recordEbookView, recordedEbooks, recordedEbookData, shouldShowLeadCapture, dismissLeadCapture } = useClickTracking();

  useEffect(() => {
    const status = searchParams.get('checkout');
    const slug = searchParams.get('slug');
    if (status && slug) {
      setToast({ type: status as 'success' | 'cancel', slug });
      setSearchParams({}, { replace: true });
      const timer = setTimeout(() => setToast({ type: null, slug: '' }), 6000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });
      if (error) {
        console.error('Error fetching ebooks:', error);
      }
      setEbooks((data || []) as unknown as Ebook[]);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (shouldShowLeadCapture) setShowLeadCapture(true);
  }, [shouldShowLeadCapture]);

  useEffect(() => {
    const buySlug = searchParams.get('buy');
    if (!buySlug || !user || loading || ebooks.length === 0) return;
    const target = ebooks.find((e) => e.slug === buySlug);
    if (!target) return;
    setSearchParams({}, { replace: true });
    handleBuy(target);
  }, [searchParams, user, loading, ebooks]);

  const toggle = (value: string, selected: string[], setter: (v: string[]) => void) => {
    setter(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  const filteredEbooks = useMemo(() => {
    let list = ebooks;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.short_description.toLowerCase().includes(q) ||
          (e.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategories.length > 0) {
      list = list.filter((e) => selectedCategories.includes(e.category));
    }

    if (selectedAudiences.length > 0) {
      list = list.filter((e) =>
        (e.target_audience || []).some((a) => selectedAudiences.includes(a))
      );
    }

    if (priceFilter === 'free') list = list.filter((e) => Number(e.price_gbp) === 0);
    if (priceFilter === 'paid') list = list.filter((e) => Number(e.price_gbp) > 0);

    if (sortBy === 'popular') list = [...list].sort((a, b) => b.download_count - a.download_count);
    if (sortBy === 'shortest') list = [...list].sort((a, b) => (a.page_count || 0) - (b.page_count || 0));
    if (sortBy === 'newest') list = [...list].sort((a, b) => b.sort_order - a.sort_order);

    return list;
  }, [ebooks, search, selectedCategories, selectedAudiences, priceFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredEbooks.length / PAGE_SIZE));
  const pageEbooks = filteredEbooks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const featuredEbooks = ebooks.filter((e) => e.is_featured).slice(0, 3);

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedAudiences([]);
    setPriceFilter('all');
    setSearch('');
  };

  const handleDownload = (ebook: Ebook) => {
    recordEbookView(ebook.title, { slug: ebook.slug, category: ebook.category });
    window.open(`/read/${ebook.slug}`, '_blank', 'noopener,noreferrer');
  };

  const handleBuy = async (ebook: Ebook) => {
    recordEbookView(ebook.title, { slug: ebook.slug, category: ebook.category });

    if (!user) {
      setPendingReadSlug(ebook.slug);
      setShowLeadCapture(true);
      return;
    }

    if (!ebook.stripe_price_id) {
      setCheckoutError('This guide is not available for purchase yet.');
      return;
    }

    setCheckoutSlug(ebook.slug);
    setCheckoutError('');
    try {
      const { url } = await createCheckoutSession(ebook.stripe_price_id, ebook.slug);
      window.location.href = url;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Could not start checkout. Please try again.');
    } finally {
      setCheckoutSlug(null);
    }
  };

  const handleCardView = (ebook: Ebook) => {
    recordEbookView(ebook.title, { slug: ebook.slug, category: ebook.category });
  };

  return (
    <>
      <SEOHead
        title="Practical Care Guides & Printable Toolkits — CareLearn"
        description="Browse plain-English care ebooks and printable toolkits for families, carers, and support workers. De-escalation, dementia care, recovery, burnout, and more."
        canonical="/ebooks"
      />
      <div className="min-h-screen bg-surface">
        {/* How It Works strip */}
        <div className="bg-primary text-on-primary">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
              <span className="text-label-md font-semibold uppercase tracking-wider opacity-90">Read + Use</span>
              <span className="flex items-center gap-2 text-label-md">
                <BookOpen size={16} /> Read the plain-English guide
              </span>
              <span className="hidden sm:block opacity-40">→</span>
              <span className="flex items-center gap-2 text-label-md">
                <FileText size={16} /> Print the toolkit sheets
              </span>
              <span className="hidden sm:block opacity-40">→</span>
              <span className="flex items-center gap-2 text-label-md">
                <Check size={16} /> Use them today
              </span>
            </div>
          </div>
        </div>

        {/* Featured banner */}
        {featuredEbooks.length > 0 && (
          <section className="bg-surface-container-low border-b border-outline-variant/30">
            <div className="max-w-7xl mx-auto px-6 py-10">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={20} className="text-secondary" />
                <h2 className="text-headline-md font-headline text-on-surface">Featured Guides</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredEbooks.map((ebook) => {
                  const isFree = Number(ebook.price_gbp) === 0;
                  return (
                    <div
                      key={ebook.id}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col sm:flex-row"
                    >
                      <div className="w-full sm:w-32 h-40 sm:h-full overflow-hidden relative shrink-0">
                        {ebook.cover_image_url && (
                          <img
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src={ebook.cover_image_url}
                          />
                        )}
                        <div className="absolute top-2 left-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${isFree ? 'bg-secondary text-on-secondary' : 'bg-tertiary text-on-tertiary'}`}>
                            {isFree ? 'Free' : '£' + Number(ebook.price_gbp).toFixed(0)}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-center">
                        <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider mb-1">
                          {categoryLabels[ebook.category]}
                        </span>
                        <h3 className="text-label-md font-headline font-semibold text-on-surface mb-2 line-clamp-2">
                          {ebook.title}
                        </h3>
                        <p className="text-label-sm text-on-surface-variant line-clamp-2 mb-3">
                          {ebook.short_description}
                        </p>
                        {isFree ? (
                          <button
                            onClick={() => handleDownload(ebook)}
                            className="inline-flex items-center justify-center gap-1.5 text-label-sm font-semibold text-secondary border border-secondary rounded-lg px-3 py-1.5 hover:bg-secondary-container transition-all w-fit"
                          >
                            <Download size={14} /> Download Free
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBuy(ebook)}
                            disabled={checkoutSlug === ebook.slug || !ebook.stripe_price_id}
                            className="inline-flex items-center justify-center gap-1.5 text-label-sm font-semibold text-on-primary bg-primary rounded-lg px-3 py-1.5 hover:bg-primary-container transition-all w-fit disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {checkoutSlug === ebook.slug ? (
                              <><Loader2 size={14} className="animate-spin" /> Redirecting...</>
                            ) : !ebook.stripe_price_id ? (
                              <><Lock size={14} /> Coming Soon</>
                            ) : (
                              <><ShoppingBag size={14} /> Buy Now</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <main className="max-w-7xl mx-auto px-6 pt-8 pb-16">
          {/* Search bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search guides by topic — dementia, behaviour, recovery, burnout..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-body-md focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
              />
            </div>
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
                  <h3 className="text-base font-headline font-semibold text-on-surface">Category</h3>
                  <div className="space-y-3">
                    {categoryFilters.map((cat) => (
                      <label key={cat.key} className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.key)}
                          onChange={() => { toggle(cat.key, selectedCategories, setSelectedCategories); setPage(1); }}
                          className="w-5 h-5 mt-0.5 rounded border-slate-300 text-secondary focus:ring-secondary"
                        />
                        <div>
                          <span className="text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors block">{cat.label}</span>
                          <span className="text-[11px] text-on-surface-variant opacity-70">{categoryDescriptions[cat.key]}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="text-base font-headline font-semibold text-on-surface">Who It's For</h3>
                  <div className="space-y-3">
                    {audienceFilters.map((aud) => (
                      <label key={aud.key} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedAudiences.includes(aud.key)}
                          onChange={() => { toggle(aud.key, selectedAudiences, setSelectedAudiences); setPage(1); }}
                          className="w-5 h-5 rounded border-slate-300 text-secondary focus:ring-secondary"
                        />
                        <span className="text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors">{aud.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-headline font-semibold text-on-surface">Price</h3>
                  <div className="space-y-3">
                    {([
                      { key: 'all' as const, label: 'All Guides' },
                      { key: 'free' as const, label: 'Free Downloads' },
                      { key: 'paid' as const, label: 'Paid Guides' },
                    ]).map((opt) => (
                      <label key={opt.key} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="price"
                          checked={priceFilter === opt.key}
                          onChange={() => { setPriceFilter(opt.key); setPage(1); }}
                          className="w-5 h-5 border-slate-300 text-secondary focus:ring-secondary"
                        />
                        <span className="text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Grid */}
            <section className="flex-1 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-headline-lg font-headline text-on-surface">Browse Care Guides</h1>
                  <p className="text-body-md text-on-surface-variant">
                    {filteredEbooks.length} guide{filteredEbooks.length !== 1 ? 's' : ''} with printable toolkits
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
                    <option value="newest">Newest</option>
                    <option value="shortest">Shortest Read</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '32px' }}>progress_activity</span>
                </div>
              ) : pageEbooks.length === 0 ? (
                <div className="text-center py-20">
                  <BookOpen size={48} className="mx-auto text-on-surface-variant opacity-30 mb-4" />
                  <h3 className="text-headline-md font-headline font-semibold text-on-surface mb-1">No guides found</h3>
                  <p className="text-body-md text-on-surface-variant mb-4">Try adjusting your search or filters</p>
                  <button onClick={clearAll} className="inline-flex items-center gap-2 rounded-xl border-2 border-secondary text-secondary text-label-md px-5 py-2.5 hover:bg-secondary-container transition-all">
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pageEbooks.map((ebook) => {
                      const isFree = Number(ebook.price_gbp) === 0;
                      const price = Number(ebook.price_gbp);
                      return (
                        <article
                          key={ebook.id}
                          className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_4px_20px_0_rgba(15,23,42,0.05)] hover:shadow-[0_10px_30px_0_rgba(15,23,42,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
                        >
                          <div className="relative h-52 overflow-hidden">
                            {ebook.cover_image_url && (
                              <img
                                alt=""
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                src={ebook.cover_image_url}
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            <div className="absolute top-3 left-3 flex gap-2">
                              <span className="bg-white/90 backdrop-blur-sm text-on-surface px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight">
                                {categoryLabels[ebook.category]}
                              </span>
                            </div>
                            <div className="absolute top-3 right-3">
                              {isFree ? (
                                <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-[11px] font-bold uppercase">
                                  Free
                                </span>
                              ) : (
                                <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-[11px] font-bold">
                                  £{price.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-5 flex flex-col flex-1">
                            <h3 className="text-headline-md font-headline text-lg text-on-surface leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {ebook.title}
                            </h3>
                            <p className="text-label-md text-on-surface-variant mb-3 line-clamp-2 flex-1">
                              {ebook.short_description}
                            </p>

                            {ebook.included_toolkit_items && ebook.included_toolkit_items.length > 0 && (
                              <div className="mb-4 p-3 bg-surface-container-low rounded-lg border border-outline-variant/20">
                                <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                  <FileText size={11} /> Includes Printable Toolkit
                                </p>
                                <p className="text-[11px] text-on-surface-variant line-clamp-1">
                                  {ebook.included_toolkit_items[0]}
                                  {ebook.included_toolkit_items.length > 1 && ` + ${ebook.included_toolkit_items.length - 1} more`}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center gap-3 text-on-surface-variant text-label-sm mb-4">
                              {ebook.page_count && (
                                <span className="flex items-center gap-1">
                                  <BookOpen size={13} /> {ebook.page_count} pages
                                </span>
                              )}
                              {ebook.format === 'printable_pack' && (
                                <span className="flex items-center gap-1">
                                  <FileText size={13} /> Printable Pack
                                </span>
                              )}
                            </div>

                            <div className="pt-3 border-t border-slate-100">
                              {isFree ? (
                                <button
                                  onClick={() => handleDownload(ebook)}
                                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border-2 border-secondary text-secondary text-label-md font-semibold py-2.5 hover:bg-secondary-container transition-all"
                                >
                                  <Download size={16} /> Download Free
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleBuy(ebook)}
                                  onMouseEnter={() => handleCardView(ebook)}
                                  disabled={checkoutSlug === ebook.slug || !ebook.stripe_price_id}
                                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-on-primary text-label-md font-semibold py-2.5 hover:bg-primary-container transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                  {checkoutSlug === ebook.slug ? (
                                    <><Loader2 size={16} className="animate-spin" /> Redirecting to checkout...</>
                                  ) : !ebook.stripe_price_id ? (
                                    <><Lock size={16} /> Coming Soon — £{price.toFixed(2)}</>
                                  ) : (
                                    <><ShoppingBag size={16} /> Buy Now — £{price.toFixed(2)}</>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-8 pb-4">
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
          onClose={() => {
            setShowLeadCapture(false);
            dismissLeadCapture();
            if (pendingReadSlug) {
              window.location.href = `/login?redirect=/ebooks&buy=${pendingReadSlug}`;
              setPendingReadSlug(null);
            }
          }}
          recordedCourses={recordedEbooks}
          recordedCourseData={recordedEbookData.map((e) => ({ title: e.title, fundingTags: [], qualLevel: e.category }))}
        />

        {checkoutError && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
            <div className="flex items-start gap-3 bg-white border border-rose-200 rounded-xl shadow-lg p-4">
              <X size={20} className="text-rose-500 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700 flex-1">{checkoutError}</p>
              <button
                onClick={() => setCheckoutError('')}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {toast.type && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
            <div className={`flex items-start gap-3 bg-white border rounded-xl shadow-lg p-4 ${toast.type === 'success' ? 'border-emerald-200' : 'border-amber-200'}`}>
              {toast.type === 'success' ? (
                <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <X size={20} className="text-amber-500 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">
                  {toast.type === 'success' ? 'Payment successful!' : 'Checkout cancelled'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {toast.type === 'success'
                    ? 'Your guide is ready to read.'
                    : 'Your card was not charged.'}
                </p>
                {toast.type === 'success' && (
                  <button
                    onClick={() => window.open(`/read/${toast.slug}`, '_blank', 'noopener,noreferrer')}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline"
                  >
                    <BookOpen size={14} /> Open your guide
                  </button>
                )}
              </div>
              <button
                onClick={() => setToast({ type: null, slug: '' })}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useClickTracking } from '../contexts/ClickTrackingContext';
import { createCheckoutSession } from '../services/stripeCheckout';
import { getEbookCoverUrl } from '../services/ebookCoverAssets';
import SEOHead from '../components/SEOHead';
import {
  BookOpen,
  Download,
  ShoppingBag,
  FileText,
  Check,
  Loader2,
  Lock,
  ArrowLeft,
  ArrowRight,
  Users,
  CheckCircle2,
  Clock,
  Star,
  Sparkles,
  X,
  Target,
} from 'lucide-react';

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
  what_youll_learn: string[];
}

const categoryLabels: Record<string, string> = {
  family_behaviour_support: 'Family & Behaviour Support',
  home_care_recovery: 'Home Care & Recovery',
  navigating_care_system: 'Navigating the Care System',
  carer_wellbeing: 'Carer Wellbeing',
  printable_packs: 'Digital Packs',
};

const audienceLabels: Record<string, string> = {
  parents_guardians: 'Parents & Guardians',
  family_carers: 'Family Carers',
  support_workers: 'Support Workers',
};

const reassurances = [
  'Instant access — read it in your browser right now',
  'Printable toolkit sheets you can use today',
  'Plain English — no jargon, no theory you cannot use',
  'Written by people who have been there',
];

export default function EbookDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { recordEbookView } = useClickTracking();

  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [related, setRelated] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [buying, setBuying] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'cancel' | null; slug: string }>({ type: null, slug: '' });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('checkout');
    const toastSlug = params.get('slug');
    if (status && toastSlug) {
      setToast({ type: status as 'success' | 'cancel', slug: toastSlug });
      window.history.replaceState({}, '', window.location.pathname);
      const timer = setTimeout(() => setToast({ type: null, slug: '' }), 6000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      setNotFound(false);
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();
      if (error || !data) {
        setNotFound(true);
      } else {
        setEbook(data as unknown as Ebook);
        recordEbookView((data as unknown as Ebook).title, { slug: (data as unknown as Ebook).slug, category: (data as unknown as Ebook).category });
        const { data: relData } = await supabase
          .from('ebooks')
          .select('*')
          .eq('is_published', true)
          .eq('category', (data as unknown as Ebook).category)
          .neq('id', (data as unknown as Ebook).id)
          .order('sort_order', { ascending: true })
          .limit(3);
        setRelated((relData || []) as unknown as Ebook[]);
      }
      setLoading(false);
    })();
  }, [slug]);

  const handleBuy = async (eb: Ebook) => {
    if (!eb.stripe_price_id) {
      setCheckoutError('This guide is not available for purchase yet.');
      return;
    }
    setBuying(true);
    setCheckoutError('');
    try {
      const { url } = await createCheckoutSession(eb.stripe_price_id, eb.slug);
      window.location.href = url;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Could not start checkout. Please try again.');
    } finally {
      setBuying(false);
    }
  };

  const handleDownload = (eb: Ebook) => {
    recordEbookView(eb.title, { slug: eb.slug, category: eb.category });
    window.open(`/read/${eb.slug}`, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !ebook) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6">
        <div className="text-center">
          <BookOpen size={48} className="mx-auto text-on-surface-variant opacity-30 mb-4" />
          <h1 className="text-headline-lg font-headline text-on-surface mb-2">Guide not found</h1>
          <p className="text-body-md text-on-surface-variant mb-6">The guide you are looking for is not available.</p>
          <Link to="/ebooks" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
            <ArrowLeft size={16} /> Back to all guides
          </Link>
        </div>
      </div>
    );
  }

  const isFree = Number(ebook.price_gbp) === 0;
  const price = Number(ebook.price_gbp);
  const coverUrl = getEbookCoverUrl(ebook.slug, ebook.cover_image_url);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: ebook.title,
    description: ebook.short_description,
    author: { '@type': 'Person', name: ebook.author || 'CareLearn' },
    offers: {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency: 'GBP',
      availability: ebook.stripe_price_id || isFree ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
    },
  };

  return (
    <>
      <SEOHead
        title={`${ebook.title} — CareLearn`}
        description={ebook.short_description}
        canonical={`/ebooks/${ebook.slug}`}
        jsonLd={jsonLd}
      />
      <div className="min-h-screen bg-surface">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <nav className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="opacity-40">/</span>
            <Link to="/ebooks" className="hover:text-primary transition-colors">Guides</Link>
            <span className="opacity-40">/</span>
            <span className="text-on-surface font-medium line-clamp-1">{ebook.title}</span>
          </nav>
        </div>

        {/* Hero / Product Summary */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Cover image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-[0_8px_40px_0_rgba(15,23,42,0.1)] bg-slate-50">
                {coverUrl ? (
                  <img src={coverUrl} alt={ebook.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen size={64} className="text-slate-300" />
                  </div>
                )}
              </div>
              {ebook.is_featured && (
                <div className="absolute -top-3 -right-3 bg-secondary text-on-secondary px-4 py-2 rounded-full text-sm font-bold uppercase tracking-tight shadow-lg flex items-center gap-1.5">
                  <Sparkles size={14} /> Featured
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {categoryLabels[ebook.category] || 'Guide'}
                </span>
                {isFree ? (
                  <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-xs font-bold uppercase">Free</span>
                ) : (
                  <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-xs font-bold">£{price.toFixed(2)}</span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-headline font-bold text-on-surface leading-tight mb-4">
                {ebook.title}
              </h1>

              <p className="text-lg text-on-surface-variant leading-relaxed mb-6">
                {ebook.short_description}
              </p>

              {/* Quick facts */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6 text-sm text-on-surface-variant">
                {ebook.page_count && (
                  <span className="flex items-center gap-2">
                    <BookOpen size={16} className="text-primary" /> {ebook.page_count} pages
                  </span>
                )}
                {ebook.author && (
                  <span className="flex items-center gap-2">
                    <Users size={16} className="text-primary" /> By {ebook.author}
                  </span>
                )}
                {ebook.format === 'printable_pack' ? (
                  <span className="flex items-center gap-2">
                    <FileText size={16} className="text-primary" /> Digital Pack
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FileText size={16} className="text-primary" /> Ebook + Toolkit
                  </span>
                )}
              </div>

              {/* Price + buy box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
                <div className="flex items-baseline gap-3 mb-4">
                  {isFree ? (
                    <span className="text-3xl font-headline font-bold text-secondary">Free</span>
                  ) : (
                    <>
                      <span className="text-3xl font-headline font-bold text-on-surface">£{price.toFixed(2)}</span>
                      <span className="text-sm text-on-surface-variant">one-time payment</span>
                    </>
                  )}
                </div>

                {isFree ? (
                  <button
                    onClick={() => handleDownload(ebook)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-secondary text-secondary text-base font-semibold py-3.5 hover:bg-secondary-container transition-all"
                  >
                    <Download size={20} /> Download Free
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuy(ebook)}
                    disabled={buying || !ebook.stripe_price_id}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-on-primary text-base font-semibold py-3.5 hover:bg-primary-container transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {buying ? (
                      <><Loader2 size={20} className="animate-spin" /> Redirecting to checkout...</>
                    ) : !ebook.stripe_price_id ? (
                      <><Lock size={20} /> Coming Soon — £{price.toFixed(2)}</>
                    ) : (
                      <><ShoppingBag size={20} /> Buy Now — £{price.toFixed(2)}</>
                    )}
                  </button>
                )}

                {checkoutError && (
                  <p className="mt-3 text-sm text-rose-600 flex items-start gap-2">
                    <X size={16} className="shrink-0 mt-0.5" /> {checkoutError}
                  </p>
                )}

                <div className="mt-4 space-y-2.5">
                  {reassurances.map((r) => (
                    <div key={r} className="flex items-start gap-2 text-sm text-on-surface-variant">
                      <Check size={16} className="text-secondary shrink-0 mt-0.5" /> {r}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {ebook.tags && ebook.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {ebook.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* What you'll learn */}
        {ebook.what_youll_learn && ebook.what_youll_learn.length > 0 && (
          <section className="bg-white border-y border-slate-200">
            <div className="max-w-4xl mx-auto px-6 py-16">
              <div className="flex items-center gap-2 mb-2">
                <Target size={22} className="text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">What You'll Learn</span>
              </div>
              <h2 className="text-headline-lg font-headline text-on-surface mb-4">
                Exactly what you will walk away with
              </h2>
              <p className="text-body-md text-on-surface-variant mb-8 max-w-2xl">
                By the time you finish this guide, you will be able to:
              </p>
              <div className="space-y-4">
                {ebook.what_youll_learn.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary text-sm font-bold shrink-0 group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                    <p className="text-body-lg text-on-surface leading-relaxed pt-1">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Long description */}
        {ebook.long_description && (
          <section className="bg-white border-y border-slate-200">
            <div className="max-w-4xl mx-auto px-6 py-16">
              <h2 className="text-headline-lg font-headline text-on-surface mb-6">About this guide</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-line">
                  {ebook.long_description}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* What's inside */}
        {ebook.included_toolkit_items && ebook.included_toolkit_items.length > 0 && (
          <section className="bg-surface-container-low">
            <div className="max-w-4xl mx-auto px-6 py-16">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={22} className="text-secondary" />
                <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Toolkit Included</span>
              </div>
              <h2 className="text-headline-lg font-headline text-on-surface mb-4">What's inside</h2>
              <p className="text-body-md text-on-surface-variant mb-8 max-w-2xl">
                Every guide comes with printable toolkit sheets you can use right away. Here is what is included:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ebook.included_toolkit_items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-slate-200 p-4">
                    <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                      <Check size={16} />
                    </div>
                    <span className="text-sm text-on-surface leading-relaxed pt-1">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Who is this for */}
        {ebook.target_audience && ebook.target_audience.length > 0 && (
          <section className="bg-white border-y border-slate-200">
            <div className="max-w-4xl mx-auto px-6 py-16">
              <div className="flex items-center gap-2 mb-2">
                <Users size={22} className="text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">Is this right for me?</span>
              </div>
              <h2 className="text-headline-lg font-headline text-on-surface mb-4">Who this guide is for</h2>
              <div className="flex flex-wrap gap-3">
                {ebook.target_audience.map((aud) => (
                  <div key={aud} className="flex items-center gap-2 bg-surface-container-low rounded-xl border border-slate-200 px-5 py-3">
                    <CheckCircle2 size={18} className="text-secondary" />
                    <span className="text-sm font-medium text-on-surface">{audienceLabels[aud] || aud}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="bg-gradient-to-br from-primary to-primary-container py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-headline-lg font-headline text-on-primary mb-4">
              {isFree ? 'Download your free guide now' : 'Ready to get started?'}
            </h2>
            <p className="text-body-lg text-on-primary opacity-90 mb-8 max-w-xl mx-auto">
              {isFree
                ? 'Open the guide in your browser and start using the toolkit sheets today.'
                : 'Buy once, read instantly in your browser, and print the toolkit sheets whenever you need them.'}
            </p>
            {isFree ? (
              <button
                onClick={() => handleDownload(ebook)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-primary text-base font-bold px-8 py-3.5 hover:bg-slate-100 transition-all"
              >
                <Download size={20} /> Download Free
              </button>
            ) : (
              <button
                onClick={() => handleBuy(ebook)}
                disabled={buying || !ebook.stripe_price_id}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-primary text-base font-bold px-8 py-3.5 hover:bg-slate-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {buying ? (
                  <><Loader2 size={20} className="animate-spin" /> Redirecting...</>
                ) : !ebook.stripe_price_id ? (
                  <><Lock size={20} /> Coming Soon</>
                ) : (
                  <><ShoppingBag size={20} /> Buy Now — £{price.toFixed(2)}</>
                )}
              </button>
            )}
          </div>
        </section>

        {/* Related guides */}
        {related.length > 0 && (
          <section className="bg-surface-container-low py-16">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-headline-lg font-headline text-on-surface">Related guides</h2>
                <Link to="/ebooks" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  View all <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((rel) => {
                  const relFree = Number(rel.price_gbp) === 0;
                  const relCover = getEbookCoverUrl(rel.slug, rel.cover_image_url);
                  return (
                    <Link
                      key={rel.id}
                      to={`/ebooks/${rel.slug}`}
                      className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-[0_10px_30px_0_rgba(15,23,42,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
                    >
                      <div className="relative h-44 overflow-hidden">
                        {relCover && (
                          <img src={relCover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        <div className="absolute top-3 right-3">
                          {relFree ? (
                            <span className="bg-secondary text-on-secondary px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">Free</span>
                          ) : (
                            <span className="bg-tertiary text-on-tertiary px-2.5 py-1 rounded-full text-[10px] font-bold">£{Number(rel.price_gbp).toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider mb-1">
                          {categoryLabels[rel.category] || 'Guide'}
                        </span>
                        <h3 className="text-sm font-headline font-semibold text-on-surface leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {rel.title}
                        </h3>
                        <p className="text-xs text-on-surface-variant line-clamp-2 flex-1">{rel.short_description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Toast */}
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
                    ? user
                      ? 'Your guide is ready to read.'
                      : 'Check your email for your account details and a link to set your password. Then sign in to read your guide.'
                    : 'Your card was not charged.'}
                </p>
                {toast.type === 'success' && (
                  <button
                    onClick={() => window.open(user ? `/read/${toast.slug}` : '/login', '_blank', 'noopener,noreferrer')}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline"
                  >
                    <BookOpen size={14} /> {user ? 'Open your guide' : 'Sign in to read'}
                  </button>
                )}
              </div>
              <button onClick={() => setToast({ type: null, slug: '' })} className="text-slate-400 hover:text-slate-600" aria-label="Dismiss">
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import SEOHead from '../components/SEOHead';
import { BookOpen, ArrowLeft, Loader2, AlertCircle, ExternalLink, Lock, LogIn, Download, Printer, ArrowRight, ShoppingBag } from 'lucide-react';

interface Ebook {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  pdf_url: string | null;
  price_gbp: number;
  page_count: number | null;
  format: string;
  category: string;
}

interface RelatedEbook {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  cover_image_url: string | null;
  price_gbp: number;
  what_youll_learn: string[];
}

type AccessState = 'loading' | 'open' | 'sign-in' | 'no-access' | 'error' | 'not-found';

export default function EbookReader() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [accessState, setAccessState] = useState<AccessState>('loading');
  const [error, setError] = useState('');
  const [opened, setOpened] = useState(false);
  const [relatedPaid, setRelatedPaid] = useState<RelatedEbook[]>([]);

  useEffect(() => {
    if (!slug) {
      setAccessState('error');
      setError('No ebook specified.');
      return;
    }
    (async () => {
      setAccessState('loading');
      const { data, error: queryError } = await supabase
        .from('ebooks')
        .select('id, title, slug, short_description, pdf_url, price_gbp, page_count, format, category')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();
      if (queryError) {
        console.error('Error fetching ebook:', queryError);
        setAccessState('error');
        setError('We could not load this guide. Please try again.');
        return;
      }
      if (!data) {
        setAccessState('not-found');
        return;
      }
      const fetched = data as Ebook;
      setEbook(fetched);

      const isFree = Number(fetched.price_gbp) === 0;
      if (isFree) {
        setAccessState('open');
        const { data: relData } = await supabase
          .from('ebooks')
          .select('id,title,slug,short_description,cover_image_url,price_gbp,what_youll_learn')
          .eq('is_published', true)
          .eq('category', fetched.category)
          .gt('price_gbp', 0)
          .neq('id', fetched.id)
          .order('sort_order', { ascending: true })
          .limit(3);
        setRelatedPaid((relData || []) as unknown as RelatedEbook[]);
        return;
      }

      if (!user) {
        setAccessState('sign-in');
        return;
      }

      const { data: order, error: orderError } = await supabase
        .from('stripe_user_orders')
        .select('order_status')
        .eq('ebook_slug', slug)
        .eq('order_status', 'completed')
        .limit(1);
      if (orderError) {
        console.error('Error checking purchase:', orderError);
        setAccessState('error');
        setError('We could not verify your purchase. Please try again.');
        return;
      }
      setAccessState(order && order.length > 0 ? 'open' : 'no-access');
    })();
  }, [slug, user]);

  const openEbook = () => {
    if (!ebook?.pdf_url || ebook.pdf_url === '#') {
      setAccessState('error');
      setError('The ebook file is not available yet.');
      return;
    }
    window.open(ebook.pdf_url, '_blank', 'noopener,noreferrer');
    setOpened(true);
  };

  const downloadPdf = () => {
    if (!ebook?.pdf_url || ebook.pdf_url === '#') {
      setAccessState('error');
      setError('The ebook file is not available yet.');
      return;
    }
    const win = window.open(ebook.pdf_url, '_blank', 'noopener,noreferrer');
    if (win) {
      win.addEventListener('load', () => {
        try { win.focus(); win.print(); } catch { /* cross-origin — user uses browser toolbar */ }
      });
    }
    setOpened(true);
  };

  useEffect(() => {
    if (accessState === 'open' && ebook && !opened) {
      const timer = setTimeout(openEbook, 600);
      return () => clearTimeout(timer);
    }
  }, [accessState, ebook, opened]);

  if (accessState === 'loading') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="mx-auto text-primary animate-spin mb-4" />
          <p className="text-body-lg text-on-surface-variant">Opening your guide...</p>
        </div>
      </div>
    );
  }

  if (accessState === 'not-found') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <AlertCircle size={48} className="mx-auto text-on-surface-variant mb-4" />
          <h1 className="text-headline-lg font-headline text-on-surface mb-2">Guide not found</h1>
          <p className="text-body-md text-on-surface-variant mb-6">
            This guide could not be found or is no longer available.
          </p>
          <Link to="/ebooks" className="inline-flex items-center gap-2 rounded-lg bg-primary text-on-primary px-5 py-2.5 font-semibold hover:bg-primary-container transition-all">
            <ArrowLeft size={18} /> Back to Guides
          </Link>
        </div>
      </div>
    );
  }

  if (accessState === 'error') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <AlertCircle size={48} className="mx-auto text-error mb-4" />
          <h1 className="text-headline-lg font-headline text-on-surface mb-2">Something went wrong</h1>
          <p className="text-body-md text-on-surface-variant mb-6">{error}</p>
          <Link to="/ebooks" className="inline-flex items-center gap-2 rounded-lg bg-primary text-on-primary px-5 py-2.5 font-semibold hover:bg-primary-container transition-all">
            <ArrowLeft size={18} /> Back to Guides
          </Link>
        </div>
      </div>
    );
  }

  if (accessState === 'sign-in') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center mx-auto mb-6">
            <LogIn size={32} className="text-primary" />
          </div>
          <h1 className="text-headline-lg font-headline text-on-surface mb-2">Sign in to read</h1>
          <p className="text-body-md text-on-surface-variant mb-6">
            Please sign in to access your purchased guide. If you have not purchased this guide yet, you can buy it from the store.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={`/login?redirect=/read/${slug}`} className="inline-flex items-center gap-2 rounded-lg bg-primary text-on-primary px-5 py-2.5 font-semibold hover:bg-primary-container transition-all">
              <LogIn size={18} /> Sign In
            </Link>
            <Link to="/ebooks" className="inline-flex items-center gap-2 rounded-lg border-2 border-outline text-on-surface px-5 py-2.5 font-semibold hover:bg-surface-container transition-all">
              <ArrowLeft size={18} /> Back to Guides
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (accessState === 'no-access') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-tertiary-container flex items-center justify-center mx-auto mb-6">
            <Lock size={32} className="text-tertiary" />
          </div>
          <h1 className="text-headline-lg font-headline text-on-surface mb-2">Unlock this guide</h1>
          <p className="text-body-md text-on-surface-variant mb-2">
            You have not purchased this guide yet.
          </p>
          {ebook && (
            <p className="text-body-md text-on-surface-variant mb-6">
              <span className="font-semibold text-on-surface">{ebook.title}</span> —{' '}
              {ebook.short_description}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/ebooks" className="inline-flex items-center gap-2 rounded-lg bg-primary text-on-primary px-5 py-2.5 font-semibold hover:bg-primary-container transition-all">
              <BookOpen size={18} /> Buy This Guide
            </Link>
            <Link to="/ebooks" className="inline-flex items-center gap-2 rounded-lg border-2 border-outline text-on-surface px-5 py-2.5 font-semibold hover:bg-surface-container transition-all">
              <ArrowLeft size={18} /> Browse All Guides
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={ebook ? `${ebook.title} — CareLearn Reader` : 'CareLearn Reader'}
        description={ebook?.short_description || 'Read your CareLearn guide.'}
        canonical={`/read/${slug}`}
      />
      <div className="min-h-screen bg-surface">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary-container flex items-center justify-center mx-auto mb-6">
              <BookOpen size={32} className="text-secondary" />
            </div>
            <h1 className="text-headline-lg font-headline text-on-surface mb-3">
              {ebook?.title}
            </h1>
            <p className="text-body-md text-on-surface-variant mb-8 max-w-lg mx-auto">
              {ebook?.short_description}
            </p>

            {opened ? (
              <div className="bg-secondary-container/40 border border-secondary/20 rounded-2xl p-6 mb-6">
                <p className="text-body-md text-on-surface mb-4">
                  Your guide has opened in a new tab. Use the buttons below to download it as a PDF or open it again.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={downloadPdf}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary text-on-primary px-5 py-2.5 font-semibold hover:bg-primary-container transition-all"
                  >
                    <Download size={18} /> Download as PDF
                  </button>
                  <button
                    onClick={openEbook}
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-secondary text-secondary px-5 py-2.5 font-semibold hover:bg-secondary-container transition-all"
                  >
                    <ExternalLink size={18} /> Open Guide Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <button
                  onClick={downloadPdf}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-on-primary px-6 py-3 font-semibold hover:bg-primary-container transition-all"
                >
                  <Download size={20} /> Download as PDF
                </button>
                <button
                  onClick={openEbook}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-outline text-on-surface px-6 py-3 font-semibold hover:bg-surface-container transition-all"
                >
                  <BookOpen size={20} /> Open in New Tab
                </button>
              </div>
            )}

            <div className="pt-6 border-t border-outline-variant/20">
              <Link to="/ebooks" className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline">
                <ArrowLeft size={18} /> Back to All Guides
              </Link>
            </div>
          </div>
        </div>

        {relatedPaid.length > 0 && (
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[11px] font-semibold uppercase tracking-wider mb-3">
                Ready for the Next Step?
              </span>
              <h2 className="text-xl font-headline font-bold text-on-surface mb-2">
                Take it further with a complete guide
              </h2>
              <p className="text-sm text-on-surface-variant max-w-lg mx-auto">
                You have got the free checklist. Now get the full guide with everything you need and a printable toolkit.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPaid.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/ebooks/${rel.slug}`}
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-elevation-2 hover:-translate-y-1 transition-all flex flex-col"
                >
                  <div className="relative h-32 overflow-hidden">
                    {rel.cover_image_url && (
                      <img src={rel.cover_image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    <span className="absolute top-2 right-2 bg-tertiary text-on-tertiary px-2 py-1 rounded-full text-[10px] font-bold">
                      £{Number(rel.price_gbp).toFixed(2)}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm font-headline font-semibold text-on-surface leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {rel.title}
                    </h3>
                    {rel.what_youll_learn && rel.what_youll_learn.length > 0 && (
                      <p className="text-[11px] text-on-surface-variant line-clamp-2 mb-3 flex-1">
                        {rel.what_youll_learn[0]}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                      <ShoppingBag size={13} /> View guide <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

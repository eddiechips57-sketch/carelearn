import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import SEOHead from '../components/SEOHead';
import { BookOpen, ArrowLeft, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

interface Ebook {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  pdf_url: string | null;
  page_count: number | null;
  format: string;
  category: string;
}

export default function EbookReader() {
  const { slug } = useParams<{ slug: string }>();
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!slug) {
      setError('No ebook specified.');
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      const { data, error: queryError } = await supabase
        .from('ebooks')
        .select('id, title, slug, short_description, pdf_url, page_count, format, category')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();
      if (queryError) {
        console.error('Error fetching ebook:', queryError);
        setError('We could not load this guide. Please try again.');
        setLoading(false);
        return;
      }
      if (!data) {
        setError('This guide could not be found.');
        setLoading(false);
        return;
      }
      setEbook(data as Ebook);
      setLoading(false);
    })();
  }, [slug]);

  const openEbook = () => {
    if (!ebook?.pdf_url || ebook.pdf_url === '#') {
      setError('The ebook file is not available yet.');
      return;
    }
    window.open(ebook.pdf_url, '_blank', 'noopener,noreferrer');
    setOpened(true);
  };

  useEffect(() => {
    if (ebook && !opened) {
      const timer = setTimeout(openEbook, 600);
      return () => clearTimeout(timer);
    }
  }, [ebook, opened]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="mx-auto text-primary animate-spin mb-4" />
          <p className="text-body-lg text-on-surface-variant">Opening your guide...</p>
        </div>
      </div>
    );
  }

  if (error && !ebook) {
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
                  Your guide has opened in a new tab. Use the "Export / Print PDF" button at the top of the guide to save or print it.
                </p>
                <button
                  onClick={openEbook}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-secondary text-secondary px-5 py-2.5 font-semibold hover:bg-secondary-container transition-all"
                >
                  <ExternalLink size={18} /> Open Guide Again
                </button>
              </div>
            ) : (
              <button
                onClick={openEbook}
                className="inline-flex items-center gap-2 rounded-lg bg-primary text-on-primary px-6 py-3 font-semibold hover:bg-primary-container transition-all mb-6"
              >
                <BookOpen size={20} /> Open Guide in New Tab
              </button>
            )}

            <div className="pt-6 border-t border-outline-variant/20">
              <Link to="/ebooks" className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline">
                <ArrowLeft size={18} /> Back to All Guides
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

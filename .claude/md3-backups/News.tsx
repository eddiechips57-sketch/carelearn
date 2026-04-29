import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '../services/supabaseClient';

const categories = [
  { key: '', label: 'All' },
  { key: 'policy', label: 'Policy' },
  { key: 'regulation', label: 'Regulation' },
  { key: 'workforce', label: 'Workforce' },
  { key: 'technology', label: 'Technology' },
  { key: 'best-practice', label: 'Best Practice' },
];

const categoryBadge: Record<string, string> = {
  policy: 'bg-blue-50 text-blue-700',
  regulation: 'bg-amber-50 text-amber-700',
  workforce: 'bg-secondary-container text-on-secondary-container',
  technology: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  'best-practice': 'bg-surface-container text-on-surface-variant',
};

const categoryLabels: Record<string, string> = {
  policy: 'Policy',
  regulation: 'Regulation',
  workforce: 'Workforce',
  technology: 'Technology',
  'best-practice': 'Best Practice',
};

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  image_url: string | null;
  source_url: string | null;
  published_at: string;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    setLoading(true);
    let query = supabase.from('industry_news').select('*').order('published_at', { ascending: false });
    if (activeCategory) query = query.eq('category', activeCategory);
    query.then(({ data }) => { setNews(data || []); setLoading(false); });
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-slate-200">
        <div className="section-container py-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container text-primary">
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>newspaper</span>
            </div>
            <h1 className="text-headline-lg font-headline font-bold text-on-surface">Sector News</h1>
          </div>
          <p className="text-body-md text-on-surface-variant max-w-lg mb-6">
            The latest news, funding updates, and policy changes across UK health and social care.
          </p>
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-lg text-label-md whitespace-nowrap transition-all ${
                  activeCategory === cat.key ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="section-container py-8 pb-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '32px' }}>progress_activity</span>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-on-surface-variant mb-4 block" style={{ fontSize: '48px', opacity: 0.3 }}>newspaper</span>
            <h3 className="text-headline-md font-headline font-semibold text-on-surface mb-1">No news found</h3>
            <p className="text-body-md text-on-surface-variant">Check back soon for the latest updates</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <a
                key={item.id}
                href={item.source_url || '#'}
                target={item.source_url ? '_blank' : undefined}
                rel={item.source_url ? 'noopener noreferrer' : undefined}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="aspect-[16/9] bg-surface-container overflow-hidden">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '36px', opacity: 0.3 }}>newspaper</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-label-sm ${categoryBadge[item.category] || 'bg-surface-container text-on-surface-variant'}`}>
                      {categoryLabels[item.category] || item.category}
                    </span>
                    {item.source_url && (
                      <span className="material-symbols-outlined text-on-surface-variant ml-auto" style={{ fontSize: '12px', opacity: 0.4 }}>open_in_new</span>
                    )}
                  </div>
                  <h3 className="text-label-md font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                  <p className="text-label-sm text-on-surface-variant line-clamp-3 leading-relaxed mb-4">{item.summary}</p>
                  <div className="flex items-center justify-between text-label-sm text-on-surface-variant">
                    <span className="font-medium">{item.source}</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>calendar_today</span>
                      {format(new Date(item.published_at), 'd MMM yyyy')}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

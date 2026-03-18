import { useEffect, useState } from 'react';
import { Loader2, Newspaper, Calendar, ExternalLink } from 'lucide-react';
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

const categoryColors: Record<string, string> = {
  policy: 'bg-blue-50 text-blue-700 border-blue-200',
  regulation: 'bg-amber-50 text-amber-700 border-amber-200',
  workforce: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  technology: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'best-practice': 'bg-slate-100 text-slate-600 border-slate-200',
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

    let query = supabase
      .from('industry_news')
      .select('*')
      .order('published_at', { ascending: false });

    if (activeCategory) {
      query = query.eq('category', activeCategory);
    }

    query.then(({ data }) => {
      setNews(data || []);
      setLoading(false);
    });
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="bg-white border-b border-slate-100">
        <div className="section-container py-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Newspaper size={22} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">Sector News</h1>
            </div>
          </div>
          <p className="text-slate-500 max-w-lg mb-6">
            The latest news, funding updates, and policy changes across UK health and social care.
          </p>

          <div className="flex gap-2 overflow-x-auto pb-2 -mb-px">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.key
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat.label}
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
        ) : news.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper size={40} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-1">No news found</h3>
            <p className="text-sm text-slate-500">Check back soon for the latest updates</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <a
                key={item.id}
                href={item.source_url || '#'}
                target={item.source_url ? '_blank' : undefined}
                rel={item.source_url ? 'noopener noreferrer' : undefined}
                className="card-base p-0 overflow-hidden group"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-brand-50 to-slate-100 overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Newspaper size={36} className="text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`badge text-[10px] border ${
                        categoryColors[item.category] || 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {categoryLabels[item.category] || item.category}
                    </span>
                    {item.source_url && (
                      <ExternalLink size={12} className="text-slate-300 ml-auto" />
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-brand-700 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed mb-4">
                    {item.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-medium">{item.source}</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
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

import { useState, useEffect, useCallback } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';

interface Headline {
  id: string;
  title: string;
  url: string;
  source_name: string;
  published_at: string | null;
}

export default function NewsTicker() {
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const res = await fetch(`${supabaseUrl}/functions/v1/fetch-news`, {
          headers: {
            Authorization: `Bearer ${anonKey}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch news');
        const data = await res.json();
        if (data.headlines && data.headlines.length > 0) {
          setHeadlines(data.headlines);
        }
      } catch {
        // Silently fail — ticker just won't show
      } finally {
        setLoading(false);
      }
    };
    fetchHeadlines();
  }, []);

  const advance = useCallback(() => {
    if (headlines.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % headlines.length);
      setIsTransitioning(false);
    }, 400);
  }, [headlines.length]);

  useEffect(() => {
    if (headlines.length <= 1) return;
    const interval = setInterval(advance, 5000);
    return () => clearInterval(interval);
  }, [headlines.length, advance]);

  if (loading || headlines.length === 0) return null;

  const current = headlines[currentIndex];

  return (
    <div className="flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-sm rounded-xl px-4 py-2.5 max-w-md shadow-lg border border-slate-700/50">
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Newspaper size={14} className="text-amber-400" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
          Live
        </span>
      </div>
      <div className="h-4 w-px bg-slate-600 flex-shrink-0" />
      <div className="overflow-hidden flex-1 min-w-0">
        <a
          href={current.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1.5 group transition-all duration-400 ${
            isTransitioning
              ? 'opacity-0 -translate-y-2'
              : 'opacity-100 translate-y-0'
          }`}
        >
          <span className="text-xs text-slate-200 truncate group-hover:text-white transition-colors leading-tight">
            {current.title}
          </span>
          <ExternalLink
            size={10}
            className="text-slate-400 group-hover:text-amber-400 transition-colors flex-shrink-0"
          />
        </a>
      </div>
      <span className="text-[9px] text-slate-500 flex-shrink-0 tabular-nums">
        {current.source_name}
      </span>
    </div>
  );
}

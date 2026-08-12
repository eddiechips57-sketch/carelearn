import { useState, useEffect } from 'react';
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

  if (loading || headlines.length === 0) return null;

  // Duplicate the list so the marquee loops seamlessly
  const looped = [...headlines, ...headlines];

  return (
    <div className="flex items-center bg-slate-900/90 backdrop-blur-sm rounded-xl pl-3 pr-4 py-2.5 max-w-md shadow-lg border border-slate-700/50 overflow-hidden">
      <div className="flex items-center gap-1.5 flex-shrink-0 mr-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
        </span>
        <Newspaper size={14} className="text-amber-400" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
          Live
        </span>
      </div>
      <div className="h-4 w-px bg-slate-600 flex-shrink-0 mr-3" />
      <div className="overflow-hidden flex-1 min-w-0">
        <div
          className="flex items-center gap-8 whitespace-nowrap"
          style={{ animation: 'marqueeRTL 28s linear infinite' }}
        >
          {looped.map((h, i) => (
            <a
              key={`${h.id}-${i}`}
              href={h.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 group flex-shrink-0"
            >
              <span className="text-xs text-slate-200 group-hover:text-white transition-colors leading-tight">
                {h.title}
              </span>
              <span className="text-[9px] text-amber-400/70 font-medium">
                {h.source_name}
              </span>
              <ExternalLink
                size={10}
                className="text-slate-500 group-hover:text-amber-400 transition-colors flex-shrink-0"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

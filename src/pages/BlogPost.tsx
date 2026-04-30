import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Clock, BookOpen, MessageSquare, ChevronRight } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  body: string;
  excerpt: string;
  cover_image_url: string;
  category: string;
  author_name: string;
  read_time_minutes: number;
  created_at: string;
}

interface RelatedQuestion {
  id: string;
  title: string;
  category: string;
  status: string;
  helpful_count: number;
}

const CATEGORY_STYLES: Record<string, string> = {
  funding: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  career_advice: 'bg-sky-50 text-sky-700 border-sky-200',
  qualifications: 'bg-violet-50 text-violet-700 border-violet-200',
  cqc: 'bg-amber-50 text-amber-700 border-amber-200',
  workplace: 'bg-rose-50 text-rose-700 border-rose-200',
  other: 'bg-slate-50 text-slate-600 border-slate-200',
  general: 'bg-slate-50 text-slate-600 border-slate-200',
};

const CATEGORY_LABELS: Record<string, string> = {
  funding: 'Funding',
  career_advice: 'Career Advice',
  qualifications: 'Qualifications',
  cqc: 'CQC',
  workplace: 'Workplace',
  other: 'Other',
  general: 'General',
};

function renderBody(body: string) {
  const lines = body.split('\n');
  const elements: JSX.Element[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-xl font-bold text-slate-800 mt-8 mb-3">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-base font-semibold text-slate-700 mt-6 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(<p key={i} className="font-semibold text-slate-700 mt-4 mb-1">{line.slice(2, -2)}</p>);
    } else if (line.match(/^\d+\. /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-outside ml-6 space-y-1.5 my-4">
          {items.map((item, j) => <li key={j} className="text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />)}
        </ol>
      );
      continue;
    } else if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-outside ml-6 space-y-1.5 my-4">
          {items.map((item, j) => <li key={j} className="text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />)}
        </ul>
      );
      continue;
    } else if (line.trim() === '') {
      // skip blank lines
    } else {
      elements.push(
        <p key={i} className="text-slate-600 text-sm leading-relaxed my-3" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
      );
    }
    i++;
  }
  return elements;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<RelatedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('community_blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (!data) { setNotFound(true); setLoading(false); return; }
      setPost(data);

      const { data: questions } = await supabase
        .from('community_questions')
        .select('id,title,category,status,helpful_count')
        .eq('category', data.category)
        .order('helpful_count', { ascending: false })
        .limit(4);
      setRelated(questions || []);
      setLoading(false);
    };
    if (slug) load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <BookOpen size={40} className="text-slate-300" />
        <h1 className="text-xl font-bold text-slate-700">Article not found</h1>
        <Link to="/community?tab=blog" className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium">
          <ArrowLeft size={14} />
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero image */}
      {post.cover_image_url && (
        <div className="w-full h-64 sm:h-80 lg:h-96 overflow-hidden bg-slate-200">
          <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <article className="flex-1 min-w-0">
            {/* Back */}
            <Link
              to="/community?tab=blog"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 font-medium transition-colors mb-6"
            >
              <ArrowLeft size={14} />
              Back to Blog
            </Link>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_STYLES[post.category] || CATEGORY_STYLES.other}`}>
                  {CATEGORY_LABELS[post.category] || post.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={10} />
                  {post.read_time_minutes} min read
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-4">{post.title}</h1>

              <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-100">
                <div className="h-9 w-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold">
                  {post.author_name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{post.author_name}</p>
                  <p className="text-xs text-slate-400">{format(new Date(post.created_at), 'd MMMM yyyy')}</p>
                </div>
              </div>

              {/* Body */}
              <div className="prose-custom">
                {renderBody(post.body)}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0 space-y-6">
            {/* Related Q&A */}
            {related.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <MessageSquare size={14} className="text-teal-500" />
                  Related Questions
                </h3>
                <div className="space-y-3">
                  {related.map(q => (
                    <Link
                      key={q.id}
                      to="/community?tab=qa"
                      className="block group"
                    >
                      <p className="text-xs text-slate-600 group-hover:text-teal-700 font-medium leading-snug transition-colors line-clamp-2">{q.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {q.status === 'answered' && (
                          <span className="text-xs text-teal-600 font-medium">Answered</span>
                        )}
                        <span className="text-xs text-slate-400">{q.helpful_count} helpful</span>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/community?tab=qa"
                  className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium mt-4 transition-colors"
                >
                  View all questions <ChevronRight size={12} />
                </Link>
              </div>
            )}

            {/* Ask CTA */}
            <div className="bg-teal-600 rounded-2xl p-5 text-white">
              <MessageSquare size={20} className="mb-3 opacity-80" />
              <h3 className="text-sm font-bold mb-1">Have a question?</h3>
              <p className="text-xs opacity-80 mb-4 leading-relaxed">Our team answers questions from care professionals every week.</p>
              <Link
                to="/community?tab=qa"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-teal-700 text-xs font-semibold rounded-xl hover:bg-teal-50 transition-colors"
              >
                Ask a question <ChevronRight size={12} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

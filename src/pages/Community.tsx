import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { MessageSquare, BookOpen, ThumbsUp, ChevronDown, ChevronUp, Send, X, Clock, CheckCircle, Tag, Filter, TrendingUp, Calendar, ArrowRight, Shield } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Question {
  id: string;
  title: string;
  body: string;
  author_name: string;
  category: string;
  helpful_count: number;
  status: 'open' | 'answered';
  created_at: string;
  answer?: Answer | null;
}

interface Answer {
  id: string;
  question_id: string;
  body: string;
  admin_name: string;
  created_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  category: string;
  author_name: string;
  read_time_minutes: number;
  created_at: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const QA_CATEGORIES = [
  { key: '', label: 'All Topics' },
  { key: 'funding', label: 'Funding' },
  { key: 'career_advice', label: 'Career Advice' },
  { key: 'qualifications', label: 'Qualifications' },
  { key: 'cqc', label: 'CQC' },
  { key: 'workplace', label: 'Workplace' },
  { key: 'other', label: 'Other' },
];

const BLOG_CATEGORIES = [
  { key: '', label: 'All' },
  { key: 'cqc', label: 'CQC' },
  { key: 'funding', label: 'Funding' },
  { key: 'career_advice', label: 'Career Advice' },
  { key: 'qualifications', label: 'Qualifications' },
  { key: 'workplace', label: 'Workplace' },
];

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

const VOTED_KEY = 'cl_voted_questions';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getVotedSet(): Set<string> {
  try {
    const raw = localStorage.getItem(VOTED_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveVotedSet(set: Set<string>) {
  localStorage.setItem(VOTED_KEY, JSON.stringify([...set]));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_STYLES[category] || CATEGORY_STYLES.other}`}>
      {CATEGORY_LABELS[category] || category}
    </span>
  );
}

function QuestionCard({
  question,
  onHelpful,
  voted,
  isAdmin,
  onAnswerPosted,
}: {
  question: Question;
  onHelpful: (id: string) => void;
  voted: boolean;
  isAdmin: boolean;
  onAnswerPosted: (questionId: string, answer: Answer) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerText, setAnswerText] = useState(question.answer?.body || '');
  const [submitting, setSubmitting] = useState(false);
  const [animateVote, setAnimateVote] = useState(false);

  const handleHelpful = () => {
    if (voted) return;
    setAnimateVote(true);
    setTimeout(() => setAnimateVote(false), 600);
    onHelpful(question.id);
  };

  const handlePostAnswer = async () => {
    if (!answerText.trim()) return;
    setSubmitting(true);
    if (question.answer) {
      const { data, error } = await supabase
        .from('community_answers')
        .update({ body: answerText })
        .eq('id', question.answer.id)
        .select()
        .single();
      if (!error && data) onAnswerPosted(question.id, data);
    } else {
      const { data, error } = await supabase
        .from('community_answers')
        .insert({ question_id: question.id, body: answerText, admin_name: 'CareLearn Team' })
        .select()
        .single();
      if (!error && data) {
        await supabase.from('community_questions').update({ status: 'answered' }).eq('id', question.id);
        onAnswerPosted(question.id, data);
      }
    }
    setSubmitting(false);
    setShowAnswerForm(false);
  };

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${question.status === 'answered' ? 'border-slate-200' : 'border-slate-200 border-dashed'} hover:shadow-md`}>
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <CategoryBadge category={question.category} />
              {question.status === 'answered' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                  <CheckCircle size={10} />
                  Answered
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-500 border border-slate-200">
                  <Clock size={10} />
                  Awaiting answer
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-slate-800 leading-snug mb-1">{question.title}</h3>
            <p className="text-xs text-slate-500">
              Asked by <span className="font-medium text-slate-600">{question.author_name}</span> &middot; {formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}
            </p>
          </div>
          {/* Helpful button */}
          <button
            onClick={handleHelpful}
            disabled={voted}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 select-none min-w-[48px] ${
              voted
                ? 'bg-teal-50 text-teal-600 cursor-default'
                : 'bg-slate-50 text-slate-500 hover:bg-teal-50 hover:text-teal-600 active:scale-95'
            } ${animateVote ? 'scale-110' : ''}`}
          >
            <ThumbsUp size={14} className={voted ? 'fill-teal-500 text-teal-500' : ''} />
            <span className="text-xs font-semibold">{question.helpful_count}</span>
          </button>
        </div>

        {/* Question body preview */}
        {question.body && (
          <p className="text-sm text-slate-600 mt-3 line-clamp-2 leading-relaxed">{question.body}</p>
        )}

        {/* Answer preview */}
        {question.answer && !expanded && (
          <div className="mt-3 pl-3 border-l-2 border-teal-200">
            <p className="text-xs text-slate-500 mb-1 font-medium">CareLearn Team answered:</p>
            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{question.answer.body}</p>
          </div>
        )}

        {/* Expand/collapse button */}
        {(question.body || question.answer) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-teal-600 font-medium mt-3 hover:text-teal-700 transition-colors"
          >
            {expanded ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> {question.answer ? 'Read full answer' : 'Read more'}</>}
          </button>
        )}
      </div>

      {/* Expanded full view */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
          {question.body && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Question</p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{question.body}</p>
            </div>
          )}
          {question.answer && (
            <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={14} className="text-teal-600" />
                <span className="text-xs font-semibold text-teal-700">{question.answer.admin_name}</span>
                <span className="text-xs text-teal-500">&middot; {formatDistanceToNow(new Date(question.answer.created_at), { addSuffix: true })}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{question.answer.body}</p>
              {isAdmin && (
                <button
                  onClick={() => { setShowAnswerForm(true); setAnswerText(question.answer!.body); }}
                  className="mt-3 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
                >
                  Edit answer
                </button>
              )}
            </div>
          )}
          {isAdmin && !question.answer && !showAnswerForm && (
            <button
              onClick={() => setShowAnswerForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors"
            >
              <Shield size={14} />
              Answer this question
            </button>
          )}
          {isAdmin && showAnswerForm && (
            <div className="space-y-3">
              <textarea
                value={answerText}
                onChange={e => setAnswerText(e.target.value)}
                rows={5}
                placeholder="Write your answer..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handlePostAnswer}
                  disabled={submitting || !answerText.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-colors"
                >
                  <Send size={14} />
                  {submitting ? 'Posting...' : 'Post Answer'}
                </button>
                <button
                  onClick={() => setShowAnswerForm(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  <X size={14} />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AskQuestionPanel({ onClose, onSubmitted }: { onClose: () => void; onSubmitted: (q: Question) => void }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('other');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim()) { setError('Please fill in your name and question title.'); return; }
    setSubmitting(true);
    setError('');
    const { data, error: err } = await supabase
      .from('community_questions')
      .insert({ title: title.trim(), body: body.trim(), author_name: name.trim(), category, status: 'open' })
      .select()
      .single();
    if (err) { setError('Something went wrong. Please try again.'); setSubmitting(false); return; }
    onSubmitted(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div ref={panelRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Ask the Community</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Your name <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Sarah K."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            >
              {QA_CATEGORIES.filter(c => c.key).map(c => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Question title <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Summarise your question in one sentence"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Details <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={4}
              placeholder="Add any context that will help us give you a better answer..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
            />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-colors"
          >
            <Send size={16} />
            {submitting ? 'Submitting...' : 'Submit Question'}
          </button>
          <p className="text-xs text-slate-400 text-center">Our team aims to answer questions within 48 hours.</p>
        </form>
      </div>
    </div>
  );
}

// ─── Q&A Tab ──────────────────────────────────────────────────────────────────

function QATab({ isAdmin }: { isAdmin: boolean }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'helpful'>('recent');
  const [votedSet, setVotedSet] = useState<Set<string>>(getVotedSet);
  const [showAskPanel, setShowAskPanel] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let query = supabase.from('community_questions').select('*');
      if (activeCategory) query = query.eq('category', activeCategory);
      if (sortBy === 'helpful') query = query.order('helpful_count', { ascending: false });
      else query = query.order('created_at', { ascending: false });
      const { data: qData } = await query;
      if (!qData) { setLoading(false); return; }

      const ids = qData.map(q => q.id);
      const { data: aData } = await supabase.from('community_answers').select('*').in('question_id', ids);
      const answerMap: Record<string, Answer> = {};
      (aData || []).forEach(a => { answerMap[a.question_id] = a; });

      setQuestions(qData.map(q => ({ ...q, answer: answerMap[q.id] || null })));
      setLoading(false);
    };
    load();
  }, [activeCategory, sortBy]);

  const handleHelpful = async (id: string) => {
    const newSet = new Set(votedSet);
    newSet.add(id);
    setVotedSet(newSet);
    saveVotedSet(newSet);
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, helpful_count: q.helpful_count + 1 } : q));
    await supabase.rpc('increment_question_helpful', { question_id: id });
  };

  const handleAnswerPosted = (questionId: string, answer: Answer) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, answer, status: 'answered' } : q));
  };

  const handleQuestionSubmitted = (q: Question) => {
    setQuestions(prev => [{ ...q, answer: null }, ...prev]);
    setShowAskPanel(false);
  };

  const answeredCount = questions.filter(q => q.status === 'answered').length;

  return (
    <div>
      {showAskPanel && (
        <AskQuestionPanel
          onClose={() => setShowAskPanel(false)}
          onSubmitted={handleQuestionSubmitted}
        />
      )}

      {/* Stats bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5"><MessageSquare size={14} />{questions.length} questions</span>
          <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-teal-500" />{answeredCount} answered</span>
        </div>
        <button
          onClick={() => setShowAskPanel(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 active:scale-95 transition-all shadow-sm"
        >
          <MessageSquare size={16} />
          Ask a Question
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto flex-1">
          {QA_CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.key ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
          <button
            onClick={() => setSortBy('recent')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortBy === 'recent' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Calendar size={12} />
            Recent
          </button>
          <button
            onClick={() => setSortBy('helpful')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortBy === 'helpful' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <TrendingUp size={12} />
            Top
          </button>
        </div>
      </div>

      {/* Questions */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare size={40} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-600 mb-1">No questions yet</h3>
          <p className="text-sm text-slate-400 mb-4">Be the first to ask something!</p>
          <button onClick={() => setShowAskPanel(true)} className="px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors">
            Ask a Question
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map(q => (
            <QuestionCard
              key={q.id}
              question={q}
              onHelpful={handleHelpful}
              voted={votedSet.has(q.id)}
              isAdmin={isAdmin}
              onAnswerPosted={handleAnswerPosted}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Blog Tab ─────────────────────────────────────────────────────────────────

function BlogTab() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let query = supabase.from('community_blog_posts').select('id,title,slug,excerpt,cover_image_url,category,author_name,read_time_minutes,created_at').eq('is_published', true).order('created_at', { ascending: false });
      if (activeCategory) query = query.eq('category', activeCategory);
      const { data } = await query;
      setPosts(data || []);
      setLoading(false);
    };
    load();
  }, [activeCategory]);

  return (
    <div>
      {/* Category filter */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto mb-6">
        {BLOG_CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.key ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen size={40} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-600 mb-1">No articles yet</h3>
          <p className="text-sm text-slate-400">Check back soon for the latest articles.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link
              key={post.id}
              to={`/community/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                {post.cover_image_url ? (
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen size={32} className="text-slate-300" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CategoryBadge category={post.category} />
                  <span className="ml-auto flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={10} />
                    {post.read_time_minutes} min read
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-800 leading-snug mb-2 group-hover:text-teal-700 transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium text-slate-500">{post.author_name}</span>
                  <span>{format(new Date(post.created_at), 'd MMM yyyy')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Community() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as 'qa' | 'blog') || 'qa';
  const { isAdmin } = useAuth();

  const setTab = (tab: 'qa' | 'blog') => {
    setSearchParams({ tab });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                  <MessageSquare size={22} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">Community Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-3">
                Questions, answers and insights<br className="hidden sm:block" /> from the care community
              </h1>
              <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
                Ask anything about care careers, qualifications, funding or workplace rights. Browse expert articles from the CareLearn team. No account required.
              </p>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 text-xs font-medium shrink-0">
                <Shield size={14} />
                Admin mode active
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-8 border-b border-slate-200">
            <button
              onClick={() => setTab('qa')}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${
                activeTab === 'qa'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <MessageSquare size={16} />
              Ask &amp; Learn
            </button>
            <button
              onClick={() => setTab('blog')}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${
                activeTab === 'blog'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <BookOpen size={16} />
              Blog &amp; Articles
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        {activeTab === 'qa' ? <QATab isAdmin={isAdmin} /> : <BlogTab />}
      </div>
    </div>
  );
}

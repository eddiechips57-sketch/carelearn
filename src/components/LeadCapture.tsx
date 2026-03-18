import { useState } from 'react';
import { X, CheckCircle, Mail, Heart, Zap, TrendingUp } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface LeadCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  recordedCourses: string[];
}

const careerPaths = [
  { id: 'nursing', label: 'Nursing & Clinical Roles', icon: Heart },
  { id: 'management', label: 'Management & Leadership', icon: TrendingUp },
  { id: 'social_care', label: 'Social Care Support', icon: Heart },
  { id: 'skills_development', label: 'Skills Development', icon: Zap },
];

export default function LeadCapture({ isOpen, onClose, recordedCourses }: LeadCaptureProps) {
  const [email, setEmail] = useState('');
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const { error: insertError } = await supabase.from('leads').insert({
        email: email.toLowerCase(),
        interested_courses: recordedCourses,
        career_interests: selectedPaths,
      });

      if (insertError) {
        throw insertError;
      }

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setEmail('');
        setSelectedPaths([]);
        setSubmitted(false);
      }, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save your information');
    } finally {
      setLoading(false);
    }
  };

  const toggleCareerPath = (id: string) => {
    setSelectedPaths(
      selectedPaths.includes(id)
        ? selectedPaths.filter((p) => p !== id)
        : [...selectedPaths, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slide-up">
        <div className="relative p-6 border-b border-slate-200">
          <h2 className="text-xl font-display font-bold text-slate-900 pr-8">
            {submitted ? 'Thank You!' : 'Continue Your Learning Journey'}
          </h2>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="space-y-4 text-center">
              <CheckCircle size={48} className="mx-auto text-emerald-500 animate-bounce" />
              <div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We've received your information and will be in touch shortly with more course recommendations and career guidance.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="input-base pl-10 w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  What are you interested in? (Optional)
                </label>
                <div className="space-y-2">
                  {careerPaths.map((path) => {
                    const Icon = path.icon;
                    return (
                      <label
                        key={path.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedPaths.includes(path.id)
                            ? 'border-brand-400 bg-brand-50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPaths.includes(path.id)}
                          onChange={() => toggleCareerPath(path.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Icon size={14} className={selectedPaths.includes(path.id) ? 'text-brand-600' : 'text-slate-400'} />
                            <span className={`text-sm font-medium ${selectedPaths.includes(path.id) ? 'text-brand-700' : 'text-slate-700'}`}>
                              {path.label}
                            </span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {recordedCourses.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs font-medium text-slate-600 mb-1.5">Courses you're interested in:</p>
                  <div className="space-y-1">
                    {recordedCourses.map((course, idx) => (
                      <p key={idx} className="text-xs text-slate-600 line-clamp-1">
                        • {course}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center"
                >
                  {loading ? 'Saving...' : 'Continue Learning'}
                </button>
              </div>

              <p className="text-xs text-slate-500 text-center">
                We'll use this info to recommend more courses and career paths tailored to you.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

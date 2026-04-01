import { Mail, CheckCircle2, Loader2, BookMarked, Banknote, Map, BellRing } from 'lucide-react';

interface StepEmailProps {
  email: string;
  onEmailChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
  selectedPaths: string[];
  recordedCourses: string[];
}

const benefits = [
  { icon: BookMarked, label: 'Personalised course shortlist', sub: 'Matched to your selected career paths' },
  { icon: Banknote, label: 'Funding eligibility breakdown', sub: 'Grants, loans & workforce funding available to you' },
  { icon: Map, label: 'Step-by-step career pathway', sub: 'From where you are now to where you want to be' },
  { icon: BellRing, label: 'Role alerts near you', sub: 'New vacancies in your chosen tracks' },
];

export default function StepEmail({ email, onEmailChange, onSubmit, loading, error, selectedPaths, recordedCourses }: StepEmailProps) {
  return (
    <div className="px-6 py-6 animate-fade-in-up space-y-5">
      <div>
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">Step 3 of 3</p>
        <h2 className="text-2xl font-display font-bold text-slate-900 leading-tight">
          Unlock your personalised guide
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
          Get a free, tailored resource built around the{' '}
          {selectedPaths.length > 0 ? `${selectedPaths.length} career path${selectedPaths.length > 1 ? 's' : ''}` : 'courses'}{' '}
          you've been exploring.
        </p>
      </div>

      <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">What you'll receive</p>
        {benefits.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.label} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={13} className="text-brand-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">{b.label}</p>
                <p className="text-[11px] text-slate-500">{b.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {recordedCourses.length > 0 && (
        <div className="border border-slate-100 rounded-xl p-3 bg-white">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Courses from your session</p>
          <div className="space-y-1">
            {recordedCourses.slice(0, 3).map((course, i) => (
              <p key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                <span className="text-brand-400 mt-0.5">&#8226;</span>
                <span className="line-clamp-1">{course}</span>
              </p>
            ))}
            {recordedCourses.length > 3 && (
              <p className="text-xs text-slate-400">+{recordedCourses.length - 3} more</p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="relative">
          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="your.email@example.com"
            className="input-base pl-10"
            autoFocus
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 rounded-xl border border-red-100">
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? (
            <><Loader2 size={15} className="animate-spin" /> Saving...</>
          ) : (
            <><CheckCircle2 size={15} /> Get My Personalised Guide</>
          )}
        </button>
        <p className="text-center text-[11px] text-slate-400">No spam. Unsubscribe anytime.</p>
      </form>
    </div>
  );
}

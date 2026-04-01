import {
  Stethoscope, TrendingUp, Heart, BookOpen, Brain, ClipboardList,
  BookMarked, Banknote, GraduationCap, ArrowRight, LayoutGrid,
} from 'lucide-react';
import type { InferenceResult } from './inference';
import { careerTracks } from './inference';

const trackIcons: Record<string, React.ElementType> = {
  clinical: Stethoscope,
  management: TrendingUp,
  social_care: Heart,
  education: BookOpen,
  mental_health: Brain,
  admin: ClipboardList,
};

interface StepInsightProps {
  inference: InferenceResult;
  onConfirm: () => void;
  onChooseOwn: () => void;
}

export default function StepInsight({ inference, onConfirm, onChooseOwn }: StepInsightProps) {
  const { primaryTrack, confidence, fundingTypes, qualLevels, courseCount } = inference;
  const track = primaryTrack;
  const Icon = track ? trackIcons[track.id] : LayoutGrid;

  const heading = track && confidence !== 'low'
    ? `You're exploring ${track.label}`
    : 'Let\'s build your profile';

  const subtext = track && confidence !== 'low'
    ? `Based on the ${courseCount} course${courseCount !== 1 ? 's' : ''} you viewed, you seem focused on ${track.label.toLowerCase()} pathways.`
    : `You've viewed ${courseCount} course${courseCount !== 1 ? 's' : ''}. Tell us a bit more so we can personalise your recommendations.`;

  return (
    <div className="px-6 py-6 animate-fade-in-up space-y-5">
      <div>
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">Your Profile</p>
        <h2 className="text-2xl font-display font-bold text-slate-900 leading-tight">
          {heading}
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{subtext}</p>
      </div>

      {track && confidence !== 'low' && (
        <div className={`flex items-start gap-4 p-4 rounded-2xl border-2 ${track.border} ${track.bg}`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${track.bg} border ${track.border}`}>
            <Icon size={22} className={track.textAccent} />
          </div>
          <div>
            <h3 className={`font-semibold text-sm ${track.color}`}>{track.label}</h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{track.description}</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">What we detected</p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
            <BookMarked size={11} className="text-slate-500" />
            {courseCount} course{courseCount !== 1 ? 's' : ''} viewed
          </span>
          {fundingTypes.map((f) => (
            <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
              <Banknote size={11} className="text-emerald-500" />
              {f}
            </span>
          ))}
          {qualLevels.map((q) => (
            <span key={q} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-medium">
              <GraduationCap size={11} className="text-brand-500" />
              {q}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-2 space-y-2">
        <button
          onClick={onConfirm}
          className="btn-primary w-full justify-center"
        >
          {track && confidence !== 'low' ? 'Yes, this looks right' : 'Continue'}
          <ArrowRight size={15} />
        </button>
        <button
          onClick={onChooseOwn}
          className="w-full text-center text-xs font-medium text-slate-500 hover:text-slate-700 py-2 transition-colors"
        >
          Let me choose my own path
        </button>
      </div>
    </div>
  );
}

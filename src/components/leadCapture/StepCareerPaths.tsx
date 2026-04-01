import { Check, ArrowRight, Stethoscope, TrendingUp, Heart, BookOpen, Brain, ClipboardList } from 'lucide-react';
import { careerTracks, type CareerTrack } from './inference';

const trackIcons: Record<string, React.ElementType> = {
  clinical: Stethoscope,
  management: TrendingUp,
  social_care: Heart,
  education: BookOpen,
  mental_health: Brain,
  admin: ClipboardList,
};

interface StepCareerPathsProps {
  selectedPaths: string[];
  onToggle: (id: string) => void;
  onContinue: () => void;
  preSelected?: string | null;
}

export default function StepCareerPaths({ selectedPaths, onToggle, onContinue, preSelected }: StepCareerPathsProps) {
  return (
    <div className="px-6 py-6 animate-fade-in-up space-y-5">
      <div>
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">Step 2 of 3</p>
        <h2 className="text-2xl font-display font-bold text-slate-900 leading-tight">
          Which path fits you best?
        </h2>
        <p className="text-sm text-slate-500 mt-1.5">
          Select all that apply — we'll tailor your recommendations.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {careerTracks.map((track: CareerTrack) => {
          const Icon = trackIcons[track.id];
          const isSelected = selectedPaths.includes(track.id);
          const isPreSelected = preSelected === track.id;

          return (
            <button
              key={track.id}
              onClick={() => onToggle(track.id)}
              className={`relative flex flex-col items-start gap-2 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                isSelected
                  ? `${track.border} ${track.bg} shadow-sm`
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
              }`}
            >
              {isPreSelected && !isSelected && (
                <span className="absolute top-2 right-2 text-[9px] font-semibold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-full">
                  Suggested
                </span>
              )}
              {isSelected && (
                <span className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center ${track.bg}`}>
                  <Check size={11} className={track.textAccent} strokeWidth={3} />
                </span>
              )}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? track.bg : 'bg-slate-100'} transition-colors`}>
                <Icon size={16} className={isSelected ? track.textAccent : 'text-slate-400'} />
              </div>
              <div>
                <p className={`text-xs font-semibold leading-tight ${isSelected ? track.color : 'text-slate-700'}`}>
                  {track.label}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                  {track.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-2">
        <button
          onClick={onContinue}
          disabled={selectedPaths.length === 0}
          className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
        >
          Continue
          <ArrowRight size={15} />
        </button>
        {selectedPaths.length === 0 && (
          <p className="text-center text-xs text-slate-400 mt-2">Select at least one path to continue</p>
        )}
      </div>
    </div>
  );
}

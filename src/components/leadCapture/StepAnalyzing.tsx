import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface StepAnalyzingProps {
  courseCount: number;
  onComplete: () => void;
}

const dots = ['Scanning your course activity', 'Identifying patterns', 'Building your profile'];

export default function StepAnalyzing({ courseCount, onComplete }: StepAnalyzingProps) {
  const [dotIndex, setDotIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotIndex((prev) => {
        if (prev < dots.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(onComplete, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full bg-brand-50 border-2 border-brand-100 flex items-center justify-center">
          <Sparkles size={32} className="text-brand-500 animate-pulse" />
        </div>
        <span className="absolute -top-1 -right-1 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-50"></span>
          <span className="relative inline-flex rounded-full h-5 w-5 bg-brand-500 items-center justify-center">
            <span className="text-white text-[9px] font-bold">{courseCount}</span>
          </span>
        </span>
      </div>

      <h2 className="text-xl font-display font-bold text-slate-900 mb-2">
        Personalising your experience
      </h2>
      <p className="text-sm text-slate-500 mb-8 max-w-xs">
        We're looking at the {courseCount} course{courseCount !== 1 ? 's' : ''} you explored to build your profile
      </p>

      <div className="w-full max-w-xs space-y-3">
        {dots.map((label, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-500 ${
              i <= dotIndex
                ? 'border-brand-200 bg-brand-50 opacity-100'
                : 'border-slate-100 bg-white opacity-30'
            }`}
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i <= dotIndex ? 'bg-brand-500' : 'bg-slate-200'}`} />
            <span className={`text-xs font-medium ${i <= dotIndex ? 'text-brand-700' : 'text-slate-400'}`}>
              {label}
            </span>
            {i === dotIndex && (
              <div className="ml-auto flex gap-0.5">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="w-1 h-1 rounded-full bg-brand-400 animate-bounce"
                    style={{ animationDelay: `${d * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

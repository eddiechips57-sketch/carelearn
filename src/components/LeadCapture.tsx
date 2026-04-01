import { useState, useCallback, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import type { CourseClickData } from '../contexts/ClickTrackingContext';
import { inferCareerTrack } from './leadCapture/inference';
import StepAnalyzing from './leadCapture/StepAnalyzing';
import StepInsight from './leadCapture/StepInsight';
import StepCareerPaths from './leadCapture/StepCareerPaths';
import StepEmail from './leadCapture/StepEmail';
import StepSuccess from './leadCapture/StepSuccess';

type Step = 'analyzing' | 'insight' | 'paths' | 'email' | 'success';

interface LeadCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  recordedCourses: string[];
  recordedCourseData?: CourseClickData[];
}

const stepLabels: Partial<Record<Step, string>> = {
  insight: 'Your Profile',
  paths: 'Career Paths',
  email: 'Get Your Guide',
};

export default function LeadCapture({ isOpen, onClose, recordedCourses, recordedCourseData = [] }: LeadCaptureProps) {
  const [step, setStep] = useState<Step>('analyzing');
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const drawerRef = useRef<HTMLDivElement>(null);

  const inference = inferCareerTrack(recordedCourseData);

  useEffect(() => {
    if (isOpen) {
      setStep('analyzing');
      setSelectedPaths(
        inference.primaryTrack && inference.confidence !== 'low'
          ? [inference.primaryTrack.id]
          : []
      );
      setEmail('');
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleAnalyzingComplete = useCallback(() => {
    setStep('insight');
  }, []);

  const handleInsightConfirm = () => setStep('email');
  const handleChooseOwn = () => setStep('paths');
  const handlePathsContinue = () => setStep('email');

  const handleTogglePath = (id: string) => {
    setSelectedPaths((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

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
        email: email.toLowerCase().trim(),
        interested_courses: recordedCourses,
        career_interests: selectedPaths,
      });
      if (insertError) throw insertError;
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save your information');
    } finally {
      setLoading(false);
    }
  };

  const visibleSteps: Step[] = ['insight', 'paths', 'email'];
  const currentVisibleIndex = visibleSteps.indexOf(step);
  const progressPercent =
    currentVisibleIndex >= 0
      ? ((currentVisibleIndex + 1) / visibleSteps.length) * 100
      : step === 'analyzing'
      ? 0
      : 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
      />

      <div
        ref={drawerRef}
        className="relative ml-auto w-full max-w-lg bg-white h-full flex flex-col shadow-2xl animate-drawer-in overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-0 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-bold tracking-tight">CL</span>
            </div>
            {stepLabels[step] && (
              <span className="text-sm font-semibold text-slate-700">{stepLabels[step]}</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {step !== 'analyzing' && step !== 'success' && (
          <div className="px-6 mt-4 flex-shrink-0">
            <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
              <div
                className="h-1 bg-brand-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {step === 'analyzing' && (
            <StepAnalyzing
              courseCount={Math.max(recordedCourses.length, 1)}
              onComplete={handleAnalyzingComplete}
            />
          )}
          {step === 'insight' && (
            <StepInsight
              inference={inference}
              onConfirm={handleInsightConfirm}
              onChooseOwn={handleChooseOwn}
            />
          )}
          {step === 'paths' && (
            <StepCareerPaths
              selectedPaths={selectedPaths}
              onToggle={handleTogglePath}
              onContinue={handlePathsContinue}
              preSelected={inference.primaryTrack?.id ?? null}
            />
          )}
          {step === 'email' && (
            <StepEmail
              email={email}
              onEmailChange={setEmail}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              selectedPaths={selectedPaths}
              recordedCourses={recordedCourses}
            />
          )}
          {step === 'success' && (
            <StepSuccess
              primaryTrack={inference.primaryTrack}
              onClose={onClose}
            />
          )}
        </div>

        {step !== 'analyzing' && step !== 'success' && (
          <div className="flex-shrink-0 px-6 pb-5 pt-3 border-t border-slate-50">
            <button
              onClick={onClose}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors py-1"
            >
              Maybe later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

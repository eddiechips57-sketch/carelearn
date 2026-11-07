import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, X, BookOpen, Check } from 'lucide-react';

const STORAGE_KEY = 'cl_exit_intent_shown';

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const trigger = (e: MouseEvent) => {
      if (e.clientY <= 5 && !sessionStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
        sessionStorage.setItem(STORAGE_KEY, '1');
      }
    };

    const fallbackTimer = setTimeout(() => {
      if (!sessionStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
        sessionStorage.setItem(STORAGE_KEY, '1');
      }
    }, 30000);

    document.addEventListener('mouseout', trigger);
    return () => {
      document.removeEventListener('mouseout', trigger);
      clearTimeout(fallbackTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setVisible(false)}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all z-10"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="bg-gradient-to-br from-teal-600 to-sky-700 px-6 py-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4">
            <BookOpen size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Wait — before you go</h2>
          <p className="text-sm text-teal-50 leading-relaxed">
            Get our free Home Safety Checklist for Dementia. Walk through every room, tick off each risk, and keep your loved one safe tonight.
          </p>
        </div>

        <div className="px-6 py-6">
          <div className="space-y-2.5 mb-6">
            {[
              'Room-by-room safety checklist',
              'Wandering exit audit',
              'Emergency contact fill-in card',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
                <Check size={16} className="text-teal-600 shrink-0" /> {item}
              </div>
            ))}
          </div>

          <Link
            to="/ebooks/home-safety-checklist-dementia"
            onClick={() => setVisible(false)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 text-white text-base font-semibold py-3.5 hover:bg-teal-700 transition-all"
          >
            <Download size={20} /> Get the Free Guide
          </Link>

          <button
            onClick={() => setVisible(false)}
            className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors mt-3"
          >
            No thanks, I will keep browsing
          </button>
        </div>
      </div>
    </div>
  );
}

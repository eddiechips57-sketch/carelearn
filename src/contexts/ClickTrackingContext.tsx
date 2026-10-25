import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface EbookViewData {
  title: string;
  slug: string;
  category: string;
}

interface ClickTrackingContextType {
  clickCount: number;
  recordedEbooks: string[];
  recordedEbookData: EbookViewData[];
  recordEbookView: (title: string, meta?: { slug?: string; category?: string }) => void;
  resetClicks: () => void;
  shouldShowLeadCapture: boolean;
  dismissLeadCapture: () => void;
}

const ClickTrackingContext = createContext<ClickTrackingContextType | undefined>(undefined);

export function ClickTrackingProvider({ children }: { children: ReactNode }) {
  const [clickCount, setClickCount] = useState(0);
  const [recordedEbooks, setRecordedEbooks] = useState<string[]>([]);
  const [recordedEbookData, setRecordedEbookData] = useState<EbookViewData[]>([]);
  const [shouldShowLeadCapture, setShouldShowLeadCapture] = useState(false);
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);

  const recordEbookView = (title: string, meta?: { slug?: string; category?: string }) => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (!recordedEbooks.includes(title)) {
      setRecordedEbooks((prev) => [...prev, title]);
      setRecordedEbookData((prev) => [
        ...prev,
        {
          title,
          slug: meta?.slug ?? '',
          category: meta?.category ?? '',
        },
      ]);
    }

    const timeSinceDismiss = dismissedAt ? Date.now() - dismissedAt : Infinity;
    const cooledDown = timeSinceDismiss > 5 * 60 * 1000;

    if (newCount >= 3 && newCount % 3 === 0 && cooledDown) {
      setShouldShowLeadCapture(true);
    }
  };

  const dismissLeadCapture = () => {
    setShouldShowLeadCapture(false);
    setDismissedAt(Date.now());
  };

  const resetClicks = () => {
    setClickCount(0);
    setRecordedEbooks([]);
    setRecordedEbookData([]);
    setShouldShowLeadCapture(false);
    setDismissedAt(null);
  };

  return (
    <ClickTrackingContext.Provider
      value={{
        clickCount,
        recordedEbooks,
        recordedEbookData,
        recordEbookView,
        resetClicks,
        shouldShowLeadCapture,
        dismissLeadCapture,
      }}
    >
      {children}
    </ClickTrackingContext.Provider>
  );
}

export function useClickTracking() {
  const context = useContext(ClickTrackingContext);
  if (context === undefined) {
    throw new Error('useClickTracking must be used within ClickTrackingProvider');
  }
  return context;
}

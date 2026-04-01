import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CourseClickData {
  title: string;
  fundingTags: string[];
  qualLevel: string;
}

interface ClickTrackingContextType {
  clickCount: number;
  recordedCourses: string[];
  recordedCourseData: CourseClickData[];
  recordCourseClick: (courseTitle: string, meta?: { fundingTags?: string[]; qualLevel?: string }) => void;
  resetClicks: () => void;
  shouldShowLeadCapture: boolean;
  dismissLeadCapture: () => void;
}

const ClickTrackingContext = createContext<ClickTrackingContextType | undefined>(undefined);

export function ClickTrackingProvider({ children }: { children: ReactNode }) {
  const [clickCount, setClickCount] = useState(0);
  const [recordedCourses, setRecordedCourses] = useState<string[]>([]);
  const [recordedCourseData, setRecordedCourseData] = useState<CourseClickData[]>([]);
  const [shouldShowLeadCapture, setShouldShowLeadCapture] = useState(false);
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);

  const recordCourseClick = (courseTitle: string, meta?: { fundingTags?: string[]; qualLevel?: string }) => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (!recordedCourses.includes(courseTitle)) {
      setRecordedCourses((prev) => [...prev, courseTitle]);
      setRecordedCourseData((prev) => [
        ...prev,
        {
          title: courseTitle,
          fundingTags: meta?.fundingTags ?? [],
          qualLevel: meta?.qualLevel ?? '',
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
    setRecordedCourses([]);
    setRecordedCourseData([]);
    setShouldShowLeadCapture(false);
    setDismissedAt(null);
  };

  return (
    <ClickTrackingContext.Provider
      value={{
        clickCount,
        recordedCourses,
        recordedCourseData,
        recordCourseClick,
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

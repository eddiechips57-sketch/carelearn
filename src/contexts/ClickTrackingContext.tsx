import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ClickTrackingContextType {
  clickCount: number;
  recordedCourses: string[];
  recordCourseClick: (courseTitle: string) => void;
  resetClicks: () => void;
  shouldShowLeadCapture: boolean;
}

const ClickTrackingContext = createContext<ClickTrackingContextType | undefined>(undefined);

export function ClickTrackingProvider({ children }: { children: ReactNode }) {
  const [clickCount, setClickCount] = useState(0);
  const [recordedCourses, setRecordedCourses] = useState<string[]>([]);
  const [shouldShowLeadCapture, setShouldShowLeadCapture] = useState(false);

  const recordCourseClick = (courseTitle: string) => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (!recordedCourses.includes(courseTitle)) {
      setRecordedCourses([...recordedCourses, courseTitle]);
    }

    if (newCount >= 3 && newCount % 3 === 0) {
      setShouldShowLeadCapture(true);
    }
  };

  const resetClicks = () => {
    setClickCount(0);
    setRecordedCourses([]);
    setShouldShowLeadCapture(false);
  };

  return (
    <ClickTrackingContext.Provider
      value={{
        clickCount,
        recordedCourses,
        recordCourseClick,
        resetClicks,
        shouldShowLeadCapture,
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

import type { CourseClickData } from '../../contexts/ClickTrackingContext';

export interface CareerTrack {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  color: string;
  bg: string;
  border: string;
  ring: string;
  textAccent: string;
}

export const careerTracks: CareerTrack[] = [
  {
    id: 'clinical',
    label: 'Clinical & Nursing',
    description: 'Patient care, clinical practice, and healthcare delivery roles',
    keywords: ['nurs', 'clinical', 'healthcare assistant', 'hca', 'ward', 'midwife', 'paramedic', 'pharmacy', 'physiotherapy', 'occupational', 'care home', 'care plan'],
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    ring: 'ring-rose-400',
    textAccent: 'text-rose-600',
  },
  {
    id: 'management',
    label: 'Management & Leadership',
    description: 'Team leadership, service management, and governance',
    keywords: ['management', 'leadership', 'supervisor', 'manager', 'lead', 'director', 'governance', 'quality improvement', 'team leader'],
    color: 'text-slate-700',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    ring: 'ring-slate-400',
    textAccent: 'text-slate-600',
  },
  {
    id: 'social_care',
    label: 'Social Care Support',
    description: 'Support work, community care, and person-centred practice',
    keywords: ['social care', 'support worker', 'dementia', 'community care', 'safeguarding', 'care worker', 'domiciliary', 'residential', 'elderly', 'learning disab'],
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    ring: 'ring-emerald-400',
    textAccent: 'text-emerald-600',
  },
  {
    id: 'education',
    label: 'Education & Training',
    description: 'Teaching, mentoring, coaching, and workforce development',
    keywords: ['teaching', 'education', 'mentor', 'trainer', 'training', 'coaching', 'assessor', 'tutor', 'learning', 'induction'],
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    ring: 'ring-amber-400',
    textAccent: 'text-amber-600',
  },
  {
    id: 'mental_health',
    label: 'Mental Health & Wellbeing',
    description: 'Therapeutic support, counselling, and psychological practice',
    keywords: ['mental health', 'wellbeing', 'counsell', 'psychological', 'therapy', 'therapist', 'psychiatry', 'mindfulness', 'recovery', 'talking'],
    color: 'text-brand-700',
    bg: 'bg-brand-50',
    border: 'border-brand-200',
    ring: 'ring-brand-400',
    textAccent: 'text-brand-600',
  },
  {
    id: 'admin',
    label: 'Admin & Coordination',
    description: 'Administration, coordination, and operational support roles',
    keywords: ['admin', 'coordinator', 'clerical', 'receptionist', 'secretary', 'office', 'data entry', 'scheduling', 'operations'],
    color: 'text-accent-700',
    bg: 'bg-accent-50',
    border: 'border-accent-200',
    ring: 'ring-accent-400',
    textAccent: 'text-accent-600',
  },
];

export interface InferenceResult {
  primaryTrack: CareerTrack | null;
  confidence: 'high' | 'medium' | 'low';
  fundingTypes: string[];
  qualLevels: string[];
  courseCount: number;
}

const fundingLabels: Record<string, string> = {
  LDSS: 'Workforce Dev Fund',
  apprenticeship: 'Apprenticeship',
  LSF: 'Skills Fund',
  advanced_learner_loan: 'Advanced Learner Loan',
  free_courses: 'Free Courses',
  nhs_workforce_development: 'NHS Funding',
};

const qualLabels: Record<string, string> = {
  Entry: 'Entry Level', L1: 'Level 1', L2: 'Level 2', L3: 'Level 3',
  L4: 'Level 4', L5: 'Level 5', L6: 'Level 6', L7: 'Level 7',
  HE_UG: 'Undergraduate', HE_PG: 'Postgraduate',
};

export function inferCareerTrack(courseData: CourseClickData[]): InferenceResult {
  const scores: Record<string, number> = {};
  careerTracks.forEach((t) => { scores[t.id] = 0; });

  for (const course of courseData) {
    const lower = course.title.toLowerCase();
    for (const track of careerTracks) {
      for (const kw of track.keywords) {
        if (lower.includes(kw)) {
          scores[track.id] += 1;
        }
      }
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topScore = sorted[0][1];
  const topTrack = topScore > 0 ? careerTracks.find((t) => t.id === sorted[0][0]) ?? null : null;

  const allFunding = courseData.flatMap((c) => c.fundingTags);
  const uniqueFunding = [...new Set(allFunding)]
    .filter((f) => fundingLabels[f])
    .map((f) => fundingLabels[f]);

  const allLevels = courseData.map((c) => c.qualLevel).filter(Boolean);
  const uniqueLevels = [...new Set(allLevels)]
    .filter((l) => qualLabels[l])
    .map((l) => qualLabels[l]);

  return {
    primaryTrack: topTrack,
    confidence: topScore >= 2 ? 'high' : topScore === 1 ? 'medium' : 'low',
    fundingTypes: uniqueFunding.slice(0, 3),
    qualLevels: uniqueLevels.slice(0, 2),
    courseCount: courseData.length,
  };
}

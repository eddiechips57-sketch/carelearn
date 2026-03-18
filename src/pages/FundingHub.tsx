import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PoundSterling, ChevronDown, ExternalLink, Loader2, CheckCircle,
  XCircle, ArrowRight, HelpCircle, GraduationCap, Briefcase,
  ClipboardCheck, ChevronRight,
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface FundingScheme {
  id: string;
  scheme_name: string;
  short_description: string;
  full_description: string;
  max_amount_gbp: string;
  application_url: string;
  is_active: boolean;
}

interface WizardAnswers {
  employed: string;
  sector: string;
  hours: string;
  hasLevel3: string;
}

interface EligibilityResult {
  scheme: string;
  tag: string;
  reason: string;
}

function determineEligibility(answers: WizardAnswers): EligibilityResult[] {
  const results: EligibilityResult[] = [];

  if (answers.sector === 'adult-social-care' && answers.hasLevel3 === 'no') {
    results.push({
      scheme: 'Learning & Development Support Scheme (LDSS)',
      tag: 'ldss',
      reason: 'As an adult social care worker without a Level 3 qualification, you are likely eligible for up to \u00a31,500 per year towards training costs.',
    });
  }

  if (answers.hasLevel3 === 'no' || answers.hasLevel3 === 'not-sure') {
    results.push({
      scheme: 'Free Courses for Jobs',
      tag: 'free-courses',
      reason: 'Adults without an existing Level 3 qualification can access fully funded Level 3 courses in health, care, and related subjects.',
    });
  }

  if (answers.sector === 'nhs' && answers.hours === '30+') {
    results.push({
      scheme: 'NHS Apprenticeship Route',
      tag: 'apprenticeship',
      reason: 'Working 30+ hours per week in the NHS makes you a strong candidate for funded apprenticeship programmes including nursing associate and degree-level routes.',
    });
  }

  if (answers.sector === 'nhs') {
    results.push({
      scheme: 'NHS Learning Support Fund',
      tag: 'nhs-lsf',
      reason: 'NHS employees and those entering NHS-commissioned programmes may access non-repayable grants of up to \u00a35,000 per year.',
    });
  }

  if (answers.employed === 'yes' && (answers.hours === '16-29' || answers.hours === '30+')) {
    results.push({
      scheme: 'Advanced Learner Loan',
      tag: 'advanced-learner-loan',
      reason: 'You may qualify for an Advanced Learner Loan for Level 3-6 qualifications, repayable only when earning over the threshold.',
    });
  }

  if (answers.sector === 'adult-social-care' && answers.hours === '30+') {
    results.push({
      scheme: 'Workforce Development Fund',
      tag: 'wdf',
      reason: 'Employers in adult social care can claim funding through the Workforce Development Fund for staff completing approved qualifications.',
    });
  }

  if (answers.sector === 'private' && answers.hasLevel3 === 'no') {
    results.push({
      scheme: 'Free Courses for Jobs',
      tag: 'free-courses',
      reason: 'Private healthcare workers without Level 3 can still access fully funded courses through the national Free Courses for Jobs programme.',
    });
  }

  if (results.length === 0) {
    results.push({
      scheme: 'General Guidance',
      tag: 'general',
      reason: 'Based on your answers, we recommend speaking to a careers adviser for personalised funding options. You may still qualify for student loans or employer-sponsored training.',
    });
  }

  const unique = results.filter((r, i, arr) => arr.findIndex((x) => x.scheme === r.scheme) === i);
  return unique;
}

const wizardSteps = [
  {
    question: 'Are you currently employed in health or social care?',
    field: 'employed' as const,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    question: 'Which sector do you work in (or plan to work in)?',
    field: 'sector' as const,
    options: [
      { value: 'adult-social-care', label: 'Adult Social Care' },
      { value: 'nhs', label: 'NHS' },
      { value: 'private', label: 'Private Healthcare' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    question: 'How many hours per week do you work?',
    field: 'hours' as const,
    options: [
      { value: 'under-16', label: 'Under 16 hours' },
      { value: '16-29', label: '16\u201329 hours' },
      { value: '30+', label: '30+ hours' },
    ],
  },
  {
    question: 'Do you already hold a Level 3 or higher qualification?',
    field: 'hasLevel3' as const,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'not-sure', label: 'Not sure' },
    ],
  },
];

function EligibilityWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>({
    employed: '',
    sector: '',
    hours: '',
    hasLevel3: '',
  });
  const [results, setResults] = useState<EligibilityResult[] | null>(null);

  const handleSelect = (field: keyof WizardAnswers, value: string) => {
    const updated = { ...answers, [field]: value };
    setAnswers(updated);

    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setResults(determineEligibility(updated));
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers({ employed: '', sector: '', hours: '', hasLevel3: '' });
    setResults(null);
  };

  if (results) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-5">
          <CheckCircle size={20} className="text-emerald-500" />
          <h3 className="text-lg font-display font-bold text-slate-900">Your Results</h3>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          Based on your answers, you may be eligible for the following funding schemes:
        </p>
        <div className="space-y-4 mb-6">
          {results.map((result) => (
            <div key={result.scheme} className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">{result.scheme}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{result.reason}</p>
                  <Link
                    to={`/courses?funding=${result.tag}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 mt-2 transition-colors"
                  >
                    View eligible courses <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={reset} className="btn-secondary text-xs">
          Start Again
        </button>
      </div>
    );
  }

  const step = wizardSteps[currentStep];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        {wizardSteps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= currentStep ? 'bg-brand-500' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-slate-400 mb-2">Step {currentStep + 1} of {wizardSteps.length}</p>
      <h3 className="text-base font-semibold text-slate-900 mb-5">{step.question}</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {step.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(step.field, option.value)}
            className={`rounded-xl border px-5 py-4 text-left text-sm font-medium transition-all duration-200 ${
              answers[step.field] === option.value
                ? 'border-brand-300 bg-brand-50 text-brand-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {currentStep > 0 && (
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          className="mt-4 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          Back
        </button>
      )}
    </div>
  );
}

export default function FundingHub() {
  const [schemes, setSchemes] = useState<FundingScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('funding_schemes')
      .select('*')
      .eq('is_active', true)
      .order('scheme_name')
      .then(({ data }) => {
        setSchemes(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="bg-white border-b border-slate-100">
        <div className="section-container py-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <PoundSterling size={22} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">Funding Hub</h1>
            </div>
          </div>
          <p className="text-slate-500 max-w-lg">
            Discover grants, bursaries, and funded training programmes available to UK health
            and social care workers. Many professionals miss out on funding they are entitled to.
          </p>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-lg font-display font-bold text-slate-900 mb-1">Available Funding Schemes</h2>
              <p className="text-sm text-slate-500 mb-5">Click any scheme to learn more and apply.</p>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
                </div>
              ) : schemes.length === 0 ? (
                <div className="text-center py-20">
                  <PoundSterling size={40} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-1">No schemes available</h3>
                  <p className="text-sm text-slate-500">Check back soon for updated funding information</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {schemes.map((scheme) => {
                    const isExpanded = expandedId === scheme.id;
                    return (
                      <div key={scheme.id} className="card-base overflow-hidden">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : scheme.id)}
                          className="flex items-center justify-between w-full p-5 text-left"
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                              <PoundSterling size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-slate-900 mb-1">{scheme.scheme_name}</h3>
                              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{scheme.short_description}</p>
                            </div>
                          </div>
                          <ChevronDown
                            size={16}
                            className={`text-slate-400 flex-shrink-0 ml-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {isExpanded && (
                          <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                              {scheme.full_description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4">
                              {scheme.max_amount_gbp && (
                                <div className="flex items-center gap-1.5">
                                  <PoundSterling size={14} className="text-emerald-500" />
                                  <span className="text-sm font-semibold text-slate-900">
                                    {scheme.max_amount_gbp}
                                  </span>
                                </div>
                              )}
                              {scheme.application_url && (
                                <a
                                  href={scheme.application_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-primary !py-2 !px-4 !text-xs"
                                >
                                  Apply Now
                                  <ExternalLink size={12} />
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="card-base p-6">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardCheck size={18} className="text-brand-600" />
                <h3 className="text-sm font-semibold text-slate-900">Eligibility Checker</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-5">
                Answer a few quick questions to find out which funding schemes you may qualify for.
              </p>
              <EligibilityWizard />
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 p-6">
              <GraduationCap size={24} className="text-brand-600 mb-3" />
              <h3 className="text-sm font-semibold text-brand-900 mb-2">Browse Funded Courses</h3>
              <p className="text-xs text-brand-700 leading-relaxed mb-4">
                View courses that accept funding from these schemes and start your career journey today.
              </p>
              <Link to="/courses" className="btn-primary !bg-brand-700 !text-xs w-full">
                View Courses
              </Link>
            </div>

            <div className="card-base p-6">
              <HelpCircle size={20} className="text-slate-400 mb-3" />
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Not Sure Where to Start?</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Our career guides walk you through each pathway including the funding options available at every stage.
              </p>
              <Link to="/guides" className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
                View Career Guides
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

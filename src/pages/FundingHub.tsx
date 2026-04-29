import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    results.push({ scheme: 'Learning & Development Support Scheme (LDSS)', tag: 'ldss', reason: 'As an adult social care worker without a Level 3 qualification, you are likely eligible for up to £1,500 per year towards training costs.' });
  }
  if (answers.hasLevel3 === 'no' || answers.hasLevel3 === 'not-sure') {
    results.push({ scheme: 'Free Courses for Jobs', tag: 'free-courses', reason: 'Adults without an existing Level 3 qualification can access fully funded Level 3 courses in health, care, and related subjects.' });
  }
  if (answers.sector === 'nhs' && answers.hours === '30+') {
    results.push({ scheme: 'NHS Apprenticeship Route', tag: 'apprenticeship', reason: 'Working 30+ hours per week in the NHS makes you a strong candidate for funded apprenticeship programmes including nursing associate and degree-level routes.' });
  }
  if (answers.sector === 'nhs') {
    results.push({ scheme: 'NHS Learning Support Fund', tag: 'nhs-lsf', reason: 'NHS employees and those entering NHS-commissioned programmes may access non-repayable grants of up to £5,000 per year.' });
  }
  if (answers.employed === 'yes' && (answers.hours === '16-29' || answers.hours === '30+')) {
    results.push({ scheme: 'Advanced Learner Loan', tag: 'advanced-learner-loan', reason: 'You may qualify for an Advanced Learner Loan for Level 3-6 qualifications, repayable only when earning over the threshold.' });
  }
  if (answers.sector === 'adult-social-care' && answers.hours === '30+') {
    results.push({ scheme: 'Workforce Development Fund', tag: 'wdf', reason: 'Employers in adult social care can claim funding through the Workforce Development Fund for staff completing approved qualifications.' });
  }
  if (answers.sector === 'private' && answers.hasLevel3 === 'no') {
    results.push({ scheme: 'Free Courses for Jobs', tag: 'free-courses', reason: 'Private healthcare workers without Level 3 can still access fully funded courses through the national Free Courses for Jobs programme.' });
  }
  if (results.length === 0) {
    results.push({ scheme: 'General Guidance', tag: 'general', reason: 'Based on your answers, we recommend speaking to a careers adviser for personalised funding options. You may still qualify for student loans or employer-sponsored training.' });
  }

  return results.filter((r, i, arr) => arr.findIndex((x) => x.scheme === r.scheme) === i);
}

const wizardSteps = [
  { question: 'Are you currently employed in health or social care?', field: 'employed' as const, options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
  { question: 'Which sector do you work in (or plan to work in)?', field: 'sector' as const, options: [{ value: 'adult-social-care', label: 'Adult Social Care' }, { value: 'nhs', label: 'NHS' }, { value: 'private', label: 'Private Healthcare' }, { value: 'other', label: 'Other' }] },
  { question: 'How many hours per week do you work?', field: 'hours' as const, options: [{ value: 'under-16', label: 'Under 16 hours' }, { value: '16-29', label: '16–29 hours' }, { value: '30+', label: '30+ hours' }] },
  { question: 'Do you already hold a Level 3 or higher qualification?', field: 'hasLevel3' as const, options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'not-sure', label: 'Not sure' }] },
];

function EligibilityWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>({ employed: '', sector: '', hours: '', hasLevel3: '' });
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

  const reset = () => { setCurrentStep(0); setAnswers({ employed: '', sector: '', hours: '', hasLevel3: '' }); setResults(null); };

  if (results) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-5">
          <span className="material-symbols-outlined text-secondary" style={{ fontSize: '20px' }}>check_circle</span>
          <h3 className="text-headline-md font-headline font-semibold text-on-surface">Your Results</h3>
        </div>
        <p className="text-label-md text-on-surface-variant mb-5">Based on your answers, you may be eligible for:</p>
        <div className="space-y-3 mb-5">
          {results.map((result) => (
            <div key={result.scheme} className="rounded-xl border border-secondary-fixed bg-secondary-fixed/30 p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary flex-shrink-0 mt-0.5" style={{ fontSize: '16px' }}>check_circle</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-label-md font-semibold text-on-surface mb-1">{result.scheme}</h4>
                  <p className="text-label-sm text-on-surface-variant leading-relaxed">{result.reason}</p>
                  <Link to={`/courses?funding=${result.tag}`} className="inline-flex items-center gap-1 text-label-sm font-medium text-primary hover:opacity-80 mt-2 transition-opacity">
                    View eligible courses <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>chevron_right</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={reset} className="btn-secondary text-label-md">Start Again</button>
      </div>
    );
  }

  const step = wizardSteps[currentStep];

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        {wizardSteps.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= currentStep ? 'bg-primary' : 'bg-surface-container-high'}`} />
        ))}
      </div>
      <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Step {currentStep + 1} of {wizardSteps.length}</p>
      <h3 className="text-label-md font-semibold text-on-surface mb-5">{step.question}</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {step.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(step.field, option.value)}
            className={`rounded-xl border px-5 py-4 text-left text-label-md font-medium transition-all duration-200 ${answers[step.field] === option.value ? 'border-primary bg-primary-fixed text-on-primary-fixed-variant' : 'border-outline-variant bg-white text-on-surface hover:border-outline hover:bg-surface-container-low'}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {currentStep > 0 && (
        <button onClick={() => setCurrentStep(currentStep - 1)} className="mt-4 text-label-md font-medium text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_back</span>
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
    supabase.from('funding_schemes').select('*').eq('is_active', true).order('scheme_name')
      .then(({ data }) => { setSchemes(data || []); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-slate-200">
        <div className="section-container py-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container text-primary">
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>payments</span>
            </div>
            <h1 className="text-headline-lg font-headline font-bold text-on-surface">Funding Hub</h1>
          </div>
          <p className="text-body-md text-on-surface-variant max-w-lg">
            Discover grants, bursaries, and funded training programmes available to UK health
            and social care workers. Many professionals miss out on funding they are entitled to.
          </p>
        </div>
      </div>

      <div className="section-container py-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-headline-md font-headline font-semibold text-on-surface mb-1">Available Funding Schemes</h2>
              <p className="text-label-md text-on-surface-variant mb-5">Click any scheme to learn more and apply.</p>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '32px' }}>progress_activity</span>
                </div>
              ) : schemes.length === 0 ? (
                <div className="text-center py-20">
                  <span className="material-symbols-outlined text-on-surface-variant mb-4 block" style={{ fontSize: '48px', opacity: 0.3 }}>payments</span>
                  <h3 className="text-headline-md font-headline font-semibold text-on-surface mb-1">No schemes available</h3>
                  <p className="text-body-md text-on-surface-variant">Check back soon for updated funding information</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {schemes.map((scheme) => {
                    const isExpanded = expandedId === scheme.id;
                    return (
                      <div key={scheme.id} className="card-base overflow-hidden">
                        <button onClick={() => setExpandedId(isExpanded ? null : scheme.id)} className="flex items-center justify-between w-full p-5 text-left hover:bg-surface-container-low transition-colors">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-fixed text-secondary flex-shrink-0">
                              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>payments</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-label-md font-semibold text-on-surface mb-1">{scheme.scheme_name}</h3>
                              <p className="text-label-sm text-on-surface-variant leading-relaxed line-clamp-2">{scheme.short_description}</p>
                            </div>
                          </div>
                          <span className={`material-symbols-outlined text-on-surface-variant flex-shrink-0 ml-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} style={{ fontSize: '16px' }}>expand_more</span>
                        </button>
                        {isExpanded && (
                          <div className="px-5 pb-5 border-t border-surface-container-high pt-4">
                            <p className="text-body-md text-on-surface-variant leading-relaxed mb-4">{scheme.full_description}</p>
                            <div className="flex flex-wrap items-center gap-4">
                              {scheme.max_amount_gbp && (
                                <div className="flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: '14px' }}>payments</span>
                                  <span className="text-label-md font-semibold text-on-surface">{scheme.max_amount_gbp}</span>
                                </div>
                              )}
                              {scheme.application_url && (
                                <a href={scheme.application_url} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2 !px-4 text-label-sm">
                                  Apply Now
                                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>open_in_new</span>
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
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>checklist</span>
                <h3 className="text-label-md font-semibold text-on-surface">Eligibility Checker</h3>
              </div>
              <p className="text-label-sm text-on-surface-variant leading-relaxed mb-5">
                Answer a few quick questions to find out which funding schemes you may qualify for.
              </p>
              <EligibilityWizard />
            </div>

            <div className="rounded-2xl bg-primary p-6 text-white">
              <span className="material-symbols-outlined mb-3 block" style={{ fontSize: '24px' }}>school</span>
              <h3 className="text-label-md font-semibold mb-2">Browse Funded Courses</h3>
              <p className="text-label-sm leading-relaxed mb-4 opacity-80">
                View courses that accept funding from these schemes and start your career journey today.
              </p>
              <Link to="/courses" className="inline-flex items-center justify-center w-full gap-2 rounded-xl bg-white text-primary px-5 py-2.5 text-label-md font-semibold hover:opacity-90 transition-opacity">
                View Courses
              </Link>
            </div>

            <div className="card-base p-6">
              <span className="material-symbols-outlined text-on-surface-variant mb-3 block" style={{ fontSize: '20px' }}>help</span>
              <h3 className="text-label-md font-semibold text-on-surface mb-2">Not Sure Where to Start?</h3>
              <p className="text-label-sm text-on-surface-variant leading-relaxed mb-3">
                Our career guides walk you through each pathway including the funding options available at every stage.
              </p>
              <Link to="/guides" className="text-label-md font-medium text-primary hover:opacity-80 transition-opacity flex items-center gap-1">
                View Career Guides <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

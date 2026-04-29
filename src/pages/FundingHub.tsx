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

const cardStyles = [
  {
    badge: 'Most Popular',
    badgeBg: 'bg-primary text-white',
    titleClass: 'text-primary',
    iconName: 'info',
    iconClass: 'text-sky-400',
    amountBg: 'bg-slate-50',
    amountLabel: 'text-slate-500',
    amountValue: 'text-sky-800',
    buttonClass: 'bg-primary text-white hover:opacity-90',
    image: 'https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    badge: 'Government Funded',
    badgeBg: 'bg-secondary text-white',
    titleClass: 'text-secondary',
    iconName: 'verified',
    iconClass: 'text-secondary-container',
    amountBg: 'bg-teal-50',
    amountLabel: 'text-teal-700',
    amountValue: 'text-teal-900',
    buttonClass: 'border-2 border-secondary text-secondary hover:bg-teal-50',
    image: 'https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    badge: 'Social Care Focus',
    badgeBg: 'bg-tertiary text-white',
    titleClass: 'text-tertiary',
    iconName: 'group_work',
    iconClass: 'text-tertiary-fixed-dim',
    amountBg: 'bg-pink-50',
    amountLabel: 'text-pink-700',
    amountValue: 'text-pink-900',
    buttonClass: 'border-2 border-tertiary text-tertiary hover:bg-pink-50',
    image: 'https://images.pexels.com/photos/4421494/pexels-photo-4421494.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

function parseCriteria(full: string): string[] {
  if (!full) return [];
  const lines = full.split(/[\n.]+/).map((s) => s.trim()).filter(Boolean);
  return lines.slice(0, 3);
}

export default function FundingHub() {
  const [schemes, setSchemes] = useState<FundingScheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('funding_schemes').select('*').eq('is_active', true).order('scheme_name')
      .then(({ data }) => { setSchemes(data || []); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-20">
        {/* Hero */}
        <section className="mb-12">
          <div className="relative rounded-2xl overflow-hidden bg-primary px-8 py-16 md:py-24 flex items-center shadow-xl">
            <div className="absolute inset-0 opacity-20">
              <img
                alt=""
                className="w-full h-full object-cover"
                src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1600"
              />
            </div>
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block px-4 py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-sm mb-4 uppercase">Financial Support Center</span>
              <h1 className="text-headline-xl font-headline text-white mb-6">Invest in your career, supported by us.</h1>
              <p className="text-body-lg text-primary-fixed-dim max-w-lg mb-8">
                Discover grants, bursaries, and schemes designed to remove financial barriers from your healthcare training journey.
              </p>
              <a href="#schemes" className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-lg text-label-md hover:bg-slate-50 transition-all">
                Browse All Grants <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="bg-sky-100 p-3 rounded-lg text-sky-700">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div>
              <h4 className="text-headline-md font-headline text-xl mb-1">£5,000+</h4>
              <p className="text-body-md text-on-surface-variant text-sm">Annual bursaries available for eligible nursing students.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="bg-secondary-container/20 p-3 rounded-lg text-secondary">
              <span className="material-symbols-outlined">school</span>
            </div>
            <div>
              <h4 className="text-headline-md font-headline text-xl mb-1">Free Courses</h4>
              <p className="text-body-md text-on-surface-variant text-sm">Access fully funded Level 3 qualifications via the national skills fund.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="bg-tertiary-fixed p-3 rounded-lg text-tertiary">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <div>
              <h4 className="text-headline-md font-headline text-xl mb-1">100% Guidance</h4>
              <p className="text-body-md text-on-surface-variant text-sm">Expert advice to help you navigate your application process smoothly.</p>
            </div>
          </div>
        </section>

        {/* Schemes */}
        <section id="schemes">
          <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
            <div>
              <h2 className="text-headline-lg font-headline text-on-surface">Available Funding Schemes</h2>
              <p className="text-body-md text-on-surface-variant">Find the right financial path for your specific role and location.</p>
            </div>
          </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schemes.map((scheme, idx) => {
                const style = cardStyles[idx % cardStyles.length];
                const criteria = parseCriteria(scheme.full_description || scheme.short_description);
                return (
                  <div key={scheme.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all group">
                    <div className="h-48 relative">
                      <img alt="" className="w-full h-full object-cover" src={style.image} />
                      <div className={`absolute top-4 left-4 ${style.badgeBg} px-3 py-1 rounded-full text-[10px] text-label-sm uppercase tracking-wider`}>
                        {style.badge}
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-4 gap-3">
                        <h3 className={`text-headline-md font-headline ${style.titleClass}`}>{scheme.scheme_name}</h3>
                        <span className={`material-symbols-outlined ${style.iconClass}`}>{style.iconName}</span>
                      </div>
                      <p className="text-body-md text-on-surface-variant text-sm mb-6">{scheme.short_description}</p>

                      {criteria.length > 0 && (
                        <div className="space-y-3 mb-8">
                          <h5 className="text-label-sm text-on-surface uppercase tracking-widest">Eligibility Criteria</h5>
                          {criteria.map((c, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                              <span className="material-symbols-outlined text-green-500 text-lg flex-shrink-0">check_circle</span>
                              <span>{c}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto">
                        {scheme.max_amount_gbp && (
                          <div className={`flex justify-between items-center mb-4 p-3 ${style.amountBg} rounded-lg`}>
                            <span className={`text-xs text-label-md ${style.amountLabel}`}>Amount</span>
                            <span className={`text-headline-md font-headline text-lg ${style.amountValue}`}>{scheme.max_amount_gbp}</span>
                          </div>
                        )}
                        {scheme.application_url ? (
                          <a
                            href={scheme.application_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block w-full text-center py-3 rounded-lg text-label-md transition-all ${style.buttonClass}`}
                          >
                            Check Eligibility
                          </a>
                        ) : (
                          <button className={`w-full py-3 rounded-lg text-label-md transition-all ${style.buttonClass}`}>
                            Check Eligibility
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Application Support Bento */}
        <section className="mt-12">
          <h2 className="text-headline-lg font-headline mb-8">Application Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[400px]">
            <div className="md:col-span-2 md:row-span-2 bg-primary-container text-on-primary-container p-8 rounded-2xl flex flex-col justify-end relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 p-8">
                <span className="material-symbols-outlined text-6xl opacity-20 text-white">history_edu</span>
              </div>
              <h3 className="text-headline-md font-headline text-2xl mb-4 text-white">Application Masterclass</h3>
              <p className="text-body-md text-white/80 mb-6">
                Our step-by-step video series on how to write winning personal statements for funding applications.
              </p>
              <Link to="/guides" className="w-fit bg-white text-primary px-6 py-2 rounded-lg text-label-md">Watch Series</Link>
            </div>
            <Link to="/courses" className="md:col-span-2 bg-surface-container-high p-8 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-surface-variant transition-colors">
              <div>
                <h3 className="text-headline-md font-headline text-xl mb-2">Funding Calculator</h3>
                <p className="text-body-md text-on-surface-variant text-sm">Estimate how much support you might receive in 2 minutes.</p>
              </div>
              <span className="material-symbols-outlined text-primary text-3xl group-hover:translate-x-2 transition-transform">calculate</span>
            </Link>
            <Link to="/support" className="md:col-span-1 bg-tertiary-fixed p-6 rounded-2xl flex flex-col justify-between hover:brightness-105 transition-all">
              <span className="material-symbols-outlined text-tertiary text-2xl">chat_bubble</span>
              <div>
                <h3 className="text-headline-md font-headline text-sm mt-4">1-on-1 Advice</h3>
                <p className="text-body-md text-xs text-on-tertiary-fixed-variant">Talk to an advisor today.</p>
              </div>
            </Link>
            <div className="md:col-span-1 bg-secondary-fixed p-6 rounded-2xl flex flex-col justify-between">
              <span className="material-symbols-outlined text-on-secondary-fixed-variant text-2xl">calendar_today</span>
              <div>
                <h3 className="text-headline-md font-headline text-sm mt-4">Upcoming Deadlines</h3>
                <p className="text-body-md text-xs text-on-secondary-fixed-variant">Never miss an opportunity.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="mt-12">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <h2 className="text-headline-lg font-headline text-primary mb-4">Stay updated on new funding opportunities.</h2>
              <p className="text-body-md text-on-surface-variant mb-8">
                Join 12,000+ healthcare students who receive our weekly funding and scholarship digest.
              </p>
              <NewsletterForm />
            </div>
            <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-2xl rotate-2">
              <img
                alt=""
                className="w-full h-full object-cover"
                src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=1200"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    const { error } = await supabase.from('leads').insert({
      email: email.trim(),
      career_interests: ['funding_hub_newsletter'],
    });
    setStatus(error ? 'error' : 'success');
    if (!error) setEmail('');
  };

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === 'loading' || status === 'success'}
        placeholder="Enter your email"
        className="flex-grow px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        className="bg-primary text-white px-8 py-3 rounded-lg text-label-md hover:opacity-90 transition-all disabled:opacity-60"
      >
        {status === 'success' ? 'Subscribed' : status === 'loading' ? 'Submitting...' : 'Subscribe Now'}
      </button>
    </form>
  );
}

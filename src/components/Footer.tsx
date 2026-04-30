import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const footerLinks = {
  courses: [
    { label: 'Browse All Courses', path: '/courses' },
    { label: 'Care Qualifications', path: '/courses?level=L2' },
    { label: 'Nursing Degrees', path: '/courses?level=HE_UG' },
    { label: 'Apprenticeships', path: '/courses?mode=apprenticeship' },
    { label: 'Free Courses', path: '/courses?funding=free_courses' },
  ],
  guides: [
    { label: 'HCA to Nurse', path: '/guides/hca-to-registered-nurse' },
    { label: 'Care Worker to Manager', path: '/guides/care-worker-to-registered-manager' },
    { label: 'Become a Social Worker', path: '/guides/support-worker-to-social-worker' },
    { label: 'Nursing Associate', path: '/guides/becoming-a-nursing-associate' },
    { label: 'All Career Guides', path: '/guides' },
  ],
  resources: [
    { label: 'Funding Hub', path: '/funding' },
    { label: 'Role Library', path: '/roles' },
    { label: 'Community', path: '/community' },
    { label: 'Support', path: '/support' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-brand-950 to-slate-900 text-slate-300">
      <div className="section-container pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img
                src="/Whisk_34b89fcdd778439a7284ea375647e3f0dr.png"
                alt="CareLearn"
                className="h-10 w-auto brightness-0 invert"
              />
              <div className="flex flex-col">
                <span className="text-lg font-display font-bold text-white leading-tight">CareLearn</span>
                <span className="text-[10px] font-medium text-brand-400 tracking-wider uppercase leading-none">Learning Directory</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
              The UK's healthcare learning course directory. Advance your care career,
              find accredited courses and funding, and empower workers to deliver safer care and reduce incidents.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email for career updates"
                className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand-500 transition-colors"
              />
              <button
                type="submit"
                className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors flex items-center gap-1"
              >
                {subscribed ? 'Sent!' : <><span className="hidden sm:inline">Subscribe</span><ArrowRight size={16} /></>}
              </button>
            </form>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Find Courses</h4>
            <ul className="space-y-2.5">
              {footerLinks.courses.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Career Guides</h4>
            <ul className="space-y-2.5">
              {footerLinks.guides.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2">
              <a href="mailto:carelearnuk@gmail.com" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <Mail size={14} />
                carelearnuk@gmail.com
              </a>
              <a href="tel:07787447160" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <Phone size={14} />
                07787 447160
              </a>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin size={14} className="flex-shrink-0" />
                London, United Kingdom
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} CareLearn. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

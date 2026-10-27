import SEOHead from '../components/SEOHead';
import { Link } from 'react-router-dom';

const emergencyContacts = [
  { name: 'CQC Enquiries', description: 'Report a concern about a health or social care service', phone: '03000 616 161', hours: 'Mon-Fri 8:30am - 5:30pm', icon: 'shield', bg: 'bg-surface-container text-primary' },
  { name: 'Safeguarding Adults', description: 'Report suspected abuse or neglect of a vulnerable adult', phone: '0808 800 5000', hours: '24 hours, 7 days a week', icon: 'warning', bg: 'bg-error-container text-error' },
  { name: 'NHS 111', description: "Urgent medical advice when it's not a life-threatening situation", phone: '111', hours: '24 hours, 7 days a week', icon: 'favorite', bg: 'bg-blue-50 text-blue-600' },
  { name: 'Mental Health Crisis', description: 'Samaritans - confidential support for emotional distress', phone: '116 123', hours: '24 hours, 7 days a week', icon: 'psychology', bg: 'bg-secondary-container text-on-secondary-container' },
];

const supportCategories = [
  { title: 'For Families & Carers', items: ['Choosing the right guide for your situation', 'Downloading and opening your digital guide', 'Saving a guide as a PDF', 'Accessing free downloads and lead magnets', 'Using the Care Passport, Binder, and Sign Pack'] },
  { title: 'For Buyers & Readers', items: ['Purchasing a guide and completing checkout', 'Accessing guides you have already bought', 'Resetting your account password', 'Downloading guide updates and re-downloads', 'Refund and exchange queries'] },
  { title: 'For Community Members', items: ['Asking and answering questions in the community hub', 'Reading and sharing blog articles', 'Suggesting a topic for a new guide', 'Reporting a problem with a guide file', 'Getting help by email'] },
];

const faqs = [
  { q: 'How do I access a guide I have bought?', a: 'Sign in to your account, then go to the guide page or your profile. Any guide you have purchased shows an Open button that opens the full guide in a new tab, where you can also download it as a PDF.' },
  { q: 'Can I download a guide as a PDF?', a: 'Yes. Every guide opens as a printable page with a Download as PDF button. This uses your browser save-as-PDF option so you can keep a copy on your device.' },
  { q: 'Are the free downloads really free?', a: 'Yes. Our free guides and lead magnets are completely free with no sign-up required. Just hit Download Free on the guide card.' },
  { q: 'What is included with each guide?', a: 'Each guide is a plain-English ebook paired with a practical toolkit — checklists, trackers, templates, and visual aids you can use the same day.' },
  { q: 'Can I suggest a topic for a new guide?', a: 'Absolutely. Email us at admin@carelearn.site with your idea, or ask in the community hub. We build new guides around the real situations families and carers tell us about.' },
];

export default function Support() {
  return (
    <>
      <SEOHead
        title="Support — CareLearn Help Centre for Digital Guides & Toolkits"
        description="Get help with CareLearn digital guides and toolkits. Find answers about downloading PDFs, accessing purchased guides, free downloads, and reaching our team."
        canonical="/support"
      />
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-slate-200">
        <div className="section-container py-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container text-primary">
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>support</span>
            </div>
            <h1 className="text-headline-lg font-headline font-bold text-on-surface">Support</h1>
          </div>
          <p className="text-body-md text-on-surface-variant max-w-lg">
            Get help with your digital guides, find emergency contacts, or reach out to our team.
          </p>
        </div>
      </div>

      <div className="section-container py-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-headline-md font-headline font-semibold text-on-surface mb-1">Emergency & Key Contacts</h2>
              <p className="text-label-md text-on-surface-variant mb-5">Important numbers for urgent healthcare concerns</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {emergencyContacts.map((contact) => (
                  <div key={contact.name} className="bg-white rounded-xl border border-slate-200 p-5 shadow-card">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 ${contact.bg}`}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{contact.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-label-md font-semibold text-on-surface">{contact.name}</h3>
                        <p className="text-label-sm text-on-surface-variant mt-0.5 leading-relaxed">{contact.description}</p>
                      </div>
                    </div>
                    <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-headline-md font-headline font-bold text-primary hover:opacity-80 transition-opacity mb-1">
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>call</span>
                      {contact.phone}
                    </a>
                    <p className="text-label-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>schedule</span>
                      {contact.hours}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-headline-md font-headline font-semibold text-on-surface mb-1">How Can We Help?</h2>
              <p className="text-label-md text-on-surface-variant mb-5">We support different audiences with tailored assistance</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {supportCategories.map((cat) => (
                  <div key={cat.title} className="bg-white rounded-xl border border-slate-200 p-5 shadow-card">
                    <h3 className="text-label-md font-semibold text-on-surface mb-3">{cat.title}</h3>
                    <ul className="space-y-2">
                      {cat.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-label-sm text-on-surface-variant leading-relaxed">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-headline-md font-headline font-semibold text-on-surface mb-1">Frequently Asked Questions</h2>
              <p className="text-label-md text-on-surface-variant mb-5">Quick answers to common queries</p>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div key={faq.q} className="bg-white rounded-xl border border-slate-200 p-5 shadow-card">
                    <h3 className="text-label-md font-semibold text-on-surface mb-2 flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary mt-0.5 flex-shrink-0" style={{ fontSize: '16px' }}>help</span>
                      {faq.q}
                    </h3>
                    <p className="text-body-md text-on-surface-variant leading-relaxed pl-6">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-6 text-white">
              <h3 className="text-label-md font-semibold mb-2">Looking for a guide?</h3>
              <p className="text-label-sm text-teal-100 leading-relaxed mb-4">
                Browse our full range of plain-English digital guides and toolkits for families and carers.
              </p>
              <Link to="/ebooks" className="inline-flex items-center justify-center gap-2 w-full bg-white text-teal-700 text-label-md font-semibold rounded-xl px-4 py-2.5 hover:bg-teal-50 transition-colors">
                Browse All Guides
              </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card">
              <h3 className="text-label-md font-semibold text-on-surface mb-4">Contact Us</h3>
              <div className="space-y-4">
                <a href="mailto:admin@carelearn.site" className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary flex-shrink-0">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>mail</span>
                  </div>
                  <div>
                    <p className="text-label-md font-medium text-on-surface">Email</p>
                    <p className="text-label-sm text-on-surface-variant">admin@carelearn.site</p>
                  </div>
                </a>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary flex-shrink-0">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                  </div>
                  <div>
                    <p className="text-label-md font-medium text-on-surface">Office</p>
                    <p className="text-label-sm text-on-surface-variant">London, United Kingdom</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary flex-shrink-0">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span>
                  </div>
                  <div>
                    <p className="text-label-md font-medium text-on-surface">Hours</p>
                    <p className="text-label-sm text-on-surface-variant">Mon-Fri, 9am - 5:30pm GMT</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-surface-container-low border border-outline-variant p-6">
              <span className="material-symbols-outlined text-primary mb-3 block" style={{ fontSize: '24px' }}>chat</span>
              <h3 className="text-label-md font-semibold text-on-surface mb-2">Send Us a Message</h3>
              <p className="text-label-sm text-on-surface-variant leading-relaxed mb-4">
                Have a specific question? Drop us an email and our team will get back to you within 24 hours.
              </p>
              <a href="mailto:admin@carelearn.site" className="btn-primary w-full text-center">Email Us</a>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card">
              <h3 className="text-label-md font-semibold text-on-surface mb-3">Useful Links</h3>
              <div className="space-y-2">
                {[
                  { label: 'Browse All Guides', url: '/ebooks', internal: true },
                  { label: 'Free Downloads', url: '/ebooks?price=free', internal: true },
                  { label: 'Community Hub', url: '/community', internal: true },
                  { label: 'NHS Choices', url: 'https://www.nhs.uk', internal: false },
                  { label: 'Age UK', url: 'https://www.ageuk.org.uk', internal: false },
                ].map((link) => (
                  link.internal ? (
                    <Link key={link.label} to={link.url} className="flex items-center justify-between text-label-md text-on-surface-variant hover:text-primary transition-colors py-0.5">
                      {link.label}
                      <span className="material-symbols-outlined" style={{ fontSize: '12px', opacity: 0.4 }}>arrow_forward</span>
                    </Link>
                  ) : (
                    <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-label-md text-on-surface-variant hover:text-primary transition-colors py-0.5">
                      {link.label}
                      <span className="material-symbols-outlined" style={{ fontSize: '12px', opacity: 0.4 }}>open_in_new</span>
                    </a>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

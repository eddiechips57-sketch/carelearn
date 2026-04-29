const emergencyContacts = [
  { name: 'CQC Enquiries', description: 'Report a concern about a health or social care service', phone: '03000 616 161', hours: 'Mon-Fri 8:30am - 5:30pm', icon: 'shield', bg: 'bg-surface-container text-primary' },
  { name: 'Safeguarding Adults', description: 'Report suspected abuse or neglect of a vulnerable adult', phone: '0808 800 5000', hours: '24 hours, 7 days a week', icon: 'warning', bg: 'bg-error-container text-error' },
  { name: 'NHS 111', description: "Urgent medical advice when it's not a life-threatening situation", phone: '111', hours: '24 hours, 7 days a week', icon: 'favorite', bg: 'bg-blue-50 text-blue-600' },
  { name: 'Mental Health Crisis', description: 'Samaritans - confidential support for emotional distress', phone: '116 123', hours: '24 hours, 7 days a week', icon: 'psychology', bg: 'bg-secondary-container text-on-secondary-container' },
];

const supportCategories = [
  { title: 'For Care Providers', items: ['CQC registration and compliance queries', 'Listing your organisation on CareLearn', "Updating your organisation's information", 'CQC inspection preparation support', 'Policy and regulation guidance'] },
  { title: 'For Individuals & Families', items: ['Finding suitable care providers', 'Understanding CQC ratings and reports', 'Navigating care options for loved ones', 'Reporting concerns about a care service', 'Accessing funding and benefits information'] },
  { title: 'For Professionals', items: ['Career resources and job listings', 'Industry news and regulatory updates', 'Professional development guidance', 'Networking and community access', 'Research and data enquiries'] },
];

const faqs = [
  { q: 'How do I list my organisation on CareLearn?', a: 'Create a free account and submit your organisation details through our provider listing form. Our team will verify your information before publishing.' },
  { q: 'What does a CQC rating mean?', a: 'CQC rates services as Outstanding, Good, Requires Improvement, or Inadequate based on assessments across safety, effectiveness, caring, responsiveness, and leadership.' },
  { q: 'How often are directory listings updated?', a: 'Listings are continuously updated. Verified organisations can update their own profiles at any time. CQC ratings are synced regularly.' },
  { q: 'Is the CQC Hub guidance official?', a: 'Our CQC Hub provides practical tips and best practices based on official CQC frameworks. For official guidance, always refer to cqc.org.uk directly.' },
];

export default function Support() {
  return (
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
            Get help with CareLearn services, find emergency contacts, or reach out to our team.
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
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card">
              <h3 className="text-label-md font-semibold text-on-surface mb-4">Contact Us</h3>
              <div className="space-y-4">
                <a href="mailto:carelearnuk@gmail.com" className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary flex-shrink-0">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>mail</span>
                  </div>
                  <div>
                    <p className="text-label-md font-medium text-on-surface">Email</p>
                    <p className="text-label-sm text-on-surface-variant">carelearnuk@gmail.com</p>
                  </div>
                </a>
                <a href="tel:07787447160" className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary flex-shrink-0">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>call</span>
                  </div>
                  <div>
                    <p className="text-label-md font-medium text-on-surface">Phone</p>
                    <p className="text-label-sm text-on-surface-variant">07787 447160</p>
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
              <a href="mailto:carelearnuk@gmail.com" className="btn-primary w-full text-center">Email Us</a>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card">
              <h3 className="text-label-md font-semibold text-on-surface mb-3">Useful Links</h3>
              <div className="space-y-2">
                {[
                  { label: 'CQC Website', url: 'https://www.cqc.org.uk' },
                  { label: 'NHS Choices', url: 'https://www.nhs.uk' },
                  { label: 'Gov.uk Social Care', url: 'https://www.gov.uk/browse/disabilities/carers' },
                  { label: 'Age UK', url: 'https://www.ageuk.org.uk' },
                ].map((link) => (
                  <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-label-md text-on-surface-variant hover:text-primary transition-colors py-0.5">
                    {link.label}
                    <span className="material-symbols-outlined" style={{ fontSize: '12px', opacity: 0.4 }}>open_in_new</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

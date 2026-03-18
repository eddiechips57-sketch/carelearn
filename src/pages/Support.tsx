import {
  LifeBuoy, Phone, Mail, MessageSquare, Shield, Heart,
  Brain, AlertTriangle, ExternalLink, Clock, MapPin, HelpCircle,
} from 'lucide-react';

const emergencyContacts = [
  {
    name: 'CQC Enquiries',
    description: 'Report a concern about a health or social care service',
    phone: '03000 616 161',
    hours: 'Mon-Fri 8:30am - 5:30pm',
    icon: Shield,
    color: 'bg-brand-50 text-brand-600',
  },
  {
    name: 'Safeguarding Adults',
    description: 'Report suspected abuse or neglect of a vulnerable adult',
    phone: '0808 800 5000',
    hours: '24 hours, 7 days a week',
    icon: AlertTriangle,
    color: 'bg-red-50 text-red-600',
  },
  {
    name: 'NHS 111',
    description: 'Urgent medical advice when it\'s not a life-threatening situation',
    phone: '111',
    hours: '24 hours, 7 days a week',
    icon: Heart,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    name: 'Mental Health Crisis',
    description: 'Samaritans - confidential support for emotional distress',
    phone: '116 123',
    hours: '24 hours, 7 days a week',
    icon: Brain,
    color: 'bg-emerald-50 text-emerald-600',
  },
];

const supportCategories = [
  {
    title: 'For Care Providers',
    items: [
      'CQC registration and compliance queries',
      'Listing your organisation on CareLearn',
      'Updating your organisation\'s information',
      'CQC inspection preparation support',
      'Policy and regulation guidance',
    ],
  },
  {
    title: 'For Individuals & Families',
    items: [
      'Finding suitable care providers',
      'Understanding CQC ratings and reports',
      'Navigating care options for loved ones',
      'Reporting concerns about a care service',
      'Accessing funding and benefits information',
    ],
  },
  {
    title: 'For Professionals',
    items: [
      'Career resources and job listings',
      'Industry news and regulatory updates',
      'Professional development guidance',
      'Networking and community access',
      'Research and data enquiries',
    ],
  },
];

const faqs = [
  {
    q: 'How do I list my organisation on CareLearn?',
    a: 'Create a free account and submit your organisation details through our provider listing form. Our team will verify your information before publishing.',
  },
  {
    q: 'What does a CQC rating mean?',
    a: 'CQC rates services as Outstanding, Good, Requires Improvement, or Inadequate based on assessments across safety, effectiveness, caring, responsiveness, and leadership.',
  },
  {
    q: 'How often are directory listings updated?',
    a: 'Listings are continuously updated. Verified organisations can update their own profiles at any time. CQC ratings are synced regularly.',
  },
  {
    q: 'Is the CQC Hub guidance official?',
    a: 'Our CQC Hub provides practical tips and best practices based on official CQC frameworks. For official guidance, always refer to cqc.org.uk directly.',
  },
];

export default function Support() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="bg-white border-b border-slate-100">
        <div className="section-container py-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <LifeBuoy size={22} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">Support</h1>
          </div>
          <p className="text-slate-500 max-w-lg">
            Get help with CareLearn services, find emergency contacts, or reach out to our team.
          </p>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-lg font-display font-bold text-slate-900 mb-1">Emergency & Key Contacts</h2>
              <p className="text-sm text-slate-500 mb-5">Important numbers for urgent healthcare concerns</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {emergencyContacts.map((contact) => (
                  <div key={contact.name} className="card-base p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${contact.color} flex-shrink-0`}>
                        <contact.icon size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{contact.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{contact.description}</p>
                      </div>
                    </div>
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-2 text-lg font-display font-bold text-brand-700 hover:text-brand-800 transition-colors mb-1"
                    >
                      <Phone size={16} />
                      {contact.phone}
                    </a>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      {contact.hours}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-display font-bold text-slate-900 mb-1">How Can We Help?</h2>
              <p className="text-sm text-slate-500 mb-5">We support different audiences with tailored assistance</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {supportCategories.map((cat) => (
                  <div key={cat.title} className="card-base p-5">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">{cat.title}</h3>
                    <ul className="space-y-2">
                      {cat.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-400 mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-display font-bold text-slate-900 mb-1">Frequently Asked Questions</h2>
              <p className="text-sm text-slate-500 mb-5">Quick answers to common queries</p>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div key={faq.q} className="card-base p-5">
                    <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-start gap-2">
                      <HelpCircle size={16} className="text-brand-500 mt-0.5 flex-shrink-0" />
                      {faq.q}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed pl-6">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="card-base p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Contact Us</h3>
              <div className="space-y-4">
                <a
                  href="mailto:carelearnuk@gmail.com"
                  className="flex items-center gap-3 text-sm text-slate-600 hover:text-brand-600 transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 flex-shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Email</p>
                    <p className="text-xs text-slate-500">carelearnuk@gmail.com</p>
                  </div>
                </a>
                <a
                  href="tel:07787447160"
                  className="flex items-center gap-3 text-sm text-slate-600 hover:text-brand-600 transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 flex-shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Phone</p>
                    <p className="text-xs text-slate-500">07787 447160</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 flex-shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Office</p>
                    <p className="text-xs text-slate-500">London, United Kingdom</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 flex-shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Hours</p>
                    <p className="text-xs text-slate-500">Mon-Fri, 9am - 5:30pm GMT</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 p-6">
              <MessageSquare size={24} className="text-brand-600 mb-3" />
              <h3 className="text-sm font-semibold text-brand-900 mb-2">Send Us a Message</h3>
              <p className="text-xs text-brand-700 leading-relaxed mb-4">
                Have a specific question? Drop us an email and our team will get back to you within 24 hours.
              </p>
              <a href="mailto:carelearnuk@gmail.com" className="btn-primary !bg-brand-700 !text-xs w-full">
                Email Us
              </a>
            </div>

            <div className="card-base p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Useful Links</h3>
              <div className="space-y-2">
                {[
                  { label: 'CQC Website', url: 'https://www.cqc.org.uk' },
                  { label: 'NHS Choices', url: 'https://www.nhs.uk' },
                  { label: 'Gov.uk Social Care', url: 'https://www.gov.uk/browse/disabilities/carers' },
                  { label: 'Age UK', url: 'https://www.ageuk.org.uk' },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-sm text-slate-600 hover:text-brand-600 transition-colors"
                  >
                    {link.label}
                    <ExternalLink size={12} className="text-slate-300" />
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

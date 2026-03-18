/*
  # Seed Initial Data for Healthcare Directory

  1. Directory Categories - 8 healthcare sector categories
  2. Directory Listings - 12 sample healthcare organizations
  3. CQC Tips - 9 helpful CQC guidance articles
  4. Industry News - 6 sample news items

  This provides a rich initial dataset for the directory launch.
*/

-- Seed Directory Categories
INSERT INTO directory_categories (name, slug, description, icon, display_order) VALUES
  ('Residential Care', 'residential-care', 'Care homes providing 24/7 residential support for elderly and vulnerable adults', 'Home', 1),
  ('Domiciliary Care', 'domiciliary-care', 'Home care services delivering personal care and support in people''s own homes', 'HeartHandshake', 2),
  ('Nursing Homes', 'nursing-homes', 'Specialist nursing facilities with registered nurses on-site around the clock', 'Stethoscope', 3),
  ('Mental Health', 'mental-health', 'Services supporting mental health recovery, wellbeing and therapeutic care', 'Brain', 4),
  ('Learning Disabilities', 'learning-disabilities', 'Specialist support for adults and children with learning disabilities', 'Sparkles', 5),
  ('Recruitment Agencies', 'recruitment-agencies', 'Healthcare staffing agencies connecting professionals with care providers', 'Users', 6),
  ('NHS Services', 'nhs-services', 'National Health Service trusts, hospitals and community health services', 'Building2', 7),
  ('Technology & Innovation', 'technology-innovation', 'Healthcare technology companies driving digital transformation in care', 'Cpu', 8)
ON CONFLICT (slug) DO NOTHING;

-- Seed Directory Listings
INSERT INTO directory_listings (name, slug, description, long_description, category_id, website, phone, city, region, postcode, cqc_rating, services, is_featured, is_verified) VALUES
  ('Sunrise Senior Living', 'sunrise-senior-living', 'Award-winning residential care homes across the UK providing exceptional person-centred care.', 'Sunrise Senior Living operates a network of beautifully designed care homes across England, offering residential, nursing and dementia care. With a focus on personalised care plans and enriching activities, each home creates a warm community atmosphere. Their trained staff are committed to maintaining dignity, independence and quality of life for every resident.', (SELECT id FROM directory_categories WHERE slug = 'residential-care'), 'https://www.sunriseseniorliving.co.uk', '020 7535 8200', 'London', 'Greater London', 'SW1A 1AA', 'Good', ARRAY['Residential Care', 'Dementia Care', 'Respite Care', 'End of Life Care'], true, true),
  
  ('Bluebird Care', 'bluebird-care', 'National domiciliary care provider delivering outstanding home care services across the UK.', 'Bluebird Care is one of the UK''s leading home care providers, with franchises across England, Wales and Northern Ireland. They offer a comprehensive range of services from companionship visits to complex care packages, all delivered by trained care assistants who are passionate about enabling people to live independently at home.', (SELECT id FROM directory_categories WHERE slug = 'domiciliary-care'), 'https://www.bluebirdcare.co.uk', '0145 328 6772', 'Petersfield', 'Hampshire', 'GU32 3EW', 'Outstanding', ARRAY['Home Care', 'Live-in Care', 'Complex Care', 'Companionship'], true, true),

  ('Barchester Healthcare', 'barchester-healthcare', 'One of the UK''s largest care home operators with over 250 homes nationwide.', 'Barchester Healthcare operates more than 250 care homes and hospitals across England, Scotland and Wales. They provide residential, nursing and specialist dementia care in purpose-built environments designed to feel like home. Their commitment to clinical excellence has earned numerous industry awards and consistently high CQC ratings.', (SELECT id FROM directory_categories WHERE slug = 'nursing-homes'), 'https://www.barchester.com', '020 7588 1180', 'London', 'Greater London', 'EC2A 4NE', 'Good', ARRAY['Nursing Care', 'Residential Care', 'Dementia Care', 'Rehabilitation'], true, true),

  ('Priory Group', 'priory-group', 'Leading independent provider of mental health services in the UK.', 'The Priory Group is the UK''s leading provider of behavioural care, offering treatment across a nationwide network of hospitals, therapeutic schools and specialist centres. From anxiety and depression to complex trauma and addiction, their multidisciplinary teams deliver evidence-based treatments tailored to individual needs.', (SELECT id FROM directory_categories WHERE slug = 'mental-health'), 'https://www.priorygroup.com', '0800 840 3219', 'London', 'Greater London', 'W1U 8EW', 'Good', ARRAY['Inpatient Treatment', 'Outpatient Therapy', 'Addiction Recovery', 'CAMHS'], true, true),

  ('Mencap', 'mencap', 'Leading charity and service provider for people with learning disabilities.', 'Mencap is the UK''s leading charity for people with a learning disability, providing direct support services, campaigning for equal rights and offering information and advice. Their support services help thousands of people live their lives the way they choose, with personalised support that promotes independence and community involvement.', (SELECT id FROM directory_categories WHERE slug = 'learning-disabilities'), 'https://www.mencap.org.uk', '0808 808 1111', 'London', 'Greater London', 'EC1V 7RP', 'Good', ARRAY['Supported Living', 'Day Services', 'Employment Support', 'Advocacy'], false, true),

  ('Hays Healthcare', 'hays-healthcare', 'Specialist healthcare recruitment agency connecting professionals with NHS and private sector roles.', 'Hays Healthcare is a division of Hays plc, one of the world''s leading recruitment companies. They specialise in placing healthcare professionals across the NHS, private hospitals and care providers. From nurses and doctors to allied health professionals and care workers, their expert consultants understand the unique demands of healthcare recruitment.', (SELECT id FROM directory_categories WHERE slug = 'recruitment-agencies'), 'https://www.hays.co.uk/healthcare', '020 3465 0000', 'London', 'Greater London', 'WC2B 4JF', '', ARRAY['Permanent Recruitment', 'Temporary Staffing', 'Executive Search', 'International Recruitment'], false, true),

  ('Guy''s and St Thomas'' NHS Trust', 'guys-st-thomas', 'Major NHS teaching hospital trust in central London.', 'Guy''s and St Thomas'' NHS Foundation Trust is one of the largest NHS trusts in the country, comprising two of London''s most historic hospitals. The Trust provides a full range of hospital services for the local community in Lambeth and Southwark, as well as specialist services for patients from across the UK and abroad.', (SELECT id FROM directory_categories WHERE slug = 'nhs-services'), 'https://www.guysandstthomas.nhs.uk', '020 7188 7188', 'London', 'Greater London', 'SE1 7EH', 'Good', ARRAY['Acute Care', 'Specialist Services', 'Research', 'Teaching'], true, true),

  ('Karantis360', 'karantis360', 'AI-powered monitoring platform for elderly and vulnerable adults in care settings.', 'Karantis360 develops intelligent monitoring solutions that use AI and IoT to provide real-time insights into the wellbeing of care home residents. Their non-intrusive sensors track daily patterns and alert care staff to potential health concerns before they become emergencies, enabling proactive rather than reactive care.', (SELECT id FROM directory_categories WHERE slug = 'technology-innovation'), 'https://www.karantis360.com', '020 3813 1850', 'London', 'Greater London', 'EC2A 1NT', '', ARRAY['AI Monitoring', 'IoT Sensors', 'Predictive Analytics', 'Care Management'], false, true),

  ('Home Instead', 'home-instead', 'Premium home care provider specialising in companionship and personal care for older adults.', 'Home Instead is a global home care company with hundreds of franchise offices across the UK. They focus on relationship-led care, matching Care Professionals with clients based on shared interests and personality. Services range from companionship visits to 24-hour live-in care, always with an emphasis on maintaining independence and dignity.', (SELECT id FROM directory_categories WHERE slug = 'domiciliary-care'), 'https://www.homeinstead.co.uk', '01onal 925 730 273', 'Warrington', 'Cheshire', 'WA1 1GP', 'Outstanding', ARRAY['Companionship', 'Personal Care', 'Live-in Care', 'Dementia Care'], true, true),

  ('Cygnet Health Care', 'cygnet-health-care', 'Specialist mental health and learning disability services across England and Wales.', 'Cygnet Health Care provides a range of specialist mental health services including locked rehabilitation, acute psychiatric care and learning disability services. With over 100 services across England and Wales, they support individuals with complex needs through personalised treatment programmes delivered by multidisciplinary teams.', (SELECT id FROM directory_categories WHERE slug = 'mental-health'), 'https://www.cygnethealth.co.uk', '020 8843 9966', 'London', 'Greater London', 'W4 5YB', 'Good', ARRAY['Secure Services', 'Rehabilitation', 'CAMHS', 'Eating Disorders'], false, true),

  ('CareTech Holdings', 'caretech-holdings', 'Major provider of specialist social care services for adults and children.', 'CareTech Holdings is one of the UK''s largest specialist social care providers, supporting adults and young people with complex needs. Their services span residential care, foster care, education and specialist supported living, delivered through a network of homes and services across England and Wales.', (SELECT id FROM directory_categories WHERE slug = 'learning-disabilities'), 'https://www.caretech-uk.com', '01onal onal onal', 'Potters Bar', 'Hertfordshire', 'EN6 3BR', 'Good', ARRAY['Residential Care', 'Supported Living', 'Foster Care', 'Education'], false, true),

  ('Person Centred Software', 'person-centred-software', 'Digital care management platform used by thousands of care homes across the UK.', 'Person Centred Software is the UK''s most widely used digital care management system, used in over 15,000 care settings. Their mobile-first platform enables care staff to record and access care notes instantly, reducing paperwork and freeing up more time for face-to-face care. The system integrates with CQC reporting requirements.', (SELECT id FROM directory_categories WHERE slug = 'technology-innovation'), 'https://www.personcentredsoftware.com', '01onal 925 496 355', 'Guildford', 'Surrey', 'GU1 4YD', '', ARRAY['Digital Care Planning', 'Medication Management', 'CQC Compliance', 'Analytics'], true, true)
ON CONFLICT (slug) DO NOTHING;

-- Seed CQC Tips
INSERT INTO cqc_tips (title, slug, summary, content, category, difficulty, tags, author, is_featured) VALUES
  ('Understanding CQC''s Single Assessment Framework', 'understanding-single-assessment-framework', 'A comprehensive guide to CQC''s new assessment approach and what it means for your service.', 'The Care Quality Commission introduced its Single Assessment Framework to create a more consistent, transparent and fair approach to regulation. This framework moves away from the previous key lines of enquiry (KLOEs) and introduces quality statements organised under five key questions: Safe, Effective, Caring, Responsive and Well-led.

Each quality statement describes what good care looks like and is assessed using six evidence categories. Understanding these changes is crucial for maintaining compliance and improving your service''s rating.

Key changes include:
- Quality statements replace KLOEs
- Evidence categories provide clearer expectations  
- Scoring system offers more granular ratings
- Real-time data monitoring increases between inspections
- People''s experiences are weighted more heavily

To prepare, review each quality statement against your current practice, identify gaps, and create an action plan prioritising areas of highest risk.', 'inspection-prep', 'beginner', ARRAY['CQC', 'Assessment Framework', 'Compliance', 'Regulation'], 'CareConnect Editorial', true),

  ('10 Things Inspectors Look For on Day One', 'ten-things-inspectors-look-for', 'Practical checklist of what CQC inspectors notice immediately during site visits.', 'When CQC inspectors arrive at your service, they begin forming impressions from the moment they walk through the door. Being prepared for these initial observations can make a significant difference to your inspection outcome.

1. First impressions of the environment - cleanliness, maintenance, warmth
2. How staff greet and interact with people using the service
3. Whether people look comfortable, engaged and well-cared for
4. Notice boards and information available to residents and families
5. Medication storage and administration records
6. Staff rotas and training records accessibility
7. Complaints log and how concerns are addressed
8. Care plan documentation and personalisation
9. Risk assessments and their regular review dates
10. Evidence of activities and community engagement

Each of these areas tells a story about the culture and quality of care in your service. Addressing them proactively demonstrates a commitment to continuous improvement.', 'inspection-prep', 'beginner', ARRAY['CQC Inspection', 'Checklist', 'Preparation', 'Site Visit'], 'CareConnect Editorial', true),

  ('Building an Outstanding Evidence Portfolio', 'building-outstanding-evidence-portfolio', 'How to systematically collect and present evidence that demonstrates exceptional care quality.', 'Achieving an Outstanding CQC rating requires more than excellent care delivery - it demands systematic evidence collection that demonstrates your service consistently exceeds expectations across all five key questions.

Start by creating a digital evidence portfolio organised by quality statement. Include a mix of quantitative data (audit results, satisfaction scores, incident trends) and qualitative evidence (testimonials, case studies, staff reflections).

Key strategies for building compelling evidence:
- Implement real-time digital care recording
- Conduct regular themed audits
- Gather feedback from people, families and professionals
- Document innovations and improvements with before/after data
- Maintain a living improvement plan with measurable outcomes
- Photograph environmental improvements
- Record staff development journeys
- Track outcome measures over time

Remember: inspectors assess what life is like for people using your service. Frame all evidence around the impact on people''s lives, not just process compliance.', 'compliance', 'advanced', ARRAY['Outstanding Rating', 'Evidence', 'Documentation', 'Quality Improvement'], 'CareConnect Editorial', true),

  ('CQC Rating Categories Explained', 'cqc-rating-categories-explained', 'Clear breakdown of what Outstanding, Good, Requires Improvement and Inadequate mean for your service.', 'CQC rates services across four categories. Understanding what each rating truly means helps you set realistic improvement targets and communicate effectively with stakeholders.

**Outstanding**: Performing exceptionally well. Services are innovative, creative and person-centred in ways that go significantly beyond meeting fundamental standards.

**Good**: Performing well and meeting expectations. This is the standard every service should aim for as a minimum, demonstrating safe, effective, caring, responsive and well-led care.

**Requires Improvement**: Not performing as well as expected. The service needs to make improvements in specific areas to meet the fundamental standards consistently.

**Inadequate**: Performing badly. The service is failing to meet fundamental standards and is placed in special measures, requiring urgent and significant improvement.

Most services in England are rated Good. Moving from Good to Outstanding requires demonstrating sustained excellence, innovation and exceptional outcomes for people using the service.', 'ratings', 'beginner', ARRAY['CQC Ratings', 'Outstanding', 'Good', 'Improvement'], 'CareConnect Editorial', false),

  ('Medication Management Best Practices', 'medication-management-best-practices', 'Essential guidance on safe medication handling, storage and administration in care settings.', 'Medication management remains one of the most commonly cited areas for improvement in CQC inspections. Getting it right is fundamental to safe care delivery.

Core requirements include:
- Designated medication storage with controlled temperature monitoring
- Clear medication administration records (MAR charts) with no gaps
- Staff competency assessments for medication administration
- Regular audits of medication stocks and disposal
- Robust protocols for PRN (as required) medication
- Clear procedures for medication errors and near misses
- Proper management of controlled drugs with dual signatures
- Up-to-date medication policies reviewed at least annually

Digital medication management systems can significantly reduce errors and provide robust audit trails. Consider investing in electronic MAR systems that integrate with pharmacy providers.

Regular medication audits should check for expired medications, correct storage temperatures, accurate record-keeping and appropriate stock levels.', 'compliance', 'intermediate', ARRAY['Medication', 'Safety', 'Administration', 'Audit'], 'CareConnect Editorial', false),

  ('Person-Centred Care Planning That Works', 'person-centred-care-planning', 'How to create care plans that genuinely reflect individual needs, preferences and aspirations.', 'Person-centred care planning is at the heart of CQC''s expectations. A well-written care plan should read like a story about a person, not a clinical document about a patient.

Start with the person''s own words about what matters to them. Document their history, preferences, cultural needs and personal goals alongside clinical assessments. Include:

- Personal profile written in first person where possible
- Life history with important events and relationships
- Communication preferences and needs
- Daily routines and how they like things done
- Food preferences and cultural dietary requirements
- Activities and interests they enjoy
- Relationships and people important to them
- Health conditions explained in accessible language
- Risk assessments that balance safety with independence
- Goals and aspirations with measurable outcomes

Review care plans regularly with the individual and their family. Make them living documents that evolve as needs change. Staff should know the content of care plans and be able to explain how they deliver personalised care.', 'best-practice', 'intermediate', ARRAY['Care Planning', 'Person-Centred', 'Documentation', 'Best Practice'], 'CareConnect Editorial', true),

  ('Preparing Your Staff for CQC Interviews', 'preparing-staff-cqc-interviews', 'Coaching guide for helping your team communicate confidently with CQC inspectors.', 'CQC inspectors routinely speak with staff at all levels during inspections. How your team communicates about care delivery can significantly influence the inspection outcome.

Key preparation strategies:
- Run mock interview sessions covering the five key questions
- Ensure all staff can articulate the service''s values and vision
- Help staff prepare specific examples of good practice
- Coach staff to speak honestly and confidently, not rehearsed
- Make sure agency staff understand your policies and approaches
- Brief night staff who may meet inspectors during early morning visits

Common questions inspectors ask staff:
- How do you ensure people are safe?
- What training have you completed recently?
- How would you raise a concern about care quality?
- Can you describe how you personalise care for an individual?
- What would you do if you witnessed poor practice?

The goal is not scripted answers but confident, authentic responses that demonstrate genuine understanding of good care practice.', 'inspection-prep', 'intermediate', ARRAY['Staff Training', 'Inspection', 'Communication', 'Interview'], 'CareConnect Editorial', false),

  ('Digital Transformation in Social Care', 'digital-transformation-social-care', 'How technology is reshaping care delivery and what CQC expects from digital adoption.', 'The social care sector is undergoing significant digital transformation, driven by both necessity and CQC''s increasing focus on technology-enabled care. Understanding current trends and regulatory expectations is essential.

Key areas of digital adoption:
- Electronic care planning and recording systems
- Digital medication management
- Remote monitoring and IoT sensors
- Video consultations and telehealth
- Workforce management platforms
- AI-assisted decision support
- Digital training and competency tracking

CQC increasingly expects services to use technology effectively. Their assessment considers how well technology is used to improve care quality, safety and efficiency.

When implementing new technology:
- Start with clear objectives tied to care quality outcomes
- Involve staff at all levels in selection and implementation
- Provide comprehensive training and ongoing support
- Monitor adoption rates and address barriers quickly
- Measure impact on care quality metrics
- Ensure data security and GDPR compliance
- Have contingency plans for technology failures

The most successful digital transformations focus on enhancing human connection, not replacing it.', 'best-practice', 'advanced', ARRAY['Technology', 'Digital', 'Innovation', 'Transformation'], 'CareConnect Editorial', false),

  ('Understanding Duty of Candour', 'understanding-duty-of-candour', 'Your legal obligations when things go wrong and how to maintain transparency with families.', 'Duty of Candour is a legal requirement for all CQC-registered providers. It mandates openness and transparency when things go wrong, specifically when a notifiable safety incident occurs.

Your obligations include:
- Telling the affected person (or their representative) in person as soon as reasonably practicable
- Providing a full, truthful account of what happened
- Offering an apology (this is not an admission of liability)
- Providing written follow-up within 10 working days
- Keeping records of all communications
- Offering reasonable support to the affected person

A notifiable safety incident includes any unintended or unexpected event that results in death, severe harm, moderate harm or prolonged psychological harm.

Common mistakes to avoid:
- Delaying notification hoping the situation resolves
- Using defensive or clinical language with families
- Failing to document the conversation
- Not following up in writing
- Treating it as a blame exercise rather than a learning opportunity

Organisations with strong Duty of Candour cultures typically have better relationships with families and higher trust levels with CQC inspectors.', 'compliance', 'intermediate', ARRAY['Duty of Candour', 'Transparency', 'Safety', 'Legal'], 'CareConnect Editorial', false)
ON CONFLICT (slug) DO NOTHING;

-- Seed Industry News
INSERT INTO industry_news (title, summary, source, source_url, image_url, category, is_featured, published_at) VALUES
  ('CQC Announces New Provider Portal for Real-Time Data Submission', 'The Care Quality Commission has launched a new digital portal allowing providers to submit performance data in real-time, moving away from periodic reporting cycles.', 'CQC', 'https://www.cqc.org.uk', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800', 'regulation', true, now() - interval '2 days'),
  
  ('NHS England Workforce Plan Sets Target of 300,000 New Staff by 2030', 'The long-awaited NHS Long Term Workforce Plan outlines ambitious targets for recruitment, training and retention across all healthcare professions.', 'NHS England', 'https://www.england.nhs.uk', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800', 'workforce', true, now() - interval '5 days'),
  
  ('Social Care Funding Reform: What Providers Need to Know', 'Government confirms new funding arrangements for adult social care, with implications for provider contracts and fee negotiations with local authorities.', 'Department of Health', 'https://www.gov.uk/dhsc', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800', 'policy', false, now() - interval '8 days'),
  
  ('AI in Healthcare: New NICE Guidelines on Digital Health Technologies', 'NICE publishes comprehensive framework for evaluating AI and digital health technologies, setting standards for evidence and implementation.', 'NICE', 'https://www.nice.org.uk', 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800', 'technology', true, now() - interval '12 days'),
  
  ('Care Home Staffing Crisis: Sector Reports 165,000 Vacancies', 'Skills for Care data reveals persistent staffing challenges across the social care sector, with turnover rates remaining above 25%.', 'Skills for Care', 'https://www.skillsforcare.org.uk', 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800', 'workforce', false, now() - interval '15 days'),
  
  ('New Dementia Care Standards Published by Social Care Institute', 'SCIE releases updated best practice guidelines for dementia care, incorporating latest research on person-centred approaches and environmental design.', 'SCIE', 'https://www.scie.org.uk', 'https://images.unsplash.com/photo-1559757175-7cb056fba93d?w=800', 'best-practice', false, now() - interval '20 days')
ON CONFLICT DO NOTHING;
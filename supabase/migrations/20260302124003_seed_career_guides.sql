/*
  # Seed Career Guides

  Populates the career_guides table with 5 flagship guides (Phase 1 MVP).
  Each guide follows the AEO-optimised template with structured content.
*/

INSERT INTO career_guides (title, slug, target_keyword, opening_paragraph, at_a_glance, steps, funding_section, faq, hero_image_url, is_published, from_occupation_id, to_occupation_id) VALUES

-- Guide 1: HCA to Registered Nurse
(
  'How to Become a Registered Nurse from a Healthcare Assistant: Complete UK Guide 2026',
  'hca-to-registered-nurse',
  'How to become a nurse from HCA UK',
  'To become a Registered Nurse from a Healthcare Assistant, you will need a BSc (Hons) Nursing degree, which takes 3 years full-time or 4 years part-time. There are three main routes: the traditional Access to HE pathway, the Nursing Associate stepping-stone route, and the Registered Nurse Degree Apprenticeship. Most routes can be substantially funded through the NHS Learning Support Fund (£5,000/year) or Apprenticeship Levy.',
  '{"duration": "4-7 years depending on route", "cost": "£0 - £27,750 (before funding)", "funding_available": "NHS Learning Support Fund, Apprenticeship Levy, Advanced Learner Loans", "regulatory_body": "NMC (Nursing and Midwifery Council)", "typical_salary": "£29,970 - £36,483 (Band 5)"}'::jsonb,
  '[
    {"step": 1, "title": "Gain experience as an HCA and complete the Care Certificate", "content": "Secure a Band 2 Healthcare Support Worker role in the NHS or private sector. Complete the Care Certificate within your first 12 weeks. Aim for at least 12 months of clinical experience — universities value this highly in applications."},
    {"step": 2, "title": "Choose your route to nursing", "content": "Three routes are available: (1) Access to HE Diploma then Nursing Degree (most common), (2) Nursing Associate Apprenticeship then RN Top-Up (earn while you learn), (3) Registered Nurse Degree Apprenticeship (if your trust offers it). Research which is available and best suits your circumstances."},
    {"step": 3, "title": "Complete your Access to HE Diploma or Nursing Associate training", "content": "The Access to HE Diploma takes 1 year full-time at a local FE college (funded via Advanced Learner Loan — written off when you qualify as a nurse). Alternatively, the Nursing Associate apprenticeship takes 2 years and is fully funded. Both prepare you for degree-level study."},
    {"step": 4, "title": "Apply for and complete BSc (Hons) Nursing", "content": "Apply through UCAS for the nursing degree (or RN Top-Up if you qualified as a Nursing Associate). You will receive the £5,000/year NHS Learning Support Fund. The degree takes 3 years full-time and includes 2,300 hours of clinical placement."},
    {"step": 5, "title": "Register with the NMC and start your nursing career", "content": "After graduating, register with the Nursing and Midwifery Council (£120 annual fee). You are now a Registered Nurse, eligible for Band 5 NHS positions. Your first post will be a preceptorship year with structured support."}
  ]'::jsonb,
  'The NHS Learning Support Fund provides £5,000 per year in non-repayable grants for nursing students. If you take the Access to HE route, the Advanced Learner Loan for this course is written off once you complete your nursing degree. The Apprenticeship Levy fully funds the Nursing Associate and Degree Apprenticeship routes — you pay nothing. For mature students, childcare grants and hardship funds are also available through your university.',
  '[
    {"question": "Can I become a nurse without A-levels?", "answer": "Yes. The Access to Higher Education Diploma is specifically designed for adults without traditional qualifications. It is accepted by all UK nursing schools and can be funded through an Advanced Learner Loan."},
    {"question": "How long does it take to go from HCA to Registered Nurse?", "answer": "The fastest route is the Registered Nurse Degree Apprenticeship (4 years). The traditional route (Access to HE + Degree) takes 4-5 years. The Nursing Associate stepping-stone route takes 5-6 years total."},
    {"question": "Will I get paid while training to be a nurse?", "answer": "On the Degree Apprenticeship or Nursing Associate route, yes — you remain employed and paid throughout. On the traditional university route, you receive the £5,000/year NHS Learning Support Fund but are not employed by the NHS during term time."},
    {"question": "Is the Access to HE Diploma hard?", "answer": "It is academically demanding (Level 3 — equivalent to A-levels) but designed for adult learners returning to education. Most students with care experience find their practical knowledge gives them a strong foundation. The pass rate is around 85%."},
    {"question": "What is the difference between a Nursing Associate and a Registered Nurse?", "answer": "Nursing Associates are Band 4, work under the supervision of Registered Nurses, and complete a 2-year Foundation Degree. Registered Nurses are Band 5, work autonomously, and complete a 3-year BSc. Both are NMC-regulated."},
    {"question": "Can my NHS trust fund my nursing training?", "answer": "Many NHS trusts offer the Registered Nurse Degree Apprenticeship, which is fully funded through the Apprenticeship Levy. Ask your Education Lead or Practice Education Facilitator about available places."}
  ]'::jsonb,
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200',
  true,
  (SELECT id FROM occupation_levels WHERE slug = 'healthcare-support-worker'),
  (SELECT id FROM occupation_levels WHERE slug = 'registered-nurse-adult')
),

-- Guide 2: Support Worker to Social Worker
(
  'How to Become a Social Worker from a Support Worker: Complete UK Guide 2026',
  'support-worker-to-social-worker',
  'How to become a social worker UK',
  'To become a Social Worker from a Support Worker role, you need a BA (Hons) or MA in Social Work approved by Social Work England. The degree takes 3 years full-time (undergraduate) or 2 years (postgraduate). Accelerated routes include the Step Up to Social Work and Frontline programmes, both fully funded. Total training time is typically 4-6 years including the Access course.',
  '{"duration": "3-6 years depending on route", "cost": "£0 - £27,750 (before funding)", "funding_available": "Student Finance, Advanced Learner Loans, Step Up/Frontline funding", "regulatory_body": "Social Work England", "typical_salary": "£30,000 - £42,000"}'::jsonb,
  '[
    {"step": 1, "title": "Build your foundation in care work", "content": "Gain at least 1-2 years of experience in a care or support role. This gives you invaluable practical knowledge and demonstrates commitment to admissions panels. Consider completing a Level 3 Diploma in Health and Social Care."},
    {"step": 2, "title": "Complete an Access to Higher Education Diploma", "content": "The Access to HE Diploma (Social Science pathway) takes 1 year full-time at a local FE college. It covers sociology, psychology, and social policy at Level 3. Funded via Advanced Learner Loan or Free Courses for Jobs if you do not hold a Level 3 qualification."},
    {"step": 3, "title": "Apply for BA (Hons) Social Work or accelerated programme", "content": "Apply through UCAS for the 3-year BA (Hons) Social Work. You will complete 170 days of practice placement. Alternatively, if you already have a degree, consider the Step Up to Social Work (14 months) or Frontline (2 years) programmes — both are fully funded."},
    {"step": 4, "title": "Complete your degree and register with Social Work England", "content": "After graduating, register with Social Work England (£90 annual fee). You are now a qualified Social Worker. Your first year will be an Assessed and Supported Year in Employment (ASYE) with structured supervision."}
  ]'::jsonb,
  'Student Finance covers tuition fees (£9,250/year) and provides maintenance loans. The Access to HE Diploma is funded through Advanced Learner Loans or Free Courses for Jobs. The Step Up to Social Work programme and Frontline programme are fully funded by the Department for Education. Many local authorities also offer Social Worker Degree Apprenticeships funded through the Apprenticeship Levy.',
  '[
    {"question": "Can I become a social worker without a degree?", "answer": "No — you must hold an approved social work degree (BA or MA). However, you can enter university through the Access to HE Diploma if you do not have A-levels. Your care experience will be highly valued."},
    {"question": "How long does it take to become a social worker from scratch?", "answer": "Typically 4-5 years: 1 year Access to HE + 3 years BA Social Work + 1 year ASYE. With a prior degree, the MA route takes 2 years + 1 year ASYE."},
    {"question": "What is the Step Up to Social Work programme?", "answer": "Step Up is a 14-month intensive postgraduate programme funded by the Department for Education. You receive a bursary and are placed with a local authority. You must already hold a degree to apply."},
    {"question": "Is social work a stressful career?", "answer": "Social work can be emotionally demanding, particularly in child protection and mental health settings. However, it is also deeply rewarding. Good employers provide regular supervision, manageable caseloads, and wellbeing support."},
    {"question": "What areas can social workers specialise in?", "answer": "Main specialisms include: children and families, adult social care, mental health (AMHP), learning disabilities, substance misuse, and hospital-based discharge planning."}
  ]'::jsonb,
  'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=1200',
  true,
  (SELECT id FROM occupation_levels WHERE slug = 'care-worker'),
  (SELECT id FROM occupation_levels WHERE slug = 'social-worker')
),

-- Guide 3: Care Worker to Registered Manager
(
  'How to Become a Registered Manager from a Care Worker: Complete UK Guide 2026',
  'care-worker-to-registered-manager',
  'How to become a registered manager',
  'To become a Registered Manager from a Care Worker, you need the Level 5 Diploma in Leadership for Health and Social Care and must register with CQC. The journey typically takes 4-6 years and can be almost entirely free using LDSS funding and apprenticeships. This is one of the most in-demand roles in adult social care, with over 300 vacancies at any time.',
  '{"duration": "4-6 years", "cost": "£0 - £7,800 (before funding)", "funding_available": "LDSS (up to £1,500/year), Apprenticeship Levy", "regulatory_body": "CQC (Care Quality Commission)", "typical_salary": "£32,000 - £45,000"}'::jsonb,
  '[
    {"step": 1, "title": "Complete the Care Certificate and Level 2 Diploma", "content": "If you are new to care, complete the Care Certificate induction and then the Level 2 Diploma in Care. Both can be funded through LDSS or delivered as an apprenticeship at no cost to you."},
    {"step": 2, "title": "Progress to Senior Care Worker with Level 3 Diploma", "content": "Move into a Senior Care Worker role and complete the Level 3 Diploma in Adult Care. This covers leadership, supervision, and complex care. Available as an 18-month apprenticeship or funded via LDSS."},
    {"step": 3, "title": "Gain management experience and complete Level 4 Certificate", "content": "Take on deputy manager or team leader responsibilities. The Level 4 Certificate in Leadership and Management is an optional but recommended stepping stone between Level 3 and Level 5."},
    {"step": 4, "title": "Complete the Level 5 Diploma in Leadership for Health and Social Care", "content": "This is the gold-standard qualification for Registered Managers. It covers governance, quality assurance, resource management, and regulatory compliance. Available as a 2-year apprenticeship fully funded through the Levy, or via LDSS."},
    {"step": 5, "title": "Register with CQC as a Registered Manager", "content": "Apply to CQC to become the named Registered Manager for a care service. This involves a DBS check, fit person interview, and demonstration of your qualifications and experience."}
  ]'::jsonb,
  'The LDSS (Learning & Development Support Scheme) funds up to £1,500 per worker per year for adult social care qualifications. This can cover Levels 2-5 of this pathway. The Apprenticeship Levy fully funds the Level 2, 3, and 5 apprenticeships. Your employer must be registered with Skills for Care to access LDSS. Quick tip: many small care providers do not access LDSS — if yours does not, encourage them to register.',
  '[
    {"question": "Do I need the Level 5 Diploma to be a Registered Manager?", "answer": "CQC does not legally require the Level 5 Diploma, but it is the expected industry standard. Most employers require it, and CQC inspectors will ask about your qualifications during inspection."},
    {"question": "How much does a Registered Manager earn?", "answer": "Typical salaries range from £32,000 to £45,000 depending on the size of the service, location, and provider type. Large nursing homes and specialist services tend to pay more."},
    {"question": "Can LDSS fund my Level 5 Diploma?", "answer": "Yes — LDSS can contribute up to £1,500 per year towards the cost. Since the Level 5 typically takes 2 years, this can cover a significant portion. Your employer must apply through Skills for Care."},
    {"question": "What does CQC registration involve?", "answer": "You must complete an application form, undergo a DBS check, provide references, and attend a fit person interview with CQC. The process typically takes 8-12 weeks."},
    {"question": "Can I manage a care home without nursing qualifications?", "answer": "Yes — Registered Managers of residential care homes (without nursing) do not need nursing qualifications. However, nursing homes require either a nurse manager or appropriate clinical governance arrangements."}
  ]'::jsonb,
  'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1200',
  true,
  (SELECT id FROM occupation_levels WHERE slug = 'care-worker'),
  (SELECT id FROM occupation_levels WHERE slug = 'registered-manager')
),

-- Guide 4: Becoming a Nursing Associate
(
  'How to Become a Nursing Associate in the UK: Complete Guide 2026',
  'becoming-a-nursing-associate',
  'How to become a Nursing Associate UK',
  'To become a Nursing Associate, you complete a 2-year Trainee Nursing Associate apprenticeship leading to a Foundation Degree and NMC registration. This role was introduced in 2019 to bridge the gap between Healthcare Support Workers and Registered Nurses. The apprenticeship is fully funded through the Apprenticeship Levy — you earn while you learn.',
  '{"duration": "2 years (apprenticeship)", "cost": "£0 (fully funded)", "funding_available": "Apprenticeship Levy", "regulatory_body": "NMC (Nursing and Midwifery Council)", "typical_salary": "£26,530 - £29,114 (Band 4)"}'::jsonb,
  '[
    {"step": 1, "title": "Secure a Band 2 or 3 HCSW role in the NHS", "content": "You must be employed as an HCSW for at least 12 months before applying for the Trainee Nursing Associate programme. Use this time to complete the Care Certificate and build your clinical skills portfolio."},
    {"step": 2, "title": "Apply for the Trainee Nursing Associate apprenticeship", "content": "Applications are usually managed through your NHS trust Education Lead. Places are competitive — demonstrate your commitment through CPD, reflective practice, and understanding of the role."},
    {"step": 3, "title": "Complete the 2-year Foundation Degree programme", "content": "You will study at a partner university one day per week while working in clinical practice the rest of the week. The programme covers all fields of nursing across hospital, community, and mental health settings."},
    {"step": 4, "title": "Register with the NMC and practise as a Nursing Associate", "content": "After completing the programme and passing the NMC assessment, register with the NMC (£120/year). You are now a Band 4 Nursing Associate — an NMC-regulated professional."}
  ]'::jsonb,
  'The Trainee Nursing Associate apprenticeship is fully funded through the Apprenticeship Levy. You remain employed at your current Band 2/3 salary throughout. Some trusts offer a training uplift during the programme. There are no tuition fees to pay.',
  '[
    {"question": "What is the difference between a Nursing Associate and a Registered Nurse?", "answer": "Nursing Associates are Band 4, hold a Foundation Degree, and work under the direction of Registered Nurses. Registered Nurses are Band 5, hold a BSc, and work autonomously. Both are NMC-regulated."},
    {"question": "Can I become a Registered Nurse after qualifying as a Nursing Associate?", "answer": "Yes — a 2-year top-up programme (BSc Hons Nursing) is available through several universities including The Open University. This can also be done as an apprenticeship."},
    {"question": "Do I need GCSEs to apply?", "answer": "Most programmes require GCSE English and Maths at grade C/4 or above. Some trusts offer functional skills equivalency tests if you do not hold these. Check with your trust."},
    {"question": "What clinical areas will I work in during training?", "answer": "You will rotate through adult nursing, mental health, children/young people, and learning disability settings. This gives you a broad foundation of experience across all four fields of nursing."},
    {"question": "How competitive is the Trainee Nursing Associate programme?", "answer": "It is competitive — typically 3-5 applicants per place. Strong applications demonstrate clinical experience, reflective practice, and understanding of the Nursing Associate role scope."}
  ]'::jsonb,
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200',
  true,
  (SELECT id FROM occupation_levels WHERE slug = 'healthcare-support-worker'),
  (SELECT id FROM occupation_levels WHERE slug = 'nursing-associate')
),

-- Guide 5: Mental Health Support Worker Career Path
(
  'Mental Health Support Worker Career Progression: Complete UK Guide 2026',
  'mental-health-support-worker-career-path',
  'Mental Health Support Worker career progression',
  'Mental Health Support Workers can progress into specialist roles including Community Psychiatric Nurse (CPN), Approved Mental Health Professional (AMHP), IAPT Practitioner, or Mental Health Nurse. Starting salaries range from £24,071 (Band 3) with qualified roles reaching £44,962+ (Band 6). The sector is experiencing significant growth with expanding community mental health services.',
  '{"duration": "Varies by target role (2-7 years)", "cost": "£0 - £27,750 depending on route", "funding_available": "Apprenticeship Levy, NHS Learning Support Fund, Advanced Learner Loans", "regulatory_body": "NMC (nursing routes) or HCPC (AHP routes)", "typical_salary": "£24,071 - £44,962+ depending on qualification"}'::jsonb,
  '[
    {"step": 1, "title": "Build your foundation as a Mental Health Support Worker", "content": "Complete the Care Certificate and a Level 2 Certificate in Mental Health Awareness. Gain 1-2 years of experience in community, inpatient, or crisis team settings. This experience is invaluable for future career progression."},
    {"step": 2, "title": "Specialise with a Level 3 qualification", "content": "Complete a Level 3 Certificate in Mental Health (or equivalent apprenticeship). This qualifies you for Band 4 Senior Support Worker roles. Consider Mental Health First Aid instructor training."},
    {"step": 3, "title": "Choose your specialist career pathway", "content": "Options include: (A) Mental Health Nursing — Access to HE then BSc Mental Health Nursing, (B) Social Work (mental health specialism), (C) Psychological Wellbeing Practitioner (IAPT), (D) Occupational Therapy. Research which aligns with your strengths and interests."},
    {"step": 4, "title": "Complete your chosen degree programme", "content": "All specialist routes require degree-level study (3-4 years). Mental Health Nursing students receive the £5,000/year NHS Learning Support Fund plus a £3,000 specialist subject bonus. Apprenticeship routes are fully funded."},
    {"step": 5, "title": "Register with your regulatory body and practise", "content": "Register with the NMC (nursing), HCPC (OT/psychology), or Social Work England depending on your chosen pathway. Begin your preceptorship or ASYE year with structured support."}
  ]'::jsonb,
  'Mental Health Nursing students receive an enhanced NHS Learning Support Fund: £5,000/year maintenance + £3,000/year specialist subject payment = £8,000/year in non-repayable grants. The Apprenticeship Levy funds Nursing Associate and RN Degree Apprenticeship routes. LDSS funds Level 2-3 social care qualifications. The IAPT programme is funded by NHS England.',
  '[
    {"question": "What is the salary for a Mental Health Support Worker?", "answer": "Starting salary is typically £24,071-£25,674 (Band 3). Senior support workers (Band 4) earn £26,530-£29,114. Qualified Mental Health Nurses start at £29,970 (Band 5)."},
    {"question": "Can I become a Mental Health Nurse from a support worker role?", "answer": "Yes — the route is: Access to HE Diploma → BSc Mental Health Nursing (3 years) → NMC Registration. You can also go via the Nursing Associate route. Mental health nursing students receive enhanced funding."},
    {"question": "What is an AMHP?", "answer": "An Approved Mental Health Professional is a specialist role authorised to make decisions under the Mental Health Act, including detaining people under section. It requires additional post-qualification training and is usually undertaken by social workers or nurses."},
    {"question": "What is IAPT?", "answer": "Improving Access to Psychological Therapies (IAPT) is an NHS programme providing evidence-based talking therapies. Psychological Wellbeing Practitioners (PWPs) deliver low-intensity CBT. Training is a 1-year postgraduate programme."},
    {"question": "Is mental health work emotionally demanding?", "answer": "It can be. Working with people in crisis, managing risk, and hearing distressing experiences requires emotional resilience. Good employers provide clinical supervision, reflective practice sessions, and access to staff wellbeing services."}
  ]'::jsonb,
  'https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?w=1200',
  true,
  (SELECT id FROM occupation_levels WHERE slug = 'mental-health-support-worker'),
  (SELECT id FROM occupation_levels WHERE slug = 'registered-nurse-adult')
);

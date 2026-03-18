/*
  # Seed Funding Schemes and Career Pathways

  1. Funding Schemes - All 6 UK funding mechanisms with eligibility rules
  2. Career Pathways - 5 pre-built flagship pathways with step-by-step roadmaps

  This data powers the Funding Hub and Path-Finder tool.
*/

-- FUNDING SCHEMES
INSERT INTO funding_schemes (scheme_name, slug, short_description, full_description, eligibility_rules, max_amount_gbp, application_url) VALUES

('Learning & Development Support Scheme (LDSS)', 'ldss',
'Up to £1,500/year for non-regulated adult social care workers in England.',
'The LDSS (Learning & Development Support Scheme) replaced the Social Care Fund in 2024. It provides funding for non-regulated adult social care staff to access qualifications from Level 2 to Level 5. Employers must apply through Skills for Care. The scheme covers course fees, backfill costs, and assessment fees. CRITICAL: Many care workers are unaware this funding exists — their employer must be registered with Skills for Care to access it.',
'{"sector": "adult_social_care", "role_type": "non_regulated", "employer_registered": true, "qualification_levels": ["L2", "L3", "L4", "L5"], "requires_employer_application": true}'::jsonb,
'£1,500 per worker per year',
'https://www.skillsforcare.org.uk/Funding/LDSS'),

('NHS Learning Support Fund (LSF)', 'lsf',
'£5,000/year non-repayable grant for pre-registration nursing, midwifery, and AHP students.',
'The NHS Learning Support Fund provides a non-repayable training grant of £5,000 per academic year for students on pre-registration nursing, midwifery, and allied health programmes in England. An additional £1,000 exceptional hardship fund is available. There is also a £3,000 specialist subject payment for mental health and learning disability nursing students. Administered by the NHS Business Services Authority (NHS BSA).',
'{"course_type": "pre_registration", "qualification_level": ["HE_UG", "HE_PG"], "subjects": ["nursing", "midwifery", "allied_health"], "country": "England"}'::jsonb,
'£5,000/year + £1,000 hardship + £3,000 specialist',
'https://www.nhsbsa.nhs.uk/learning-support-fund'),

('Apprenticeship Levy', 'apprenticeship-levy',
'Earn-while-you-learn for all qualification levels. Government co-funds 95% for non-Levy employers.',
'The Apprenticeship Levy funds training for employees in apprenticeship programmes lasting 12+ months. Large employers (payroll over £3M) pay into the Levy pot; smaller employers receive 95% government co-investment (they pay just 5%). Apprenticeships are available from Level 2 (Care Worker) to Level 7 (Advanced Clinical Practitioner). The apprentice must be employed for at least 30 hours per week.',
'{"employment_required": true, "minimum_weekly_hours": 30, "minimum_duration_months": 12, "all_levels": true}'::jsonb,
'Fully funded (Levy employers) or 5% co-investment',
'https://www.gov.uk/employing-an-apprentice'),

('Advanced Learner Loans', 'advanced-learner-loans',
'Income-contingent loans for Level 3-6 qualifications. Does not affect Universal Credit.',
'Advanced Learner Loans are available for adults aged 19+ studying approved Level 3-6 qualifications at approved providers. Repayment is income-contingent (like student loans) — you only repay when earning above the threshold. Critically, these loans do NOT affect Universal Credit, Housing Benefit, or other means-tested benefits. The loan is written off after 30 years.',
'{"minimum_age": 19, "qualification_levels": ["L3", "L4", "L5", "L6"], "approved_provider_required": true, "does_not_affect_benefits": true}'::jsonb,
'Covers full course fees',
'https://www.gov.uk/advanced-learner-loan'),

('Free Courses for Jobs', 'free-courses-for-jobs',
'Government-funded Level 3 courses for adults without an existing Level 3 qualification.',
'The Free Courses for Jobs programme provides fully-funded Level 3 qualifications for adults who do not already hold a Level 3 (A-level equivalent) or higher qualification. This is highly relevant for entry-level care workers looking to upskill to senior care worker level without financial barriers. The programme covers a specific list of approved qualifications that meet employer demand.',
'{"no_existing_level_3": true, "qualification_levels": ["L3"], "age_19_plus": true, "approved_courses_only": true}'::jsonb,
'Fully funded (no cost to learner)',
'https://www.gov.uk/government/publications/free-courses-for-jobs'),

('NHS Workforce Development Funds', 'nhs-workforce-development',
'Regional/ICS-level funding for in-employment NHS staff. Varies by trust and region.',
'NHS Workforce Development Funds are allocated at regional and ICS (Integrated Care System) level to support the continuing professional development of existing NHS staff. Availability and amounts vary significantly by trust and region. Staff should check with their line manager or Learning & Development department. Common uses include: CPD courses, conference attendance, clinical skills training, and postgraduate study.',
'{"nhs_employment_required": true, "regional_variation": true, "check_with_trust": true}'::jsonb,
'Varies by trust/region',
'https://www.hee.nhs.uk/our-work/workforce-development');

-- CAREER PATHWAYS (5 flagship pathways)

-- We need occupation IDs, so we reference by slug
-- Pathway 1: HCA to Registered Nurse
INSERT INTO career_pathways (from_occupation_id, to_occupation_id, pathway_type, title, slug, steps, estimated_total_months_min, estimated_total_months_max, editorial_notes) VALUES
(
  (SELECT id FROM occupation_levels WHERE slug = 'healthcare-support-worker'),
  (SELECT id FROM occupation_levels WHERE slug = 'registered-nurse-adult'),
  'standard',
  'Healthcare Support Worker to Registered Nurse',
  'hcsw-to-registered-nurse',
  '[
    {"step_order": 1, "qualification_name": "Care Certificate", "duration_months": 3, "cost_gbp": 0, "funding": ["Free (employer-provided)"], "is_mandatory": true, "description": "Complete the Care Certificate within your first 12 weeks. This is the foundation for all healthcare roles."},
    {"step_order": 2, "qualification_name": "Band 3 Senior HCSW role + Level 3 Diploma", "duration_months": 18, "cost_gbp": 0, "funding": ["Apprenticeship Levy"], "is_mandatory": true, "description": "Progress to a Band 3 role and complete the Level 3 Diploma in Healthcare Support via apprenticeship."},
    {"step_order": 3, "qualification_name": "Access to Higher Education Diploma (Nursing)", "duration_months": 12, "cost_gbp": 3384, "funding": ["Advanced Learner Loan", "Free Courses for Jobs"], "is_mandatory": true, "description": "Complete the Access to HE Diploma at a local FE college. This is your gateway to university. Advanced Learner Loans available."},
    {"step_order": 4, "qualification_name": "BSc (Hons) Nursing (Adult)", "duration_months": 36, "cost_gbp": 9250, "funding": ["NHS Learning Support Fund", "Student Finance"], "is_mandatory": true, "description": "Three-year nursing degree at an approved university. You will receive the £5,000/year NHS Learning Support Fund grant."},
    {"step_order": 5, "qualification_name": "NMC Registration", "duration_months": 1, "cost_gbp": 120, "funding": ["Self-funded"], "is_mandatory": true, "description": "Register with the Nursing and Midwifery Council to practise as a Registered Nurse. Annual fee applies."}
  ]'::jsonb,
  60, 84,
  'This is the most popular career progression route in UK healthcare. There are three main routes: (1) the traditional Access to HE → Degree route shown here, (2) the Nursing Associate → Top-Up route (faster if your trust offers it), and (3) the Registered Nurse Degree Apprenticeship (earn while you learn, 4 years). Your quick win: speak to your ward manager about your ambitions this week — many trusts have talent pipeline programmes.'
),

-- Pathway 2: Care Worker to Registered Manager
(
  (SELECT id FROM occupation_levels WHERE slug = 'care-worker'),
  (SELECT id FROM occupation_levels WHERE slug = 'registered-manager'),
  'standard',
  'Care Worker to Registered Manager',
  'care-worker-to-registered-manager',
  '[
    {"step_order": 1, "qualification_name": "Care Certificate", "duration_months": 3, "cost_gbp": 0, "funding": ["Free (employer-provided)", "LDSS"], "is_mandatory": true, "description": "Complete the Care Certificate if you have not already. This is the mandatory induction standard."},
    {"step_order": 2, "qualification_name": "Level 2 Diploma in Care", "duration_months": 12, "cost_gbp": 0, "funding": ["LDSS", "Apprenticeship Levy", "Free Courses for Jobs"], "is_mandatory": true, "description": "The core qualification for care workers. Can be funded through LDSS or delivered as an apprenticeship."},
    {"step_order": 3, "qualification_name": "Level 3 Diploma in Adult Care", "duration_months": 18, "cost_gbp": 0, "funding": ["LDSS", "Apprenticeship Levy"], "is_mandatory": true, "description": "Progress to Senior Care Worker. This qualification covers leadership, supervision, and complex care delivery."},
    {"step_order": 4, "qualification_name": "Level 4 Certificate in Leadership and Management", "duration_months": 6, "cost_gbp": 1800, "funding": ["LDSS", "Advanced Learner Loan"], "is_mandatory": false, "description": "Optional but recommended stepping stone. Covers team leadership and quality assurance."},
    {"step_order": 5, "qualification_name": "Level 5 Diploma in Leadership for Health and Social Care", "duration_months": 24, "cost_gbp": 0, "funding": ["LDSS", "Apprenticeship Levy"], "is_mandatory": true, "description": "The gold-standard qualification for Registered Managers. Required for CQC registration. Can be fully funded via LDSS."},
    {"step_order": 6, "qualification_name": "CQC Registration as Registered Manager", "duration_months": 2, "cost_gbp": 0, "funding": ["Free"], "is_mandatory": true, "description": "Apply to CQC to become the named Registered Manager for a care service. Includes a DBS check and fit person interview."}
  ]'::jsonb,
  48, 72,
  'This pathway can be almost entirely free if you use LDSS funding and apprenticeships. Your employer must be registered with Skills for Care to access LDSS. Quick win: ask your manager whether the company is registered with Skills for Care and accessing LDSS funding — many small providers are not.'
),

-- Pathway 3: Support Worker to Social Worker
(
  (SELECT id FROM occupation_levels WHERE slug = 'care-worker'),
  (SELECT id FROM occupation_levels WHERE slug = 'social-worker'),
  'standard',
  'Support Worker to Social Worker',
  'support-worker-to-social-worker',
  '[
    {"step_order": 1, "qualification_name": "Level 3 Diploma in Health and Social Care", "duration_months": 18, "cost_gbp": 0, "funding": ["LDSS", "Free Courses for Jobs"], "is_mandatory": true, "description": "Build your foundation in care practice. This demonstrates commitment and provides academic grounding."},
    {"step_order": 2, "qualification_name": "Access to Higher Education Diploma (Social Science)", "duration_months": 12, "cost_gbp": 3384, "funding": ["Advanced Learner Loan", "Free Courses for Jobs"], "is_mandatory": true, "description": "One-year course at an FE college covering sociology, psychology, and social policy. Your university entry ticket."},
    {"step_order": 3, "qualification_name": "BA (Hons) Social Work", "duration_months": 36, "cost_gbp": 9250, "funding": ["Student Finance", "NHS Learning Support Fund"], "is_mandatory": true, "description": "Three-year degree including 170 days of practice placement. Alternatively, consider the Step Up to Social Work or Frontline accelerated programmes."},
    {"step_order": 4, "qualification_name": "Social Work England Registration", "duration_months": 1, "cost_gbp": 90, "funding": ["Self-funded"], "is_mandatory": true, "description": "Register with Social Work England to practise as a qualified Social Worker."}
  ]'::jsonb,
  48, 72,
  'Alternative accelerated routes exist: the Step Up to Social Work programme (14 months, fully funded, for graduates) and the Frontline programme (2 years, for graduates). If you already have a degree in any subject, consider the MA/MSc Social Work route (2 years). Quick win: contact your local university social work admissions team to discuss your experience — many value care work highly.'
),

-- Pathway 4: HCSW to Band 4 Assistant Practitioner
(
  (SELECT id FROM occupation_levels WHERE slug = 'healthcare-support-worker'),
  (SELECT id FROM occupation_levels WHERE slug = 'assistant-practitioner'),
  'apprenticeship',
  'Healthcare Support Worker to Assistant Practitioner',
  'hcsw-to-assistant-practitioner',
  '[
    {"step_order": 1, "qualification_name": "Care Certificate", "duration_months": 3, "cost_gbp": 0, "funding": ["Free (employer-provided)"], "is_mandatory": true, "description": "Ensure your Care Certificate is complete and documented."},
    {"step_order": 2, "qualification_name": "Senior HCSW Apprenticeship (Level 3)", "duration_months": 18, "cost_gbp": 0, "funding": ["Apprenticeship Levy"], "is_mandatory": true, "description": "Progress to Band 3 through the Senior HCSW apprenticeship. Earn while you learn with no training costs."},
    {"step_order": 3, "qualification_name": "Assistant Practitioner Apprenticeship (Level 5) / Foundation Degree", "duration_months": 24, "cost_gbp": 0, "funding": ["Apprenticeship Levy"], "is_mandatory": true, "description": "A 2-year apprenticeship combining university study with work-based learning. Leads to Band 4 role. Fully funded by the Apprenticeship Levy."}
  ]'::jsonb,
  36, 48,
  'This is one of the most accessible career progression routes in the NHS because it can be entirely funded through the Apprenticeship Levy with no cost to you. Many NHS trusts actively recruit for Assistant Practitioner apprenticeships. Quick win: check your trust intranet for current apprenticeship vacancies or speak to your Practice Education Facilitator.'
),

-- Pathway 5: Band 2 to Band 5 (HCSW to Nurse via Nursing Associate)
(
  (SELECT id FROM occupation_levels WHERE slug = 'healthcare-support-worker'),
  (SELECT id FROM occupation_levels WHERE slug = 'registered-nurse-adult'),
  'degree_apprenticeship',
  'Band 2 to Band 5: HCSW to Nurse via Nursing Associate Route',
  'band-2-to-band-5-via-nursing-associate',
  '[
    {"step_order": 1, "qualification_name": "Care Certificate + 12 months experience", "duration_months": 12, "cost_gbp": 0, "funding": ["Free (employer-provided)"], "is_mandatory": true, "description": "Complete the Care Certificate and gain solid clinical experience. Use this time to build your portfolio of clinical skills."},
    {"step_order": 2, "qualification_name": "Trainee Nursing Associate Apprenticeship (Foundation Degree)", "duration_months": 24, "cost_gbp": 0, "funding": ["Apprenticeship Levy"], "is_mandatory": true, "description": "A 2-year apprenticeship leading to NMC registration as a Nursing Associate. You remain employed and paid throughout."},
    {"step_order": 3, "qualification_name": "NMC Registration as Nursing Associate", "duration_months": 1, "cost_gbp": 120, "funding": ["Self-funded"], "is_mandatory": true, "description": "Register with the NMC. You are now a Band 4 Nursing Associate — a regulated healthcare professional."},
    {"step_order": 4, "qualification_name": "Nursing Associate to RN Top-Up (BSc Hons)", "duration_months": 24, "cost_gbp": 9250, "funding": ["NHS Learning Support Fund", "Apprenticeship Levy"], "is_mandatory": true, "description": "A 2-year top-up programme to convert your Foundation Degree to a full BSc Nursing. Available via The Open University (part-time) or as an apprenticeship."},
    {"step_order": 5, "qualification_name": "NMC Registration as Registered Nurse", "duration_months": 1, "cost_gbp": 120, "funding": ["Self-funded"], "is_mandatory": true, "description": "Update your NMC registration from Nursing Associate to Registered Nurse. You are now Band 5."}
  ]'::jsonb,
  48, 66,
  'This route is increasingly popular because it allows you to stay employed and earn throughout. Many NHS trusts now prefer this stepped approach. The Nursing Associate role gives you a meaningful clinical role at Band 4 while you continue your studies. Quick win: ask your Education Lead whether your trust is commissioning Trainee Nursing Associate places for the next intake.'
);

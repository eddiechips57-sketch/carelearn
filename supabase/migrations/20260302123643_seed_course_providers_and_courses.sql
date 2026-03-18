/*
  # Seed Course Providers and Courses

  Populates course_providers with 12 real UK training providers across all types,
  and courses with 50 curated courses covering all 4 pillars with full funding tags.
*/

-- COURSE PROVIDERS
INSERT INTO course_providers (provider_name, provider_type, ofsted_rating, regions_served, delivery_modes, is_featured, lead_gen_tier, website_url, description, logo_url) VALUES

('The Open University', 'university', 'Not Inspected', '["National"]', '["online", "distance_learning", "blended"]', true, 'premium',
'https://www.open.ac.uk', 'The UK''s largest university for part-time and distance learning. Offers flexible healthcare qualifications from certificates to degrees.', ''),

('University of Leeds', 'university', 'Not Inspected', '["Yorkshire and the Humber"]', '["in_person", "blended"]', true, 'premium',
'https://www.leeds.ac.uk', 'Russell Group university with a highly-rated School of Healthcare offering nursing, midwifery, and allied health programmes.', ''),

('City & Guilds / NCFE CACHE', 'awarding_body', 'Not Inspected', '["National"]', '["online", "in_person", "blended"]', false, 'standard',
'https://www.cityandguilds.com', 'Major UK awarding body offering vocational qualifications in health and social care from Level 1 to Level 5.', ''),

('Skills for Care Endorsed Providers', 'charity', 'Not Inspected', '["National"]', '["online", "blended", "in_person"]', true, 'premium',
'https://www.skillsforcare.org.uk', 'Skills for Care endorsed training providers delivering LDSS-funded qualifications for the adult social care workforce.', ''),

('NHS England Learning Hub', 'nhs_trust', 'Not Inspected', '["National"]', '["online", "blended"]', true, 'exclusive',
'https://learninghub.nhs.uk', 'The official NHS learning platform offering free CPD resources and mandatory training for all NHS staff.', ''),

('Kaplan Financial', 'private_training', 'Good', '["National"]', '["online", "blended"]', false, 'standard',
'https://www.kaplan.co.uk', 'Private training provider offering Access to Higher Education diplomas and healthcare management qualifications.', ''),

('Pearson (BTEC / Edexcel)', 'awarding_body', 'Not Inspected', '["National"]', '["in_person", "blended"]', false, 'standard',
'https://qualifications.pearson.com', 'Major awarding body offering BTEC qualifications in health and social care, widely delivered through colleges.', ''),

('University of Birmingham', 'university', 'Not Inspected', '["West Midlands"]', '["in_person", "blended", "apprenticeship"]', false, 'premium',
'https://www.birmingham.ac.uk', 'Leading university offering BSc and MSc programmes in nursing, physiotherapy, and social work.', ''),

('Health Education England (HEE)', 'nhs_trust', 'Not Inspected', '["National"]', '["online", "blended", "apprenticeship"]', false, 'standard',
'https://www.hee.nhs.uk', 'The national body responsible for NHS workforce education and training, managing apprenticeship programmes.', ''),

('FutureLearn', 'private_training', 'Not Inspected', '["National"]', '["online"]', false, 'standard',
'https://www.futurelearn.com', 'Online learning platform partnering with UK universities to offer healthcare short courses and microcredentials.', ''),

('Manchester Metropolitan University', 'university', 'Not Inspected', '["North West"]', '["in_person", "blended", "apprenticeship"]', false, 'standard',
'https://www.mmu.ac.uk', 'University offering nursing, social work, and allied health programmes with strong NHS trust partnerships.', ''),

('Access to Music and Healthcare (various FE colleges)', 'college', 'Good', '["National"]', '["in_person", "blended"]', false, 'standard',
'https://www.accesstohe.ac.uk', 'FE colleges across the UK delivering Access to Higher Education diplomas for mature learners entering healthcare.', '');


-- COURSES (50 courses across all pillars with funding tags)

-- Get provider IDs for reference (using subqueries)
-- Adult Social Care Courses
INSERT INTO courses (course_title, provider_id, qualification_level, awarding_body, funding_tags, cost_gbp, duration_weeks, delivery_mode, course_url, description, intake_months) VALUES

('Care Certificate', (SELECT id FROM course_providers WHERE provider_name = 'Skills for Care Endorsed Providers' LIMIT 1), 'Entry', 'Skills for Care', '["LDSS", "free_courses"]', NULL, 12, 'blended',
'https://www.skillsforcare.org.uk/care-certificate', 'The Care Certificate is the industry-standard induction for new health and social care workers. It covers 15 standards of care and is typically completed within 12 weeks of starting employment.', '[1,2,3,4,5,6,7,8,9,10,11,12]'),

('Level 2 Diploma in Care', (SELECT id FROM course_providers WHERE provider_name = 'City & Guilds / NCFE CACHE' LIMIT 1), 'L2', 'NCFE CACHE', '["LDSS", "free_courses", "apprenticeship"]', 1200.00, 40, 'blended',
'https://www.cache.org.uk', 'The Level 2 Diploma in Care is the core qualification for care workers in England. It covers duty of care, communication, person-centred care, and safeguarding.', '[1,4,9]'),

('Level 3 Diploma in Adult Care', (SELECT id FROM course_providers WHERE provider_name = 'City & Guilds / NCFE CACHE' LIMIT 1), 'L3', 'NCFE CACHE', '["LDSS", "apprenticeship", "advanced_learner_loan"]', 2500.00, 52, 'blended',
'https://www.cache.org.uk', 'The Level 3 Diploma in Adult Care is required for senior care worker roles and is a prerequisite for progressing to management positions. Covers leadership, assessment, and complex care.', '[1,4,9]'),

('Level 5 Diploma in Leadership for Health and Social Care', (SELECT id FROM course_providers WHERE provider_name = 'City & Guilds / NCFE CACHE' LIMIT 1), 'L5', 'NCFE CACHE', '["LDSS", "apprenticeship", "advanced_learner_loan"]', 3500.00, 78, 'blended',
'https://www.cache.org.uk', 'The Level 5 Diploma is the gold-standard qualification for Registered Managers. It covers governance, resource management, safeguarding leadership, and CQC compliance.', '[1,4,9]'),

('Level 2 Certificate in Understanding the Safe Handling of Medication', (SELECT id FROM course_providers WHERE provider_name = 'Skills for Care Endorsed Providers' LIMIT 1), 'L2', 'NCFE CACHE', '["LDSS", "free_courses"]', NULL, 4, 'online',
'https://www.skillsforcare.org.uk', 'Essential qualification for care workers responsible for medication administration. Covers legislation, storage, administration routes, and record keeping.', '[1,2,3,4,5,6,7,8,9,10,11,12]'),

('Level 2 Certificate in Dementia Care', (SELECT id FROM course_providers WHERE provider_name = 'Skills for Care Endorsed Providers' LIMIT 1), 'L2', 'NCFE CACHE', '["LDSS", "free_courses"]', NULL, 6, 'online',
'https://www.skillsforcare.org.uk', 'Specialist qualification covering dementia awareness, person-centred approaches, communication, and supporting behaviour that challenges. Highly relevant for care home staff.', '[1,2,3,4,5,6,7,8,9,10,11,12]'),

('Level 3 Certificate in Preparing to Work in Adult Social Care', (SELECT id FROM course_providers WHERE provider_name = 'City & Guilds / NCFE CACHE' LIMIT 1), 'L3', 'City & Guilds', '["free_courses", "advanced_learner_loan"]', 800.00, 16, 'online',
'https://www.cityandguilds.com', 'An introductory Level 3 qualification for those looking to enter or progress in social care. Covers legislation, safeguarding, and person-centred approaches.', '[1,4,9]'),

('Adult Care Worker Apprenticeship (Level 2)', (SELECT id FROM course_providers WHERE provider_name = 'Skills for Care Endorsed Providers' LIMIT 1), 'L2', 'Skills for Care', '["apprenticeship"]', NULL, 52, 'apprenticeship',
'https://www.skillsforcare.org.uk', 'A 12-month earn-while-you-learn apprenticeship covering all aspects of the care worker role. Includes the Care Certificate and Level 2 Diploma.', '[1,4,9]'),

('Lead Adult Care Worker Apprenticeship (Level 3)', (SELECT id FROM course_providers WHERE provider_name = 'Skills for Care Endorsed Providers' LIMIT 1), 'L3', 'Skills for Care', '["apprenticeship"]', NULL, 78, 'apprenticeship',
'https://www.skillsforcare.org.uk', 'An 18-month apprenticeship for senior care workers covering leadership, supervision, and complex care delivery.', '[1,4,9]'),

('Leader in Adult Care Apprenticeship (Level 5)', (SELECT id FROM course_providers WHERE provider_name = 'Skills for Care Endorsed Providers' LIMIT 1), 'L5', 'Skills for Care', '["apprenticeship"]', NULL, 104, 'apprenticeship',
'https://www.skillsforcare.org.uk', 'A 24-month apprenticeship for aspiring Registered Managers covering governance, resource management, quality assurance, and CQC compliance.', '[1,9]'),

-- Nursing & Midwifery Courses
('Access to Higher Education Diploma (Nursing)', (SELECT id FROM course_providers WHERE provider_name = 'Access to Music and Healthcare (various FE colleges)' LIMIT 1), 'L3', 'QAA', '["advanced_learner_loan", "free_courses"]', 3384.00, 40, 'in_person',
'https://www.accesstohe.ac.uk', 'A one-year intensive course designed for mature learners who want to progress to a nursing degree. Covers biology, psychology, and sociology at Level 3.', '[9]'),

('BSc (Hons) Nursing (Adult)', (SELECT id FROM course_providers WHERE provider_name = 'University of Leeds' LIMIT 1), 'HE_UG', 'University of Leeds', '["LSF"]', 9250.00, 156, 'in_person',
'https://www.leeds.ac.uk/nursing', 'A 3-year full-time degree programme leading to NMC registration as an Adult Nurse. Includes 2,300 hours of clinical practice across NHS settings.', '[9]'),

('BSc (Hons) Nursing (Adult) - via Open University', (SELECT id FROM course_providers WHERE provider_name = 'The Open University' LIMIT 1), 'HE_UG', 'The Open University', '["LSF"]', 9250.00, 208, 'distance_learning',
'https://www.open.ac.uk/nursing', 'A flexible part-time nursing degree (4 years) delivered through distance learning with local practice placements. Ideal for those who cannot attend full-time.', '[2, 10]'),

('Registered Nurse Degree Apprenticeship', (SELECT id FROM course_providers WHERE provider_name = 'University of Birmingham' LIMIT 1), 'HE_UG', 'University of Birmingham', '["apprenticeship", "LSF"]', NULL, 208, 'apprenticeship',
'https://www.birmingham.ac.uk', 'A 4-year degree apprenticeship combining academic study with employment as a trainee nurse. Fully funded by the Apprenticeship Levy. Leads to NMC registration.', '[9]'),

('Trainee Nursing Associate Apprenticeship', (SELECT id FROM course_providers WHERE provider_name = 'Health Education England (HEE)' LIMIT 1), 'L5', 'HEE', '["apprenticeship"]', NULL, 104, 'apprenticeship',
'https://www.hee.nhs.uk', 'A 2-year foundation degree apprenticeship for HCSWs to qualify as Nursing Associates. Combines work-based learning with academic study. Leads to NMC registration.', '[1, 9]'),

('Nursing Associate to Registered Nurse Top-Up', (SELECT id FROM course_providers WHERE provider_name = 'The Open University' LIMIT 1), 'HE_UG', 'The Open University', '["LSF", "apprenticeship"]', 9250.00, 104, 'blended',
'https://www.open.ac.uk', 'A 2-year top-up programme for qualified Nursing Associates to gain BSc (Hons) Nursing and NMC registration as a Registered Nurse.', '[2, 9]'),

('BSc (Hons) Midwifery', (SELECT id FROM course_providers WHERE provider_name = 'University of Leeds' LIMIT 1), 'HE_UG', 'University of Leeds', '["LSF"]', 9250.00, 156, 'in_person',
'https://www.leeds.ac.uk/midwifery', 'A 3-year full-time programme leading to NMC registration as a Midwife. Includes extensive clinical placements in hospital and community settings.', '[9]'),

('MSc Advanced Clinical Practice', (SELECT id FROM course_providers WHERE provider_name = 'University of Birmingham' LIMIT 1), 'HE_PG', 'University of Birmingham', '["nhs_workforce_development"]', 8500.00, 104, 'blended',
'https://www.birmingham.ac.uk', 'A 2-year part-time masters programme for experienced nurses and AHPs seeking Advanced Clinical Practitioner status. Covers all four pillars of ACP.', '[9]'),

('Return to Practice (Nursing)', (SELECT id FROM course_providers WHERE provider_name = 'The Open University' LIMIT 1), 'HE_UG', 'The Open University', '["LSF", "nhs_workforce_development"]', 1500.00, 24, 'blended',
'https://www.open.ac.uk', 'For nurses whose NMC registration has lapsed. This programme enables return to the register through supervised practice and academic study.', '[1, 4, 9]'),

('Non-Medical Prescribing (V300)', (SELECT id FROM course_providers WHERE provider_name = 'Manchester Metropolitan University' LIMIT 1), 'L7', 'Manchester Metropolitan University', '["nhs_workforce_development"]', 2200.00, 26, 'blended',
'https://www.mmu.ac.uk', 'A university-level module enabling registered nurses and AHPs to become independent prescribers. Essential for advanced practice roles.', '[1, 9]'),

-- Clinical Support Courses
('Healthcare Support Worker Induction Programme', (SELECT id FROM course_providers WHERE provider_name = 'NHS England Learning Hub' LIMIT 1), 'Entry', 'NHS England', '["free_courses"]', NULL, 12, 'blended',
'https://learninghub.nhs.uk', 'Comprehensive induction for new NHS Healthcare Support Workers. Covers the Care Certificate standards plus NHS-specific mandatory training.', '[1,2,3,4,5,6,7,8,9,10,11,12]'),

('Level 3 Diploma in Healthcare Support', (SELECT id FROM course_providers WHERE provider_name = 'City & Guilds / NCFE CACHE' LIMIT 1), 'L3', 'City & Guilds', '["apprenticeship", "advanced_learner_loan"]', 2000.00, 52, 'blended',
'https://www.cityandguilds.com', 'Qualification for NHS Band 3 roles. Covers clinical observations, specimen collection, and supporting registered practitioners.', '[1, 4, 9]'),

('Phlebotomy Training Certificate', (SELECT id FROM course_providers WHERE provider_name = 'NHS England Learning Hub' LIMIT 1), 'L3', 'NHS England', '["nhs_workforce_development"]', 350.00, 2, 'in_person',
'https://learninghub.nhs.uk', 'Practical phlebotomy training covering venepuncture technique, patient safety, infection control, and sample handling. Includes supervised practice sessions.', '[1,3,5,7,9,11]'),

('Senior Healthcare Support Worker Apprenticeship (Level 3)', (SELECT id FROM course_providers WHERE provider_name = 'Health Education England (HEE)' LIMIT 1), 'L3', 'HEE', '["apprenticeship"]', NULL, 78, 'apprenticeship',
'https://www.hee.nhs.uk', 'An 18-month apprenticeship for Band 2 HCSWs progressing to Band 3. Covers extended clinical skills, team leadership, and patient assessment.', '[1, 4, 9]'),

('Foundation Degree in Health and Social Care (Assistant Practitioner)', (SELECT id FROM course_providers WHERE provider_name = 'The Open University' LIMIT 1), 'L5', 'The Open University', '["apprenticeship", "advanced_learner_loan"]', 6750.00, 104, 'distance_learning',
'https://www.open.ac.uk', 'A 2-year foundation degree for Band 3 staff progressing to Band 4 Assistant Practitioner roles. Covers evidence-based practice, clinical reasoning, and leadership.', '[2, 10]'),

('Assistant Practitioner Apprenticeship (Level 5)', (SELECT id FROM course_providers WHERE provider_name = 'Health Education England (HEE)' LIMIT 1), 'L5', 'HEE', '["apprenticeship"]', NULL, 104, 'apprenticeship',
'https://www.hee.nhs.uk', 'A 2-year apprenticeship for NHS staff progressing to Band 4. Combines university study with work-based learning. Includes Foundation Degree.', '[1, 9]'),

('ECG Recording and Interpretation', (SELECT id FROM course_providers WHERE provider_name = 'NHS England Learning Hub' LIMIT 1), 'L3', 'NHS England', '["nhs_workforce_development", "free_courses"]', NULL, 1, 'online',
'https://learninghub.nhs.uk', 'Short course covering 12-lead ECG recording technique, basic rhythm interpretation, and when to escalate findings. Essential for Band 3-4 clinical staff.', '[1,2,3,4,5,6,7,8,9,10,11,12]'),

('Maternity Support Worker Training Programme', (SELECT id FROM course_providers WHERE provider_name = 'Health Education England (HEE)' LIMIT 1), 'L3', 'HEE', '["apprenticeship", "nhs_workforce_development"]', NULL, 52, 'blended',
'https://www.hee.nhs.uk', 'Specialist training for maternity support workers covering antenatal, intrapartum, and postnatal care support. Includes supervised clinical practice.', '[1, 9]'),

('Wound Care Management Certificate', (SELECT id FROM course_providers WHERE provider_name = 'FutureLearn' LIMIT 1), 'L3', 'Various', '["free_courses", "nhs_workforce_development"]', NULL, 4, 'online',
'https://www.futurelearn.com', 'Online course covering wound assessment, dressing selection, and management of acute and chronic wounds. Suitable for Band 3+ clinical staff.', '[1,2,3,4,5,6,7,8,9,10,11,12]'),

('Venepuncture and Cannulation Skills', (SELECT id FROM course_providers WHERE provider_name = 'NHS England Learning Hub' LIMIT 1), 'L3', 'NHS England', '["nhs_workforce_development"]', 250.00, 1, 'in_person',
'https://learninghub.nhs.uk', 'Practical skills course for IV cannulation and venepuncture. Includes theory, simulation, and supervised practice. For Band 3+ clinical staff.', '[1,3,5,7,9,11]'),

-- Allied Health Courses
('BSc (Hons) Occupational Therapy', (SELECT id FROM course_providers WHERE provider_name = 'University of Birmingham' LIMIT 1), 'HE_UG', 'University of Birmingham', '["LSF"]', 9250.00, 156, 'in_person',
'https://www.birmingham.ac.uk', 'A 3-year full-time degree leading to HCPC registration as an Occupational Therapist. Includes 1,000 hours of clinical placement.', '[9]'),

('Occupational Therapy Degree Apprenticeship', (SELECT id FROM course_providers WHERE provider_name = 'Manchester Metropolitan University' LIMIT 1), 'HE_UG', 'Manchester Metropolitan University', '["apprenticeship"]', NULL, 208, 'apprenticeship',
'https://www.mmu.ac.uk', 'A 4-year degree apprenticeship combining employment with academic study to qualify as an HCPC-registered Occupational Therapist.', '[9]'),

('BSc (Hons) Physiotherapy', (SELECT id FROM course_providers WHERE provider_name = 'University of Leeds' LIMIT 1), 'HE_UG', 'University of Leeds', '["LSF"]', 9250.00, 156, 'in_person',
'https://www.leeds.ac.uk', 'A 3-year full-time degree leading to HCPC registration as a Physiotherapist. Highly competitive with extensive clinical placements.', '[9]'),

('Physiotherapy Degree Apprenticeship', (SELECT id FROM course_providers WHERE provider_name = 'University of Birmingham' LIMIT 1), 'HE_UG', 'University of Birmingham', '["apprenticeship"]', NULL, 208, 'apprenticeship',
'https://www.birmingham.ac.uk', 'A 4-year degree apprenticeship for physiotherapy support staff progressing to qualified Physiotherapist. Fully funded via Apprenticeship Levy.', '[9]'),

('BSc (Hons) Diagnostic Radiography', (SELECT id FROM course_providers WHERE provider_name = 'University of Leeds' LIMIT 1), 'HE_UG', 'University of Leeds', '["LSF"]', 9250.00, 156, 'in_person',
'https://www.leeds.ac.uk', 'A 3-year full-time degree leading to HCPC registration as a Diagnostic Radiographer. Covers X-ray, CT, MRI, and ultrasound imaging.', '[9]'),

('BA (Hons) Social Work', (SELECT id FROM course_providers WHERE provider_name = 'University of Birmingham' LIMIT 1), 'HE_UG', 'University of Birmingham', '["LSF"]', 9250.00, 156, 'in_person',
'https://www.birmingham.ac.uk', 'A 3-year degree programme leading to registration with Social Work England. Includes 170 days of practice placement across social care settings.', '[9]'),

('Social Worker Degree Apprenticeship', (SELECT id FROM course_providers WHERE provider_name = 'Manchester Metropolitan University' LIMIT 1), 'HE_UG', 'Manchester Metropolitan University', '["apprenticeship"]', NULL, 156, 'apprenticeship',
'https://www.mmu.ac.uk', 'A 3-year degree apprenticeship combining employment in a social care setting with academic study. Leads to Social Work England registration.', '[9]'),

('Step Up to Social Work Programme', (SELECT id FROM course_providers WHERE provider_name = 'University of Birmingham' LIMIT 1), 'HE_PG', 'University of Birmingham', '["nhs_workforce_development"]', NULL, 56, 'in_person',
'https://www.birmingham.ac.uk', 'An intensive 14-month postgraduate programme for career changers entering social work. Fully funded by the Department for Education.', '[1]'),

('Level 2 Certificate in Mental Health Awareness', (SELECT id FROM course_providers WHERE provider_name = 'FutureLearn' LIMIT 1), 'L2', 'NCFE', '["free_courses", "LDSS"]', NULL, 4, 'online',
'https://www.futurelearn.com', 'An introductory course covering mental health conditions, stigma, recovery approaches, and signposting to support services.', '[1,2,3,4,5,6,7,8,9,10,11,12]'),

('Level 3 Certificate in Mental Health First Aid', (SELECT id FROM course_providers WHERE provider_name = 'Skills for Care Endorsed Providers' LIMIT 1), 'L3', 'MHFA England', '["LDSS", "free_courses", "advanced_learner_loan"]', 300.00, 1, 'in_person',
'https://mhfaengland.org', 'Two-day intensive course teaching how to identify, understand, and respond to signs of mental health issues. Nationally recognised certification.', '[1,2,3,4,5,6,7,8,9,10,11,12]'),

('Introduction to Safeguarding Adults (Level 2)', (SELECT id FROM course_providers WHERE provider_name = 'FutureLearn' LIMIT 1), 'L2', 'Various', '["free_courses", "LDSS"]', NULL, 2, 'online',
'https://www.futurelearn.com', 'Essential safeguarding knowledge for all health and social care workers. Covers the Care Act 2014, types of abuse, reporting procedures, and Making Safeguarding Personal.', '[1,2,3,4,5,6,7,8,9,10,11,12]'),

('Level 2 Certificate in Falls Prevention', (SELECT id FROM course_providers WHERE provider_name = 'FutureLearn' LIMIT 1), 'L2', 'Various', '["free_courses", "LDSS"]', NULL, 3, 'online',
'https://www.futurelearn.com', 'Covers risk factors for falls, assessment tools, environmental modifications, and exercise interventions. Essential for care staff working with older adults.', '[1,2,3,4,5,6,7,8,9,10,11,12]'),

('Level 2 End of Life Care Certificate', (SELECT id FROM course_providers WHERE provider_name = 'Skills for Care Endorsed Providers' LIMIT 1), 'L2', 'NCFE CACHE', '["LDSS", "free_courses"]', NULL, 6, 'online',
'https://www.skillsforcare.org.uk', 'Covers palliative care approaches, supporting families, advance care planning, and bereavement support. Suitable for all care settings.', '[1,2,3,4,5,6,7,8,9,10,11,12]'),

('Infection Prevention and Control (Level 2)', (SELECT id FROM course_providers WHERE provider_name = 'NHS England Learning Hub' LIMIT 1), 'L2', 'NHS England', '["free_courses", "LDSS"]', NULL, 1, 'online',
'https://learninghub.nhs.uk', 'Mandatory training covering hand hygiene, PPE, standard precautions, and outbreak management. Required annually for all clinical staff.', '[1,2,3,4,5,6,7,8,9,10,11,12]'),

('Moving and Handling (People) Certificate', (SELECT id FROM course_providers WHERE provider_name = 'Skills for Care Endorsed Providers' LIMIT 1), 'L2', 'Various', '["LDSS", "free_courses"]', NULL, 1, 'in_person',
'https://www.skillsforcare.org.uk', 'Practical training in safe moving and handling of people. Covers risk assessment, equipment use, and ergonomic principles. Required for all care staff.', '[1,2,3,4,5,6,7,8,9,10,11,12]'),

('Level 3 Award in Education and Training (AET)', (SELECT id FROM course_providers WHERE provider_name = 'City & Guilds / NCFE CACHE' LIMIT 1), 'L3', 'City & Guilds', '["advanced_learner_loan"]', 450.00, 6, 'blended',
'https://www.cityandguilds.com', 'Essential qualification for those who want to teach or train in the health and social care sector. Covers planning, delivering, and assessing learning.', '[1,4,9]'),

('CQC Inspection Preparation Workshop', (SELECT id FROM course_providers WHERE provider_name = 'Kaplan Financial' LIMIT 1), 'L3', 'Kaplan', '["LDSS"]', 299.00, 1, 'online',
'https://www.kaplan.co.uk', 'Intensive workshop preparing Registered Managers and senior staff for CQC inspections. Covers the 5 key questions, evidence gathering, and quality statements.', '[1,3,5,7,9,11]'),

('COSHH Awareness Training', (SELECT id FROM course_providers WHERE provider_name = 'NHS England Learning Hub' LIMIT 1), 'L2', 'NHS England', '["free_courses"]', NULL, 1, 'online',
'https://learninghub.nhs.uk', 'Control of Substances Hazardous to Health training covering risk assessment, safe handling, storage, and disposal of hazardous substances in care settings.', '[1,2,3,4,5,6,7,8,9,10,11,12]'),

('Access to Higher Education Diploma (Health Professions)', (SELECT id FROM course_providers WHERE provider_name = 'Access to Music and Healthcare (various FE colleges)' LIMIT 1), 'L3', 'QAA', '["advanced_learner_loan", "free_courses"]', 3384.00, 40, 'in_person',
'https://www.accesstohe.ac.uk', 'For mature learners wanting to enter allied health degrees (OT, physiotherapy, radiography). Covers biology, psychology, and sociology at Level 3.', '[9]'),

('Frontline Social Work Programme', (SELECT id FROM course_providers WHERE provider_name = 'Manchester Metropolitan University' LIMIT 1), 'HE_PG', 'Frontline', '["nhs_workforce_development"]', NULL, 100, 'blended',
'https://thefrontline.org.uk', 'Intensive graduate programme for aspiring children''s social workers. 2 years combining academic study with supervised practice in local authority teams.', '[9]'),

('Radiography Assistant Development Programme', (SELECT id FROM course_providers WHERE provider_name = 'Health Education England (HEE)' LIMIT 1), 'L3', 'HEE', '["apprenticeship", "nhs_workforce_development"]', NULL, 52, 'blended',
'https://www.hee.nhs.uk', 'A structured development programme for Band 2-3 staff working in imaging departments. Covers basic imaging principles, radiation safety, and patient care.', '[1, 9]'),

('Level 4 Certificate in Principles of Leadership and Management for Adult Care', (SELECT id FROM course_providers WHERE provider_name = 'City & Guilds / NCFE CACHE' LIMIT 1), 'L4', 'NCFE CACHE', '["LDSS", "advanced_learner_loan"]', 1800.00, 26, 'blended',
'https://www.cache.org.uk', 'Stepping stone qualification between Level 3 and Level 5 for aspiring managers. Covers team leadership, supervision, and quality assurance.', '[1, 4, 9]');

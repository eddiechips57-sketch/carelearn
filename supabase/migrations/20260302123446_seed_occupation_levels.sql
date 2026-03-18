/*
  # Seed Occupation Levels

  Populates the occupation_levels table with roles across all 4 workforce pillars:
  1. Adult Social Care - Care Workers, Senior Care Workers, Registered Managers, etc.
  2. Nursing & Midwifery - Nursing Associates, Registered Nurses, Midwives, etc.
  3. Clinical Support (NHS Bands 2-4) - HCSWs, Phlebotomists, etc.
  4. Allied Health - Radiographers, OTs, Physiotherapists, etc.

  20 roles total covering the core UK health & social care workforce.
*/

INSERT INTO occupation_levels (occupation_title, pillar, nhs_band, agenda_for_change, skills_for_care_category, regulatory_body, minimum_qualification, typical_salary_range_gbp, job_vacancy_index, slug, description, responsibilities) VALUES

-- ADULT SOCIAL CARE PILLAR
('Care Worker', 'adult_social_care', NULL, false, 'Entry Level', 'none', 'Care Certificate', '£20,500 - £22,000', 850, 'care-worker',
'Care Workers provide essential day-to-day support to people in residential care homes, domiciliary settings, or supported living environments. This is the most common entry point into the social care sector.',
ARRAY['Assisting with personal care (washing, dressing, toileting)', 'Supporting with medication administration', 'Helping with meal preparation and feeding', 'Maintaining accurate care records', 'Supporting social activities and wellbeing']),

('Senior Care Worker', 'adult_social_care', NULL, false, 'Level 2-3', 'none', 'Level 2 Diploma in Care', '£22,000 - £25,000', 420, 'senior-care-worker',
'Senior Care Workers take on supervisory responsibilities, mentoring junior staff and often leading shifts. They play a crucial role in maintaining care standards and supporting the management team.',
ARRAY['Supervising and mentoring care staff', 'Leading shifts and delegating tasks', 'Conducting risk assessments', 'Supporting care plan development', 'Liaising with families and healthcare professionals']),

('Registered Manager', 'adult_social_care', NULL, false, 'Level 5+', 'none', 'Level 5 Diploma in Leadership for Health and Social Care', '£32,000 - £45,000', 310, 'registered-manager',
'Registered Managers are responsible for the day-to-day running of a care service and are the named individual registered with CQC. This is a senior leadership role requiring both management skills and deep care knowledge.',
ARRAY['Overall responsibility for service quality and safety', 'CQC registration and compliance', 'Staff recruitment, training, and performance management', 'Budget management and resource allocation', 'Family and stakeholder engagement']),

('Personal Assistant (Social Care)', 'adult_social_care', NULL, false, 'Entry Level', 'none', 'No formal requirement (Care Certificate recommended)', '£20,000 - £24,000', 180, 'personal-assistant-social-care',
'Personal Assistants (PAs) are employed directly by individuals who receive Direct Payments to arrange their own care. PAs provide tailored, person-centred support in the community.',
ARRAY['Providing personal care as directed by the employer', 'Supporting with daily living activities', 'Accompanying to appointments and social activities', 'Administering medication where trained', 'Maintaining confidentiality and professional boundaries']),

('Domiciliary Care Worker', 'adult_social_care', NULL, false, 'Entry Level', 'none', 'Care Certificate', '£20,500 - £23,000', 620, 'domiciliary-care-worker',
'Domiciliary Care Workers visit people in their own homes to provide care and support. This role requires independence, good time management, and the ability to work alone in community settings.',
ARRAY['Visiting clients in their homes on scheduled rounds', 'Personal care support', 'Meal preparation and light housekeeping', 'Medication prompting and administration', 'Recording and reporting changes in condition']),

-- NURSING & MIDWIFERY PILLAR
('Nursing Associate', 'nursing_midwifery', 'Band 4', true, NULL, 'NMC', 'Foundation Degree in Nursing Associate Practice', '£26,530 - £29,114', 280, 'nursing-associate',
'Nursing Associates bridge the gap between Healthcare Support Workers and Registered Nurses. This is a regulated role registered with the NMC, introduced in 2019 to address workforce shortages.',
ARRAY['Delivering hands-on nursing care under supervision', 'Monitoring patient observations and escalating concerns', 'Administering medications within scope of practice', 'Supporting patient education and health promotion', 'Working across hospital, community, and primary care settings']),

('Registered Nurse (Adult)', 'nursing_midwifery', 'Band 5', true, NULL, 'NMC', 'BSc (Hons) Nursing or Nursing Degree Apprenticeship', '£29,970 - £36,483', 750, 'registered-nurse-adult',
'Registered Nurses assess, plan, deliver, and evaluate nursing care for adult patients. This is the most in-demand clinical role in the NHS, requiring NMC registration and a degree-level qualification.',
ARRAY['Assessing patient needs and developing care plans', 'Administering medications and treatments', 'Leading and coordinating care teams', 'Patient education and discharge planning', 'Maintaining NMC registration through revalidation']),

('Midwife', 'nursing_midwifery', 'Band 5-6', true, NULL, 'NMC', 'BSc (Hons) Midwifery', '£29,970 - £44,962', 190, 'midwife',
'Midwives provide care and support to women and their families throughout pregnancy, labour, birth, and the postnatal period. This is an autonomous practitioner role regulated by the NMC.',
ARRAY['Providing antenatal care and screening', 'Supporting women during labour and birth', 'Postnatal care for mother and baby', 'Health promotion and parent education', 'Managing complications and making referrals']),

('Advanced Clinical Practitioner', 'nursing_midwifery', 'Band 8a', true, NULL, 'NMC', 'MSc Advanced Clinical Practice', '£53,755 - £60,504', 120, 'advanced-clinical-practitioner',
'Advanced Clinical Practitioners (ACPs) are experienced clinicians who have developed their skills to master level. They can assess, diagnose, treat, and discharge patients independently.',
ARRAY['Autonomous clinical decision-making', 'Requesting and interpreting diagnostic investigations', 'Independent prescribing', 'Leading service improvement and research', 'Mentoring and supervising junior clinicians']),

-- CLINICAL SUPPORT (NHS BANDS 2-4) PILLAR
('Healthcare Support Worker', 'clinical_support', 'Band 2', true, NULL, 'none', 'Care Certificate (within 12 weeks of starting)', '£23,615', 680, 'healthcare-support-worker',
'Healthcare Support Workers (HCSWs) work alongside qualified healthcare professionals in hospitals, clinics, and community settings. This is the most common entry point into NHS clinical work.',
ARRAY['Assisting patients with personal care and mobility', 'Taking and recording clinical observations', 'Preparing clinical areas and equipment', 'Supporting qualified staff during procedures', 'Communicating with patients and families']),

('Maternity Support Worker', 'clinical_support', 'Band 3', true, NULL, 'none', 'Level 2/3 Maternity Support qualification', '£24,071 - £25,674', 95, 'maternity-support-worker',
'Maternity Support Workers assist midwives in providing care to women and babies during pregnancy, labour, and the postnatal period within NHS maternity services.',
ARRAY['Supporting midwives during clinical care', 'Assisting with infant feeding support', 'Taking maternal and newborn observations', 'Providing emotional support to families', 'Maintaining clean and safe clinical environments']),

('Phlebotomist', 'clinical_support', 'Band 3', true, NULL, 'none', 'Phlebotomy Certificate (Level 3)', '£24,071 - £25,674', 150, 'phlebotomist',
'Phlebotomists are trained specialists who collect blood samples from patients for laboratory testing. They work across hospitals, GP surgeries, and community clinics.',
ARRAY['Venepuncture and capillary blood collection', 'Patient identification and sample labelling', 'Managing anxious or needle-phobic patients', 'Following infection control protocols', 'Processing and transporting samples to laboratories']),

('Assistant Practitioner', 'clinical_support', 'Band 4', true, NULL, 'none', 'Foundation Degree or Level 5 qualification', '£26,530 - £29,114', 200, 'assistant-practitioner',
'Assistant Practitioners work at a higher level than HCSWs, delivering protocol-based clinical care under the supervision of registered professionals. This role is a stepping stone to degree-level clinical careers.',
ARRAY['Delivering protocol-based clinical care', 'Undertaking extended clinical skills (e.g., ECGs, wound care)', 'Supporting patient assessment and care planning', 'Supervising Band 2-3 staff', 'Contributing to service development']),

('Theatre Support Worker', 'clinical_support', 'Band 2-3', true, NULL, 'none', 'Care Certificate + Theatre-specific training', '£23,615 - £25,674', 85, 'theatre-support-worker',
'Theatre Support Workers assist the surgical team before, during, and after operations. They ensure operating theatres are prepared, clean, and stocked with the correct equipment.',
ARRAY['Preparing operating theatres and surgical instruments', 'Assisting with patient positioning and transfer', 'Maintaining sterile environments', 'Counting instruments and swabs', 'Supporting patient recovery in post-anaesthetic care']),

-- ALLIED HEALTH & SPECIALIST SUPPORT PILLAR
('Occupational Therapist', 'allied_health', 'Band 5-6', true, NULL, 'HCPC', 'BSc (Hons) Occupational Therapy', '£29,970 - £44,962', 220, 'occupational-therapist',
'Occupational Therapists help people of all ages overcome challenges with everyday activities caused by illness, disability, or ageing. They work across NHS, social care, and private sectors.',
ARRAY['Assessing functional ability and daily living skills', 'Prescribing equipment and adaptations', 'Developing therapeutic activity programmes', 'Supporting return to work or education', 'Working with multidisciplinary teams']),

('Physiotherapist', 'allied_health', 'Band 5-6', true, NULL, 'HCPC', 'BSc (Hons) Physiotherapy', '£29,970 - £44,962', 250, 'physiotherapist',
'Physiotherapists help people affected by injury, illness, or disability through movement, exercise, manual therapy, and education. They are autonomous practitioners registered with the HCPC.',
ARRAY['Assessing movement and physical function', 'Developing and implementing treatment plans', 'Manual therapy and exercise prescription', 'Post-surgical rehabilitation', 'Health promotion and injury prevention']),

('Mental Health Support Worker', 'allied_health', 'Band 3-4', true, NULL, 'none', 'Level 2/3 Mental Health qualification', '£24,071 - £29,114', 340, 'mental-health-support-worker',
'Mental Health Support Workers provide practical and emotional support to people experiencing mental health challenges in community, inpatient, and crisis team settings.',
ARRAY['Providing one-to-one support and therapeutic activities', 'Monitoring mental health and reporting changes', 'Supporting medication compliance', 'Crisis intervention and de-escalation', 'Supporting access to community services']),

('Radiographer (Diagnostic)', 'allied_health', 'Band 5-6', true, NULL, 'HCPC', 'BSc (Hons) Diagnostic Radiography', '£29,970 - £44,962', 130, 'diagnostic-radiographer',
'Diagnostic Radiographers produce medical images (X-rays, CT scans, MRI, ultrasound) to help diagnose illness and injury. They are autonomous practitioners registered with the HCPC.',
ARRAY['Producing diagnostic medical images', 'Operating complex imaging equipment', 'Assessing image quality and clinical relevance', 'Radiation protection and dose management', 'Communicating with patients and multidisciplinary teams']),

('Speech and Language Therapy Assistant', 'allied_health', 'Band 3-4', true, NULL, 'none', 'Level 3 qualification in relevant area', '£24,071 - £29,114', 75, 'speech-language-therapy-assistant',
'Speech and Language Therapy Assistants work under the supervision of qualified Speech and Language Therapists to deliver therapy programmes for people with communication or swallowing difficulties.',
ARRAY['Delivering therapy programmes under supervision', 'Preparing therapy materials and resources', 'Supporting group therapy sessions', 'Recording patient progress', 'Liaising with families and carers']),

('Social Worker', 'allied_health', NULL, false, NULL, 'SWE', 'BA (Hons) or MA Social Work', '£30,000 - £42,000', 380, 'social-worker',
'Social Workers protect vulnerable people, support families in crisis, and help individuals navigate complex life challenges. Registration with Social Work England is mandatory.',
ARRAY['Conducting assessments of need and risk', 'Developing and reviewing care and support plans', 'Safeguarding children and vulnerable adults', 'Court work and legal proceedings', 'Multi-agency collaboration and partnership working']);

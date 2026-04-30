/*
  # Seed Community Q&A and Blog Data

  Seeds 8 realistic answered Q&A pairs across all categories and 6 blog posts
  covering UK healthcare career topics. Helpful counts are set to look natural.
*/

-- Insert mock questions and capture their IDs for answers
WITH q1 AS (
  INSERT INTO community_questions (title, body, author_name, category, helpful_count, status)
  VALUES (
    'Can I get funding for my Level 3 Diploma in Adult Care?',
    'I am currently working as a care assistant and my employer has said they cannot fund my Level 3 Diploma. Are there any government schemes or grants I can apply for on my own?',
    'Priya M.',
    'funding',
    24,
    'answered'
  ) RETURNING id
),
q2 AS (
  INSERT INTO community_questions (title, body, author_name, category, helpful_count, status)
  VALUES (
    'How long does it typically take to progress from HCA to Registered Nurse?',
    'I have been working as a Healthcare Assistant for two years and I am considering the nursing degree apprenticeship route. Roughly how long is the full journey and what steps are involved?',
    'James T.',
    'career_advice',
    41,
    'answered'
  ) RETURNING id
),
q3 AS (
  INSERT INTO community_questions (title, body, author_name, category, helpful_count, status)
  VALUES (
    'Is the Care Certificate mandatory for all new care workers?',
    'I started a new job at a domiciliary care agency last month. My manager mentioned the Care Certificate but has not enrolled me yet. Is it a legal requirement and what happens if my employer does not provide it?',
    'Sarah K.',
    'qualifications',
    19,
    'answered'
  ) RETURNING id
),
q4 AS (
  INSERT INTO community_questions (title, body, author_name, category, helpful_count, status)
  VALUES (
    'What should I expect during a CQC inspection at my residential care home?',
    'We have just been notified that CQC will be visiting within the next few weeks. This is my first inspection as a registered manager. What are the key areas they focus on and how should I prepare my team?',
    'Mohammed A.',
    'cqc',
    33,
    'answered'
  ) RETURNING id
),
q5 AS (
  INSERT INTO community_questions (title, body, author_name, category, helpful_count, status)
  VALUES (
    'My employer is refusing to pay for mandatory training — is this allowed?',
    'I work at a nursing home and my employer expects us to complete moving and handling, fire safety and medication awareness training in our own time and at our own cost. Surely this cannot be right?',
    'Claire B.',
    'workplace',
    57,
    'answered'
  ) RETURNING id
),
q6 AS (
  INSERT INTO community_questions (title, body, author_name, category, helpful_count, status)
  VALUES (
    'What is the difference between a Nursing Associate and a Registered Nurse?',
    'I keep seeing job adverts for both roles and I am confused about the difference in responsibilities, pay and career progression. Could someone explain clearly?',
    'Fatima O.',
    'qualifications',
    28,
    'answered'
  ) RETURNING id
),
q7 AS (
  INSERT INTO community_questions (title, body, author_name, category, helpful_count, status)
  VALUES (
    'Can I apply for the Workforce Development Fund if I am self-employed?',
    'I provide personal care as a self-employed carer registered with a care agency. I want to complete my Level 2 Award in Health and Social Care but I am unsure whether I qualify for WDF funding.',
    'Daniel R.',
    'funding',
    15,
    'answered'
  ) RETURNING id
),
q8 AS (
  INSERT INTO community_questions (title, body, author_name, category, helpful_count, status)
  VALUES (
    'How do I handle a safeguarding concern if my manager is the person I am concerned about?',
    'I have witnessed what I believe is financial abuse of a resident by a senior staff member. I do not feel safe reporting it internally. What are my options and am I protected if I speak up?',
    'Anonymous',
    'workplace',
    62,
    'answered'
  ) RETURNING id
)
-- Insert answers for all questions
INSERT INTO community_answers (question_id, body, admin_name)
SELECT id,
'Great question — yes, there are several routes to funding your Level 3 Diploma even without employer support. The main options to explore are: (1) the Workforce Development Fund (WDF), administered by Skills for Care, which provides funding directly to employers but some organisations act as a conduit for self-funded learners — worth contacting Skills for Care directly; (2) the Adult Education Budget (AEB) if you are aged 19+ and earn below the threshold, which can cover up to 100% of course costs at a local college; (3) Advanced Learner Loans for learners aged 19+ at Level 3 and above, which are repaid like student loans once your income exceeds the threshold. Check the CareLearn Funding Hub for eligibility details and links to apply.',
'CareLearn Team'
FROM q1

UNION ALL

SELECT id,
'The nursing degree apprenticeship (NDA) typically takes 3 to 4 years to complete. Here is the general journey: First, confirm you meet the entry requirements — usually 5 GCSEs at grade C or above including English and Maths, or equivalent. Next, find an employer willing to sponsor you (your current NHS trust or care provider may already run the programme). You then study for a full nursing degree while working, with the degree fully funded through the Apprenticeship Levy. On completion you sit the NMC registration assessments and qualify as a Registered Nurse. Your two years of HCA experience is a real advantage and many universities count it towards entry criteria. Check the Role Library on CareLearn for the full HCA to Nurse pathway breakdown.',
'CareLearn Team'
FROM q2

UNION ALL

SELECT id,
'The Care Certificate is not a statutory legal requirement in the same way that some clinical qualifications are, but it is the recognised standard of induction for all new care workers in England who are new to the sector. The Care Quality Commission (CQC) expects providers to ensure new staff meet the 15 standards of the Care Certificate as part of their induction, and inspectors will ask for evidence. If your employer is not providing it, that is a concern you can raise with your manager, noting that CQC guidance expects it. If you receive no response, you can mention it during your CQC inspection or contact Skills for Care for guidance. In short — while it is not law, failing to provide it puts your employer at risk of a poorer CQC rating.',
'CareLearn Team'
FROM q3

UNION ALL

SELECT id,
'CQC inspections for residential care homes are assessed against five key questions: Is the service Safe? Effective? Caring? Responsive? Well-led? Inspectors will review care records, medication management, staffing levels and training records, and will speak directly with residents and staff. To prepare your team: hold a briefing session explaining what to expect and encouraging honest, confident responses; ensure care plans and risk assessments are up to date; check your medication administration records are complete; confirm that mandatory training records are current for all staff; and make sure safeguarding policies and the complaints log are accessible. Being calm, transparent and able to evidence good outcomes is far more effective than a last-minute paperwork sprint. Our CQC section in the Community Blog has a step-by-step inspection prep guide.',
'CareLearn Team'
FROM q4

UNION ALL

SELECT id,
'This is a common and serious issue. Under UK employment law, time spent on mandatory training that is required to do your job safely is considered working time and should be paid at your normal rate. Employers cannot lawfully require you to fund or complete mandatory training in your own unpaid time. The Health and Safety at Work Act 1974 places the duty on employers to provide adequate training. If your employer refuses to pay, you should: (1) raise a formal written grievance citing the Working Time Regulations and your employment contract; (2) contact ACAS for free, confidential advice (0300 123 1100); (3) if the issue persists, you may have grounds for an Employment Tribunal claim. Keep records of any instructions given to you in writing.',
'CareLearn Team'
FROM q5

UNION ALL

SELECT id,
'This is a very common point of confusion. A Nursing Associate (NA) is a relatively new role introduced in 2019, regulated by the NMC, and sits between a Healthcare Assistant and a Registered Nurse. NAs can administer medications, carry out clinical assessments and deliver care under the supervision of a Registered Nurse. They train via a two-year foundation degree or apprenticeship. A Registered Nurse (RN) holds a full nursing degree (three to four years), has independent clinical decision-making authority, can prescribe in some specialties, and takes on greater accountability for patient safety and care planning. Pay: NAs typically fall within NHS Band 4 (around £26,530–£29,114) while newly qualified RNs start at Band 5 (£28,407+). The NA route is a strong stepping stone — many NAs go on to top-up to a full RN qualification in as little as 18 months.',
'CareLearn Team'
FROM q6

UNION ALL

SELECT id,
'The Workforce Development Fund is administered through employers registered with Skills for Care, so technically self-employed carers are not directly eligible as individuals. However, if the agency you work with is a registered Skills for Care employer, they may be able to access WDF on your behalf — it is worth asking them directly. Alternatively, as a self-employed person earning below the income threshold, you may qualify for a fully funded course through the Adult Education Budget at your local college. The Level 2 Award in Health and Social Care is commonly offered as a free course for adults. Check the CareLearn Funding Hub and filter by "Free Courses" to find providers near you.',
'CareLearn Team'
FROM q7

UNION ALL

SELECT id,
'You are right to take this seriously, and you are fully protected under the Public Interest Disclosure Act 1998 (whistleblowing law) if you raise a genuine concern about abuse. You do not need to report internally first. Your options are: (1) Contact the Local Authority Safeguarding Adults team directly — they have a duty to investigate and can act independently of your employer; (2) Report to CQC via their website (cqc.org.uk/give-feedback-on-care) — they treat safeguarding concerns seriously and can inspect without notice; (3) Contact the police if you believe a crime has been committed. Document everything you have witnessed with dates, times and any evidence before reporting. You are legally protected from dismissal or detriment for making a protected disclosure in good faith. If you face any repercussions, contact ACAS immediately.',
'CareLearn Team'
FROM q8;

-- Blog Posts
INSERT INTO community_blog_posts (title, slug, body, excerpt, cover_image_url, category, author_name, read_time_minutes, is_published)
VALUES
(
  'What to Expect From a CQC Inspection in 2026',
  'what-to-expect-cqc-inspection-2026',
  '## The New Single Assessment Framework

CQC introduced its Single Assessment Framework (SAF) in late 2023, and by 2026 it is the standard across all care settings. Understanding how it works is essential for any registered manager preparing for an inspection.

## The Five Key Questions

CQC still evaluates services against the same five questions — Safe, Effective, Caring, Responsive, and Well-led — but the evidence categories beneath them have been updated. Inspectors now use Quality Statements to describe what good looks like in each area.

## What Inspectors Look For

**Safe:** Medication management, safeguarding procedures, risk assessments, infection control, staffing levels and safer recruitment records.

**Effective:** Staff training and competency records, supervision logs, care outcomes measured against resident goals.

**Caring:** Direct conversations with people using the service and their families. Inspectors will ask residents how they feel about the care they receive — prepare your team for this.

**Responsive:** Person-centred care plans, complaints records, response times to changes in need.

**Well-led:** Governance systems, quality audits, staff culture, how the service learns from incidents.

## Practical Preparation Tips

1. Run a mock inspection 4–6 weeks before you expect a visit
2. Ensure every staff member knows your safeguarding and whistleblowing procedures
3. Keep training matrices up to date and accessible
4. Review the last 3 months of incident and complaint records for patterns
5. Hold a brief staff huddle explaining what inspectors may ask them directly

## After the Inspection

CQC publishes inspection reports publicly on their website. A Good or Outstanding rating significantly affects your ability to attract residents and staff. If you receive a Requires Improvement rating, you will be given a timeframe to act — treat this as an improvement roadmap, not a punishment.',
  'CQC introduced its Single Assessment Framework across all care settings. Here is what registered managers need to know to prepare their teams and evidence good outcomes.',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
  'cqc',
  'CareLearn Team',
  7,
  true
),
(
  'Funding Your Care Career: The Complete 2026 Guide',
  'funding-care-career-2026-guide',
  '## Why Funding Matters More Than Ever

The cost of qualifications is one of the biggest barriers to progression in the care sector. The good news is that 2026 brings several routes to funded training — you just need to know where to look.

## The Adult Education Budget (AEB)

If you are 19 or over and earn below the income threshold (currently around £25,000 per year), you may qualify for fully funded or co-funded qualifications through the AEB. This covers a wide range of health and social care qualifications from Level 2 upwards. Delivered through local colleges and training providers, this is often the most accessible route for frontline care workers.

## Apprenticeship Levy Funding

Employers with a wage bill above £3 million pay into the Apprenticeship Levy each month. If your employer is eligible, this pot can fund your apprenticeship qualification — from a Level 2 Adult Social Care Certificate right up to a Nursing Degree Apprenticeship. If your employer is smaller, the government co-invests 95% of the cost.

## The Workforce Development Fund (WDF)

Administered by Skills for Care, the WDF provides funding to social care employers who invest in the qualifications and learning of their staff. Your employer applies on your behalf. The fund covers a wide range of qualifications — check Skills for Care''s website for the current approved list.

## Advanced Learner Loans

Available for learners aged 19+ studying at Level 3 to Level 6. These loans are repaid through the student loan system once your income exceeds the repayment threshold. Unlike commercial loans, they do not affect your credit rating during study.

## Bursaries for Nursing and Allied Health

Health Education England (now NHS England) offers bursaries for pre-registration nursing, midwifery and allied health programmes. These are means-tested but can provide significant support including a training grant of up to £5,000 per year.

## Using the CareLearn Funding Hub

The CareLearn Funding Hub lets you filter funding options by your current role, intended qualification and employment status. It is the fastest way to find what you are eligible for today.',
  'From the Adult Education Budget to Nursing Bursaries, this guide covers every major funding route available to care professionals in 2026.',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
  'funding',
  'CareLearn Team',
  8,
  true
),
(
  'From Care Assistant to Registered Manager: One Nurse''s Journey',
  'care-assistant-to-registered-manager-story',
  '## Starting at the Bottom — and Proud of It

When Alicia started her first care job at 19, she was handing out meals and helping residents get dressed. Ten years later, she manages a 48-bed residential care home in Birmingham rated Outstanding by CQC.

We sat down with Alicia to understand the path she took, the qualifications that made the difference, and the advice she would give her younger self.

## The Early Years

"I fell into care work honestly — I needed a job. But within six months I knew it was what I wanted to do. Seeing the difference you make to someone''s day, it stays with you."

Alicia completed her Care Certificate in her first three months and moved on to a Level 2 Diploma in Health and Social Care the following year, funded through the Adult Education Budget.

## Taking the Management Route

After five years as a senior carer, Alicia was encouraged by her manager to consider a management pathway. She completed a Level 5 Diploma in Leadership for Health and Social Care over 18 months whilst working full time.

"The Level 5 was hard. I had a toddler at home and I was working shifts. But my employer was supportive and Skills for Care funded the whole thing through WDF."

## Becoming a Registered Manager

Alicia registered with CQC as a manager in 2022. Her first inspection as RM came 18 months later.

"I was terrified. But we got Good across the board and then Outstanding at our next inspection. The key was building a team that genuinely cared and giving them the tools to do their jobs well."

## Her Advice

- Do not wait to be asked. Tell your manager you want to progress.
- Every qualification you do opens a door. None of it is wasted.
- The Level 5 is a game changer. Do not put it off.
- Find a mentor, even informally. I would not be where I am without mine.',
  'Alicia started handing out meals at 19. Now she manages an Outstanding-rated care home. She shares the qualifications, funding routes and lessons that shaped her decade-long journey.',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
  'career_advice',
  'CareLearn Team',
  6,
  true
),
(
  'The Nursing Associate Role Explained: Is It Right for You?',
  'nursing-associate-role-explained',
  '## What Is a Nursing Associate?

The Nursing Associate (NA) role was created in 2017 following recommendations from Health Education England. The first cohort qualified in 2019, and the role is now well established across NHS trusts, care homes and community settings.

NAs are registered with the Nursing and Midwifery Council (NMC) and bridge the gap between healthcare assistants and registered nurses. They work under the direction of registered nurses to deliver person-centred, evidence-based care.

## What Nursing Associates Can Do

- Carry out clinical observations and report changes in patient condition
- Administer medications under the direction of a registered nurse
- Undertake a range of clinical procedures including wound care, catheterisation and venepuncture (setting dependent)
- Support care planning and risk assessment
- Act as a point of communication between patients and the wider team

## What They Cannot Do

- Prescribe medications independently
- Act as the responsible clinician for a patient
- Work as an autonomous clinical decision-maker without supervision

## How to Train as a Nursing Associate

The standard route is a two-year Foundation Degree (FdSc) in Health or a Nursing Associate Apprenticeship. Both routes require a clinical placement (you can remain in your current care role for the apprenticeship). Entry requirements typically include GCSEs in English and Maths and some experience in a care setting.

## Salary and Progression

NAs typically work at NHS Band 4 (£26,530–£29,114 in 2026). Many go on to top-up to a full Registered Nurse qualification in as little as 18 months through an NMC-approved programme.

## Is It Right for You?

If you are an HCA or care worker who wants to take on more clinical responsibility without committing immediately to a full nursing degree, the NA route is an excellent stepping stone. It is funded, practical, and leads directly to NMC registration.',
  'The Nursing Associate role sits between healthcare assistant and registered nurse. Here is everything you need to know about the role, the training, and whether it is right for your career.',
  'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&q=80',
  'qualifications',
  'CareLearn Team',
  6,
  true
),
(
  'Your Rights at Work in Social Care: A Practical Guide',
  'rights-at-work-social-care-guide',
  '## Know Your Rights

Care work is one of the most demanding jobs in the UK — and workers in the sector are entitled to the same employment protections as anyone else. Here is a clear summary of your key rights.

## Pay

You are entitled to at least the National Living Wage (£11.44/hour for workers aged 21+ in 2026). Sleep-in shifts are a complex area — following key legal cases, workers are entitled to NLW for the hours they are required to be awake and working, though not necessarily for periods when they are permitted to sleep.

## Working Hours

Under the Working Time Regulations, you cannot be required to work more than 48 hours per week on average unless you have voluntarily opted out. You are entitled to a minimum 11 hours rest between shifts and a 20-minute break for any shift over 6 hours.

## Mandatory Training

Employers are legally required to provide training that is necessary for you to do your job safely. This should be done in paid time. Moving and handling, fire safety, safeguarding, and infection control are all typically considered mandatory — your employer cannot charge you for these or require you to complete them unpaid.

## Sick Pay

You are entitled to Statutory Sick Pay (SSP) after 4 consecutive days of sickness. Your contract may provide for more generous occupational sick pay — check your terms.

## Whistleblowing

The Public Interest Disclosure Act 1998 protects workers who report wrongdoing in good faith. You cannot be dismissed or treated unfairly for raising a safeguarding concern, reporting financial abuse, or flagging unsafe practices. Always report serious concerns to CQC or the Local Authority Safeguarding team if you do not feel safe raising them internally.

## Where to Get Help

- **ACAS**: Free advice on employment rights — 0300 123 1100
- **Skills for Care**: Workforce development guidance
- **CQC**: Report concerns about care quality
- **Citizens Advice**: Free legal and employment advice',
  'Care workers have the same employment rights as anyone else. This guide covers pay, working hours, mandatory training, sick pay and whistleblowing protections in plain language.',
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
  'workplace',
  'CareLearn Team',
  7,
  true
),
(
  'Top 5 Qualifications to Advance Your Care Career in 2026',
  'top-5-qualifications-care-career-2026',
  '## 1. Level 3 Diploma in Adult Care

The Level 3 is the benchmark qualification for senior care workers and team leaders. It covers safeguarding, person-centred care, health and safety, and communication in depth. Delivered by most large training providers, it takes around 12–18 months part-time and can be funded through the Adult Education Budget or WDF.

**Best for:** Care assistants aiming for senior or team leader roles.

## 2. Level 5 Diploma in Leadership for Health and Social Care

Equivalent to a foundation degree, the Level 5 is the standard qualification for registered managers. It covers governance, quality improvement, leadership theory and regulatory compliance. Skills for Care often co-funds this through WDF.

**Best for:** Senior carers and deputy managers aiming for registered manager registration with CQC.

## 3. Nursing Associate Foundation Degree

A two-year, NMC-registered qualification that gives you clinical skills, medication administration authority and a stepping stone to full nurse registration. Available as a workplace apprenticeship — often fully funded by your employer.

**Best for:** HCAs and senior care workers who want to move into a clinical nursing pathway.

## 4. Level 2 Award in Awareness of Dementia

A short, widely available qualification that is increasingly expected for care workers supporting people living with dementia. Demonstrates person-centred, evidence-based understanding of dementia care. Often free through the AEB.

**Best for:** Any care worker in a residential, domiciliary or community setting.

## 5. First Line Management Apprenticeship (Level 3)

A broad management qualification covering team leadership, communication, problem-solving and performance management. Ideal for those moving into a supervisory role for the first time. Fully funded through the Apprenticeship Levy.

**Best for:** Experienced care workers stepping into their first management role.',
  'Whether you are looking to move into management, step into a clinical role or simply add recognised credentials to your CV, these five qualifications offer the clearest return.',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
  'qualifications',
  'CareLearn Team',
  5,
  true
);

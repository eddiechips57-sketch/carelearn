/*
# Seed panic-driven SEO blog articles linked to ebooks

## Purpose
Seed 12 short, highly-optimised free blog articles that answer the exact questions stressed carers type into Google at 2am. Each article is linked to the most relevant ebook via linked_ebook_id so the upsell banner on the article page promotes the right product.

## Articles
1. "Why is my mum wandering at night?" (home_care_recovery) -> Living Well with Dementia
2. "How to lift someone safely without hurting your back" (home_care_recovery) -> Safe Hands
3. "My dad refuses to eat — what should I do?" (home_care_recovery) -> When Every Bite Matters
4. "How to stop someone with dementia leaving the house" (home_care_recovery) -> Home Safety Checklist
5. "What to do when someone with dementia gets aggressive at sunset" (family_behaviour_support) -> Calm in the Storm
6. "How to set up a bedroom after coming home from hospital" (home_care_recovery) -> The First 30 Days Home
7. "How to divide caring duties with siblings" (navigating_care_system) -> The Family Care Organiser
8. "What to ask when touring a care home" (navigating_care_system) -> Finding & Funding Care
9. "Carer burnout — signs you are running on empty" (carer_wellbeing) -> Running on Empty
10. "How to communicate with someone who can't speak" (family_behaviour_support) -> Beyond Words
11. "15 meaningful activities for someone with dementia" (carer_wellbeing) -> 101 Meaningful Days
12. "What to put in a hospital grab-bag for an older relative" (navigating_care_system) -> The Family Care Organiser

## Notes
- Idempotent: ON CONFLICT (slug) DO UPDATE so re-running updates content without duplicating.
- All articles are published (is_published = true).
- Categories match the existing blog category filter keys.
*/

INSERT INTO community_blog_posts (title, slug, excerpt, body, category, author_name, read_time_minutes, is_published, cover_image_url, linked_ebook_id)
VALUES

-- 1. Wandering at night
(
  'Why Is My Mum Wandering at Night? 7 Calm Ways to Keep Her Safe',
  'why-is-my-mum-wandering-at-night',
  'Wandering at night is one of the most frightening dementia behaviours for families. Here are 7 practical, gentle ways to reduce night-time wandering and keep your mum safe — tonight.',
  '## Why wandering happens

Wandering is not random. It is usually a signal that something is unmet — pain, thirst, a full bladder, a need for the toilet, boredom, anxiety, or a disrupted body clock. In dementia, the part of the brain that regulates sleep-wake cycles breaks down, so night and day blur together. Your mum may genuinely believe it is morning and time to "get ready for work."

## 7 things you can do tonight

1. **Check the basics first.** Is she too hot or too cold? Does she need the toilet? Is she in pain but cannot say so? A glass of water or a trip to the loo can end a wandering episode in minutes.
2. **Make the day brighter and the night darker.** Get her into bright daylight (even by a window) during the day. After 6pm, dim the lights and switch to warm, low lighting. This helps reset the broken body clock.
3. **Remove visual triggers by the door.** Coats on a hook, shoes by the mat, a handbag on the chair — all of these say "time to leave." Move them out of sight near bedtime.
4. **Use a simple door sensor.** A cheap wireless door alarm (around £15) that chimes in your bedroom is often enough. You do not need GPS trackers straight away.
5. **Label the bedroom and bathroom.** A clear picture sign on the toilet door (not just words) reduces anxious "searching" behaviour that leads to wandering.
6. **Try a sealed motion-activated night light.** A warm-glow light that comes on when she gets out of bed gives just enough reassurance without fully waking her.
7. **Ask the GP about a medication review.** Some medications make night-time restlessness worse. Never stop medication yourself — but ask the question.

## When to get more help

If wandering is frequent, persistent, or involves leaving the house at night, ask the GP for a needs assessment referral and request a carer''s assessment for yourself. You may be eligible for assistive technology (door sensors, bed sensors, GPS trackers) funded by the council.

## The complete step-by-step guide

This article covers the essentials. If you are dealing with sundowning, wandering, refusal of care, or repeated night-time distress, the full guide below walks you through exact conversational scripts, room-by-room home tweaks, and a printable night-time safety checklist.',
  'home_care_recovery',
  'CareLearn Team',
  6,
  true,
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&h=630&fit=crop',
  '7c3f2253-064f-4802-b806-e242691ddaa3'
),

-- 2. Lifting safely
(
  'How to Lift Someone Safely Without Hurting Your Back',
  'how-to-lift-someone-safely-without-hurting-your-back',
  'Back injuries are the most common injury among family carers. Learn the 5 golden rules of safe lifting and transferring — so you can help someone stand, sit, or move without pain.',
  '## Why your back is at risk

Most carers hurt their back not in a dramatic fall, but through hundreds of small, poorly-aligned transfers over months. Every time you pull someone up by their arms, twist while holding them, or lift with your back instead of your legs, you accumulate strain. The good news: a few technique changes prevent most injuries.

## The 5 golden rules

1. **Never lift with your back.** Bend your knees, keep your back straight, and let your leg muscles — the strongest in your body — do the work.
2. **Get close before you lift.** The further away the person is, the more leverage works against your spine. Step right up so your feet are close to theirs before you start.
3. **Never twist while carrying weight.** Move your feet to turn, not your spine. Pivot with your whole body.
4. **Use a transfer belt or slide sheet.** A handling belt (£15-20) gives you a secure grip on the person''s waist without pulling on their arms or shoulders. Slide sheets make repositioning in bed almost effortless.
5. **Communicate before you move.** Say "Ready? One, two, three, up." Counting lets the person prepare their own muscles, so they bear some of their own weight.

## Safe sit-to-stand transfer

1. Put on shoes with grip (not socks on a smooth floor).
2. Ask the person to shuffle to the front of the chair.
3. Place their feet flat, shoulder-width apart, behind their knees.
4. Stand close, block their weaker knee with your knee if needed.
5. Ask them to lean forward ("nose over toes").
6. Hold the transfer belt or their hips (never under the arms).
7. On the count of three, rock back, straighten your knees, and bring them up with you.

## When NOT to lift

Do not lift someone who is dead weight, agitated, or significantly heavier than you can safely manage. Call for a second carer, use a hoist, or request a moving and handling assessment from your local authority or district nurse. There is no medal for hurting yourself.

## The complete illustrated guide

This article covers the basics. The full guide below includes illustrated step-by-steps for every transfer, bathing and dressing techniques that protect your back, and a printable wall chart for carers.',
  'home_care_recovery',
  'CareLearn Team',
  7,
  true,
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&h=630&fit=crop',
  '6252e3fc-cbc5-4828-94de-9d353c3f6989'
),

-- 3. Refusing to eat
(
  'My Dad Refuses to Eat — What Should I Do?',
  'my-dad-refuses-to-eat-what-should-i-do',
  'When someone with dementia or after a stroke refuses food, it is terrifying. Here are 8 practical steps to understand why they are refusing and gently get calories in — without force.',
  '## First: don''t panic

Refusing food is extremely common in dementia and after a stroke, and it does not always mean what you fear. The person may have a sore mouth, trouble swallowing, no appetite, or simply be confused about what the food is. Pressure makes it worse — so the first step is managing your own fear.

## 8 steps to try

1. **Check for pain or infection.** A sore mouth, toothache, UTI, or chest infection can kill appetite fast. A GP visit is worth it before anything else.
2. **Assess swallowing.** If your dad coughs, splutters, or gags on drinks, ask the GP for a swallowing assessment (SLT referral). Thickened fluids or pureed food may be needed.
3. **Switch to finger foods.** Forks and plates are confusing. Bite-sized pieces he can pick up with his hands — sandwiches, cheese cubes, fruit slices, sausage rolls — often work when a full meal does not.
4. **Offer small amounts, often.** Three big meals are overwhelming. Five or six tiny snacks through the day add up to more calories.
5. **Make every bite count.** Add butter, cream, full-fat yoghurt, cheese, and oil to everything. A spoon of double cream in porridge adds 100 calories in one bite.
6. **Eat with him.** Watching you eat triggers mirror neurons. Sit down, eat the same food, and offer — do not instruct.
7. **Check the environment.** A noisy TV, bright lights, or a cluttered table can overwhelm. A calm, simple table with one plate often makes a difference.
8. **Try warm drinks between bites.** A sip of warm tea or milky coffee can stimulate appetite and help swallowing.

## Red flags — when to call the GP

Call the GP or 111 if your dad has not had any fluids for 24 hours, is coughing when drinking, is losing weight rapidly, or is becoming drowsy and confused. These need same-day assessment.

## The complete mealtime guide

This article covers the essentials. The full guide below includes high-calorie finger food recipes, a safe-eating posture diagram, hydration tricks, and a printable meal tracker.',
  'home_care_recovery',
  'CareLearn Team',
  6,
  true,
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&h=630&fit=crop',
  '024e97b7-490f-463b-90d2-0dab931cc08c'
),

-- 4. Stopping someone leaving the house
(
  'How to Stop Someone with Dementia Leaving the House',
  'how-to-stop-someone-with-dementia-leaving-the-house',
  'Wandering out of the house is one of the most frightening dementia behaviours. Here are practical steps to secure the home, redirect behaviour, and keep your relative safe.',
  '## Why they try to leave

In dementia, the brain loses the concept of "home" as a permanent, safe place. The person may think they need to go to work, go home to their childhood house, or pick up the children. They are not being difficult — they are trying to complete a task that feels real to them.

## Practical home changes

1. **Hide the door.** A plain curtain across the front door, or a door painted the same colour as the wall, can make it disappear. Many people with dementia simply do not see it.
2. **Remove triggers.** Coats, shoes, handbags, and keys by the door all say "time to go." Move them to a cupboard or another room.
3. **Install a door sensor.** A £15 wireless chime that sounds in your bedroom or living room gives you early warning. For higher risk, consider a GPS tracker pendant (the council may fund one after a needs assessment).
4. **Use a slide-bolt lock high or low on the door.** Not at eye level — a lock the person does not see, they will not try to open. But never lock someone in without a risk assessment and professional advice, as this can be a deprivation of liberty.
5. **Put a dark mat by the door.** Some people with dementia perceive a dark mat as a hole and will not step on it. This is a well-known dementia-friendly design trick.

## What to say in the moment

Do not argue. Do not say "you live here." Instead:

- **Acknowledge the feeling:** "You''re looking for your mum, aren''t you? She''d want you to be safe. Let''s sit down and have a cup of tea."
- **Redirect to a task:** "Before we go, can you help me find my glasses?" Give them something to do that involves turning away from the door.
- **Walk with them, then loop back:** If they are determined, walk alongside them down the street, chat calmly, and gently steer back towards home. Confrontation outside the house is risky.

## The complete safety checklist

This article covers the essentials. The full guide below includes a room-by-room home safety checklist, a printable wandering-risk assessment, and exact scripts for sundowning and exit-seeking behaviour.',
  'home_care_recovery',
  'CareLearn Team',
  7,
  true,
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&h=630&fit=crop',
  '3cd526cd-35c2-4c4a-8f64-e0e350cf275d'
),

-- 5. Sundowning aggression
(
  'What to Do When Someone with Dementia Gets Aggressive at Sunset',
  'dementia-aggressive-at-sunset-sundowning-guide',
  'Sundowning — the late-afternoon agitation and aggression that affects up to 1 in 4 people with dementia — is terrifying. Here are 6 calm, proven ways to reduce it.',
  '## What is sundowning?

Sundowning is a pattern of increased confusion, anxiety, agitation, and sometimes aggression that typically starts in the late afternoon (3-5pm) and worsens into the evening. It affects up to 25% of people with dementia. It is not "bad behaviour" — it is the brain''s damaged internal clock misfiring as daylight fades.

## 6 ways to reduce sundowning

1. **Increase daytime light.** Get the person outside or near a bright window in the morning and early afternoon. Bright daylight helps recalibrate the broken body clock. Even 20 minutes helps.
2. **Reduce stimulants after 2pm.** No caffeine (tea, coffee, cola, chocolate) after lunch. Switch to decaf, herbal tea, or warm milk.
3. **Keep the evening calm and predictable.** Same routine every evening: dim the lights, put on gentle music or a familiar old programme, offer a warm drink. Predictability reduces anxiety.
4. **Avoid confrontation in the moment.** If the person is agitated, do not correct, argue, or reason. Validate the feeling: "I can see you''re upset. I''m here. Let''s sit down." Arguing makes it worse — every time.
5. **Check for unmet needs.** Pain, hunger, thirst, a full bladder, constipation, or being too hot/cold can all trigger sundowning. Address the basics before assuming it is "just the dementia."
6. **Try a low dose of bright light in the morning.** A light therapy box (10,000 lux) for 30 minutes in the morning can improve sleep and reduce evening agitation. Ask the GP or memory clinic first.

## What NOT to do

- Do not lock them in a room (this escalates aggression and is unsafe).
- Do not give sedatives without medical review — some make sundowning worse.
- Do not take it personally. The aggression is the disease, not the person.

## The complete de-escalation guide

This article covers the essentials. The full guide below includes low-arousal verbal scripts, a recovery-phase plan for after an incident, and a printable sundowning routine chart.',
  'family_behaviour_support',
  'CareLearn Team',
  6,
  true,
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&h=630&fit=crop',
  'c477212a-4d3d-44a1-97bc-a96d0051d56a'
),

-- 6. Bedroom setup after hospital
(
  'How to Set Up a Bedroom After Coming Home from Hospital',
  'how-to-set-up-bedroom-after-hospital-discharge',
  'A safe bedroom after a hospital discharge prevents falls, pressure sores, and readmissions. Here is a practical room-by-room checklist for the first 48 hours at home.',
  '## The first 48 hours are critical

One in eight hospital discharges in the UK results in a readmission within 30 days. Most are due to falls, medication errors, or infections picked up at home. A prepared bedroom is your single biggest defence.

## Bed area

1. **Lower the bed if needed.** If the person is unsteady, a bed that is too high is a fall risk. Their feet should touch the floor when they sit on the edge. Bed risers or a low-profile bed frame may be needed.
2. **Install a bed lever / grab rail.** A bed lever (£30-50) clamps to the bed frame and gives the person something to hold when sitting up or swinging their legs out. It is the single most useful item you can buy.
3. **Use a pressure-relieving mattress.** If the person was in hospital more than a few days or has limited mobility, ask about a pressure-relieving mattress on loan from the district nurse or community equipment store.
4. **Keep the phone and a glass of water within reach.** A bedside table at the right height (not across the room) prevents risky reaching.

## Floor and lighting

5. **Remove all rugs and loose carpet edges.** Loose rugs are the #1 cause of falls at home. Roll them up and put them away.
6. **Install a night light.** A plug-in motion-sensor light (£5) between the bed and the bathroom means they never walk in the dark.
7. **Clear a wide path.** Furniture, cables, and clutter must be moved so there is a clear, wide route from bed to bathroom and bed to door.

## Bathroom

8. **Add a raised toilet seat and grab rails.** A raised seat (£20) reduces the distance to sit and stand. Grab rails by the toilet are essential.
9. **Use a non-slip bath mat.** A rubber-backed mat inside and outside the bath or shower.

## The complete 30-day guide

This article covers the bedroom. The full guide below covers the whole house, medication management, wound care, fall prevention, pressure sore prevention, and a printable discharge checklist for the first 30 days.',
  'home_care_recovery',
  'CareLearn Team',
  8,
  true,
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&h=630&fit=crop',
  '65030774-0621-440b-9e45-56a0aac04cb0'
),

-- 7. Dividing caring duties with siblings
(
  'How to Divide Caring Duties with Siblings Without Falling Out',
  'divide-caring-duties-with-siblings',
  'Sibling conflict is the hidden cause of carer burnout. Here is a practical framework for splitting care tasks fairly — even when one sibling lives far away.',
  '## Why siblings fall out over care

The pattern is painfully common: one sibling (usually the one who lives nearest, or the daughter) does 90% of the care. The others visit occasionally, criticise, and offer opinions from a distance. Resentment builds. The primary carer burns out. Nobody wins.

The solution is not "everyone does the same amount." It is a clear, written, fair division of tasks that plays to each person''s strengths and circumstances.

## A fair framework

1. **List every task.** Sit down (in person or on a video call) and write out every single care task: appointments, shopping, cleaning, personal care, overnight, finances, paperwork, phone calls to agencies. Be exhaustive.
2. **Split by type, not by hours.** Not everyone can do hands-on care. A sibling 200 miles away can still: manage the finances, book and pay for a cleaner, research care homes, handle benefits claims, order supplies online, and make phone calls during the week.
3. **Write it down.** A shared Google Sheet or a printed rota on the fridge. Vague verbal agreements ("I''ll help when I can") are worthless. Specific, dated commitments ("I''ll do the weekly shop every Saturday") work.
4. **Value the primary carer''s time.** If one sibling does the daily hands-on care, the others should contribute financially or cover respite. Unpaid care is worth thousands a month — acknowledge it.
5. **Have a weekly check-in.** A 15-minute Sunday phone call: what went well, what''s coming up, what needs to change. Do not let issues fester for months.
6. **Get a carer''s assessment.** The primary carer is entitled to a free assessment from the local authority. It formalises what they do and can unlock respite care and funding.

## The complete family organiser

This article covers the conversation. The full guide below includes a fillable task-division template, an emergency contact sheet, a medication tracker, and a respite planning worksheet.',
  'navigating_care_system',
  'CareLearn Team',
  7,
  true,
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&h=630&fit=crop',
  'd4f33576-3b81-4e58-8e61-ea02ff628206'
),

-- 8. Touring a care home
(
  'What to Ask When Touring a Care Home — The Complete Checklist',
  'what-to-ask-when-touring-a-care-home',
  'Choosing a care home is one of the biggest decisions you will make. Here are the 12 questions you must ask on a tour — and the red flags to watch for.',
  '## Why most people tour the wrong way

Most families tour a care home, look at the decor, chat to the manager, and leave with a feeling. That is not enough. The decor tells you nothing. The staff turnover, the CQC rating, the activities schedule, and the smell of the place tell you everything.

## 12 questions to ask

1. **"What is your current CQC rating?"** Check it online at cqc.org.uk before you visit. "Requires improvement" or "Inadequate" are red flags.
2. **"What is your staff turnover rate?"** High turnover (over 30% per year) means agency staff, inconsistent care, and unhappy workers. Good homes are proud of low turnover.
3. **"What is your staff-to-resident ratio on a day shift and a night shift?"** Write both numbers down. Night ratios are often much lower.
4. **"Can I see a weekly activities schedule?"** A real, printed schedule — not "we do lots of things." Bingo twice a week is not meaningful activity.
5. **"How do you handle residents who refuse personal care?"** The answer should mention dignity, choice, and trying again later — not "we have to get it done."
6. **"What is your falls rate and how do you reduce falls?"** Every home has falls. Good homes know their rate and have a prevention plan.
7. **"How do you support residents with dementia specifically?"** Look for: dementia-friendly design, tailored activities, and staff trained in dementia care (not just generic NVQ).
8. **"What are the fees and what is included?"** Get a written fee schedule. Ask what costs extra (haircuts, outings, chiropody, incontinence products). Some homes add £200+/month in extras.
9. **"What happens if fees increase?"** By how much, how often, and with how much notice?
10. **"What is your complaints process?"** Every home must have one. A good manager will explain it clearly without defensiveness.
11. **"Can residents bring their own furniture and belongings?"** Personal possessions make a room feel like home, not a hospital.
12. **"Can I speak to a current resident''s family?"** The best homes will arrange this. If they refuse, walk away.

## Red flags to watch for

- A smell of urine in the corridors (poor continence care)
- Residents slumped in chairs with nothing to do
- Staff who do not make eye contact or greet you
- The manager not being available for your tour
- No visible call bells or staff responding slowly to them

## The complete funding guide

This article covers the tour. The full guide below covers needs assessments, funding entitlements (including NHS Continuing Healthcare), the 12-week property disregard, and a printable care-home comparison sheet.',
  'navigating_care_system',
  'CareLearn Team',
  8,
  true,
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&h=630&fit=crop',
  'f946ba4a-dfcb-4242-89a5-5f016468104f'
),

-- 9. Carer burnout
(
  'Carer Burnout: 10 Signs You Are Running on Empty',
  'carer-burnout-10-signs-running-on-empty',
  'Carer burnout creeps up slowly until you break. Here are the 10 warning signs to watch for — and 5 practical steps to take before you reach crisis.',
  '## Burnout does not arrive in a single moment

It builds over months. You do not notice it because you are too busy caring. Then one morning you cannot get out of bed, or you snap at the person you love, or you cry in the supermarket for no reason. That is burnout — and by the time you feel it, you are already deep in it.

## 10 warning signs

1. **You cannot sleep even when you have the chance.** Your body is exhausted but your mind will not switch off.
2. **You feel angry all the time.** At the person you care for, at your family, at the world. The anger surprises you.
3. **You have stopped seeing friends.** You cancel plans, stop answering texts, and feel isolated — but you are too tired to fix it.
4. **You are getting ill more often.** Colds, infections, headaches, stomach problems. Your immune system is suppressed by chronic stress.
5. **You feel numb.** You go through the motions of caring but feel nothing. This is not cruelty — it is emotional exhaustion.
6. **You cannot concentrate.** You forget appointments, lose keys, make mistakes with medication.
7. **You feel guilty all the time.** No matter what you do, it is not enough. The guilt is constant and exhausting.
8. **You are using alcohol or food to cope.** A glass of wine becomes two, becomes a bottle. Comfort eating or skipping meals entirely.
9. **You have fantasised about running away.** Not suicide — just escaping. This is a common and serious sign of overwhelm.
10. **You feel trapped.** You cannot see a way out, a break, or a future beyond caring.

## 5 steps to take now

1. **Tell your GP.** Say "I am a carer and I am struggling." You are entitled to a carer''s assessment and support. This is not weakness.
2. **Ask for a carer''s assessment from the council.** It is free, it is your legal right, and it can unlock respite care, funding, and equipment.
3. **Accept one offer of help this week.** Someone has offered. Say yes. Even if it is just "can you sit with mum for two hours while I go to the shops."
4. **Book respite.** Even one day a week. Day centres, sitting services, or a short residential break. You cannot pour from an empty cup.
5. **Talk to someone who understands.** Carers UK helpline (0808 808 7777) is free and they have heard it all. You are not alone.

## The complete burnout recovery guide

This article covers the signs. The full guide below includes a burnout self-assessment, boundary-setting scripts, a night-shift sleep plan, and a respite planning worksheet.',
  'carer_wellbeing',
  'CareLearn Team',
  7,
  true,
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&h=630&fit=crop',
  'dff18c25-caee-4984-8323-494cd411a8f2'
),

-- 10. Communicating with non-verbal
(
  'How to Communicate with Someone Who Cannot Speak',
  'how-to-communicate-with-someone-who-cannot-speak',
  'When a stroke, dementia, or disability takes away speech, communication does not stop — it changes. Here are 7 practical ways to connect with someone who cannot use words.',
  '## Speech is only one channel

When someone loses speech — through a stroke (aphasia), advanced dementia, motor neurone disease, or a brain injury — they have not lost the need to communicate. They have lost the easiest channel. Your job is to open new ones.

## 7 ways to connect

1. **Give them time.** The single most important thing. People with aphasia or dementia often know what they want to say but cannot access the words. Wait. Count to 10 in your head. Do not jump in or finish their sentence.
2. **Ask yes/no questions.** "Do you want a cup of tea?" is easier than "What would you like to drink?" One-word answers or a nod/shake are manageable when full sentences are not.
3. **Use pictures.** A simple printed sheet with pictures of common needs (toilet, drink, food, pain, cold, hot, bed, TV) lets them point. This is called a communication board and it works.
4. **Watch their face and body.** A wince, a pointing finger, a look towards the door, a tensed shoulder — these are communication. Respond to what you see, not just what you hear.
5. **Offer choices with real objects.** Hold up a cup of tea and a glass of water. "Which one?" is clearer than any words.
6. **Use a familiar routine and objects.** A dressing gown hanging up means "time to get up." A plate on the table means "time to eat." Routines and objects do the talking when words cannot.
7. **Touch.** A hand on the arm, a held hand, a hug. Connection does not require language. Never underestimate the power of simply being present.

## What NOT to do

- Do not talk about them as if they are not there ("Is he in pain?" asked to the carer while he is sitting right there).
- Do not raise your voice. Volume does not help word-finding.
- Do not rush them or show frustration. They can sense it, and it makes communication harder.
- Do not assume they cannot understand just because they cannot speak. Comprehension and speech are different brain functions.

## The complete communication guide

This article covers the basics. The full guide below includes printable visual routine cards, a communication board template, transition-management strategies, and scripts for reducing anxiety.',
  'family_behaviour_support',
  'CareLearn Team',
  6,
  true,
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&h=630&fit=crop',
  '346ff2c4-c01c-4640-aaf8-df5d0692f022'
),

-- 11. Meaningful activities
(
  '15 Meaningful Activities for Someone with Dementia',
  '15-meaningful-activities-for-someone-with-dementia',
  'Boredom is one of the biggest unmet needs in dementia care. Here are 15 simple, low-cost activities that reduce agitation and create connection — sorted by ability level.',
  '## Why activity matters

In dementia, boredom is not just unpleasant — it drives agitation, wandering, repeated questions, and sleep disruption. The brain still craves stimulation, purpose, and connection. The right activity can transform a difficult afternoon into a calm one.

## For early-stage dementia

1. **Sorting tasks.** A basket of mixed buttons, coins, or socks to sort by colour or size. Simple, repetitive, and deeply satisfying.
2. **Folding laundry.** Towels, tea towels, and napkins. It is a real task with a clear result — exactly what the brain craves.
3. **Reminiscence with photos.** Old family photos (labelled) trigger intact long-term memories and spark conversation.
4. **Gardening.** Watering plants, dead-heading flowers, or potting up seedlings. Hands in soil is calming and grounding.
5. **Simple baking.** Mixing, stirring, and decorating biscuits. The smell and taste are powerful sensory triggers.

## For mid-stage dementia

6. **Music from their era.** A playlist of songs from their 20s. Music is stored in a part of the brain dementia reaches last.
7. **Fidget blankets and boards.** Textured fabrics, zips, buttons, and beads sewn onto a lap blanket. Keep restless hands busy.
8. **Pet therapy.** A calm dog or cat to stroke. If you do not have a pet, visiting therapy animals or even a soft toy can help.
9. **Armchair exercises.** Seated leg lifts, arm circles, and ball tosses. Gentle movement reduces restlessness.
10. **Hand massage.** Warm hand cream, slow circular massage. Deeply relaxing and a powerful non-verbal connection.

## For late-stage dementia

11. **Sensory boxes.** A box filled with textured items (soft fabric, a wooden spoon, a pinecone, a silk scarf). Touch is the last sense to fade.
12. **Familiar smells.** Fresh bread, coffee, lavender, cut grass. Smell triggers the strongest emotional memories.
13. **Gentle music and humming.** Even when words are gone, people can often hum or tap to a familiar tune.
14. **Looking out a window.** Birds, trees, weather, passers-by. Nature is endlessly absorbing and requires no effort.
15. **Simply being present.** Sit beside them. Hold their hand. You do not need to "do" anything. Your presence is the activity.

## The complete activities guide

This article gives you 15. The full guide below includes 101 activities sorted by mobility and cognitive level, reminiscence prompt cards, and a printable weekly activity planner.',
  'carer_wellbeing',
  'CareLearn Team',
  6,
  true,
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&h=630&fit=crop',
  '1fb63711-42d3-477b-9718-d2b1154d65f2'
),

-- 12. Hospital grab bag
(
  'What to Put in a Hospital Grab-Bag for an Older Relative',
  'what-to-put-in-a-hospital-grab-bag',
  'When an older relative is admitted to hospital in a panic, you will not have time to think. Pack a grab-bag now — here is the complete checklist.',
  '## Why you need a grab-bag before the emergency

When the call comes — a fall, a stroke, a sudden confusion — you are operating on adrenaline. You will not remember the hearing aids, the medication list, or the glasses. A packed bag, ready by the door or in a known cupboard, means you grab it and go.

## The complete checklist

### Essentials
1. **A current medication list.** Typed, with doses and times. Plus the actual medications in their original packets.
2. **NHS card / health number.** And a photo ID (driving licence or passport copy).
3. **Glasses and a spare pair.** Hospitals are disorienting enough without blurred vision.
4. **Hearing aids and spare batteries.** Write the type of battery on the case.
5. **Dentures and cleaning pot.** Label the pot — dentures go missing in hospitals constantly.

### Comfort
6. **Two pairs of pyjamas.** Front-buttoning (easier with IV lines and monitors). Easy to wash.
7. **Non-slip socks or slippers.** Hospital floors are slippery. Bare feet are a fall risk.
8. **A warm cardigan or dressing gown.** Hospitals are cold.
9. **A familiar item.** A family photo, a favourite blanket, or a small cushion. Disorientation in hospital is a major cause of delirium.

### Communication
10. **A "This Is Me" card or care passport.** A one-page profile covering likes, dislikes, routines, triggers, and communication needs. It helps every nurse and doctor understand the person behind the patient.
11. **A pen and notebook.** To write down questions, answers, names of doctors, and ward phone numbers.
12. **Phone charger and a list of key contacts.** Their phone and yours. Write the emergency contacts on a card in the bag.

### Practical
13. **Small change and a £5 note.** For the hospital shop or visitor parking.
14. **A pack of wet wipes and tissues.**
15. **A water bottle with a sports cap.** Easier for someone in bed to drink from than a cup.

## Keep it updated

Check the bag every 3 months. Medication lists go out of date. Batteries die. Swap the pyjamas for the season.

## The complete family organiser

This article covers the grab-bag. The full guide below includes a fillable care passport, an emergency contact sheet, a medication tracker, and a hospital admission checklist.',
  'navigating_care_system',
  'CareLearn Team',
  5,
  true,
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&h=630&fit=crop',
  'd4f33576-3b81-4e58-8e61-ea02ff628206'
)

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  body = EXCLUDED.body,
  category = EXCLUDED.category,
  read_time_minutes = EXCLUDED.read_time_minutes,
  is_published = EXCLUDED.is_published,
  cover_image_url = EXCLUDED.cover_image_url,
  linked_ebook_id = EXCLUDED.linked_ebook_id;

/*
  # Add interactive module data and sample modules

  1. Changes
    - Add module_data jsonb column to modules table
    - Insert sample interactive learning modules with scenario-based content

  2. Interactive Modules
    - Safeguarding Decision Making scenario
    - Medication Error Response scenario  
    - Emergency Response Training scenario
*/

-- Add module_data column to store interactive content structure
ALTER TABLE modules ADD COLUMN IF NOT EXISTS module_data jsonb;

-- Insert sample interactive modules
INSERT INTO modules (title, description, content_type, difficulty, learning_style, tags, completion_rate, module_data) VALUES
(
  'Safeguarding Decision Making',
  'Interactive scenario-based training for safeguarding situations. Practice making critical decisions in realistic care scenarios.',
  'interactive',
  'intermediate',
  'kinesthetic',
  ARRAY['safeguarding', 'decision-making', 'scenarios'],
  0.85,
  '{
    "startNode": "scenario1",
    "nodes": {
      "scenario1": {
        "type": "scenario",
        "title": "Suspicious Bruising",
        "text": "You notice that Mrs. Johnson, an 82-year-old resident, has unexplained bruising on her arms. She seems withdrawn and flinches when staff approach her. Her son visits regularly and often seems impatient with her. What is your immediate action?",
        "options": [
          {
            "text": "Ignore it - bruising is common in elderly people",
            "nextNode": "outcome_poor1"
          },
          {
            "text": "Document the bruising and report to your supervisor immediately",
            "nextNode": "scenario2"
          },
          {
            "text": "Ask Mrs. Johnson directly if someone hurt her",
            "nextNode": "outcome_poor2"
          },
          {
            "text": "Confront the son about the bruising",
            "nextNode": "outcome_poor3"
          }
        ]
      },
      "scenario2": {
        "type": "scenario",
        "title": "Following Protocol",
        "text": "Good choice! You have documented the bruising and reported to your supervisor. Your supervisor asks you to complete a safeguarding concern form. Mrs. Johnson asks you not to tell anyone because she is afraid. How do you respond?",
        "options": [
          {
            "text": "Respect her wishes and do not complete the form",
            "nextNode": "outcome_poor4"
          },
          {
            "text": "Explain that you have a duty of care and must complete the safeguarding process",
            "nextNode": "scenario3"
          },
          {
            "text": "Complete the form but do not mention her request for secrecy",
            "nextNode": "outcome_good1"
          }
        ]
      },
      "scenario3": {
        "type": "scenario",
        "title": "Supporting the Individual",
        "text": "You have explained your duty of care to Mrs. Johnson. She is still worried but understands. The safeguarding team will investigate. How do you continue to support Mrs. Johnson during this process?",
        "options": [
          {
            "text": "Avoid her to prevent further distress",
            "nextNode": "outcome_poor5"
          },
          {
            "text": "Provide reassurance, maintain normal care routines, and keep her informed of the process",
            "nextNode": "outcome_excellent"
          },
          {
            "text": "Tell other residents about the situation so they can support her",
            "nextNode": "outcome_poor6"
          }
        ]
      },
      "outcome_poor1": {
        "type": "outcome",
        "title": "Missed Opportunity",
        "text": "This was not the right choice. Unexplained bruising, especially with behavioral changes, should always be investigated. Ignoring potential signs of abuse puts vulnerable people at risk.",
        "score": 20,
        "feedback": "Remember: All staff have a duty to report safeguarding concerns. Early intervention can prevent further harm."
      },
      "outcome_poor2": {
        "type": "outcome",
        "title": "Well-Intentioned but Incorrect",
        "text": "While your concern is genuine, directly questioning someone about abuse can put them at further risk and may compromise an investigation. Always follow proper safeguarding procedures.",
        "score": 40,
        "feedback": "Best practice: Document observations and report through proper channels rather than conducting your own investigation."
      },
      "outcome_poor3": {
        "type": "outcome",
        "title": "Dangerous Approach",
        "text": "Confronting a suspected abuser directly is dangerous and could escalate the situation. This approach could put Mrs. Johnson at greater risk and compromise any investigation.",
        "score": 10,
        "feedback": "Never confront suspected abusers directly. Always work through proper safeguarding channels and trained professionals."
      },
      "outcome_poor4": {
        "type": "outcome",
        "title": "Misunderstanding Duty of Care",
        "text": "While respecting service users is important, your duty of care overrides their request for secrecy when abuse is suspected. Safeguarding procedures exist to protect vulnerable people.",
        "score": 30,
        "feedback": "Remember: Duty of care means protecting people even when they ask you not to. Explain this compassionately but follow through with safeguarding procedures."
      },
      "outcome_poor5": {
        "type": "outcome",
        "title": "Abandoning Support",
        "text": "Avoiding Mrs. Johnson during this difficult time could increase her distress and make her feel abandoned. Consistent, compassionate care is crucial during safeguarding investigations.",
        "score": 25,
        "feedback": "Continue providing normal care and support. Your consistent presence can provide stability during a difficult time."
      },
      "outcome_poor6": {
        "type": "outcome",
        "title": "Confidentiality Breach",
        "text": "Sharing details of a safeguarding investigation with other residents is a serious breach of confidentiality and could compromise the investigation.",
        "score": 15,
        "feedback": "Safeguarding information must remain confidential. Only share information with those who need to know as part of the investigation."
      },
      "outcome_good1": {
        "type": "outcome",
        "title": "Good Practice",
        "text": "You have followed correct safeguarding procedures while being sensitive to Mrs. Johnson concerns. Completing the form was the right action.",
        "score": 75,
        "feedback": "Well done! You balanced your duty of care with sensitivity to the individual feelings. Consider also explaining the process to help reduce anxiety."
      },
      "outcome_excellent": {
        "type": "outcome",
        "title": "Excellent Safeguarding Practice",
        "text": "Perfect! You have demonstrated excellent safeguarding practice by following procedures, supporting the individual, and maintaining professional boundaries throughout the process.",
        "score": 100,
        "feedback": "Outstanding work! You have shown how to balance duty of care, professional requirements, and compassionate support. This is exemplary safeguarding practice."
      }
    }
  }'
),
(
  'Medication Error Response',
  'Learn how to properly respond to medication errors through realistic scenarios. Practice critical decision-making skills.',
  'interactive',
  'advanced',
  'kinesthetic',
  ARRAY['medication', 'error-management', 'patient-safety'],
  0.78,
  '{
    "startNode": "med_scenario1",
    "nodes": {
      "med_scenario1": {
        "type": "scenario",
        "title": "Medication Error Discovery",
        "text": "You realize you have given Mr. Smith 10mg of his blood pressure medication instead of 5mg. He took the medication 30 minutes ago and is currently resting in his room. What is your immediate action?",
        "options": [
          {
            "text": "Wait to see if he shows any symptoms before taking action",
            "nextNode": "med_outcome_poor1"
          },
          {
            "text": "Immediately inform the nurse in charge and document the error",
            "nextNode": "med_scenario2"
          },
          {
            "text": "Give him half the dose next time to balance it out",
            "nextNode": "med_outcome_poor2"
          },
          {
            "text": "Check his blood pressure and monitor him closely without telling anyone",
            "nextNode": "med_outcome_poor3"
          }
        ]
      },
      "med_scenario2": {
        "type": "scenario",
        "title": "Immediate Response",
        "text": "Good! You have informed the nurse in charge. They ask you to monitor Mr. Smith vital signs while they contact the GP. Mr. Smith asks why you are checking his blood pressure again. How do you respond?",
        "options": [
          {
            "text": "Tell him there was a medication error and explain what happened",
            "nextNode": "med_scenario3"
          },
          {
            "text": "Say it is just routine monitoring",
            "nextNode": "med_outcome_poor4"
          },
          {
            "text": "Avoid answering and distract him with conversation",
            "nextNode": "med_outcome_poor5"
          }
        ]
      },
      "med_scenario3": {
        "type": "scenario",
        "title": "Honest Communication",
        "text": "You have been honest with Mr. Smith about the error. He is concerned but appreciates your honesty. The GP has been contacted and wants to speak with Mr. Smith. How do you complete this incident?",
        "options": [
          {
            "text": "Complete a detailed incident report and follow up on Mr. Smith condition",
            "nextNode": "med_outcome_excellent"
          },
          {
            "text": "Let the nurse handle the paperwork since you have done enough",
            "nextNode": "med_outcome_good1"
          },
          {
            "text": "Only document the basic facts to avoid getting in trouble",
            "nextNode": "med_outcome_poor6"
          }
        ]
      },
      "med_outcome_poor1": {
        "type": "outcome",
        "title": "Dangerous Delay",
        "text": "Waiting to see symptoms is dangerous. Medication errors require immediate action regardless of whether symptoms are present. Delayed response could have serious consequences.",
        "score": 15,
        "feedback": "Always report medication errors immediately. Early intervention can prevent serious complications."
      },
      "med_outcome_poor2": {
        "type": "outcome",
        "title": "Compounding the Error",
        "text": "Never attempt to balance out a medication error by adjusting future doses. This creates additional risks and is not your decision to make.",
        "score": 10,
        "feedback": "Medication errors must be reported immediately. Only qualified medical professionals can determine appropriate responses."
      },
      "med_outcome_poor3": {
        "type": "outcome",
        "title": "Inadequate Response",
        "text": "While monitoring is important, not reporting the error is a serious omission. Healthcare is a team effort - others need to know to provide appropriate care.",
        "score": 25,
        "feedback": "Always report medication errors immediately. Your colleagues and medical professionals need this information to ensure patient safety."
      },
      "med_outcome_poor4": {
        "type": "outcome",
        "title": "Lack of Transparency",
        "text": "Patients have a right to know about their care, including errors. Being dishonest damages trust and may prevent them from reporting important symptoms.",
        "score": 35,
        "feedback": "Honesty and transparency are fundamental to healthcare. Patients should be informed about errors in their care."
      },
      "med_outcome_poor5": {
        "type": "outcome",
        "title": "Avoiding Responsibility",
        "text": "Avoiding the question shows lack of professional responsibility. Patients deserve honest communication about their care.",
        "score": 30,
        "feedback": "Professional integrity requires honest communication with patients about their care, including when errors occur."
      },
      "med_outcome_poor6": {
        "type": "outcome",
        "title": "Incomplete Documentation",
        "text": "Incomplete incident reports compromise patient safety and learning opportunities. Full documentation helps prevent future errors.",
        "score": 45,
        "feedback": "Complete, honest documentation is essential for patient safety and continuous improvement in healthcare."
      },
      "med_outcome_good1": {
        "type": "outcome",
        "title": "Good Response",
        "text": "You handled the immediate situation well, but completing your own incident report is important for accountability and learning.",
        "score": 70,
        "feedback": "Good work on the immediate response. Remember that completing your own incident report is part of professional responsibility."
      },
      "med_outcome_excellent": {
        "type": "outcome",
        "title": "Exemplary Error Management",
        "text": "Perfect! You demonstrated excellent error management: immediate reporting, honest communication, thorough documentation, and ongoing monitoring. This is how medication errors should be handled.",
        "score": 100,
        "feedback": "Outstanding! You showed how to turn a medication error into a learning opportunity while maintaining patient safety and trust."
      }
    }
  }'
),
(
  'Emergency Response Training',
  'Practice emergency response procedures through realistic healthcare scenarios. Develop critical thinking under pressure.',
  'interactive',
  'advanced',
  'kinesthetic',
  ARRAY['emergency', 'first-aid', 'critical-thinking'],
  0.82,
  '{
    "startNode": "emergency_scenario1",
    "nodes": {
      "emergency_scenario1": {
        "type": "scenario",
        "title": "Resident Collapse",
        "text": "You find Mrs. Davies collapsed on the floor of her room. She is unconscious and not responding to your voice. What is your first action?",
        "options": [
          {
            "text": "Check for breathing and pulse while calling for help",
            "nextNode": "emergency_scenario2"
          },
          {
            "text": "Try to wake her up by shaking her shoulders",
            "nextNode": "emergency_outcome_poor1"
          },
          {
            "text": "Run to get the nurse without checking her condition",
            "nextNode": "emergency_outcome_poor2"
          },
          {
            "text": "Move her to a more comfortable position",
            "nextNode": "emergency_outcome_poor3"
          }
        ]
      },
      "emergency_scenario2": {
        "type": "scenario",
        "title": "Assessment Complete",
        "text": "Good! You have checked her breathing and pulse - she is breathing but her pulse is weak and rapid. Help is on the way. Mrs. Davies starts to regain consciousness but seems confused. What do you do next?",
        "options": [
          {
            "text": "Help her sit up to make her more comfortable",
            "nextNode": "emergency_outcome_poor4"
          },
          {
            "text": "Keep her lying down, reassure her, and monitor her vital signs",
            "nextNode": "emergency_scenario3"
          },
          {
            "text": "Give her some water to help her feel better",
            "nextNode": "emergency_outcome_poor5"
          }
        ]
      },
      "emergency_scenario3": {
        "type": "scenario",
        "title": "Ongoing Care",
        "text": "Excellent! You are keeping Mrs. Davies stable and comfortable. The nurse arrives and takes over medical care. Mrs. Davies is taken to hospital. How do you complete this incident?",
        "options": [
          {
            "text": "Write a detailed incident report and inform her family",
            "nextNode": "emergency_outcome_excellent"
          },
          {
            "text": "Let the nurse handle all the paperwork",
            "nextNode": "emergency_outcome_good1"
          },
          {
            "text": "Just make a brief note in the daily log",
            "nextNode": "emergency_outcome_poor6"
          }
        ]
      },
      "emergency_outcome_poor1": {
        "type": "outcome",
        "title": "Potentially Harmful Action",
        "text": "Shaking an unconscious person can cause injury, especially if they have a spinal injury. Always assess breathing and pulse first, and avoid unnecessary movement.",
        "score": 20,
        "feedback": "In emergencies, assess vital signs first. Avoid moving unconscious people unless absolutely necessary."
      },
      "emergency_outcome_poor2": {
        "type": "outcome",
        "title": "Incomplete Assessment",
        "text": "While getting help is important, you should quickly assess the person condition first. This information is vital for the emergency response.",
        "score": 40,
        "feedback": "Always do a quick assessment of breathing and pulse before leaving to get help. This information guides the emergency response."
      },
      "emergency_outcome_poor3": {
        "type": "outcome",
        "title": "Dangerous Movement",
        "text": "Moving an unconscious person without knowing the cause of collapse could worsen injuries, especially spinal injuries. Keep them still until help arrives.",
        "score": 15,
        "feedback": "Never move an unconscious person unless they are in immediate danger. Movement could cause serious injury."
      },
      "emergency_outcome_poor4": {
        "type": "outcome",
        "title": "Premature Position Change",
        "text": "Someone who has collapsed should remain lying down until medically assessed. Sitting them up could cause them to faint again or worsen their condition.",
        "score": 35,
        "feedback": "Keep people who have collapsed lying down until medical professionals assess them and determine it is safe to move."
      },
      "emergency_outcome_poor5": {
        "type": "outcome",
        "title": "Inappropriate Intervention",
        "text": "Never give food or drink to someone who has just regained consciousness after collapsing. They may have swallowing difficulties or other complications.",
        "score": 25,
        "feedback": "Do not give food or drink to someone who has collapsed until they have been medically assessed."
      },
      "emergency_outcome_poor6": {
        "type": "outcome",
        "title": "Inadequate Documentation",
        "text": "Emergency incidents require detailed documentation for legal, medical, and learning purposes. A brief note is insufficient.",
        "score": 45,
        "feedback": "Emergency incidents must be thoroughly documented. This information is crucial for ongoing care and incident analysis."
      },
      "emergency_outcome_good1": {
        "type": "outcome",
        "title": "Good Emergency Response",
        "text": "You handled the emergency well, but completing your own incident report is important for accountability and continuous improvement.",
        "score": 75,
        "feedback": "Good emergency response! Remember that your own detailed incident report is valuable for learning and improvement."
      },
      "emergency_outcome_excellent": {
        "type": "outcome",
        "title": "Exemplary Emergency Management",
        "text": "Perfect! You demonstrated excellent emergency response: proper assessment, appropriate care, effective communication, and thorough documentation. This is textbook emergency management.",
        "score": 100,
        "feedback": "Outstanding emergency response! You showed how to manage an emergency professionally while ensuring the best possible outcome for the resident."
      }
    }
  }'
)
ON CONFLICT (id) DO NOTHING;
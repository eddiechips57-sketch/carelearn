/*
  # Create Courses Table

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `course_title` (text)
      - `provider_id` (uuid, FK to course_providers)
      - `qualification_level` (text) - Entry, L1-L7, HE_UG, HE_PG
      - `awarding_body` (text)
      - `funding_tags` (jsonb) - array of funding scheme identifiers
      - `cost_gbp` (decimal, nullable - null = free)
      - `duration_weeks` (integer)
      - `delivery_mode` (text)
      - `course_url` (text)
      - `occupation_ids` (jsonb) - which occupation_levels this course serves
      - `competency_ids` (jsonb) - which competencies this satisfies
      - `is_active` (boolean)
      - `intake_months` (jsonb) - e.g., [1, 4, 9]
      - `last_verified_date` (date)
      - `description` (text)
      - `created_at` / `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Public read access for course browsing

  3. Indexes
    - Index on provider_id, qualification_level, delivery_mode, is_active
*/

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_title text NOT NULL,
  provider_id uuid REFERENCES course_providers(id),
  qualification_level text NOT NULL DEFAULT 'Entry',
  awarding_body text DEFAULT '',
  funding_tags jsonb DEFAULT '[]'::jsonb,
  cost_gbp decimal(8,2),
  duration_weeks integer DEFAULT 0,
  delivery_mode text NOT NULL DEFAULT 'online',
  course_url text DEFAULT '',
  occupation_ids jsonb DEFAULT '[]'::jsonb,
  competency_ids jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  intake_months jsonb DEFAULT '[]'::jsonb,
  last_verified_date date DEFAULT CURRENT_DATE,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT courses_level_check CHECK (qualification_level IN ('Entry', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'HE_UG', 'HE_PG')),
  CONSTRAINT courses_mode_check CHECK (delivery_mode IN ('online', 'blended', 'in_person', 'apprenticeship', 'distance_learning'))
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active courses"
  ON courses
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE INDEX IF NOT EXISTS idx_courses_provider ON courses(provider_id);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(qualification_level);
CREATE INDEX IF NOT EXISTS idx_courses_mode ON courses(delivery_mode);
CREATE INDEX IF NOT EXISTS idx_courses_active ON courses(is_active) WHERE is_active = true;

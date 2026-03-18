/*
  # Create Occupation Levels Table

  1. New Tables
    - `occupation_levels`
      - `id` (uuid, primary key)
      - `occupation_title` (text) - e.g., 'Healthcare Support Worker'
      - `pillar` (text) - one of: adult_social_care, nursing_midwifery, clinical_support, allied_health
      - `nhs_band` (text, nullable) - e.g., 'Band 3', 'Band 6'
      - `agenda_for_change` (boolean) - Is this an AfC role?
      - `skills_for_care_category` (text, nullable)
      - `regulatory_body` (text) - NMC, HCPC, SWE, or none
      - `minimum_qualification` (text)
      - `typical_salary_range_gbp` (text) - e.g., '£22,816 - £24,336'
      - `job_vacancy_index` (integer) - Updated monthly
      - `slug` (text, unique) - for SEO URLs
      - `description` (text) - role description
      - `responsibilities` (text[]) - key responsibilities
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `occupation_levels` table
    - Add policy for public read access (unauthenticated users can browse roles)

  3. Indexes
    - Index on pillar for filtering
    - Index on slug for lookups
    - Index on regulatory_body for filtering
*/

CREATE TABLE IF NOT EXISTS occupation_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occupation_title text NOT NULL,
  pillar text NOT NULL DEFAULT 'adult_social_care',
  nhs_band text,
  agenda_for_change boolean DEFAULT false,
  skills_for_care_category text,
  regulatory_body text NOT NULL DEFAULT 'none',
  minimum_qualification text NOT NULL DEFAULT '',
  typical_salary_range_gbp text NOT NULL DEFAULT '',
  job_vacancy_index integer DEFAULT 0,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  responsibilities text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT occupation_levels_pillar_check CHECK (pillar IN ('adult_social_care', 'nursing_midwifery', 'clinical_support', 'allied_health')),
  CONSTRAINT occupation_levels_regulatory_body_check CHECK (regulatory_body IN ('NMC', 'HCPC', 'SWE', 'none'))
);

ALTER TABLE occupation_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view occupation levels"
  ON occupation_levels
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_occupation_levels_pillar ON occupation_levels(pillar);
CREATE INDEX IF NOT EXISTS idx_occupation_levels_slug ON occupation_levels(slug);
CREATE INDEX IF NOT EXISTS idx_occupation_levels_regulatory_body ON occupation_levels(regulatory_body);

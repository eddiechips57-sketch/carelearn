/*
  # Create Required Competencies, Career Pathways, and Funding Schemes Tables

  1. New Tables
    - `required_competencies` - Skills/competencies linked to occupations
      - `id` (uuid, primary key)
      - `occupation_id` (uuid, FK to occupation_levels)
      - `competency_name` (text)
      - `competency_type` (text) - mandatory, desirable, regulatory
      - `framework_source` (text)
      - `linked_qualification_id` (uuid, nullable)

    - `career_pathways` - Roadmap engine linking from/to occupations
      - `id` (uuid, primary key)
      - `from_occupation_id` (uuid, FK)
      - `to_occupation_id` (uuid, FK)
      - `pathway_type` (text) - standard, accelerated, apprenticeship, degree_apprenticeship
      - `steps` (jsonb) - ordered array of step objects
      - `estimated_total_months_min` (integer)
      - `estimated_total_months_max` (integer)
      - `editorial_notes` (text)
      - `title` (text)
      - `slug` (text, unique)

    - `funding_schemes` - UK funding scheme reference data
      - `id` (uuid, primary key)
      - `scheme_name` (text)
      - `slug` (text, unique)
      - `short_description` (text)
      - `full_description` (text)
      - `eligibility_rules` (jsonb)
      - `max_amount_gbp` (text)
      - `application_url` (text)
      - `is_active` (boolean)

    - `career_guides` - SEO-optimised flagship career guide articles
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `target_keyword` (text)
      - `opening_paragraph` (text)
      - `at_a_glance` (jsonb) - duration, cost, funding, regulatory body, salary
      - `steps` (jsonb) - HowTo steps array
      - `funding_section` (text)
      - `faq` (jsonb) - array of {question, answer}
      - `related_guide_ids` (jsonb)
      - `from_occupation_id` (uuid, FK)
      - `to_occupation_id` (uuid, FK)
      - `hero_image_url` (text)
      - `is_published` (boolean)

  2. Security
    - Enable RLS on all tables
    - Public read access for all reference data

  3. Indexes
    - Competencies: index on occupation_id
    - Pathways: indexes on from/to occupation IDs and slug
    - Guides: index on slug, is_published
*/

-- Required Competencies
CREATE TABLE IF NOT EXISTS required_competencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occupation_id uuid REFERENCES occupation_levels(id),
  competency_name text NOT NULL,
  competency_type text NOT NULL DEFAULT 'mandatory',
  framework_source text DEFAULT '',
  linked_qualification_id uuid,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT competency_type_check CHECK (competency_type IN ('mandatory', 'desirable', 'regulatory'))
);

ALTER TABLE required_competencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view competencies"
  ON required_competencies
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_competencies_occupation ON required_competencies(occupation_id);

-- Career Pathways
CREATE TABLE IF NOT EXISTS career_pathways (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_occupation_id uuid REFERENCES occupation_levels(id),
  to_occupation_id uuid REFERENCES occupation_levels(id),
  pathway_type text NOT NULL DEFAULT 'standard',
  steps jsonb DEFAULT '[]'::jsonb,
  estimated_total_months_min integer DEFAULT 0,
  estimated_total_months_max integer DEFAULT 0,
  editorial_notes text DEFAULT '',
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT pathway_type_check CHECK (pathway_type IN ('standard', 'accelerated', 'apprenticeship', 'degree_apprenticeship'))
);

ALTER TABLE career_pathways ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view career pathways"
  ON career_pathways
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_pathways_from ON career_pathways(from_occupation_id);
CREATE INDEX IF NOT EXISTS idx_pathways_to ON career_pathways(to_occupation_id);
CREATE INDEX IF NOT EXISTS idx_pathways_slug ON career_pathways(slug);

-- Funding Schemes
CREATE TABLE IF NOT EXISTS funding_schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_name text NOT NULL,
  slug text UNIQUE NOT NULL,
  short_description text DEFAULT '',
  full_description text DEFAULT '',
  eligibility_rules jsonb DEFAULT '{}'::jsonb,
  max_amount_gbp text DEFAULT '',
  application_url text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE funding_schemes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view funding schemes"
  ON funding_schemes
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Career Guides
CREATE TABLE IF NOT EXISTS career_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  target_keyword text DEFAULT '',
  opening_paragraph text DEFAULT '',
  at_a_glance jsonb DEFAULT '{}'::jsonb,
  steps jsonb DEFAULT '[]'::jsonb,
  funding_section text DEFAULT '',
  faq jsonb DEFAULT '[]'::jsonb,
  related_guide_ids jsonb DEFAULT '[]'::jsonb,
  from_occupation_id uuid REFERENCES occupation_levels(id),
  to_occupation_id uuid REFERENCES occupation_levels(id),
  hero_image_url text DEFAULT '',
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE career_guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published guides"
  ON career_guides
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE INDEX IF NOT EXISTS idx_guides_slug ON career_guides(slug);
CREATE INDEX IF NOT EXISTS idx_guides_published ON career_guides(is_published) WHERE is_published = true;

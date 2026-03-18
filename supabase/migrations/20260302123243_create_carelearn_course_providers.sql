/*
  # Create Course Providers Table

  1. New Tables
    - `course_providers`
      - `id` (uuid, primary key)
      - `provider_name` (text)
      - `provider_type` (text) - university, college, private_training, awarding_body, nhs_trust, charity
      - `ofsted_rating` (text, nullable)
      - `regions_served` (jsonb) - list of UK regions or 'National'
      - `delivery_modes` (jsonb) - ['online','blended','in_person','apprenticeship']
      - `is_featured` (boolean) - paid Featured Provider status
      - `lead_gen_tier` (text) - standard, premium, exclusive
      - `tracking_url` (text) - affiliate/UTM link
      - `logo_url` (text)
      - `website_url` (text)
      - `description` (text)
      - `last_verified_date` (date)
      - `created_at` / `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Public read access for browsing providers

  3. Indexes
    - Index on provider_type, is_featured
*/

CREATE TABLE IF NOT EXISTS course_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name text NOT NULL,
  provider_type text NOT NULL DEFAULT 'private_training',
  ofsted_rating text,
  regions_served jsonb DEFAULT '["National"]'::jsonb,
  delivery_modes jsonb DEFAULT '["online"]'::jsonb,
  is_featured boolean DEFAULT false,
  lead_gen_tier text NOT NULL DEFAULT 'standard',
  tracking_url text DEFAULT '',
  logo_url text DEFAULT '',
  website_url text DEFAULT '',
  description text DEFAULT '',
  last_verified_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT course_providers_type_check CHECK (provider_type IN ('university', 'college', 'private_training', 'awarding_body', 'nhs_trust', 'charity')),
  CONSTRAINT course_providers_tier_check CHECK (lead_gen_tier IN ('standard', 'premium', 'exclusive'))
);

ALTER TABLE course_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view course providers"
  ON course_providers
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_course_providers_type ON course_providers(provider_type);
CREATE INDEX IF NOT EXISTS idx_course_providers_featured ON course_providers(is_featured) WHERE is_featured = true;

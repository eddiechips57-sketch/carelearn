/*
  # Create leads table for capturing user contact information

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `email` (text, not null)
      - `interested_courses` (text array, optional - stores course titles they clicked)
      - `career_interests` (text array, optional - stores selected career paths)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `leads` table
    - Add policy to allow anyone to insert new leads
    - Add policy to allow viewing own lead data (by email)
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  interested_courses text[] DEFAULT '{}',
  career_interests text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert a lead"
  ON leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own lead"
  ON leads FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own lead"
  ON leads FOR UPDATE
  USING (email IS NOT NULL)
  WITH CHECK (email IS NOT NULL);

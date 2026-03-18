/*
  # Create podcasts table and storage

  1. New Tables
    - `podcasts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `audio_url` (text)
      - `duration` (integer)
      - `published_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `podcasts` table
    - Add policies for authenticated users to manage podcasts
*/

DO $$ 
BEGIN
  -- Create the podcasts table if it doesn't exist
  CREATE TABLE IF NOT EXISTS podcasts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    audio_url text NOT NULL,
    duration integer DEFAULT 0,
    published_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- Enable RLS
  ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Anyone can view podcasts" ON podcasts;
  DROP POLICY IF EXISTS "Authenticated users can manage podcasts" ON podcasts;

  -- Create new policies
  CREATE POLICY "Anyone can view podcasts"
    ON podcasts
    FOR SELECT
    TO public
    USING (true);

  CREATE POLICY "Authenticated users can manage podcasts"
    ON podcasts
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error creating podcasts table: %', SQLERRM;
    RAISE;
END $$;
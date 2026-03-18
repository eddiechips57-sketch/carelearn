/*
  # Create podcasts table

  1. New Tables
    - `podcasts`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `audio_url` (text, required)
      - `duration` (integer, default: 0)
      - `published_at` (timestamptz, default: now())
      - `created_at` (timestamptz, default: now())
      - `updated_at` (timestamptz, default: now())

  2. Security
    - Enable RLS on `podcasts` table
    - Add policy for public to view podcasts
    - Add policy for admin to manage podcasts
*/

DO $$ 
BEGIN
  -- Create podcasts table if it doesn't exist
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

  -- Enable Row Level Security
  ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Anyone can view podcasts" ON podcasts;
  DROP POLICY IF EXISTS "Only admins can manage podcasts" ON podcasts;

  -- Create policy for public viewing
  CREATE POLICY "Anyone can view podcasts"
    ON podcasts
    FOR SELECT
    TO public
    USING (true);

  -- Create policy for admin management
  CREATE POLICY "Only admins can manage podcasts"
    ON podcasts
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM auth.users
        WHERE email = 'admin@carelearn.uk'
        AND id = auth.uid()
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM auth.users
        WHERE email = 'admin@carelearn.uk'
        AND id = auth.uid()
      )
    );

EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error creating podcasts table and policies: %', SQLERRM;
    RAISE;
END $$;
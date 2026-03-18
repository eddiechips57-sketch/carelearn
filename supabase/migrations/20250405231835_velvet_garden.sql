/*
  # Create storage bucket for podcast files

  1. Changes
    - Create a new public bucket for podcasts using storage schema
    - Set up storage policies for admin-only uploads
    - Handle existing policies gracefully
*/

DO $$ 
BEGIN
  -- Create a new public bucket for podcasts if it doesn't exist
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'podcasts',
    'podcasts',
    true,
    524288000, -- 500MB limit
    ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']::text[]
  )
  ON CONFLICT (id) DO UPDATE SET
    file_size_limit = 524288000,
    allowed_mime_types = ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']::text[];

  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Public Access" ON storage.objects;
  DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;
  DROP POLICY IF EXISTS "Admin Delete Access" ON storage.objects;

  -- Create new policies with unique names to avoid conflicts
  CREATE POLICY "Podcast Files Public Access"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'podcasts');

  CREATE POLICY "Podcast Files Admin Upload Access"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
      EXISTS (
        SELECT 1
        FROM auth.users
        WHERE auth.users.email = 'admin@carelearn.uk'
        AND auth.users.id = auth.uid()
      )
      AND bucket_id = 'podcasts'
    );

  CREATE POLICY "Podcast Files Admin Delete Access"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1
        FROM auth.users
        WHERE auth.users.email = 'admin@carelearn.uk'
        AND auth.users.id = auth.uid()
      )
      AND bucket_id = 'podcasts'
    );

EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error creating storage bucket and policies: %', SQLERRM;
    RAISE;
END $$;
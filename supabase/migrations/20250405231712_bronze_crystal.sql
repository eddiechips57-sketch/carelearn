/*
  # Update podcast policies for admin-only uploads

  1. Changes
    - Remove general authenticated user upload policy
    - Add admin-only upload policy
    - Keep public viewing policy

  2. Security
    - Only admins can create/update/delete podcasts
    - Anyone can view podcasts
*/

DO $$ 
BEGIN
  -- First, drop the existing policy that allows all authenticated users to manage podcasts
  DROP POLICY IF EXISTS "Authenticated users can manage podcasts" ON podcasts;
  DROP POLICY IF EXISTS "Only admins can manage podcasts" ON podcasts;

  -- Create a new policy that only allows admins to manage podcasts
  CREATE POLICY "Only admins can manage podcasts"
    ON podcasts
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1
        FROM auth.users
        WHERE auth.users.email = 'admin@carelearn.uk'
        AND auth.users.id = auth.uid()
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1
        FROM auth.users
        WHERE auth.users.email = 'admin@carelearn.uk'
        AND auth.users.id = auth.uid()
      )
    );

EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error updating podcast policies: %', SQLERRM;
    RAISE;
END $$;
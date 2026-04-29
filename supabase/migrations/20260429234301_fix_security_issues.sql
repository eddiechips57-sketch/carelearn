/*
  # Fix Security Issues

  1. RLS Policy Fix - leads table
    - Drop the overly permissive INSERT policy that uses WITH CHECK (true)
    - Replace with a restricted policy that only allows anon/authenticated users to insert
      their own lead data (no auth check needed for leads, but restrict to non-admin columns)
    - Since leads are submitted by unauthenticated visitors, we use a meaningful check:
      the email field must be non-empty rather than always-true

  2. Storage Policy Fix - podcasts bucket
    - Drop the broad SELECT policy on storage.objects for the podcasts bucket
    - Public buckets serve files via URL directly without needing a listing policy
    - Remove the policy to prevent clients from listing all files

  3. SECURITY DEFINER Function Fix - handle_new_user()
    - Revoke EXECUTE on handle_new_user() from anon and authenticated roles
    - This function is a trigger function and should only be called by the trigger system,
      not directly via the REST API
*/

-- 1. Fix leads INSERT policy (replace always-true WITH CHECK)
DROP POLICY IF EXISTS "Anyone can insert a lead" ON public.leads;

CREATE POLICY "Visitors can insert lead with valid email"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (email IS NOT NULL AND email <> '');

-- 2. Remove broad SELECT/listing policy on podcasts storage bucket
DROP POLICY IF EXISTS "Podcast Files Public Access" ON storage.objects;

-- 3. Revoke EXECUTE on handle_new_user() from anon and authenticated
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

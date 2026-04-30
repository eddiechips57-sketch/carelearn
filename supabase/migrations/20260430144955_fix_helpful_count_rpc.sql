/*
  # Replace permissive helpful_count UPDATE policy with a SECURITY DEFINER RPC

  ## Problem
  The "Anyone can increment helpful count" policy had `USING (true)`, meaning
  any anon or authenticated user could UPDATE any row in community_questions
  (not just helpful_count — all columns were writable through this policy).

  ## Changes
  1. Drop the two conflicting UPDATE policies for anon/authenticated on community_questions
  2. Re-create the admin UPDATE policy only (no change to its logic)
  3. Create a SECURITY DEFINER function `increment_question_helpful(question_id uuid)`
     that atomically increments helpful_count by exactly 1 — this is the only
     mutation path available to unauthenticated users.

  ## Security Notes
  - Direct UPDATE access for anon/authenticated on community_questions is fully removed.
  - The RPC function executes as the function owner (postgres), so it bypasses RLS
    only for the single atomic increment it performs — no other columns are touched.
  - REVOKE/GRANT ensures anon and authenticated roles can call the function.
*/

-- 1. Drop the overly permissive policies
DROP POLICY IF EXISTS "Anyone can increment helpful count" ON community_questions;
DROP POLICY IF EXISTS "Admin can update question status" ON community_questions;

-- 2. Re-create clean admin-only UPDATE policy
CREATE POLICY "Admin can update question status"
  ON community_questions FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'email') = 'carelearnuk@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'carelearnuk@gmail.com');

-- 3. Create a locked-down increment function
CREATE OR REPLACE FUNCTION increment_question_helpful(question_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE community_questions
  SET helpful_count = helpful_count + 1
  WHERE id = question_id;
$$;

-- Allow anon and authenticated to call it
REVOKE ALL ON FUNCTION increment_question_helpful(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_question_helpful(uuid) TO anon, authenticated;

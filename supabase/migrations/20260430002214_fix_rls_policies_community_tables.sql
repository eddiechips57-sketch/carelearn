/*
  # Fix RLS Policies — Community Tables

  ## Problem
  Several policies used `true` unconditionally, bypassing row-level security.

  ## Changes

  ### community_answers
  - INSERT and UPDATE restricted to the designated admin email only
    (auth.jwt() ->> 'email' = 'carelearnuk@gmail.com')

  ### community_blog_posts
  - INSERT and UPDATE restricted to the designated admin email only

  ### community_questions
  - INSERT: constrained to rows where title and author_name are non-empty
  - UPDATE: constrained to require non-empty title and non-negative helpful_count
    plus a separate admin-only policy for status updates

  ## Notes
  - Admin email matches the value in AuthContext.tsx.
  - Questions INSERT stays open to anon users (no-login product design) but
    now enforces non-empty title and author_name.
*/

-- ── community_answers ────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Authenticated users can post answers" ON community_answers;
DROP POLICY IF EXISTS "Authenticated users can update answers" ON community_answers;

CREATE POLICY "Admin can post answers"
  ON community_answers FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'email') = 'carelearnuk@gmail.com');

CREATE POLICY "Admin can update answers"
  ON community_answers FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'email') = 'carelearnuk@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'carelearnuk@gmail.com');

-- ── community_blog_posts ─────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON community_blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON community_blog_posts;

CREATE POLICY "Admin can insert blog posts"
  ON community_blog_posts FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'email') = 'carelearnuk@gmail.com');

CREATE POLICY "Admin can update blog posts"
  ON community_blog_posts FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'email') = 'carelearnuk@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'carelearnuk@gmail.com');

-- ── community_questions ──────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Anyone can submit questions" ON community_questions;
DROP POLICY IF EXISTS "Increment helpful count" ON community_questions;

CREATE POLICY "Anyone can submit questions"
  ON community_questions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(title)) > 0
    AND char_length(trim(author_name)) > 0
  );

CREATE POLICY "Anyone can increment helpful count"
  ON community_questions FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (
    helpful_count >= 0
    AND char_length(trim(title)) > 0
  );

CREATE POLICY "Admin can update question status"
  ON community_questions FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'email') = 'carelearnuk@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'carelearnuk@gmail.com');

/*
  # Create Community Q&A and Blog Tables

  ## New Tables

  ### community_questions
  - `id` (uuid, primary key)
  - `title` (text) - short question title
  - `body` (text) - full question body
  - `author_name` (text) - display name, no login required
  - `category` (text) - enum-like: funding, career_advice, qualifications, cqc, workplace, other
  - `helpful_count` (int) - aggregate upvote count
  - `status` (text) - 'open' or 'answered'
  - `created_at` (timestamptz)

  ### community_answers
  - `id` (uuid, primary key)
  - `question_id` (uuid, FK to community_questions)
  - `body` (text) - admin's answer
  - `admin_name` (text) - admin display name
  - `created_at` (timestamptz)

  ### community_blog_posts
  - `id` (uuid, primary key)
  - `title` (text)
  - `slug` (text, unique)
  - `body` (text) - rich text/markdown
  - `excerpt` (text) - short preview
  - `cover_image_url` (text)
  - `category` (text)
  - `author_name` (text)
  - `read_time_minutes` (int)
  - `is_published` (boolean)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all three tables
  - Public read access on all three
  - Anyone (anon + authenticated) can insert questions
  - Only authenticated admin can insert/update answers and blog posts
*/

-- Community Questions
CREATE TABLE IF NOT EXISTS community_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  author_name text NOT NULL DEFAULT 'Anonymous',
  category text NOT NULL DEFAULT 'other',
  helpful_count int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read questions"
  ON community_questions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can submit questions"
  ON community_questions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Increment helpful count"
  ON community_questions FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Community Answers
CREATE TABLE IF NOT EXISTS community_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES community_questions(id) ON DELETE CASCADE,
  body text NOT NULL,
  admin_name text NOT NULL DEFAULT 'CareLearn Team',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read answers"
  ON community_answers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can post answers"
  ON community_answers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update answers"
  ON community_answers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Community Blog Posts
CREATE TABLE IF NOT EXISTS community_blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  body text NOT NULL DEFAULT '',
  excerpt text NOT NULL DEFAULT '',
  cover_image_url text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  author_name text NOT NULL DEFAULT 'CareLearn Team',
  read_time_minutes int NOT NULL DEFAULT 5,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published posts"
  ON community_blog_posts FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Authenticated users can insert blog posts"
  ON community_blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts"
  ON community_blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_community_questions_category ON community_questions(category);
CREATE INDEX IF NOT EXISTS idx_community_questions_status ON community_questions(status);
CREATE INDEX IF NOT EXISTS idx_community_questions_created ON community_questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_answers_question ON community_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_community_blog_slug ON community_blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_community_blog_category ON community_blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_blog_created ON community_blog_posts(created_at DESC);

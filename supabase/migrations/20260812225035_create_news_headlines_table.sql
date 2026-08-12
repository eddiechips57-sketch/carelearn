/*
# Create news_headlines cache table

1. New Tables
  - `news_headlines`
    - `id` (uuid, primary key)
    - `title` (text, not null) — the headline text
    - `url` (text, not null) — link to original article
    - `source_name` (text, not null) — e.g. "CQC", "gov.uk", "NHS England"
    - `published_at` (timestamptz) — original publish date if available
    - `fetched_at` (timestamptz, default now()) — when we cached this headline
2. Security
  - Enable RLS on `news_headlines`.
  - Allow anon + authenticated SELECT (public read, no sign-in required).
  - No INSERT/UPDATE/DELETE policies for public roles — only the service role (edge function) writes.
*/

CREATE TABLE IF NOT EXISTS news_headlines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  source_name text NOT NULL,
  published_at timestamptz,
  fetched_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE news_headlines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_news_headlines" ON news_headlines;
CREATE POLICY "anon_select_news_headlines" ON news_headlines FOR SELECT
  TO anon, authenticated USING (true);

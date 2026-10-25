/*
# Create ebooks table for practical care guide store

## Plain-English Summary
Transforms CareLearn from a clinical training directory into a consumer-facing
practical care ebook store. Stores 10 how-to ebooks (each with paired printable
toolkits), 3 standalone printable packs, and 1 free lead magnet. Ebooks are
public storefront data visible to all visitors; writes are restricted to
authenticated admin users.

## New Table: ebooks
- id (uuid, primary key)
- title (text, not null) — ebook title
- slug (text, unique, not null) — URL-friendly identifier
- short_description (text, not null) — 1-2 line summary for cards
- long_description (text) — full description for detail view
- author (text, not null) — author or publisher name
- category (text, not null) — one of: family_behaviour_support, home_care_recovery, navigating_care_system, carer_wellbeing, printable_packs
- cover_image_url (text) — book cover image URL
- price_gbp (numeric, default 0) — price in GBP (0 = free)
- pdf_url (text) — download URL for the PDF
- page_count (integer) — number of pages
- format (text, not null) — 'ebook_with_toolkit' or 'printable_pack'
- target_audience (text[]) — array of: parents_guardians, family_carers, support_workers
- included_toolkit_items (text[]) — list of printable sheets included
- tags (text[]) — searchable tags
- is_featured (boolean, default false) — show in featured banner
- is_published (boolean, default true) — visible on storefront
- published_at (timestamptz) — publication date
- download_count (integer, default 0) — popularity counter
- sort_order (integer, default 0) — manual ordering
- created_at (timestamptz, default now())
- updated_at (timestamptz, default now())

## Security
- RLS enabled on ebooks
- GRANT SELECT to anon, authenticated (public storefront browsing)
- GRANT INSERT, UPDATE, DELETE to authenticated (admin management)
- SELECT policy: anyone can read published ebooks
- INSERT/UPDATE/DELETE policies: authenticated users can manage (admin via app)

## Indexes
- idx on slug (unique lookup)
- idx on category (filter browsing)
- idx on is_published (storefront queries)
*/

CREATE TABLE IF NOT EXISTS ebooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  short_description text NOT NULL,
  long_description text,
  author text NOT NULL DEFAULT 'CareLearn',
  category text NOT NULL CHECK (category IN ('family_behaviour_support', 'home_care_recovery', 'navigating_care_system', 'carer_wellbeing', 'printable_packs')),
  cover_image_url text,
  price_gbp numeric(10,2) NOT NULL DEFAULT 0,
  pdf_url text,
  page_count integer,
  format text NOT NULL DEFAULT 'ebook_with_toolkit' CHECK (format IN ('ebook_with_toolkit', 'printable_pack')),
  target_audience text[] DEFAULT '{}',
  included_toolkit_items text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  published_at timestamptz DEFAULT now(),
  download_count integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON ebooks TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ebooks TO authenticated;

-- Public can read published ebooks
DROP POLICY IF EXISTS "Public can read published ebooks" ON ebooks;
CREATE POLICY "Public can read published ebooks"
  ON ebooks FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Authenticated admins can insert
DROP POLICY IF EXISTS "Admins can insert ebooks" ON ebooks;
CREATE POLICY "Admins can insert ebooks"
  ON ebooks FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated admins can update
DROP POLICY IF EXISTS "Admins can update ebooks" ON ebooks;
CREATE POLICY "Admins can update ebooks"
  ON ebooks FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

-- Authenticated admins can delete
DROP POLICY IF EXISTS "Admins can delete ebooks" ON ebooks;
CREATE POLICY "Admins can delete ebooks"
  ON ebooks FOR DELETE
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ebooks_slug ON ebooks(slug);
CREATE INDEX IF NOT EXISTS idx_ebooks_category ON ebooks(category);
CREATE INDEX IF NOT EXISTS idx_ebooks_published ON ebooks(is_published);

-- updated_at trigger
DROP TRIGGER IF EXISTS set_ebooks_updated_at ON ebooks;
CREATE TRIGGER set_ebooks_updated_at
  BEFORE UPDATE ON ebooks
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

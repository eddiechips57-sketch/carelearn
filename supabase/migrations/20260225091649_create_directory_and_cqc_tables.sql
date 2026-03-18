/*
  # Healthcare Directory & CQC Hub Schema

  1. New Tables
    - `directory_categories`
      - `id` (uuid, primary key)
      - `name` (text) - Category name (e.g., "Residential Care", "Domiciliary Care")
      - `slug` (text, unique) - URL-friendly identifier
      - `description` (text) - Category description
      - `icon` (text) - Lucide icon name
      - `display_order` (integer) - Sort ordering
      - `created_at` (timestamptz)

    - `directory_listings`
      - `id` (uuid, primary key)
      - `name` (text) - Company/organization name
      - `slug` (text, unique) - URL-friendly identifier
      - `description` (text) - Short description
      - `long_description` (text) - Detailed description
      - `category_id` (uuid, FK) - Link to category
      - `website` (text) - Company website
      - `phone` (text) - Contact phone
      - `email` (text) - Contact email
      - `address` (text) - Physical address
      - `city` (text) - City
      - `region` (text) - UK region
      - `postcode` (text) - UK postcode
      - `cqc_rating` (text) - CQC rating if applicable
      - `cqc_location_id` (text) - CQC location identifier
      - `services` (text[]) - Services offered
      - `logo_url` (text) - Company logo
      - `cover_image_url` (text) - Cover image
      - `is_featured` (boolean) - Featured listing flag
      - `is_verified` (boolean) - Verified listing flag
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `cqc_tips`
      - `id` (uuid, primary key)
      - `title` (text) - Tip title
      - `slug` (text, unique) - URL-friendly identifier
      - `summary` (text) - Short summary
      - `content` (text) - Full content/article
      - `category` (text) - Category (inspection-prep, compliance, ratings, best-practice)
      - `difficulty` (text) - beginner, intermediate, advanced
      - `tags` (text[]) - Searchable tags
      - `author` (text) - Author name
      - `image_url` (text) - Article image
      - `is_featured` (boolean) - Featured flag
      - `view_count` (integer) - Read tracking
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `industry_news`
      - `id` (uuid, primary key)
      - `title` (text) - News headline
      - `summary` (text) - Brief summary
      - `content` (text) - Full content
      - `source` (text) - Source name
      - `source_url` (text) - Original article URL
      - `image_url` (text) - Article image
      - `category` (text) - News category
      - `is_featured` (boolean)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all new tables
    - Public read access for directory, CQC tips, and news
    - Authenticated users can submit listings (pending review)

  3. Indexes
    - directory_listings: category_id, region, city, is_featured
    - cqc_tips: category, is_featured
    - industry_news: is_featured, published_at
*/

-- Directory Categories
CREATE TABLE IF NOT EXISTS directory_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT 'Building2',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE directory_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view directory categories"
  ON directory_categories FOR SELECT
  TO authenticated, anon
  USING (true);

-- Directory Listings
CREATE TABLE IF NOT EXISTS directory_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  long_description text DEFAULT '',
  category_id uuid REFERENCES directory_categories(id),
  website text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  address text DEFAULT '',
  city text DEFAULT '',
  region text DEFAULT '',
  postcode text DEFAULT '',
  cqc_rating text DEFAULT '',
  cqc_location_id text DEFAULT '',
  services text[] DEFAULT '{}',
  logo_url text DEFAULT '',
  cover_image_url text DEFAULT '',
  is_featured boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  submitted_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE directory_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view directory listings"
  ON directory_listings FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can submit listings"
  ON directory_listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can update own submissions"
  ON directory_listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = submitted_by)
  WITH CHECK (auth.uid() = submitted_by);

-- CQC Tips
CREATE TABLE IF NOT EXISTS cqc_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  summary text DEFAULT '',
  content text DEFAULT '',
  category text NOT NULL DEFAULT 'best-practice',
  difficulty text DEFAULT 'beginner',
  tags text[] DEFAULT '{}',
  author text DEFAULT '',
  image_url text DEFAULT '',
  is_featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cqc_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view CQC tips"
  ON cqc_tips FOR SELECT
  TO authenticated, anon
  USING (true);

-- Industry News
CREATE TABLE IF NOT EXISTS industry_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text DEFAULT '',
  content text DEFAULT '',
  source text DEFAULT '',
  source_url text DEFAULT '',
  image_url text DEFAULT '',
  category text DEFAULT 'general',
  is_featured boolean DEFAULT false,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE industry_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view industry news"
  ON industry_news FOR SELECT
  TO authenticated, anon
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_directory_listings_category ON directory_listings(category_id);
CREATE INDEX IF NOT EXISTS idx_directory_listings_region ON directory_listings(region);
CREATE INDEX IF NOT EXISTS idx_directory_listings_city ON directory_listings(city);
CREATE INDEX IF NOT EXISTS idx_directory_listings_featured ON directory_listings(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_cqc_tips_category ON cqc_tips(category);
CREATE INDEX IF NOT EXISTS idx_cqc_tips_featured ON cqc_tips(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_industry_news_featured ON industry_news(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_industry_news_published ON industry_news(published_at DESC);

-- Trigger for updated_at on directory_listings
CREATE OR REPLACE TRIGGER set_directory_listings_updated_at
  BEFORE UPDATE ON directory_listings
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Trigger for updated_at on cqc_tips
CREATE OR REPLACE TRIGGER set_cqc_tips_updated_at
  BEFORE UPDATE ON cqc_tips
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
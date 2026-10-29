/*
# Add linked_ebook_id to community_blog_posts

## Purpose
Each blog article can now be linked to the most relevant ebook to promote in a contextual upsell banner at the bottom of the article. This powers the content-led SEO funnel: a free article answers a panic-driven search question, and the banner offers the matching paid ebook as the complete step-by-step resource.

## Changes
1. New column on `community_blog_posts`:
   - `linked_ebook_id` (uuid, nullable) — references ebooks(id). Nullable so existing and generic articles don't require a linked product.
2. Foreign key constraint with ON DELETE SET NULL so deleting an ebook doesn't break articles.
3. Index on `linked_ebook_id` for fast banner lookups.
4. No RLS or grant changes — the column is read through the existing public SELECT policy on community_blog_posts and the existing public SELECT policy on ebooks. The new column is covered by the existing table-level grants.

## Notes
- Idempotent: uses DO $$ ... IF NOT EXISTS ... END $$ to avoid errors on re-run.
- No data loss: purely additive.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'community_blog_posts'
      AND column_name = 'linked_ebook_id'
  ) THEN
    ALTER TABLE community_blog_posts
      ADD COLUMN linked_ebook_id uuid REFERENCES ebooks(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_blog_posts_linked_ebook
  ON community_blog_posts (linked_ebook_id)
  WHERE linked_ebook_id IS NOT NULL;

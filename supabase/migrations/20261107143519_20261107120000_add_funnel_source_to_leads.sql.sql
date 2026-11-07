/*
# Add funnel_source column to leads table

1. Changes
- Adds `funnel_source` column to `leads` table: a text field tracking where a lead came from in the funnel.
- Values: 'blog_article', 'exit_intent', 'homepage_situation', 'lead_capture_drawer', or null for existing rows.

2. Security
- No new tables. No policy changes. The column is writable by the same roles that already INSERT into leads.
- Existing RLS policies and grants on leads remain unchanged.
*/

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS funnel_source text;

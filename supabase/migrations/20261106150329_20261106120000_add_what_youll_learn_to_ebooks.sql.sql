/*
# Add "What you'll learn" highlights to ebooks

1. Changes
- Adds `what_youll_learn` column to `ebooks` table: a text array of punchy bullet points shown on the product summary page to get buyers excited.
- Each item is a short, benefit-driven sentence (e.g. "Read the 7 early warning signs of sundowning before it escalates").

2. Security
- No new tables. No policy changes. The column is readable by the same roles that already SELECT from ebooks.
- Existing RLS policies and grants on ebooks remain unchanged.
*/

ALTER TABLE ebooks
  ADD COLUMN IF NOT EXISTS what_youll_learn text[] DEFAULT '{}';

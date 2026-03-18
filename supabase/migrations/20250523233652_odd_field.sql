/*
  # Create resources table with vector search capabilities

  1. New Tables
    - `resources`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `url` (text)
      - `source` (text)
      - `embedding` (vector)

  2. Extensions
    - Enable vector extension for similarity search

  3. Functions
    - Add match_resources function for vector similarity search
*/

-- Enable the vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  url text NOT NULL,
  source text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add embeddings column
ALTER TABLE resources ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Enable RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
  ON resources
  FOR SELECT
  TO public
  USING (true);

-- Create a function to search resources using embeddings
CREATE OR REPLACE FUNCTION match_resources (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  url text,
  source text,
  relevance float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.title,
    r.description,
    r.url,
    r.source,
    1 - (r.embedding <=> query_embedding) as relevance
  FROM resources r
  WHERE 1 - (r.embedding <=> query_embedding) > match_threshold
  ORDER BY relevance DESC
  LIMIT match_count;
END;
$$;
/*
  # Add AI-related tables and functions

  1. New Tables
    - `user_profiles`
      - User learning preferences and progress
    - `user_interactions`
      - Track user engagement with content
    - `modules`
      - Learning modules with metadata
    - Add vector similarity search for content recommendations

  2. Security
    - Enable RLS on all new tables
    - Add appropriate access policies
*/

-- Enable vector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  learning_style text CHECK (learning_style IN ('visual', 'auditory', 'kinesthetic')),
  skill_level text CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  interests text[],
  completed_modules text[],
  performance jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_interactions table
CREATE TABLE IF NOT EXISTS user_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id uuid NOT NULL,
  type text CHECK (type IN ('video', 'audio', 'exercise', 'quiz')),
  duration integer,
  score integer,
  created_at timestamptz DEFAULT now()
);

-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  content_type text CHECK (content_type IN ('video', 'audio', 'text', 'interactive')),
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  learning_style text CHECK (learning_style IN ('visual', 'auditory', 'kinesthetic')),
  tags text[],
  completion_rate float DEFAULT 0,
  embedding vector(1536),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions"
  ON user_interactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own interactions"
  ON user_interactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view modules"
  ON modules
  FOR SELECT
  TO public
  USING (true);

-- Create function for content recommendations
CREATE OR REPLACE FUNCTION get_recommended_modules(
  user_profile_id uuid,
  similarity_threshold float DEFAULT 0.7,
  max_recommendations int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.title,
    m.description,
    1 - (m.embedding <=> (
      SELECT embedding
      FROM user_profiles
      WHERE id = user_profile_id
    )) as similarity
  FROM modules m
  WHERE 1 - (m.embedding <=> (
    SELECT embedding
    FROM user_profiles
    WHERE id = user_profile_id
  )) > similarity_threshold
  ORDER BY similarity DESC
  LIMIT max_recommendations;
END;
$$;
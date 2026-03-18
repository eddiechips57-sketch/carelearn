import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  console.error('Missing VITE_SUPABASE_URL environment variable. Please check your .env file.');
  throw new Error('Supabase URL is not configured');
}

if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable. Please check your .env file.');
  throw new Error('Supabase anonymous key is not configured');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
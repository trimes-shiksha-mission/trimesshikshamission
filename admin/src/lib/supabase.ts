import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY')
}

// Create a single supabase client for interacting with your database
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY)

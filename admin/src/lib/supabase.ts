import { createClient } from '@supabase/supabase-js'
import { env } from '~/env.mjs'

const SUPABASE_URL = env.SUPABASE_URL
const SUPABASE_KEY = env.SUPABASE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY')
}

// Create a single supabase client for interacting with your database
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY)

import { createClient } from '@supabase/supabase-js'
import { env } from '~/env.mjs'

const SUPABASE_URL = env.SUPABASE_URL
const SUPABASE_KEY = env.SUPABASE_KEY
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY')
}

// Create a supabase client for client-side operations (with anon key)
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY)

// Create a supabase client for server-side operations (with service role key)
// This client bypasses RLS and should only be used on the server
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

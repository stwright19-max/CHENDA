import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Create a single instance of the Supabase client to be reused
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase credentials")
  }

  // Return existing instance if available
  if (supabaseInstance) {
    return supabaseInstance
  }

  // Create new instance if none exists
  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseKey)
  return supabaseInstance
}

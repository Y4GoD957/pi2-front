import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
)

let supabaseClientPromise: Promise<SupabaseClient | null> | null = null

export async function getSupabaseClient() {
  if (!isSupabaseConfigured) {
    return null
  }

  if (!supabaseClientPromise) {
    supabaseClientPromise = import('@supabase/supabase-js').then(
      ({ createClient }) =>
        createClient(supabaseUrl!, supabasePublishableKey!, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
          },
        }),
    )
  }

  return supabaseClientPromise
}

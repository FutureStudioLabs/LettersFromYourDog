import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.trim() ?? "";
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ?? "";

export const isSupabaseConfigured = Boolean(url && publishableKey);

if (import.meta.env.DEV && !isSupabaseConfigured) {
  console.warn(
    "[supabase] Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env for the client to work.",
  );
}

/**
 * Browser Supabase client when env is set; otherwise `null` so the app can render
 * (e.g. landing page) without valid project credentials.
 * @type {import("@supabase/supabase-js").SupabaseClient | null}
 */
export const supabase = isSupabaseConfigured
  ? createClient(url, publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

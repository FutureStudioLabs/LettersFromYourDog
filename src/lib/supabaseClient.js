import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.trim() ?? "";
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ?? "";

if (import.meta.env.DEV && (!url || !publishableKey)) {
  console.warn(
    "[supabase] Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env for the client to work.",
  );
}

/** Browser Supabase client (use only the publishable key; RLS protects data). */
export const supabase = createClient(url, publishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

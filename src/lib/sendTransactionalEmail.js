import { supabase } from "./supabaseClient";

/**
 * Send one transactional email to the signed-in user's subscriber.email via Edge Function + your SMTP.
 * Requires deploying `send-transactional-email` and Edge secrets (see .env.example).
 *
 * @param {{ subject: string; text?: string; html?: string; template_key?: string }} payload
 */
export async function sendTransactionalEmail(payload) {
  if (!supabase) {
    throw new Error(
      "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Add them to .env and restart the dev server.",
    );
  }

  const { subject, text, html, template_key } = payload;
  const { data, error } = await supabase.functions.invoke("send-transactional-email", {
    body: {
      subject,
      text,
      html,
      template_key: template_key ?? "transactional",
    },
  });

  if (error) throw error;
  if (data && typeof data === "object" && "error" in data && data.error) {
    throw new Error(String(data.error));
  }
  return data;
}

/**
 * Database Webhook → welcome email after checkout.
 *
 * Dashboard → Database → Webhooks:
 *   Table: public.subscribers
 *   Events: INSERT, UPDATE
 *   URL: https://<PROJECT_REF>.supabase.co/functions/v1/subscriber-welcome-email
 *   HTTP header: x-webhook-secret: <same value as secret SUBSCRIBER_WELCOME_WEBHOOK_SECRET>
 *
 * Sends only when the row is "checkout-complete shaped": status active + real customer email
 * (not the onboarding placeholder). Idempotent via email_messages (template welcome_checkout_completed).
 *
 * Secrets: SUBSCRIBER_WELCOME_WEBHOOK_SECRET; same SMTP_* as send-transactional-email.
 */

import nodemailer from "npm:nodemailer@6.9.16";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const WELCOME_TEMPLATE_KEY = "welcome_checkout_completed";

type WebhookInsert = {
  type: "INSERT";
  table: string;
  schema: string;
  record: Record<string, unknown>;
  old_record: null;
};

type WebhookUpdate = {
  type: "UPDATE";
  table: string;
  schema: string;
  record: Record<string, unknown>;
  old_record: Record<string, unknown>;
};

type WebhookDelete = {
  type: "DELETE";
  table: string;
  schema: string;
  record: null;
  old_record: Record<string, unknown>;
};

type WebhookPayload = WebhookInsert | WebhookUpdate | WebhookDelete;

function firstNameFromFullName(fullName: string | null | undefined): string {
  if (!fullName) return "there";
  const t = fullName.trim();
  if (!t) return "there";
  return t.split(/\s+/)[0] ?? "there";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildWelcomePlainText(firstName: string): string {
  return `Hi ${firstName},

Your spot is officially saved — and we're so happy you're one of our first 100.

Here's exactly what happens next so you know what to expect:

Today: Nothing is charged. Your spot is simply reserved.

Before May 1: We'll email you with everything you need to get started — including how to tell us about your dog.

May 1: Your first month begins and you'll be charged $11. If you change your mind before then, just cancel and you won't be charged a thing.

During May: We'll ask you a few simple questions about your month with your dog. This is how we write the letter.

End of May: Your first letter is mailed. Allow 1–2 weeks for delivery within the US.

If you have any questions at all, just reply to this email. We read every one.

We can't wait to write your first letter.

With love, Letters From Your Dog 🐾`;
}

function buildWelcomeHtml(firstName: string): string {
  const fn = escapeHtml(firstName);
  const paras: string[] = [
    `Hi ${fn},`,
    `Your spot is officially saved — and we're so happy you're one of our first 100.`,
    `<strong>Here's exactly what happens next so you know what to expect:</strong>`,
    `<strong>Today:</strong> Nothing is charged. Your spot is simply reserved.`,
    `<strong>Before May 1:</strong> We'll email you with everything you need to get started — including how to tell us about your dog.`,
    `<strong>May 1:</strong> Your first month begins and you'll be charged $11. If you change your mind before then, just cancel and you won't be charged a thing.`,
    `<strong>During May:</strong> We'll ask you a few simple questions about your month with your dog. This is how we write the letter.`,
    `<strong>End of May:</strong> Your first letter is mailed. Allow 1–2 weeks for delivery within the US.`,
    `If you have any questions at all, just reply to this email. We read every one.`,
    `We can't wait to write your first letter.`,
    `With love,<br/>Letters From Your Dog 🐾`,
  ];
  const body = paras
    .map((p) => `<p style="margin:0 0 14px; line-height:1.55; color:#333;">${p}</p>`)
    .join("");
  return `<!DOCTYPE html><html><body style="font-family:system-ui,-apple-system,sans-serif;font-size:16px;max-width:42em;">${body}</body></html>`;
}

function isRealCustomerEmail(email: unknown): email is string {
  if (typeof email !== "string" || !email.trim()) return false;
  return !email.trim().toLowerCase().endsWith("@pending.lettersfromyourdog.local");
}

function rowWelcomable(record: Record<string, unknown>): boolean {
  return record.status === "active" && isRealCustomerEmail(record.email);
}

/** Avoid spamming on later subscriber updates (address tweaks, etc.). */
function transitionIntoWelcomable(
  type: string,
  record: Record<string, unknown>,
  old_record: Record<string, unknown> | null,
): boolean {
  if (!rowWelcomable(record)) return false;
  if (type === "INSERT") return true;
  if (type !== "UPDATE" || !old_record) return true;
  const wasWelcomable =
    old_record.status === "active" && isRealCustomerEmail(old_record.email);
  return !wasWelcomable;
}

async function sendWelcomeIfNeeded(
  admin: ReturnType<typeof createClient>,
  subscriberId: string,
  toEmail: string,
  fullName: string | null | undefined,
): Promise<void> {
  const { data: alreadySent } = await admin
    .from("email_messages")
    .select("id")
    .eq("subscriber_id", subscriberId)
    .eq("template_key", WELCOME_TEMPLATE_KEY)
    .eq("status", "sent")
    .maybeSingle();

  if (alreadySent?.id) {
    console.info("welcome email already sent; skipping");
    return;
  }

  const host =
    Deno.env.get("SMTP_HOSTNAME") ?? Deno.env.get("SMTP_HOST") ?? "";
  const port = Number(Deno.env.get("SMTP_PORT") ?? "465");
  const secure = (Deno.env.get("SMTP_SECURE") ?? "true").toLowerCase() === "true";
  const smtpUser = Deno.env.get("SMTP_USERNAME") ?? Deno.env.get("SMTP_USER") ?? "";
  const smtpPass = Deno.env.get("SMTP_PASSWORD") ?? Deno.env.get("SMTP_PASS") ?? "";
  const from =
    Deno.env.get("SMTP_FROM") ??
    "Letters From Your Dog <team@lettersfromyourdog.com>";

  if (!host || !smtpUser || !smtpPass) {
    console.warn(
      `[subscriber-welcome-email] SMTP incomplete: host=${Boolean(host)} user=${Boolean(
        smtpUser,
      )} password=${Boolean(smtpPass)} — Auth → Email → SMTP does not copy into Edge secrets; set SMTP_PASSWORD (and SMTP_FROM) under Project Settings → Edge Functions → Secrets`,
    );
    return;
  }

  console.info(`[subscriber-welcome-email] sending welcome to ${toEmail} via ${host}`);

  const firstName = firstNameFromFullName(fullName);
  const subject = "You're in — welcome to Letters From Your Dog 🐾";
  const text = buildWelcomePlainText(firstName);
  const html = buildWelcomeHtml(firstName);

  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user: smtpUser, pass: smtpPass },
  });

  try {
    await new Promise<void>((resolve, reject) => {
      transport.sendMail(
        { from, to: toEmail, subject, text, html },
        (err: Error | null) => (err ? reject(err) : resolve()),
      );
    });

    await admin.from("email_messages").insert({
      subscriber_id: subscriberId,
      template_key: WELCOME_TEMPLATE_KEY,
      to_email: toEmail,
      subject,
      status: "sent",
      sent_at: new Date().toISOString(),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("welcome email send failed:", msg);
    try {
      await admin.from("email_messages").insert({
        subscriber_id: subscriberId,
        template_key: WELCOME_TEMPLATE_KEY,
        to_email: toEmail,
        subject,
        status: "failed",
        last_error: msg,
      });
  } catch {
    /* ignore */
    }
  }
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  console.info(`[subscriber-welcome-email] ${req.method} ${url.pathname}`);

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const expected = Deno.env.get("SUBSCRIBER_WELCOME_WEBHOOK_SECRET");
  const provided =
    req.headers.get("x-webhook-secret")?.trim() ??
    req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "").trim() ??
    "";

  if (!expected) {
    console.error(
      "[subscriber-welcome-email] SUBSCRIBER_WELCOME_WEBHOOK_SECRET is not set on the project — run: supabase secrets set SUBSCRIBER_WELCOME_WEBHOOK_SECRET=... and add the same value as HTTP header x-webhook-secret on the Database Webhook",
    );
    return new Response(
      JSON.stringify({ error: "Webhook secret not configured on Edge Function" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  if (provided !== expected) {
    console.warn(
      "[subscriber-welcome-email] 401: x-webhook-secret header missing or does not match SUBSCRIBER_WELCOME_WEBHOOK_SECRET",
    );
    return new Response("Unauthorized", { status: 401 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRole) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return new Response("Server misconfigured", { status: 500 });
  }

  let payload: WebhookPayload;
  try {
    payload = (await req.json()) as WebhookPayload;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (payload.schema !== "public" || payload.table !== "subscribers") {
    return new Response(JSON.stringify({ ok: true, ignored: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (payload.type === "DELETE" || !payload.record) {
    return new Response(JSON.stringify({ ok: true, skipped: "delete_or_no_record" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const record = payload.record as Record<string, unknown>;
  const old_record =
    payload.type === "UPDATE"
      ? (payload.old_record as Record<string, unknown>)
      : null;

  const id = typeof record.id === "string" ? record.id : null;
  if (!id) {
    return new Response(JSON.stringify({ ok: false, error: "missing id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!transitionIntoWelcomable(payload.type, record, old_record)) {
    console.info("[subscriber-welcome-email] skipped: row not transitioning into active+real-email (e.g. stub insert or minor update)");
    return new Response(JSON.stringify({ ok: true, skipped: "not_checkout_transition" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const email = (record.email as string).trim().toLowerCase();
  const fullName =
    typeof record.full_name === "string" ? record.full_name : undefined;

  const admin = createClient(supabaseUrl, serviceRole);
  await sendWelcomeIfNeeded(admin, id, email, fullName);

  console.info(`[subscriber-welcome-email] finished processing subscriber ${id}`);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

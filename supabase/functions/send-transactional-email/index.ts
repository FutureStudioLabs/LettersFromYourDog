import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import nodemailer from "npm:nodemailer@6.9.16";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let admin: ReturnType<typeof createClient> | null = null;
  let subscriberRow: { id: string; email: string } | null = null;

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Missing authorization" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseAnon) {
      return json({ error: "Missing Supabase URL or anon key" }, 500);
    }
    if (!serviceRole) {
      return json(
        {
          error:
            "SUPABASE_SERVICE_ROLE_KEY missing. Hosted projects usually inject this; for local `supabase functions serve` add it to your env file.",
        },
        500,
      );
    }

    const userClient = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userErr,
    } = await userClient.auth.getUser();
    if (userErr || !user) {
      return json({ error: "Invalid session" }, 401);
    }

    admin = createClient(supabaseUrl, serviceRole);
    const { data: sub, error: subErr } = await admin
      .from("subscribers")
      .select("id, email")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (subErr) throw subErr;
    if (!sub?.email) {
      return json({ error: "No subscriber row or email on file" }, 400);
    }
    subscriberRow = sub;

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const subject = typeof body.subject === "string" ? body.subject : "";
    const text = typeof body.text === "string" ? body.text : undefined;
    const html = typeof body.html === "string" ? body.html : undefined;
    const templateKey = typeof body.template_key === "string" ? body.template_key : "transactional";

    if (!subject || (!text && !html)) {
      return json({ error: "subject and at least one of text or html are required" }, 400);
    }

    const host =
      Deno.env.get("SMTP_HOSTNAME") ?? Deno.env.get("SMTP_HOST") ?? "";
    const port = Number(Deno.env.get("SMTP_PORT") ?? "465");
    const secure = (Deno.env.get("SMTP_SECURE") ?? "true").toLowerCase() === "true";
    const smtpUser = Deno.env.get("SMTP_USERNAME") ?? Deno.env.get("SMTP_USER") ?? "";
    const smtpPass = Deno.env.get("SMTP_PASSWORD") ?? Deno.env.get("SMTP_PASS") ?? "";
    const from =
      Deno.env.get("SMTP_FROM") ?? "Letters From Your Dog <team@lettersfromyourdog.com>";

    if (!host || !smtpUser || !smtpPass) {
      return json(
        {
          error:
            "SMTP not configured for this function. Set SMTP_HOSTNAME, SMTP_PORT, SMTP_SECURE, SMTP_USERNAME, SMTP_PASSWORD, SMTP_FROM in Edge Function secrets.",
        },
        500,
      );
    }

    const transport = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await new Promise<void>((resolve, reject) => {
      transport.sendMail(
        { from, to: sub.email, subject, text, html },
        (err: Error | null) => (err ? reject(err) : resolve()),
      );
    });

    await admin.from("email_messages").insert({
      subscriber_id: sub.id,
      template_key: templateKey,
      to_email: sub.email,
      subject,
      status: "sent",
      sent_at: new Date().toISOString(),
    });

    return json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (admin && subscriberRow) {
      try {
        await admin.from("email_messages").insert({
          subscriber_id: subscriberRow.id,
          template_key: "transactional",
          to_email: subscriberRow.email,
          subject: "(failed send)",
          status: "failed",
          last_error: msg,
        });
      } catch {
        /* ignore logging failure */
      }
    }
    return json({ error: msg }, 500);
  }
});

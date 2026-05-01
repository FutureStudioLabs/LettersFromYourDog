/**
 * Stripe → Supabase: checkout.session.completed
 *
 * Configure in Stripe Dashboard → Developers → Webhooks:
 *   URL: https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook
 *   Events: checkout.session.completed
 *
 * Secrets: STRIPE_SECRET_KEY (sk_...), STRIPE_WEBHOOK_SECRET (whsec_...)
 *
 * Payment Link must collect shipping if you want shipping_* filled (Stripe →
 * Payment Link → After payment → Customer information → Shipping address).
 *
 * client_reference_id on the Checkout Session must be the subscribers.id UUID
 * (already appended when redirecting from the app).
 */

import Stripe from "npm:stripe@17.4.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!stripeKey || !webhookSecret || !supabaseUrl || !serviceRole) {
    console.error("Missing STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, or Supabase env");
    return new Response("Server misconfigured", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" });

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("No stripe-signature header", { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Webhook signature error:", msg);
    return new Response(`Webhook Error: ${msg}`, { status: 400 });
  }

  const admin = createClient(supabaseUrl, serviceRole);

  const { data: seen } = await admin
    .from("stripe_events_processed")
    .select("id")
    .eq("id", event.id)
    .maybeSingle();

  if (seen?.id) {
    return new Response(JSON.stringify({ received: true, duplicate: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const ref = session.client_reference_id?.trim();

      if (!ref || !UUID_RE.test(ref)) {
        console.warn(
          JSON.stringify({
            message: "checkout.session.completed missing or invalid client_reference_id",
            checkout_session_id: session.id,
            client_reference_id: ref ?? null,
            hint: "Payment must start from your app so the link includes ?client_reference_id=<subscribers.id>.",
          }),
        );
      } else {
        const emailRaw =
          session.customer_details?.email ?? session.customer_email ?? null;
        const email = emailRaw ? emailRaw.trim().toLowerCase() : null;
        const fullName = session.customer_details?.name?.trim() ?? null;
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : (session.customer as Stripe.Customer | null)?.id ?? null;

        const subId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id ?? null;

        const addr = session.shipping_details?.address;

        const updateRow: Record<string, unknown> = {
          status: "active",
          stripe_customer_id: customerId,
        };

        if (email) updateRow.email = email;
        if (fullName) updateRow.full_name = fullName;
        if (subId) updateRow.stripe_subscription_id = subId;
        if (addr?.line1) updateRow.shipping_address_line1 = addr.line1;
        updateRow.shipping_address_line2 = addr?.line2 ?? null;
        if (addr?.city) updateRow.shipping_city = addr.city;
        if (addr?.state) updateRow.shipping_state = addr.state;
        if (addr?.postal_code) updateRow.shipping_zip = addr.postal_code;
        if (addr?.country) updateRow.shipping_country = addr.country;

        const { data: updatedRows, error: upErr } = await admin
          .from("subscribers")
          .update(updateRow)
          .eq("id", ref)
          .select("id");

        if (upErr) {
          console.error("subscribers update error:", upErr);
          return new Response(JSON.stringify({ error: upErr.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        if (!updatedRows?.length) {
          console.error(
            JSON.stringify({
              message: "subscribers update matched 0 rows",
              client_reference_id: ref,
              checkout_session_id: session.id,
              hint: "Open Checkout Session in Stripe → verify client_reference_id equals subscribers.id. App must redirect with ?client_reference_id=<uuid> on the Payment Link.",
            }),
          );
        }
      }
    }

    const { error: insErr } = await admin.from("stripe_events_processed").insert({ id: event.id });
    if (insErr && !/duplicate|unique/i.test(insErr.message)) {
      console.error("stripe_events_processed insert:", insErr);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(e);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

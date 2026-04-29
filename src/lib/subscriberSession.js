import { supabase } from "./supabaseClient";

/** Bucket for dog profile photos (create as private "dog" in Supabase Storage). */
export const DOG_PHOTOS_BUCKET = "dog";

function toErrorMessage(err) {
  if (err == null) return "Unknown error";
  if (typeof err === "string") return err;
  if (err.message) return err.message;
  if (err.error_description) return String(err.error_description);
  if (err.details) return String(err.details);
  if (err.hint) return String(err.hint);
  return "Unknown error";
}

function explainError(err) {
  const msg = toErrorMessage(err);

  if (/anonymous|Anonymous|not enabled|disabled|provider/i.test(msg)) {
    return `${msg} In Supabase: Authentication → Providers → Anonymous → enable and save.`;
  }

  if (/row-level security|RLS/i.test(msg) || err?.code === "42501") {
    return `${msg} If you just created tables, run the RLS migration (20260429140000_rls_policies.sql) in the SQL Editor.`;
  }

  if (/JWT|Invalid API key|invalid api key/i.test(msg)) {
    return `${msg} Use the anon/public key from Project Settings → API as VITE_SUPABASE_PUBLISHABLE_KEY (not the service_role key).`;
  }

  if (/Failed to fetch|NetworkError|load failed/i.test(msg)) {
    return `${msg} Check VITE_SUPABASE_URL matches your project (https://… .supabase.co) and restart \`npm run dev\`.`;
  }

  if (/duplicate key|unique constraint/i.test(msg) || String(err?.code) === "23505") {
    return `${msg} Usually a quick refresh fixes this (double insert). If it keeps happening, check Table Editor for an existing subscriber with the same email.`;
  }

  if (/storage|bucket|Upload failed|not authorized|object/i.test(msg)) {
    return `${msg} Ensure bucket "dog" exists and run migration 20260429170000_storage_dog_bucket.sql for storage policies.`;
  }

  return msg;
}

/**
 * Anonymous auth + subscribers row in one flow.
 * Uses getSession only (not getUser) so a brand-new anonymous session works without an extra round trip.
 */
export async function ensureSubscriberForOnboarding() {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key) {
    throw new Error(
      "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Add them to .env and restart the dev server.",
    );
  }

  const {
    data: { session: existing },
    error: getSessionErr,
  } = await supabase.auth.getSession();
  if (getSessionErr) throw getSessionErr;

  let session = existing;
  if (!session?.user) {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    session = data.session;
    if (!session?.user) {
      const { data: again } = await supabase.auth.getSession();
      session = again.session;
    }
  }

  if (!session?.user?.id) {
    throw new Error("Could not establish an anonymous session. Enable Anonymous sign-ins in Supabase.");
  }

  const user = session.user;

  const { data: row, error: selErr } = await supabase
    .from("subscribers")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (selErr) throw selErr;
  if (row?.id) return row.id;

  const placeholderEmail = `pending.${user.id.replace(/-/g, "")}@pending.lettersfromyourdog.local`;

  const { data: inserted, error: insErr } = await supabase
    .from("subscribers")
    .insert({
      auth_user_id: user.id,
      email: placeholderEmail,
      status: "incomplete",
    })
    .select("id")
    .single();

  if (!insErr && inserted?.id) return inserted.id;

  /* React Strict Mode or double-mount can run two inserts; second hits unique on email or auth_user_id */
  if (insErr && (String(insErr.code) === "23505" || /duplicate key|unique constraint/i.test(insErr.message ?? ""))) {
    const { data: again, error: againErr } = await supabase
      .from("subscribers")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    if (againErr) throw againErr;
    if (again?.id) return again.id;
  }

  if (insErr) throw insErr;
  throw new Error("Insert returned no subscriber id");
}

export function getSubscriberSyncErrorMessage(err) {
  return explainError(err);
}

/**
 * Upload onboarding photo to Storage. Returns object path within the bucket (store in dog_profiles.photo_path).
 */
export async function uploadDogProfilePhoto(subscriberId, file) {
  if (!file || !(file instanceof File)) {
    throw new Error("No file to upload");
  }

  const {
    data: { session },
    error: sessionErr,
  } = await supabase.auth.getSession();
  if (sessionErr) throw sessionErr;
  const userId = session?.user?.id;
  if (!userId) throw new Error("Not signed in");

  const lower = file.name.toLowerCase();
  const extFromName = lower.match(/\.(jpe?g|png)$/)?.[1]?.replace("jpeg", "jpg") ?? "jpg";
  if (!["jpg", "png"].includes(extFromName)) {
    throw new Error("Use JPG, JPEG, or PNG only.");
  }

  const contentType =
    file.type && /^image\/(jpeg|png)$/i.test(file.type)
      ? file.type
      : extFromName === "png"
        ? "image/png"
        : "image/jpeg";

  const objectName = `${crypto.randomUUID()}.${extFromName}`;
  const objectPath = `${userId}/${subscriberId}/${objectName}`;

  const { error } = await supabase.storage.from(DOG_PHOTOS_BUCKET).upload(objectPath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType,
  });

  if (error) throw error;
  return objectPath;
}

export async function upsertDogProfile(subscriberId, fields) {
  const { dogName, breed, ageRange, traits, memorableMoment, photoPath } = fields;

  const row = {
    subscriber_id: subscriberId,
    dog_name: dogName,
    breed,
    age_range: ageRange,
    traits,
    memorable_moment: memorableMoment,
    photo_path: photoPath ?? null,
    onboarding_submitted_at: new Date().toISOString(),
  };

  /* Avoid PostgREST upsert (requires UNIQUE on subscriber_id). Works even if that constraint is missing. */
  const { data: existing, error: selErr } = await supabase
    .from("dog_profiles")
    .select("id")
    .eq("subscriber_id", subscriberId)
    .maybeSingle();

  if (selErr) throw selErr;

  if (existing?.id) {
    const { error } = await supabase.from("dog_profiles").update(row).eq("id", existing.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("dog_profiles").insert(row);
  if (error) throw error;
}

export function stripeCheckoutUrlWithReference(paymentLinkBase, subscriberId) {
  const trimmed = paymentLinkBase.trim();
  try {
    const u = new URL(trimmed);
    u.searchParams.set("client_reference_id", subscriberId);
    return u.toString();
  } catch {
    const joiner = trimmed.includes("?") ? "&" : "?";
    return `${trimmed}${joiner}client_reference_id=${encodeURIComponent(subscriberId)}`;
  }
}

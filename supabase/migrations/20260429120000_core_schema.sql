-- Letters From Your Dog — core schema + Resend email log
-- Run in Supabase SQL Editor, or: supabase db push (if using CLI)
--
-- After run: add RLS policies for your access model (auth, service role, Edge Functions).
-- Tables use RLS enabled with no policies = blocked from PostgREST until you add policies.

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- subscribers — Stripe customer + email + mailing (one row per paying customer)
-- ---------------------------------------------------------------------------
create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text,
  stripe_customer_id text unique,
  stripe_subscription_id text,
  status text not null default 'active',
  mailing_address jsonb,
  auth_user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscribers_status_check check (
    status in ('active', 'canceled', 'past_due', 'trialing', 'incomplete')
  )
);

-- Case-insensitive email uniqueness (expressions are not allowed in table UNIQUE constraints)
create unique index subscribers_email_unique_ci on public.subscribers (lower(trim(email)));

create trigger subscribers_set_updated_at
before update on public.subscribers
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- dog_profiles — onboarded dog data (one or more per subscriber later if needed)
-- ---------------------------------------------------------------------------
create table public.dog_profiles (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references public.subscribers (id) on delete cascade,
  dog_name text not null,
  breed text not null,
  age_range text not null,
  traits jsonb not null default '[]'::jsonb,
  memorable_moment text not null,
  photo_path text,
  onboarding_submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index dog_profiles_subscriber_id_idx on public.dog_profiles (subscriber_id);

create trigger dog_profiles_set_updated_at
before update on public.dog_profiles
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- question_rounds — each week (or period) you send 3–4 questions
-- ---------------------------------------------------------------------------
create table public.question_rounds (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  opens_at timestamptz,
  closes_at timestamptz,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index question_rounds_sort_order_idx on public.question_rounds (sort_order);

create trigger question_rounds_set_updated_at
before update on public.question_rounds
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- questions — prompts inside a round
-- ---------------------------------------------------------------------------
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.question_rounds (id) on delete cascade,
  body text not null,
  sort_order int not null default 1,
  unique (round_id, sort_order)
);

create index questions_round_id_idx on public.questions (round_id);

-- ---------------------------------------------------------------------------
-- answers — one row per subscriber per question (upsert on conflict)
-- ---------------------------------------------------------------------------
create table public.answers (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references public.subscribers (id) on delete cascade,
  dog_profile_id uuid not null references public.dog_profiles (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  body text not null,
  submitted_at timestamptz not null default now(),
  unique (subscriber_id, question_id)
);

create index answers_subscriber_id_idx on public.answers (subscriber_id);
create index answers_dog_profile_id_idx on public.answers (dog_profile_id);
create index answers_question_id_idx on public.answers (question_id);

-- ---------------------------------------------------------------------------
-- mailings — physical letter / shipment per issue
-- ---------------------------------------------------------------------------
create table public.mailings (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references public.subscribers (id) on delete cascade,
  dog_profile_id uuid not null references public.dog_profiles (id) on delete cascade,
  issue_label text not null,
  status text not null default 'draft',
  answer_round_ids uuid[] default '{}',
  shipped_at timestamptz,
  tracking_number text,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mailings_status_check check (
    status in ('draft', 'ready_to_print', 'shipped', 'delivered', 'canceled')
  )
);

create index mailings_subscriber_id_idx on public.mailings (subscriber_id);
create index mailings_status_idx on public.mailings (status);

create trigger mailings_set_updated_at
before update on public.mailings
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- email_messages — outbound email log (Resend); use service role / Edge Function to insert
-- ---------------------------------------------------------------------------
create table public.email_messages (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid references public.subscribers (id) on delete set null,
  resend_email_id text,
  template_key text not null,
  to_email text not null,
  subject text,
  status text not null default 'queued',
  metadata jsonb not null default '{}'::jsonb,
  last_error text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  constraint email_messages_status_check check (
    status in ('queued', 'sent', 'delivered', 'bounced', 'failed')
  )
);

create index email_messages_subscriber_id_idx on public.email_messages (subscriber_id);
create index email_messages_to_email_idx on public.email_messages (lower(to_email));
create index email_messages_resend_email_id_idx on public.email_messages (resend_email_id);

-- ---------------------------------------------------------------------------
-- stripe_events_processed — idempotent webhook handling (optional but recommended)
-- ---------------------------------------------------------------------------
create table public.stripe_events_processed (
  id text primary key,
  received_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security (lock down until you define policies)
-- ---------------------------------------------------------------------------
alter table public.subscribers enable row level security;
alter table public.dog_profiles enable row level security;
alter table public.question_rounds enable row level security;
alter table public.questions enable row level security;
alter table public.answers enable row level security;
alter table public.mailings enable row level security;
alter table public.email_messages enable row level security;
alter table public.stripe_events_processed enable row level security;

-- Example (uncomment after linking auth to subscribers.auth_user_id):
-- create policy subscribers_self_select
--   on public.subscribers for select to authenticated
--   using (auth.uid() = auth_user_id);

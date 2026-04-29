-- RLS policies for browser (anonymous Supabase Auth → authenticated JWT)
-- Requires: Dashboard → Authentication → Providers → Anonymous sign-ins = ON
--
-- Run after 20260429120000_core_schema.sql

-- One dog profile per subscriber (upsert from onboarding)
alter table public.dog_profiles
  add constraint dog_profiles_subscriber_id_key unique (subscriber_id);

-- At most one subscriber row per auth user
create unique index if not exists subscribers_auth_user_id_unique
  on public.subscribers (auth_user_id)
  where auth_user_id is not null;

-- ---------------------------------------------------------------------------
-- subscribers
-- ---------------------------------------------------------------------------
create policy subscribers_insert_own
  on public.subscribers for insert to authenticated
  with check (auth.uid() = auth_user_id);

create policy subscribers_select_own
  on public.subscribers for select to authenticated
  using (auth.uid() = auth_user_id);

create policy subscribers_update_own
  on public.subscribers for update to authenticated
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

-- ---------------------------------------------------------------------------
-- dog_profiles
-- ---------------------------------------------------------------------------
create policy dog_profiles_select_own
  on public.dog_profiles for select to authenticated
  using (
    subscriber_id in (select s.id from public.subscribers s where s.auth_user_id = auth.uid())
  );

create policy dog_profiles_insert_own
  on public.dog_profiles for insert to authenticated
  with check (
    subscriber_id in (select s.id from public.subscribers s where s.auth_user_id = auth.uid())
  );

create policy dog_profiles_update_own
  on public.dog_profiles for update to authenticated
  using (
    subscriber_id in (select s.id from public.subscribers s where s.auth_user_id = auth.uid())
  )
  with check (
    subscriber_id in (select s.id from public.subscribers s where s.auth_user_id = auth.uid())
  );

create policy dog_profiles_delete_own
  on public.dog_profiles for delete to authenticated
  using (
    subscriber_id in (select s.id from public.subscribers s where s.auth_user_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- question content (read-only for customers)
-- ---------------------------------------------------------------------------
create policy question_rounds_select_auth
  on public.question_rounds for select to authenticated
  using (true);

create policy questions_select_auth
  on public.questions for select to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- answers
-- ---------------------------------------------------------------------------
create policy answers_select_own
  on public.answers for select to authenticated
  using (
    subscriber_id in (select s.id from public.subscribers s where s.auth_user_id = auth.uid())
  );

create policy answers_insert_own
  on public.answers for insert to authenticated
  with check (
    subscriber_id in (select s.id from public.subscribers s where s.auth_user_id = auth.uid())
    and dog_profile_id in (
      select d.id from public.dog_profiles d where d.subscriber_id = subscriber_id
    )
  );

create policy answers_update_own
  on public.answers for update to authenticated
  using (
    subscriber_id in (select s.id from public.subscribers s where s.auth_user_id = auth.uid())
  )
  with check (
    subscriber_id in (select s.id from public.subscribers s where s.auth_user_id = auth.uid())
    and dog_profile_id in (
      select d.id from public.dog_profiles d where d.subscriber_id = subscriber_id
    )
  );

create policy answers_delete_own
  on public.answers for delete to authenticated
  using (
    subscriber_id in (select s.id from public.subscribers s where s.auth_user_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- mailings (read own fulfillment rows)
-- ---------------------------------------------------------------------------
create policy mailings_select_own
  on public.mailings for select to authenticated
  using (
    subscriber_id in (select s.id from public.subscribers s where s.auth_user_id = auth.uid())
  );

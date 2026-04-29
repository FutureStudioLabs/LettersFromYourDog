-- If dog_profiles has no UNIQUE(subscriber_id), PostgREST upsert ON CONFLICT fails.
-- The app uses select + insert/update instead, but this keeps the DB consistent.
-- Safe to run once; skips if the constraint already exists.

do $$
begin
  if not exists (
    select 1
    from pg_constraint c
    join pg_class t on c.conrelid = t.oid
    join pg_namespace n on t.relnamespace = n.oid
    where n.nspname = 'public'
      and t.relname = 'dog_profiles'
      and c.conname = 'dog_profiles_subscriber_id_key'
  ) then
    alter table public.dog_profiles
      add constraint dog_profiles_subscriber_id_key unique (subscriber_id);
  end if;
end $$;

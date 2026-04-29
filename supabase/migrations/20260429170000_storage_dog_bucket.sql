-- Storage bucket "dog" — RLS for authenticated users (incl. anonymous auth)
-- Create the bucket in Dashboard → Storage (name: dog) if you have not already.
-- Path layout: {auth.uid()}/{subscriber_id}/{uuid}.{ext}

drop policy if exists "dog_select_own_objects" on storage.objects;
drop policy if exists "dog_insert_own_objects" on storage.objects;
drop policy if exists "dog_update_own_objects" on storage.objects;
drop policy if exists "dog_delete_own_objects" on storage.objects;

create policy "dog_select_own_objects"
on storage.objects for select
to authenticated
using (
  bucket_id = 'dog'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "dog_insert_own_objects"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'dog'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "dog_update_own_objects"
on storage.objects for update
to authenticated
using (
  bucket_id = 'dog'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'dog'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "dog_delete_own_objects"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'dog'
  and (storage.foldername(name))[1] = auth.uid()::text
);

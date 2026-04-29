-- subscribers: physical mailing address from Stripe Checkout (shipping)
-- Populate via webhook (checkout.session.completed) from the session object, e.g.:
--   shipping_details.address.line1       → shipping_address_line1
--   shipping_details.address.line2       → shipping_address_line2
--   shipping_details.address.city        → shipping_city
--   shipping_details.address.state       → shipping_state
--   shipping_details.address.postal_code  → shipping_zip
--   shipping_details.address.country     → shipping_country
-- (Use expanded fields when retrieving the session from Stripe API.)

alter table public.subscribers
  add column if not exists shipping_address_line1 text;

alter table public.subscribers
  add column if not exists shipping_address_line2 text;

alter table public.subscribers
  add column if not exists shipping_city text;

alter table public.subscribers
  add column if not exists shipping_state text;

alter table public.subscribers
  add column if not exists shipping_zip text;

alter table public.subscribers
  add column if not exists shipping_country text;

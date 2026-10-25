/*
# Add ebook_slug to stripe_orders for ebook purchase tracking

## Plain-English Summary
Adds an `ebook_slug` column to the `stripe_orders` table so we can tie a
completed one-time payment to the specific ebook that was purchased.
The stripe-webhook edge function reads the checkout session's
client_reference_id (set to the ebook slug by the checkout function)
and stores it here. The EbookReader page then checks whether the
signed-in user has a completed order for the requested ebook's slug
before allowing access to paid ebooks.

## Modified Table: stripe_orders
- ebook_slug (text, nullable) — the slug of the purchased ebook.
  Null for orders that are not ebook purchases.

## Security
- No RLS policy changes. The existing SELECT policy already limits
  users to their own orders. The service_role INSERT grant (used by
  the webhook) already covers the new column.
*/

ALTER TABLE stripe_orders
  ADD COLUMN IF NOT EXISTS ebook_slug text;

COMMENT ON COLUMN stripe_orders.ebook_slug IS
  'Slug of the purchased ebook, set from the checkout session client_reference_id by the webhook.';

/*
# Add stripe_price_id to ebooks table

## Plain-English Summary
Adds a `stripe_price_id` column to the `ebooks` table so each paid ebook
can be linked to its Stripe Price (created in the Stripe dashboard).
When a visitor clicks "Buy Now" on a paid ebook, the app uses this
price_id to launch a Stripe Checkout session. Free ebooks (price 0)
leave this column null.

## Modified Table: ebooks
- stripe_price_id (text, nullable) — the Stripe Price ID (e.g. price_xxx)
  used to create a Checkout Session for this ebook. Null for free ebooks.

## Security
- No RLS policy changes. The existing ebooks SELECT policy already lets
  the public read published ebooks, which is correct for a storefront:
  the price_id is not secret (Stripe publishes it in the checkout flow),
  and the actual ebook file remains gated by the reader page.
*/

ALTER TABLE ebooks
  ADD COLUMN IF NOT EXISTS stripe_price_id text;

COMMENT ON COLUMN ebooks.stripe_price_id IS
  'Stripe Price ID for paid ebooks (e.g. price_xxx). Null for free ebooks. Set in the Stripe dashboard.';

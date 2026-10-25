/*
# Update stripe_user_orders view to include ebook_slug

## Plain-English Summary
Recreates the `stripe_user_orders` view to include the new `ebook_slug`
column from `stripe_orders`. This lets the EbookReader page check
whether the signed-in user has a completed order for a specific ebook
by matching on the slug.

## Modified View: stripe_user_orders
- Adds `ebook_slug` column (from stripe_orders.ebook_slug)

## Security
- The view remains security_invoker. The existing SELECT grant to
  authenticated is re-applied after recreation.
*/

DROP VIEW IF EXISTS stripe_user_orders;

CREATE VIEW stripe_user_orders WITH (security_invoker = true) AS
SELECT
    c.customer_id,
    o.id as order_id,
    o.checkout_session_id,
    o.payment_intent_id,
    o.amount_subtotal,
    o.amount_total,
    o.currency,
    o.payment_status,
    o.status as order_status,
    o.ebook_slug,
    o.created_at as order_date
FROM stripe_customers c
LEFT JOIN stripe_orders o ON c.customer_id = o.customer_id
WHERE c.user_id = auth.uid()
AND c.deleted_at IS NULL
AND o.deleted_at IS NULL;

GRANT SELECT ON stripe_user_orders TO authenticated;

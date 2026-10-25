import { supabase } from '../services/supabaseClient';

const CHECKOUT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`;

export interface CheckoutResult {
  url: string;
}

export async function createCheckoutSession(
  priceId: string,
  slug: string
): Promise<CheckoutResult> {
  const { data: { session } } = await supabase.auth.getSession();

  const origin = window.location.origin;
  const successUrl = `${origin}/ebooks?checkout=success&slug=${slug}`;
  const cancelUrl = `${origin}/ebooks?checkout=cancel&slug=${slug}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  const response = await fetch(CHECKOUT_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      price_id: priceId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      mode: 'payment',
      ebook_slug: slug,
    }),
  });

  if (!response.ok) {
    let message = 'Could not start checkout. Please try again.';
    try {
      const body = await response.json();
      if (body?.error) {
        if (body.error.includes('authenticate') || body.error.includes('User not found')) {
          message = 'Please sign in to complete your purchase.';
        } else if (body.error.includes('price')) {
          message = 'This product is not available for purchase yet.';
        }
      }
    } catch {
      // keep default message
    }
    throw new Error(message);
  }

  const data = await response.json();
  if (!data?.url) {
    throw new Error('Could not start checkout. Please try again.');
  }
  return { url: data.url };
}

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia",
  typescript: true,
});

// Pack de 5 crédits (paiement unique) et abonnement mensuel illimité.
export const STRIPE_PRICES = {
  creditsPack: process.env.STRIPE_PRICE_CREDITS_PACK!,
  subscription: process.env.STRIPE_PRICE_SUBSCRIPTION!,
};

export const CREDITS_PER_PACK = 5;

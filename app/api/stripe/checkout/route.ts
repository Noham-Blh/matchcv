import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, STRIPE_PRICES } from "@/lib/stripe/client";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { mode } = (await request.json()) as { mode: "credits" | "subscription" };
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email")
      .eq("id", user.id)
      .single();

    // Récupère ou crée le client Stripe associé à cet utilisateur.
    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email || user.email!,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: mode === "subscription" ? "subscription" : "payment",
      line_items: [
        {
          price: mode === "subscription" ? STRIPE_PRICES.subscription : STRIPE_PRICES.creditsPack,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/dashboard?checkout=success`,
      cancel_url: `${siteUrl}/billing?checkout=cancelled`,
      metadata: {
        supabase_user_id: user.id,
        purchase_type: mode,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erreur /api/stripe/checkout:", error);
    return NextResponse.json({ error: "Impossible de créer la session de paiement." }, { status: 500 });
  }
}

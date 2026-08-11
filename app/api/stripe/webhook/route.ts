import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, CREDITS_PER_PACK } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/server";

// Le webhook Stripe n'a pas de session utilisateur : on utilise le client admin
// (service role) qui contourne les policies RLS pour mettre à jour le profil concerné.
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Signature webhook invalide:", err);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const purchaseType = session.metadata?.purchase_type;
        if (!userId) break;

        if (purchaseType === "credits") {
          await supabase.rpc("add_credits", { p_user_id: userId, p_amount: CREDITS_PER_PACK });
        }

        if (purchaseType === "subscription" && session.subscription) {
          await supabase
            .from("profiles")
            .update({
              plan: "subscription",
              subscription_status: "active",
              stripe_subscription_id: session.subscription as string,
            })
            .eq("id", userId);
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (profile) {
          const isActive = subscription.status === "active" || subscription.status === "trialing";
          await supabase
            .from("profiles")
            .update({
              subscription_status: subscription.status,
              plan: isActive ? "subscription" : "free",
            })
            .eq("id", profile.id);
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur traitement webhook Stripe:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

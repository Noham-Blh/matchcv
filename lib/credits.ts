import { createClient } from "@/lib/supabase/server";

// Vérifie que l'utilisateur a au moins 1 crédit (ou un abonnement actif) avant génération.
export async function ensureCreditsAvailable(userId: string) {
  const supabase = createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("credits, plan, subscription_status")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    throw new Error("Profil introuvable.");
  }

  const hasActiveSubscription =
    profile.plan === "subscription" && profile.subscription_status === "active";

  if (!hasActiveSubscription && profile.credits < 1) {
    throw new Error("INSUFFICIENT_CREDITS");
  }

  return { hasActiveSubscription, credits: profile.credits };
}

// Décrémente 1 crédit sauf si l'utilisateur est abonné (usage illimité).
export async function consumeCredit(userId: string, hasActiveSubscription: boolean) {
  if (hasActiveSubscription) return;

  const supabase = createClient();
  const { error } = await supabase.rpc("decrement_credit", { p_user_id: userId });
  if (error) throw new Error("Impossible de débiter le crédit.");
}

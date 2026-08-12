import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

// Appelée juste après qu'un utilisateur ait confirmé son inscription (code vérifié).
// Crédite son parrain de +1 crédit, une seule fois (protégé par referral_credit_granted).
export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.rpc("grant_referral_credit", { p_user_id: user.id });

  if (error) {
    console.error("Erreur crédit de parrainage:", error);
    return NextResponse.json({ error: "Échec." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

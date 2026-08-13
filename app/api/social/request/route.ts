import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { platform } = (await request.json()) as { platform: "instagram" | "tiktok" | "facebook" };

  if (!["instagram", "tiktok", "facebook"].includes(platform)) {
    return NextResponse.json({ error: "Plateforme invalide." }, { status: 400 });
  }

  // Client admin (service role) : on enregistre la demande ET on crédite en une seule
  // opération, plus besoin de validation manuelle par un administrateur.
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("social_follow_requests")
    .insert({ user_id: user.id, platform, status: "approved" });

  if (error) {
    // Erreur de doublon (déjà demandé pour cette plateforme) : déjà crédité, on ne recrédite pas.
    if (error.code === "23505") {
      return NextResponse.json({ success: true, alreadyRequested: true });
    }
    return NextResponse.json({ error: "Échec de la demande." }, { status: 500 });
  }

  await adminClient.rpc("add_credits", { p_user_id: user.id, p_amount: 1 });

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  const { error } = await supabase
    .from("social_follow_requests")
    .insert({ user_id: user.id, platform, status: "pending" });

  if (error) {
    // Erreur de doublon (déjà demandé pour cette plateforme) : on l'ignore côté utilisateur.
    if (error.code === "23505") {
      return NextResponse.json({ success: true, alreadyRequested: true });
    }
    return NextResponse.json({ error: "Échec de la demande." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

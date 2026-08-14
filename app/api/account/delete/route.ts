import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const adminClient = createAdminClient();

  // Supprime le compte Auth. Le profil, l'historique de générations et les
  // demandes de crédits réseaux sociaux sont supprimés automatiquement
  // (contraintes "on delete cascade" dans le schéma).
  const { error } = await adminClient.auth.admin.deleteUser(user.id);

  if (error) {
    return NextResponse.json({ error: "Échec de la suppression." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

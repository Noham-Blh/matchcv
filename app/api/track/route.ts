import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// Enregistre une visite anonyme (aucune donnée personnelle : juste la page
// visitée et un identifiant anonyme aléatoire). Alimente les statistiques
// de trafic affichées dans le panneau admin.
export async function POST(request: Request) {
  try {
    const { path, visitorId } = await request.json();

    if (
      typeof path !== "string" ||
      path.length === 0 ||
      path.length > 300 ||
      typeof visitorId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(visitorId)
    ) {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }

    const adminClient = createAdminClient();
    await adminClient.from("page_views").insert({ path, visitor_id: visitorId });

    return NextResponse.json({ success: true });
  } catch {
    // On ne fait jamais échouer la navigation de l'utilisateur pour un simple souci de tracking.
    return NextResponse.json({ success: false });
  }
}

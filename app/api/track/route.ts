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

    // Protection anti-abus : si ce visiteur a déjà généré plus de 60 visites
    // dans les 5 dernières minutes, on ignore (navigation normale très généreuse,
    // mais bloque le spam automatisé de cette route).
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { count } = await adminClient
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .eq("visitor_id", visitorId)
      .gte("created_at", fiveMinutesAgo);

    if ((count ?? 0) > 60) {
      return NextResponse.json({ success: false });
    }

    await adminClient.from("page_views").insert({ path, visitor_id: visitorId });

    return NextResponse.json({ success: true });
  } catch {
    // On ne fait jamais échouer la navigation de l'utilisateur pour un simple souci de tracking.
    return NextResponse.json({ success: false });
  }
}

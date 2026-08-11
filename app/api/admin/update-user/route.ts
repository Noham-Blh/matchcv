import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

// Vérifie que l'appelant est bien administrateur avant toute action.
async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false as const, status: 401, error: "Non authentifié." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return { ok: false as const, status: 403, error: "Accès réservé aux administrateurs." };
  }

  return { ok: true as const, adminId: user.id };
}

export async function POST(request: Request) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const body = await request.json();
  const { userId, credits, plan, subscription_status } = body as {
    userId: string;
    credits?: number;
    plan?: "free" | "credits" | "subscription";
    subscription_status?: string | null;
  };

  if (!userId) {
    return NextResponse.json({ error: "userId manquant." }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (typeof credits === "number" && credits >= 0) update.credits = Math.floor(credits);
  if (plan) update.plan = plan;
  if (subscription_status !== undefined) update.subscription_status = subscription_status || null;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Aucune modification fournie." }, { status: 400 });
  }

  // Client admin (service role) : seul moyen de modifier le profil d'un AUTRE utilisateur,
  // les policies RLS normales ne l'autorisent que pour soi-même.
  const adminClient = createAdminClient();
  const { error } = await adminClient.from("profiles").update(update).eq("id", userId);

  if (error) {
    console.error("Erreur mise à jour admin:", error);
    return NextResponse.json({ error: "Échec de la mise à jour." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

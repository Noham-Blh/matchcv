import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false as const, status: 401, error: "Non authentifié." };

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();

  if (!profile?.is_admin) {
    return { ok: false as const, status: 403, error: "Accès réservé aux administrateurs." };
  }

  return { ok: true as const };
}

export async function POST(request: Request) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { requestId, action } = (await request.json()) as {
    requestId: string;
    action: "approve" | "reject";
  };

  if (!requestId || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }

  const adminClient = createAdminClient();

  const { data: socialRequest, error: fetchError } = await adminClient
    .from("social_follow_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (fetchError || !socialRequest) {
    return NextResponse.json({ error: "Demande introuvable." }, { status: 404 });
  }

  const newStatus = action === "approve" ? "approved" : "rejected";

  const { error: updateError } = await adminClient
    .from("social_follow_requests")
    .update({ status: newStatus })
    .eq("id", requestId);

  if (updateError) {
    return NextResponse.json({ error: "Échec de la mise à jour." }, { status: 500 });
  }

  if (action === "approve" && socialRequest.status !== "approved") {
    await adminClient.rpc("add_credits", { p_user_id: socialRequest.user_id, p_amount: 1 });
  }

  return NextResponse.json({ success: true });
}

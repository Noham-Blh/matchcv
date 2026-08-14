import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/resend";

export const maxDuration = 60;

function reminderEmailHtml(firstName: string) {
  return `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #12141C;">
    <h1 style="font-size: 20px;">Salut ${firstName || ""} 👋</h1>
    <p style="font-size: 15px; line-height: 1.6;">
      Tu t'es inscrit·e sur MatchCV il y a peu, et il te reste toujours <strong>1 génération gratuite</strong>
      qui t'attend — CV réécrit et lettre de motivation adaptés à une offre d'emploi, en 30 secondes.
    </p>
    <p style="margin: 28px 0;">
      <a href="https://matchcv.fr/generate"
         style="background: #12141C; color: #C6FF3D; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 14px;">
        Essayer maintenant
      </a>
    </p>
    <p style="font-size: 13px; color: #6B7280;">
      Tu peux te désinscrire de ces rappels à tout moment en nous écrivant à contact@matchcv.fr.
    </p>
  </div>`;
}

// Déclenchée automatiquement chaque jour par Vercel Cron (voir vercel.json).
// Protégée par CRON_SECRET pour que seul Vercel puisse l'appeler.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const adminClient = createAdminClient();

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const { data: candidates, error } = await adminClient
    .from("profiles")
    .select("id, email, full_name")
    .eq("plan", "free")
    .eq("credits", 1)
    .is("reminder_sent_at", null)
    .lte("created_at", oneDayAgo)
    .gte("created_at", fourteenDaysAgo);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let sent = 0;
  for (const profile of candidates || []) {
    if (!profile.email) continue;
    try {
      await sendEmail({
        to: profile.email,
        subject: "Ton crédit gratuit MatchCV t'attend 🎁",
        html: reminderEmailHtml(profile.full_name?.split(" ")[0] || ""),
      });
      await adminClient
        .from("profiles")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", profile.id);
      sent++;
    } catch (e) {
      console.error("Échec envoi rappel à", profile.email, e);
    }
  }

  return NextResponse.json({ success: true, sent, candidates: candidates?.length || 0 });
}

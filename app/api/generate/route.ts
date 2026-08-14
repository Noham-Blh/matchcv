import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateOptimizedApplication } from "@/lib/anthropic";
import { ensureCreditsAvailable, consumeCredit } from "@/lib/credits";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const body = await request.json();
    const { cvText, jobOfferText, jobTitle, companyName } = body as {
      cvText?: string;
      jobOfferText?: string;
      jobTitle?: string;
      companyName?: string;
    };

    if (!cvText || cvText.trim().length < 50) {
      return NextResponse.json(
        { error: "Le CV fourni est trop court ou vide." },
        { status: 400 }
      );
    }
    if (!jobOfferText || jobOfferText.trim().length < 50) {
      return NextResponse.json(
        { error: "L'offre d'emploi fournie est trop courte ou vide." },
        { status: 400 }
      );
    }

    // Vérifie que l'utilisateur a un crédit ou un abonnement actif AVANT d'appeler Claude.
    let hasActiveSubscription = false;
    try {
      const check = await ensureCreditsAvailable(user.id);
      hasActiveSubscription = check.hasActiveSubscription;
    } catch (err) {
      return NextResponse.json(
        { error: "Vous n'avez plus de crédit disponible.", code: "INSUFFICIENT_CREDITS" },
        { status: 402 }
      );
    }

    const result = await generateOptimizedApplication(cvText, jobOfferText);

    // Débite le crédit seulement après une génération réussie.
    await consumeCredit(user.id, hasActiveSubscription);

    // Enregistre dans l'historique (best-effort : une erreur ici ne doit pas faire échouer la réponse)
    await supabase.from("generations").insert({
      user_id: user.id,
      job_title: jobTitle || null,
      company_name: companyName || null,
      job_offer_text: jobOfferText,
      original_cv_text: cvText,
      generated_cv: result.optimizedCv,
      generated_cover_letter: result.coverLetter,
      match_score: result.matchScore,
      matched_keywords: result.matchedKeywords || [],
      missing_keywords: result.missingKeywords || [],
      template: "classic",
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Erreur /api/generate:", error);
    const message = error instanceof Error ? error.message : "Erreur inconnue.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

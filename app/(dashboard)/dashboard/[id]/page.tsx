import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import { ResultEditor } from "@/components/app/ResultEditor";
import type { ClaudeGenerationResult } from "@/lib/types";

export default async function GenerationDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  // La policy RLS "un utilisateur peut lire ses propres générations" garantit
  // qu'on ne peut pas ouvrir la génération de quelqu'un d'autre en changeant l'id dans l'URL.
  const { data: generation } = await supabase
    .from("generations")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!generation) notFound();

  const result: ClaudeGenerationResult = {
    optimizedCv: generation.generated_cv,
    coverLetter: generation.generated_cover_letter,
    matchScore: generation.match_score ?? 0,
    matchedKeywords: generation.matched_keywords || [],
    missingKeywords: generation.missing_keywords || [],
  };

  return (
    <div>
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Retour à l&apos;historique
      </Link>

      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          {generation.job_title || "Candidature"}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {generation.company_name && `${generation.company_name} · `}
          Générée le{" "}
          {new Date(generation.created_at).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <ResultEditor result={result} jobTitle={generation.job_title || ""} />
    </div>
  );
}

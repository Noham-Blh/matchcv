"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { CVUploader } from "@/components/app/CVUploader";
import { JobOfferInput } from "@/components/app/JobOfferInput";
import { ResultEditor } from "@/components/app/ResultEditor";
import type { ClaudeGenerationResult } from "@/lib/types";

export default function GeneratePage() {
  const router = useRouter();

  const [cvText, setCvText] = useState("");
  const [jobOfferText, setJobOfferText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClaudeGenerationResult | null>(null);

  const canGenerate = cvText.trim().length > 50 && jobOfferText.trim().length > 50 && !loading;

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobOfferText, jobTitle, companyName }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === "INSUFFICIENT_CREDITS") {
          setError("Vous n'avez plus de crédit disponible.");
        } else {
          setError(data.error || "Une erreur est survenue pendant la génération.");
        }
        return;
      }

      setResult(data.result);
      router.refresh();
    } catch {
      setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Générer une candidature</h1>
        <p className="mt-1 text-sm text-slate-600">
          Collez votre CV et l&apos;offre visée. MatchCV réécrit les deux documents pour maximiser vos chances.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CVUploader value={cvText} onChange={setCvText} />
        <JobOfferInput
          value={jobOfferText}
          onChange={setJobOfferText}
          jobTitle={jobTitle}
          onJobTitleChange={setJobTitle}
          companyName={companyName}
          onCompanyNameChange={setCompanyName}
        />
      </div>

      <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-cobalt-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Génération en cours..." : "Générer mon CV et ma lettre"}
        </button>
        <span className="font-mono text-xs text-slate-500">Consomme 1 crédit</span>
      </div>

      {error && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            {error}
            {error.includes("crédit") && (
              <a href="/billing" className="ml-1 font-medium underline underline-offset-2">
                Acheter des crédits
              </a>
            )}
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8">
          <ResultEditor result={result} jobTitle={jobTitle} />
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { FileSearch, Target, PenLine, Sparkles, CheckCircle2 } from "lucide-react";

const STEPS = [
  { icon: FileSearch, text: "Analyse de votre CV..." },
  { icon: Target, text: "Repérage des mots-clés de l'offre..." },
  { icon: PenLine, text: "Réécriture du CV optimisé..." },
  { icon: Sparkles, text: "Rédaction de la lettre de motivation..." },
  { icon: CheckCircle2, text: "Calcul du score de correspondance..." },
];

// Durée approximative (en ms) passée sur chaque étape avant de passer à la
// suivante. La dernière étape reste affichée tant que la réponse n'est pas
// arrivée, quelle que soit la durée réelle (Opus peut prendre 20-40s).
const STEP_DURATION_MS = 3200;

export function GeneratingState() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, STEP_DURATION_MS);
    return () => clearInterval(interval);
  }, []);

  const Current = STEPS[stepIndex];

  return (
    <div className="mt-8 overflow-hidden rounded-[28px] bg-ink p-8 text-white sm:p-10">
      <div className="flex items-center gap-4">
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
          <Current.icon className="h-5 w-5 text-match" />
          <span className="absolute inset-0 animate-ping rounded-2xl bg-match/20" />
        </span>
        <div>
          <p className="font-display text-base font-semibold">{Current.text}</p>
          <p className="mt-0.5 text-xs text-white/50">Ça peut prendre jusqu&apos;à 30 secondes, on soigne les détails.</p>
        </div>
      </div>

      {/* Barre de progression indéterminée */}
      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/3 animate-[loading-bar_1.4s_ease-in-out_infinite] rounded-full bg-match" />
      </div>

      {/* Petites puces d'étapes */}
      <div className="mt-5 flex flex-wrap gap-2">
        {STEPS.map((step, i) => (
          <span
            key={step.text}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              i <= stepIndex ? "bg-match" : "bg-white/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

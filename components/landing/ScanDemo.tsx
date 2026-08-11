"use client";

import { useState } from "react";
import clsx from "clsx";

const BEFORE_LINES = [
  "Chargé de communication — Entreprise SODEXA (2021 — 2024)",
  "Gestion des réseaux sociaux et création de contenus",
  "Participation à des campagnes publicitaires",
  "Suivi de quelques indicateurs de performance",
  "Travail en équipe avec le service commercial",
];

const AFTER_LINES: { text: string; keywords: string[] }[] = [
  { text: "Chef de projet marketing digital — SODEXA (2021 — 2024)", keywords: ["Chef de projet marketing digital"] },
  { text: "Pilotage de la stratégie réseaux sociaux : +42% d'engagement en 8 mois", keywords: ["Pilotage de la stratégie"] },
  { text: "Coordination de campagnes publicitaires cross-canal (SEA, social ads)", keywords: ["campagnes publicitaires cross-canal", "SEA"] },
  { text: "Analyse des KPIs et reporting mensuel via Google Analytics", keywords: ["KPIs", "reporting", "Google Analytics"] },
  { text: "Collaboration transverse avec les équipes commerciales et produit", keywords: ["Collaboration transverse"] },
];

const MATCH_SCORE = { before: 34, after: 91 };

export function ScanDemo() {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <div className="relative">
      <div className="mb-5 flex items-center justify-center gap-1 rounded-full border border-line bg-white p-1 shadow-sm w-fit mx-auto">
        <button
          onClick={() => setShowAfter(false)}
          className={clsx(
            "rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors",
            !showAfter ? "bg-ink text-white" : "text-slate-500 hover:text-ink"
          )}
        >
          Avant
        </button>
        <button
          onClick={() => setShowAfter(true)}
          className={clsx(
            "rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors",
            showAfter ? "bg-ink text-white" : "text-slate-500 hover:text-ink"
          )}
        >
          Après MatchCV
        </button>
      </div>

      <div className="relative mx-auto max-w-xl overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        {/* Barre de scan */}
        {showAfter && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 animate-scan bg-gradient-to-b from-transparent via-match/25 to-transparent" />
        )}

        <div className="flex items-center justify-between border-b border-line bg-paper-dim px-5 py-3">
          <span className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
            cv_candidat.pdf
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-slate-500">Score ATS</span>
            <span
              className={clsx(
                "rounded-full px-2.5 py-0.5 font-mono text-xs font-medium transition-colors duration-300",
                showAfter ? "bg-match text-ink" : "bg-slate-400/20 text-slate-600"
              )}
            >
              {showAfter ? MATCH_SCORE.after : MATCH_SCORE.before}%
            </span>
          </div>
        </div>

        <div className="space-y-4 p-6">
          {!showAfter &&
            BEFORE_LINES.map((line, i) => (
              <p key={i} className="text-[13px] leading-relaxed text-slate-600">
                {line}
              </p>
            ))}

          {showAfter &&
            AFTER_LINES.map((line, i) => {
              let rendered: React.ReactNode = line.text;
              line.keywords.forEach((kw) => {
                const parts = (rendered as string).split(kw);
                if (parts.length > 1) {
                  rendered = (
                    <>
                      {parts.map((part, idx) => (
                        <span key={idx}>
                          {part}
                          {idx < parts.length - 1 && (
                            <span className="highlight-match font-medium">{kw}</span>
                          )}
                        </span>
                      ))}
                    </>
                  );
                }
              });
              return (
                <p key={i} className="text-[13px] leading-relaxed text-ink">
                  {rendered}
                </p>
              );
            })}
        </div>
      </div>

      <p className="mt-4 text-center font-mono text-xs text-slate-500">
        Même expérience, même candidat — reformulé pour l&apos;offre visée.
      </p>
    </div>
  );
}

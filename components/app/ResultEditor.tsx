"use client";

import { useState } from "react";
import clsx from "clsx";
import { Download, Loader2 } from "lucide-react";
import { downloadAsPdf } from "@/lib/pdf/generate";
import type { ClaudeGenerationResult } from "@/lib/types";

interface ResultEditorProps {
  result: ClaudeGenerationResult;
  jobTitle: string;
}

export function ResultEditor({ result, jobTitle }: ResultEditorProps) {
  const [tab, setTab] = useState<"cv" | "letter">("cv");
  const [cvText, setCvText] = useState(result.optimizedCv);
  const [letterText, setLetterText] = useState(result.coverLetter);
  const [template, setTemplate] = useState<"classic" | "modern">("classic");
  const [downloading, setDownloading] = useState<"cv" | "letter" | null>(null);

  async function handleDownload(type: "cv" | "letter") {
    setDownloading(type);
    try {
      await downloadAsPdf(
        type === "cv" ? cvText : letterText,
        type === "cv" ? jobTitle || "CV" : `Lettre de motivation — ${jobTitle || ""}`,
        template,
        type === "cv" ? "cv-matchcv.pdf" : "lettre-motivation-matchcv.pdf"
      );
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-white shadow-card">
      {/* En-tête : score + mots-clés */}
      <div className="flex flex-col gap-5 border-b border-line p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-match">
            <span className="font-mono text-sm font-semibold">{result.matchScore}%</span>
          </div>
          <div>
            <p className="text-sm font-medium">Score de correspondance ATS</p>
            <p className="text-xs text-slate-500">Basé sur les mots-clés de l&apos;offre retrouvés dans votre profil</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:max-w-xs sm:justify-end">
          {result.matchedKeywords.slice(0, 6).map((kw) => (
            <span key={kw} className="rounded-full bg-match/40 px-2.5 py-1 font-mono text-[11px] text-ink">
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Onglets */}
      <div className="flex items-center justify-between border-b border-line px-6">
        <div className="flex gap-6">
          <TabButton active={tab === "cv"} onClick={() => setTab("cv")}>
            CV optimisé
          </TabButton>
          <TabButton active={tab === "letter"} onClick={() => setTab("letter")}>
            Lettre de motivation
          </TabButton>
        </div>

        <div className="flex items-center gap-2 py-3">
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value as "classic" | "modern")}
            className="rounded-lg border border-line bg-white px-2.5 py-1.5 font-mono text-xs outline-none"
          >
            <option value="classic">Modèle Classique</option>
            <option value="modern">Modèle Moderne</option>
          </select>
          <button
            onClick={() => handleDownload(tab)}
            disabled={downloading !== null}
            className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-white hover:bg-cobalt-700 disabled:opacity-60"
          >
            {downloading === tab ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            Export PDF
          </button>
        </div>
      </div>

      {/* Contenu éditable */}
      <div className="p-6">
        {tab === "cv" ? (
          <textarea
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            rows={22}
            className="w-full resize-none rounded-xl border border-line bg-paper-dim p-4 font-mono text-[12.5px] leading-relaxed outline-none focus:border-ink"
          />
        ) : (
          <textarea
            value={letterText}
            onChange={(e) => setLetterText(e.target.value)}
            rows={22}
            className="w-full resize-none rounded-xl border border-line bg-paper-dim p-4 text-sm leading-relaxed outline-none focus:border-ink"
          />
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "border-b-2 py-4 text-sm font-medium transition-colors",
        active ? "border-ink text-ink" : "border-transparent text-slate-500 hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}

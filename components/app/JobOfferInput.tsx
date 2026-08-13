"use client";

import { Target } from "lucide-react";

interface JobOfferInputProps {
  value: string;
  onChange: (text: string) => void;
  jobTitle: string;
  onJobTitleChange: (v: string) => void;
  companyName: string;
  onCompanyNameChange: (v: string) => void;
}

export function JobOfferInput({
  value,
  onChange,
  jobTitle,
  onJobTitleChange,
  companyName,
  onCompanyNameChange,
}: JobOfferInputProps) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-match/30 text-ink">
          <Target className="h-3.5 w-3.5" />
        </span>
        <label className="text-sm font-medium">Offre d&apos;emploi visée</label>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <input
          value={jobTitle}
          onChange={(e) => onJobTitleChange(e.target.value)}
          placeholder="Intitulé du poste"
          className="rounded-full border-0 bg-match/10 px-4 py-2.5 text-sm outline-none transition-colors focus:bg-match/20"
        />
        <input
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          placeholder="Nom de l'entreprise"
          className="rounded-full border-0 bg-match/10 px-4 py-2.5 text-sm outline-none transition-colors focus:bg-match/20"
        />
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Collez ici le texte complet de l'offre d'emploi..."
        rows={11}
        className="w-full resize-none rounded-[28px] border-0 bg-match/10 p-5 text-sm leading-relaxed outline-none transition-colors focus:bg-match/20"
      />
      <p className="mt-1.5 text-right font-mono text-[11px] text-slate-400">
        {value.length.toLocaleString("fr-FR")} caractères
      </p>
    </div>
  );
}

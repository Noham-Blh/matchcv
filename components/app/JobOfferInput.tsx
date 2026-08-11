"use client";

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
      <label className="mb-3 block text-sm font-medium">Offre d&apos;emploi visée</label>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <input
          value={jobTitle}
          onChange={(e) => onJobTitleChange(e.target.value)}
          placeholder="Intitulé du poste"
          className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-ink"
        />
        <input
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          placeholder="Nom de l'entreprise"
          className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-ink"
        />
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Collez ici le texte complet de l'offre d'emploi..."
        rows={11}
        className="w-full resize-none rounded-xl border border-line bg-white p-4 text-sm leading-relaxed outline-none focus:border-ink"
      />
      <p className="mt-1.5 text-right font-mono text-[11px] text-slate-400">
        {value.length.toLocaleString("fr-FR")} caractères
      </p>
    </div>
  );
}

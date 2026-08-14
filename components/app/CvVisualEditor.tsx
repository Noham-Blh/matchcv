"use client";

import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { parseCvContent, serializeCvContent, type CvBlock } from "@/lib/pdf/parseCvContent";

export function CvVisualEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const parsed = useMemo(() => parseCvContent(value), [value]);
  const [showRaw, setShowRaw] = useState(false);

  function update(name: string, contact: string, blocks: CvBlock[]) {
    onChange(serializeCvContent({ name, contact, blocks }));
  }

  function updateBlock(index: number, text: string) {
    const blocks = [...parsed.blocks];
    blocks[index] = { ...blocks[index], text };
    update(parsed.name, parsed.contact, blocks);
  }

  function removeBlock(index: number) {
    const blocks = parsed.blocks.filter((_, i) => i !== index);
    update(parsed.name, parsed.contact, blocks);
  }

  function addBulletAfter(sectionEndIndex: number) {
    const blocks = [...parsed.blocks];
    blocks.splice(sectionEndIndex + 1, 0, { type: "bullet", text: "" });
    update(parsed.name, parsed.contact, blocks);
  }

  if (showRaw) {
    return (
      <div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={22}
          className="w-full resize-none rounded-xl border border-line bg-paper-dim p-4 font-mono text-[12.5px] leading-relaxed outline-none focus:border-ink"
        />
        <button
          onClick={() => setShowRaw(false)}
          className="mt-2 text-xs font-medium text-cobalt-600 hover:text-cobalt-700"
        >
          ← Revenir à l&apos;aperçu visuel
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] bg-white p-8 shadow-elevated">
      <input
        value={parsed.name}
        onChange={(e) => update(e.target.value, parsed.contact, parsed.blocks)}
        placeholder="Nom complet"
        className="w-full border-0 border-b-2 border-ink pb-2 font-display text-2xl font-semibold tracking-tight outline-none"
      />
      <input
        value={parsed.contact}
        onChange={(e) => update(parsed.name, e.target.value, parsed.blocks)}
        placeholder="email · téléphone · ville"
        className="mt-2 w-full border-0 text-sm text-slate-500 outline-none placeholder:text-slate-400"
      />

      <div className="mt-6 space-y-0.5">
        {parsed.blocks.map((block, i) => {
          const isLastOfSection =
            block.type === "bullet" &&
            (i === parsed.blocks.length - 1 || parsed.blocks[i + 1]?.type !== "bullet");

          if (block.type === "heading") {
            return (
              <div key={i} className="group mt-6 flex items-center gap-2 first:mt-0">
                <input
                  value={block.text}
                  onChange={(e) => updateBlock(i, e.target.value)}
                  placeholder="Titre de section"
                  className="flex-1 border-0 bg-transparent font-display text-sm font-bold uppercase tracking-wide text-cobalt-600 outline-none"
                />
                <button
                  onClick={() => removeBlock(i)}
                  className="opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                  aria-label="Supprimer cette section"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          }

          if (block.type === "subheading") {
            return (
              <div key={i} className="group mt-2 flex items-center gap-2">
                <input
                  value={block.text}
                  onChange={(e) => updateBlock(i, e.target.value)}
                  placeholder="Poste / formation"
                  className="flex-1 border-0 bg-transparent text-sm font-semibold outline-none"
                />
                <button
                  onClick={() => removeBlock(i)}
                  className="opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                  aria-label="Supprimer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          }

          if (block.type === "bullet") {
            return (
              <div key={i}>
                <div className="group flex items-start gap-2 py-0.5">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                  <input
                    value={block.text}
                    onChange={(e) => updateBlock(i, e.target.value)}
                    placeholder="Réalisation..."
                    className="flex-1 border-0 bg-transparent text-sm outline-none"
                  />
                  <button
                    onClick={() => removeBlock(i)}
                    className="mt-0.5 opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                    aria-label="Supprimer cette puce"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {isLastOfSection && (
                  <button
                    onClick={() => addBulletAfter(i)}
                    className="ml-3 mt-0.5 flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-cobalt-600"
                  >
                    <Plus className="h-3 w-3" /> Ajouter une puce
                  </button>
                )}
              </div>
            );
          }

          return (
            <div key={i} className="group flex items-center gap-2 py-0.5">
              <input
                value={block.text}
                onChange={(e) => updateBlock(i, e.target.value)}
                className="flex-1 border-0 bg-transparent text-sm outline-none"
              />
              <button
                onClick={() => removeBlock(i)}
                className="opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                aria-label="Supprimer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setShowRaw(true)}
        className="mt-6 text-[11px] font-medium text-slate-400 hover:text-cobalt-600"
      >
        Voir/modifier le texte brut
      </button>
    </div>
  );
}

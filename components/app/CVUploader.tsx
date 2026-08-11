"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileText } from "lucide-react";

interface CVUploaderProps {
  value: string;
  onChange: (text: string) => void;
}

export function CVUploader({ value, onChange }: CVUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setExtractError(null);
    setFileName(file.name);

    if (file.type === "text/plain") {
      const text = await file.text();
      onChange(text);
      return;
    }

    if (file.type === "application/pdf") {
      setExtracting(true);
      try {
        // Chargement dynamique pour éviter d'inclure pdf.js dans le bundle serveur.
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map((item: any) => item.str).join(" ") + "\n";
        }
        onChange(fullText.trim());
      } catch (err) {
        setExtractError("Impossible de lire ce PDF. Essayez de coller le texte directement.");
      } finally {
        setExtracting(false);
      }
      return;
    }

    setExtractError("Format non supporté. Utilisez un fichier .txt ou .pdf.");
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-medium">Votre CV actuel</label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 font-mono text-xs text-cobalt-600 hover:text-cobalt-700"
        >
          <UploadCloud className="h-3.5 w-3.5" /> Importer un PDF ou .txt
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {fileName && (
        <div className="mb-2 flex items-center gap-1.5 text-xs text-slate-500">
          <FileText className="h-3.5 w-3.5" />
          {fileName} {extracting && "— extraction en cours..."}
        </div>
      )}
      {extractError && <p className="mb-2 text-xs text-red-600">{extractError}</p>}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Collez ici le texte complet de votre CV : expériences, formations, compétences..."
        rows={14}
        className="w-full resize-none rounded-xl border border-line bg-white p-4 text-sm leading-relaxed outline-none focus:border-ink"
      />
      <p className="mt-1.5 text-right font-mono text-[11px] text-slate-400">
        {value.length.toLocaleString("fr-FR")} caractères
      </p>
    </div>
  );
}

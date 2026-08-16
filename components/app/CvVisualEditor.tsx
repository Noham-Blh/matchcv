"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, X, Camera, Loader2 } from "lucide-react";
import { parseCvContent, serializeCvContent, type CvBlock } from "@/lib/pdf/parseCvContent";
import { CV_THEMES, getCvTheme } from "@/lib/cvThemes";
import { createClient } from "@/lib/supabase/client";

export function CvVisualEditor({
  value,
  onChange,
  onCustomizationChange,
}: {
  value: string;
  onChange: (next: string) => void;
  onCustomizationChange?: (photoUrl: string | null, themeId: string) => void;
}) {
  const parsed = useMemo(() => parseCvContent(value), [value]);
  const [showRaw, setShowRaw] = useState(false);
  const supabase = createClient();

  // ── Photo et couleur (stockées sur le profil, réutilisées à chaque CV) ──
  const [userId, setUserId] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [themeId, setThemeId] = useState<string>("cobalt");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("photo_url, cv_theme")
        .eq("id", user.id)
        .single();

      if (profile) {
        setPhotoUrl(profile.photo_url);
        setThemeId(profile.cv_theme || "cobalt");
        onCustomizationChange?.(profile.photo_url, profile.cv_theme || "cobalt");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handlePhotoUpload(file: File) {
    if (!userId) return;
    setUploadingPhoto(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/photo.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = `${data.publicUrl}?t=${Date.now()}`; // évite le cache navigateur sur remplacement

      await supabase.from("profiles").update({ photo_url: url }).eq("id", userId);
      setPhotoUrl(url);
      onCustomizationChange?.(url, themeId);
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleRemovePhoto() {
    if (!userId) return;
    await supabase.from("profiles").update({ photo_url: null }).eq("id", userId);
    setPhotoUrl(null);
    onCustomizationChange?.(null, themeId);
  }

  async function handleThemeChange(id: string) {
    setThemeId(id);
    onCustomizationChange?.(photoUrl, id);
    if (userId) {
      await supabase.from("profiles").update({ cv_theme: id }).eq("id", userId);
    }
  }

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

  const activeTheme = getCvTheme(themeId);

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
      {/* Personnalisation : photo + couleur */}
      <div className="mb-6 flex flex-wrap items-center gap-6 border-b border-line pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPhoto}
            className="group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-paper-dim"
            style={{ boxShadow: photoUrl ? `0 0 0 2px ${activeTheme.accent}` : undefined }}
          >
            {uploadingPhoto ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            ) : photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="Photo de profil" className="h-full w-full object-cover" />
            ) : (
              <Camera className="h-5 w-5 text-slate-400" />
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-ink/50 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              Changer
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
          />
          <div className="text-xs">
            <p className="font-medium text-slate-700">Photo (optionnelle)</p>
            {photoUrl ? (
              <button onClick={handleRemovePhoto} className="text-slate-400 hover:text-red-600">
                Retirer la photo
              </button>
            ) : (
              <p className="text-slate-400">Cliquez pour ajouter</p>
            )}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-slate-700">Couleur du CV</p>
          <div className="flex gap-2">
            {CV_THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                title={t.label}
                className="h-6 w-6 rounded-full transition-transform hover:scale-110"
                style={{
                  backgroundColor: t.accent,
                  boxShadow: themeId === t.id ? `0 0 0 2px white, 0 0 0 4px ${t.accent}` : undefined,
                }}
                aria-label={t.label}
              />
            ))}
          </div>
        </div>
      </div>

      <input
        value={parsed.name}
        onChange={(e) => update(e.target.value, parsed.contact, parsed.blocks)}
        placeholder="Nom complet"
        className="w-full border-0 border-b-2 pb-2 font-display text-2xl font-semibold tracking-tight outline-none"
        style={{ borderColor: activeTheme.accent }}
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
                  className="flex-1 border-0 bg-transparent font-display text-sm font-bold uppercase tracking-wide outline-none"
                  style={{ color: activeTheme.accent }}
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

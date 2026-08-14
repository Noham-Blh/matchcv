"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AccountSettingsForm({ email, fullName: initialFullName }: { email: string; fullName: string }) {
  const router = useRouter();
  const supabase = createClient();

  // ── Nom complet ──
  const [fullName, setFullName] = useState(initialFullName);
  const [savingName, setSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setSavingName(true);
    setNameSaved(false);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
      setNameSaved(true);
      router.refresh();
      setTimeout(() => setNameSaved(false), 2000);
    }
    setSavingName(false);
  }

  // ── Mot de passe ──
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);

    if (error) {
      setPasswordError("Impossible de mettre à jour le mot de passe. Réessaie.");
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2000);
  }

  // ── Suppression du compte ──
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError(null);

    const res = await fetch("/api/account/delete", { method: "POST" });

    if (!res.ok) {
      setDeleteError("Impossible de supprimer le compte. Réessaie ou contacte contact@matchcv.fr.");
      setDeleting(false);
      return;
    }

    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mt-8 space-y-10">
      {/* Nom complet */}
      <section>
        <h2 className="text-sm font-medium">Informations personnelles</h2>
        <form onSubmit={handleSaveName} className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="text-xs font-medium text-slate-600">Nom complet</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-ink"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">E-mail</label>
            <input
              value={email}
              disabled
              className="mt-1.5 w-full cursor-not-allowed rounded-lg border border-line bg-paper-dim px-3.5 py-2.5 text-sm text-slate-500 outline-none sm:w-64"
            />
          </div>
          <button
            type="submit"
            disabled={savingName}
            className="flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-cobalt-700 disabled:opacity-50"
          >
            {savingName ? <Loader2 className="h-4 w-4 animate-spin" /> : nameSaved ? <Check className="h-4 w-4" /> : null}
            {nameSaved ? "Enregistré" : "Enregistrer"}
          </button>
        </form>
        <p className="mt-2 text-xs text-slate-400">
          Le changement d&apos;adresse e-mail n&apos;est pas encore disponible en libre-service — écris-nous à
          contact@matchcv.fr si besoin.
        </p>
      </section>

      <div className="border-t border-line" />

      {/* Mot de passe */}
      <section>
        <h2 className="text-sm font-medium">Mot de passe</h2>
        <form onSubmit={handleChangePassword} className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-600">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="8 caractères minimum"
              className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-ink"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="8 caractères minimum"
              className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-ink"
            />
          </div>
          {passwordError && <p className="sm:col-span-2 text-sm text-red-600">{passwordError}</p>}
          <button
            type="submit"
            disabled={savingPassword || !newPassword}
            className="flex w-fit items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-cobalt-700 disabled:opacity-50 sm:col-span-2"
          >
            {savingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : passwordSaved ? <Check className="h-4 w-4" /> : null}
            {passwordSaved ? "Mot de passe mis à jour" : "Mettre à jour le mot de passe"}
          </button>
        </form>
      </section>

      <div className="border-t border-line" />

      {/* Suppression du compte */}
      <section>
        <h2 className="text-sm font-medium text-red-600">Zone dangereuse</h2>
        <p className="mt-2 max-w-lg text-sm text-slate-600">
          Supprimer ton compte efface définitivement ton profil, tes crédits et l&apos;accès à ton historique
          de générations. Cette action est irréversible.
        </p>

        {!confirmingDelete ? (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="mt-4 rounded-full border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Supprimer mon compte
          </button>
        ) : (
          <div className="mt-4 max-w-md rounded-2xl bg-red-50 p-5">
            <p className="flex items-start gap-2 text-sm text-red-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              Tape <strong>SUPPRIMER</strong> ci-dessous pour confirmer. Cette action est définitive.
            </p>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="mt-3 w-full rounded-lg border border-red-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-red-400"
              placeholder="SUPPRIMER"
            />
            {deleteError && <p className="mt-2 text-sm text-red-700">{deleteError}</p>}
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={confirmText !== "SUPPRIMER" || deleting}
                className="flex items-center gap-1.5 rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-40"
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirmer la suppression
              </button>
              <button
                onClick={() => {
                  setConfirmingDelete(false);
                  setConfirmText("");
                  setDeleteError(null);
                }}
                className="rounded-full px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-white"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resent, setResent] = useState(false);

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setError("Une erreur est survenue. Merci de réessayer.");
      setLoading(false);
      return;
    }

    setStep("reset");
    setLoading(false);
  }

  async function handleResend() {
    setResent(false);
    await supabase.auth.resetPasswordForEmail(email);
    setResent(true);
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "recovery",
    });

    if (verifyError) {
      setError("Code incorrect ou expiré. Vérifiez le code reçu par e-mail, ou renvoyez-en un nouveau.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError("Impossible de mettre à jour le mot de passe. Réessayez.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (step === "reset") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper-dim px-5 py-12">
        <Card className="w-full max-w-sm p-8">
          <h1 className="text-xl font-semibold">Réinitialiser le mot de passe</h1>
          <p className="mt-3 text-sm text-slate-600">
            Entrez le code reçu à <strong>{email}</strong>, ainsi que votre nouveau mot de passe.
          </p>

          <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Code de vérification</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
                inputMode="numeric"
                maxLength={8}
                placeholder="12345678"
                autoFocus
                className="mt-1 w-full rounded-lg border border-line px-3.5 py-3 text-center font-mono text-lg tracking-[0.3em] outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Nouveau mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                placeholder="8 caractères minimum"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Confirmer le mot de passe</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                placeholder="8 caractères minimum"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={loading || code.length < 6} className="w-full">
              {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
            </Button>
          </form>

          <button
            onClick={handleResend}
            className="mt-4 w-full text-center text-sm font-medium text-cobalt-600 hover:text-cobalt-700"
          >
            {resent ? "Nouveau code envoyé ✓" : "Renvoyer le code"}
          </button>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper-dim px-5 py-12">
      <Card className="w-full max-w-sm p-8">
        <Link href="/" className="font-display text-lg font-semibold">
          MatchCV
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Mot de passe oublié</h1>
        <p className="mt-1 text-sm text-slate-600">
          Entrez votre e-mail, nous vous envoyons un code pour en choisir un nouveau.
        </p>

        <form onSubmit={handleRequestCode} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              placeholder="vous@exemple.com"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Envoi..." : "Envoyer le code"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          <Link href="/login" className="font-medium text-ink underline underline-offset-2">
            Retour à la connexion
          </Link>
        </p>
      </Card>
    </main>
  );
}

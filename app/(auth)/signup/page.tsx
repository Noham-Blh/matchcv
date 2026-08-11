"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "code">("form");

  // Étape 2 : vérification du code à 6 chiffres reçu par e-mail.
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(
        error.message.includes("already registered")
          ? "Un compte existe déjà avec cet e-mail."
          : "Une erreur est survenue. Merci de réessayer."
      );
      setLoading(false);
      return;
    }

    // Si la confirmation par e-mail est désactivée dans Supabase, une session est déjà créée.
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setStep("code");
    setLoading(false);
  }

  async function handleGoogleSignup() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(true);
    setCodeError(null);

    const { error, data } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "signup",
    });

    if (error) {
      setCodeError("Code incorrect ou expiré. Vérifiez le code reçu par e-mail, ou renvoyez-en un nouveau.");
      setVerifying(false);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setVerifying(false);
  }

  async function handleResendCode() {
    setResent(false);
    await supabase.auth.resend({ type: "signup", email });
    setResent(true);
  }

  if (step === "code") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper-dim px-5">
        <Card className="w-full max-w-sm p-8">
          <h1 className="text-xl font-semibold">Vérifiez votre e-mail</h1>
          <p className="mt-3 text-sm text-slate-600">
            Nous avons envoyé un code de vérification à <strong>{email}</strong>. Saisissez-le ci-dessous pour activer
            votre compte et récupérer votre crédit gratuit.
          </p>

          <form onSubmit={handleVerifyCode} className="mt-6 space-y-4">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
              inputMode="numeric"
              maxLength={8}
              placeholder="12345678"
              autoFocus
              className="w-full rounded-lg border border-line px-3.5 py-3 text-center font-mono text-lg tracking-[0.3em] outline-none focus:border-ink"
            />

            {codeError && <p className="text-sm text-red-600">{codeError}</p>}

            <Button type="submit" disabled={verifying || code.length < 6} className="w-full">
              {verifying ? "Vérification..." : "Valider le code"}
            </Button>
          </form>

          <button
            onClick={handleResendCode}
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
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Créer un compte</h1>
        <p className="mt-1 text-sm text-slate-600">1 génération offerte, sans carte bancaire.</p>

        <button
          onClick={handleGoogleSignup}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-line bg-white py-2.5 text-sm font-medium hover:border-ink"
        >
          Continuer avec Google
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <span className="font-mono text-xs text-slate-400">ou</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600">Nom complet</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              placeholder="Jeanne Dupont"
            />
          </div>
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
          <div>
            <label className="text-xs font-medium text-slate-600">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              placeholder="8 caractères minimum"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Création..." : "Créer mon compte"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Déjà un compte ?{" "}
          <Link href="/login" className="font-medium text-ink underline underline-offset-2">
            Se connecter
          </Link>
        </p>
      </Card>
    </main>
  );
}

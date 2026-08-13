"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { AuthLayout } from "@/components/app/AuthLayout";

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const refCode = searchParams.get("ref");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "code">("form");

  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  async function completeReferralIfAny() {
    // Best-effort : ne bloque jamais la redirection si ça échoue.
    try {
      await fetch("/api/referral/complete", { method: "POST" });
    } catch {}
  }

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
        data: { full_name: fullName, ref: refCode || undefined },
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

    if (data.session) {
      await completeReferralIfAny();
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setStep("code");
    setLoading(false);
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
      await completeReferralIfAny();
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
      <AuthLayout>
        <h1 className="text-2xl font-semibold tracking-tight">Vérifiez votre e-mail</h1>
        <p className="mt-3 text-sm text-slate-600">
          Nous avons envoyé un code de vérification à <strong>{email}</strong>. Saisissez-le ci-dessous pour
          activer votre compte et récupérer votre crédit gratuit.
        </p>

        <form onSubmit={handleVerifyCode} className="mt-7 space-y-4">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
            inputMode="numeric"
            maxLength={8}
            placeholder="12345678"
            autoFocus
            className="w-full rounded-lg border border-line px-3.5 py-3 text-center font-mono text-lg tracking-[0.3em] outline-none transition-colors focus:border-ink"
          />

          {codeError && <p className="text-sm text-red-600">{codeError}</p>}

          <Button type="submit" disabled={verifying || code.length < 6} className="w-full">
            {verifying ? "Vérification..." : "Valider le code"}
          </Button>
        </form>

        <button
          onClick={handleResendCode}
          className="mt-5 w-full text-center text-sm font-medium text-cobalt-600 hover:text-cobalt-700"
        >
          {resent ? "Nouveau code envoyé ✓" : "Renvoyer le code"}
        </button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Créer un compte</h1>
      <p className="mt-1.5 text-sm text-slate-600">1 génération offerte, sans carte bancaire.</p>
      {refCode && (
        <p className="mt-3 rounded-lg bg-match/30 px-3 py-2 text-xs text-ink">
          Tu as été invité par un ami — vous recevrez chacun un crédit une fois ton compte confirmé 🎉
        </p>
      )}

      <form onSubmit={handleSignup} className="mt-7 space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-600">Nom complet</label>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-ink"
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
            className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-ink"
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
            className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-ink"
            placeholder="8 caractères minimum"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Création..." : "Créer mon compte"}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-600">
        Déjà un compte ?{" "}
        <Link href="/login" className="font-medium text-ink underline underline-offset-2">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}

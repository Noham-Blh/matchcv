"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Adresse e-mail ou mot de passe incorrect."
          : "Une erreur est survenue. Merci de réessayer."
      );
      setLoading(false);
      return;
    }

    router.push(searchParams.get("redirectedFrom") || "/dashboard");
    router.refresh();
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper-dim px-5 py-12">
      <Card className="w-full max-w-sm p-8">
        <Link href="/" className="font-display text-lg font-semibold">
          MatchCV
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Connexion</h1>
        <p className="mt-1 text-sm text-slate-600">Accédez à vos CV générés et vos crédits.</p>

        <button
          onClick={handleGoogleLogin}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-line bg-white py-2.5 text-sm font-medium hover:border-ink"
        >
          <GoogleIcon /> Continuer avec Google
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <span className="font-mono text-xs text-slate-400">ou</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="font-medium text-ink underline underline-offset-2">
            Créer un compte
          </Link>
        </p>
      </Card>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.1-4 1.1-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.3 7.4 24 12 24z" />
      <path fill="#FBBC05" d="M5.4 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.4C.5 8.3 0 10.1 0 12s.5 3.7 1.4 5.4l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.7l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.6l4 3.1c.9-2.8 3.5-4.9 6.6-4.9z" />
    </svg>
  );
}

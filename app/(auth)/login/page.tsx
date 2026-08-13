"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { AuthLayout } from "@/components/app/AuthLayout";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
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

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
      <p className="mt-1.5 text-sm text-slate-600">Accédez à vos CV générés et vos crédits.</p>

      <form onSubmit={handleLogin} className="mt-7 space-y-4">
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
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-600">Mot de passe</label>
            <Link href="/forgot-password" className="text-xs text-cobalt-600 hover:text-cobalt-700">
              Mot de passe oublié ?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-ink"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-600">
        Pas encore de compte ?{" "}
        <Link href="/signup" className="font-medium text-ink underline underline-offset-2">
          Créer un compte
        </Link>
      </p>
    </AuthLayout>
  );
}

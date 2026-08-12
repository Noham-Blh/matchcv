"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [ready, setReady] = useState(false);
  const [linkInvalid, setLinkInvalid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Le lien de récupération contient un jeton dans l'URL : le client Supabase le détecte
    // automatiquement au chargement de la page et déclenche cet événement une fois la session prête.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setReady(true);
      }
    });

    // Si aucune session n'est détectée après un court délai, le lien est probablement invalide/expiré.
    const timeout = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setReady(true);
      } else {
        setLinkInvalid(true);
      }
    }, 2500);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
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
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(
        "Impossible de mettre à jour le mot de passe. Le lien a peut-être expiré, redemandez-en un nouveau."
      );
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (linkInvalid) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper-dim px-5">
        <Card className="w-full max-w-sm p-8 text-center">
          <h1 className="text-xl font-semibold">Lien invalide ou expiré</h1>
          <p className="mt-3 text-sm text-slate-600">
            Ce lien de réinitialisation n&apos;est plus valable. Redemandez-en un nouveau.
          </p>
          <Link
            href="/forgot-password"
            className="mt-5 inline-block font-medium text-cobalt-600 underline underline-offset-2"
          >
            Redemander un lien
          </Link>
        </Card>
      </main>
    );
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper-dim px-5">
        <p className="text-sm text-slate-500">Vérification du lien...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper-dim px-5 py-12">
      <Card className="w-full max-w-sm p-8">
        <Link href="/" className="font-display text-lg font-semibold">
          MatchCV
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Nouveau mot de passe</h1>
        <p className="mt-1 text-sm text-slate-600">Choisissez un nouveau mot de passe pour votre compte.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </Button>
        </form>
      </Card>
    </main>
  );
}

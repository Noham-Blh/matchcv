"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Loader2, Layers, Infinity as InfinityIcon } from "lucide-react";

async function redirectToCheckout(mode: "credits" | "subscription") {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode }),
  });
  const data = await res.json();
  if (data.url) window.location.href = data.url;
}

async function redirectToPortal() {
  const res = await fetch("/api/stripe/portal", { method: "POST" });
  const data = await res.json();
  if (data.url) window.location.href = data.url;
}

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  async function handleClick(action: () => Promise<void>, key: string) {
    setLoading(key);
    try {
      await action();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-4xl font-semibold tracking-tight">Facturation</h1>
      <p className="mt-2 text-slate-600">
        Achetez des crédits à l&apos;unité ou passez à l&apos;abonnement illimité (paiement sécurisé via Stripe, mode test).
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="relative overflow-hidden rounded-[36px] bg-cobalt-50 p-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-cobalt-600">
            <Layers className="h-5 w-5" />
          </span>
          <h2 className="mt-5 font-display text-lg font-semibold">Pack 5 crédits</h2>
          <div className="mt-2 text-4xl font-semibold tracking-tight">12€</div>
          <p className="mt-1 text-xs text-slate-500">Paiement unique, sans expiration</p>
          <ul className="mt-6 space-y-2.5 text-sm">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-cobalt-600" /> 5 générations CV + lettre
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-cobalt-600" /> Export PDF illimité
            </li>
          </ul>
          <button
            onClick={() => handleClick(() => redirectToCheckout("credits"), "credits")}
            disabled={loading !== null || !accepted}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-cobalt-700 disabled:opacity-40"
          >
            {loading === "credits" && <Loader2 className="h-4 w-4 animate-spin" />}
            Acheter le pack
          </button>
        </div>

        <div className="relative overflow-hidden rounded-[36px] bg-ink p-8 text-white">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-match/20 blur-[70px]" />
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-match">
            <InfinityIcon className="h-5 w-5" />
          </span>
          <h2 className="relative mt-5 font-display text-lg font-semibold">Illimité</h2>
          <div className="relative mt-2 text-4xl font-semibold tracking-tight">
            19€<span className="text-sm font-normal text-white/60"> / mois</span>
          </div>
          <p className="relative mt-1 text-xs text-white/60">Résiliable à tout moment</p>
          <ul className="relative mt-6 space-y-2.5 text-sm">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-match" /> Générations illimitées
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-match" /> Export PDF illimité
            </li>
          </ul>
          <button
            onClick={() => handleClick(() => redirectToCheckout("subscription"), "subscription")}
            disabled={loading !== null || !accepted}
            className="relative mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-match px-5 py-3 text-sm font-medium text-ink hover:bg-match/90 disabled:opacity-40"
          >
            {loading === "subscription" && <Loader2 className="h-4 w-4 animate-spin" />}
            S&apos;abonner
          </button>
        </div>
      </div>

      <label className="mt-7 flex items-start gap-2.5 text-xs text-slate-600">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-line"
        />
        <span>
          J&apos;accepte les{" "}
          <Link href="/cgv" target="_blank" className="underline hover:text-ink">
            Conditions Générales de Vente
          </Link>{" "}
          et je demande l&apos;exécution immédiate du service, ce qui implique la renonciation à mon
          droit de rétractation de 14 jours conformément à l&apos;article L221-28 du Code de la
          consommation.
        </span>
      </label>

      <div className="mt-10 border-t border-line pt-8">
        <h3 className="text-sm font-medium">Gérer mon abonnement</h3>
        <p className="mt-1 text-xs text-slate-500">
          Modifiez votre moyen de paiement, consultez vos factures ou résiliez votre abonnement.
        </p>
        <button
          onClick={() => handleClick(redirectToPortal, "portal")}
          disabled={loading !== null}
          className="mt-4 rounded-full bg-paper-dim px-4 py-2 text-xs font-medium hover:bg-line disabled:opacity-60"
        >
          {loading === "portal" ? "Redirection..." : "Ouvrir l'espace client Stripe"}
        </button>
      </div>
    </div>
  );
}

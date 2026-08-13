"use client";

import { useState } from "react";
import { Copy, Check, Gift } from "lucide-react";

export function ReferralCard({ referralCode, referralCount }: { referralCode: string; referralCount: number }) {
  const [copied, setCopied] = useState(false);
  const link = `https://matchcv.fr/signup?ref=${referralCode}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="h-1.5 w-full bg-cobalt-500" />
      <div className="p-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cobalt-50 text-cobalt-600">
            <Gift className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-medium">Parraine un ami, gagne un crédit</h3>
        </div>
        <p className="mt-2.5 text-xs text-slate-500">
          Chaque personne qui s&apos;inscrit avec ton lien te fait gagner +1 crédit dès qu&apos;elle confirme
          son compte.
        </p>

        <div className="mt-4 flex items-center gap-2">
          <input
            readOnly
            value={link}
            className="flex-1 truncate rounded-lg border border-line bg-paper-dim px-3 py-2 font-mono text-xs text-slate-600"
          />
          <button
            onClick={handleCopy}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-3 py-2 text-xs font-medium text-white hover:bg-cobalt-700"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copié" : "Copier"}
          </button>
        </div>

        <p className="mt-3 font-mono text-xs text-slate-500">
          {referralCount} filleul{referralCount === 1 ? "" : "s"} confirmé{referralCount === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}

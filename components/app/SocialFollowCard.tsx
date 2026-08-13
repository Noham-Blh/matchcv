"use client";

import { useState } from "react";
import { Instagram, Facebook, Music2, Check } from "lucide-react";

// Comptes officiels MatchCV.
const PLATFORMS = [
  { id: "instagram" as const, label: "Instagram", icon: Instagram, url: "https://www.instagram.com/matchcv_officiel/" },
  { id: "tiktok" as const, label: "TikTok", icon: Music2, url: "https://www.tiktok.com/@matchcv_officiel" },
  { id: "facebook" as const, label: "Facebook", icon: Facebook, url: "https://www.facebook.com/profile.php?id=61593317816650" },
];

export function SocialFollowCard({
  requestedPlatforms,
}: {
  requestedPlatforms: { platform: string; status: string }[];
}) {
  const [credited, setCredited] = useState<Set<string>>(
    new Set(requestedPlatforms.map((r) => r.platform))
  );
  const [loading, setLoading] = useState<string | null>(null);

  async function handleRequest(platform: string) {
    setLoading(platform);
    try {
      const res = await fetch("/api/social/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      if (res.ok) {
        setCredited((prev) => new Set(prev).add(platform));
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
      <h3 className="text-sm font-medium">Suis-nous, gagne un crédit</h3>
      <p className="mt-1.5 text-xs text-slate-500">
        Suis un compte MatchCV, clique sur le bouton correspondant : ton crédit est ajouté immédiatement.
      </p>

      <div className="mt-4 space-y-2">
        {PLATFORMS.map((p) => {
          const isCredited = credited.has(p.id);
          return (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5">
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium hover:text-cobalt-600"
              >
                <p.icon className="h-4 w-4" /> {p.label}
              </a>

              {isCredited ? (
                <span className="flex items-center gap-1 font-mono text-xs text-cobalt-600">
                  <Check className="h-3.5 w-3.5" /> Crédité
                </span>
              ) : (
                <button
                  onClick={() => handleRequest(p.id)}
                  disabled={loading === p.id}
                  className="rounded-full bg-paper-dim px-3 py-1 text-xs font-medium hover:bg-line disabled:opacity-50"
                >
                  {loading === p.id ? "..." : "J'ai suivi"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

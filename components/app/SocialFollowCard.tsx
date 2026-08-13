"use client";

import { useEffect, useState } from "react";
import { Instagram, Facebook, Music2, Check, ExternalLink, Loader2 } from "lucide-react";

// Comptes officiels MatchCV.
const PLATFORMS = [
  { id: "instagram" as const, label: "Instagram", icon: Instagram, url: "https://www.instagram.com/matchcv_officiel/" },
  { id: "tiktok" as const, label: "TikTok", icon: Music2, url: "https://www.tiktok.com/@matchcv_officiel" },
  { id: "facebook" as const, label: "Facebook", icon: Facebook, url: "https://www.facebook.com/profile.php?id=61593317816650" },
];

// Délai imposé après avoir ouvert le compte, avant de pouvoir réclamer le crédit.
// (On ne peut pas vérifier à 100% qu'un compte a été suivi sans passer par une
// connexion OAuth avec chaque réseau — ce délai limite au moins les clics à la chaîne.)
const CLICK_THROUGH_DELAY_MS = 8000;

export function SocialFollowCard({
  requestedPlatforms,
}: {
  requestedPlatforms: { platform: string; status: string }[];
}) {
  const [credited, setCredited] = useState<Set<string>>(
    new Set(requestedPlatforms.map((r) => r.platform))
  );
  const [loading, setLoading] = useState<string | null>(null);
  const [clickedAt, setClickedAt] = useState<Record<string, number>>({});
  const [ready, setReady] = useState<Set<string>>(new Set());

  // Force un petit re-rendu régulier pendant le décompte pour mettre à jour le bouton.
  const [, forceTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => forceTick((n) => n + 1), 500);
    return () => clearInterval(interval);
  }, []);

  function handleLinkClick(platform: string) {
    if (clickedAt[platform]) return;
    const now = Date.now();
    setClickedAt((prev) => ({ ...prev, [platform]: now }));
    setTimeout(() => {
      setReady((prev) => new Set(prev).add(platform));
    }, CLICK_THROUGH_DELAY_MS);
  }

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
        Clique d&apos;abord sur le compte pour aller le suivre, le bouton pour réclamer ton crédit apparaît
        juste après.
      </p>

      <div className="mt-4 space-y-2">
        {PLATFORMS.map((p) => {
          const isCredited = credited.has(p.id);
          const hasClicked = Boolean(clickedAt[p.id]);
          const isReady = ready.has(p.id);
          const remainingSeconds = hasClicked
            ? Math.max(0, Math.ceil((CLICK_THROUGH_DELAY_MS - (Date.now() - clickedAt[p.id])) / 1000))
            : 0;

          return (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5">
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(p.id)}
                className="flex items-center gap-2 text-sm font-medium hover:text-cobalt-600"
              >
                <p.icon className="h-4 w-4" /> {p.label}
                {!isCredited && <ExternalLink className="h-3 w-3 text-slate-400" />}
              </a>

              {isCredited ? (
                <span className="flex items-center gap-1 font-mono text-xs text-cobalt-600">
                  <Check className="h-3.5 w-3.5" /> Crédité
                </span>
              ) : !hasClicked ? (
                <span className="font-mono text-xs text-slate-400">Suis le compte →</span>
              ) : !isReady ? (
                <span className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> {remainingSeconds}s
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

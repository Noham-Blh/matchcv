"use client";

import { useEffect, useRef, useState } from "react";
import { Instagram, Facebook, Music2, Check, Loader2 } from "lucide-react";

// Comptes officiels MatchCV.
const PLATFORMS = [
  { id: "instagram" as const, label: "Instagram", icon: Instagram, url: "https://www.instagram.com/matchcv_officiel/" },
  { id: "tiktok" as const, label: "TikTok", icon: Music2, url: "https://www.tiktok.com/@matchcv_officiel" },
  { id: "facebook" as const, label: "Facebook", icon: Facebook, url: "https://www.facebook.com/profile.php?id=61593317816650" },
];

// Délai imposé après avoir ouvert le compte, avant de créditer automatiquement.
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
  const [counting, setCounting] = useState<Record<string, number>>({});
  const timers = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      Object.values(activeTimers).forEach(clearInterval);
    };
  }, []);

  async function creditPlatform(platform: string) {
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
      setCounting((prev) => {
        const next = { ...prev };
        delete next[platform];
        return next;
      });
    }
  }

  function handleClick(platform: string, url: string) {
    if (credited.has(platform) || counting[platform] !== undefined) return;

    // Ouvre le compte à suivre dans un nouvel onglet.
    window.open(url, "_blank", "noopener,noreferrer");

    // Lance le compte à rebours ; le crédit est ajouté automatiquement à la fin,
    // sans que la personne ait besoin de revenir cliquer une deuxième fois.
    let remaining = Math.ceil(CLICK_THROUGH_DELAY_MS / 1000);
    setCounting((prev) => ({ ...prev, [platform]: remaining }));

    timers.current[platform] = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(timers.current[platform]);
        delete timers.current[platform];
        creditPlatform(platform);
      } else {
        setCounting((prev) => ({ ...prev, [platform]: remaining }));
      }
    }, 1000);
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
      <h3 className="text-sm font-medium">Suis-nous, gagne un crédit</h3>
      <p className="mt-1.5 text-xs text-slate-500">
        Clique sur un réseau pour aller le suivre : ton crédit est ajouté automatiquement à ton retour.
      </p>

      <div className="mt-4 space-y-2">
        {PLATFORMS.map((p) => {
          const isCredited = credited.has(p.id);
          const remaining = counting[p.id];

          return (
            <button
              key={p.id}
              onClick={() => handleClick(p.id, p.url)}
              disabled={isCredited || remaining !== undefined}
              className="flex w-full items-center justify-between rounded-lg border border-line px-3 py-2.5 text-left hover:bg-paper-dim disabled:hover:bg-transparent"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <p.icon className="h-4 w-4" /> {p.label}
              </span>

              {isCredited ? (
                <span className="flex items-center gap-1 font-mono text-xs text-cobalt-600">
                  <Check className="h-3.5 w-3.5" /> Crédité
                </span>
              ) : remaining !== undefined ? (
                <span className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> {remaining}s
                </span>
              ) : (
                <span className="font-mono text-xs text-cobalt-600">Suivre →</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

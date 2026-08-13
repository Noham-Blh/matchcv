"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Check, Gift, Instagram, Facebook, Music2, Loader2 } from "lucide-react";

const PLATFORMS = [
  { id: "instagram" as const, label: "Instagram", icon: Instagram, url: "https://www.instagram.com/matchcv_officiel/" },
  { id: "tiktok" as const, label: "TikTok", icon: Music2, url: "https://www.tiktok.com/@matchcv_officiel" },
  { id: "facebook" as const, label: "Facebook", icon: Facebook, url: "https://www.facebook.com/profile.php?id=61593317816650" },
];

// Délai imposé après avoir ouvert le compte, avant de créditer automatiquement.
const CLICK_THROUGH_DELAY_MS = 8000;

export function EarnCreditsPanel({
  referralCode,
  referralCount,
  requestedPlatforms,
}: {
  referralCode: string;
  referralCount: number;
  requestedPlatforms: { platform: string; status: string }[];
}) {
  const link = `https://matchcv.fr/signup?ref=${referralCode}`;
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
      if (res.ok) setCredited((prev) => new Set(prev).add(platform));
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
    window.open(url, "_blank", "noopener,noreferrer");
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
    <div className="relative mb-10 overflow-hidden rounded-[36px] bg-ink p-8 text-white sm:p-10">
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cobalt-500/30 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-match/15 blur-[90px]" />

      <div className="relative grid gap-10 sm:grid-cols-2 sm:gap-8">
        <div>
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-match" />
            <h3 className="font-display text-base font-semibold">Parraine un ami</h3>
          </div>
          <p className="mt-2 text-sm text-white/60">
            +1 crédit dès que ton invité·e confirme son compte.
          </p>

          <div className="mt-5 flex items-center gap-2">
            <input
              readOnly
              value={link}
              className="flex-1 truncate rounded-full bg-white/10 px-4 py-2.5 font-mono text-xs text-white/80"
            />
            <button
              onClick={handleCopy}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-match px-3.5 py-2.5 text-xs font-medium text-ink hover:bg-match/90"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copié" : "Copier"}
            </button>
          </div>

          <p className="mt-3 font-mono text-xs text-white/50">
            {referralCount} filleul{referralCount === 1 ? "" : "s"} confirmé{referralCount === 1 ? "" : "s"}
          </p>
        </div>

        <div className="border-t border-white/10 pt-8 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
          <h3 className="font-display text-base font-semibold">Suis-nous</h3>
          <p className="mt-2 text-sm text-white/60">Un clic, un crédit ajouté à ton retour.</p>

          <div className="mt-5 space-y-1">
            {PLATFORMS.map((p) => {
              const isCredited = credited.has(p.id);
              const remaining = counting[p.id];
              return (
                <button
                  key={p.id}
                  onClick={() => handleClick(p.id, p.url)}
                  disabled={isCredited || remaining !== undefined}
                  className="flex w-full items-center justify-between rounded-xl px-2 py-2.5 text-left hover:bg-white/5 disabled:hover:bg-transparent"
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium">
                    <p.icon className="h-4 w-4 text-white/70" /> {p.label}
                  </span>
                  {isCredited ? (
                    <span className="flex items-center gap-1 font-mono text-xs text-match">
                      <Check className="h-3.5 w-3.5" /> Crédité
                    </span>
                  ) : remaining !== undefined ? (
                    <span className="flex items-center gap-1.5 font-mono text-xs text-white/50">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> {remaining}s
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-match">Suivre →</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

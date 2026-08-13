"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const COOKIE_NAME = "mcv_vid";

function getOrCreateVisitorId(): string {
  const existing = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`))
    ?.split("=")[1];

  if (existing) return existing;

  const id = crypto.randomUUID();
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_NAME}=${id}; path=/; max-age=${oneYear}; SameSite=Lax`;
  return id;
}

/**
 * Compteur de visites 100% anonyme : pas de nom, pas d'email, pas d'adresse IP
 * stockée — juste un identifiant aléatoire (cookie technique de mesure
 * d'audience) et la page visitée, pour calculer des statistiques globales de
 * trafic affichées dans le panneau admin.
 */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const visitorId = getOrCreateVisitorId();
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, visitorId }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}

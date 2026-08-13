"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const POLL_INTERVAL_MS = 4000;

/**
 * Vérifie régulièrement (toutes les 4 secondes, + à chaque retour sur l'onglet)
 * les crédits / le plan d'un profil, pour que l'affichage se mette à jour tout
 * seul dès qu'un crédit est ajouté (parrainage, réseau social, achat, etc.),
 * sans que l'utilisateur ait besoin de recharger la page.
 *
 * On utilise un simple sondage (polling) plutôt que les WebSockets Supabase
 * Realtime : plus simple, et ça fonctionne même sur les réseaux qui bloquent
 * les connexions WebSocket (proxys d'entreprise, certains antivirus...).
 */
export function useLiveCredits(userId: string, initialCredits: number, initialHasSubscription: boolean) {
  const [credits, setCredits] = useState(initialCredits);
  const [hasSubscription, setHasSubscription] = useState(initialHasSubscription);
  const isFetching = useRef(false);

  useEffect(() => {
    setCredits(initialCredits);
    setHasSubscription(initialHasSubscription);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCredits, initialHasSubscription]);

  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    let cancelled = false;

    async function fetchCredits() {
      if (isFetching.current) return;
      isFetching.current = true;
      const { data } = await supabase
        .from("profiles")
        .select("credits, plan, subscription_status")
        .eq("id", userId)
        .single();
      isFetching.current = false;
      if (!data || cancelled) return;
      setCredits(data.credits);
      setHasSubscription(data.plan === "subscription" && data.subscription_status === "active");
    }

    const interval = setInterval(fetchCredits, POLL_INTERVAL_MS);

    function onFocus() {
      fetchCredits();
    }
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [userId]);

  return { credits, hasSubscription };
}

"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * S'abonne en direct (Supabase Realtime) aux changements de crédits / plan
 * d'un profil, pour que l'affichage se mette à jour tout seul dès qu'un
 * crédit est ajouté (parrainage, réseau social, achat, etc.), sans que
 * l'utilisateur ait besoin de recharger la page.
 *
 * Nécessite que la table "profiles" soit ajoutée à la publication Realtime
 * de Supabase (voir supabase/006_realtime.sql).
 */
export function useLiveCredits(userId: string, initialCredits: number, initialHasSubscription: boolean) {
  const [credits, setCredits] = useState(initialCredits);
  const [hasSubscription, setHasSubscription] = useState(initialHasSubscription);

  // Suffixe unique par instance : plusieurs composants (badge + texte du dashboard)
  // peuvent s'abonner en même temps pour le même utilisateur — chacun a besoin de
  // son propre canal, sinon Supabase Realtime refuse le second abonnement.
  const instanceId = useRef(Math.random().toString(36).slice(2)).current;

  useEffect(() => {
    setCredits(initialCredits);
    setHasSubscription(initialHasSubscription);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCredits, initialHasSubscription]);

  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();

    const channel = supabase
      .channel(`profile-credits-${userId}-${instanceId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${userId}` },
        (payload) => {
          const row = payload.new as { credits: number; plan: string; subscription_status: string | null };
          setCredits(row.credits);
          setHasSubscription(row.plan === "subscription" && row.subscription_status === "active");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, instanceId]);

  return { credits, hasSubscription };
}

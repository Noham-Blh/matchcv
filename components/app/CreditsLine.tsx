"use client";

import { useLiveCredits } from "@/lib/hooks/useLiveCredits";

export function CreditsLine({
  userId,
  credits: initialCredits,
  hasSubscription: initialHasSubscription,
}: {
  userId: string;
  credits: number;
  hasSubscription: boolean;
}) {
  const { credits, hasSubscription } = useLiveCredits(userId, initialCredits, initialHasSubscription);

  return (
    <p className="mt-1 text-sm text-slate-600">
      {hasSubscription ? "Vous avez un accès illimité." : `Il vous reste ${credits} crédit${credits === 1 ? "" : "s"}.`}
    </p>
  );
}

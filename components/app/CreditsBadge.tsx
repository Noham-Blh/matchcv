import Link from "next/link";
import { Zap } from "lucide-react";

export function CreditsBadge({
  credits,
  hasSubscription,
}: {
  credits: number;
  hasSubscription: boolean;
}) {
  if (hasSubscription) {
    return (
      <span className="hidden items-center gap-1.5 rounded-full bg-match/50 px-3 py-1.5 font-mono text-xs font-medium text-ink sm:flex">
        <Zap className="h-3.5 w-3.5" /> Illimité
      </span>
    );
  }

  return (
    <Link
      href="/billing"
      className="hidden items-center gap-1.5 rounded-full bg-paper-dim px-3 py-1.5 font-mono text-xs font-medium text-ink sm:flex hover:bg-line"
    >
      <Zap className="h-3.5 w-3.5" /> {credits} crédit{credits === 1 ? "" : "s"}
    </Link>
  );
}

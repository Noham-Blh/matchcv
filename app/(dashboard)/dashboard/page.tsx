import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FileText, ArrowRight, Sparkles } from "lucide-react";
import { EarnCreditsPanel } from "@/components/app/EarnCreditsPanel";
import { CreditsLine } from "@/components/app/CreditsLine";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { data: generations } = await supabase
    .from("generations")
    .select("id, job_title, company_name, match_score, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const { count: referralCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("referred_by", user!.id)
    .eq("referral_credit_granted", true);

  const { data: socialRequests } = await supabase
    .from("social_follow_requests")
    .select("platform, status")
    .eq("user_id", user!.id);

  return (
    <div>
      <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            Bonjour {profile?.full_name?.split(" ")[0] || ""} 👋
          </h1>
          <CreditsLine
            userId={user!.id}
            credits={profile?.credits ?? 0}
            hasSubscription={profile?.plan === "subscription" && profile?.subscription_status === "active"}
          />
        </div>
        <Link
          href="/generate"
          className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white shadow-[0_8px_24px_-8px_rgba(18,20,28,0.5)] hover:bg-cobalt-700"
        >
          <Sparkles className="h-4 w-4" /> Nouvelle génération
        </Link>
      </div>

      {profile?.referral_code && (
        <EarnCreditsPanel
          referralCode={profile.referral_code}
          referralCount={referralCount ?? 0}
          requestedPlatforms={socialRequests ?? []}
        />
      )}

      <h2 className="mb-5 font-display text-lg font-semibold">Historique</h2>

      {!generations || generations.length === 0 ? (
        <div className="py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cobalt-50">
            <FileText className="h-6 w-6 text-cobalt-500" />
          </span>
          <p className="mt-4 text-sm text-slate-600">
            Aucune génération pour l&apos;instant. Créez votre premier CV optimisé.
          </p>
          <Link
            href="/generate"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-cobalt-600 hover:text-cobalt-700"
          >
            Commencer <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div>
          <div className="flex border-b border-line px-2 pb-3 font-mono text-[11px] uppercase tracking-wide text-slate-500">
            <span className="flex-1">Poste</span>
            <span className="hidden w-40 sm:block">Entreprise</span>
            <span className="w-20">Score</span>
            <span className="w-24 text-right">Date</span>
          </div>
          {generations.map((g) => (
            <Link
              key={g.id}
              href={`/dashboard/${g.id}`}
              className="flex items-center border-b border-line px-2 py-4 last:border-0 hover:bg-white/60"
            >
              <div className="flex-1 pr-4">
                <p className="font-medium">{g.job_title || "Sans titre"}</p>
                <p className="mt-0.5 text-xs text-slate-500 sm:hidden">{g.company_name || "—"}</p>
              </div>
              <span className="hidden w-40 text-sm text-slate-600 sm:block">{g.company_name || "—"}</span>
              <span className="w-20">
                <span className="rounded-full bg-match/40 px-2.5 py-0.5 font-mono text-xs font-medium">
                  {g.match_score ?? "—"}%
                </span>
              </span>
              <span className="w-24 text-right text-xs text-slate-500">
                {new Date(g.created_at).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

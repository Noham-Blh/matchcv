import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FileText, ArrowRight, Sparkles } from "lucide-react";
import { ReferralCard } from "@/components/app/ReferralCard";
import { SocialFollowCard } from "@/components/app/SocialFollowCard";

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
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Bonjour {profile?.full_name?.split(" ")[0] || ""} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {profile?.plan === "subscription"
              ? "Vous avez un accès illimité."
              : `Il vous reste ${profile?.credits ?? 0} crédit${profile?.credits === 1 ? "" : "s"}.`}
          </p>
        </div>
        <Link
          href="/generate"
          className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-cobalt-700"
        >
          <Sparkles className="h-4 w-4" /> Nouvelle génération
        </Link>
      </div>

      {profile?.referral_code && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <ReferralCard referralCode={profile.referral_code} referralCount={referralCount ?? 0} />
          <SocialFollowCard requestedPlatforms={socialRequests ?? []} />
        </div>
      )}

      <h2 className="mb-4 text-sm font-medium text-slate-600">Historique</h2>

      {!generations || generations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center">
          <FileText className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm text-slate-600">
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
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper-dim text-left font-mono text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-medium">Poste</th>
                <th className="px-5 py-3 font-medium">Entreprise</th>
                <th className="px-5 py-3 font-medium">Score ATS</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {generations.map((g) => (
                <tr key={g.id} className="border-b border-line last:border-0 hover:bg-paper-dim">
                  <td className="px-5 py-3.5 font-medium">{g.job_title || "Sans titre"}</td>
                  <td className="px-5 py-3.5 text-slate-600">{g.company_name || "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-full bg-match/40 px-2.5 py-0.5 font-mono text-xs">
                      {g.match_score ?? "—"}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {new Date(g.created_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { UsersTable, type AdminUserRow } from "@/components/admin/UsersTable";
import { ShieldCheck, Users, Zap, CreditCard, TrendingUp } from "lucide-react";

function statsFor(rows: { visitor_id: string; created_at: string }[], since: Date) {
  const filtered = rows.filter((r) => new Date(r.created_at) >= since);
  return { views: filtered.length, uniques: new Set(filtered.map((r) => r.visitor_id)).size };
}

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!myProfile?.is_admin) {
    redirect("/dashboard");
  }

  // Client admin (service role) : nécessaire pour lister TOUS les profils,
  // les policies RLS normales ne laissent voir que son propre profil.
  const adminClient = createAdminClient();

  const { data: profiles } = await adminClient
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: generations } = await adminClient.from("generations").select("user_id");

  const countByUser = new Map<string, number>();
  (generations || []).forEach((g: { user_id: string }) => {
    countByUser.set(g.user_id, (countByUser.get(g.user_id) || 0) + 1);
  });

  const users: AdminUserRow[] = (profiles || []).map((p: any) => ({
    id: p.id,
    email: p.email,
    full_name: p.full_name,
    credits: p.credits,
    plan: p.plan,
    subscription_status: p.subscription_status,
    is_admin: p.is_admin,
    created_at: p.created_at,
    generationsCount: countByUser.get(p.id) || 0,
  }));

  const totals = {
    users: users.length,
    generations: generations?.length || 0,
    activeSubs: users.filter((u) => u.plan === "subscription" && u.subscription_status === "active").length,
  };

  // ── Trafic du site (visites anonymes) ──
  const now = new Date();
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const start7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const start30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const { data: views30d } = await adminClient
    .from("page_views")
    .select("visitor_id, created_at")
    .gte("created_at", start30d.toISOString());

  const rows = views30d || [];
  const trafficToday = statsFor(rows, startToday);
  const traffic7d = statsFor(rows, start7d);
  const traffic30d = statsFor(rows, start30d);

  return (
    <div>
      <div className="mb-8 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-cobalt-600" />
        <h1 className="font-display text-3xl font-semibold tracking-tight">Administration</h1>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Utilisateurs" value={totals.users} icon={Users} tint="cobalt" />
        <StatCard label="Crédits utilisés" value={totals.generations} icon={Zap} tint="match" />
        <StatCard label="Abonnements actifs" value={totals.activeSubs} icon={CreditCard} tint="ink" />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-slate-400" />
        <h2 className="text-sm font-medium text-slate-600">Trafic du site (visites anonymes)</h2>
      </div>
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <TrafficCard label="Aujourd'hui" views={trafficToday.views} uniques={trafficToday.uniques} />
        <TrafficCard label="7 derniers jours" views={traffic7d.views} uniques={traffic7d.uniques} />
        <TrafficCard label="30 derniers jours" views={traffic30d.views} uniques={traffic30d.uniques} />
      </div>
      <p className="-mt-6 mb-10 text-xs text-slate-400">
        Paiements réels et panier moyen : disponibles directement dans le tableau de bord Stripe une
        fois le mode réel activé.
      </p>

      <h2 className="mb-4 text-sm font-medium text-slate-600">Utilisateurs</h2>
      <UsersTable users={users} />
    </div>
  );
}

const TINTS = {
  cobalt: "bg-cobalt-50 text-cobalt-600",
  match: "bg-match/30 text-ink",
  ink: "bg-ink text-match",
};

function StatCard({
  label,
  value,
  icon: Icon,
  tint,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tint: keyof typeof TINTS;
}) {
  return (
    <div className="rounded-[28px] bg-paper-dim p-5">
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${TINTS[tint]}`}>
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-4 text-2xl font-semibold tracking-tight">{value.toLocaleString("fr-FR")}</p>
      <p className="mt-0.5 text-xs text-slate-500">{label}</p>
    </div>
  );
}

function TrafficCard({ label, views, uniques }: { label: string; views: number; uniques: number }) {
  return (
    <div className="rounded-[28px] bg-paper-dim p-5">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">
        {uniques.toLocaleString("fr-FR")}{" "}
        <span className="text-sm font-normal text-slate-400">visiteur{uniques === 1 ? "" : "s"}</span>
      </p>
      <p className="mt-0.5 font-mono text-xs text-slate-400">
        {views.toLocaleString("fr-FR")} page{views === 1 ? "" : "s"} vue{views === 1 ? "" : "s"}
      </p>
    </div>
  );
}

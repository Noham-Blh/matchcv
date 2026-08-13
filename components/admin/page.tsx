import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { UsersTable, type AdminUserRow } from "@/components/admin/UsersTable";
import { ShieldCheck } from "lucide-react";

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

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-cobalt-600" />
        <h1 className="text-2xl font-semibold tracking-tight">Administration</h1>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <StatCard label="Utilisateurs" value={totals.users} />
        <StatCard label="Générations totales" value={totals.generations} />
        <StatCard label="Abonnements actifs" value={totals.activeSubs} />
      </div>

      <h2 className="mb-3 text-sm font-medium text-slate-600">Utilisateurs</h2>
      <UsersTable users={users} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <p className="font-mono text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

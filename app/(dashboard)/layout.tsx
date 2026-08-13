import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/app/SignOutButton";
import { CreditsBadge } from "@/components/app/CreditsBadge";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits, plan, subscription_status, is_admin")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-paper-dim">
      <header className="border-b border-line bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-ink text-[11px] font-bold text-match">
              M
            </span>
            MatchCV
          </Link>

          <nav className="hidden items-center gap-6 font-mono text-[13px] text-slate-600 sm:flex">
            <Link href="/generate" className="hover:text-ink">Générer</Link>
            <Link href="/dashboard" className="hover:text-ink">Historique</Link>
            <Link href="/billing" className="hover:text-ink">Facturation</Link>
            {profile?.is_admin && (
              <Link href="/admin" className="text-cobalt-600 hover:text-cobalt-700">Admin</Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <CreditsBadge
              userId={user.id}
              credits={profile?.credits ?? 0}
              hasSubscription={profile?.plan === "subscription" && profile?.subscription_status === "active"}
            />
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="container-page py-10">{children}</main>
    </div>
  );
}

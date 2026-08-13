import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/app/DashboardShell";

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
    .select("full_name, credits, plan, subscription_status, is_admin")
    .eq("id", user.id)
    .single();

  return (
    <DashboardShell
      userId={user.id}
      email={user.email || ""}
      fullName={profile?.full_name || null}
      isAdmin={Boolean(profile?.is_admin)}
      credits={profile?.credits ?? 0}
      hasSubscription={profile?.plan === "subscription" && profile?.subscription_status === "active"}
    >
      {children}
    </DashboardShell>
  );
}

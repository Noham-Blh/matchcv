import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountSettingsForm } from "@/components/app/AccountSettingsForm";

export default async function AccountPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Mon compte</h1>
      <p className="mt-2 text-slate-600">Gère tes informations personnelles et ton compte.</p>

      <AccountSettingsForm email={user.email || ""} fullName={profile?.full_name || ""} />
    </div>
  );
}

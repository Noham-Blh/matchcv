"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-ink hover:text-ink"
    >
      <LogOut className="h-3.5 w-3.5" /> Déconnexion
    </button>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

export interface AdminUserRow {
  id: string;
  email: string;
  full_name: string | null;
  credits: number;
  plan: string;
  subscription_status: string | null;
  is_admin: boolean;
  created_at: string;
  generationsCount: number;
}

export function UsersTable({ users }: { users: AdminUserRow[] }) {
  return (
    <div className="overflow-x-auto rounded-[28px] bg-white shadow-elevated">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line bg-paper-dim text-left font-mono text-[11px] uppercase tracking-wide text-slate-500">
            <th className="px-5 py-3 font-medium">Utilisateur</th>
            <th className="px-5 py-3 font-medium">Crédits</th>
            <th className="px-5 py-3 font-medium">Plan</th>
            <th className="px-5 py-3 font-medium">Statut abo.</th>
            <th className="px-5 py-3 font-medium">Générations</th>
            <th className="px-5 py-3 font-medium">Inscrit le</th>
            <th className="px-5 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <UserRow key={u.id} user={u} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserRow({ user }: { user: AdminUserRow }) {
  const router = useRouter();
  const [credits, setCredits] = useState(user.credits);
  const [plan, setPlan] = useState(user.plan);
  const [subStatus, setSubStatus] = useState(user.subscription_status || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = credits !== user.credits || plan !== user.plan || subStatus !== (user.subscription_status || "");

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch("/api/admin/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          credits,
          plan,
          subscription_status: subStatus || null,
        }),
      });
      if (res.ok) {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 2000);
      } else {
        const body = await res.json().catch(() => null);
        setError(body?.error || `Erreur ${res.status}`);
      }
    } catch (e) {
      setError("Impossible de contacter le serveur.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr className="border-b border-line last:border-0">
      <td className="px-5 py-3.5">
        <p className="font-medium">{user.full_name || "—"}</p>
        <p className="text-xs text-slate-500">
          {user.email} {user.is_admin && <span className="ml-1 text-cobalt-600">(admin)</span>}
        </p>
      </td>
      <td className="px-5 py-3.5">
        <input
          type="number"
          min={0}
          value={credits}
          onChange={(e) => setCredits(Number(e.target.value))}
          className="w-16 rounded-lg border border-line px-2 py-1 text-sm outline-none focus:border-ink"
        />
      </td>
      <td className="px-5 py-3.5">
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          className="rounded-lg border border-line px-2 py-1 text-xs outline-none focus:border-ink"
        >
          <option value="free">free</option>
          <option value="credits">credits</option>
          <option value="subscription">subscription</option>
        </select>
      </td>
      <td className="px-5 py-3.5">
        <select
          value={subStatus}
          onChange={(e) => setSubStatus(e.target.value)}
          className="rounded-lg border border-line px-2 py-1 text-xs outline-none focus:border-ink"
        >
          <option value="">—</option>
          <option value="active">active</option>
          <option value="canceled">canceled</option>
          <option value="past_due">past_due</option>
        </select>
      </td>
      <td className="px-5 py-3.5 text-slate-600">{user.generationsCount}</td>
      <td className="px-5 py-3.5 text-slate-500">
        {new Date(user.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex flex-col items-start gap-1">
          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white disabled:opacity-30"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : saved ? (
              <Check className="h-3.5 w-3.5" />
            ) : null}
            {saved ? "Enregistré" : "Enregistrer"}
          </button>
          {error && <p className="max-w-[160px] text-[11px] text-red-600">{error}</p>}
        </div>
      </td>
    </tr>
  );
}

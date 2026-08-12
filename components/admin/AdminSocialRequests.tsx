"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

export interface PendingSocialRequest {
  id: string;
  platform: string;
  created_at: string;
  userEmail: string;
}

export function AdminSocialRequests({ requests }: { requests: PendingSocialRequest[] }) {
  const router = useRouter();
  const [processing, setProcessing] = useState<string | null>(null);

  async function handleAction(requestId: string, action: "approve" | "reject") {
    setProcessing(requestId);
    try {
      const res = await fetch("/api/admin/social-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });
      if (res.ok) router.refresh();
    } finally {
      setProcessing(null);
    }
  }

  if (requests.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line bg-white p-6 text-center text-sm text-slate-500">
        Aucune demande en attente.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line bg-paper-dim text-left font-mono text-[11px] uppercase tracking-wide text-slate-500">
            <th className="px-5 py-3 font-medium">Utilisateur</th>
            <th className="px-5 py-3 font-medium">Plateforme</th>
            <th className="px-5 py-3 font-medium">Demandé le</th>
            <th className="px-5 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} className="border-b border-line last:border-0">
              <td className="px-5 py-3.5">{r.userEmail}</td>
              <td className="px-5 py-3.5 capitalize">{r.platform}</td>
              <td className="px-5 py-3.5 text-slate-500">
                {new Date(r.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleAction(r.id, "approve")}
                    disabled={processing === r.id}
                    className="flex items-center gap-1 rounded-full bg-match/50 px-3 py-1 text-xs font-medium hover:bg-match disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" /> Approuver
                  </button>
                  <button
                    onClick={() => handleAction(r.id, "reject")}
                    disabled={processing === r.id}
                    className="flex items-center gap-1 rounded-full border border-line px-3 py-1 text-xs font-medium hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" /> Rejeter
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

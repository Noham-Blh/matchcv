"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  History,
  CreditCard,
  ShieldCheck,
  Menu,
  X,
  ChevronsUpDown,
  LogOut,
  FileText,
  UserCog,
} from "lucide-react";
import clsx from "clsx";
import { createClient } from "@/lib/supabase/client";
import { useLiveCredits } from "@/lib/hooks/useLiveCredits";
import { LogoMark } from "@/components/ui/Logo";

interface DashboardShellProps {
  children: React.ReactNode;
  userId: string;
  email: string;
  fullName: string | null;
  isAdmin: boolean;
  credits: number;
  hasSubscription: boolean;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Historique", icon: History },
  { href: "/billing", label: "Facturation", icon: CreditCard },
];

function initialsFor(fullName: string | null, email: string) {
  if (fullName) {
    const parts = fullName.trim().split(/\s+/);
    return (parts[0]?.[0] || "").toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export function DashboardShell({
  children,
  userId,
  email,
  fullName,
  isAdmin,
  credits: initialCredits,
  hasSubscription: initialHasSubscription,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { credits, hasSubscription } = useLiveCredits(userId, initialCredits, initialHasSubscription);
  const statusLabel = hasSubscription ? "Accès illimité" : `${credits} crédit${credits === 1 ? "" : "s"}`;

  const navItems = isAdmin
    ? [...NAV_ITEMS, { href: "/admin", label: "Admin", icon: ShieldCheck }]
    : NAV_ITEMS;

  return (
    <div className="min-h-screen bg-paper-dim lg:flex">
      {/* Barre du haut, visible uniquement sur mobile */}
      <div className="flex h-14 items-center justify-between border-b border-line bg-white px-4 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2 font-display text-base font-semibold">
          <LogoMark className="h-7 w-7" />
          MatchCV
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-paper-dim"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Fond assombri derrière le tiroir mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Barre latérale : fixe sur desktop, tiroir coulissant sur mobile */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/dashboard" className="flex items-center gap-2 font-display text-base font-semibold">
            <LogoMark className="h-7 w-7" />
            MatchCV
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-paper-dim lg:hidden"
            aria-label="Fermer le menu"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="px-4">
          <Link
            href="/generate"
            onClick={() => setMobileOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-cobalt-700"
          >
            <Sparkles className="h-4 w-4" /> Nouvelle génération
          </Link>
        </div>

        <nav className="mt-6 flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-paper-dim text-ink" : "text-slate-600 hover:bg-paper-dim hover:text-ink"
                )}
              >
                <item.icon className={clsx("h-4 w-4", active && "text-cobalt-600")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <AccountMenu email={email} fullName={fullName} statusLabel={statusLabel} />
      </aside>

      {/* Contenu principal */}
      <main className="relative flex-1 overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <div className="pointer-events-none absolute -right-40 -top-40 -z-10 h-96 w-96 rounded-full bg-cobalt-400/10 blur-[110px]" />
        <div className="pointer-events-none absolute -left-20 top-1/2 -z-10 h-72 w-72 rounded-full bg-match/10 blur-[110px]" />
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}

function AccountMenu({
  email,
  fullName,
  statusLabel,
}: {
  email: string;
  fullName: string | null;
  statusLabel: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const displayName = fullName || email;
  const initials = initialsFor(fullName, email);

  return (
    <div ref={menuRef} className="relative border-t border-line p-3">
      {open && (
        <div className="absolute bottom-[calc(100%+8px)] left-3 right-3 rounded-xl border border-line bg-white p-1.5 shadow-card">
          <div className="px-2.5 py-2">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate text-xs text-slate-500">{email}</p>
          </div>
          <div className="my-1 border-t border-line" />
          <Link
            href="/compte"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-paper-dim"
          >
            <UserCog className="h-4 w-4" /> Mon compte
          </Link>
          <Link
            href="/billing"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-paper-dim"
          >
            <CreditCard className="h-4 w-4" /> Facturation
          </Link>
          <Link
            href="/mentions-legales"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-paper-dim"
          >
            <FileText className="h-4 w-4" /> Mentions légales
          </Link>
          <div className="my-1 border-t border-line" />
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" /> Se déconnecter
          </button>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-paper-dim"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-match">
          {initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{displayName}</span>
          <span className="block truncate font-mono text-[11px] text-slate-500">{statusLabel}</span>
        </span>
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
      </button>
    </div>
  );
}

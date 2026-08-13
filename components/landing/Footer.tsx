import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="container-page flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2 font-display text-sm font-semibold">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-ink text-[10px] font-bold text-match">
            M
          </span>
          MatchCV
        </div>
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} MatchCV. Fait pour les candidats, pas pour les robots.
        </p>
        <div className="flex gap-5 font-mono text-xs text-slate-500">
          <Link href="/login" className="hover:text-ink">Connexion</Link>
          <a href="#pricing" className="hover:text-ink">Tarifs</a>
          <Link href="/mentions-legales" className="hover:text-ink">Mentions légales</Link>
          <Link href="/cgv" className="hover:text-ink">CGV</Link>
          <Link href="/confidentialite" className="hover:text-ink">Confidentialité</Link>
        </div>
      </div>
    </footer>
  );
}

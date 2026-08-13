import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <LogoMark className="h-7 w-7" />
          MatchCV
        </Link>

        <nav className="hidden items-center gap-8 font-mono text-[13px] text-slate-600 md:flex">
          <a href="#demo" className="hover:text-ink">Démo</a>
          <a href="#pricing" className="hover:text-ink">Tarifs</a>
          <a href="#temoignages" className="hover:text-ink">Avis</a>
        </nav>

        <div className="flex items-center gap-3">
          <Button href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
            Connexion
          </Button>
          <Button href="/signup" variant="primary" size="sm">
            Essai gratuit
          </Button>
        </div>
      </div>
    </header>
  );
}

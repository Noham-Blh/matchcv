import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";

export function Nav() {
  return (
    <div className="sticky top-4 z-50 px-4">
      <header className="mx-auto flex h-16 max-w-3xl items-center justify-between rounded-full border border-white/60 bg-white/85 px-3 pl-5 shadow-lift backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 font-display text-base font-semibold tracking-tight">
          <LogoMark className="h-7 w-7" />
          MatchCV
        </Link>

        <nav className="hidden items-center gap-7 text-[14px] font-medium text-slate-600 md:flex">
          <a href="#demo" className="transition-colors hover:text-ink">Démo</a>
          <a href="#pricing" className="transition-colors hover:text-ink">Tarifs</a>
          <a href="#temoignages" className="transition-colors hover:text-ink">Avis</a>
        </nav>

        <div className="flex items-center gap-2">
          <Button href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
            Connexion
          </Button>
          <Button href="/signup" variant="primary" size="sm">
            Essai gratuit
          </Button>
        </div>
      </header>
    </div>
  );
}

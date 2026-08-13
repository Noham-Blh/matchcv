import Link from "next/link";
import { ShieldCheck, Zap, Lock } from "lucide-react";

const TRUST_POINTS = [
  { icon: Zap, text: "1 génération offerte, sans carte bancaire" },
  { icon: Lock, text: "Vos données ne sont jamais revendues" },
  { icon: ShieldCheck, text: "Propulsé par Claude, l'IA d'Anthropic" },
];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panneau de marque, visible à partir de la taille desktop */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink px-12 py-12 text-white lg:flex">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cobalt-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-match/10 blur-3xl" />

        <Link href="/" className="relative flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-match text-[12px] font-bold text-ink">
            M
          </span>
          MatchCV
        </Link>

        <div className="relative">
          <h2 className="max-w-sm font-display text-3xl font-semibold leading-[1.15] tracking-tight">
            Le même CV. Relu par le bon recruteur, à chaque fois.
          </h2>

          <div className="mt-10 w-fit rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="font-mono text-[11px] uppercase tracking-widest text-white/50">Score ATS</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-sm text-white/60 line-through">
                34%
              </span>
              <span className="text-white/40">→</span>
              <span className="rounded-full bg-match px-2.5 py-1 font-mono text-sm font-semibold text-ink">
                91%
              </span>
            </div>
          </div>

          <ul className="mt-10 space-y-3">
            {TRUST_POINTS.map((point) => (
              <li key={point.text} className="flex items-center gap-3 text-sm text-white/75">
                <point.icon className="h-4 w-4 shrink-0 text-match" />
                {point.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative font-mono text-xs text-white/40">© {new Date().getFullYear()} MatchCV</p>
      </div>

      {/* Panneau du formulaire */}
      <div className="flex flex-col justify-center bg-paper px-5 py-12 sm:px-12">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 font-display text-lg font-semibold lg:hidden"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded bg-ink text-[11px] font-bold text-match">
            M
          </span>
          MatchCV
        </Link>
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}

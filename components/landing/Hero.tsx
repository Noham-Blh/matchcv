import { Button } from "@/components/ui/Button";
import { ScanDemo } from "@/components/landing/ScanDemo";
import { ArrowRight, Sparkles, Target } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-16 sm:pt-24">
      {/* Fond texturé : dégradés de couleur + grille de points */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-cobalt-400/20 blur-[100px]" />
        <div className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-match/25 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(rgba(18,20,28,0.14) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 20%, black 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 20%, black 40%, transparent 100%)",
          }}
        />
      </div>

      <div className="container-page grid items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
        <div className="animate-fade-up">
          <span className="kicker inline-flex items-center gap-1.5 rounded-full border border-cobalt-200 bg-cobalt-50 px-3 py-1">
            <Sparkles className="h-3 w-3" /> Optimisation ATS par IA
          </span>
          <h1 className="mt-5 text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Le même CV.
            <br />
            <span className="relative text-cobalt-600">
              Relu par le bon recruteur
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path d="M2 8C60 2 240 2 298 8" stroke="#C6FF3D" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>
            , à chaque fois.
          </h1>
          <p className="mt-7 max-w-lg text-[17px] leading-relaxed text-slate-600">
            Collez une offre d&apos;emploi, collez votre CV. MatchCV le réécrit avec les bons mots-clés
            pour passer les filtres ATS, et rédige votre lettre de motivation — sans jamais inventer
            une seule expérience.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href="/signup" size="lg" className="shadow-[0_8px_24px_-8px_rgba(61,82,213,0.5)]">
              Essayer gratuitement <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="#demo" variant="secondary" size="lg">
              Voir la démo
            </Button>
          </div>
          <p className="mt-5 font-mono text-xs text-slate-500">
            1 génération offerte · sans carte bancaire · résultat en 30 secondes
          </p>
        </div>

        <div id="demo" className="relative animate-fade-up [animation-delay:120ms]">
          {/* Puces flottantes décoratives autour de la démo */}
          <div className="pointer-events-none absolute -left-6 top-6 z-20 hidden -rotate-6 sm:block">
            <div className="animate-float">
              <div className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-2 shadow-card">
                <Target className="h-3.5 w-3.5 text-cobalt-600" />
                <span className="font-mono text-[11px] font-medium text-ink">Adapté à chaque offre</span>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-4 bottom-16 z-20 hidden rotate-3 sm:block">
            <div className="animate-float [animation-delay:1.2s]">
              <div className="flex items-center gap-1.5 rounded-xl border border-line bg-ink px-3 py-2 text-white shadow-card">
                <span className="font-mono text-[11px] font-medium">Zéro expérience inventée</span>
              </div>
            </div>
          </div>

          <ScanDemo />
        </div>
      </div>
    </section>
  );
}

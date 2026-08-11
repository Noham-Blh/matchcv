import { Button } from "@/components/ui/Button";
import { ScanDemo } from "@/components/landing/ScanDemo";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pt-24">
      <div className="container-page grid items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
        <div className="animate-fade-up">
          <span className="kicker">Optimisation ATS par IA</span>
          <h1 className="mt-5 text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Le même CV.
            <br />
            <span className="relative">
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
            <Button href="/signup" size="lg">
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

        <div id="demo" className="animate-fade-up [animation-delay:120ms]">
          <ScanDemo />
        </div>
      </div>
    </section>
  );
}

import { Button } from "@/components/ui/Button";
import { Check, Compass, Layers, Infinity as InfinityIcon } from "lucide-react";

const PLANS = [
  {
    name: "Découverte",
    price: "0€",
    period: "",
    description: "Pour tester la qualité de la réécriture sur votre propre CV.",
    features: ["1 génération offerte", "CV + lettre de motivation", "Export PDF", "2 templates de mise en page"],
    cta: "Créer un compte",
    href: "/signup",
    variant: "secondary" as const,
    icon: Compass,
  },
  {
    name: "Pack 5 crédits",
    price: "12€",
    period: "paiement unique",
    description: "Idéal pour une recherche ciblée sur quelques offres précises.",
    features: [
      "5 générations (CV + lettre)",
      "Crédits sans expiration",
      "Export PDF illimité",
      "Historique complet",
    ],
    cta: "Acheter le pack",
    href: "/signup?plan=credits",
    variant: "primary" as const,
    highlighted: true,
    icon: Layers,
  },
  {
    name: "Illimité",
    price: "19€",
    period: "/ mois",
    description: "Pour une recherche d'emploi active sur plusieurs semaines.",
    features: [
      "Générations illimitées",
      "CV + lettre à chaque candidature",
      "Export PDF illimité",
      "Résiliable à tout moment",
    ],
    cta: "S'abonner",
    href: "/signup?plan=subscription",
    variant: "secondary" as const,
    icon: InfinityIcon,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="container-page">
        <div className="text-center">
          <span className="kicker">Tarifs</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Simple, sans engagement caché.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-slate-600">
            Commencez gratuitement. Passez au pack ou à l&apos;abonnement quand vous en avez besoin.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.highlighted
                  ? "relative rounded-[28px] bg-ink p-8 text-white shadow-lift transition-transform duration-300 hover:-translate-y-1.5"
                  : "relative rounded-[28px] bg-white p-8 shadow-elevated transition-transform duration-300 hover:-translate-y-1.5"
              }
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-8 rounded-full bg-match px-3 py-1 font-mono text-[11px] font-semibold text-ink">
                  Le plus choisi
                </span>
              )}
              <span
                className={
                  plan.highlighted
                    ? "flex h-9 w-9 items-center justify-center rounded-lg bg-match/20 text-match"
                    : "flex h-9 w-9 items-center justify-center rounded-lg bg-cobalt-50 text-cobalt-600"
                }
              >
                <plan.icon className="h-4.5 w-4.5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                {plan.period && (
                  <span className={plan.highlighted ? "text-sm text-white/60" : "text-sm text-slate-500"}>
                    {plan.period}
                  </span>
                )}
              </div>
              <p className={plan.highlighted ? "mt-3 text-sm text-white/70" : "mt-3 text-sm text-slate-600"}>
                {plan.description}
              </p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className={plan.highlighted ? "mt-0.5 h-4 w-4 shrink-0 text-match" : "mt-0.5 h-4 w-4 shrink-0 text-cobalt-500"} />
                    <span className={plan.highlighted ? "text-white/90" : "text-ink/85"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                href={plan.href}
                variant={plan.highlighted ? "primary" : plan.variant}
                className={plan.highlighted ? "mt-8 w-full !bg-match !text-ink hover:!bg-match/90" : "mt-8 w-full"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { ShieldCheck, Lock, Sparkles } from "lucide-react";

const POINTS = [
  { icon: Sparkles, text: "Propulsé par Claude, l'IA d'Anthropic" },
  { icon: Lock, text: "Paiement sécurisé via Stripe" },
  { icon: ShieldCheck, text: "Vos données ne sont jamais revendues" },
];

export function TrustBar() {
  return (
    <div className="border-y border-line bg-paper-dim py-5">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
        {POINTS.map((point) => (
          <div key={point.text} className="flex items-center gap-2 font-mono text-xs text-slate-600">
            <point.icon className="h-3.5 w-3.5 text-cobalt-600" />
            {point.text}
          </div>
        ))}
      </div>
    </div>
  );
}

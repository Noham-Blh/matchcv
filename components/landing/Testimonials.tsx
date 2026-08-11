const TESTIMONIALS = [
  {
    name: "Léa Fontaine",
    role: "Chargée de projet digital, Lyon",
    quote:
      "J'envoyais des candidatures depuis trois mois sans retour. Après avoir réécrit mon CV avec MatchCV pour cibler le vocabulaire exact des offres, j'ai eu deux entretiens la même semaine.",
    result: "2 entretiens en 7 jours",
  },
  {
    name: "Karim Belhadj",
    role: "Ingénieur DevOps, Toulouse",
    quote:
      "Le score ATS m'a permis de voir concrètement quelles compétences je devais mettre en avant selon l'offre. La lettre générée sert vraiment de base solide, je n'ai eu qu'à l'ajuster.",
    result: "Score ATS passé de 41% à 88%",
  },
  {
    name: "Sophie Laurent",
    role: "Responsable RH en reconversion, Nantes",
    quote:
      "Changer de secteur, c'était surtout un problème de mots. MatchCV a traduit mon expérience RH en compétences que les recruteurs marketing comprenaient tout de suite.",
    result: "Reconversion réussie en 6 semaines",
  },
];

export function Testimonials() {
  return (
    <section id="temoignages" className="border-t border-line bg-paper-dim py-24">
      <div className="container-page">
        <span className="kicker">Résultats</span>
        <h2 className="mt-3 max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">
          Des candidats, pas des cas d&apos;usage.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col justify-between rounded-2xl border border-line bg-white p-7 shadow-card"
            >
              <p className="text-[15px] leading-relaxed text-ink/90">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-7">
                <div className="inline-block rounded-full bg-match/40 px-3 py-1 font-mono text-[11px] font-medium text-ink">
                  {t.result}
                </div>
                <p className="mt-4 text-sm font-medium">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

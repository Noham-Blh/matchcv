const STEPS = [
  {
    label: "01",
    title: "Collez l'offre",
    text: "Copiez le texte de l'annonce à laquelle vous postulez, ou son URL.",
    accent: "bg-ink text-match",
  },
  {
    label: "02",
    title: "Collez votre CV",
    text: "Texte ou PDF : MatchCV extrait vos expériences et compétences réelles.",
    accent: "bg-cobalt-500 text-white",
  },
  {
    label: "03",
    title: "Récupérez vos documents",
    text: "CV reformulé, lettre personnalisée, score ATS — modifiables et exportables en PDF.",
    accent: "bg-match text-ink",
  },
];

export function HowItWorks() {
  return (
    <section className="relative border-t border-line py-24">
      <div className="container-page">
        <span className="kicker">Comment ça marche</span>
        <h2 className="mt-3 max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">
          Trois étapes, 30 secondes.
        </h2>

        <div className="relative mt-16 grid gap-12 sm:grid-cols-3 sm:gap-8">
          {/* Ligne de connexion entre les étapes (desktop uniquement) */}
          <div
            className="absolute left-0 right-0 top-6 hidden h-px sm:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, #C6C9D4 0, #C6C9D4 6px, transparent 6px, transparent 14px)",
            }}
            aria-hidden
          />

          {STEPS.map((step) => (
            <div key={step.label} className="relative">
              <span
                className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full font-display text-sm font-semibold ${step.accent}`}
              >
                {step.label}
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

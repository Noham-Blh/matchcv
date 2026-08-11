const STEPS = [
  {
    label: "01",
    title: "Collez l'offre",
    text: "Copiez le texte de l'annonce à laquelle vous postulez, ou son URL.",
  },
  {
    label: "02",
    title: "Collez votre CV",
    text: "Texte ou PDF : MatchCV extrait vos expériences et compétences réelles.",
  },
  {
    label: "03",
    title: "Récupérez vos documents",
    text: "CV reformulé, lettre personnalisée, score ATS — modifiables et exportables en PDF.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-line py-24">
      <div className="container-page">
        <span className="kicker">Comment ça marche</span>
        <h2 className="mt-3 max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">
          Trois étapes, 30 secondes.
        </h2>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.label} className="relative pl-0">
              <span className="font-mono text-sm text-cobalt-500">{step.label}</span>
              <h3 className="mt-3 font-display text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

export const metadata = { title: "Conditions Générales de Vente — MatchCV" };

export default function CGVPage() {
  return (
    <div className="container-page max-w-2xl py-16">
      <Link href="/" className="font-mono text-xs text-slate-500 hover:text-ink">← Retour à l&apos;accueil</Link>
      <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
        Conditions Générales de Vente
      </h1>
      <p className="mt-1 text-xs text-slate-500">Dernière mise à jour : août 2026</p>

      <div className="prose prose-sm mt-8 max-w-none space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="font-display text-base font-semibold text-ink">1. Objet</h2>
          <p className="mt-2">
            Les présentes CGV régissent la vente des services proposés sur MatchCV (matchcv.fr), édité
            par Noham Bellahssan, entrepreneur individuel (micro-entrepreneur), 930 route de Bouloc,
            31620 Villeneuve-lès-Bouloc, France — contact@matchcv.fr. Toute commande implique
            l&apos;acceptation pleine et entière des présentes CGV.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-ink">2. Services proposés</h2>
          <p className="mt-2">MatchCV propose deux formules :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Pack 5 crédits</strong> — 12 € TTC, paiement unique, sans date d&apos;expiration.
              Chaque crédit permet une génération de CV réécrit et lettre de motivation à partir
              d&apos;une offre d&apos;emploi.
            </li>
            <li>
              <strong>Abonnement Illimité</strong> — 19 € TTC / mois, générations illimitées pendant
              la durée de l&apos;abonnement, résiliable à tout moment.
            </li>
          </ul>
          <p className="mt-2">
            TVA non applicable, article 293 B du Code Général des Impôts (régime de la
            micro-entreprise).
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-ink">3. Prix et paiement</h2>
          <p className="mt-2">
            Les prix sont indiqués en euros, toutes taxes comprises. Le paiement s&apos;effectue en ligne
            par carte bancaire via Stripe, prestataire de paiement sécurisé. MatchCV ne stocke aucune
            donnée bancaire.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-ink">4. Droit de rétractation</h2>
          <p className="mt-2">
            Conformément à l&apos;article L221-18 du Code de la consommation, vous disposez en principe
            d&apos;un délai de 14 jours pour exercer votre droit de rétractation sur un achat en ligne.
          </p>
          <p className="mt-2">
            Toutefois, conformément à l&apos;article L221-28, 13° du Code de la consommation, ce droit ne
            s&apos;applique pas aux contenus numériques fournis sur un support immatériel dont
            l&apos;exécution a commencé après accord préalable exprès du consommateur et renoncement
            exprès à son droit de rétractation. En cochant la case d&apos;acceptation avant l&apos;achat,
            vous demandez l&apos;exécution immédiate du service (accès aux crédits ou à l&apos;abonnement
            dès validation du paiement) et renoncez expressément à votre droit de rétractation pour ce
            service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-ink">5. Résiliation de l&apos;abonnement</h2>
          <p className="mt-2">
            L&apos;abonnement Illimité peut être résilié à tout moment depuis l&apos;espace client Stripe
            accessible dans votre tableau de bord (page Facturation). La résiliation prend effet à la
            fin de la période déjà payée ; aucun remboursement au prorata n&apos;est effectué pour la
            période en cours.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-ink">6. Responsabilité</h2>
          <p className="mt-2">
            Les CV et lettres de motivation sont générés par intelligence artificielle à titre
            d&apos;aide à la rédaction. Il appartient à l&apos;utilisateur de vérifier et corriger le
            contenu avant tout envoi. MatchCV ne peut être tenu responsable des conséquences liées à
            l&apos;utilisation des documents générés.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-ink">7. Litiges et médiation</h2>
          <p className="mt-2">
            Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable
            sera recherchée avant toute action judiciaire. Conformément à l&apos;article L616-1 du Code
            de la consommation, vous pouvez recourir gratuitement au service de médiation de la
            consommation dont les coordonnées seront communiquées sur simple demande à
            contact@matchcv.fr.
          </p>
        </section>
      </div>
    </div>
  );
}

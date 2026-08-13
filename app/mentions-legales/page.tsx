import Link from "next/link";

export const metadata = { title: "Mentions légales — MatchCV" };

export default function MentionsLegalesPage() {
  return (
    <div className="container-page max-w-2xl py-16">
      <Link href="/" className="font-mono text-xs text-slate-500 hover:text-ink">← Retour à l&apos;accueil</Link>
      <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">Mentions légales</h1>
      <p className="mt-1 text-xs text-slate-500">Dernière mise à jour : août 2026</p>

      <div className="prose prose-sm mt-8 max-w-none space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="font-display text-base font-semibold text-ink">1. Éditeur du site</h2>
          <p className="mt-2">
            Le site MatchCV (matchcv.fr) est édité par Noham Bellahssan, entrepreneur individuel
            (micro-entrepreneur), dont l&apos;immatriculation est en cours (numéro SIRET en attente
            d&apos;attribution auprès de l&apos;URSSAF — cette section sera mise à jour dès réception).
          </p>
          <p className="mt-2">
            Adresse : 930 route de Bouloc, 31620 Villeneuve-lès-Bouloc, France
            <br />
            E-mail : contact@matchcv.fr
          </p>
          <p className="mt-2">Directeur de la publication : Noham Bellahssan.</p>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-ink">2. Hébergement</h2>
          <p className="mt-2">
            Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
            (vercel.com).
          </p>
          <p className="mt-2">
            Les données (comptes, historique de générations) sont hébergées via Supabase Inc.
            (supabase.com). Les paiements sont traités par Stripe Payments Europe, Ltd.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-ink">3. Propriété intellectuelle</h2>
          <p className="mt-2">
            L&apos;ensemble des éléments du site MatchCV (textes, design, logo, code) est protégé par le
            droit d&apos;auteur. Toute reproduction ou représentation, totale ou partielle, sans
            autorisation, est interdite. Les CV et lettres de motivation générés via le service
            appartiennent à l&apos;utilisateur qui les a créés.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-ink">4. Responsabilité</h2>
          <p className="mt-2">
            MatchCV s&apos;appuie sur un modèle d&apos;intelligence artificielle (Claude, développé par
            Anthropic) pour reformuler les CV et lettres de motivation. Le contenu généré doit être
            relu et vérifié par l&apos;utilisateur avant tout envoi : MatchCV ne garantit ni
            l&apos;exactitude, ni l&apos;exhaustivité, ni l&apos;obtention d&apos;un entretien ou d&apos;un
            emploi.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-ink">5. Contact</h2>
          <p className="mt-2">
            Pour toute question relative au site ou à vos données, contactez-nous à contact@matchcv.fr.
          </p>
        </section>
      </div>
    </div>
  );
}

import Link from "next/link";

export const metadata = { title: "Politique de confidentialité — MatchCV" };

export default function ConfidentialitePage() {
  return (
    <div className="container-page max-w-2xl py-16">
      <Link href="/" className="font-mono text-xs text-slate-500 hover:text-ink">← Retour à l&apos;accueil</Link>
      <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
        Politique de confidentialité
      </h1>
      <p className="mt-1 text-xs text-slate-500">Dernière mise à jour : août 2026</p>

      <div className="prose prose-sm mt-8 max-w-none space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="font-display text-base font-semibold text-ink">1. Responsable du traitement</h2>
          <p className="mt-2">
            Noham Bellahssan, entrepreneur individuel (micro-entrepreneur), 930 route de Bouloc, 31620
            Villeneuve-lès-Bouloc, France — contact@matchcv.fr, est responsable du traitement des
            données personnelles collectées sur MatchCV (matchcv.fr).
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-ink">2. Données collectées</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Adresse e-mail et mot de passe (chiffré) lors de la création de compte ;</li>
            <li>
              Contenu des CV et offres d&apos;emploi que vous soumettez, ainsi que les documents générés
              (titre du poste, entreprise, score de correspondance), conservés dans votre historique ;
            </li>
            <li>Informations de paiement traitées directement par Stripe (MatchCV n&apos;y a pas accès) ;</li>
            <li>Données techniques de connexion (adresse IP, journaux techniques standards).</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-ink">3. Finalités et base légale</h2>
          <p className="mt-2">
            Ces données sont utilisées pour : fournir le service (génération de CV/lettres, gestion du
            compte et des crédits), assurer la facturation, et répondre à vos demandes. Le traitement
            repose sur l&apos;exécution du contrat qui vous lie à MatchCV lors de la création de votre
            compte.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-ink">4. Destinataires des données</h2>
          <p className="mt-2">Vos données peuvent être transmises aux prestataires suivants, strictement nécessaires au fonctionnement du service :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Supabase Inc.</strong> — hébergement de la base de données et authentification ;</li>
            <li><strong>Anthropic</strong> — traitement du contenu de votre CV et de l&apos;offre d&apos;emploi par le modèle Claude, pour générer le CV et la lettre de motivation réécrits ;</li>
            <li><strong>Stripe</strong> — traitement des paiements ;</li>
            <li><strong>Resend</strong> — envoi des e-mails transactionnels (confirmation de compte, réinitialisation de mot de passe) ;</li>
            <li><strong>Vercel Inc.</strong> — hébergement du site.</li>
          </ul>
          <p className="mt-2">
            Ces prestataires peuvent être situés hors de l&apos;Union européenne (notamment aux
            États-Unis) ; le cas échéant, ils s&apos;appuient sur des garanties reconnues par le RGPD
            (clauses contractuelles types).
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-ink">5. Durée de conservation</h2>
          <p className="mt-2">
            Vos données sont conservées tant que votre compte est actif. En cas de suppression de
            compte, vos données sont effacées dans un délai raisonnable, sauf obligation légale de
            conservation plus longue (ex. facturation).
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-ink">6. Vos droits</h2>
          <p className="mt-2">
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification,
            d&apos;effacement, de limitation et d&apos;opposition sur vos données. Pour exercer ces
            droits, contactez-nous à contact@matchcv.fr. La suppression de compte peut également vous
            être demandée par ce même moyen. Vous disposez aussi du droit d&apos;introduire une
            réclamation auprès de la CNIL (cnil.fr).
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-ink">7. Cookies</h2>
          <p className="mt-2">
            MatchCV utilise uniquement des cookies techniques strictement nécessaires au fonctionnement
            du service (maintien de votre session de connexion). Aucun cookie publicitaire ou de
            traçage tiers n&apos;est utilisé.
          </p>
        </section>
      </div>
    </div>
  );
}

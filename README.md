# MatchCV

MatchCV adapte automatiquement un CV et génère une lettre de motivation personnalisée à partir d'une offre d'emploi, grâce à Claude (Anthropic). L'utilisateur colle son CV et l'offre visée, obtient un CV réécrit optimisé pour les filtres ATS, une lettre de motivation, un score de correspondance, puis exporte le tout en PDF (2 templates).

**Stack** : Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase (Auth + Postgres) · Stripe (abonnement + crédits) · API Anthropic (Claude).

---

## 1. Prérequis

- Node.js ≥ 18.18
- Un compte [Supabase](https://supabase.com)
- Un compte [Stripe](https://stripe.com) (mode test suffit pour développer)
- Une clé API [Anthropic](https://console.anthropic.com)
- Un compte [Vercel](https://vercel.com) pour le déploiement (optionnel en local)

## 2. Installation locale

```bash
npm install
cp .env.example .env.local
# Renseignez ensuite toutes les valeurs dans .env.local (voir sections 3, 4, 5)
npm run dev
```

L'application est disponible sur `http://localhost:3000`.

---

## 3. Configuration Supabase

### 3.1 Créer le projet

1. Créez un projet sur [supabase.com](https://supabase.com/dashboard).
2. Dans **Project Settings → API**, récupérez :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ secret, ne jamais exposer côté client)

### 3.2 Appliquer le schéma SQL

1. Ouvrez **SQL Editor** dans le dashboard Supabase.
2. Copiez-collez le contenu de [`supabase/schema.sql`](./supabase/schema.sql) et exécutez-le.

Cela crée :
- la table `profiles` (crédits, plan, infos Stripe), avec **1 crédit offert automatiquement** à chaque inscription (trigger `handle_new_user`) ;
- la table `generations` (historique des CV/lettres générés) ;
- les policies RLS (chaque utilisateur ne voit que ses propres données) ;
- les fonctions `decrement_credit` et `add_credits`, appelées côté serveur uniquement.

### 3.3 Activer l'authentification par e-mail

Dans **Authentication → Providers → Email**, activez le provider (activé par défaut). Vous pouvez désactiver la confirmation par e-mail pour accélérer les tests (**Authentication → Settings**).

### 3.4 Activer Google OAuth

1. Dans **Authentication → Providers → Google**, activez le provider.
2. Créez des identifiants OAuth sur [Google Cloud Console](https://console.cloud.google.com/apis/credentials) :
   - Type : *Application Web*
   - URI de redirection autorisé : `https://<votre-projet>.supabase.co/auth/v1/callback`
3. Renseignez le `Client ID` et le `Client Secret` dans Supabase.
4. Dans **Authentication → URL Configuration**, ajoutez `http://localhost:3000/auth/callback` (dev) et `https://votre-domaine.vercel.app/auth/callback` (prod) aux *Redirect URLs*.

---

## 4. Configuration Anthropic (Claude)

1. Créez une clé API sur [console.anthropic.com](https://console.anthropic.com/settings/keys).
2. Renseignez-la dans `ANTHROPIC_API_KEY`.

Le modèle utilisé (`lib/anthropic.ts`) est `claude-sonnet-4-5`. Vous pouvez le changer si besoin.

---

## 5. Configuration Stripe (mode test)

### 5.1 Récupérer les clés API

Dans le [Dashboard Stripe](https://dashboard.stripe.com/test/apikeys) (mode **Test**) :
- `Clé secrète` → `STRIPE_SECRET_KEY`
- `Clé publiable` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### 5.2 Créer les deux produits

Dans **Product catalog** :

**Produit 1 — Pack 5 crédits**
- Type de prix : paiement unique
- Montant : 12,00 €
- Copiez l'`ID de prix` (`price_...`) → `STRIPE_PRICE_CREDITS_PACK`

**Produit 2 — Abonnement illimité**
- Type de prix : récurrent, mensuel
- Montant : 19,00 €
- Copiez l'`ID de prix` → `STRIPE_PRICE_SUBSCRIPTION`

### 5.3 Configurer le webhook

Le webhook (`app/api/stripe/webhook/route.ts`) crédite les comptes après paiement et synchronise le statut d'abonnement. C'est une étape indispensable.

**En local**, utilisez la Stripe CLI :

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

La commande affiche un `whsec_...` : copiez-le dans `STRIPE_WEBHOOK_SECRET`.

**En production (Vercel)** :
1. Dans **Developers → Webhooks**, ajoutez un endpoint : `https://votre-domaine.vercel.app/api/stripe/webhook`.
2. Sélectionnez les événements :
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
3. Copiez le `Signing secret` généré dans la variable d'environnement Vercel `STRIPE_WEBHOOK_SECRET`.

### 5.4 Tester un paiement

Utilisez la carte de test Stripe : `4242 4242 4242 4242`, toute date future, tout CVC.

---

## 6. Variables d'environnement — récapitulatif

Voir [`.env.example`](./.env.example). En résumé :

| Variable | Où la trouver |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (secret) |
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe CLI (dev) ou Dashboard → Webhooks (prod) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API keys |
| `STRIPE_PRICE_SUBSCRIPTION` | Stripe → Product catalog |
| `STRIPE_PRICE_CREDITS_PACK` | Stripe → Product catalog |
| `NEXT_PUBLIC_SITE_URL` | URL de l'app (`http://localhost:3000` en dev) |

---

## 7. Déploiement sur Vercel

1. Poussez le projet sur un dépôt GitHub/GitLab.
2. Sur [vercel.com/new](https://vercel.com/new), importez le dépôt (le framework Next.js est détecté automatiquement).
3. Renseignez toutes les variables d'environnement de la section 6 dans **Settings → Environment Variables**.
4. Mettez à jour `NEXT_PUBLIC_SITE_URL` avec l'URL Vercel définitive, puis redéployez.
5. Ajoutez l'URL de callback Vercel (`https://votre-domaine.vercel.app/auth/callback`) dans Supabase (section 3.4) et créez le webhook Stripe de production (section 5.3).

---

## 8. Structure du projet

```
app/
  page.tsx                    # Landing page
  (auth)/login, signup/       # Authentification
  auth/callback/               # Callback OAuth / confirmation e-mail
  (dashboard)/                 # Espace connecté (layout protégé par middleware)
    generate/                  # Outil principal : génération CV + lettre
    dashboard/                 # Historique des générations
    billing/                   # Achat crédits / abonnement
  api/
    generate/                  # Appel Claude + gestion des crédits
    stripe/checkout, portal, webhook/

components/
  landing/                     # Sections de la page d'accueil
  app/                         # Composants de l'outil (uploader, éditeur, badges)
  pdf/                         # Templates PDF (react-pdf)
  ui/                          # Boutons, cartes

lib/
  supabase/                    # Clients Supabase (browser, server, middleware)
  stripe/                      # Client Stripe + IDs de prix
  anthropic.ts                 # Appel Claude + prompt système
  pdf/generate.ts              # Génération PDF côté client
  credits.ts                   # Vérification / décrément des crédits
  types.ts                     # Types partagés

supabase/schema.sql            # Schéma complet à exécuter dans Supabase
```

## 9. Notes techniques

- **Sécurité des crédits** : la vérification et le décrément des crédits se font côté serveur (`/api/generate`), jamais côté client, via une fonction Postgres atomique (`decrement_credit`) pour éviter les doubles générations en cas de requêtes concurrentes.
- **RLS** : chaque table Supabase a des policies Row Level Security — un utilisateur ne peut lire/écrire que ses propres données. Le webhook Stripe utilise la `service_role` key pour contourner ces policies de façon contrôlée.
- **Extraction PDF côté client** : l'upload d'un CV au format PDF est parsé dans le navigateur via `pdfjs-dist`, aucun fichier n'est stocké sur un serveur.
- **Génération PDF** : les exports CV / lettre utilisent `@react-pdf/renderer` côté client (2 templates : Classique et Moderne).

## 10. Limites connues / pistes d'amélioration

- L'extraction de texte des CV PDF avec une mise en page complexe (colonnes, tableaux) peut être imparfaite — l'utilisateur peut toujours corriger le texte collé avant génération.
- Aucune limite de taux (rate limiting) n'est implémentée sur `/api/generate` au-delà du système de crédits ; à ajouter avant une mise en production à grande échelle (ex. Upstash Ratelimit).
- Les témoignages de la landing page sont fictifs et doivent être remplacés par de vrais retours utilisateurs avant lancement public.

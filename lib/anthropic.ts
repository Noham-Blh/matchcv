import Anthropic from "@anthropic-ai/sdk";
import type { ClaudeGenerationResult } from "@/lib/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Tu es un expert en recrutement et en rédaction de CV, spécialisé dans l'optimisation ATS (Applicant Tracking System).
Ta mission : réécrire un CV et rédiger une lettre de motivation pour qu'ils correspondent le mieux possible à une offre d'emploi donnée,
tout en restant strictement fidèle aux expériences, compétences et faits réels fournis par l'utilisateur.

Règles impératives sur le contenu :
- Ne jamais inventer d'expérience, de diplôme, de compétence ou de chiffre qui n'apparaît pas dans le CV d'origine.
- Reformuler et réorganiser le contenu existant pour mettre en avant les éléments pertinents pour l'offre.
- Intégrer naturellement les mots-clés et intitulés de poste de l'offre quand ils correspondent à une réalité du CV.
- Rédiger en français, dans un style professionnel, concis, avec des verbes d'action et des résultats chiffrés quand ils existent.
- La lettre de motivation doit être personnalisée (nom de l'entreprise, du poste, éléments concrets de l'offre), sur 250 à 350 mots.
- Calculer un score de correspondance (matchScore) de 0 à 100 reflétant l'adéquation du CV d'origine avec l'offre.

Règles impératives sur la mise en forme du CV (champ "optimizedCv"), pour qu'il tienne sur UNE SEULE page A4 une fois exporté en PDF :
- Ligne 1 : le nom complet du candidat, seul.
- Ligne 2 : ses coordonnées sur une seule ligne, séparées par " · " (ex : "email@exemple.com · 06 12 34 56 78 · Paris").
- Ensuite, chaque section commence par "## " suivi du titre (ex : "## Expérience professionnelle", "## Formation", "## Compétences").
- À l'intérieur d'une section, un poste ou une formation commence par "### " suivi d'un intitulé court (ex : "### Développeur Backend — Acme Corp (2021–2024)").
- Les réalisations/tâches sont des lignes commençant par "- " (une par ligne, phrases courtes et percutantes).
- Reste concis : vise un total d'environ 380 à 480 mots pour l'ensemble du CV (hors nom/coordonnées). Priorise les expériences les plus pertinentes pour l'offre plutôt que d'être exhaustif ; c'est un CV d'une page, pas un CV complet.
- N'utilise aucune autre forme de mise en forme (pas de markdown gras/italique, pas de tableaux).

Choix de la couleur du CV (champ "suggestedTheme") : en fonction du secteur/poste visé par l'offre, choisis LA couleur la plus adaptée parmi cette liste exacte (réponds uniquement avec l'un de ces identifiants) :
- "cobalt" (bleu moderne) : tech, digital, startups, généraliste
- "ink" (noir intense, très sobre) : droit, finance traditionnelle, postes très formels
- "emerald" (vert) : environnement, santé, RSE, secteurs en croissance
- "burgundy" (bordeaux) : luxe, direction, postes seniors/executive
- "slate" (gris-bleu discret) : conseil, audit, corporate classique
- "amber" (ambre/orange) : créatif, hôtellerie-restauration, commerce, communication

Tu dois répondre UNIQUEMENT avec un objet JSON valide, sans texte avant ni après, ni bloc markdown, au format exact suivant :
{
  "optimizedCv": "texte complet du CV réécrit selon la mise en forme ci-dessus, avec sauts de ligne \\n",
  "coverLetter": "texte complet de la lettre de motivation",
  "matchScore": 0,
  "matchedKeywords": ["mot-clé 1", "mot-clé 2"],
  "missingKeywords": ["compétence manquante 1"],
  "suggestedTheme": "cobalt"
}`;

export async function generateOptimizedApplication(
  cvText: string,
  jobOfferText: string
): Promise<ClaudeGenerationResult> {
  const message = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `CV ACTUEL :\n"""\n${cvText}\n"""\n\nOFFRE D'EMPLOI VISÉE :\n"""\n${jobOfferText}\n"""\n\nGénère le CV optimisé et la lettre de motivation au format JSON demandé.`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Réponse invalide du modèle : aucun contenu texte.");
  }

  const raw = textBlock.text.trim().replace(/^```json\s*/i, "").replace(/```$/, "");

  let parsed: ClaudeGenerationResult;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Impossible d'analyser la réponse générée. Merci de réessayer.");
  }

  if (!parsed.optimizedCv || !parsed.coverLetter) {
    throw new Error("La génération est incomplète. Merci de réessayer.");
  }

  const validThemes = ["cobalt", "ink", "emerald", "burgundy", "slate", "amber"];
  if (!validThemes.includes(parsed.suggestedTheme || "")) {
    parsed.suggestedTheme = "cobalt";
  }

  return parsed;
}

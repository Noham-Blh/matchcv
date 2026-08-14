/**
 * Envoie un e-mail via l'API Resend (indépendant de la configuration SMTP
 * utilisée par Supabase Auth pour les e-mails de confirmation/récupération).
 * Nécessite la variable d'environnement RESEND_API_KEY.
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "MatchCV <noreply@matchcv.fr>",
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Échec de l'envoi Resend (${res.status}): ${body}`);
  }
}

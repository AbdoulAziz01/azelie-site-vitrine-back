const env = require('../config/env');

// Palette alignée sur la charte AZELIE (bleu marine, sarcelle, or).
const COLORS = {
  navy: '#182642',
  navyDark: '#0d1728',
  teal: '#178677',
  tealLight: '#22a891',
  gold: '#eba233',
  goldLight: '#f0be53',
  ink: '#34405a',
  inkLight: '#5c6a86',
  border: '#e6ebf3',
  surface: '#ffffff',
  surfaceMuted: '#f6f8fc',
};

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function nl2br(value) {
  return escapeHtml(value).replace(/\n/g, '<br />');
}

function formatDate(date) {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Africa/Dakar',
  }).format(date instanceof Date ? date : new Date(date));
}

function infoRow(label, value) {
  if (!value) return '';
  return `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid ${COLORS.border};">
        <p style="margin:0 0 4px;font:600 11px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:0.06em;text-transform:uppercase;color:${COLORS.tealLight};">
          ${label}
        </p>
        <p style="margin:0;font:500 15px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:${COLORS.navy};">
          ${value}
        </p>
      </td>
    </tr>`;
}

/**
 * Email HTML envoyé à l'équipe AZELIE à chaque nouveau message de contact.
 * Structure en tableaux pour une compatibilité maximale avec les clients
 * mail (Gmail, Outlook) qui ignorent une grande partie du CSS moderne.
 */
function buildContactNotificationEmail(contact) {
  const fullName = escapeHtml(contact.fullName);
  const email = escapeHtml(contact.email);
  const company = contact.company ? escapeHtml(contact.company) : null;
  const subject = contact.subject ? escapeHtml(contact.subject) : null;
  const message = nl2br(contact.message);
  const receivedAt = formatDate(contact.createdAt || new Date());
  const replyHref = `mailto:${encodeURIComponent(contact.email)}?subject=${encodeURIComponent(
    `Re: ${contact.subject ? contact.subject + ' — ' : ''}votre demande AZELIE`
  )}`;

  const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Nouveau message de contact — AZELIE</title>
  </head>
  <body style="margin:0;padding:0;background:${COLORS.surfaceMuted};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      Nouvelle demande de ${fullName}${company ? ' (' + company + ')' : ''} — ${subject || 'via le formulaire de contact'}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.surfaceMuted};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${COLORS.surface};border-radius:16px;overflow:hidden;box-shadow:0 12px 32px -12px rgba(13,23,40,0.18);">

            <!-- En-tête -->
            <tr>
              <td style="background:linear-gradient(120deg,${COLORS.navy} 0%,${COLORS.teal} 55%,${COLORS.gold} 100%);padding:28px 32px;">
                <p style="margin:0;font:800 20px/1 'Segoe UI',-apple-system,Roboto,sans-serif;color:#ffffff;letter-spacing:0.02em;">
                  AZELIE
                </p>
                <p style="margin:6px 0 0;font:500 13px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;color:rgba(255,255,255,0.85);">
                  Nouveau message reçu depuis le site web
                </p>
              </td>
            </tr>

            <!-- Bandeau statut -->
            <tr>
              <td style="padding:20px 32px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background:${COLORS.surfaceMuted};border-radius:999px;padding:6px 14px;">
                      <span style="font:700 11px/1 -apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.teal};">
                        ● Nouveau prospect
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Corps -->
            <tr>
              <td style="padding:20px 32px 8px;">
                <h1 style="margin:0 0 4px;font:700 22px/1.3 'Segoe UI',-apple-system,Roboto,sans-serif;color:${COLORS.navy};">
                  ${fullName}
                </h1>
                <p style="margin:0;font:400 13px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:${COLORS.inkLight};">
                  Reçu le ${receivedAt} (heure de Dakar)
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:8px 32px 4px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${infoRow('Email professionnel', `<a href="mailto:${email}" style="color:${COLORS.navy};text-decoration:none;">${email}</a>`)}
                  ${infoRow('Entreprise', company)}
                  ${infoRow('Service concerné', subject)}
                </table>
              </td>
            </tr>

            <!-- Description du projet -->
            <tr>
              <td style="padding:20px 32px 4px;">
                <p style="margin:0 0 10px;font:600 11px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:0.06em;text-transform:uppercase;color:${COLORS.tealLight};">
                  Description du projet
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.surfaceMuted};border-radius:12px;border:1px solid ${COLORS.border};">
                  <tr>
                    <td style="padding:16px 18px;font:400 14px/1.65 -apple-system,Segoe UI,Roboto,sans-serif;color:${COLORS.ink};">
                      ${message}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td style="padding:28px 32px 8px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:999px;background:${COLORS.navy};">
                      <a href="${replyHref}" style="display:inline-block;padding:13px 28px;font:600 14px/1 -apple-system,Segoe UI,Roboto,sans-serif;color:#ffffff;text-decoration:none;border-radius:999px;">
                        Répondre à ${fullName.split(' ')[0]} →
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Pied de page -->
            <tr>
              <td style="padding:24px 32px 28px;border-top:1px solid ${COLORS.border};margin-top:16px;">
                <p style="margin:16px 0 0;font:400 12px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:${COLORS.inkLight};">
                  Ce message a été envoyé automatiquement depuis le formulaire de contact du site AZELIE (${escapeHtml(env.CLIENT_URL)}).
                </p>
              </td>
            </tr>
          </table>

          <p style="margin:20px 0 0;font:400 11px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:${COLORS.inkLight};">
            AZELIE — Dakar, Sénégal
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    `Nouveau message de contact — ${contact.fullName}`,
    '',
    `Nom complet : ${contact.fullName}`,
    `Email : ${contact.email}`,
    contact.company ? `Entreprise : ${contact.company}` : null,
    contact.subject ? `Service concerné : ${contact.subject}` : null,
    '',
    'Description du projet :',
    contact.message,
    '',
    `Reçu le ${receivedAt} (heure de Dakar)`,
  ]
    .filter(Boolean)
    .join('\n');

  return { html, text };
}

module.exports = { buildContactNotificationEmail, escapeHtml };

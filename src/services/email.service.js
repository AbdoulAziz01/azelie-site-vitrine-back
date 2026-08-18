const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('../utils/logger');
const { buildContactNotificationEmail } = require('../utils/emailTemplate');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD) {
    logger.warn('SMTP non configuré — les emails seront journalisés au lieu d\'être envoyés.');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
  });
  return transporter;
}

// N'échoue jamais l'appelant si l'email ne part pas : on journalise et on continue,
// pour ne pas bloquer un formulaire de contact/devis en cas de souci SMTP.
async function sendMail({ to, subject, html, text }) {
  const client = getTransporter();
  if (!client) {
    logger.info(`[EMAIL SIMULÉ] to=${to} subject="${subject}"`);
    return { simulated: true };
  }

  try {
    const info = await client.sendMail({ from: env.MAIL_FROM, to, subject, html, text });
    return info;
  } catch (error) {
    logger.error(`Échec d'envoi d'email vers ${to}: ${error.message}`);
    return { error: error.message };
  }
}

async function notifyAdminNewContact(contact) {
  if (!env.MAIL_TO_ADMIN) return;
  const { html, text } = buildContactNotificationEmail(contact);
  const subjectLine = contact.subject
    ? `Nouvelle demande — ${contact.subject} — ${contact.fullName}`
    : `Nouveau message de contact — ${contact.fullName}`;
  await sendMail({
    to: env.MAIL_TO_ADMIN,
    subject: subjectLine,
    html,
    text,
  });
}

async function notifyAdminNewQuote(quote) {
  if (!env.MAIL_TO_ADMIN) return;
  await sendMail({
    to: env.MAIL_TO_ADMIN,
    subject: `Nouvelle demande de devis — ${quote.fullName}`,
    html: `<p><strong>${quote.fullName}</strong> (${quote.email}) demande un devis :</p><p>${quote.description}</p>`,
  });
}

async function sendNewsletterWelcome(email) {
  await sendMail({
    to: email,
    subject: 'Bienvenue à la newsletter Azélie',
    html: '<p>Merci pour votre inscription à notre newsletter !</p>',
  });
}

module.exports = { sendMail, notifyAdminNewContact, notifyAdminNewQuote, sendNewsletterWelcome };

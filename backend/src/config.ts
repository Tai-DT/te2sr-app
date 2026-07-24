// ══════════════════════════════════════════════════════════════
//  Runtime configuration loaded from environment (.env)
// ══════════════════════════════════════════════════════════════

import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}. Copy backend/.env.example to backend/.env.`);
  return value;
}

export const config = {
  databaseUrl: required('DATABASE_URL'),
  dbCaPath: process.env.DB_CA_PATH?.trim() || '',
  jwtSecret: required('JWT_SECRET'),
  googleClientId: process.env.GOOGLE_CLIENT_ID?.trim() || '',
  adminEmails: (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
  allowedOrigins: (process.env.ALLOWED_ORIGINS || '*')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  port: parseInt(process.env.PORT || '8787', 10),

  // Cloudflare Email Sending (optional — transactional email)
  cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID?.trim() || '',
  cloudflareApiToken: process.env.CLOUDFLARE_API_TOKEN?.trim() || '',
  mailFrom: process.env.MAIL_FROM?.trim() || 'admin@te2sr.com',
  mailFromName: process.env.MAIL_FROM_NAME?.trim() || 'TE2SR',
  mailAdmin: process.env.MAIL_ADMIN?.trim() || 'admin@te2sr.com',
};

export type AppConfig = typeof config;

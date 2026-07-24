// ══════════════════════════════════════════════════════════════
//  Shared quick-contact links (Zalo / WhatsApp / Messenger / X).
//  Override per deployment via NEXT_PUBLIC_* env vars.
// ══════════════════════════════════════════════════════════════

export const SOCIAL_LINKS = {
  zalo: process.env.NEXT_PUBLIC_ZALO_URL || 'https://zalo.me/0386830040',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://wa.me/84386830040',
  messenger: process.env.NEXT_PUBLIC_MESSENGER_URL || 'https://www.facebook.com/profile.php?id=61592140385376',
  x: process.env.NEXT_PUBLIC_X_URL || 'https://x.com/_te2sr',
};

export type SocialChannel = keyof typeof SOCIAL_LINKS;

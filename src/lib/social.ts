// ══════════════════════════════════════════════════════════════
//  Shared quick-contact links (Zalo / WhatsApp / Messenger / X).
//  Override per deployment via NEXT_PUBLIC_* env vars.
// ══════════════════════════════════════════════════════════════

export const SOCIAL_LINKS = {
  zalo: process.env.NEXT_PUBLIC_ZALO_URL || 'https://zalo.me/0386830040',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://wa.me/84386830040',
  telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/te2sr',
  messenger: process.env.NEXT_PUBLIC_MESSENGER_URL || 'https://m.me/61592332571131',
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://www.facebook.com/profile.php?id=61592332571131',
  x: process.env.NEXT_PUBLIC_X_URL || 'https://x.com/_te2sr',
  github: 'https://github.com/Tai-DT/awesome-google-play-closed-testing',
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/te2sr',
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://www.youtube.com/@te2sr',
};

export type SocialChannel = keyof typeof SOCIAL_LINKS;

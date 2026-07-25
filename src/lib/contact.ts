/**
 * Kênh liên hệ dự phòng — dùng khi API đặt hàng lỗi để KHÔNG mất khách.
 * Sửa số/đường dẫn tại đây (hoặc qua biến môi trường NEXT_PUBLIC_*).
 */

export const CONTACT = {
  zalo: process.env.NEXT_PUBLIC_ZALO_URL || 'https://zalo.me/0386830040',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://wa.me/84386830040',
  messenger:
    process.env.NEXT_PUBLIC_MESSENGER_URL ||
    'https://www.facebook.com/profile.php?id=61592140385376',
  x: process.env.NEXT_PUBLIC_X_URL || 'https://x.com/_te2sr',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'te2sr@googlegroups.com',
  googleGroup: 'te2sr@googlegroups.com',
};

export interface OrderDraft {
  appName: string;
  clientEmail: string;
  platform: 'iOS' | 'Android' | 'Both';
  serviceType: string;
  targetCountries: string;
  testingUrl?: string;
  details?: string;
}

const PLATFORM_LABEL: Record<OrderDraft['platform'], string> = {
  Android: 'Gói Google Play ($50)',
  Both: 'Gói cả 2 Store ($100)',
  iOS: 'Gói doanh nghiệp (liên hệ)',
};

/** Soạn sẵn nội dung tin nhắn chứa đầy đủ thông tin đơn. */
export function buildOrderMessage(o: OrderDraft): string {
  const lines = [
    'Xin chào TE2SR, tôi muốn đăng ký dịch vụ:',
    `• Tên app: ${o.appName || '(chưa điền)'}`,
    `• Email: ${o.clientEmail || '(chưa điền)'}`,
    `• Gói: ${PLATFORM_LABEL[o.platform]}`,
    `• Dịch vụ: ${o.serviceType}`,
    `• Quốc gia mục tiêu: ${o.targetCountries || '—'}`,
  ];
  if (o.testingUrl) lines.push(`• Link kiểm thử: ${o.testingUrl}`);
  if (o.details) lines.push(`• Ghi chú: ${o.details}`);
  return lines.join('\n');
}

/** Link chat đã kèm sẵn nội dung đơn (nơi nào hỗ trợ prefill). */
export function orderFallbackLinks(o: OrderDraft) {
  const msg = buildOrderMessage(o);
  return {
    whatsapp: `${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`,
    zalo: CONTACT.zalo, // Zalo không hỗ trợ prefill qua URL
    messenger: CONTACT.messenger,
    email: `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      `Đăng ký dịch vụ TE2SR — ${o.appName || 'App mới'}`
    )}&body=${encodeURIComponent(msg)}`,
    raw: msg,
  };
}

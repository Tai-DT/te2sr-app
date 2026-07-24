// ══════════════════════════════════════════════════════════════
//  Transactional email via the Cloudflare Email Sending REST API.
//  From a Node process (not a Worker) we use the REST endpoint with a
//  Bearer API token. All sends are graceful: if email isn't configured
//  they are skipped, and failures never break the request path.
// ══════════════════════════════════════════════════════════════

import { config } from './config';
import type { Order } from './types';

export function isMailEnabled(): boolean {
  return !!(config.cloudflareAccountId && config.cloudflareApiToken && config.mailFrom);
}

interface SendOpts {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export async function sendMail(opts: SendOpts): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  if (!isMailEnabled()) return { ok: false, skipped: true };
  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${config.cloudflareAccountId}/email/sending/send`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${config.cloudflareApiToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: opts.to,
          from: { address: config.mailFrom, name: config.mailFromName },
          reply_to: opts.replyTo || config.mailAdmin,
          subject: opts.subject,
          html: opts.html,
          text: opts.text,
        }),
      },
    );
    const data = (await res.json().catch(() => null)) as { success?: boolean; errors?: { message?: string }[] } | null;
    if (!res.ok || (data && data.success === false)) {
      const msg = data?.errors?.[0]?.message || `HTTP ${res.status}`;
      console.error('✉️  sendMail failed:', msg);
      return { ok: false, error: msg };
    }
    return { ok: true };
  } catch (err) {
    console.error('✉️  sendMail error:', err);
    return { ok: false, error: String(err) };
  }
}

/** Fire-and-forget: never blocks or throws into the request path. */
export function sendMailAsync(opts: SendOpts): void {
  void sendMail(opts).catch(() => {});
}

// ── Templates ─────────────────────────────────────────────────
function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function layout(title: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f5f5f7;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:24px;">
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
        <div style="background:#0071E3;padding:20px 24px;"><span style="color:#fff;font-weight:800;font-size:18px;letter-spacing:.5px;">TE2SR</span></div>
        <div style="padding:24px;color:#0f172a;font-size:14px;line-height:1.6;">
          <h1 style="font-size:18px;margin:0 0 12px;">${esc(title)}</h1>
          ${bodyHtml}
        </div>
        <div style="padding:16px 24px;border-top:1px solid #eee;color:#94a3b8;font-size:12px;">© 2026 TE2SR Platform · admin@te2sr.com</div>
      </div>
    </div></body></html>`;
}

export function orderConfirmationMail(order: Order): { subject: string; html: string; text: string } {
  const price = order.packagePrice != null ? ` ($${order.packagePrice})` : '';
  const html = layout('Đã nhận yêu cầu dịch vụ ✅', `
    <p>Cảm ơn bạn đã đăng ký dịch vụ TE2SR.</p>
    <p><b>Mã đơn:</b> ${esc(order.id)}<br/>
       <b>Ứng dụng:</b> ${esc(order.appName)}<br/>
       <b>Gói:</b> ${esc(order.platform)}${price}</p>
    <p>Đội ngũ kỹ sư sẽ liên hệ và xử lý theo quy trình thanh toán 2 đợt (50% + 50%). Bạn có thể theo dõi tiến độ và trao đổi trực tiếp trong cổng khách hàng.</p>`);
  const text = `Da nhan don ${order.id} - ${order.appName} (${order.platform}). Cam on ban da dung TE2SR.`;
  return { subject: `TE2SR · Đã nhận đơn ${order.id}`, html, text };
}

export function orderStatusMail(order: Order): { subject: string; html: string; text: string } {
  const html = layout('Cập nhật trạng thái đơn hàng', `
    <p>Đơn <b>${esc(order.id)}</b> (${esc(order.appName)}) vừa được cập nhật trạng thái:</p>
    <p style="font-size:16px;"><b>${esc(order.status)}</b></p>`);
  const text = `Don ${order.id} -> trang thai: ${order.status}`;
  return { subject: `TE2SR · Đơn ${order.id}: ${order.status}`, html, text };
}

export function newOrderAdminMail(order: Order): { subject: string; html: string; text: string } {
  const html = layout('Đơn hàng mới 🎉', `
    <p>Có đơn mới từ khách hàng <b>${esc(order.clientEmail)}</b>:</p>
    <p><b>Mã đơn:</b> ${esc(order.id)}<br/>
       <b>Ứng dụng:</b> ${esc(order.appName)}<br/>
       <b>Gói:</b> ${esc(order.platform)}<br/>
       <b>Dịch vụ:</b> ${esc(order.serviceType)}</p>`);
  const text = `Don moi ${order.id} tu ${order.clientEmail}: ${order.appName} (${order.platform})`;
  return { subject: `TE2SR · Đơn mới ${order.id} — ${order.appName}`, html, text };
}

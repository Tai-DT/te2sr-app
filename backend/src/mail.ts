// ══════════════════════════════════════════════════════════════
//  Thư giao dịch (xác nhận đơn, báo đổi trạng thái) gửi qua Resend.
//
//  VÌ SAO KHÔNG DÙNG CLOUDFLARE EMAIL SENDING:
//  Trên gói Workers Free nó KHÔNG gửi được cho người nhận bất kỳ — chỉ gửi
//  tới địa chỉ đã xác minh trong chính tài khoản mình. Tức là báo được cho
//  quản trị nhưng không gửi nổi thư xác nhận cho KHÁCH, mà đó mới là thứ
//  cần. Muốn dùng phải lên Workers Paid ($5/tháng).
//  Nguồn: developers.cloudflare.com/email-service/platform/pricing
//
//  Resend miễn phí 3.000 thư/tháng (tối đa 100/ngày), đã ra bản chính thức,
//  gọi bằng fetch thuần nên không thêm thư viện.
//
//  CẦN LÀM MỘT LẦN: xác minh te2sr.com tại resend.com/domains rồi thêm 3 bản
//  ghi DNS (MX + SPF ở send.te2sr.com, DKIM ở resend._domainkey). Chưa xong
//  bước này thì API trả 403 validation_error dù khoá đúng.
//
//  Bản dùng Cloudflare nằm ở commit 8f51504 nếu sau này nâng gói và muốn
//  quay lại — chỉ khác đúng hàm sendMail bên dưới.
//
//  Mọi lần gửi đều "mềm": chưa cấu hình thì bỏ qua, lỗi cũng không bao giờ
//  làm hỏng luồng xử lý đơn của khách.
// ══════════════════════════════════════════════════════════════

import type { Env, Order } from './types';

/** The subset of Env the mailer reads. */
export type MailEnv = Pick<Env, 'RESEND_API_KEY' | 'MAIL_FROM' | 'MAIL_FROM_NAME' | 'MAIL_ADMIN'>;

const mailFrom = (env: MailEnv) => env.MAIL_FROM || 'admin@te2sr.com';
const mailAdmin = (env: MailEnv) => env.MAIL_ADMIN || 'admin@te2sr.com';

export function isMailEnabled(env: MailEnv): boolean {
  return !!env.RESEND_API_KEY;
}

interface SendOpts {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export async function sendMail(env: MailEnv, opts: SendOpts): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  if (!isMailEnabled(env)) return { ok: false, skipped: true };
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Resend nhận `from` dạng "Tên <địa-chỉ>", khác Cloudflare (object).
        from: `${env.MAIL_FROM_NAME || 'TE2SR'} <${mailFrom(env)}>`,
        to: opts.to,
        reply_to: opts.replyTo || mailAdmin(env),
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      }),
    });

    if (!res.ok) {
      // Đọc lỗi phòng thủ: chấp nhận cả dạng {name, message} của Resend lẫn
      // {errors:[{message}]} phòng khi API đổi. Luôn ghi kèm HTTP status —
      // thiếu status là thứ đã khiến lần chẩn đoán trước mất ba vòng dò.
      //   401 missing_api_key   → chưa nạp RESEND_API_KEY
      //   403 invalid_api_key   → khoá sai hoặc đã bị thu hồi
      //   403 validation_error  → tên miền te2sr.com chưa xác minh xong DNS
      //   429 *_quota_exceeded  → vượt 100 thư/ngày hoặc 3.000 thư/tháng
      const data = (await res.json().catch(() => null)) as
        | { name?: string; message?: string; errors?: { message?: string }[] }
        | null;
      const detail = data?.message || data?.errors?.[0]?.message || 'không rõ';
      const msg = `HTTP ${res.status}${data?.name ? ` / ${data.name}` : ''}: ${detail}`;
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
/**
 * Gửi mail nền. BẮT BUỘC truyền ExecutionContext: trên Cloudflare Workers,
 * mọi promise chưa xong sẽ bị huỷ ngay khi response được trả về, nên nếu chỉ
 * `void sendMail(...)` thì email gần như không bao giờ được gửi.
 * ctx.waitUntil() giữ worker sống cho tới khi gửi xong.
 */
export function sendMailAsync(env: MailEnv, opts: SendOpts, ctx?: { waitUntil(p: Promise<unknown>): void }): void {
  const task = sendMail(env, opts).catch((err) => {
    console.error('sendMail failed:', opts.subject, err instanceof Error ? err.message : err);
  });
  if (ctx?.waitUntil) ctx.waitUntil(task);
  else void task; // dev/local fallback
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
  // Đơn báo giá theo yêu cầu chưa có giá, chưa chốt nền tảng. Trước đây thư
  // này gửi cùng một nội dung cho mọi đơn, nên khách đọc "chưa cần thanh toán
  // gì ở bước này" trên màn hình rồi vài giây sau nhận thư đòi 50% + 50% —
  // kèm dòng "Gói: Both" mà họ chưa hề chọn.
  const isQuote = order.packagePrice == null;

  const rows = isQuote
    ? `<b>Mã đơn:</b> ${esc(order.id)}<br/>
       <b>Dự án:</b> ${esc(order.appName)}`
    : `<b>Mã đơn:</b> ${esc(order.id)}<br/>
       <b>Ứng dụng:</b> ${esc(order.appName)}<br/>
       <b>Gói:</b> ${esc(order.platform)} ($${order.packagePrice})`;

  const nextStep = isQuote
    ? `<p>Đây là dịch vụ báo giá theo yêu cầu — <b>bạn chưa cần thanh toán gì ở bước này</b>.
       Kỹ sư TE2SR sẽ đọc yêu cầu và liên hệ báo giá trong vòng 24 giờ. Bạn có thể bổ sung
       thông tin bất cứ lúc nào trong khung trao đổi của đơn.</p>`
    : `<p>Đơn thanh toán làm 2 đợt: 50% để bắt đầu và 50% khi app đã live trên Store.
       Bạn có thể theo dõi tiến độ và trao đổi trực tiếp với kỹ sư trong cổng khách hàng.</p>`;

  const html = layout(isQuote ? 'Đã nhận yêu cầu báo giá ✅' : 'Đã nhận yêu cầu dịch vụ ✅', `
    <p>Cảm ơn bạn đã đăng ký dịch vụ TE2SR.</p>
    <p>${rows}</p>
    ${nextStep}`);

  const text = isQuote
    ? `Da nhan yeu cau bao gia ${order.id} - ${order.appName}. Chua can thanh toan. Ky su se lien he trong 24 gio.`
    : `Da nhan don ${order.id} - ${order.appName} (${order.platform}). Cam on ban da dung TE2SR.`;

  return {
    subject: isQuote ? `TE2SR · Đã nhận yêu cầu báo giá ${order.id}` : `TE2SR · Đã nhận đơn ${order.id}`,
    html,
    text,
  };
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

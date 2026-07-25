// ══════════════════════════════════════════════════════════════
//  TE2SR — Cloudflare Worker backend (Hono + D1)
//  Persistent orders, real JWT auth, per-order chat, AI design reports,
//  transactional email. All data in Cloudflare D1.
// ══════════════════════════════════════════════════════════════

import { Hono } from 'hono';
import type { Context, Next } from 'hono';
import { cors } from 'hono/cors';
import type { Env, JwtPayload, Order, OrderStatus, Platform, RateLimiter, ServiceType, Variables } from './types';
import { hashPassword, isAdminEmail, optionalAuth, requireAdmin, requireAuth, signJwt, verifyPassword } from './auth';
import * as db from './db';
import { analyzeDesign } from './analyzer';
import { isMailEnabled, newOrderAdminMail, orderConfirmationMail, orderStatusMail, sendMailAsync } from './mail';

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// ── CORS ──────────────────────────────────────────────────────
app.use('*', (c, next) => {
  const allowed = (c.env.ALLOWED_ORIGINS || '*').split(',').map((s) => s.trim());
  const origin = c.req.header('Origin') || '';
  const allowAll = allowed.includes('*');
  return cors({
    origin: allowAll ? '*' : allowed.includes(origin) ? origin : allowed[0] || '*',
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })(c, next);
});

// ── Validation helpers ────────────────────────────────────────
const VALID_STATUSES: OrderStatus[] = ['Pending', 'In Progress', 'Completed', 'Rejected'];
const VALID_PLATFORMS: Platform[] = ['iOS', 'Android', 'Both'];
const VALID_SERVICES: ServiceType[] = ['Testing', 'Publishing', 'Promotion_5Star', 'DesignAnalyzer', 'WebDesign', 'AppDevelopment', 'AppSEO', 'WebSEO', 'PageManagement'];

/** Dịch vụ báo giá theo yêu cầu — không có giá niêm yết. */
const QUOTE_ONLY_SERVICES: ServiceType[] = ['WebDesign', 'AppDevelopment', 'AppSEO', 'WebSEO', 'PageManagement'];

function priceFor(platform: Platform, serviceType?: ServiceType): number | null {
  // Thiết kế web / làm app: chốt giá sau khi trao đổi yêu cầu
  if (serviceType && QUOTE_ONLY_SERVICES.includes(serviceType)) return null;
  if (platform === 'Android') return 50;
  if (platform === 'Both') return 100;
  return null; // iOS-only → Enterprise "contact us"
}

/**
 * Chặn theo tần suất trên từng IP, đếm bằng D1 nên chính xác trên toàn cầu.
 *
 * Binding `ratelimit` của Workers chỉ đếm cục bộ trong từng máy: 14 lần thử
 * đăng nhập rải ra vẫn lọt hết vì không máy nào chạm ngưỡng. Vì vậy nó chỉ
 * dùng làm lớp chắn rẻ chặn lũ request dồn dập, còn quyết định chặn thật
 * dựa trên bộ đếm D1.
 */
function rateLimit(
  pick: (env: Env) => RateLimiter | undefined,
  scope: string,
  max: number,
  message: string,
) {
  const PERIOD = 60;
  return async (c: Context<{ Bindings: Env; Variables: Variables }>, next: Next) => {
    const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'anon';

    // Lớp 1 — chặn lũ dồn vào một máy trước khi chạm database.
    const burst = pick(c.env);
    if (burst && !(await burst.limit({ key: `${scope}:${ip}` })).success) {
      return c.json({ success: false, error: message }, 429);
    }

    // Lớp 2 — bộ đếm dùng chung, chính xác. Nếu D1 lỗi thì cho đi tiếp:
    // không để sự cố database làm sập cả chức năng đăng nhập.
    try {
      const used = await db.bumpRateLimit(c.env.DB, `${scope}:${ip}`, PERIOD);
      if (used > max) return c.json({ success: false, error: message }, 429);
      if (used === 1) c.executionCtx?.waitUntil(db.purgeRateLimits(c.env.DB).catch(() => {}));
    } catch (err) {
      console.error('rateLimit D1 failed:', err instanceof Error ? err.message : err);
    }

    await next();
  };
}

/**
 * Chặn theo một khoá tuỳ ý (thường là email). Chặn theo IP là chưa đủ: kẻ tấn
 * công dùng mạng đổi IP liên tục sẽ lọt hết, trong khi dò mật khẩu luôn nhắm
 * vào MỘT email cố định — nên khoá theo email mới là thứ chặn được thật.
 * Trả về true nếu đã vượt ngưỡng.
 */
async function exceeded(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  key: string,
  max: number,
  periodSec = 60,
): Promise<boolean> {
  try {
    return (await db.bumpRateLimit(c.env.DB, key, periodSec)) > max;
  } catch (err) {
    console.error('exceeded() D1 failed:', err instanceof Error ? err.message : err);
    return false; // sự cố database không được làm sập đăng nhập
  }
}

const TOO_MANY_AUTH = 'Bạn thao tác quá nhanh. Vui lòng thử lại sau 1 phút.';
const TOO_MANY_ORDER = 'Bạn vừa gửi quá nhiều yêu cầu. Vui lòng đợi 1 phút rồi thử lại.';

function canAccessOrder(order: Order, user: JwtPayload): boolean {
  if (user.role === 'admin') return true;
  if (order.userId && order.userId === user.sub) return true;
  // Khớp theo email chỉ được chấp nhận khi email đã được Google xác thực.
  // Đăng ký bằng mật khẩu không xác minh hộp thư, nên nếu tin vào email tự
  // khai thì bất kỳ ai cũng đọc được đơn và toàn bộ chat của khách khác.
  if (user.emailVerified && order.clientEmail.toLowerCase() === user.email.toLowerCase()) return true;
  return false;
}

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

// ── Health ────────────────────────────────────────────────────
app.get('/', (c) => c.json({ service: 'TE2SR Backend', status: 'ok', docs: '/health' }));
app.get('/health', (c) => c.json({ status: 'ok', service: 'te2sr-backend', time: db.nowIso(), mail: isMailEnabled(c.env) }));

// ══════════════════════════════════════════════════════════════
//  AUTH
// ══════════════════════════════════════════════════════════════
app.post('/api/auth/register', rateLimit((e) => e.RL_AUTH, 'auth', 10, TOO_MANY_AUTH), async (c) => {
  try {
    const { name, email, password } = await c.req.json();
    if (!name || !email || !password) return c.json({ success: false, error: 'Thiếu họ tên, email hoặc mật khẩu.' }, 400);
    if (!isEmail(email)) return c.json({ success: false, error: 'Email không hợp lệ.' }, 400);
    if (String(password).length < 6) return c.json({ success: false, error: 'Mật khẩu tối thiểu 6 ký tự.' }, 400);

    // Chặn TRƯỚC khi tra DB: ADMIN_EMAILS nằm trong wrangler.toml (công khai)
    // và không có bước xác minh email, nên nếu để đăng ký tự phục vụ cấp quyền
    // admin thì bất kỳ ai cũng chiếm được — nhất là sau khi khởi tạo lại DB.
    // Chủ tài khoản phải đăng nhập bằng Google, nơi Google xác thực email.
    if (isAdminEmail(email, c.env)) {
      return c.json({
        success: false,
        error: 'Địa chỉ email này là tài khoản quản trị. Vui lòng đăng nhập bằng Google.',
      }, 403);
    }

    const existing = await db.getUserByEmail(c.env.DB, email);
    if (existing) return c.json({ success: false, error: 'Email đã được đăng ký. Vui lòng đăng nhập.' }, 409);

    const role = 'client';
    const passwordHash = await hashPassword(String(password));
    const user = await db.createUser(c.env.DB, {
      id: db.newUserId(), name: String(name).trim(), email, passwordHash, role, authProvider: 'password',
    });
    const token = await signJwt({ sub: user.id, email: user.email, role: user.role, name: user.name, emailVerified: false }, c.env.JWT_SECRET);
    return c.json({ success: true, token, user });
  } catch {
    return c.json({ success: false, error: 'Đăng ký thất bại.' }, 500);
  }
});

app.post('/api/auth/login', rateLimit((e) => e.RL_AUTH, 'auth', 10, TOO_MANY_AUTH), async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) return c.json({ success: false, error: 'Thiếu email hoặc mật khẩu.' }, 400);

    // 10 lần sai / phút cho MỖI email, bất kể đến từ bao nhiêu IP.
    if (await exceeded(c, `login-email:${String(email).toLowerCase()}`, 10)) {
      return c.json({ success: false, error: TOO_MANY_AUTH }, 429);
    }

    const record = await db.getUserByEmail(c.env.DB, email);
    if (!record || !(await verifyPassword(String(password), record.passwordHash))) {
      return c.json({ success: false, error: 'Email hoặc mật khẩu không đúng.' }, 401);
    }

    let role = record.role;
    if (isAdminEmail(record.email, c.env) && role !== 'admin') {
      await db.setUserRole(c.env.DB, record.id, 'admin');
      role = 'admin';
    }
    const user = { id: record.id, name: record.name, email: record.email, role, avatar: record.avatar, authProvider: record.authProvider, createdAt: record.createdAt };
    const token = await signJwt({ sub: user.id, email: user.email, role: user.role, name: user.name, emailVerified: record.authProvider === 'google' }, c.env.JWT_SECRET);
    return c.json({ success: true, token, user });
  } catch {
    return c.json({ success: false, error: 'Đăng nhập thất bại.' }, 500);
  }
});

app.post('/api/auth/google', rateLimit((e) => e.RL_AUTH, 'auth', 10, TOO_MANY_AUTH), async (c) => {
  try {
    const { credential } = await c.req.json();
    if (!credential) return c.json({ success: false, error: 'Thiếu Google credential (id_token).' }, 400);

    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    if (!res.ok) return c.json({ success: false, error: 'Xác thực Google thất bại.' }, 401);
    const info = (await res.json()) as { aud?: string; email?: string; email_verified?: string; name?: string; picture?: string };

    if (c.env.GOOGLE_CLIENT_ID && info.aud !== c.env.GOOGLE_CLIENT_ID) {
      return c.json({ success: false, error: 'Google client id không khớp.' }, 401);
    }
    if (!info.email) return c.json({ success: false, error: 'Không lấy được email từ Google.' }, 401);

    const email = info.email.toLowerCase();
    const role = isAdminEmail(email, c.env) ? 'admin' : 'client';
    let user = await db.getUserByEmail(c.env.DB, email);
    if (!user) {
      const created = await db.createUser(c.env.DB, {
        id: db.newUserId(),
        name: info.name || email.split('@')[0],
        email,
        passwordHash: null,
        role,
        avatar: info.picture,
        authProvider: 'google',
      });
      user = { ...created, passwordHash: null };
    } else if (role === 'admin' && user.role !== 'admin') {
      await db.setUserRole(c.env.DB, user.id, 'admin');
      user.role = 'admin';
    }

    const publicUser = { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, authProvider: user.authProvider, createdAt: user.createdAt };
    const token = await signJwt({ sub: user.id, email: user.email, role: user.role, name: user.name, emailVerified: true }, c.env.JWT_SECRET);
    return c.json({ success: true, token, user: publicUser });
  } catch {
    return c.json({ success: false, error: 'Lỗi xác thực Google.' }, 500);
  }
});

app.get('/api/auth/me', requireAuth, async (c) => {
  const user = await db.getUserById(c.env.DB, c.get('user').sub);
  if (!user) return c.json({ success: false, error: 'Không tìm thấy người dùng.' }, 404);
  return c.json({ success: true, user });
});

app.post('/api/auth/change-password', rateLimit((e) => e.RL_AUTH, 'auth', 10, TOO_MANY_AUTH), requireAuth, async (c) => {
  try {
    const { currentPassword, newPassword } = await c.req.json();
    if (!newPassword || String(newPassword).length < 6) {
      return c.json({ success: false, error: 'Mật khẩu mới tối thiểu 6 ký tự.' }, 400);
    }
    const record = await db.getUserByEmail(c.env.DB, c.get('user').email);
    if (!record) return c.json({ success: false, error: 'Không tìm thấy người dùng.' }, 404);
    if (record.passwordHash) {
      if (!currentPassword || !(await verifyPassword(String(currentPassword), record.passwordHash))) {
        return c.json({ success: false, error: 'Mật khẩu hiện tại không đúng.' }, 401);
      }
    }
    await db.setUserPassword(c.env.DB, record.id, await hashPassword(String(newPassword)));
    return c.json({ success: true });
  } catch {
    return c.json({ success: false, error: 'Đổi mật khẩu thất bại.' }, 500);
  }
});

// ══════════════════════════════════════════════════════════════
//  ORDERS
// ══════════════════════════════════════════════════════════════
app.get('/api/orders', requireAuth, async (c) => {
  const user = c.get('user');
  const orders = user.role === 'admin'
    ? await db.listAllOrders(c.env.DB)
    // Chỉ gộp đơn theo email khi email đã được Google xác thực (xem canAccessOrder)
    : await db.listOrdersForUser(c.env.DB, user.sub, user.emailVerified ? user.email : '\u0000never-match');
  return c.json({ success: true, orders });
});

app.post('/api/orders', rateLimit((e) => e.RL_ORDER, 'order', 5, TOO_MANY_ORDER), optionalAuth, async (c) => {
  try {
    const body = await c.req.json();
    const appName = String(body.appName || '').trim();
    const clientEmail = String(body.clientEmail || '').trim();
    if (!appName || !clientEmail) return c.json({ success: false, error: 'Cần tên app và email liên hệ.' }, 400);
    if (!isEmail(clientEmail)) return c.json({ success: false, error: 'Email liên hệ không hợp lệ.' }, 400);

    const platform: Platform = VALID_PLATFORMS.includes(body.platform) ? body.platform : 'Both';
    const serviceType: ServiceType = VALID_SERVICES.includes(body.serviceType) ? body.serviceType : 'Testing';
    const targetCountries = Array.isArray(body.targetCountries)
      ? body.targetCountries.map((s: unknown) => String(s).trim()).filter(Boolean)
      : ['Worldwide'];

    const currentUser = c.get('user');
    const order = await db.createOrder(c.env.DB, {
      id: db.newOrderId(),
      userId: currentUser?.sub ?? null,
      appName,
      clientEmail,
      platform,
      serviceType,
      targetCountries,
      testingUrl: body.testingUrl ? String(body.testingUrl).trim() : null,
      details: body.details ? String(body.details).trim() : '',
      packagePrice: priceFor(platform, serviceType),
    });

    const conf = orderConfirmationMail(order);
    sendMailAsync(c.env, { to: order.clientEmail, subject: conf.subject, html: conf.html, text: conf.text }, c.executionCtx);
    const adminMail = newOrderAdminMail(order);
    sendMailAsync(c.env, { to: c.env.MAIL_ADMIN || 'admin@te2sr.com', subject: adminMail.subject, html: adminMail.html, text: adminMail.text }, c.executionCtx);

    return c.json({ success: true, order });
  } catch {
    return c.json({ success: false, error: 'Tạo đơn hàng thất bại.' }, 500);
  }
});

app.get('/api/orders/:id', requireAuth, async (c) => {
  const order = await db.getOrderById(c.env.DB, c.req.param('id')!);
  if (!order) return c.json({ success: false, error: 'Không tìm thấy đơn hàng.' }, 404);
  if (!canAccessOrder(order, c.get('user'))) return c.json({ success: false, error: 'Không có quyền truy cập đơn này.' }, 403);
  return c.json({ success: true, order });
});

app.patch('/api/orders/:id/status', requireAdmin, async (c) => {
  try {
    const { status } = await c.req.json();
    if (!VALID_STATUSES.includes(status)) return c.json({ success: false, error: 'Trạng thái không hợp lệ.' }, 400);
    const order = await db.updateOrderStatus(c.env.DB, c.req.param('id')!, status);
    if (!order) return c.json({ success: false, error: 'Không tìm thấy đơn hàng.' }, 404);
    const st = orderStatusMail(order);
    sendMailAsync(c.env, { to: order.clientEmail, subject: st.subject, html: st.html, text: st.text }, c.executionCtx);
    return c.json({ success: true, order });
  } catch {
    return c.json({ success: false, error: 'Cập nhật trạng thái thất bại.' }, 500);
  }
});

app.patch('/api/orders/:id/payment', requireAdmin, async (c) => {
  try {
    const { field, value } = await c.req.json();
    if (field !== 'paid_deposit' && field !== 'paid_final') return c.json({ success: false, error: 'Trường thanh toán không hợp lệ.' }, 400);
    const id = c.req.param('id')!;
    let order = await db.updateOrderPayment(c.env.DB, id, field, !!value);
    if (!order) return c.json({ success: false, error: 'Không tìm thấy đơn hàng.' }, 404);
    // Paying the deposit kicks off the 14-day testing countdown.
    if (field === 'paid_deposit' && !!value) {
      await db.startTestingIfUnset(c.env.DB, id);
      order = await db.getOrderById(c.env.DB, id);
    }
    return c.json({ success: true, order });
  } catch {
    return c.json({ success: false, error: 'Cập nhật thanh toán thất bại.' }, 500);
  }
});

// Manually start / reset the 14-day testing countdown (admin).
app.patch('/api/orders/:id/testing', requireAdmin, async (c) => {
  try {
    const { action, startedAt } = await c.req.json();
    if (action !== 'start' && action !== 'reset') return c.json({ success: false, error: 'Hành động không hợp lệ.' }, 400);
    let value: string | null = null;
    if (action === 'start') {
      value = startedAt && !Number.isNaN(Date.parse(startedAt)) ? new Date(startedAt).toISOString() : db.nowIso();
    }
    const order = await db.setTestingStarted(c.env.DB, c.req.param('id')!, value);
    if (!order) return c.json({ success: false, error: 'Không tìm thấy đơn hàng.' }, 404);
    return c.json({ success: true, order });
  } catch {
    return c.json({ success: false, error: 'Cập nhật bộ đếm thất bại.' }, 500);
  }
});

// ══════════════════════════════════════════════════════════════
//  ORDER MESSAGES
// ══════════════════════════════════════════════════════════════
app.get('/api/orders/:id/messages', requireAuth, async (c) => {
  const order = await db.getOrderById(c.env.DB, c.req.param('id')!);
  if (!order) return c.json({ success: false, error: 'Không tìm thấy đơn hàng.' }, 404);
  if (!canAccessOrder(order, c.get('user'))) return c.json({ success: false, error: 'Không có quyền.' }, 403);
  const messages = await db.listMessages(c.env.DB, order.id);
  return c.json({ success: true, messages });
});

app.post('/api/orders/:id/messages', requireAuth, async (c) => {
  try {
    const order = await db.getOrderById(c.env.DB, c.req.param('id')!);
    if (!order) return c.json({ success: false, error: 'Không tìm thấy đơn hàng.' }, 404);
    const user = c.get('user');
    if (!canAccessOrder(order, user)) return c.json({ success: false, error: 'Không có quyền.' }, 403);
    const { text } = await c.req.json();
    if (!text || !String(text).trim()) return c.json({ success: false, error: 'Nội dung tin nhắn trống.' }, 400);
    const message = await db.addMessage(c.env.DB, {
      orderId: order.id,
      senderId: user.sub,
      senderName: user.role === 'admin' ? 'TE2SR Support' : user.name,
      role: user.role,
      text: String(text).trim().slice(0, 4000),
    });
    return c.json({ success: true, message });
  } catch {
    return c.json({ success: false, error: 'Gửi tin nhắn thất bại.' }, 500);
  }
});

// ══════════════════════════════════════════════════════════════
//  AI DESIGN ANALYSIS
// ══════════════════════════════════════════════════════════════
app.post('/api/analyze-design', optionalAuth, async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const fileName = body.fileName ? String(body.fileName) : 'app-screenshot.png';
    const user = c.get('user');
    const report = analyzeDesign(fileName, user?.sub ?? null);
    if (user) await db.saveReport(c.env.DB, report);
    return c.json({ success: true, report });
  } catch {
    return c.json({ success: false, error: 'Phân tích thiết kế thất bại.' }, 500);
  }
});

app.get('/api/reports', requireAuth, async (c) => {
  const reports = await db.listReportsForUser(c.env.DB, c.get('user').sub);
  return c.json({ success: true, reports });
});

// ══════════════════════════════════════════════════════════════
//  ADMIN
// ══════════════════════════════════════════════════════════════
app.get('/api/admin/stats', requireAdmin, async (c) => {
  const stats = await db.adminStats(c.env.DB);
  return c.json({ success: true, stats });
});

// ── Fallback ──────────────────────────────────────────────────
app.notFound((c) => c.json({ success: false, error: 'Endpoint không tồn tại.' }, 404));
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ success: false, error: 'Lỗi máy chủ nội bộ.' }, 500);
});

export default app;

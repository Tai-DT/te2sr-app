// ══════════════════════════════════════════════════════════════
//  TE2SR — Node backend (Hono + MySQL)
//  Persistent orders, real JWT auth, per-order chat, AI design reports.
// ══════════════════════════════════════════════════════════════

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { config } from './config';
import type { JwtPayload, Order, OrderStatus, Platform, ServiceType, Variables } from './types';
import { hashPassword, isAdminEmail, optionalAuth, requireAdmin, requireAuth, signJwt, verifyPassword } from './auth';
import * as db from './db';
import { analyzeDesign } from './analyzer';
import { isMailEnabled, newOrderAdminMail, orderConfirmationMail, orderStatusMail, sendMailAsync } from './mail';

const app = new Hono<{ Variables: Variables }>();

// ── CORS ──────────────────────────────────────────────────────
const allowAll = config.allowedOrigins.includes('*');
app.use(
  '*',
  cors({
    origin: (origin) => (allowAll ? origin || '*' : config.allowedOrigins.includes(origin) ? origin : config.allowedOrigins[0]),
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  }),
);

// ── Validation helpers ────────────────────────────────────────
const VALID_STATUSES: OrderStatus[] = ['Pending', 'In Progress', 'Completed', 'Rejected'];
const VALID_PLATFORMS: Platform[] = ['iOS', 'Android', 'Both'];
const VALID_SERVICES: ServiceType[] = ['Testing', 'Publishing', 'Promotion_5Star', 'DesignAnalyzer'];

/** Default USD price derived from the chosen package/platform. */
function priceFor(platform: Platform): number | null {
  if (platform === 'Android') return 50; // Google Play package
  if (platform === 'Both') return 100; // both stores
  return null; // iOS-only maps to the Enterprise "contact us" tier
}

function canAccessOrder(order: Order, user: JwtPayload): boolean {
  return user.role === 'admin' || order.userId === user.sub || order.clientEmail.toLowerCase() === user.email.toLowerCase();
}

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

// ── Health ────────────────────────────────────────────────────
app.get('/', (c) => c.json({ service: 'TE2SR Backend', status: 'ok', docs: '/health' }));
app.get('/health', (c) => c.json({ status: 'ok', service: 'te2sr-backend', time: db.nowIso(), mail: isMailEnabled() }));

// ══════════════════════════════════════════════════════════════
//  AUTH
// ══════════════════════════════════════════════════════════════
app.post('/api/auth/register', async (c) => {
  try {
    const { name, email, password } = await c.req.json();
    if (!name || !email || !password) return c.json({ success: false, error: 'Thiếu họ tên, email hoặc mật khẩu.' }, 400);
    if (!isEmail(email)) return c.json({ success: false, error: 'Email không hợp lệ.' }, 400);
    if (String(password).length < 6) return c.json({ success: false, error: 'Mật khẩu tối thiểu 6 ký tự.' }, 400);

    const existing = await db.getUserByEmail(email);
    if (existing) return c.json({ success: false, error: 'Email đã được đăng ký. Vui lòng đăng nhập.' }, 409);

    const role = isAdminEmail(email) ? 'admin' : 'client';
    const passwordHash = await hashPassword(String(password));
    const user = await db.createUser({
      id: db.newUserId(), name: String(name).trim(), email, passwordHash, role, authProvider: 'password',
    });
    const token = await signJwt({ sub: user.id, email: user.email, role: user.role, name: user.name }, config.jwtSecret);
    return c.json({ success: true, token, user });
  } catch {
    return c.json({ success: false, error: 'Đăng ký thất bại.' }, 500);
  }
});

app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) return c.json({ success: false, error: 'Thiếu email hoặc mật khẩu.' }, 400);

    const record = await db.getUserByEmail(email);
    if (!record || !(await verifyPassword(String(password), record.passwordHash))) {
      return c.json({ success: false, error: 'Email hoặc mật khẩu không đúng.' }, 401);
    }

    // Promote to admin if the email is now on the admin allow-list.
    let role = record.role;
    if (isAdminEmail(record.email) && role !== 'admin') {
      await db.setUserRole(record.id, 'admin');
      role = 'admin';
    }
    const user = { id: record.id, name: record.name, email: record.email, role, avatar: record.avatar, authProvider: record.authProvider, createdAt: record.createdAt };
    const token = await signJwt({ sub: user.id, email: user.email, role: user.role, name: user.name }, config.jwtSecret);
    return c.json({ success: true, token, user });
  } catch {
    return c.json({ success: false, error: 'Đăng nhập thất bại.' }, 500);
  }
});

app.post('/api/auth/google', async (c) => {
  try {
    const { credential } = await c.req.json();
    if (!credential) return c.json({ success: false, error: 'Thiếu Google credential (id_token).' }, 400);

    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    if (!res.ok) return c.json({ success: false, error: 'Xác thực Google thất bại.' }, 401);
    const info = (await res.json()) as { aud?: string; email?: string; email_verified?: string; name?: string; picture?: string };

    if (config.googleClientId && info.aud !== config.googleClientId) {
      return c.json({ success: false, error: 'Google client id không khớp.' }, 401);
    }
    if (!info.email) return c.json({ success: false, error: 'Không lấy được email từ Google.' }, 401);

    const email = info.email.toLowerCase();
    const role = isAdminEmail(email) ? 'admin' : 'client';
    let user = await db.getUserByEmail(email);
    if (!user) {
      const created = await db.createUser({
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
      await db.setUserRole(user.id, 'admin');
      user.role = 'admin';
    }

    const publicUser = { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, authProvider: user.authProvider, createdAt: user.createdAt };
    const token = await signJwt({ sub: user.id, email: user.email, role: user.role, name: user.name }, config.jwtSecret);
    return c.json({ success: true, token, user: publicUser });
  } catch {
    return c.json({ success: false, error: 'Lỗi xác thực Google.' }, 500);
  }
});

app.get('/api/auth/me', requireAuth, async (c) => {
  const payload = c.get('user');
  const user = await db.getUserById(payload.sub);
  if (!user) return c.json({ success: false, error: 'Không tìm thấy người dùng.' }, 404);
  return c.json({ success: true, user });
});

app.post('/api/auth/change-password', requireAuth, async (c) => {
  try {
    const { currentPassword, newPassword } = await c.req.json();
    if (!newPassword || String(newPassword).length < 6) {
      return c.json({ success: false, error: 'Mật khẩu mới tối thiểu 6 ký tự.' }, 400);
    }
    const record = await db.getUserByEmail(c.get('user').email);
    if (!record) return c.json({ success: false, error: 'Không tìm thấy người dùng.' }, 404);

    // Accounts that already have a password must prove the current one.
    // Google-only accounts (no hash yet) may set an initial password.
    if (record.passwordHash) {
      if (!currentPassword || !(await verifyPassword(String(currentPassword), record.passwordHash))) {
        return c.json({ success: false, error: 'Mật khẩu hiện tại không đúng.' }, 401);
      }
    }
    await db.setUserPassword(record.id, await hashPassword(String(newPassword)));
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
    ? await db.listAllOrders()
    : await db.listOrdersForUser(user.sub, user.email);
  return c.json({ success: true, orders });
});

app.post('/api/orders', optionalAuth, async (c) => {
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
    const order = await db.createOrder({
      id: db.newOrderId(),
      userId: currentUser?.sub ?? null,
      appName,
      clientEmail,
      platform,
      serviceType,
      targetCountries,
      testingUrl: body.testingUrl ? String(body.testingUrl).trim() : null,
      details: body.details ? String(body.details).trim() : '',
      packagePrice: priceFor(platform),
    });

    // Transactional email (graceful no-op if not configured)
    const conf = orderConfirmationMail(order);
    sendMailAsync({ to: order.clientEmail, subject: conf.subject, html: conf.html, text: conf.text });
    const adminMail = newOrderAdminMail(order);
    sendMailAsync({ to: config.mailAdmin, subject: adminMail.subject, html: adminMail.html, text: adminMail.text });

    return c.json({ success: true, order });
  } catch {
    return c.json({ success: false, error: 'Tạo đơn hàng thất bại.' }, 500);
  }
});

app.get('/api/orders/:id', requireAuth, async (c) => {
  const order = await db.getOrderById(c.req.param('id')!);
  if (!order) return c.json({ success: false, error: 'Không tìm thấy đơn hàng.' }, 404);
  if (!canAccessOrder(order, c.get('user'))) return c.json({ success: false, error: 'Không có quyền truy cập đơn này.' }, 403);
  return c.json({ success: true, order });
});

app.patch('/api/orders/:id/status', requireAdmin, async (c) => {
  try {
    const { status } = await c.req.json();
    if (!VALID_STATUSES.includes(status)) return c.json({ success: false, error: 'Trạng thái không hợp lệ.' }, 400);
    const order = await db.updateOrderStatus(c.req.param('id')!, status);
    if (!order) return c.json({ success: false, error: 'Không tìm thấy đơn hàng.' }, 404);
    const st = orderStatusMail(order);
    sendMailAsync({ to: order.clientEmail, subject: st.subject, html: st.html, text: st.text });
    return c.json({ success: true, order });
  } catch {
    return c.json({ success: false, error: 'Cập nhật trạng thái thất bại.' }, 500);
  }
});

app.patch('/api/orders/:id/payment', requireAdmin, async (c) => {
  try {
    const { field, value } = await c.req.json();
    if (field !== 'paid_deposit' && field !== 'paid_final') return c.json({ success: false, error: 'Trường thanh toán không hợp lệ.' }, 400);
    const order = await db.updateOrderPayment(c.req.param('id')!, field, !!value);
    if (!order) return c.json({ success: false, error: 'Không tìm thấy đơn hàng.' }, 404);
    return c.json({ success: true, order });
  } catch {
    return c.json({ success: false, error: 'Cập nhật thanh toán thất bại.' }, 500);
  }
});

// ══════════════════════════════════════════════════════════════
//  ORDER MESSAGES (support chat)
// ══════════════════════════════════════════════════════════════
app.get('/api/orders/:id/messages', requireAuth, async (c) => {
  const order = await db.getOrderById(c.req.param('id')!);
  if (!order) return c.json({ success: false, error: 'Không tìm thấy đơn hàng.' }, 404);
  if (!canAccessOrder(order, c.get('user'))) return c.json({ success: false, error: 'Không có quyền.' }, 403);
  const messages = await db.listMessages(order.id);
  return c.json({ success: true, messages });
});

app.post('/api/orders/:id/messages', requireAuth, async (c) => {
  try {
    const order = await db.getOrderById(c.req.param('id')!);
    if (!order) return c.json({ success: false, error: 'Không tìm thấy đơn hàng.' }, 404);
    const user = c.get('user');
    if (!canAccessOrder(order, user)) return c.json({ success: false, error: 'Không có quyền.' }, 403);
    const { text } = await c.req.json();
    if (!text || !String(text).trim()) return c.json({ success: false, error: 'Nội dung tin nhắn trống.' }, 400);
    const message = await db.addMessage({
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
    if (user) await db.saveReport(report); // persist for logged-in users
    return c.json({ success: true, report });
  } catch {
    return c.json({ success: false, error: 'Phân tích thiết kế thất bại.' }, 500);
  }
});

app.get('/api/reports', requireAuth, async (c) => {
  const reports = await db.listReportsForUser(c.get('user').sub);
  return c.json({ success: true, reports });
});

// ══════════════════════════════════════════════════════════════
//  ADMIN
// ══════════════════════════════════════════════════════════════
app.get('/api/admin/stats', requireAdmin, async (c) => {
  const stats = await db.adminStats();
  return c.json({ success: true, stats });
});

// ── Fallback ──────────────────────────────────────────────────
app.notFound((c) => c.json({ success: false, error: 'Endpoint không tồn tại.' }, 404));
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ success: false, error: 'Lỗi máy chủ nội bộ.' }, 500);
});

// ── Boot ──────────────────────────────────────────────────────
serve({ fetch: app.fetch, port: config.port }, (info) => {
  console.log(`🚀 TE2SR backend listening on http://localhost:${info.port}`);
});

export default app;

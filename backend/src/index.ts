import { Hono } from 'hono';
import { cors } from 'hono/cors';

export interface Env {
  DB: D1Database;
  /** Bí mật: npx wrangler secret put ADMIN_TOKEN */
  ADMIN_TOKEN?: string;
  /** Origin được phép, phân tách bằng dấu phẩy. */
  ALLOWED_ORIGINS?: string;
}

/** Shape trả về cho frontend (khớp src/lib/store.ts + phần thanh toán mở rộng). */
export interface Order {
  id: string;
  appName: string;
  clientEmail: string;
  platform: 'iOS' | 'Android' | 'Both';
  packageSlug: string | null;
  packagePrice: number | null;
  serviceType: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Rejected';
  targetCountries: string[];
  testingUrl: string | null;
  testingStartedAt: string | null;
  details: string;
  paidDeposit: boolean;
  paidFinal: boolean;
  createdAt: string;
  updatedAt: string;
}

const PACKAGE_PRICE: Record<string, number | null> = {
  'google-play': 50,
  'app-store': 70,
  'ca-2-store': 100,
  'doanh-nghiep': null,
};

const DEFAULT_ORIGINS = [
  'https://te2sr.com',
  'https://www.te2sr.com',
  'https://te2sr.pages.dev',
  'http://localhost:3000',
];

const app = new Hono<{ Bindings: Env }>();

app.use('*', async (c, next) => {
  const allowed = c.env.ALLOWED_ORIGINS
    ? c.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim())
    : DEFAULT_ORIGINS;
  return cors({
    origin: (origin) => {
      if (!origin) return allowed[0];
      if (allowed.includes(origin) || /^https:\/\/[a-z0-9-]+\.te2sr\.pages\.dev$/.test(origin)) {
        return origin;
      }
      return null;
    },
    allowMethods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })(c, next);
});

/* ─────────────── helpers ─────────────── */

const ID_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // bỏ I O 0 1 cho dễ đọc khi chuyển khoản

function newOrderId(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  let out = '';
  for (const b of bytes) out += ID_ALPHABET[b % ID_ALPHABET.length];
  return `ORD-${out}`;
}

function isEmail(v: unknown): v is string {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

function str(v: unknown, max = 2000): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t ? t.slice(0, max) : null;
}

function rowToOrder(r: any): Order {
  let countries: string[] = [];
  try {
    countries = r.target_countries ? JSON.parse(r.target_countries) : [];
  } catch {
    countries = [];
  }
  return {
    id: r.id,
    appName: r.app_name,
    clientEmail: r.client_email,
    platform: r.platform,
    packageSlug: r.package_slug ?? null,
    packagePrice: r.package_price ?? null,
    serviceType: r.service_type,
    status: r.status,
    targetCountries: countries,
    testingUrl: r.testing_url ?? null,
    testingStartedAt: r.testing_started_at ?? null,
    details: r.details ?? '',
    paidDeposit: Boolean(r.paid_deposit),
    paidFinal: Boolean(r.paid_final),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

/** Chặn /api/admin/* nếu thiếu hoặc sai bearer token. */
function requireAdmin(c: any): Response | null {
  const expected = c.env.ADMIN_TOKEN;
  if (!expected) {
    return c.json({ success: false, error: 'Server chưa cấu hình ADMIN_TOKEN.' }, 503);
  }
  const header = c.req.header('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (token.length !== expected.length) {
    return c.json({ success: false, error: 'Không có quyền truy cập.' }, 401);
  }
  let diff = 0;
  for (let i = 0; i < token.length; i++) diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) {
    return c.json({ success: false, error: 'Không có quyền truy cập.' }, 401);
  }
  return null;
}

/* ─────────────── routes ─────────────── */

app.get('/health', async (c) => {
  let database = 'unknown';
  let orders = -1;
  try {
    const row: any = await c.env.DB.prepare('SELECT COUNT(*) AS n FROM orders').first();
    orders = row?.n ?? -1;
    database = 'ok';
  } catch (e: any) {
    database = `error: ${e?.message ?? 'unknown'}`;
  }
  return c.json({
    status: 'ok',
    service: 'te2sr-backend',
    database,
    orders,
    adminTokenConfigured: Boolean(c.env.ADMIN_TOKEN),
    time: new Date().toISOString(),
  });
});

/** Khách tạo đơn mới. */
app.post('/api/services', async (c) => {
  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ success: false, error: 'Dữ liệu gửi lên không hợp lệ.' }, 400);
  }

  const appName = str(body.appName, 200);
  const clientEmail = str(body.clientEmail, 200);

  if (!appName) return c.json({ success: false, error: 'Vui lòng nhập tên app.' }, 400);
  if (!isEmail(clientEmail)) {
    return c.json({ success: false, error: 'Email liên hệ không hợp lệ.' }, 400);
  }

  const platform = ['iOS', 'Android', 'Both'].includes(body.platform) ? body.platform : 'Both';
  const packageSlug =
    typeof body.packageSlug === 'string' && body.packageSlug in PACKAGE_PRICE
      ? body.packageSlug
      : null;
  const serviceType = ['Testing', 'Publishing', 'Promotion_5Star'].includes(body.serviceType)
    ? body.serviceType
    : 'Publishing';

  const targetCountries = Array.isArray(body.targetCountries)
    ? body.targetCountries.filter((x: unknown) => typeof x === 'string' && x.trim()).slice(0, 30)
    : [];

  const testingUrl = str(body.testingUrl, 500);
  const details = str(body.details, 4000);
  const packagePrice = packageSlug ? PACKAGE_PRICE[packageSlug] : null;
  const now = new Date().toISOString();

  for (let attempt = 0; attempt < 5; attempt++) {
    const id = newOrderId();
    try {
      await c.env.DB.prepare(
        `INSERT INTO orders
          (id, user_id, app_name, client_email, platform, package_slug, service_type,
           status, target_countries, testing_url, details, package_price,
           paid_deposit, paid_final, created_at, updated_at)
         VALUES (?,NULL,?,?,?,?,?, 'Pending', ?,?,?,?, 0,0, ?,?)`
      )
        .bind(
          id,
          appName,
          clientEmail,
          platform,
          packageSlug,
          serviceType,
          JSON.stringify(targetCountries),
          testingUrl,
          details,
          packagePrice,
          now,
          now
        )
        .run();

      const row = await c.env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first();
      return c.json({ success: true, order: rowToOrder(row) }, 201);
    } catch (e: any) {
      const msg = String(e?.message ?? '');
      if (msg.includes('UNIQUE') || msg.includes('PRIMARY KEY')) continue;
      console.error('create order failed:', msg);
      return c.json({ success: false, error: 'Không lưu được đơn hàng. Vui lòng thử lại.' }, 500);
    }
  }
  return c.json({ success: false, error: 'Không tạo được mã đơn. Vui lòng thử lại.' }, 500);
});

/** Khách tra cứu đúng 1 đơn bằng mã (không lộ đơn người khác). */
app.get('/api/services/:id', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM orders WHERE id = ?')
    .bind(c.req.param('id'))
    .first();
  if (!row) return c.json({ success: false, error: 'Không tìm thấy đơn hàng.' }, 404);
  return c.json({ success: true, order: rowToOrder(row) });
});

/** Admin: danh sách đơn. */
app.get('/api/admin/orders', async (c) => {
  const denied = requireAdmin(c);
  if (denied) return denied;
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM orders ORDER BY created_at DESC LIMIT 500'
  ).all();
  return c.json({ success: true, orders: (results || []).map(rowToOrder) });
});

/** Admin: cập nhật trạng thái đơn / thanh toán / mốc bắt đầu đếm 14 ngày. */
app.patch('/api/admin/orders', async (c) => {
  const denied = requireAdmin(c);
  if (denied) return denied;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ success: false, error: 'Dữ liệu gửi lên không hợp lệ.' }, 400);
  }

  const orderId = str(body.orderId, 40);
  if (!orderId) return c.json({ success: false, error: 'Thiếu mã đơn.' }, 400);

  const sets: string[] = [];
  const binds: unknown[] = [];

  if (body.status !== undefined) {
    if (!['Pending', 'In Progress', 'Completed', 'Rejected'].includes(body.status)) {
      return c.json({ success: false, error: 'Trạng thái không hợp lệ.' }, 400);
    }
    sets.push('status = ?');
    binds.push(body.status);
  }
  if (body.paidDeposit !== undefined) {
    sets.push('paid_deposit = ?');
    binds.push(body.paidDeposit ? 1 : 0);
  }
  if (body.paidFinal !== undefined) {
    sets.push('paid_final = ?');
    binds.push(body.paidFinal ? 1 : 0);
  }
  if (body.testingUrl !== undefined) {
    sets.push('testing_url = ?');
    binds.push(str(body.testingUrl, 500));
  }
  // Bấm "bắt đầu đếm 14 ngày"
  if (body.startTesting === true) {
    sets.push('testing_started_at = ?');
    binds.push(new Date().toISOString());
  }

  if (!sets.length) return c.json({ success: false, error: 'Không có gì để cập nhật.' }, 400);

  sets.push('updated_at = ?');
  binds.push(new Date().toISOString(), orderId);

  const res = await c.env.DB.prepare(`UPDATE orders SET ${sets.join(', ')} WHERE id = ?`)
    .bind(...binds)
    .run();

  if (!res.meta.changes) {
    return c.json({ success: false, error: 'Không tìm thấy đơn hàng.' }, 404);
  }

  const row = await c.env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(orderId).first();
  return c.json({ success: true, order: rowToOrder(row) });
});

app.notFound((c) => c.json({ success: false, error: 'Not found' }, 404));

app.onError((err, c) => {
  console.error('unhandled:', err?.message);
  return c.json({ success: false, error: 'Lỗi máy chủ.' }, 500);
});

export default app;

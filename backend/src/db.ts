// ══════════════════════════════════════════════════════════════
//  Cloudflare D1 data-access layer — row mappers + typed queries
// ══════════════════════════════════════════════════════════════

import type {
  DesignAnalysisReport,
  DesignSuggestion,
  Order,
  OrderMessage,
  OrderStatus,
  Platform,
  Role,
  ServiceType,
  User,
} from './types';

// ── ID + time helpers ─────────────────────────────────────────
export const nowIso = () => new Date().toISOString();

export function randomDigits(n: number): string {
  const bytes = crypto.getRandomValues(new Uint8Array(n));
  return Array.from(bytes, (b) => (b % 10).toString()).join('');
}

export const newUserId = () => `USR-${randomDigits(6)}`;
export const newOrderId = () => `ORD-${randomDigits(5)}`;
export const newMessageId = () => `MSG-${crypto.randomUUID()}`;
export const newReportId = () => `RPT-${randomDigits(6)}`;

// ── Row shapes (snake_case, as stored) ────────────────────────
interface UserRow {
  id: string; name: string; email: string; password_hash: string | null;
  role: string; avatar: string | null; auth_provider: string; created_at: string;
}
interface OrderRow {
  id: string; user_id: string | null; app_name: string; client_email: string;
  platform: string; service_type: string; status: string; target_countries: string;
  testing_url: string | null; details: string | null; package_price: number | null;
  paid_deposit: number; paid_final: number; testing_started_at: string | null;
  created_at: string; updated_at: string;
}
interface MessageRow {
  id: string; order_id: string; sender_id: string | null; sender_name: string;
  role: string; text: string; created_at: string;
}
interface ReportRow {
  id: string; user_id: string | null; file_name: string; score: number;
  layout_score: number; typography_score: number; contrast_score: number;
  accessibility_score: number; suggestions: string; created_at: string;
}

// ── Mappers ───────────────────────────────────────────────────
export function rowToUser(r: UserRow): User {
  return {
    id: r.id, name: r.name, email: r.email, role: r.role as Role,
    avatar: r.avatar || undefined, authProvider: r.auth_provider, createdAt: r.created_at,
  };
}
function rowToOrder(r: OrderRow): Order {
  let countries: string[] = [];
  try { countries = JSON.parse(r.target_countries); } catch { countries = []; }
  return {
    id: r.id, userId: r.user_id, appName: r.app_name, clientEmail: r.client_email,
    platform: r.platform as Platform, serviceType: r.service_type as ServiceType,
    status: r.status as OrderStatus, targetCountries: countries, testingUrl: r.testing_url,
    details: r.details || '', packagePrice: r.package_price,
    paidDeposit: !!r.paid_deposit, paidFinal: !!r.paid_final,
    testingStartedAt: r.testing_started_at,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}
function rowToMessage(r: MessageRow): OrderMessage {
  return {
    id: r.id, orderId: r.order_id, senderId: r.sender_id, senderName: r.sender_name,
    role: r.role as Role, text: r.text, createdAt: r.created_at,
  };
}
function rowToReport(r: ReportRow): DesignAnalysisReport {
  let suggestions: DesignSuggestion[] = [];
  try { suggestions = JSON.parse(r.suggestions); } catch { suggestions = []; }
  return {
    id: r.id, userId: r.user_id, fileName: r.file_name, score: r.score,
    layoutScore: r.layout_score, typographyScore: r.typography_score,
    contrastScore: r.contrast_score, accessibilityScore: r.accessibility_score,
    suggestions, createdAt: r.created_at,
  };
}

// ── Users ─────────────────────────────────────────────────────
export interface NewUser {
  id: string; name: string; email: string; passwordHash: string | null;
  role: Role; avatar?: string; authProvider: string;
}

export async function createUser(db: D1Database, u: NewUser): Promise<User> {
  const createdAt = nowIso();
  await db
    .prepare(`INSERT INTO users (id, name, email, password_hash, role, avatar, auth_provider, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(u.id, u.name, u.email.toLowerCase(), u.passwordHash, u.role, u.avatar ?? null, u.authProvider, createdAt)
    .run();
  return { id: u.id, name: u.name, email: u.email.toLowerCase(), role: u.role, avatar: u.avatar, authProvider: u.authProvider, createdAt };
}

export async function getUserByEmail(db: D1Database, email: string): Promise<(User & { passwordHash: string | null }) | null> {
  const row = await db.prepare(`SELECT * FROM users WHERE email = ?`).bind(email.toLowerCase()).first<UserRow>();
  if (!row) return null;
  return { ...rowToUser(row), passwordHash: row.password_hash };
}

export async function getUserById(db: D1Database, id: string): Promise<User | null> {
  const row = await db.prepare(`SELECT * FROM users WHERE id = ?`).bind(id).first<UserRow>();
  return row ? rowToUser(row) : null;
}

export async function setUserRole(db: D1Database, id: string, role: Role): Promise<void> {
  await db.prepare(`UPDATE users SET role = ? WHERE id = ?`).bind(role, id).run();
}

export async function setUserPassword(db: D1Database, id: string, passwordHash: string): Promise<void> {
  await db.prepare(`UPDATE users SET password_hash = ? WHERE id = ?`).bind(passwordHash, id).run();
}

// ── Orders ────────────────────────────────────────────────────
export interface NewOrder {
  id: string; userId: string | null; appName: string; clientEmail: string;
  platform: Platform; serviceType: ServiceType; targetCountries: string[];
  testingUrl?: string | null; details?: string; packagePrice?: number | null;
}

export async function createOrder(db: D1Database, o: NewOrder): Promise<Order> {
  const ts = nowIso();
  await db
    .prepare(`INSERT INTO orders
      (id, user_id, app_name, client_email, platform, service_type, status, target_countries, testing_url, details, package_price, paid_deposit, paid_final, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?, 0, 0, ?, ?)`)
    .bind(
      o.id, o.userId, o.appName, o.clientEmail.toLowerCase(), o.platform, o.serviceType,
      JSON.stringify(o.targetCountries ?? []), o.testingUrl ?? null, o.details ?? '', o.packagePrice ?? null, ts, ts,
    )
    .run();
  const row = await db.prepare(`SELECT * FROM orders WHERE id = ?`).bind(o.id).first<OrderRow>();
  return rowToOrder(row!);
}

export async function listAllOrders(db: D1Database): Promise<Order[]> {
  const { results } = await db.prepare(`SELECT * FROM orders ORDER BY created_at DESC`).all<OrderRow>();
  return (results ?? []).map(rowToOrder);
}

/** Orders belonging to a user id OR matching their email (covers guest orders placed before login). */
export async function listOrdersForUser(db: D1Database, userId: string, email: string): Promise<Order[]> {
  const { results } = await db
    .prepare(`SELECT * FROM orders WHERE user_id = ? OR client_email = ? ORDER BY created_at DESC`)
    .bind(userId, email.toLowerCase())
    .all<OrderRow>();
  return (results ?? []).map(rowToOrder);
}

export async function getOrderById(db: D1Database, id: string): Promise<Order | null> {
  const row = await db.prepare(`SELECT * FROM orders WHERE id = ?`).bind(id).first<OrderRow>();
  return row ? rowToOrder(row) : null;
}

export async function updateOrderStatus(db: D1Database, id: string, status: OrderStatus): Promise<Order | null> {
  await db.prepare(`UPDATE orders SET status = ?, updated_at = ? WHERE id = ?`).bind(status, nowIso(), id).run();
  return getOrderById(db, id);
}

export async function updateOrderPayment(db: D1Database, id: string, field: 'paid_deposit' | 'paid_final', value: boolean): Promise<Order | null> {
  // `field` is validated against a whitelist by the caller.
  await db.prepare(`UPDATE orders SET ${field} = ?, updated_at = ? WHERE id = ?`).bind(value ? 1 : 0, nowIso(), id).run();
  return getOrderById(db, id);
}

/** Set (or clear) the start of the 14-day testing window. */
export async function setTestingStarted(db: D1Database, id: string, value: string | null): Promise<Order | null> {
  await db.prepare(`UPDATE orders SET testing_started_at = ?, updated_at = ? WHERE id = ?`).bind(value, nowIso(), id).run();
  return getOrderById(db, id);
}

/** Begin the 14-day countdown only if it hasn't started yet (used when the deposit is paid). */
export async function startTestingIfUnset(db: D1Database, id: string): Promise<void> {
  const now = nowIso();
  await db.prepare(`UPDATE orders SET testing_started_at = ?, updated_at = ? WHERE id = ? AND testing_started_at IS NULL`).bind(now, now, id).run();
}

// ── Messages ──────────────────────────────────────────────────
export async function listMessages(db: D1Database, orderId: string): Promise<OrderMessage[]> {
  const { results } = await db
    .prepare(`SELECT * FROM order_messages WHERE order_id = ? ORDER BY created_at ASC`)
    .bind(orderId)
    .all<MessageRow>();
  return (results ?? []).map(rowToMessage);
}

export async function addMessage(
  db: D1Database,
  m: { orderId: string; senderId: string | null; senderName: string; role: Role; text: string },
): Promise<OrderMessage> {
  const id = newMessageId();
  const createdAt = nowIso();
  await db
    .prepare(`INSERT INTO order_messages (id, order_id, sender_id, sender_name, role, text, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, m.orderId, m.senderId, m.senderName, m.role, m.text, createdAt)
    .run();
  return { id, orderId: m.orderId, senderId: m.senderId, senderName: m.senderName, role: m.role, text: m.text, createdAt };
}

// ── Reports ───────────────────────────────────────────────────
export async function saveReport(db: D1Database, r: DesignAnalysisReport): Promise<void> {
  await db
    .prepare(`INSERT INTO design_reports
      (id, user_id, file_name, score, layout_score, typography_score, contrast_score, accessibility_score, suggestions, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(
      r.id, r.userId, r.fileName, r.score, r.layoutScore, r.typographyScore,
      r.contrastScore, r.accessibilityScore, JSON.stringify(r.suggestions), r.createdAt,
    )
    .run();
}

export async function listReportsForUser(db: D1Database, userId: string): Promise<DesignAnalysisReport[]> {
  const { results } = await db
    .prepare(`SELECT * FROM design_reports WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`)
    .bind(userId)
    .all<ReportRow>();
  return (results ?? []).map(rowToReport);
}

// ── Admin stats ───────────────────────────────────────────────
export interface AdminStats {
  totalOrders: number;
  byStatus: Record<string, number>;
  byService: Record<string, number>;
  totalUsers: number;
  estimatedRevenue: number;
}

export async function adminStats(db: D1Database): Promise<AdminStats> {
  const orders = await listAllOrders(db);
  const byStatus: Record<string, number> = {};
  const byService: Record<string, number> = {};
  let revenue = 0;
  for (const o of orders) {
    byStatus[o.status] = (byStatus[o.status] || 0) + 1;
    byService[o.serviceType] = (byService[o.serviceType] || 0) + 1;
    const price = o.packagePrice ?? 0;
    if (o.paidDeposit) revenue += price / 2;
    if (o.paidFinal) revenue += price / 2;
  }
  const userCount = await db.prepare(`SELECT COUNT(*) AS n FROM users`).first<{ n: number }>();
  return {
    totalOrders: orders.length,
    byStatus,
    byService,
    totalUsers: userCount?.n ?? 0,
    estimatedRevenue: Math.round(revenue),
  };
}

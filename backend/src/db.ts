// ══════════════════════════════════════════════════════════════
//  MySQL data-access layer — row mappers + typed queries (mysql2)
// ══════════════════════════════════════════════════════════════

import type { RowDataPacket } from 'mysql2';
import { pool } from './pool';
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

// ── Low-level query helpers ───────────────────────────────────
async function rows<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const [result] = await pool.query<RowDataPacket[]>(sql, params);
  return result as unknown as T[];
}
async function one<T>(sql: string, params: unknown[] = []): Promise<T | null> {
  const result = await rows<T>(sql, params);
  return result[0] ?? null;
}

// ── Row shapes (snake_case, as stored) ────────────────────────
interface UserRow {
  id: string; name: string; email: string; password_hash: string | null;
  role: string; avatar: string | null; auth_provider: string; created_at: string;
}
interface OrderRow {
  id: string; user_id: string | null; app_name: string; client_email: string;
  platform: string; service_type: string; status: string; target_countries: string;
  testing_url: string | null; details: string | null; package_price: number | null;
  paid_deposit: number; paid_final: number; created_at: string; updated_at: string;
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

export async function createUser(u: NewUser): Promise<User> {
  const createdAt = nowIso();
  await pool.query(
    `INSERT INTO users (id, name, email, password_hash, \`role\`, avatar, auth_provider, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [u.id, u.name, u.email.toLowerCase(), u.passwordHash, u.role, u.avatar ?? null, u.authProvider, createdAt],
  );
  return { id: u.id, name: u.name, email: u.email.toLowerCase(), role: u.role, avatar: u.avatar, authProvider: u.authProvider, createdAt };
}

export async function getUserByEmail(email: string): Promise<(User & { passwordHash: string | null }) | null> {
  const row = await one<UserRow>(`SELECT * FROM users WHERE email = ?`, [email.toLowerCase()]);
  if (!row) return null;
  return { ...rowToUser(row), passwordHash: row.password_hash };
}

export async function getUserById(id: string): Promise<User | null> {
  const row = await one<UserRow>(`SELECT * FROM users WHERE id = ?`, [id]);
  return row ? rowToUser(row) : null;
}

export async function setUserRole(id: string, role: Role): Promise<void> {
  await pool.query(`UPDATE users SET \`role\` = ? WHERE id = ?`, [role, id]);
}

export async function setUserPassword(id: string, passwordHash: string): Promise<void> {
  await pool.query(`UPDATE users SET password_hash = ? WHERE id = ?`, [passwordHash, id]);
}

// ── Orders ────────────────────────────────────────────────────
export interface NewOrder {
  id: string; userId: string | null; appName: string; clientEmail: string;
  platform: Platform; serviceType: ServiceType; targetCountries: string[];
  testingUrl?: string | null; details?: string; packagePrice?: number | null;
}

export async function createOrder(o: NewOrder): Promise<Order> {
  const ts = nowIso();
  await pool.query(
    `INSERT INTO orders
      (id, user_id, app_name, client_email, platform, service_type, status, target_countries, testing_url, details, package_price, paid_deposit, paid_final, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?, 0, 0, ?, ?)`,
    [
      o.id, o.userId, o.appName, o.clientEmail.toLowerCase(), o.platform, o.serviceType,
      JSON.stringify(o.targetCountries ?? []), o.testingUrl ?? null, o.details ?? '', o.packagePrice ?? null, ts, ts,
    ],
  );
  const row = await one<OrderRow>(`SELECT * FROM orders WHERE id = ?`, [o.id]);
  return rowToOrder(row!);
}

export async function listAllOrders(): Promise<Order[]> {
  return (await rows<OrderRow>(`SELECT * FROM orders ORDER BY created_at DESC`)).map(rowToOrder);
}

/** Orders belonging to a user id OR matching their email (covers guest orders placed before login). */
export async function listOrdersForUser(userId: string, email: string): Promise<Order[]> {
  const result = await rows<OrderRow>(
    `SELECT * FROM orders WHERE user_id = ? OR client_email = ? ORDER BY created_at DESC`,
    [userId, email.toLowerCase()],
  );
  return result.map(rowToOrder);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const row = await one<OrderRow>(`SELECT * FROM orders WHERE id = ?`, [id]);
  return row ? rowToOrder(row) : null;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  await pool.query(`UPDATE orders SET status = ?, updated_at = ? WHERE id = ?`, [status, nowIso(), id]);
  return getOrderById(id);
}

export async function updateOrderPayment(id: string, field: 'paid_deposit' | 'paid_final', value: boolean): Promise<Order | null> {
  // `field` is validated against a whitelist by the caller before it reaches here.
  await pool.query(`UPDATE orders SET ${field} = ?, updated_at = ? WHERE id = ?`, [value ? 1 : 0, nowIso(), id]);
  return getOrderById(id);
}

// ── Messages ──────────────────────────────────────────────────
export async function listMessages(orderId: string): Promise<OrderMessage[]> {
  const result = await rows<MessageRow>(
    `SELECT * FROM order_messages WHERE order_id = ? ORDER BY created_at ASC`,
    [orderId],
  );
  return result.map(rowToMessage);
}

export async function addMessage(m: {
  orderId: string; senderId: string | null; senderName: string; role: Role; text: string;
}): Promise<OrderMessage> {
  const id = newMessageId();
  const createdAt = nowIso();
  await pool.query(
    `INSERT INTO order_messages (id, order_id, sender_id, sender_name, \`role\`, \`text\`, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, m.orderId, m.senderId, m.senderName, m.role, m.text, createdAt],
  );
  return { id, orderId: m.orderId, senderId: m.senderId, senderName: m.senderName, role: m.role, text: m.text, createdAt };
}

// ── Reports ───────────────────────────────────────────────────
export async function saveReport(r: DesignAnalysisReport): Promise<void> {
  await pool.query(
    `INSERT INTO design_reports
      (id, user_id, file_name, score, layout_score, typography_score, contrast_score, accessibility_score, suggestions, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      r.id, r.userId, r.fileName, r.score, r.layoutScore, r.typographyScore,
      r.contrastScore, r.accessibilityScore, JSON.stringify(r.suggestions), r.createdAt,
    ],
  );
}

export async function listReportsForUser(userId: string): Promise<DesignAnalysisReport[]> {
  const result = await rows<ReportRow>(
    `SELECT * FROM design_reports WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
    [userId],
  );
  return result.map(rowToReport);
}

// ── Admin stats ───────────────────────────────────────────────
export interface AdminStats {
  totalOrders: number;
  byStatus: Record<string, number>;
  byService: Record<string, number>;
  totalUsers: number;
  estimatedRevenue: number;
}

export async function adminStats(): Promise<AdminStats> {
  const orders = await listAllOrders();
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
  const userCount = await one<{ n: number }>(`SELECT COUNT(*) AS n FROM users`);
  return {
    totalOrders: orders.length,
    byStatus,
    byService,
    totalUsers: userCount?.n ?? 0,
    estimatedRevenue: Math.round(revenue),
  };
}

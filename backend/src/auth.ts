// ══════════════════════════════════════════════════════════════
//  Auth primitives — password hashing (PBKDF2) + JWT (HS256)
//  Implemented purely on the Web Crypto API available in Workers.
// ══════════════════════════════════════════════════════════════

import type { Context, Next } from 'hono';
import type { Env, JwtPayload, Role, Variables } from './types';

const enc = new TextEncoder();
const dec = new TextDecoder();

// ── base64url ─────────────────────────────────────────────────
function b64urlEncode(data: ArrayBuffer | Uint8Array | string): string {
  let bytes: Uint8Array;
  if (typeof data === 'string') bytes = enc.encode(data);
  else if (data instanceof Uint8Array) bytes = data;
  else bytes = new Uint8Array(data);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlToBytes(s: string): Uint8Array {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

// ── Password hashing (PBKDF2-SHA256) ──────────────────────────
const PBKDF2_ITERATIONS = 100_000;

async function deriveBits(password: string, salt: Uint8Array, iterations: number): Promise<ArrayBuffer> {
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  return crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, keyMaterial, 256);
}

/** Returns `pbkdf2$<iterations>$<salt_b64url>$<hash_b64url>`. */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const bits = await deriveBits(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${b64urlEncode(salt)}$${b64urlEncode(bits)}`;
}

export async function verifyPassword(password: string, stored: string | null): Promise<boolean> {
  if (!stored) return false;
  const parts = stored.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const iterations = parseInt(parts[1], 10);
  if (!Number.isFinite(iterations)) return false;
  const salt = b64urlToBytes(parts[2]);
  const expected = b64urlToBytes(parts[3]);
  const actual = new Uint8Array(await deriveBits(password, salt, iterations));
  return timingSafeEqual(actual, expected);
}

// ── JWT (HS256) ───────────────────────────────────────────────
async function hmacSign(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return b64urlEncode(sig);
}

export interface SignInput {
  sub: string;
  email: string;
  role: Role;
  name: string;
  /** Email đã được Google xác thực? Quyết định quyền nhận đơn theo email. */
  emailVerified?: boolean;
}

export async function signJwt(input: SignInput, secret: string, expiresInSec = 60 * 60 * 24 * 7): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64urlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64urlEncode(JSON.stringify({ ...input, iat: now, exp: now + expiresInSec }));
  const signature = await hmacSign(`${header}.${payload}`, secret);
  return `${header}.${payload}.${signature}`;
}

export async function verifyJwt(token: string, secret: string): Promise<JwtPayload | null> {
  // Toàn bộ thân hàm nằm trong try: b64urlToBytes() ném lỗi khi gặp base64 rác
  // (ví dụ "a.b.c" hay "aaa.bbb.!!!"), khiến máy chủ trả 500 thay vì 401.
  // Token không hợp lệ luôn phải là "không được phép", không phải "lỗi hệ thống".
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;
    const expected = await hmacSign(`${header}.${payload}`, secret);
    if (!timingSafeEqual(b64urlToBytes(signature), b64urlToBytes(expected))) return null;
    const data = JSON.parse(dec.decode(b64urlToBytes(payload))) as JwtPayload;
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
}

// ── Role helpers ──────────────────────────────────────────────
export function isAdminEmail(email: string, env: Env): boolean {
  const list = (env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

// ── Hono middleware ───────────────────────────────────────────
type Ctx = Context<{ Bindings: Env; Variables: Variables }>;

function bearer(c: Ctx): string | null {
  const header = c.req.header('Authorization') || '';
  return header.startsWith('Bearer ') ? header.slice(7).trim() : null;
}

export async function requireAuth(c: Ctx, next: Next) {
  const token = bearer(c);
  if (!token) return c.json({ success: false, error: 'Yêu cầu đăng nhập.' }, 401);
  const payload = await verifyJwt(token, c.env.JWT_SECRET);
  if (!payload) return c.json({ success: false, error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' }, 401);
  c.set('user', payload);
  await next();
}

export async function requireAdmin(c: Ctx, next: Next) {
  const token = bearer(c);
  if (!token) return c.json({ success: false, error: 'Yêu cầu đăng nhập.' }, 401);
  const payload = await verifyJwt(token, c.env.JWT_SECRET);
  if (!payload) return c.json({ success: false, error: 'Phiên đăng nhập không hợp lệ.' }, 401);
  if (payload.role !== 'admin') return c.json({ success: false, error: 'Chỉ quản trị viên mới có quyền này.' }, 403);
  c.set('user', payload);
  await next();
}

/** Best-effort: attach user if a valid token is present, but never block. */
export async function optionalAuth(c: Ctx, next: Next) {
  const token = bearer(c);
  if (token) {
    const payload = await verifyJwt(token, c.env.JWT_SECRET);
    if (payload) c.set('user', payload);
  }
  await next();
}

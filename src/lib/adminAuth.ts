'use client';

/**
 * Token quản trị.
 *
 * KHÔNG nhúng token vào bundle (mọi biến NEXT_PUBLIC_* đều công khai với
 * bất kỳ ai xem mã nguồn trang). Admin tự dán token một lần, lưu ở
 * localStorage của máy mình, và gửi kèm mỗi request tới /api/admin/*.
 *
 * Token được đặt ở phía worker bằng:  npx wrangler secret put ADMIN_TOKEN
 */

const KEY = 'te2sr_admin_token';

export function getAdminToken(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(KEY) || '';
  } catch {
    return '';
  }
}

export function setAdminToken(token: string): void {
  try {
    if (token) localStorage.setItem(KEY, token.trim());
    else localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function clearAdminToken(): void {
  setAdminToken('');
}

/** Header Authorization cho các endpoint admin. */
export function adminHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = getAdminToken();
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
}

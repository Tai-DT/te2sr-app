// ══════════════════════════════════════════════════════════════
//  Typed API client for the TE2SR backend (Bearer-token auth)
// ══════════════════════════════════════════════════════════════

import type {
  AdminStats,
  DesignAnalysisReport,
  Order,
  OrderMessage,
  OrderStatus,
  Platform,
  ServiceType,
  User,
} from './types';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
const TOKEN_KEY = 'te2sr_token';

// ── Token storage ─────────────────────────────────────────────
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string): void {
  if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
}

// ── Error type ────────────────────────────────────────────────
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// ── Core request ──────────────────────────────────────────────
/** Ngưỡng chờ tối đa cho mỗi lời gọi API. */
const REQUEST_TIMEOUT_MS = 20_000;

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  // Không có timeout thì một request treo sẽ để giao diện quay vòng vĩnh viễn:
  // không báo lỗi, không có nút thử lại, khách chỉ thấy "đang tải" mãi mãi.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, signal: controller.signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Máy chủ phản hồi quá lâu. Vui lòng thử lại.', 0);
    }
    throw new ApiError('Không kết nối được máy chủ. Vui lòng kiểm tra kết nối mạng.', 0);
  } finally {
    clearTimeout(timer);
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok || (data && data.success === false)) {
    throw new ApiError((data && data.error) || `Yêu cầu thất bại (${res.status})`, res.status);
  }
  return data as T;
}

// ── Request payload shapes ────────────────────────────────────
export interface CreateOrderInput {
  appName: string;
  clientEmail: string;
  platform: Platform;
  serviceType: ServiceType;
  targetCountries: string[];
  testingUrl?: string;
  details?: string;
}

// ── API surface ───────────────────────────────────────────────
export const api = {
  // Auth
  register: (name: string, email: string, password: string) =>
    request<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  google: (credential: string) =>
    request<{ token: string; user: User }>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    }),
  me: () => request<{ user: User }>('/api/auth/me').then((d) => d.user),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ success: true }>('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  // Orders
  listOrders: () => request<{ orders: Order[] }>('/api/orders').then((d) => d.orders),
  createOrder: (input: CreateOrderInput) =>
    request<{ order: Order }>('/api/orders', { method: 'POST', body: JSON.stringify(input) }).then((d) => d.order),
  getOrder: (id: string) => request<{ order: Order }>(`/api/orders/${id}`).then((d) => d.order),
  updateOrderStatus: (id: string, status: OrderStatus) =>
    request<{ order: Order }>(`/api/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }).then((d) => d.order),
  updateOrderPayment: (id: string, field: 'paid_deposit' | 'paid_final', value: boolean) =>
    request<{ order: Order }>(`/api/orders/${id}/payment`, { method: 'PATCH', body: JSON.stringify({ field, value }) }).then((d) => d.order),
  setTesting: (id: string, action: 'start' | 'reset', startedAt?: string) =>
    request<{ order: Order }>(`/api/orders/${id}/testing`, { method: 'PATCH', body: JSON.stringify({ action, startedAt }) }).then((d) => d.order),

  // Messages
  listMessages: (orderId: string) => request<{ messages: OrderMessage[] }>(`/api/orders/${orderId}/messages`).then((d) => d.messages),
  sendMessage: (orderId: string, text: string) =>
    request<{ message: OrderMessage }>(`/api/orders/${orderId}/messages`, { method: 'POST', body: JSON.stringify({ text }) }).then((d) => d.message),

  // Design analysis
  analyzeDesign: (fileName: string) =>
    request<{ report: DesignAnalysisReport }>('/api/analyze-design', { method: 'POST', body: JSON.stringify({ fileName }) }).then((d) => d.report),
  listReports: () => request<{ reports: DesignAnalysisReport[] }>('/api/reports').then((d) => d.reports),

  // Admin
  adminStats: () => request<{ stats: AdminStats }>('/api/admin/stats').then((d) => d.stats),
};

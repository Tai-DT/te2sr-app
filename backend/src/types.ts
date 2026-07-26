// ══════════════════════════════════════════════════════════════
//  Shared domain + environment types for the TE2SR Worker (D1)
// ══════════════════════════════════════════════════════════════

/** Binding giới hạn tần suất của Cloudflare Workers. */
export interface RateLimiter {
  limit(opts: { key: string }): Promise<{ success: boolean }>;
}

export interface Env {
  DB: D1Database;
  /** Chặn dò mật khẩu trên các route đăng nhập/đăng ký. */
  RL_AUTH?: RateLimiter;
  /** Chặn spam tạo đơn (mỗi đơn kích hoạt gửi email). */
  RL_ORDER?: RateLimiter;
  /** HMAC secret for signing session JWTs (wrangler secret put JWT_SECRET). */
  JWT_SECRET: string;
  /** Google OAuth 2.0 web client id — validates id_token audience. */
  GOOGLE_CLIENT_ID?: string;
  /** Comma-separated emails auto-granted the admin role. */
  ADMIN_EMAILS?: string;
  /** Comma-separated allowed CORS origins, or `*`. */
  ALLOWED_ORIGINS?: string;
  /** Cloudflare Email Sending (optional transactional email). */
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_API_TOKEN?: string;
  MAIL_FROM?: string;
  MAIL_FROM_NAME?: string;
  MAIL_ADMIN?: string;
}

export type Role = 'client' | 'admin';
export type Platform = 'iOS' | 'Android' | 'Both';
export type ServiceType = 'Testing' | 'Publishing' | 'Promotion_5Star' | 'DesignAnalyzer' | 'WebDesign' | 'AppDevelopment' | 'AppSEO' | 'WebSEO' | 'PageManagement';
export type OrderStatus = 'Pending' | 'In Progress' | 'Completed' | 'Rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  authProvider: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string | null;
  appName: string;
  clientEmail: string;
  platform: Platform;
  serviceType: ServiceType;
  status: OrderStatus;
  targetCountries: string[];
  testingUrl: string | null;
  details: string;
  packagePrice: number | null;
  paidDeposit: boolean;
  paidFinal: boolean;
  testingStartedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderMessage {
  id: string;
  orderId: string;
  senderId: string | null;
  senderName: string;
  role: Role;
  text: string;
  createdAt: string;
}

export type SuggestionCategory =
  | 'Typography'
  | 'Layout & Spacing'
  | 'Color & Contrast'
  | 'Call To Action'
  | 'Store Guidelines';
export type SuggestionLevel = 'Critical' | 'Warning' | 'Recommendation';

export interface DesignSuggestion {
  category: SuggestionCategory;
  level: SuggestionLevel;
  title: string;
  description: string;
}

export interface DesignAnalysisReport {
  id: string;
  userId: string | null;
  fileName: string;
  score: number;
  layoutScore: number;
  typographyScore: number;
  contrastScore: number;
  accessibilityScore: number;
  suggestions: DesignSuggestion[];
  createdAt: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  name: string;
  /** true khi email đã được bên thứ ba xác thực (Google). Đăng ký bằng mật
   *  khẩu KHÔNG xác minh hộp thư nên luôn false — dùng cờ này để quyết định
   *  có được phép nhận đơn của khách vãng lai theo email hay không. */
  emailVerified?: boolean;
  iat: number;
  exp: number;
}

export interface Variables {
  user: JwtPayload;
}

// ══════════════════════════════════════════════════════════════
//  Shared domain types (mirror of the backend API contract)
// ══════════════════════════════════════════════════════════════

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

export interface AdminStats {
  totalOrders: number;
  byStatus: Record<string, number>;
  byService: Record<string, number>;
  totalUsers: number;
  estimatedRevenue: number;
}

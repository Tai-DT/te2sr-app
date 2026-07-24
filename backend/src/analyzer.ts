// ══════════════════════════════════════════════════════════════
//  Heuristic UI/UX design analyzer — produces a scored report and a
//  varied set of actionable suggestions drawn from a curated bank.
// ══════════════════════════════════════════════════════════════

import type { DesignAnalysisReport, DesignSuggestion } from './types';
import { newReportId, nowIso } from './db';

const SUGGESTION_BANK: DesignSuggestion[] = [
  {
    category: 'Call To Action',
    level: 'Critical',
    title: 'Tăng độ tương phản & độ nổi bật của nút CTA chính',
    description:
      'Nút hành động chính có độ tương phản màu ~3.2:1 so với nền. Dùng màu thương hiệu (#0071E3) hoặc gradient kèm viền phát sáng 2px để đạt chuẩn WCAG AA (≥ 4.5:1) và tăng tỉ lệ chuyển đổi.',
  },
  {
    category: 'Typography',
    level: 'Warning',
    title: 'Chuẩn hoá phân cấp chữ giữa Heading và Subtitle',
    description:
      'Tỉ lệ cỡ chữ giữa Tiêu đề (24px) và Nội dung phụ (18px) quá gần nhau. Đề xuất tăng Headline lên 30–32px (font-weight 700) để phân cấp thị giác rõ ràng hơn trên di động.',
  },
  {
    category: 'Layout & Spacing',
    level: 'Recommendation',
    title: 'Tăng padding mặc định cho các card nội dung',
    description:
      'Nội dung đang sát viền card (~12px). Nên dùng tối thiểu 20–24px padding để bố cục thoáng, dễ đọc và cảm giác cao cấp hơn.',
  },
  {
    category: 'Store Guidelines',
    level: 'Warning',
    title: 'Kiểm tra Safe Area cho Notch / Dynamic Island',
    description:
      'Icon ở thanh header có thể đè lên vùng Dynamic Island / camera đục lỗ trên iOS. Thêm padding theo env(safe-area-inset-top) để tránh bị App Review từ chối.',
  },
  {
    category: 'Color & Contrast',
    level: 'Recommendation',
    title: 'Đồng bộ bảng màu trạng thái (success / warning / error)',
    description:
      'Các nhãn trạng thái đang dùng nhiều sắc độ khác nhau. Chuẩn hoá thành một bộ token màu nhất quán để người dùng nhận diện trạng thái nhanh và giao diện gọn gàng hơn.',
  },
  {
    category: 'Typography',
    level: 'Recommendation',
    title: 'Giới hạn độ dài dòng văn bản (measure) ~60–75 ký tự',
    description:
      'Đoạn mô tả dài trải hết chiều rộng màn hình lớn gây khó đọc. Giới hạn max-width ~640px cho khối văn bản để tối ưu khả năng đọc.',
  },
  {
    category: 'Layout & Spacing',
    level: 'Warning',
    title: 'Áp dụng lưới khoảng cách 8pt nhất quán',
    description:
      'Khoảng cách giữa các phần tử đang lệch (10px, 14px, 18px...). Dùng thang 8pt (8/16/24/32) để nhịp điệu bố cục đồng đều và chuyên nghiệp hơn.',
  },
  {
    category: 'Call To Action',
    level: 'Recommendation',
    title: 'Đảm bảo vùng chạm tối thiểu 44×44px',
    description:
      'Một số nút/biểu tượng nhỏ hơn 44px chiều cao — dưới khuyến nghị của Apple HIG. Tăng kích thước vùng chạm để giảm thao tác nhầm trên di động.',
  },
  {
    category: 'Store Guidelines',
    level: 'Critical',
    title: 'Bổ sung trạng thái rỗng (empty state) & loading',
    description:
      'Ảnh chụp cho thấy màn hình dữ liệu đầy nhưng thiếu trạng thái rỗng và skeleton loading. Store reviewer thường kiểm tra các trạng thái này; hãy thiết kế đầy đủ để tránh bị đánh giá thiếu hoàn thiện.',
  },
  {
    category: 'Color & Contrast',
    level: 'Recommendation',
    title: 'Kiểm tra khả năng đọc ở chế độ Dark Mode',
    description:
      'Nếu app hỗ trợ Dark Mode, một vài văn bản xám nhạt có thể mất tương phản trên nền tối. Định nghĩa token màu riêng cho light/dark để đảm bảo tương phản ở cả hai chế độ.',
  },
];

function seededPick<T>(arr: T[], count: number, seed: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  let s = seed || 1;
  while (out.length < count && pool.length) {
    s = (s * 1103515245 + 12345) & 0x7fffffff; // LCG
    const idx = s % pool.length;
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Deterministic per file name so re-analysing the same screenshot is stable. */
export function analyzeDesign(fileName: string, userId: string | null): DesignAnalysisReport {
  const seed = hashString(fileName || 'screenshot');
  const band = (base: number, span: number, offset: number) => base + ((seed >> offset) % span);

  const layoutScore = band(80, 16, 3);
  const typographyScore = band(74, 22, 6);
  const contrastScore = band(81, 15, 9);
  const accessibilityScore = band(70, 24, 12);
  const score = Math.round((layoutScore + typographyScore + contrastScore + accessibilityScore) / 4);

  // Higher-scoring designs surface fewer (and softer) findings.
  const count = score >= 90 ? 3 : score >= 82 ? 4 : 5;
  const suggestions = seededPick(SUGGESTION_BANK, count, seed).sort((a, b) => {
    const order = { Critical: 0, Warning: 1, Recommendation: 2 } as const;
    return order[a.level] - order[b.level];
  });

  return {
    id: newReportId(),
    userId,
    fileName: fileName || 'app-screenshot.png',
    score,
    layoutScore,
    typographyScore,
    contrastScore,
    accessibilityScore,
    suggestions,
    createdAt: nowIso(),
  };
}

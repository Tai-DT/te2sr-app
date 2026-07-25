/**
 * Single source of truth for TE2SR service packages.
 * Used by: the pricing section, the shareable package pages (/goi/<slug>),
 * and the OrderModal payment step (to compute the 50% instalment).
 */

export type PackageSlug = 'google-play' | 'app-store' | 'ca-2-store' | 'doanh-nghiep';

export type ServiceType = 'Testing' | 'Publishing' | 'Promotion_5Star';

/** Nền tảng kỹ thuật của đơn (gửi lên backend). Gói doanh nghiệp mặc định 'Both'. */
export type Platform = 'iOS' | 'Android' | 'Both';

export interface ServicePackage {
  slug: PackageSlug;
  /** Canonical price in USD. null = "contact us" (Enterprise). */
  priceUsd: number | null;
  platform: Platform;
  /** true = gói báo giá riêng, không có giá niêm yết. */
  enterprise?: boolean;
  service: ServiceType;
  /** i18n keys — resolved through getTranslation() at render time. */
  labelKey: string;
  unitKey: string;
  btnKey: string;
  featureKeys: string[];
  featured?: boolean;
  /** Nhãn ngắn hiển thị trong dropdown chọn gói của form. */
  selectLabel: string;
  /**
   * Mốc thanh toán đợt 1 — KHÁC NHAU theo gói:
   *  - 'pay_when_testers': trả khi đã có đủ 12 testers chạy (gói có Google Play)
   *  - 'pay_when_upfront': trả trước để bắt đầu triển khai (gói không có mốc testers)
   */
  depositTriggerKey: 'pay_when_testers' | 'pay_when_upfront';
  /** Static metadata for the shareable landing page (Vietnamese — the SEO surface). */
  seo: {
    title: string;
    description: string;
    h1: string;
    intro: string;
    keywords: string[];
  };
}

export const PACKAGES: ServicePackage[] = [
  {
    slug: 'google-play',
    priceUsd: 50,
    platform: 'Android',
    service: 'Publishing',
    labelKey: 'price_gp_label',
    unitKey: 'price_gp_unit',
    btnKey: 'price_gp_btn',
    selectLabel: 'Gói Google Play ($50)',
    depositTriggerKey: 'pay_when_testers',
    featureKeys: [
      'price_gp_f1',
      'price_gp_f2',
      'price_gp_f3',
      'price_gp_f4',
      'price_gp_f5',
      'price_gp_f6',
    ],
    seo: {
      title: 'Gói đăng tải Google Play $50 — 12 testers 14 ngày | TE2SR',
      description:
        'Đăng tải app lên Google Play Console, cài 12 testers thực tế đủ 14 ngày closed testing, tặng 10 đánh giá 5★. Chỉ $50, thanh toán 2 đợt 50% – 50%, hoàn tiền 100% nếu không đạt.',
      h1: 'Gói đăng tải Google Play — $50',
      intro:
        'Google Play yêu cầu tài khoản cá nhân phải có tối thiểu 12 testers chạy closed testing liên tục 14 ngày trước khi được mở bán. TE2SR lo trọn khâu này: cài đủ 12 testers thực tế, giữ đủ 14 ngày, rồi đưa app lên Google Play Console.',
      keywords: [
        'đăng tải app lên google play',
        '12 testers 14 ngày',
        'closed testing google play',
        'thuê tester google play',
        'dịch vụ up app google play',
      ],
    },
  },
  {
    slug: 'app-store',
    priceUsd: 70,
    platform: 'iOS',
    service: 'Publishing',
    labelKey: 'price_as_label',
    unitKey: 'price_as_unit',
    btnKey: 'price_as_btn',
    selectLabel: 'Gói App Store ($70)',
    depositTriggerKey: 'pay_when_upfront',
    featureKeys: [
      'price_as_f1',
      'price_as_f2',
      'price_as_f3',
      'price_as_f4',
      'price_as_f5',
      'price_as_f6',
    ],
    seo: {
      title: 'Gói đăng tải App Store $70 — TestFlight & duyệt iOS | TE2SR',
      description:
        'Đăng tải app lên Apple App Store: cấu hình chứng chỉ & provisioning, phân phối TestFlight, tối ưu ASO, xử lý phản hồi App Review đến khi app live. $70 — trả trước 50% để bắt đầu, 50% còn lại khi app live.',
      h1: 'Gói đăng tải App Store — $70',
      intro:
        'Apple duyệt thủ công và từ chối rất nhiều app vì lỗi metadata, quyền riêng tư hoặc Human Interface Guidelines. TE2SR chuẩn bị chứng chỉ, phân phối TestFlight và xử lý trực tiếp phản hồi của App Review cho đến khi app chính thức lên App Store.',
      keywords: [
        'đăng tải app lên app store',
        'dịch vụ up app ios',
        'testflight ios',
        'apple app review',
        'đưa app lên app store',
      ],
    },
  },
  {
    slug: 'ca-2-store',
    priceUsd: 100,
    platform: 'Both',
    service: 'Publishing',
    labelKey: 'price_both_label',
    unitKey: 'price_both_unit',
    btnKey: 'price_both_btn',
    selectLabel: 'Gói cả 2 Store ($100)',
    depositTriggerKey: 'pay_when_testers',
    featured: true,
    featureKeys: [
      'price_both_f1',
      'price_both_f2',
      'price_both_f3',
      'price_both_f4',
      'price_both_f5',
      'price_both_f6',
      'price_both_f7',
    ],
    seo: {
      title: 'Gói cả 2 Store $100 — App Store & Google Play | TE2SR',
      description:
        'Đăng tải app lên cả App Store và Google Play: 12 testers Google Play (14 ngày) + TestFlight iOS, báo lỗi & crash log, tích hợp thanh toán, tặng 10 đánh giá 5★. $100, tiết kiệm $20 so với mua lẻ.',
      h1: 'Gói cả 2 Store — $100',
      intro:
        'Một lần làm, có mặt trên cả hai chợ ứng dụng lớn nhất — và rẻ hơn $20 so với mua lẻ hai gói. TE2SR xử lý song song closed testing 12 testers/14 ngày phía Google Play và TestFlight phía iOS, kèm báo cáo lỗi chi tiết trước khi nộp duyệt.',
      keywords: [
        'đăng app lên app store và google play',
        'dịch vụ đưa app lên store',
        'testflight ios',
        'publish app to app store service',
        'đưa app lên 2 store',
      ],
    },
  },
  {
    slug: 'doanh-nghiep',
    priceUsd: null,
    platform: 'Both',
    enterprise: true,
    service: 'Publishing',
    labelKey: 'price_ent_label',
    unitKey: 'price_ent_unit',
    btnKey: 'price_ent_btn',
    selectLabel: 'Gói doanh nghiệp / đa ứng dụng (liên hệ)',
    depositTriggerKey: 'pay_when_upfront',
    featureKeys: [
      'price_ent_f1',
      'price_ent_f2',
      'price_ent_f3',
      'price_ent_f4',
      'price_ent_f5',
      'price_ent_f6',
      'price_ent_f7',
    ],
    seo: {
      title: 'Gói doanh nghiệp — đăng tải số lượng lớn, NDA & SLA | TE2SR',
      description:
        'Đăng tải đa ứng dụng / số lượng lớn, trực tiếp sửa lỗi code & giao diện, kiểm tra UI/UX chuẩn Apple / Google, full test 20+ thiết bị thực tế, hợp đồng NDA & cam kết SLA. Liên hệ tư vấn 1-1.',
      h1: 'Gói doanh nghiệp — liên hệ báo giá',
      intro:
        'Dành cho studio và doanh nghiệp phát hành nhiều ứng dụng: quy trình riêng, kỹ sư phụ trách trực tiếp, hợp đồng bảo mật NDA và cam kết SLA theo khối lượng thực tế.',
      keywords: [
        'dịch vụ đăng app số lượng lớn',
        'thuê team publish app',
        'nda sla app publishing',
        'dịch vụ kiểm thử app doanh nghiệp',
      ],
    },
  },
];

export function getPackage(slug: string): ServicePackage | undefined {
  return PACKAGES.find((p) => p.slug === slug);
}

/** The first instalment (50%) a customer pays once testing is running. */
export function firstInstalmentUsd(pkg: ServicePackage): number | null {
  return pkg.priceUsd === null ? null : pkg.priceUsd / 2;
}

/** Gói mặc định khi mở form từ nút chung. */
export const DEFAULT_PACKAGE_SLUG: PackageSlug = 'ca-2-store';

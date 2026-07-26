/**
 * ════════════════════════════════════════════════════════════════
 *  Dữ liệu có cấu trúc (JSON-LD) — schema.org
 * ════════════════════════════════════════════════════════════════
 *
 *  Đây là thứ các công cụ tìm kiếm AI đọc để TRÍCH DẪN dịch vụ này: Google
 *  AI Overviews, ChatGPT Search, Perplexity, Claude. Khác với văn bản thường,
 *  JSON-LD nói thẳng "dịch vụ này giá bao nhiêu, gồm những gì" ở dạng máy đọc
 *  được, nên khả năng bị trích dẫn đúng cao hơn nhiều so với để máy tự đoán.
 *
 *  NGUYÊN TẮC: mọi con số ở đây phải khớp với thứ đang hiển thị cho khách.
 *  Khai giá $50 ở đây mà trang bán $70 thì Google coi là gài bẫy và có thể
 *  phạt. Khi đổi giá ở backend/src/index.ts (priceFor) thì phải sửa cả file này.
 */

const SITE = 'https://te2sr.com';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: 'TE2SR',
  alternateName: 'TE2SR — Testing to Store Release',
  url: SITE,
  logo: `${SITE}/og.png`,
  image: `${SITE}/og.png`,
  description:
    'Dịch vụ chạy đủ 12 tester trong 14 ngày theo yêu cầu closed testing của Google Play, đăng tải ứng dụng lên App Store và Google Play, kiểm thử website.',
  email: 'admin@te2sr.com',
  availableLanguage: ['vi', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'zh'],
  areaServed: { '@type': 'Place', name: 'Worldwide' },
};

/** Giá phải khớp priceFor() ở backend: Android 50, iOS 70, cả hai 100. */
export const servicesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE}/#services`,
  itemListElement: [
    {
      '@type': 'Service',
      name: 'Kiểm thử ứng dụng — 12 tester chạy đủ 14 ngày',
      description:
        'Chạy đủ số tester mà Google Play closed testing yêu cầu, trên thiết bị thật. Bàn giao báo cáo lỗi kèm ảnh chụp màn hình và các bước tái hiện.',
      serviceType: 'Mobile app QA testing',
      provider: { '@id': `${SITE}/#organization` },
      url: `${SITE}/services/testing`,
      offers: [
        { '@type': 'Offer', name: 'Google Play', price: '50', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'App Store', price: '70', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Cả hai Store', price: '100', priceCurrency: 'USD' },
      ],
    },
    {
      '@type': 'Service',
      name: 'Đăng tải ứng dụng lên App Store và Google Play',
      description:
        'Chuẩn bị hồ sơ, chứng chỉ, metadata ASO và xử lý phản hồi của bên duyệt cho tới khi ứng dụng lên Store.',
      serviceType: 'App store publishing',
      provider: { '@id': `${SITE}/#organization` },
      url: `${SITE}/services/publishing`,
      offers: [
        { '@type': 'Offer', name: 'Google Play', price: '50', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'App Store', price: '70', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Cả hai Store', price: '100', priceCurrency: 'USD' },
      ],
    },
    {
      '@type': 'Service',
      name: 'Kiểm thử website',
      description:
        'Đi hết mọi luồng của website như khách hàng thật, kiểm tra trên Chrome, Safari, Firefox, Edge ở điện thoại và máy tính, đo Core Web Vitals, rà lỗi bảo mật cơ bản.',
      serviceType: 'Website QA testing',
      provider: { '@id': `${SITE}/#organization` },
      url: SITE,
    },
  ],
};

/**
 * Câu hỏi thường gặp. Đây là phần công cụ AI trích dẫn nhiều nhất, vì mỗi
 * mục là một cặp hỏi–đáp gọn, tự đứng được. Câu trả lời phải là dữ kiện
 * kiểm chứng được, không phải lời quảng cáo.
 */
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${SITE}/#faq`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Google Play closed testing yêu cầu những gì?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Với tài khoản nhà phát triển cá nhân, Google Play yêu cầu chạy closed testing với ít nhất 12 tester tham gia liên tục trong 14 ngày trước khi được phép phát hành công khai. Tester phải là tài khoản Google thật và phải cài ứng dụng trong suốt thời gian đó.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kiểm thử ứng dụng ở TE2SR mất bao lâu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tối thiểu 14 ngày, vì đó là thời gian Google Play bắt buộc. Đồng hồ đếm bắt đầu khi tester đầu tiên cài ứng dụng, và khách theo dõi được số ngày còn lại trong cổng khách hàng.',
      },
    },
    {
      '@type': 'Question',
      name: 'Chi phí bao nhiêu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Google Play 50 USD, App Store 70 USD, làm cả hai Store 100 USD. Các dịch vụ thiết kế website, lập trình ứng dụng, SEO và quản lý page báo giá theo yêu cầu sau khi trao đổi.',
      },
    },
    {
      '@type': 'Question',
      name: 'Thanh toán như thế nào?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chia hai đợt: 50% để bắt đầu và 50% khi ứng dụng đã lên Store. Nhận chuyển khoản ngân hàng qua mã QR hoặc Binance Pay cho khách quốc tế.',
      },
    },
    {
      '@type': 'Question',
      name: 'Khi nào được hoàn tiền?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hoàn tiền 100% nếu Google báo lỗi vì tester phía TE2SR không chạy đủ 12 người trong 14 ngày.',
      },
    },
    {
      '@type': 'Question',
      name: 'Có nhận ứng dụng loại nào cũng làm không?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Không. TE2SR không nhận ứng dụng lừa đảo hoặc cờ bạc.',
      },
    },
  ],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: SITE,
  name: 'TE2SR',
  publisher: { '@id': `${SITE}/#organization` },
  inLanguage: ['vi', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'zh'],
};

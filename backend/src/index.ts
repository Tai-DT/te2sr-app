import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('*', cors());

export interface Order {
  id: string;
  appName: string;
  platform: 'iOS' | 'Android' | 'Both';
  serviceType: 'Testing' | 'Publishing' | 'Promotion_5Star' | 'DesignAnalyzer';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Rejected';
  createdAt: string;
  clientEmail: string;
  targetCountries: string[];
  details: string;
}

export interface DesignAnalysisReport {
  id: string;
  fileName: string;
  score: number;
  layoutScore: number;
  typographyScore: number;
  contrastScore: number;
  accessibilityScore: number;
  suggestions: {
    category: 'Typography' | 'Layout & Spacing' | 'Color & Contrast' | 'Call To Action' | 'Store Guidelines';
    level: 'Critical' | 'Warning' | 'Recommendation';
    title: string;
    description: string;
  }[];
  createdAt: string;
}

const orders: Order[] = [
  {
    id: 'ORD-8921',
    appName: 'CryptoPulse Trading Pro',
    platform: 'Both',
    serviceType: 'Publishing',
    status: 'In Progress',
    createdAt: '2026-07-22',
    clientEmail: 'dev@cryptopulse.io',
    targetCountries: ['USA', 'Vietnam', 'Japan'],
    details: 'Full publishing setup for iOS App Store and Google Play with ASO metadata optimization.',
  },
  {
    id: 'ORD-8922',
    appName: 'ZenFit Yoga & Meditate',
    platform: 'iOS',
    serviceType: 'Promotion_5Star',
    status: 'In Progress',
    createdAt: '2026-07-21',
    clientEmail: 'support@zenfitapp.com',
    targetCountries: ['Korea', 'USA', 'Germany'],
    details: '5,000 keyword downloads + 500 localized 5-star reviews campaign.',
  },
  {
    id: 'ORD-8923',
    appName: 'SpeedyDelivery Partner',
    platform: 'Android',
    serviceType: 'Testing',
    status: 'Completed',
    createdAt: '2026-07-19',
    clientEmail: 'qa@speedydelivery.vn',
    targetCountries: ['Vietnam'],
    details: '20-device internal tester coverage & crash profiling report generated.',
  },
  {
    id: 'ORD-8924',
    appName: 'Artisan Photo Studio AI',
    platform: 'Both',
    serviceType: 'DesignAnalyzer',
    status: 'Completed',
    createdAt: '2026-07-18',
    clientEmail: 'design@artisanphoto.com',
    targetCountries: ['Worldwide'],
    details: 'Automated AI UI/UX visual inspection & Apple HIG compliance check.',
  },
];

app.get('/health', (c) => c.json({ status: 'ok', service: 'Cloudflare Workers Backend' }));

app.get('/api/services', (c) => {
  return c.json({ success: true, orders });
});

app.post('/api/services', async (c) => {
  try {
    const body = await c.req.json();
    const { appName, clientEmail, platform, serviceType, targetCountries, details } = body;

    if (!appName || !clientEmail) {
      return c.json({ success: false, error: 'App name and client email are required.' }, 400);
    }

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      appName,
      clientEmail,
      platform: platform || 'Both',
      serviceType: serviceType || 'Testing',
      targetCountries: targetCountries || ['Worldwide'],
      details: details || '',
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    orders.unshift(newOrder);
    return c.json({ success: true, order: newOrder });
  } catch (err) {
    return c.json({ success: false, error: 'Failed to create order.' }, 500);
  }
});

app.patch('/api/admin/orders', async (c) => {
  try {
    const body = await c.req.json();
    const { orderId, status } = body;

    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      return c.json({ success: false, error: 'Order not found' }, 404);
    }

    order.status = status;
    return c.json({ success: true, order });
  } catch (err) {
    return c.json({ success: false, error: 'Failed to update order' }, 500);
  }
});

app.post('/api/analyze-design', async (c) => {
  try {
    const body = await c.req.json();
    const fileName = body.fileName || 'app-screenshot.png';

    const report: DesignAnalysisReport = {
      id: `RPT-${Math.floor(100000 + Math.random() * 900000)}`,
      fileName,
      score: Math.floor(78 + Math.random() * 18),
      layoutScore: Math.floor(80 + Math.random() * 15),
      typographyScore: Math.floor(75 + Math.random() * 20),
      contrastScore: Math.floor(82 + Math.random() * 14),
      accessibilityScore: Math.floor(72 + Math.random() * 22),
      createdAt: new Date().toISOString(),
      suggestions: [
        {
          category: 'Call To Action',
          level: 'Critical',
          title: 'Thắt chặt khoảng cách và tăng độ nổi bật nút CTA (Button Prominence)',
          description: 'Nút "Bắt đầu" có độ tương phản màu 3.2:1 so với nền kính glassmorphic. Khuyên dùng màu Neon Blue (#00D2FF) hoặc gradient với viền phát sáng 2px để đáp ứng tiêu chuẩn WCAG AAA (>= 4.5:1).',
        },
        {
          category: 'Typography',
          level: 'Warning',
          title: 'Chuẩn hóa Hierarchy chữ giữa Heading và Subtitle',
          description: 'Tỷ lệ cỡ chữ giữa Tiêu đề chính (24px) và Nội dung phụ (18px) quá gần nhau. Đề xuất tăng font Montserrat của Headline lên 32px (font-weight 700) để phân cấp thị giác rõ ràng hơn trên di động.',
        },
        {
          category: 'Layout & Spacing',
          level: 'Recommendation',
          title: 'Tăng Padding mặt định các Card Glassmorphism',
          description: 'Nội dung thẻ dịch vụ sát viền kính (12px padding). Theo chuẩn Stitch Lumina Nexus, card glassmorphism nên dùng tối thiểu 24px - 32px padding để giao diện thoáng đạt, sang trọng.',
        },
        {
          category: 'Store Guidelines',
          level: 'Warning',
          title: 'Kiểm tra tỷ lệ Màn hình đục lỗ (Notch & Safe Area Padding)',
          description: 'Các icon ở thanh header đang đè lên vị trí Dynamic Island / Camera đục lỗ trên iOS. Cần thêm safe-area-inset-top: env(safe-area-inset-top) để tránh bị từ chối khi duyệt trên App Store.',
        },
        {
          category: 'Color & Contrast',
          level: 'Recommendation',
          title: 'Bổ sung hiệu ứng Ambient Glow cho các chỉ số quan trọng',
          description: 'Các tag trạng thái và chỉ số đánh giá 5 sao sẽ sống động hơn khi kết hợp cùng lớp nền mờ drop-shadow(0 0 12px #00D2FF40).',
        },
      ],
    };

    return c.json({ success: true, report });
  } catch (err) {
    return c.json({ success: false, error: 'Failed to analyze design.' }, 500);
  }
});

export default app;

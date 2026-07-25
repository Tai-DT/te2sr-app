/**
 * ════════════════════════════════════════════════════════════════
 *  TE2SR — CẤU HÌNH THANH TOÁN  (SỬA DUY NHẤT Ở FILE NÀY)
 * ════════════════════════════════════════════════════════════════
 *
 *  CÒN 1 VIỆC CẦN LÀM THỦ CÔNG:
 *  → Lưu ảnh QR VietQR vào:  public/payment/qr-bank.png
 *    Đường dẫn đã khai báo sẵn bên dưới. Nếu file chưa tồn tại, giao diện
 *    tự ẩn phần ảnh và vẫn hiện đầy đủ số tài khoản để khách chuyển tay.
 *
 *  Trường nào để chuỗi rỗng '' thì tự động bị ẩn — không bao giờ
 *  hiển thị thông tin sai cho khách hàng.
 */

export interface PaymentMethod {
  id: 'qr' | 'binance';
  /** Tên hiển thị */
  label: string;
  /** Mô tả ngắn dưới tên */
  hint: string;
  /** Đường dẫn ảnh QR trong /public. Để '' nếu chưa có. */
  qrImage: string;
  /** Các dòng thông tin hiển thị kèm (nhãn → giá trị). Giá trị '' sẽ bị ẩn. */
  fields: { label: string; value: string; mono?: boolean }[];
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'qr',
    label: 'Chuyển khoản qua mã QR',
    hint: 'Quét bằng app ngân hàng bất kỳ (VietQR / Napas 247)',
    qrImage: '/payment/qr-bank.png',
    fields: [
      { label: 'Ngân hàng', value: 'Timo Digital Bank by BVBank' },
      { label: 'Số tài khoản', value: '0386830040', mono: true },
      { label: 'Chủ tài khoản', value: 'DO TAI' },
    ],
  },
  {
    id: 'binance',
    label: 'Binance Pay',
    // Binance Pay là chuyển NỘI BỘ giữa 2 tài khoản Binance — không cần chọn
    // mạng lưới on-chain. Nếu sau này muốn nhận USDT on-chain, hãy thêm một
    // phương thức RIÊNG kèm ĐỊA CHỈ VÍ (address) + mạng, không dùng chung Pay ID.
    hint: 'Chuyển nội bộ Binance — nhận tức thì, không mất phí mạng. Dành cho khách quốc tế.',
    qrImage: '',
    fields: [
      { label: 'Binance Pay ID', value: '1034764929', mono: true },
      { label: 'Tên tài khoản', value: 'DO TAI' },
    ],
  },
];

/**
 * Tỷ giá quy đổi USD → VND để hiển thị số tiền tham khảo cho khách Việt Nam.
 * Để `null` nếu muốn chỉ hiện USD (an toàn nhất, không bao giờ lệch tỷ giá).
 */
export const USD_TO_VND: number | null = null;

/** Thời gian đối soát thủ công cam kết với khách. */
export const CONFIRM_WINDOW = '15 phút';

/** Một phương thức được coi là "đã cấu hình" khi có QR hoặc ít nhất 1 field có giá trị. */
export function isConfigured(m: PaymentMethod): boolean {
  return Boolean(m.qrImage) || m.fields.some((f) => f.value.trim() !== '');
}

/** Có ít nhất một phương thức đã sẵn sàng hiển thị cho khách? */
export function hasAnyPaymentConfigured(): boolean {
  return PAYMENT_METHODS.some(isConfigured);
}

export function formatUsd(amount: number): string {
  return `$${amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2)}`;
}

export function formatVnd(usd: number): string | null {
  if (!USD_TO_VND) return null;
  return `${Math.round(usd * USD_TO_VND).toLocaleString('vi-VN')}₫`;
}

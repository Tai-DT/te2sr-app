import type { PackageSlug } from './packages';

export interface Faq {
  q: string;
  a: string;
}

/**
 * FAQ per package. Rendered on /goi/<slug> AND emitted as FAQPage JSON-LD,
 * so both must read from this single source.
 */
export const PACKAGE_FAQS: Record<PackageSlug, Faq[]> = {
  'google-play': [
    {
      q: 'Vì sao Google Play bắt buộc 12 testers trong 14 ngày?',
      a: 'Từ năm 2023, tài khoản Google Play cá nhân mới phải chạy closed testing với tối thiểu 12 testers tham gia liên tục 14 ngày trước khi được phép mở bán công khai. Nếu số tester tụt xuống dưới 12 giữa chừng, đồng hồ 14 ngày sẽ bị đặt lại từ đầu.',
    },
    {
      q: 'Tôi cần chuẩn bị gì trước khi bắt đầu?',
      a: 'Bạn chỉ cần thêm Google Group te2sr@googlegroups.com vào mục Closed Testing trong Google Play Console, rồi gửi Link Kiểm Thử (Opt-in URL) cho chúng tôi. Phần còn lại TE2SR lo trọn.',
    },
    {
      q: 'Thanh toán như thế nào?',
      a: 'Chia 2 đợt: 50% khi đã cài đủ 12 testers và bắt đầu đếm 14 ngày, 50% còn lại khi app chính thức lên Store. Hoàn tiền 100% nếu không đạt cam kết.',
    },
  ],
  'app-store': [
    {
      q: 'Tôi có cần tài khoản Apple Developer riêng không?',
      a: 'Có. Apple bắt buộc app phải nộp từ tài khoản Apple Developer của chủ sở hữu (phí 99 USD/năm trả trực tiếp cho Apple, không bao gồm trong giá gói). TE2SR hỗ trợ bạn cấu hình chứng chỉ, provisioning profile và signing key trên tài khoản đó.',
    },
    {
      q: 'App Store có yêu cầu 12 testers như Google Play không?',
      a: 'Không. Yêu cầu 12 testers trong 14 ngày là quy định riêng của Google Play cho tài khoản cá nhân. Phía Apple không có mốc bắt buộc này, nhưng chúng tôi vẫn phân phối qua TestFlight để phát hiện lỗi trước khi nộp duyệt.',
    },
    {
      q: 'Nếu Apple từ chối app thì sao?',
      a: 'Chúng tôi xử lý trực tiếp phản hồi của App Review và nộp lại cho đến khi app được duyệt — không tính thêm phí cho các lần nộp lại. Nếu app không thể lên Store vì lý do thuộc về chúng tôi, bạn được hoàn tiền 100%.',
    },
    {
      q: 'Thanh toán thế nào?',
      a: 'Chia 2 đợt: trả trước $35 để chúng tôi bắt đầu triển khai (chuẩn bị chứng chỉ, phân phối TestFlight), $35 còn lại khi app chính thức lên App Store. Gói App Store không có mốc 12 testers như Google Play nên đợt 1 thu trước khi làm.',
    },
  ],
  'ca-2-store': [
    {
      q: 'Gói này khác gói Google Play ở điểm nào?',
      a: 'Ngoài toàn bộ quy trình closed testing 12 testers/14 ngày của Google Play, gói này còn xử lý cả phía iOS: phân phối TestFlight, chuẩn bị chứng chỉ Apple, nộp duyệt App Store, kèm báo lỗi và phân tích crash log chi tiết.',
    },
    {
      q: 'Tôi có cần sẵn tài khoản Apple Developer không?',
      a: 'Có. Bạn cần tài khoản Apple Developer (phí 99 USD/năm trả cho Apple) và tài khoản Google Play Console. TE2SR hỗ trợ cấu hình chứng chỉ, provisioning profile và signing key.',
    },
    {
      q: 'Mất bao lâu để app lên Store?',
      a: 'Phía Google Play tối thiểu 14 ngày do quy định closed testing. Phía iOS thường 1–3 ngày duyệt sau khi nộp. Chúng tôi chạy song song hai phía để rút ngắn tổng thời gian.',
    },
  ],
  'doanh-nghiep': [
    {
      q: 'Gói doanh nghiệp phù hợp với ai?',
      a: 'Studio và doanh nghiệp phát hành nhiều ứng dụng cùng lúc, cần kỹ sư phụ trách riêng, sửa lỗi code và giao diện trực tiếp, có ràng buộc pháp lý NDA và cam kết SLA.',
    },
    {
      q: 'Báo giá dựa trên những yếu tố nào?',
      a: 'Dựa trên số lượng ứng dụng, mức độ can thiệp kỹ thuật (chỉ đăng tải hay bao gồm sửa code), số thiết bị test thực tế và cam kết SLA. Liên hệ để nhận báo giá trong 24 giờ.',
    },
    {
      q: 'Có ký hợp đồng bảo mật không?',
      a: 'Có. Chúng tôi ký NDA trước khi tiếp nhận mã nguồn hoặc tài khoản developer, và cam kết SLA theo khối lượng thực tế.',
    },
  ],
};

/** FAQ cho trang hướng dẫn closed testing — cũng dùng làm FAQPage JSON-LD. */
export const CLOSED_TESTING_FAQS: Faq[] = [
  {
    q: 'Google Play yêu cầu bao nhiêu tester và trong bao lâu?',
    a: 'Tối thiểu 12 tester opt-in liên tục trong 14 ngày. Google đếm số tester đang tham gia test tại mọi thời điểm, không phải tổng số lượt cài đặt. Yêu cầu này áp dụng cho tài khoản cá nhân (personal) đăng ký từ 13/11/2023.',
  },
  {
    q: 'Vì sao đồng hồ 14 ngày của tôi bị đặt lại?',
    a: 'Phổ biến nhất là số tester đang opt-in tụt xuống dưới 12 — có người rời nhóm hoặc bấm "Leave the test". Ngoài ra, tạm dừng track closed testing, gỡ bản phát hành, hoặc chuyển sang track khác giữa chừng cũng khiến bộ đếm quay lại từ đầu.',
  },
  {
    q: 'Tester cài file APK gửi tay có được tính không?',
    a: 'Không. Tester bắt buộc phải mở link kiểm thử (opt-in URL), bấm "Become a tester" rồi cài app từ Google Play. Cài APK ngoài luồng không được Google ghi nhận.',
  },
  {
    q: 'Tài khoản tổ chức có phải chạy closed testing 12 tester không?',
    a: 'Không. Yêu cầu này chỉ áp dụng cho tài khoản cá nhân. Tài khoản tổ chức (organization) đã xác minh doanh nghiệp được nộp thẳng lên production.',
  },
  {
    q: 'Sau 14 ngày thì làm gì tiếp theo?',
    a: 'Mục Production access trong Play Console sẽ mở. Bạn điền bảng câu hỏi về quá trình test — đã thu được phản hồi gì, thay đổi gì trong app — rồi nộp. Google thường phản hồi trong vài ngày đến 1–2 tuần.',
  },
  {
    q: 'TE2SR làm giúp phần nào?',
    a: 'Chúng tôi cung cấp đội tester thật, opt-in đúng qua link kiểm thử của bạn và giữ liên tục đủ 14 ngày, sau đó hỗ trợ đưa app lên Google Play Console. Bạn chỉ cần thêm Google Group te2sr@googlegroups.com vào track và gửi link kiểm thử.',
  },
];

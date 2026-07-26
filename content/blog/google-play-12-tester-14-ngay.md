---
title: "Google Play bắt 12 tester chạy 14 ngày — quy định thật sự là gì"
description: "Không phải 20 tester như nhiều bài hướng dẫn cũ vẫn ghi. Bài này nói rõ Google yêu cầu gì, mốc 14 ngày tính từ lúc nào, và những chỗ khiến nhiều người phải làm lại từ đầu."
date: "2026-07-26"
tags: ["Google Play", "Closed testing"]
cover: "/blog/01-playconsole-du-3-dieu-kien.jpg"
---

Nếu bạn mở tài khoản nhà phát triển Google Play bằng tư cách cá nhân sau tháng 11/2023, bạn không thể phát hành app công khai ngay. Google bắt phải chạy một đợt **closed testing** đạt chuẩn trước đã.

Phần lớn bài hướng dẫn trên mạng vẫn ghi **20 tester**. Con số đó **đã cũ**. Google hạ xuống 12 từ tháng 12/2024, sau khi nhiều nhà phát triển cá nhân phản ánh 20 người là quá sức.

## Google yêu cầu đúng ba điều

Đây là màn hình thật trong Google Play Console, ở mục xin quyền phát hành công khai:

![Ba điều kiện trong Google Play Console](/blog/01-playconsole-du-3-dieu-kien.jpg)
*Cả ba dòng đều đã gạch ngang — đợt kiểm thử này đạt chuẩn.*

Dịch ra tiếng Việt, ba điều kiện là:

1. **Phát hành một bản closed testing** — không phải internal testing. Hai thứ này khác nhau, và chọn nhầm là không tính.
2. **Có ít nhất 12 tester đã bấm tham gia** — họ phải nhấn vào link mời và chấp nhận, chứ không chỉ được thêm email vào danh sách.
3. **Chạy đợt kiểm thử với ít nhất 12 tester trong 14 ngày** — liên tục.

## Chỗ khiến nhiều người phải làm lại

Để ý kỹ dòng thứ ba trong ảnh: *"for 14 more days **starting from the review date**"* — 14 ngày tính **từ ngày Google duyệt bản closed testing**, không phải từ ngày bạn tải file lên.

Đây là chỗ hay bị nhầm nhất. Bạn tải bản build lên hôm nay, Google duyệt sau 2 ngày, thì đồng hồ mới bắt đầu chạy từ ngày thứ hai đó. Ai đếm từ ngày tải lên sẽ tưởng đủ 14 ngày trong khi thực tế mới được 12.

Ba điểm nữa dễ trượt:

- **Tester phải giữ app cài trong máy suốt 14 ngày.** Ai gỡ giữa chừng là số lượng tụt xuống dưới 12, và Google tính lại.
- **Phải là tài khoản Google thật, khác nhau.** Tạo 12 email mới tinh rồi bấm tham gia là kiểu Google phát hiện được.
- **Đủ 12 người tham gia, không phải 12 lời mời.** Gửi 12 lời mời mà chỉ 9 người bấm thì bạn đang có 9.

## Sau khi đủ điều kiện thì thế nào

Nút **Apply for production** sáng lên. Bạn điền một bản khảo sát ngắn về đợt kiểm thử — Google hỏi bạn đã học được gì, sửa những gì từ phản hồi của tester. Trả lời qua loa ở bước này cũng có thể bị từ chối.

Duyệt xong, Play Console báo như sau:

![Thông báo được cấp quyền phát hành công khai](/blog/02-playconsole-duoc-cap-quyen-phat-hanh.jpg)
*"Ứng dụng của bạn đã được cấp quyền phát hành công khai trên Google Play."*

Từ lúc này app mới ra được kênh phát hành chính thức và chọn quốc gia phát hành:

![Phát hành công khai và mở thêm quốc gia](/blog/03-phat-hanh-3-quoc-gia.jpg)
*Bản phát hành đầy đủ, mở thêm Indonesia, Malaysia và Việt Nam.*

## Tóm lại

| Câu hỏi | Trả lời |
|---|---|
| Bao nhiêu tester? | 12 (không còn là 20) |
| Bao nhiêu ngày? | 14 ngày liên tục |
| Tính từ khi nào? | Từ ngày Google duyệt bản closed testing |
| Loại kiểm thử nào? | Closed testing — không phải internal |
| Ai phải làm? | Tài khoản nhà phát triển **cá nhân** mở sau 11/2023 |

Tài khoản dạng tổ chức (organization) không bị áp yêu cầu này.

## Tự làm hay thuê ngoài

Tự làm được, nếu bạn gom đủ 12 người thật chịu giữ app trong máy hai tuần và thỉnh thoảng mở ra dùng. Cái khó không nằm ở kỹ thuật mà ở chỗ **giữ đủ người trong đủ thời gian** — chỉ cần vài người gỡ app giữa chừng là hỏng cả đợt, và bạn mất thêm hai tuần nữa.

Nếu không gom đủ người, hoặc đã trượt một lần và không muốn mất thêm 14 ngày, đó là lúc thuê ngoài đáng tiền.

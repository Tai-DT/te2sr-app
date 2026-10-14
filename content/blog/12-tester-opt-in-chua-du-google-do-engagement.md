---
title: "12 tester bấm tham gia chưa đủ — Google còn đo engagement"
description: "Nhiều dev đủ 12 tester opt-in, đủ 14 ngày, vẫn bị Google bắt test tiếp. Nguyên nhân nằm ở hai chữ ít ai để ý: tester engagement. Bài này nói rõ Google đo gì và làm sao để đợt test của bạn được tính."
date: "2026-10-14"
tags: ["Google Play", "Closed testing"]
cover: "/blog/02-playconsole-duoc-cap-quyen-phat-hanh.jpg"
---

Bạn đã có 12 người bấm opt-in, đợt test chạy đủ 14 ngày — nhưng khi xin quyền phát hành, Google vẫn trả lời "cần test tiếp". Đây là trường hợp phổ biến nhất khiến người mới bối rối, vì nhìn màn hình Console thì mọi chỉ số đều "đủ".

## Google đếm theo TỪNG tester, không phải con số tổng

Điểm dễ hiểu nhầm nhất: yêu cầu là **mỗi tester phải opt-in liên tục 14 ngày**, và điều này được kiểm tra **tại thời điểm bạn nộp đơn xin production**, không phải tại lúc họ bấm tham gia.

- Tester opt-in, test vài ngày rồi opt-out → **không được tính**.
- Tester opt-out rồi opt-in lại → 14 ngày tính lại **từ đầu**, phải liên tục.
- Lúc nộp đơn mà dưới 12 người đang opt-in → bị bắt test tiếp.

Vậy nên "có 12 email bấm join từ ngày đầu" chưa chắc đã đủ — phải còn đủ 12 người **đang** opt-in với chuỗi 14 ngày liền nhau vào ngày nộp.

## Chữ "engagement" — cái bẫy thầm lặng

Trong tài liệu chính thức, Google nêu hai lý do có thể bắt bạn test tiếp: thiếu 12 tester opt-in **và** *"insufficient tester engagement during the testing period"*. Không có con số cụ thể nào được công bố — nhưng thực tế cho thấy đợt test chỉ có 12 máy cài xong rồi bỏ đó, không mở app, không phiên sử dụng nào, rất dễ bị đánh giá là thiếu engagement.

Điều này cũng là lý do các dịch vụ "bán lượt cài" rẻ tiền thường thất bại: tester cài cho có rồi xoá, không tạo ra dữ liệu sử dụng thật nào cho Google đo.

## Làm sao để đợt test "được tính" ngay lần đầu

1. **Dư tester:** nhắm 15–18 người thay vì đúng 12 — đề phòng vài người opt-out giữa đường.
2. **Tester thật, dùng thật:** người tham gia phải mở app, dùng tính năng chính, để lại crash-free session. Một nhóm Google Group kín thôi không tạo ra engagement.
3. **Nhắc lịch:** hướng dẫn tester mở app mỗi vài ngày trong suốt 14 ngày; app có notification thì dùng nó để kéo họ quay lại.
4. **Update build giữa đợt test:** Google khuyến khích — sửa bug và đẩy bản mới trong lúc chạy test, đồng thời cho tester có lý do mở app lại.
5. **Kiểm tra ngay trước khi nộp:** vào danh sách tester xác nhận đủ 12 người đang opt-in rồi hãy bấm xin production.

Nếu bạn không tự lo được 12–18 người thật sự dùng app trong 14 ngày, đó chính xác là việc TE2SR làm hằng ngày — [gửi yêu cầu tư vấn](/#services) và kỹ sư sẽ liên hệ trong 24 giờ.

Nguồn tham khảo: Play Console Help — *App testing requirements for new personal developer accounts*.

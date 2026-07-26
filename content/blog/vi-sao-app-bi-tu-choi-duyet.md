---
title: "Vì sao app bị từ chối duyệt — 7 lý do hay gặp và cách xử lý"
description: "Google Play và App Store từ chối app vì những lý do khá cụ thể, và phần lớn sửa được trong một buổi. Bài này liệt kê 7 lý do gặp nhiều nhất kèm cách xử lý từng cái."
date: "2026-07-26"
tags: ["Google Play", "App Store", "Duyệt app"]
cover: "/blog/04-playconsole-tong-quan.jpg"
---

App bị từ chối không có nghĩa là app tệ. Phần lớn trường hợp là thiếu một giấy tờ, một dòng mô tả, hoặc một khai báo — sửa xong nộp lại là qua.

Dưới đây là 7 lý do gặp nhiều nhất, xếp theo mức độ phổ biến.

## 1. Thiếu chính sách quyền riêng tư, hoặc link hỏng

Đây là lý do bị từ chối nhiều nhất, và cũng dễ sửa nhất.

Cả hai store đều bắt buộc có link tới chính sách quyền riêng tư, và link đó phải:

- Mở được công khai, **không cần đăng nhập**
- Trỏ tới một trang thật, không phải file Google Docs đặt ở chế độ riêng tư
- Nội dung phải khớp với thứ app thật sự thu thập

Nhiều người dán link vào rồi quên kiểm tra lại. Người duyệt bấm vào thấy lỗi 404 là từ chối ngay.

## 2. Khai báo an toàn dữ liệu không khớp với thực tế

Google Play bắt khai **Data safety**, Apple bắt khai **App Privacy**. Đây là bảng kê app của bạn thu thập dữ liệu gì.

Chỗ hay sai: bạn khai "không thu thập gì", nhưng app có tích hợp Firebase Analytics, Facebook SDK hay AdMob — những thứ đó **có** thu thập. Hệ thống tự động của Google đối chiếu được, và khai sai bị coi là vi phạm nghiêm trọng chứ không chỉ là thiếu sót.

Cách xử lý: liệt kê hết thư viện bên thứ ba trong app, tra tài liệu từng cái xem nó thu gì, rồi khai đúng.

## 3. Ảnh chụp màn hình không đúng nội dung app

Ảnh trên store phải là màn hình thật của app. Bị từ chối khi:

- Ảnh dựng bằng công cụ mô phỏng, thể hiện tính năng app không có
- Ảnh có khung viền điện thoại kèm chữ quảng cáo che gần hết màn hình
- Ảnh lấy từ app khác

Apple soi chuyện này kỹ hơn Google.

## 4. Đăng nhập bắt buộc mà không cho tài khoản dùng thử

Nếu app bắt đăng nhập mới dùng được, bạn **phải** cung cấp tài khoản thử cho người duyệt. Không có thì họ không vào được, và họ từ chối.

Với Apple, điền vào mục **App Review Information → Sign-In Required**. Với Google, ghi trong phần hướng dẫn cho người duyệt.

Lưu ý: tài khoản đó phải còn hoạt động lúc họ duyệt. Tài khoản thử hết hạn sau vài ngày là lý do bị từ chối rất hay gặp mà ít ai nghĩ tới.

## 5. Nội dung mô tả nhồi từ khoá

Viết mô tả kiểu *"app chỉnh ảnh, sửa ảnh, làm đẹp ảnh, photo editor, chỉnh sửa hình, app ảnh đẹp nhất"* là dấu hiệu bị đánh dấu.

Cả hai store đều cấm nhồi từ khoá. Mô tả phải đọc như câu văn bình thường cho người đọc.

## 6. Chức năng quá mỏng

Apple từ chối app mà họ cho là *"minimum functionality"* — app chỉ bọc một website, hoặc chỉ có vài màn hình tĩnh.

Nếu app của bạn về bản chất là hiển thị nội dung web, hãy bổ sung thứ chỉ app mới làm được: thông báo đẩy, dùng offline, tích hợp camera hay vị trí.

Google dễ tính hơn ở điểm này, nhưng cũng có giới hạn.

## 7. Chưa hoàn thành closed testing

Với **tài khoản cá nhân Google Play mở sau tháng 11/2023**, đây là điều kiện bắt buộc chứ không phải khuyến nghị. Chưa chạy đủ 12 tester trong 14 ngày thì nút xin phát hành công khai còn khoá.

Chi tiết ở bài riêng: [Google Play bắt 12 tester chạy 14 ngày](/blog/google-play-12-tester-14-ngay).

## Khi bị từ chối thì làm gì

Đừng nộp lại ngay mà chưa sửa gì. Nộp đi nộp lại nhiều lần không sửa sẽ khiến tài khoản bị chú ý.

Quy trình nên làm:

1. **Đọc kỹ lý do từ chối.** Cả hai store đều ghi rõ điều khoản nào bị vi phạm.
2. **Sửa đúng thứ họ nêu**, không đoán mò sửa lung tung.
3. **Trả lời lại người duyệt** nếu bạn cho rằng họ hiểu nhầm. Với Apple, hộp thoại Resolution Center có người thật đọc — trình bày lịch sự, rõ ràng thì họ xem lại.
4. **Nộp lại** kèm ghi chú nêu rõ bạn đã sửa gì.

Trong ảnh dưới là bảng tiến độ trong Google Play Console — mỗi đầu việc chưa xong đều hiện ở đây trước khi nộp:

![Bảng tiến độ trong Google Play Console](/blog/04-playconsole-tong-quan.jpg)
*Xem hết danh sách này trước khi bấm nộp sẽ tránh được phần lớn lý do từ chối.*

Phần lớn app bị từ chối lần đầu. Đó là chuyện bình thường, không phải dấu hiệu app của bạn có vấn đề.

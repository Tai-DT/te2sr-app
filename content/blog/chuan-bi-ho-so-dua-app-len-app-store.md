---
title: "Chuẩn bị hồ sơ đưa app lên App Store cần những gì"
description: "Danh sách đầy đủ mọi thứ Apple đòi trước khi app được duyệt — chứng chỉ, ảnh chụp màn hình, khai báo quyền riêng tư, tài khoản thử. Có thứ tự làm để không phải quay lại sửa."
date: "2026-07-26"
tags: ["App Store", "Đăng tải"]
---

App Store khắt khe hơn Google Play, nhưng cũng dễ đoán hơn: mọi thứ Apple đòi đều nằm trong tài liệu công khai. Vấn đề là danh sách dài, và thiếu một mục là phải chờ thêm một vòng duyệt.

Đây là danh sách đầy đủ, xếp theo thứ tự nên làm.

## Trước hết: tài khoản

**Apple Developer Program** — 99 USD/năm, gia hạn hằng năm. Không có tài khoản trả phí thì không đưa app lên được.

Chọn loại tài khoản ngay từ đầu, vì đổi sau rất phiền:

- **Individual** — tên bạn hiện trên App Store với tư cách nhà phát triển
- **Organization** — tên công ty hiện trên App Store, nhưng cần mã số D-U-N-S, xin mất từ vài ngày tới hai tuần

Nếu định để tên công ty, **xin D-U-N-S trước tiên**. Đây là thứ mất thời gian nhất và nhiều người bỏ quên tới lúc cần thì phải chờ.

## Chứng chỉ và định danh

Làm theo đúng thứ tự này:

1. **App ID** — định danh app, dạng `com.congty.tenapp`. Đặt xong không đổi được, nên nghĩ kỹ.
2. **Distribution Certificate** — chứng chỉ ký bản phát hành.
3. **Provisioning Profile** — hồ sơ cấp phép, gắn App ID với chứng chỉ.

Nếu dùng Xcode với tính năng tự động quản lý chữ ký thì phần lớn bước này Xcode lo. Nhưng khi có lỗi, biết ba thứ trên là gì sẽ giúp bạn tự gỡ.

## Nội dung trang App Store

**Tên app** — tối đa 30 ký tự. Đây cũng là từ khoá quan trọng nhất cho việc tìm kiếm.

**Subtitle** — tối đa 30 ký tự, hiện ngay dưới tên. Đừng bỏ trống, đây là chỗ đặt từ khoá thứ hai.

**Từ khoá** — tối đa 100 ký tự, ngăn cách bằng dấu phẩy, người dùng không nhìn thấy. Đừng lặp lại chữ đã có trong tên và subtitle, phí chỗ.

**Mô tả** — tối đa 4000 ký tự. Ba dòng đầu là phần người dùng thấy trước khi bấm "xem thêm", nên đặt thứ quan trọng nhất ở đó.

**Ảnh chụp màn hình** — bắt buộc cho kích thước iPhone 6.9 inch. Các kích thước khác Apple tự co lại từ bộ này. Ảnh phải là màn hình thật của app.

**Icon** — 1024×1024, không bo góc (Apple tự bo), không kênh trong suốt.

## Khai báo quyền riêng tư

Đây là chỗ hay bị từ chối nhất.

**Link chính sách quyền riêng tư** — bắt buộc, phải mở được công khai không cần đăng nhập.

**App Privacy** — bảng kê app thu thập dữ liệu gì. Phải khai đúng, kể cả dữ liệu do thư viện bên thứ ba thu.

Nhiều người khai "không thu thập gì" trong khi app có Firebase, AdMob hay Facebook SDK. Những thứ đó **có** thu thập, và khai sai bị coi là vi phạm chứ không chỉ là thiếu sót.

Cách làm đúng: liệt kê hết thư viện bên thứ ba, tra tài liệu từng cái, rồi khai theo.

## Thông tin cho người duyệt

Phần này nhiều người bỏ qua và trả giá bằng một vòng duyệt.

**Tài khoản thử** — nếu app bắt đăng nhập, phải cung cấp tài khoản còn hoạt động. Kiểm tra lại tài khoản đó ngay trước khi nộp; tài khoản hết hạn giữa chừng là lý do từ chối rất hay gặp.

**Ghi chú cho người duyệt** — giải thích những gì không hiển nhiên. App cần thiết bị đặc biệt? Có tính năng chỉ hoạt động ở một quốc gia? Cần thao tác đặc biệt mới thấy? Ghi hết vào đây.

Viết phần này tử tế giúp giảm rủi ro bị hiểu nhầm rất nhiều.

## TestFlight trước khi nộp duyệt

Không bắt buộc, nhưng nên làm. TestFlight cho phép phát hành bản thử cho tối đa 100 người nội bộ mà không cần Apple duyệt, và tối đa 10.000 người ngoài (bản cho người ngoài có qua duyệt nhẹ).

Khác với Google Play, **Apple không bắt buộc chạy đợt kiểm thử nào** trước khi phát hành. Đây là điểm dễ nhầm với quy định 12 tester của Google — hai store hoàn toàn khác nhau ở chỗ này.

## Thứ tự nên làm

1. Xin D-U-N-S nếu dùng tài khoản tổ chức *(làm trước tiên, mất thời gian nhất)*
2. Đăng ký Apple Developer Program
3. Tạo App ID, chứng chỉ, provisioning profile
4. Dựng bản build và tải lên qua Xcode hoặc Transporter
5. Chuẩn bị ảnh chụp màn hình và icon
6. Viết nội dung trang App Store
7. Khai App Privacy
8. Điền tài khoản thử và ghi chú cho người duyệt
9. Thử qua TestFlight
10. Nộp duyệt

Bước 5, 6, 7 làm song song được trong lúc chờ bản build xử lý xong.

## Mất bao lâu

Apple duyệt thường trong 24–48 giờ, có khi vài giờ. Nhưng đó là thời gian **duyệt**, không tính thời gian bạn chuẩn bị.

Với người làm lần đầu, khâu chuẩn bị thường mất vài ngày tới một tuần — chủ yếu vì phải quay lại sửa những mục thiếu.

---

Nếu bạn muốn bỏ qua khâu này, TE2SR nhận đăng tải trọn gói: App Store $70, cả App Store lẫn Google Play $100, thanh toán hai đợt. Chúng tôi lo từ chứng chỉ tới xử lý phản hồi của người duyệt cho tới khi app lên Store.

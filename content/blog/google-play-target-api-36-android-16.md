---
title: "Từ 31/8/2026: app mới và bản update phải target Android 16 (API 36)"
description: "Deadline target API level mới nhất của Google Play: app mới và bản cập nhật bắt buộc API 36, app cũ tối thiểu API 35 để còn hiện với người dùng mới. Ai đang trong đợt closed testing cần lưu ý gì?"
date: "2026-10-14"
tags: ["Google Play", "Target API", "Android 16"]
cover: "/blog/04-playconsole-tong-quan.jpg"
---

Từ **31/8/2026**, Google Play siết yêu cầu target API level lên một nấc nữa. Đây là thay đổi định kỳ hằng năm nhưng năm nay có điểm đáng chú ý cho ai đang chạy closed testing hoặc sắp xin quyền phát hành.

## Hai mốc bắt buộc

- **App mới + bản cập nhật:** phải target **Android 16 (API level 36)** trở lên — ngoại trừ Wear OS/Android Automotive (API 35) và Android TV/Android XR (API 34).
- **App đã phát hành:** phải target tối thiểu **Android 15 (API 35)** để còn xuất hiện với người dùng mới trên máy chạy Android mới hơn. Người đã cài thì vẫn tìm lại và cài lại được.

Quy tắc chung của Google giờ viết rõ hơn trước: app/update mới phải target API **trong vòng 1 năm** kể từ bản Android lớn mới nhất; app cũ trong vòng **2 năm** để còn khả năng khám phá.

## Liên quan gì đến đợt closed testing 12 tester/14 ngày?

Nhiều bạn build bản closed testing từ trước hạn rồi quên mất — khi xin quyền phát hành production sau deadline, nếu bản build target API cũ, bạn phải đóng bản mới và **bản mới đó phải target API 36**. Việc update build giữa đợt test **không reset** 14 ngày (Google xác nhận update giữa test là hành vi được khuyến khích), nhưng bản final đi lên production phải thoả mãn target API hiện hành tại thời điểm submit.

## Checklist nhanh

1. `build.gradle`: `targetSdkVersion = 36` cho bản sẽ submit sau 31/8/2026.
2. Test lại trên máy/emulator Android 16 — đặc biệt quyền thông báo, nền tảng media, và các behavior change của API 36.
3. Nếu gần deadline mà chưa kịp: Play Console có mục **xin gia hạn** (extension) — đừng bỏ qua, Google cho phép xin thêm thời gian qua form ngay trong Console.
4. Lên lịch nâng target API **ít nhất 3 tháng trước deadline** — chính Google khuyến nghị để còn thời gian xử lý lỗi tương thích.

Nguồn chính thức: Play Console Help — *Target API level requirements* và *Policy announcement July 2025*.

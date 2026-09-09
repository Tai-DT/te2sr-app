# 05 — Bộ Prompt Mẫu Điều Khiển AI Viết Bài Mạng Xã Hội Đỉnh Cao

> **Vấn đề của bài viết do AI sinh ra:** Đa số bài viết do AI thông thường viết ra nghe rất sáo rỗng, dùng các từ ngữ chung chung như *"in today's digital landscape"*, *"delve into"*, *"game-changer"*, làm người đọc nhận ra ngay là bài bot và lướt qua.
> Bộ prompt dưới đây được thiết kế với **ràng buộc phong cách kỹ sư (Engineering Persona)** để bài viết chân thực, sắc sảo và mang lại giá trị thật.

---

## 1. Các Ràng Buộc Bắt Buộc (System Constraints Cho AI)

Khi yêu cầu bất kỳ AI nào viết bài, hãy luôn kèm theo các nguyên tắc này:
1. **Tone of Voice:** Giọng văn của một Senior QA Engineer / Mobile Dev thực chiến. Bình tĩnh, khiêm tốn, đi thẳng vào vấn đề kỹ thuật, không nói quá.
2. **Cấm dùng các từ ngữ sáo rỗng:** Tuyệt đối không dùng: *"game-changer"*, *"delve"*, *"dive into"*, *"unleash"*, *"revolutionize"*, *"đỉnh cao"*, *"đột phá"*.
3. **Độ thoáng dòng:** Mỗi đoạn tối đa 2-3 câu ngắn. Dùng dấu gạch đầu dòng (`•` hoặc `-`) cho các danh sách.

---

## 2. Các Prompt Mẫu Copy-Paste Sử Dụng Ngay

### 🎯 PROMPT 1: Viết Bài Case Study / Social Proof Khoe Thành Quả
```text
Bạn là chuyên gia marketing nội dung cho TE2SR (dịch vụ kiểm thử closed testing 12 tester/14 ngày trên thiết bị thật và phát hành App Store).

Hãy viết một bài đăng Facebook và LinkedIn bằng tiếng Anh dựa trên dữ liệu thật sau:
- Khách hàng: Ứng dụng theo dõi chi tiêu cá nhân làm bằng Flutter.
- Thách thức: Từng bị từ chối 1 lần vì tester không tương tác và danh sách tụt xuống 11 người.
- Giải pháp từ TE2SR: Cung cấp 15 máy Android vật lý thật, kiểm thử liên tục trong 14 ngày, báo cáo 4 lỗi layout trên màn hình nhỏ.
- Kết quả: Hôm nay app vừa nhận email chấp thuận quyền phát hành Production từ Google Play Console.

Yêu cầu:
- Viết theo công thức Before - After - Bridge.
- 3 dòng đầu phải là một Hook thật cuốn hút về khoảnh khắc nhận email approved.
- Nhấn mạnh vào tầm quan trọng của việc dùng thiết bị thật thay vì bot.
- Kèm CTA nhẹ nhàng dẫn về website te2sr.com.
```

---

### 🎯 PROMPT 2: Viết Bài Cảnh Báo Lỗi / Bẫy Kiểm Duyệt
```text
Hãy đóng vai một kỹ sư kiểm thử mobile của TE2SR. Viết một bài chia sẻ trên nhóm lập trình viên (Facebook/Reddit) cảnh báo về:
"Tại sao máy ảo (emulator) chạy trên server cloud lại khiến tài khoản Google Play Developer bị khóa theo Điều khoản 8.3?"

Yêu cầu kỹ thuật cần giải thích rõ:
1. Google Play Integrity API đọc tín hiệu gì từ cảm biến thật (con quay hồi chuyển, gia tốc kế, chu kỳ sạc pin).
2. Sự khác biệt giữa IP thiết bị di động thông thường và IP của datacenter (AWS, Hetzner, DigitalOcean).
3. Hậu quả thực tế: Đồng hồ 14 ngày bị treo hoặc tài khoản dev bị cấm vĩnh viễn.

Phong cách: Thẳng thắn, cảnh tỉnh, mang tính học thuật kỹ thuật cao, không sặc mùi quảng cáo. Cuối bài mới nhẹ nhàng giới thiệu TE2SR như một giải pháp thiết bị thật uy tín cho anh em không có sẵn máy test.
```

---

### 🎯 PROMPT 3: Viết Chuỗi 5 Tweet (Thread) Trên 𝕏 (Twitter)
```text
Hãy viết một chuỗi 5 Tweet (Thread) bằng tiếng Anh chuẩn văn hóa #buildinpublic trên 𝕏 về chủ đề:
"5 checklist cần làm trước khi bấm Apply for Production trên Google Play Console sau khi hết 14 ngày."

Quy chuẩn từng tweet:
- Tweet 1: Hook giật gân về việc đã chờ 14 ngày nhưng vẫn bị từ chối vì không chuẩn bị kỹ bảng hỏi. Kèm biểu tượng 🧵👇. KHÔNG để link ngoài ở Tweet 1.
- Tweet 2: Checklist về việc phải phát hành ít nhất 1 bản update nhỏ (v1.0.1 -> v1.0.2) để chứng minh có sửa bug.
- Tweet 3: Cách trả lời câu hỏi "Bạn đã thu thập phản hồi của tester bằng cách nào?"
- Tweet 4: Cách trả lời câu hỏi "Bạn tìm nguồn tester ở đâu?" (tránh từ khóa mua bán bot).
- Tweet 5: Tóm tắt + CTA trỏ về bài blog: https://te2sr.com/blog/how-to-pass-google-play-14-days-closed-testing
```

---

### 🎯 PROMPT 4: Dịch & Địa Phương Hóa Nội Dung Đa Ngôn Ngữ
```text
Dưới đây là một bài viết tiếng Anh về dịch vụ kiểm thử mobile:
[Dán bài viết tiếng Anh vào đây]

Hãy chuyển ngữ và bản địa hóa bài viết này sang:
1. Tiếng Tây Ban Nha (dành cho cộng đồng dev Nam Mỹ).
2. Tiếng Nhật (dành cho cộng đồng indie dev Nhật Bản).

Lưu ý quan trọng:
- Dùng đúng thuật ngữ chuyên ngành của giới lập trình viên bản địa (ví dụ tiếng Nhật dùng クローズドテスト cho closed testing, 本番アクセス cho production access).
- Giữ phong cách tự nhiên của một lập trình viên bản xứ, không dịch thô kiểu Google Dịch.
```

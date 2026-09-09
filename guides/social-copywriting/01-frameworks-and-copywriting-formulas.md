# 01 — Các Công Thức Viết Bài Kinh Điển Cho Mạng Xã Hội (Dành Cho Dịch Vụ Công Nghệ & Dev)

> **Nguyên tắc cốt lõi:** Người lướt mạng xã hội không lên để mua hàng; họ lên để giải trí hoặc tìm thông tin hữu ích. Do đó, bài viết **không được bán hàng trực diện (Hard-selling)**, mà phải **giải quyết một vấn đề nhức nhối** của người đọc.

---

## 1. Công Thức PAS (Problem — Agitate — Solution)
*Đây là công thức có tỷ lệ chuyển đổi cao nhất đối với lập trình viên và người làm sản phẩm.*

### Cấu trúc:
1. **Problem (Nêu vấn đề):** Chỉ rõ một nỗi đau thực tế mà đối tượng mục tiêu đang gặp.
2. **Agitate (Xoáy sâu vào hậu quả):** Làm cho người đọc cảm nhận rõ sự lãng phí về thời gian, công sức hoặc rủi ro mất tiền/mất tài khoản nếu không xử lý đúng.
3. **Solution (Đưa ra giải pháp):** Đưa ra câu trả lời hợp lý, rõ ràng, minh bạch (không nói quá).

### Ví dụ thực chiến cho TE2SR:
```text
[Problem]: Bạn vừa dành 3 tháng lập trình ứng dụng, nhưng khi nộp lên Google Play thì bị chặn lại bởi quy định closed testing 14 ngày?

[Agitate]: Càng đau hơn khi bạn nhờ bạn bè tải app, nhưng đến ngày thứ 11 chỉ cần 1 người lỡ tay gỡ cài đặt, danh sách tụt xuống 11 máy. Google lập tức đóng băng hoặc bắt đầu đếm ngược lại từ con số 0. Mất trắng 2 tuần vô ích. Nếu liều thuê mấy bên chạy bot máy ảo 15-20 đô trên mạng, tài khoản Google Developer của bạn có thể bị khóa vĩnh viễn theo Điều khoản 8.3 vì hành vi gian lận.

[Solution]: Tại TE2SR, chúng tôi duy trì đội ngũ 12-15 thiết bị Android vật lý thật 100%, bật app hàng ngày và báo cáo lỗi liên tục trong 14 ngày. Chi phí chỉ $50 và bạn chỉ cần trả 50% trước, 50% còn lại chỉ thanh toán khi app đã chính thức được duyệt lên store.
👉 Xem quy trình tại: te2sr.com
```

---

## 2. Công Thức BAB (Before — After — Bridge)
*Thích hợp nhất cho các bài viết dạng Social Proof, khoe kết quả thành công, truyền cảm hứng.*

### Cấu trúc:
1. **Before (Tình trạng bế tắc trước đây):** Mô tả khách hàng hoặc dự án khi còn loay hoay, bị từ chối duyệt.
2. **After (Kết quả mỹ mãn sau khi giải quyết):** Mô tả trạng thái app được duyệt lên Store, nhận đánh giá 5 sao, mở quyền Production.
3. **Bridge (Chiếc cầu nối):** Giải thích công cụ hoặc quy trình nào đã giúp đưa họ từ Before sang After.

### Ví dụ thực chiến cho TE2SR:
```text
[Before]: Cách đây 3 tuần, một bạn dev Flutter liên hệ với chúng tôi trong trạng thái bế tắc: App bị Google Play từ chối cấp quyền phát hành 2 lần vì không chứng minh được độ tương tác thật của tester trong 14 ngày.

[After]: Sáng nay, email từ Google Play Console gửi về: "Your app has been granted access to publish publicly on Google Play". Nút "Apply for production" đã sáng xanh và app đã có mặt trên toàn cầu.

[Bridge]: Cầu nối duy nhất là việc chuyển từ "nhờ người quen test thụ động" sang quy trình kiểm thử thiết bị thật có nhật ký thao tác và báo cáo crash log chi tiết của TE2SR. Khi Google gửi bảng hỏi kiểm tra, bạn ấy chỉ việc dùng dữ liệu thật này để trả lời và được duyệt chỉ sau 24 giờ.
```

---

## 3. Công Thức Hook — Story — Offer
*Công thức kể chuyện (Storytelling) giữ chân người đọc tốt nhất trên 𝕏 (Twitter), LinkedIn và Facebook cá nhân.*

### Cấu trúc:
1. **Hook (Câu mở đầu giật gân/bất ngờ):** Khiến ngón tay đang lướt màn hình phải dừng lại.
2. **Story (Câu chuyện ngắn gọn):** Diễn biến thực tế, bài học rút ra, chi tiết chân thực.
3. **Offer (Lời đề nghị nhẹ nhàng):** Hướng dẫn người đọc bước tiếp theo (Đọc bài blog, lưu tài liệu, liên hệ tư vấn).

### Ví dụ thực chiến cho TE2SR:
```text
[Hook]: "Đừng bao giờ bấm nút Apply for production vào đúng ngày thứ 14."

[Story]: Nghe thì vô lý, nhưng đây là lý do khiến 70% indie dev bị trượt vòng xét duyệt của Google Play. Hầu hết mọi người đếm 14 ngày kể từ lúc tải file APK lên. Nhưng Google chỉ bắt đầu đếm từ lúc bản build được duyệt VÀ tester thứ 12 tham gia. Nếu bạn nộp app ngày 1, được duyệt ngày 3, thì phải đến ngày 17 bạn mới hoàn thành 14 ngày. Bấm nộp vào ngày 15 đồng nghĩa bạn nộp thiếu 2 ngày. Google sẽ tự động gắn cờ từ chối.

[Offer]: Tôi đã tổng hợp 4 bẫy đồng hồ khác trong bài viết kỹ thuật này để anh em không bị mất oan 2 tuần:
🔗 te2sr.com/blog/how-to-pass-google-play-14-days-closed-testing
```

---

## 4. Công Thức AIDA (Attention — Interest — Desire — Action)
*Công thức cổ điển dành cho các bài viết giới thiệu gói dịch vụ, tính năng mới hoặc bài ghim.*

### Cấu trúc:
* **Attention (Gây chú ý):** Một sự thật bất ngờ hoặc số liệu ấn tượng.
* **Interest (Kích thích sự thích thú):** Nêu bật những điểm độc đáo mà nơi khác không có.
* **Desire (Thúc đẩy khao khát):** Đưa ra cam kết an toàn tuyệt đối (Không máy ảo, chia đôi tiền thanh toán).
* **Action (Hành động):** Nút bấm, đường dẫn, inbox.

### Checklist kiểm tra trước khi bấm đăng:
- [ ] 3 dòng đầu tiên có đủ sức hút để người đọc bấm "Xem thêm" (See more) không?
- [ ] Đã ngắt dòng thoáng mắt chưa? (Tuyệt đối không viết 1 đoạn văn dài quá 3-4 dòng trên điện thoại).
- [ ] Có chèn quá nhiều link không? (Chỉ nên đặt 1 link duy nhất để tập trung hành động).
- [ ] Có hình ảnh thật kèm theo không? (Ảnh chụp màn hình, đồ họa nhận diện chuẩn).

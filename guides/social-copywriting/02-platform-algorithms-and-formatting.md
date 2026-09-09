# 02 — Thuật Toán Phân Phối & Quy Chuẩn Định Dạng Từng Mạng Xã Hội

> **Hiểu thuật toán là chìa khóa:** Mỗi mạng xã hội có một cơ chế chấm điểm bài viết khác nhau. Đăng cùng một nội dung nhưng không định dạng đúng chuẩn của nền tảng đó sẽ khiến bài viết bị "bóp tương tác" (reach thấp).

---

## 1. Facebook (Fanpage & Group)

### Cơ chế thuật toán (EdgeRank):
* **Tín hiệu ưu tiên:** Bình luận dài có thảo luận qua lại > Lượt chia sẻ (Share) > Lượt thả tim/cảm xúc > Lượt xem bài > Lượt like đơn thuần.
* **Xử lý liên kết ngoài (External Links):** Facebook luôn muốn giữ chân người dùng ở lại app. Nếu bài viết chứa link ra ngoài (`te2sr.com`), thuật toán thường giảm khoảng 20-30% lượt hiển thị tự nhiên.
  * *Mẹo chuyên sâu:* Nếu bài viết cần tương tác thảo luận cao: Viết toàn bộ giá trị trong bài, cuối bài ghi *"Link tài liệu chi tiết mình để dưới phần bình luận đầu tiên nhé!"* và tự comment link của mình.
  * *Ngoại lệ:* Nếu bài viết có OpenGraph hiển thị ảnh card lớn đẹp mắt (như blog của TE2SR), bạn vẫn có thể dán link trực tiếp khi muốn kéo traffic chất lượng cao.

### Quy chuẩn định dạng:
* **Ảnh:** Vuông `1080×1080` (1:1) hoặc chữ nhật nằm ngang `1200×630` (1.91:1).
* **Độ dài văn bản:** Đoạn mở đầu (Hook) phải nằm gọn trong **3 dòng đầu tiên** trước khi xuất hiện nút *"Xem thêm"*.
* **Icon / Emoji:** Dùng có chừng mực (1-2 icon mỗi đoạn), đóng vai trò làm đầu dòng (bullet points) để mắt người đọc dễ quét thông tin.

---

## 2. 𝕏 (Twitter)

### Cơ chế thuật toán (For You Feed):
* **Yếu tố xếp hạng cao nhất hiện nay:**
  1. **Lượt Lưu lại (Bookmark):** Trọng số điểm cao nhất (gấp 4-5 lần lượt Like). Hãy viết các bài dạng checklist hoặc cẩm nang để người ta muốn bấm lưu lại.
  2. **Thời gian đọc (Dwell Time):** Người dùng dừng lại đọc tweet càng lâu, tweet càng được đẩy tới nhiều người.
  3. **Lượt thảo luận (Replies):** Tweet có đối đáp giữa tác giả và người đọc sẽ được đẩy lên top feed.

### Cấu trúc chuỗi Tweet (Thread) chuẩn:
* **Tweet 1 (Root Tweet):** Tuyệt đối KHÔNG gắn link ngoài ở Tweet 1. Tweet 1 chỉ chứa Hook mạnh + Lời hứa về giá trị + biểu tượng 🧵👇.
* **Tweet 2 đến Tweet 4:** Chia sẻ kiến thức súc tích, mỗi tweet giải quyết 1 ý nhỏ.
* **Tweet cuối (Outro / CTA):** Đây mới là nơi đặt link dẫn về website `https://te2sr.com` hoặc kêu gọi Retweet tweet đầu tiên.

---

## 3. LinkedIn

### Cơ chế thuật toán (Professional Feed):
* **Chỉ số Dwell Time (Thời gian đọc):** LinkedIn theo dõi thời gian người dùng mở xem bài viết của bạn. Nếu bài viết kích thích họ bấm nút **"...see more"** (xem thêm) và dừng lại đọc trên 30 giây, bài viết sẽ được xếp vào dạng "Nội dung chất lượng cao".
* **Định dạng đỉnh cao nhất trên LinkedIn:** **Document Carousel (PDF nhiều trang)**. Thay vì đăng ảnh đơn lẻ, xuất file PDF 5-7 slide chia sẻ checklist đưa app lên Store, tỷ lệ tương tác sẽ cao gấp 3 lần bài viết văn bản thông thường.

### Cách trình bày văn bản:
* Sử dụng khoảng trắng (White-space) thông minh: Mỗi câu hoặc mỗi ý nên cách nhau một dòng trắng.
* Tránh viết các khối chữ dày đặc làm người dùng lướt qua trên điện thoại.
* Gắn từ 3 đến 5 hashtag chuyên ngành ở cuối bài (`#MobileApp`, `#AndroidDev`, `#TechQA`).

---

## 4. Reddit (Cộng Đồng Khắt Khe Nhưng Chuyển Đổi Khách Cao Nhất)

### Văn hóa "Anti-Marketing" của Reddit:
* Người dùng Reddit cực kỳ ghét quảng cáo lộ liễu và các tài khoản spam. Nếu bạn vào một subreddit như `r/AndroidClosedTesting` và đăng ngay: *"Mua tester $50 tại te2sr.com"*, bài viết sẽ bị mod xóa trong 5 phút và tài khoản có thể bị cấm (ban).

### Quy tắc "Giá trị trước — Dịch vụ sau" (Quy tắc 9:1):
* **9 phần chia sẻ:** Giải thích cặn kẽ vì sao họ bị trượt (bẫy thời gian, máy ảo, câu hỏi khảo sát). Trả lời nhiệt tình các thắc mắc của anh em dev trong phần comment.
* **1 phần đề cập:** Chỉ nhắc đến TE2SR như một giải pháp thay thế cho những ai không có thời gian tự tìm tester: *"Nếu bạn không có đủ 15 thiết bị thật, team mình có hỗ trợ dịch vụ tại te2sr.com..."*.
* Nhờ vậy, bài viết nhận được nhiều Upvote và được cộng đồng tin tưởng tuyệt đối.

---
title: "Tự chạy closed testing hay thuê ngoài — tính thử chi phí thật"
description: "Tự làm không mất tiền, nhưng mất thời gian và có rủi ro phải làm lại. Bài này tính cụ thể cả hai hướng để bạn tự quyết, kể cả khi kết luận là nên tự làm."
date: "2026-07-26"
tags: ["Google Play", "Closed testing"]
cover: "/blog/01-playconsole-du-3-dieu-kien.jpg"
---

Chúng tôi bán dịch vụ chạy closed testing, nên bài này khó tránh khỏi có phần thiên vị. Vì vậy tôi sẽ nói trước phần bất lợi cho mình: **nhiều trường hợp bạn nên tự làm.**

Dưới đây là cách tính để bạn tự quyết.

## Tự làm thì cần gì

Không cần kỹ thuật gì đặc biệt. Bạn cần đúng ba thứ:

1. **12 người thật** có tài khoản Google, chịu cài app và **giữ trong máy 14 ngày**
2. **Theo dõi** để nếu ai gỡ app thì kịp tìm người thay
3. **Kiên nhẫn** — nếu hỏng phải làm lại từ đầu, mất thêm 14 ngày

Cái khó không nằm ở bước một mà ở bước hai. Rủ 12 người bấm cài thì dễ. Giữ đủ 12 người trong hai tuần mới là chuyện khác — điện thoại đầy bộ nhớ, dọn app, đổi máy, hoặc đơn giản là quên.

## Chi phí thật của việc tự làm

Tiền mặt: **0 đồng**. Nhưng có ba khoản không phải tiền:

**Thời gian gom người.** Nếu bạn có sẵn nhóm bạn bè làm kỹ thuật thì nhanh. Nếu phải đi xin trong các nhóm, hội, diễn đàn thì thường mất vài ngày tới một tuần.

**Thời gian theo dõi.** Hai tuần thỉnh thoảng phải kiểm tra và nhắc nhở.

**Rủi ro phải làm lại.** Đây là khoản đắt nhất. Tụt xuống dưới 12 người là đồng hồ chạy lại từ đầu. Mất thêm 14 ngày — và nếu bạn đang chờ ra mắt app để kịp một dịp nào đó thì khoản này đắt hơn nhiều so với tiền.

## Đổi tester với nhau

Có cách trung gian: tìm nhà phát triển khác cũng đang cần tester, hai bên cài app của nhau.

Ưu điểm: miễn phí, và người kia hiểu luật chơi nên ít bỏ cuộc giữa chừng.

Nhược điểm: bạn phải cam kết giữ app của họ 14 ngày, và tìm đủ 12 người theo cách này thì gần như phải tham gia một cộng đồng đổi tester. Cũng mất công tương đương.

## Khi nào thuê ngoài đáng tiền

Theo kinh nghiệm của chúng tôi, có bốn trường hợp:

**Bạn đã trượt một lần.** Mất 14 ngày rồi, không muốn mất thêm 14 ngày nữa. Đây là lý do phổ biến nhất của khách tìm tới.

**Bạn có hạn chót.** App cần ra mắt kịp một dịp, một chiến dịch, một cuộc thi. Rủi ro trượt lúc này đắt hơn nhiều so với chi phí thuê.

**Bạn không có mạng lưới.** Làm một mình, bạn bè không dùng Android, không sinh hoạt trong cộng đồng lập trình nào. Gom 12 người từ con số 0 rất mất sức.

**Bạn có nhiều app.** Làm quy trình này ba bốn lần thì công sức cộng dồn đáng kể.

## Khi nào KHÔNG nên thuê

**Bạn có sẵn 12 người tin cậy.** Đồng nghiệp, bạn học, nhóm cộng đồng. Vậy thì tự làm, giữ tiền.

**App còn đang thay đổi nhiều.** Nếu bạn còn sửa lớn, hãy để đợt kiểm thử lại sau. Chạy closed testing với bản chưa ổn định là lãng phí cả hai phía.

**Bạn muốn phản hồi thật về sản phẩm.** Tester thuê ngoài đáp ứng yêu cầu của Google, nhưng người dùng thật thuộc đúng nhóm khách hàng mục tiêu mới cho bạn phản hồi có giá trị về sản phẩm. Hai mục đích khác nhau — đừng nhầm.

## Nếu chọn thuê thì hỏi gì

Dù thuê chỗ nào, hỏi bốn câu này:

1. **Tester là người thật hay tài khoản tạo hàng loạt?** Google phát hiện được tài khoản dựng hàng loạt, và hậu quả nặng hơn nhiều so với việc trượt.
2. **Nếu tester bỏ giữa chừng thì sao?** Có bổ sung người thay không, hay tính là xong việc?
3. **Hoàn tiền trong trường hợp nào?** Nếu câu trả lời là "hoàn tiền nếu không đạt" mà không định nghĩa "không đạt", hãy hỏi tiếp cho rõ.
4. **Có bàn giao gì ngoài việc chạy đủ ngày không?** Báo cáo lỗi có ích không, hay chỉ là đủ số người cho qua.

## Cách chúng tôi làm

Nói rõ để bạn so sánh: TE2SR chạy trên thiết bị thật, không dùng máy ảo. Bàn giao báo cáo lỗi kèm ảnh chụp màn hình và các bước tái hiện. Hoàn tiền 100% nếu Google báo lỗi vì tester phía chúng tôi không chạy đủ 12 người trong 14 ngày.

Giá: Google Play $50, App Store $70, cả hai $100 — trả hai đợt.

Ảnh dưới là kết quả của một đợt đã chạy xong:

![Google Play Console tick đủ ba điều kiện](/blog/01-playconsole-du-3-dieu-kien.jpg)
*Cả ba điều kiện đều đạt, nút xin phát hành công khai đã mở.*

Nhưng nếu sau khi đọc tới đây bạn thấy mình thuộc nhóm "nên tự làm" — thì cứ tự làm. Bài [Google Play bắt 12 tester chạy 14 ngày](/blog/google-play-12-tester-14-ngay) có đủ thông tin để bạn tự chạy đúng.

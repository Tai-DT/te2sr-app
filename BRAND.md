# TE2SR — bộ nhận diện

Toàn bộ logo, favicon và ảnh mạng xã hội được **sinh ra từ một nguồn vector duy nhất**.
Không có bước vẽ tay ở giữa, nên sửa một chỗ là mọi kích thước cập nhật theo.

```bash
node scripts/brand/build.js
```

Cần `rsvg-convert` (`brew install librsvg`) và `magick` (`brew install imagemagick`).

## Nguồn

| Tệp | Vai trò |
| --- | --- |
| `scripts/brand/glyphs.js` | Từng chữ cái dựng bằng path/rect trong hộp cao 100 đơn vị. Không dùng `<text>`, **không phụ thuộc font** ⇒ nét ở mọi kích thước, mọi máy. Kèm glyph chính thức của App Store và Google Play. |
| `scripts/brand/lockups.js` | Ghép chữ thành wordmark, hàng store, monogram và các lockup. Bảng màu & gradient nằm ở đây. |
| `scripts/brand/build.js` | Xuất ra `public/`, `assets-facebook/` và module React. |
| `scripts/brand/preview.js` | Bản xem thử nhiều biến thể trên một trang, dùng khi chỉnh hình học. |

Chữ được tô màu qua `<mask>` chứ không tô trực tiếp từng chữ. Lý do: gradient
`userSpaceOnUse` được tính trong hệ toạ độ của chính phần tử tham chiếu nó, nên
nếu mỗi chữ nằm trong một `<g transform="translate(x)">` riêng thì dải màu sẽ
khởi động lại ở từng chữ. Dựng chữ thành mask rồi tô đúng một hình chữ nhật
gradient qua mask cho ra một dải màu trải đều cả wordmark, và giống nhau trên
mọi bộ dựng hình.

## Logo web — `public/`

| Tệp | Dùng ở đâu |
| --- | --- |
| `logo.svg` | Lockup xếp dọc, nền sáng. **Bản chính.** |
| `logo-dark.svg` | Lockup xếp dọc, nền tối. |
| `logo-inline.svg` | Lockup ngang, cho navbar. |
| `logo-wordmark.svg` / `logo-wordmark-dark.svg` | Chỉ chữ TE2SR. |
| `logo-play-r.svg` | Bản trung thành với ảnh gốc — chân chữ R là tam giác Google Play. |
| `logo.png` (1200 px) / `logo@2x.png` (2400 px) | PNG dự phòng, nền trong suốt. |
| `favicon.svg`, `favicon-16/32/48.png`, `favicon.ico` | Favicon. Bản ≤48 px dùng monogram to hơn và nét dày hơn để 16 px vẫn đọc được. |
| `apple-touch-icon.png` (180) | iOS. |
| `icon-192.png`, `icon-512.png` | PWA. |
| `icon-maskable-512.png` | PWA maskable — nền tràn viền, dấu hiệu nằm trong vòng an toàn 80 %. |

**Favicon và app icon vẫn dùng monogram “T2”, không dùng wordmark.** Ở 16 px mỗi
chữ của “TE2SR” chưa được 1 px, thành vệt xám vô nghĩa. Avatar mạng xã hội thì
ngược lại — cỡ hiển thị đủ lớn nên dùng wordmark đầy đủ. Muốn đổi cả app icon
sang wordmark thì sửa `tile()` trong `build.js` để gọi `L.avatarBody()`.
| `og.png` (1200 × 630) | Ảnh khi chia sẻ link. |

### Chân chữ R — hai lựa chọn

Ảnh gốc để tam giác Google Play thay cho chân chữ R. Tam giác là một khối đặc,
không phải nét chéo, nên chữ cuối đọc ra “P” kèm một huy hiệu chứ không thành
“R” — ở cỡ navbar 26 px thì càng rõ. Vì vậy:

- **Bản chính** (`logo.svg`, navbar, favicon, OG) dùng chân R chuẩn ⇒ đọc rõ “TE2SR”.
  Logo App Store và Google Play vẫn hiện, ở hàng store phía dưới.
- **Bản trung thành** (`logo-play-r.svg`) giữ nguyên tam giác làm chân R.

Muốn đổi bản chính sang kiểu trung thành: sửa `playLeg: false` → `true` ở
`scripts/brand/build.js` (dòng ghi `logo.svg`) và trong `marks.generated` block,
rồi chạy lại build.

## Website

`src/components/brand/marks.generated.ts` được build.js sinh ra và
`src/components/brand/Logo.tsx` nhúng thẳng vector vào trang — không tải ảnh,
không chớp font, nét ở mọi devicePixelRatio.

```tsx
<Logo variant="compact" />              // navbar, cao 26 px
<Logo variant="full" />                 // footer / hero, cao 64 px
<Logo variant="wordmark" height={40} />
<Logo variant="full" onDark />          // nền tối
```

Mỗi lần dựng dùng một hậu tố id riêng (`useId`) để nhiều logo trên cùng trang
không giẫm lên gradient/mask của nhau.

## Facebook — `assets-facebook/`

| Tệp | Kích thước | Ghi chú |
| --- | --- | --- |
| `fb-avatar-1080-gradient.png` | 1080 × 1080 | Ảnh đại diện page. Nền gradient thương hiệu, chữ trắng — tương phản cao nhất trên feed. **Nên dùng bản này.** |
| `fb-avatar-1080-navy.png` | 1080 × 1080 | Nền xanh đêm, trầm hơn. |
| `fb-avatar-1080-trang.png` | 1080 × 1080 | Nền trắng, chữ gradient, có viền mảnh để không tan vào nền feed. |
| `fb-cover-1640x856.png` | 1640 × 856 | Ảnh bìa page, dùng được cho cả máy tính lẫn điện thoại. |
| `fb-cover-1640x624.png` | 1640 × 624 | Đúng gấp đôi khung máy tính (820 × 312). |
| `fb-cover-vung-an-toan.png` | 1640 × 856 | Bản có khung hướng dẫn — **chỉ để xem, đừng đăng.** |
| `fb-post-1080x1080.png` | 1080 × 1080 | Bài đăng vuông. |
| `fb-story-1080x1920.png` | 1080 × 1920 | Story / Reels. |
| `fb-link-1200x630.png` | 1200 × 630 | Ảnh xem trước khi chia sẻ link (bản sao của `public/og.png`). |

Hai điều đã tính sẵn:

- **Ảnh đại diện dùng wordmark TE2SR**, không dùng monogram — avatar là chỗ
  người ta nhìn thấy thương hiệu, chữ viết tắt không nói lên tên.
- **Ảnh bìa bị cắt khác nhau tuỳ thiết bị.** Mọi chữ nằm gọn trong hộp 1092 × 540
  ở chính giữa — xem `fb-cover-vung-an-toan.png` để hình dung.

## Đa nền tảng — `assets-social/`

Sinh bằng `npm run brand:social`. 40 tệp, chia thư mục theo nền tảng.

| Thư mục | Có gì |
| --- | --- |
| `instagram/` | Avatar (3 nền), bài vuông 1080, bài dọc 1080×1350, story 1080×1920 |
| `tiktok/` | Avatar, bìa video 1080×1920 |
| `threads/` | Avatar, bài dọc 1080×1350 |
| `linkedin/` | Logo 400, bìa trang công ty 1128×191, bìa cá nhân 1584×396, bài đăng 1200×627 |
| `x/` | Avatar 400, header 1500×500, bài đăng 1600×900 |
| `youtube/` | Avatar 800, banner 2560×1440, bản có khung vùng an toàn, thumbnail 1280×720 |
| `zalo/` | Avatar 500, bìa 1200×600 |
| `email/` | Dải chữ ký 600×160 |
| `web/` | Thẻ Twitter 1200×600, OG vuông 1200×1200 |
| `in-an/` | Danh thiếp 85×55 mm @300 dpi, mặt trước và mặt sau |

Ba thứ đã tính sẵn, đừng chỉnh tay kẻo hỏng:

- **Ảnh đại diện dùng wordmark TE2SR ở mọi nền tảng.** Wordmark rộng gấp ~4,6 lần chiều cao; trong khung bị cắt tròn nó chỉ nằm lọt nếu w² + h² ≤ D², nên bề ngang lấy 80 % đường kính. Ở cỡ hiển thị 176 px của trang Facebook thì đọc rõ, 96 px vẫn được, 40 px (avatar bình luận) thì thành vệt màu — giới hạn của chữ dài trong khung tròn nhỏ, không tránh được.
- **Banner YouTube trên TV chỉ hiện vùng 1546 × 423 chính giữa.** Mọi chữ nằm trong đó — xem `banner-vung-an-toan.png` để hình dung, file này **chỉ để xem, đừng đăng**.
- **Cỡ chữ co theo bề ngang thật, không theo chiều cao.** Khổ vuông và khổ thấp như bìa LinkedIn 1128×191 nếu tính theo chiều cao sẽ tràn chữ ra ngoài. Hàm `fit()` trong `platforms.js` lo việc này; nếu chỗ còn lại quá hẹp thì chữ bị bỏ hẳn thay vì đè lên logo.

## Ảnh bìa — `assets-social/bia/`

Sinh bằng `npm run brand:bia`. **2 ngôn ngữ × 4 kiểu nền × 9 cỡ = 72 ảnh**, cộng 4 bản có khung hướng dẫn.

- `assets-social/bia/` — tiếng Việt
- `assets-social/bia-en/` — tiếng Anh, dùng cho page Facebook vì page nhắm khách quốc tế

Chữ nằm trong bảng `TEXTS` đầu `covers.js`, sửa một chỗ là cả hai ngôn ngữ đổi theo.

| Kiểu nền | Khi nào dùng |
| --- | --- |
| `navy/` | Xanh đêm + hai vệt sáng. Trầm, dễ đọc — **mặc định nên dùng cái này**. |
| `sang/` | Nền sáng, chữ navy. Khi muốn cảm giác nhẹ, sạch. |
| `gradient/` | Gradient thương hiệu tràn viền, logo trắng đặc. Nổi nhất trên feed, hợp chạy quảng cáo. |
| `luoi/` | Xanh đêm + lưới mảnh. Có kết cấu, hợp nội dung kỹ thuật. |

Mỗi kiểu có đủ 9 cỡ: bìa trang Facebook 1640×856 và 1640×624, bìa sự kiện 1920×1005, bìa nhóm 1640×856, bìa LinkedIn công ty 1128×191 và cá nhân 1584×396, header X 1500×500, banner YouTube 2560×1440, bìa Zalo 1200×600.

Thư mục `_vung-an-toan/` là bản kèm khung hướng dẫn cho bìa Facebook và banner YouTube — **chỉ để xem, đừng đăng**.

Trên nền gradient, logo chuyển sang **bản trắng đặc** thay vì bản gradient: gradient đặt trên gradient thì chữ chìm hẳn. Đây là lý do bộ nhận diện nào cũng cần một bản đơn sắc.

## Màu

| Vai trò | Mã |
| --- | --- |
| Navy sâu (đầu và cuối wordmark) | `#0A1F4E` → `#0E1636` |
| Xanh dương | `#1E6BEB` |
| Cyan (chữ E) | `#22A7F5` |
| Tím (chữ 2) | `#6D3BF5` |
| Chữ “TESTER” trên nền sáng | `#1B2A4E` |
| Đường kẻ nền sáng / nền tối | `#C7CEDA` / `#3C4766` |

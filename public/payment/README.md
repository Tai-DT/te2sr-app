# Thư mục ảnh thanh toán

| File | Dùng cho | Khai báo trong `src/lib/payment.ts` |
|---|---|---|
| `qr-bank.png` | QR chuyển khoản VietQR (Timo/BVBank) | `qrImage: '/payment/qr-bank.png'` ✅ đã cấu hình |
| `qr-binance.png` | QR Binance (nếu muốn thêm) | `qrImage: '/payment/qr-binance.png'` |

## ⚠️ Ảnh QR KHÔNG được commit vào git

`.gitignore` có luật `*.png` (ngoại lệ chỉ áp dụng cho `public/*.png`), nên
`public/payment/qr-bank.png` **nằm ngoài git**. Đây là mặc định an toàn: số tài
khoản của bạn không bị ghi vĩnh viễn vào lịch sử một repo GitHub công khai.

**Hệ quả cần nhớ:** nếu clone repo về máy khác (hoặc CI build), thư mục này sẽ
trống → trang thanh toán tự ẩn phần ảnh và chỉ hiện số tài khoản dạng chữ (vẫn
chuyển khoản được). Muốn có lại QR thì **chép tay ảnh vào đây trước khi deploy**.

`./deploy.sh` sẽ tự kiểm tra và cảnh báo nếu thiếu ảnh.

Nếu bạn muốn commit ảnh QR (chấp nhận công khai vĩnh viễn trên GitHub — dù sao
số tài khoản cũng đã hiển thị công khai trên te2sr.com), thêm dòng này vào
`.gitignore`:

```
!public/payment/*.png
```

## Yêu cầu ảnh

- PNG vuông, tối thiểu 512×512, nền trắng, chừa vùng yên tĩnh quanh mã.
- Ảnh hiện tại: 800×800, cắt từ QR gốc do app Timo xuất ra.
- Để `qrImage: ''` trong `src/lib/payment.ts` nếu muốn tắt hẳn phần ảnh.

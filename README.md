# TE2SR Platform

Nền tảng **Kiểm thử App → Đăng tải Store → Tăng đánh giá 5★** + công cụ **AI phân tích thiết kế UI/UX**. Hỗ trợ 8 ngôn ngữ.

## Kiến trúc

```
┌──────────────────────────┐         HTTPS / JSON          ┌──────────────────────────┐
│  Frontend (Next.js 14)   │  ── Bearer JWT ─────────────► │  Backend (Node + Hono)   │
│  static export → out/    │                                │  REST API                │
│  React · TS · Tailwind   │ ◄───────────────────────────  │  PBKDF2 + JWT (HS256)     │
└──────────────────────────┘                                └────────────┬─────────────┘
                                                                          │ mysql2 + TLS
                                                                          ▼
                                                             ┌──────────────────────────┐
                                                             │  MySQL 8 (Aiven)          │
                                                             │  users · orders ·         │
                                                             │  order_messages · reports │
                                                             └──────────────────────────┘
```

- **Frontend** — `Next.js 14 (App Router, output: 'export')`, React 18, TypeScript, Tailwind CSS. Xuất tĩnh (`out/`), gọi backend qua `NEXT_PUBLIC_API_URL`.
- **Backend** — `Node.js + Hono` (`@hono/node-server`), `mysql2` (TLS tới Aiven). Xác thực JWT thật, băm mật khẩu PBKDF2 (Web Crypto), phân quyền admin theo `ADMIN_EMAILS`.
- **DB** — MySQL 8. Không còn dữ liệu in-memory; mọi thứ đều persist.

## Chức năng

- Đăng ký / đăng nhập bằng **email + mật khẩu** (băm PBKDF2) hoặc **Google OAuth** (xác minh `id_token`).
- Đơn hàng dịch vụ: tạo (khách hoặc user), theo dõi trạng thái, 2 đợt thanh toán (50% + 50%), giá theo gói ($50 Google Play / $100 cả 2 store / Liên hệ).
- **Cổng khách hàng** — mỗi user chỉ thấy đơn của mình; **Admin** thấy tất cả + đổi trạng thái + đánh dấu thanh toán + thống kê doanh thu.
- **Chat hỗ trợ theo từng đơn** — lưu vào DB (`order_messages`).
- **AI Design Analyzer** — chấm điểm bố cục / typography / tương phản / a11y + gợi ý; lưu lịch sử cho user đăng nhập.

## Yêu cầu

- Node.js ≥ 20
- Một CSDL MySQL 8 (repo cấu hình sẵn cho Aiven)

## Cài đặt & chạy (local)

### 1) Backend

```bash
cd backend
cp .env.example .env        # điền DATABASE_URL, JWT_SECRET, ADMIN_EMAILS, GOOGLE_CLIENT_ID...
npm install
npm run db:init             # tạo bảng + seed đơn demo
npm run dev                 # http://localhost:8787
```

Biến môi trường (`backend/.env`):

| Biến | Ý nghĩa |
|---|---|
| `DATABASE_URL` | Chuỗi kết nối MySQL (`mysql://user:pass@host:port/db?ssl-mode=REQUIRED`) |
| `DB_CA_PATH` | Đường dẫn CA cert cho TLS (Aiven) — vd `./certs/aiven-ca.pem` |
| `JWT_SECRET` | Khoá ký JWT — sinh: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `ADMIN_EMAILS` | Danh sách email được cấp quyền admin (phân tách bằng dấu phẩy) |
| `GOOGLE_CLIENT_ID` | Google OAuth web client id (để xác minh audience id_token) |
| `ALLOWED_ORIGINS` | Origin được phép CORS (phân tách dấu phẩy) hoặc `*` |
| `PORT` | Cổng API (mặc định 8787) |

### 2) Frontend

```bash
# tại thư mục gốc repo
cp .env.local.example .env.local   # đặt NEXT_PUBLIC_API_URL=http://localhost:8787
npm install
npm run dev                        # http://localhost:3000
```

> Ai muốn admin: đăng ký/đăng nhập bằng email nằm trong `ADMIN_EMAILS` → tự động lên quyền admin và chuyển vào `/admin`.

## Build & deploy

```bash
# Frontend → static export (thư mục out/), host trên bất kỳ CDN/static host nào
npm run build

# Backend → chạy như một dịch vụ Node (Railway/Render/Fly/VPS)
cd backend && npm start
```

Production: đặt `NEXT_PUBLIC_API_URL=https://te2sr.com` (hoặc domain backend của bạn) trước khi `npm run build`, và thêm origin frontend vào `ALLOWED_ORIGINS` của backend.

## API (tóm tắt)

| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| POST | `/api/auth/register` | công khai | Đăng ký (email + mật khẩu) |
| POST | `/api/auth/login` | công khai | Đăng nhập |
| POST | `/api/auth/google` | công khai | Đăng nhập Google (id_token) |
| GET | `/api/auth/me` | user | Thông tin phiên |
| GET | `/api/orders` | user | Đơn của tôi (admin: tất cả) |
| POST | `/api/orders` | công khai | Tạo đơn |
| GET | `/api/orders/:id` | chủ đơn / admin | Chi tiết đơn |
| PATCH | `/api/orders/:id/status` | admin | Đổi trạng thái |
| PATCH | `/api/orders/:id/payment` | admin | Đánh dấu thanh toán đợt 1/2 |
| GET/POST | `/api/orders/:id/messages` | chủ đơn / admin | Chat theo đơn |
| POST | `/api/analyze-design` | công khai | Phân tích thiết kế |
| GET | `/api/reports` | user | Lịch sử báo cáo |
| GET | `/api/admin/stats` | admin | Thống kê |

## Email (Cloudflare Email Service)

Backend gửi email giao dịch từ `admin@te2sr.com` qua **Cloudflare Email Sending REST API** (vì backend là Node, không phải Worker). Nếu chưa cấu hình, các lệnh gửi mail **tự bỏ qua** — không ảnh hưởng luồng đơn hàng. Kiểm tra bằng `GET /health` → `"mail": true/false`.

Email tự động: **đơn mới** (xác nhận cho khách + báo `admin@te2sr.com`), **đổi trạng thái** (báo khách).

### Gửi email (transactional)
1. Đảm bảo domain `te2sr.com` đã nằm trong tài khoản Cloudflare.
2. Onboard domain cho Email Sending (thêm sẵn bản ghi SPF/DKIM):
   ```bash
   npx wrangler email sending enable te2sr.com
   ```
   *(hoặc Dashboard → Email → Email Sending)*
3. Tạo **API Token** (Dashboard → My Profile → API Tokens) có quyền **Email Sending → Send**. Điền vào `backend/.env`:
   ```
   CLOUDFLARE_ACCOUNT_ID=<account id>
   CLOUDFLARE_API_TOKEN=<token>
   MAIL_FROM=admin@te2sr.com
   MAIL_ADMIN=admin@te2sr.com
   ```
4. Khởi động lại backend → `GET /health` phải trả `"mail": true`.

### Nhận email tại admin@te2sr.com (Email Routing)
1. Dashboard → `te2sr.com` → **Email → Email Routing → Enable** (tự thêm MX + TXT).
2. Thêm địa chỉ tuỳ chỉnh `admin@te2sr.com` → **forward** tới hộp thư thật của bạn, rồi **xác minh** qua email Cloudflare gửi.

> Email Sending chỉ dành cho email giao dịch (không dùng gửi hàng loạt/marketing).

## Bảo mật

- `backend/.env`, `backend/certs/*.pem`, `.env.local` **đã được gitignore** — không commit.
- Quyền admin **chỉ do server quyết định** qua `ADMIN_EMAILS` (client không thể tự phong).
- Mật khẩu băm PBKDF2-SHA256 (100k vòng, salt ngẫu nhiên). Phiên dùng JWT HS256.

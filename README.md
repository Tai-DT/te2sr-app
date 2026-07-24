# TE2SR Platform

Nền tảng **Kiểm thử App → Đăng tải Store → Tăng đánh giá 5★** + công cụ **AI phân tích thiết kế UI/UX**. Hỗ trợ nhiều ngôn ngữ. **Chạy hoàn toàn trên Cloudflare.**

- **Frontend (live):** https://te2sr.com — Cloudflare Pages (project `te2sr`)
- **Backend (live):** https://api.te2sr.com — Cloudflare Worker + D1

## Kiến trúc (all-Cloudflare)

```
┌────────────────────────────┐      HTTPS / JSON + Bearer JWT      ┌────────────────────────────┐
│  Frontend                  │  ────────────────────────────────► │  Backend                   │
│  Next.js 14 static export  │                                     │  Cloudflare Worker (Hono)  │
│  → Cloudflare Pages        │ ◄────────────────────────────────  │  PBKDF2 + JWT (HS256)      │
│  te2sr.com                 │                                     │  api.te2sr.com             │
└────────────────────────────┘                                     └─────────────┬──────────────┘
                                                                                  │ binding env.DB
                                                                                  ▼
                                                                     ┌────────────────────────────┐
                                                                     │  Cloudflare D1 (SQLite)     │
                                                                     │  users · orders ·           │
                                                                     │  order_messages · reports   │
                                                                     └────────────────────────────┘
```

- **Frontend** — Next.js 14 (App Router, `output: 'export'`), React, TypeScript, Tailwind. Gọi backend qua `NEXT_PUBLIC_API_URL`.
- **Backend** — Cloudflare Worker chạy Hono; dữ liệu trong **Cloudflare D1** (SQLite native, không cần DB ngoài). JWT thật, băm mật khẩu PBKDF2 (Web Crypto), admin theo `ADMIN_EMAILS`.
- **Email** — Cloudflare Email Sending (transactional, từ `admin@te2sr.com`).

## Chức năng

- Đăng ký/đăng nhập **email + mật khẩu** (PBKDF2) hoặc **Google OAuth**; đổi/đặt mật khẩu.
- Đơn dịch vụ (khách hoặc user), 2 đợt thanh toán (50%+50%), giá theo gói ($50 Google Play / $100 cả 2 store / Liên hệ).
- **Cổng khách hàng**: xem đơn của mình; **Admin**: xem tất cả + đổi trạng thái + đánh dấu thanh toán + doanh thu.
- **Chat hỗ trợ theo đơn** (lưu D1) + gần-realtime (polling 4s) + nút Zalo/WhatsApp.
- **AI Design Analyzer**: chấm điểm + gợi ý + lịch sử.

## Phát triển (local)

### Backend (Worker + D1)
```bash
cd backend
npm install
cp .dev.vars .dev.vars   # đặt JWT_SECRET cho local (đã có sẵn mẫu)
npm run db:init          # tạo bảng + seed vào D1 local
npm run dev              # wrangler dev → http://localhost:8787
```

### Frontend
```bash
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL + Google client id
npm install
npm run dev                        # http://localhost:3000
```
> Đăng nhập bằng email trong `ADMIN_EMAILS` (backend/wrangler.toml) → tự lên quyền admin.

## Deploy (Cloudflare)

```bash
# Backend → Worker + D1
cd backend
npm run db:init:remote                       # áp schema vào D1 remote (1 lần)
npx wrangler secret put JWT_SECRET           # đặt secret production
npx wrangler deploy                          # deploy Worker (custom domain api.te2sr.com)

# Frontend → Pages (project te2sr)
NEXT_PUBLIC_API_URL=https://api.te2sr.com NEXT_PUBLIC_GOOGLE_CLIENT_ID=<id> npm run build
npx wrangler pages deploy out --project-name=te2sr --branch=main
```

## API (tóm tắt)

| Method | Endpoint | Quyền |
|---|---|---|
| POST | `/api/auth/register` · `/login` · `/google` | công khai |
| GET/POST | `/api/auth/me` · `/change-password` | user |
| GET/POST | `/api/orders` | user (list theo quyền) / công khai (tạo) |
| GET | `/api/orders/:id` | chủ đơn / admin |
| PATCH | `/api/orders/:id/status` · `/payment` | admin |
| GET/POST | `/api/orders/:id/messages` | chủ đơn / admin |
| POST/GET | `/api/analyze-design` · `/api/reports` | công khai / user |
| GET | `/api/admin/stats` | admin |

## Email (Cloudflare Email Sending)

Gửi email giao dịch từ `admin@te2sr.com`. Bật bằng cách set secret + var cho Worker:
```bash
cd backend
npx wrangler secret put CLOUDFLARE_API_TOKEN     # token có quyền Email Sending → Send
# CLOUDFLARE_ACCOUNT_ID / MAIL_* đã có trong wrangler.toml [vars]
```
Onboard domain (1 lần): `npx wrangler email sending enable te2sr.com`. Nhận thư tại `admin@te2sr.com`: bật **Email Routing** cho zone te2sr.com và forward tới hộp thư thật. `GET /health` báo `"mail": true/false`.

## Bảo mật

- Secrets (`.dev.vars`, `.env*.local`) **gitignored**; secret production đặt qua `wrangler secret put`.
- Quyền admin **chỉ do server quyết định** qua `ADMIN_EMAILS`.
- Mật khẩu băm PBKDF2-SHA256 (100k vòng, salt ngẫu nhiên); phiên JWT HS256.

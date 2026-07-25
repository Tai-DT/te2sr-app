#!/usr/bin/env bash
# TE2SR — build & deploy frontend lên Cloudflare Pages (te2sr.com)
#   ./deploy.sh            → build + deploy frontend
#   ./deploy.sh backend    → deploy thêm cả worker backend
set -euo pipefail
cd "$(dirname "$0")"

QR="public/payment/qr-bank.png"

echo "▸ Kiểm tra ảnh QR thanh toán…"
if [ -f "$QR" ]; then
  echo "  ✅ có $QR ($(wc -c < "$QR" | tr -d ' ') bytes)"
else
  echo "  ⚠️  CHƯA có $QR — trang thanh toán sẽ chỉ hiện số tài khoản dạng chữ."
  echo "     (Vẫn deploy được; lưu ảnh vào đó rồi chạy lại là xong.)"
fi

if [ "${1:-}" = "backend" ]; then
  echo ""
  echo "▸ Deploy backend worker…"
  ( cd backend && npx wrangler deploy )
fi

echo ""
echo "▸ Build frontend…"
npm run build

echo ""
echo "▸ Deploy lên Cloudflare Pages…"
npx wrangler pages deploy out --project-name=te2sr --commit-dirty=true

echo ""
echo "▸ Smoke test…"
sleep 3
for p in "" /goi/app-store /google-play-closed-testing /sitemap.xml; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "https://te2sr.com$p?cb=$RANDOM" --max-time 20)
  printf "  %-32s → %s\n" "te2sr.com$p" "$code"
done
code=$(curl -s -o /dev/null -w '%{http_code}' "https://te2sr-backend.taidt3004.workers.dev/health" --max-time 20)
echo "  backend /health                  → $code"
echo ""
echo "✅ Xong: https://te2sr.com"

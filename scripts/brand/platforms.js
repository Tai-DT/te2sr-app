#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// TE2SR — bộ ảnh thương hiệu cho mọi nền tảng.
//
//   node scripts/brand/platforms.js
//
// Xuất vào assets-social/<nền-tảng>/. Cùng nguồn vector với logo và favicon,
// nên đổi logo một chỗ là cả bộ này đổi theo.
//
// Mỗi nền tảng cắt ảnh một kiểu. Ba quy tắc được tôn trọng ở đây:
//   · Ảnh đại diện luôn bị cắt tròn  → dấu hiệu nằm gọn trong đường tròn nội tiếp.
//   · Ảnh bìa bị cắt khác nhau tuỳ thiết bị → chữ nằm trong hộp an toàn ở giữa.
//   · Banner YouTube hiển thị trên TV chỉ thấy vùng 1546 × 423 chính giữa.
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const L = require('./lockups');
const G = require('./glyphs');

const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'assets-social');
const TMP = path.join(ROOT, '.brand-tmp-social');
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

const n = G.n;
const doc = (w, h, defs, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
  `<defs>${defs}</defs>${body}</svg>`;

const textEl = (x, y, size, weight, fill, anchor, letter, content) =>
  `<text x="${n(x)}" y="${n(y)}" font-family="${FONT}" font-size="${n(size)}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${n(letter)}">${content}</text>`;

const bgDefs =
  L.navyGradient('bgNavy') +
  L.tileGradient('tile') +
  `<radialGradient id="glowA" cx="0.16" cy="0.08" r="0.85"><stop offset="0" stop-color="#2E8BFF" stop-opacity="0.36"/><stop offset="1" stop-color="#2E8BFF" stop-opacity="0"/></radialGradient>` +
  `<radialGradient id="glowB" cx="0.92" cy="0.96" r="0.8"><stop offset="0" stop-color="#6D3BF5" stop-opacity="0.34"/><stop offset="1" stop-color="#6D3BF5" stop-opacity="0"/></radialGradient>` +
  `<radialGradient id="sheen" cx="0.28" cy="0.18" r="0.9"><stop offset="0" stop-color="#fff" stop-opacity="0.2"/><stop offset="0.62" stop-color="#fff" stop-opacity="0"/></radialGradient>`;

const darkBg = (w, h) =>
  `<rect width="${w}" height="${h}" fill="url(#bgNavy)"/>` +
  `<rect width="${w}" height="${h}" fill="url(#glowA)"/>` +
  `<rect width="${w}" height="${h}" fill="url(#glowB)"/>`;

// Đặt một lockup vào giữa (cx, cy) với bề ngang mong muốn.
const place = (s, cx, cy, targetW) => {
  const k = targetW / s.w;
  return `<g transform="translate(${n(cx - targetW / 2)} ${n(cy - (s.h * k) / 2)}) scale(${n(k)})">${s.svg}</g>`;
};

// Ước lượng bề rộng chữ để không bao giờ tràn khung: Helvetica ở nét đậm vừa
// có bề rộng trung bình ≈ 0,52 em mỗi ký tự. Dấu tiếng Việt không làm rộng thêm.
const fit = (txt, maxW, cap) => {
  const len = txt.replace(/&amp;/g, '&').length;
  return Math.min(cap, maxW / (0.52 * len));
};

const TAGLINE = 'Kiểm thử ứng dụng · Đăng tải App Store &amp; Google Play';
const SUBLINE = '12 tester · 14 ngày · Đúng chính sách Google Play';
const DOMAIN = 'TE2SR.COM';

// ── Các kiểu bố cục ─────────────────────────────────────────────────────────

// Ảnh đại diện: wordmark TE2SR trong khung bị cắt tròn — xem avatarBody().
function avatar(size, kind) {
  const a = L.avatarBody({ size, kind, id: 'av' + kind + size });
  return doc(size, size, a.defs, a.body);
}

// Khổ vuông / ngang: lockup giữa, hai dòng chữ dưới.
function poster(w, h, opts) {
  const o = opts || {};
  const s = L.stacked({ id: 'ps', onDark: true });
  const lockW = Math.min(w * (o.lockRatio || 0.62), h * 1.5);
  const k = lockW / s.w;
  const lockH = s.h * k;
  const gap = h * 0.055;
  const t1 = fit(TAGLINE, w * 0.86, h * 0.038);
  const t2 = fit(SUBLINE, w * 0.82, h * 0.029);
  const t3 = Math.min(h * 0.028, w * 0.032);
  const blockH = lockH + gap + t1 * 1.2 + (o.sub === false ? 0 : t2 * 2) + t3 * 2.4;
  const top = (h - blockH) / 2 + (o.shiftY || 0);
  let y = top + lockH;
  let body = darkBg(w, h) + place(s, w / 2, top + lockH / 2, lockW);
  y += gap + t1;
  body += textEl(w / 2, y, t1, '600', '#C8D6F5', 'middle', 0, TAGLINE);
  if (o.sub !== false) {
    y += t2 * 2;
    body += textEl(w / 2, y, t2, '500', '#7E93C4', 'middle', 0, SUBLINE);
  }
  y += t3 * 2.4;
  body += textEl(w / 2, y, t3, '700', '#5B7BC7', 'middle', t3 * 0.2, DOMAIN);
  if (o.guide) body += guideBox(w, h, o.guide[0], o.guide[1], o.guide[2]);
  return doc(w, h, bgDefs + s.defs, body);
}

// Khổ dọc (story / reels): lockup ở phần ba trên, chữ dưới.
function story(w, h) {
  const s = L.stacked({ id: 'st', onDark: true });
  const lockW = w * 0.7;
  const k = lockW / s.w;
  const lockH = s.h * k;
  const cy = h * 0.4;
  let body = darkBg(w, h) + place(s, w / 2, cy, lockW);
  const t1 = fit(TAGLINE, w * 0.9, w * 0.042);
  const t2 = fit(SUBLINE, w * 0.86, w * 0.032);
  let y = cy + lockH / 2 + h * 0.062;
  body += textEl(w / 2, y, t1, '600', '#C8D6F5', 'middle', 0, TAGLINE);
  y += t1 * 1.9;
  body += textEl(w / 2, y, t2, '500', '#7E93C4', 'middle', 0, SUBLINE);
  body += textEl(w / 2, h * 0.88, w * 0.034, '700', '#5B7BC7', 'middle', w * 0.006, DOMAIN);
  return doc(w, h, bgDefs + s.defs, body);
}

// Khổ rất ngang và thấp (bìa LinkedIn, chữ ký email): lockup ngang, canh trái.
function banner(w, h, opts) {
  const o = opts || {};
  const s = o.wordmark ? L.wordmark({ id: 'bw', onDark: true }) : L.inline({ id: 'bn', onDark: true });
  const lockH = h * (o.lockRatio || 0.38);
  const k = lockH / s.h;
  const lockW = s.w * k;
  const padX = w * (o.padRatio || 0.05);
  let body =
    darkBg(w, h) +
    `<g transform="translate(${n(padX)} ${n((h - lockH) / 2)}) scale(${n(k)})">${s.svg}</g>`;
  // chữ bên phải chỉ được dùng phần còn lại sau khi trừ logo và lề
  const txt = o.right || TAGLINE;
  const avail = w - padX * 2 - lockW - w * 0.04;
  const fs = fit(txt, avail, h * 0.2);
  if (fs >= h * 0.085) {
    body += textEl(w - padX, h / 2 + fs * 0.35, fs, '600', '#8CA0C6', 'end', fs * 0.05, txt);
  }
  if (o.guide) body += guideBox(w, h, o.guide[0], o.guide[1], o.guide[2]);
  return doc(w, h, bgDefs + s.defs, body);
}

// Banner YouTube: khung 2560×1440 nhưng trên TV chỉ thấy 1546×423 ở giữa.
function youtubeBanner(w, h, guide) {
  const s = L.stacked({ id: 'yt', onDark: true });
  const safeW = 1546;
  const safeH = 423;
  const lockW = safeW * 0.42;
  const k = lockW / s.w;
  const lockH = s.h * k;
  const cy = h / 2 - lockH * 0.18;
  let body = darkBg(w, h) + place(s, w / 2, cy, lockW);
  body += textEl(w / 2, cy + lockH / 2 + 62, 34, '600', '#C8D6F5', 'middle', 0, TAGLINE);
  body += textEl(w / 2, cy + lockH / 2 + 116, 27, '700', '#5B7BC7', 'middle', 5, DOMAIN);
  if (guide) body += guideBox(w, h, safeW, safeH, 'VÙNG AN TOÀN TV 1546 × 423');
  return doc(w, h, bgDefs + s.defs, body);
}

function guideBox(w, h, sw, sh, label) {
  const x = (w - sw) / 2;
  const y = (h - sh) / 2;
  return (
    `<rect x="${n(x)}" y="${n(y)}" width="${n(sw)}" height="${n(sh)}" fill="none" stroke="#00E5A0" stroke-width="${n(Math.max(2, w * 0.0018))}" stroke-dasharray="${n(w * 0.008)} ${n(w * 0.006)}"/>` +
    textEl(x + w * 0.005, y - h * 0.014, Math.max(14, w * 0.009), '700', '#00E5A0', 'start', 1, label)
  );
}

// Danh thiếp 85 × 55 mm ở 300 dpi.
function namecard(front) {
  const w = 1004;
  const h = 650;
  const s = L.stacked({ id: front ? 'ncf' : 'ncb', onDark: front });
  if (front) {
    const lockW = w * 0.46;
    return doc(w, h, bgDefs + s.defs, darkBg(w, h) + place(s, w / 2, h / 2, lockW));
  }
  const wm = L.wordmark({ id: 'ncw', onDark: false });
  const k = (w * 0.3) / wm.w;
  let body = `<rect width="${w}" height="${h}" fill="#fff"/>`;
  body += `<g transform="translate(${n(w * 0.09)} ${n(h * 0.14)}) scale(${n(k)})">${wm.svg}</g>`;
  const lines = [
    ['Kiểm thử ứng dụng &amp; đăng tải lên store', 30, '#1B2A4E', '600'],
    ['12 tester · 14 ngày · đúng chính sách Google Play', 25, '#6B7B99', '400'],
  ];
  let y = h * 0.44;
  for (const [t, size, fill, weight] of lines) {
    body += textEl(w * 0.09, y, size, weight, fill, 'start', 0, t);
    y += size * 1.8;
  }
  body += textEl(w * 0.09, h * 0.83, 28, '700', '#1E6BEB', 'start', 3, 'TE2SR.COM');
  return doc(w, h, wm.defs + bgDefs, body);
}

// ── Bảng nền tảng ───────────────────────────────────────────────────────────
// [tệp, rộng, cao, kiểu, tuỳ chọn]
const PLATFORMS = {
  instagram: [
    ['avatar-1080.png', 1080, 1080, 'avatar-gradient'],
    ['bai-vuong-1080x1080.png', 1080, 1080, 'poster'],
    ['bai-doc-1080x1350.png', 1080, 1350, 'poster'],
    ['story-1080x1920.png', 1080, 1920, 'story'],
  ],
  tiktok: [
    ['avatar-1080.png', 1080, 1080, 'avatar-gradient'],
    ['bia-video-1080x1920.png', 1080, 1920, 'story'],
  ],
  linkedin: [
    ['logo-400.png', 400, 400, 'avatar-gradient'],
    ['bia-trang-cong-ty-1128x191.png', 1128, 191, 'banner', { lockRatio: 0.4, right: '12 tester · 14 ngày · te2sr.com' }],
    ['bia-ca-nhan-1584x396.png', 1584, 396, 'banner', { lockRatio: 0.28, padRatio: 0.06, right: '12 tester · 14 ngày · te2sr.com' }],
    ['bai-dang-1200x627.png', 1200, 627, 'poster'],
  ],
  x: [
    ['avatar-400.png', 400, 400, 'avatar-gradient'],
    ['header-1500x500.png', 1500, 500, 'poster', { lockRatio: 0.4, sub: false }],
    ['bai-dang-1600x900.png', 1600, 900, 'poster'],
  ],
  youtube: [
    ['avatar-800.png', 800, 800, 'avatar-gradient'],
    ['banner-2560x1440.png', 2560, 1440, 'youtube'],
    ['banner-vung-an-toan.png', 2560, 1440, 'youtube-guide'],
    ['thumbnail-1280x720.png', 1280, 720, 'poster'],
  ],
  zalo: [
    ['avatar-500.png', 500, 500, 'avatar-gradient'],
    ['bia-1200x600.png', 1200, 600, 'poster'],
  ],
  threads: [
    ['avatar-1080.png', 1080, 1080, 'avatar-gradient'],
    ['bai-dang-1080x1350.png', 1080, 1350, 'poster'],
  ],
  email: [['chu-ky-600x160.png', 600, 160, 'banner', { wordmark: true, lockRatio: 0.34, padRatio: 0.05, right: 'te2sr.com' }]],
  web: [
    ['the-twitter-1200x600.png', 1200, 600, 'poster'],
    ['og-vuong-1200x1200.png', 1200, 1200, 'poster'],
  ],
  'in-an': [
    ['danh-thiep-mat-truoc.png', 1004, 650, 'namecard-front'],
    ['danh-thiep-mat-sau.png', 1004, 650, 'namecard-back'],
  ],
};

const AVATAR_KINDS = ['gradient', 'navy', 'trang'];

// ── Xuất ────────────────────────────────────────────────────────────────────
fs.mkdirSync(TMP, { recursive: true });
const written = [];

function emit(dir, name, svg, w, h) {
  const tmp = path.join(TMP, dir.replace(/\//g, '_') + '_' + name.replace('.png', '.svg'));
  fs.writeFileSync(tmp, svg);
  const outDir = path.join(OUT, dir);
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, name);
  execFileSync('rsvg-convert', ['-w', String(w), '-h', String(h), tmp, '-o', out]);
  written.push(path.relative(ROOT, out));
}

for (const [platform, items] of Object.entries(PLATFORMS)) {
  for (const [name, w, h, kind, opts] of items) {
    if (kind === 'avatar-gradient') {
      for (const k of AVATAR_KINDS) {
        emit(platform, name.replace('.png', '-' + k + '.png'), avatar(w, k), w, h);
      }
    } else if (kind === 'poster') {
      emit(platform, name, poster(w, h, opts), w, h);
    } else if (kind === 'story') {
      emit(platform, name, story(w, h), w, h);
    } else if (kind === 'banner') {
      emit(platform, name, banner(w, h, opts), w, h);
    } else if (kind === 'youtube') {
      emit(platform, name, youtubeBanner(w, h, false), w, h);
    } else if (kind === 'youtube-guide') {
      emit(platform, name, youtubeBanner(w, h, true), w, h);
    } else if (kind === 'namecard-front') {
      emit(platform, name, namecard(true), w, h);
    } else if (kind === 'namecard-back') {
      emit(platform, name, namecard(false), w, h);
    }
  }
}

fs.rmSync(TMP, { recursive: true, force: true });
console.log('Đã sinh ' + written.length + ' tệp trong assets-social/:');
for (const f of written.sort()) console.log('  ' + f);

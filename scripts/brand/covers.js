#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// TE2SR — ảnh bìa cho mọi nền tảng, 4 kiểu nền để chọn.
//
//   node scripts/brand/covers.js
//
// Xuất vào assets-social/bia/<kiểu-nền>/<nền-tảng>-<cỡ>.png
//
// Cùng nguồn vector với logo nên đổi logo là cả bộ bìa đổi theo.
// Hai ràng buộc luôn được tôn trọng:
//   · Banner YouTube trên TV chỉ hiện vùng 1546 × 423 chính giữa.
//   · Bìa Facebook bị cắt khác nhau tuỳ thiết bị → chữ nằm trong 1092 × 540 giữa.
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const L = require('./lockups');
const G = require('./glyphs');

const ROOT = path.resolve(__dirname, '../..');
const OUT = (lang) => path.join(ROOT, 'assets-social', lang === 'en' ? 'bia-en' : 'bia');
const TMP = path.join(ROOT, '.brand-tmp-bia');
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const n = G.n;

const doc = (w, h, defs, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
  `<defs>${defs}</defs>${body}</svg>`;
const textEl = (x, y, size, weight, fill, anchor, letter, content) =>
  `<text x="${n(x)}" y="${n(y)}" font-family="${FONT}" font-size="${n(size)}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${n(letter)}">${content}</text>`;

// Ước lượng bề rộng chữ để không tràn khung (≈ 0,52 em mỗi ký tự).
const fit = (txt, maxW, cap) => Math.min(cap, maxW / (0.52 * txt.replace(/&amp;/g, '&').length));

// Page Facebook nhắm khách quốc tế nên có bản tiếng Anh; website và blog vẫn
// tiếng Việt. Hai kênh, hai vai trò — xem noi-dung-page-facebook.md.
const TEXTS = {
  vi: {
    tagline: 'Kiểm thử ứng dụng · Đăng tải App Store &amp; Google Play',
    subline: '12 tester · 14 ngày · Đúng chính sách Google Play',
    short: '12 tester · 14 ngày · te2sr.com',
    domain: 'TE2SR.COM',
  },
  en: {
    tagline: 'App testing · App Store &amp; Google Play publishing',
    subline: '12 testers · 14 days · real devices, not emulators',
    short: '12 testers · 14 days · te2sr.com',
    domain: 'TE2SR.COM',
  },
};

// ── 4 kiểu nền ──────────────────────────────────────────────────────────────
// Mỗi kiểu trả về defs, phần vẽ nền, và bảng màu chữ tương ứng.
const STYLES = {
  // A — xanh đêm + hai vệt sáng. Trầm, dễ đọc, hợp mặc định.
  navy: (w, h) => ({
    defs:
      L.navyGradient('bg') +
      `<radialGradient id="gA" cx="0.16" cy="0.06" r="0.9"><stop offset="0" stop-color="#2E8BFF" stop-opacity="0.4"/><stop offset="1" stop-color="#2E8BFF" stop-opacity="0"/></radialGradient>` +
      `<radialGradient id="gB" cx="0.9" cy="0.98" r="0.85"><stop offset="0" stop-color="#6D3BF5" stop-opacity="0.36"/><stop offset="1" stop-color="#6D3BF5" stop-opacity="0"/></radialGradient>`,
    body:
      `<rect width="${w}" height="${h}" fill="url(#bg)"/>` +
      `<rect width="${w}" height="${h}" fill="url(#gA)"/>` +
      `<rect width="${w}" height="${h}" fill="url(#gB)"/>`,
    onDark: true,
    ink: '#FFFFFF', sub: '#C8D6F5', muted: '#7E93C4', domain: '#5B7BC7',
  }),

  // B — nền sáng, chữ navy. Dùng khi trang cần cảm giác nhẹ, sạch.
  sang: (w, h) => ({
    defs:
      `<linearGradient id="bg" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#EDF2FA"/></linearGradient>` +
      `<radialGradient id="gA" cx="0.14" cy="0.1" r="0.8"><stop offset="0" stop-color="#2E8BFF" stop-opacity="0.18"/><stop offset="1" stop-color="#2E8BFF" stop-opacity="0"/></radialGradient>` +
      `<radialGradient id="gB" cx="0.92" cy="0.95" r="0.8"><stop offset="0" stop-color="#6D3BF5" stop-opacity="0.16"/><stop offset="1" stop-color="#6D3BF5" stop-opacity="0"/></radialGradient>`,
    body:
      `<rect width="${w}" height="${h}" fill="url(#bg)"/>` +
      `<rect width="${w}" height="${h}" fill="url(#gA)"/>` +
      `<rect width="${w}" height="${h}" fill="url(#gB)"/>`,
    onDark: false,
    ink: '#0F1738', sub: '#2E3C58', muted: '#6B7B99', domain: '#1E6BEB',
  }),

  // C — gradient thương hiệu tràn viền. Nổi nhất trên feed, dùng khi chạy quảng cáo.
  gradient: (w, h) => ({
    defs:
      `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1B4FD0"/><stop offset="0.45" stop-color="#2E6FF2"/><stop offset="1" stop-color="#6D3BF5"/></linearGradient>` +
      `<radialGradient id="gA" cx="0.24" cy="0.14" r="0.85"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.24"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>`,
    body: `<rect width="${w}" height="${h}" fill="url(#bg)"/><rect width="${w}" height="${h}" fill="url(#gA)"/>`,
    onDark: true,
    ink: '#FFFFFF', sub: '#DCE7FF', muted: '#B6C8F5', domain: '#CBD9FF',
    // nền đã nhiều màu ⇒ logo dùng bản trắng đặc, không dùng gradient
    lockup: { mono: '#FFFFFF', ink: '#FFFFFF', ruleColor: '#9DBBFF' },
  }),

  // D — xanh đêm + lưới mảnh. Có kết cấu, hợp nội dung kỹ thuật.
  luoi: (w, h) => {
    const step = Math.max(48, Math.round(Math.min(w, h) / 14));
    let grid = '';
    for (let gx = step; gx < w; gx += step) grid += `<rect x="${gx}" y="0" width="1" height="${h}" fill="#2E8BFF" opacity="0.07"/>`;
    for (let gy = step; gy < h; gy += step) grid += `<rect x="0" y="${gy}" width="${w}" height="1" fill="#2E8BFF" opacity="0.07"/>`;
    return {
      defs:
        L.navyGradient('bg') +
        `<linearGradient id="streak" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E8BFF" stop-opacity="0"/><stop offset="0.5" stop-color="#2E8BFF" stop-opacity="0.22"/><stop offset="1" stop-color="#6D3BF5" stop-opacity="0"/></linearGradient>`,
      body:
        `<rect width="${w}" height="${h}" fill="url(#bg)"/>` + grid +
        `<rect width="${w}" height="${h}" fill="url(#streak)"/>`,
      onDark: true,
      ink: '#FFFFFF', sub: '#C8D6F5', muted: '#7E93C4', domain: '#5B7BC7',
    };
  },
};

// ── Bố cục ──────────────────────────────────────────────────────────────────
// Khổ rất ngang và thấp (tỉ lệ ≥ 4) → logo trái, chữ phải.
// Còn lại → lockup giữa, chữ dưới, gói gọn trong hộp an toàn nếu có.
function cover(w, h, styleName, opts, lang) {
  const o = opts || {};
  const t = TEXTS[lang || 'vi'];
  const st = STYLES[styleName](w, h);
  const boxW = o.safe ? o.safe[0] : w;
  const boxH = o.safe ? o.safe[1] : h;
  const cx = w / 2;
  const cy = h / 2;
  let body = st.body;

  if (w / h >= 4) {
    const s = L.inline(Object.assign({ id: 'c' + styleName, onDark: st.onDark }, st.lockup && { mono: st.lockup.mono }));
    const lockH = h * 0.4;
    const k = lockH / s.h;
    const lockW = s.w * k;
    const padX = w * 0.05;
    body += `<g transform="translate(${n(padX)} ${n((h - lockH) / 2)}) scale(${n(k)})">${s.svg}</g>`;
    const avail = w - padX * 2 - lockW - w * 0.04;
    const fsz = fit(t.short, avail, h * 0.2);
    if (fsz >= h * 0.085) body += textEl(w - padX, cy + fsz * 0.35, fsz, '600', st.muted, 'end', fsz * 0.05, t.short);
    if (o.guide) body += guide(w, h, boxW, boxH, o.guide);
    return doc(w, h, st.defs + s.defs, body);
  }

  const s = L.stacked(Object.assign({ id: 'c' + styleName, onDark: st.onDark }, st.lockup || {}));
  const lockW = Math.min(boxW * 0.4, boxH * 1.5);
  const k = lockW / s.w;
  const lockH = s.h * k;
  const t1 = fit(t.tagline, boxW * 0.82, boxH * 0.075);
  const t2 = fit(t.subline, boxW * 0.78, boxH * 0.058);
  const t3 = Math.min(boxH * 0.055, boxW * 0.03);
  const gap = boxH * 0.1;
  const blockH = lockH + gap + t1 * 1.2 + t2 * 2 + t3 * 2.4;
  let y = cy - blockH / 2;
  const k2 = lockW / s.w;
  body += `<g transform="translate(${n(cx - lockW / 2)} ${n(y)}) scale(${n(k2)})">${s.svg}</g>`;
  y += lockH + gap + t1;
  body += textEl(cx, y, t1, '600', st.sub, 'middle', 0, t.tagline);
  y += t2 * 2;
  body += textEl(cx, y, t2, '500', st.muted, 'middle', 0, t.subline);
  y += t3 * 2.4;
  body += textEl(cx, y, t3, '700', st.domain, 'middle', t3 * 0.2, t.domain);
  if (o.guide) body += guide(w, h, boxW, boxH, o.guide);
  return doc(w, h, st.defs + s.defs, body);
}

function guide(w, h, sw, sh, label) {
  const x = (w - sw) / 2;
  const y = (h - sh) / 2;
  return (
    `<rect x="${n(x)}" y="${n(y)}" width="${n(sw)}" height="${n(sh)}" fill="none" stroke="#00E5A0" stroke-width="${n(Math.max(2, w * 0.0018))}" stroke-dasharray="${n(w * 0.008)} ${n(w * 0.006)}"/>` +
    textEl(x + w * 0.005, y - h * 0.02, Math.max(14, w * 0.009), '700', '#00E5A0', 'start', 1, label)
  );
}

// ── Danh sách bìa ───────────────────────────────────────────────────────────
// [tên tệp, rộng, cao, tuỳ chọn]
const SIZES = [
  ['facebook-trang-1640x856', 1640, 856, { safe: [1092, 540] }],
  ['facebook-trang-1640x624', 1640, 624, { safe: [1092, 460] }],
  ['facebook-su-kien-1920x1005', 1920, 1005, { safe: [1280, 640] }],
  ['facebook-nhom-1640x856', 1640, 856, { safe: [1092, 540] }],
  ['linkedin-cong-ty-1128x191', 1128, 191, null],
  ['linkedin-ca-nhan-1584x396', 1584, 396, null],
  ['x-header-1500x500', 1500, 500, null],
  ['youtube-2560x1440', 2560, 1440, { safe: [1546, 423] }],
  ['zalo-1200x600', 1200, 600, null],
];

// Bản kèm khung hướng dẫn — chỉ để xem, không đăng.
const GUIDES = [
  ['facebook-trang-1640x856', 1640, 856, { safe: [1092, 540], guide: 'VÙNG AN TOÀN 1092 × 540' }],
  ['youtube-2560x1440', 2560, 1440, { safe: [1546, 423], guide: 'VÙNG AN TOÀN TV 1546 × 423' }],
];

fs.mkdirSync(TMP, { recursive: true });
const written = [];
function emit(lang, dir, name, svg, w, h) {
  const tmp = path.join(TMP, lang + '_' + dir + '_' + name + '.svg');
  fs.writeFileSync(tmp, svg);
  const outDir = path.join(OUT(lang), dir);
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, name + '.png');
  execFileSync('rsvg-convert', ['-w', String(w), '-h', String(h), tmp, '-o', out]);
  written.push(path.relative(ROOT, out));
}

for (const lang of ['vi', 'en']) {
  for (const style of Object.keys(STYLES)) {
    for (const [name, w, h, opts] of SIZES) emit(lang, style, name, cover(w, h, style, opts, lang), w, h);
  }
  for (const [name, w, h, opts] of GUIDES) {
    emit(lang, '_vung-an-toan', name, cover(w, h, 'navy', opts, lang), w, h);
  }
}

fs.rmSync(TMP, { recursive: true, force: true });
console.log('Đã sinh ' + written.length + ' ảnh bìa (bia/ tiếng Việt, bia-en/ tiếng Anh):');
for (const f of written.sort()) console.log('  ' + f);

#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// TE2SR — sinh toàn bộ bộ nhận diện từ một nguồn vector duy nhất.
//
//   node scripts/brand/build.js
//
// Xuất ra:
//   public/          — logo SVG, favicon, app icon, ảnh chia sẻ (OG)
//   assets-facebook/ — avatar page, ảnh bìa, ảnh bài đăng, story
//
// Yêu cầu: rsvg-convert (brew install librsvg) và magick (brew install imagemagick)
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const L = require('./lockups');
const G = require('./glyphs');

const ROOT = path.resolve(__dirname, '../..');
const PUB = path.join(ROOT, 'public');
const FB = path.join(ROOT, 'assets-facebook');
const TMP = path.join(ROOT, '.brand-tmp');

for (const d of [PUB, FB, TMP]) fs.mkdirSync(d, { recursive: true });

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const doc = (w, h, defs, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
  `<defs>${defs}</defs>${body}</svg>`;

const written = [];
function writeSvg(dir, name, svg) {
  const p = path.join(dir, name);
  fs.writeFileSync(p, svg + '\n');
  written.push(path.relative(ROOT, p));
  return p;
}
function png(svgPath, outPath, w, h) {
  const args = ['-w', String(w)];
  if (h) args.push('-h', String(h));
  execFileSync('rsvg-convert', [...args, svgPath, '-o', outPath]);
  written.push(path.relative(ROOT, outPath));
}

// ═══════════════════════════════════════════════════════════════ 1. LOGO WEB ══

// Lockup xếp dọc — bản chính (chân R chuẩn) và bản trung thành với ảnh gốc.
function stackedDoc({ id, onDark, leg, pad = 0 }) {
  const s = L.stacked({ id, onDark, leg });
  const w = Math.ceil(s.w + pad * 2);
  const h = Math.ceil(s.h + pad * 2);
  return { doc: doc(w, h, s.defs, `<g transform="translate(${pad} ${pad})">${s.svg}</g>`), w, h };
}

writeSvg(PUB, 'logo.svg', stackedDoc({ id: 'a', onDark: false, leg: 'mui' }).doc);
writeSvg(PUB, 'logo-dark.svg', stackedDoc({ id: 'b', onDark: true, leg: 'mui' }).doc);
writeSvg(PUB, 'logo-play-r.svg', stackedDoc({ id: 'c', onDark: false, leg: 'goc' }).doc);

for (const [name, onDark] of [
  ['logo-wordmark.svg', false],
  ['logo-wordmark-dark.svg', true],
]) {
  const wm = L.wordmark({ id: onDark ? 'wd' : 'wl', onDark });
  writeSvg(PUB, name, doc(Math.ceil(wm.w), 100, wm.defs, wm.svg));
}

// Lockup ngang cho navbar
{
  const il = L.inline({ id: 'il' });
  writeSvg(PUB, 'logo-inline.svg', doc(Math.ceil(il.w), 100, il.defs, il.svg));
}

// PNG dự phòng (nền trong suốt)
{
  const s = stackedDoc({ id: 'p', onDark: false, leg: 'mui', pad: 12 });
  const p = path.join(TMP, 'logo-png.svg');
  fs.writeFileSync(p, s.doc);
  png(p, path.join(PUB, 'logo.png'), 1200);
  png(p, path.join(PUB, 'logo@2x.png'), 2400);
}

// ══════════════════════════════════════════════════════ 2. FAVICON / APP ICON ══

// Ô vuông bo góc kiểu iOS + monogram "T2" trắng.
function tile({ size = 512, radius = 0.2258, markRatio = 0.52, bg = 'tile', sheen = true, bar = 27, gap = 16 }) {
  const m = L.monogram({ paint: '#fff', bar, gap });
  const mw = size * markRatio;
  const s = mw / m.w;
  const mh = m.h * s;
  const defs =
    L.tileGradient('tile') +
    L.navyGradient('navy') +
    `<radialGradient id="sheen" cx="0.28" cy="0.18" r="0.9"><stop offset="0" stop-color="#fff" stop-opacity="0.22"/><stop offset="0.65" stop-color="#fff" stop-opacity="0"/></radialGradient>`;
  const body =
    `<rect width="${size}" height="${size}" rx="${G.n(size * radius)}" fill="url(#${bg})"/>` +
    (sheen ? `<rect width="${size}" height="${size}" rx="${G.n(size * radius)}" fill="url(#sheen)"/>` : '') +
    `<g transform="translate(${G.n((size - mw) / 2)} ${G.n((size - mh) / 2)}) scale(${G.n(s)})">${m.svg}</g>`;
  return doc(size, size, defs, body);
}

writeSvg(PUB, 'favicon.svg', tile({ size: 512 }));

{
  const p = path.join(TMP, 'tile.svg');
  fs.writeFileSync(p, tile({ size: 512 }));
  // Bản riêng cho favicon nhỏ: dấu hiệu to hơn, nét dày hơn, khe hẹp hơn để
  // ở 16 px hai chữ không dính vào nhau.
  const pSmall = path.join(TMP, 'tile-small.svg');
  fs.writeFileSync(pSmall, tile({ size: 512, markRatio: 0.64, bar: 31, gap: 13 }));

  for (const s of [16, 32, 48, 180, 192, 512]) {
    const out =
      s === 180
        ? path.join(PUB, 'apple-touch-icon.png')
        : s <= 48
          ? path.join(PUB, `favicon-${s}.png`)
          : path.join(PUB, `icon-${s}.png`);
    png(s <= 48 ? pSmall : p, out, s, s);
  }
  execFileSync('magick', [
    path.join(PUB, 'favicon-16.png'),
    path.join(PUB, 'favicon-32.png'),
    path.join(PUB, 'favicon-48.png'),
    path.join(PUB, 'favicon.ico'),
  ]);
  written.push('public/favicon.ico');

  // maskable: nền tràn viền, dấu hiệu nằm gọn trong vòng an toàn 80%
  const mk = path.join(TMP, 'maskable.svg');
  fs.writeFileSync(mk, tile({ size: 512, radius: 0, markRatio: 0.42 }));
  png(mk, path.join(PUB, 'icon-maskable-512.png'), 512, 512);
}

// ═════════════════════════════════════════════════ 3. NỀN CHUNG CHO ẢNH LỚN ══

// Nền xanh đêm + ánh sáng nhẹ, dùng cho OG / bìa / bài đăng.
const bgDefs =
  L.navyGradient('bgNavy') +
  `<radialGradient id="glowA" cx="0.18" cy="0.1" r="0.8"><stop offset="0" stop-color="#2E8BFF" stop-opacity="0.34"/><stop offset="1" stop-color="#2E8BFF" stop-opacity="0"/></radialGradient>` +
  `<radialGradient id="glowB" cx="0.9" cy="0.95" r="0.75"><stop offset="0" stop-color="#6D3BF5" stop-opacity="0.32"/><stop offset="1" stop-color="#6D3BF5" stop-opacity="0"/></radialGradient>`;

const darkBg = (w, h) =>
  `<rect width="${w}" height="${h}" fill="url(#bgNavy)"/>` +
  `<rect width="${w}" height="${h}" fill="url(#glowA)"/>` +
  `<rect width="${w}" height="${h}" fill="url(#glowB)"/>`;

// Đặt lockup vào giữa một vùng, trả về SVG đã canh giữa.
function centerLockup(s, cx, cy, targetW) {
  const k = targetW / s.w;
  return `<g transform="translate(${G.n(cx - targetW / 2)} ${G.n(cy - (s.h * k) / 2)}) scale(${G.n(k)})">${s.svg}</g>`;
}

const textEl = (x, y, size, weight, fill, anchor, letter, content) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${letter}">${content}</text>`;

// ── Ảnh chia sẻ 1200×630 (OG / link Facebook) ───────────────────────────────
function ogDoc() {
  const s = L.stacked({ id: 'og', onDark: true });
  return doc(
    1200,
    630,
    bgDefs + s.defs,
    darkBg(1200, 630) +
      centerLockup(s, 600, 252, 620) +
      textEl(600, 442, 33, '600', '#C8D6F5', 'middle', '0', 'Kiểm thử ứng dụng · Đăng tải App Store &amp; Google Play') +
      textEl(600, 500, 25, '500', '#7E93C4', 'middle', '0', '12 tester · 14 ngày · Đúng chính sách Google Play 2026') +
      textEl(600, 572, 27, '700', '#5B7BC7', 'middle', '5', 'TE2SR.COM')
  );
}
{
  const p = path.join(TMP, 'og.svg');
  fs.writeFileSync(p, ogDoc());
  png(p, path.join(PUB, 'og.png'), 1200, 630);
  png(p, path.join(FB, 'fb-link-1200x630.png'), 1200, 630);
}

// ══════════════════════════════════════════════════════════ 4. FACEBOOK PAGE ══

// ── Avatar page (1080×1080, nội dung nằm gọn trong vòng tròn cắt của FB) ────
function avatarDoc(kind) {
  const S = 1080;
  const a = L.avatarBody({ size: S, kind, id: 'fb' + kind });
  return doc(S, S, a.defs, a.body);
}
for (const kind of ['gradient', 'navy', 'trang']) {
  const p = path.join(TMP, `avatar-${kind}.svg`);
  fs.writeFileSync(p, avatarDoc(kind));
  png(p, path.join(FB, `fb-avatar-1080-${kind}.png`), 1080, 1080);
}

// ── Ảnh bìa page ────────────────────────────────────────────────────────────
// FB hiển thị bìa ở nhiều tỉ lệ khác nhau, phần luôn thấy được là vùng giữa.
// Ta dựng ở 1640×856 và giữ toàn bộ nội dung trong hộp an toàn 1092×540 ở giữa.
function coverDoc(W, H, guide = false) {
  const s = L.stacked({ id: 'cv', onDark: true });
  const safeW = 1092;
  const safeH = 540;
  const body =
    darkBg(W, H) +
    centerLockup(s, W / 2, H / 2 - 64, 560) +
    textEl(W / 2, H / 2 + 108, 30, '600', '#C8D6F5', 'middle', '0', 'Kiểm thử ứng dụng · Đăng tải App Store &amp; Google Play') +
    textEl(W / 2, H / 2 + 166, 25, '500', '#7E93C4', 'middle', '4', 'TE2SR.COM') +
    (guide
      ? `<rect x="${(W - safeW) / 2}" y="${(H - safeH) / 2}" width="${safeW}" height="${safeH}" fill="none" stroke="#00E5A0" stroke-width="4" stroke-dasharray="16 12"/>` +
        textEl((W - safeW) / 2 + 12, (H - safeH) / 2 - 14, 22, '700', '#00E5A0', 'start', '2', 'VÙNG AN TOÀN 1092 × 540')
      : '');
  return doc(W, H, bgDefs + s.defs, body);
}
for (const [name, W, H, guide] of [
  ['fb-cover-1640x856.png', 1640, 856, false],
  ['fb-cover-1640x624.png', 1640, 624, false],
  ['fb-cover-vung-an-toan.png', 1640, 856, true],
]) {
  const p = path.join(TMP, name.replace('.png', '.svg'));
  fs.writeFileSync(p, coverDoc(W, H, guide));
  png(p, path.join(FB, name), W, H);
}

// ── Bài đăng vuông 1080 và story 1080×1920 ─────────────────────────────────
function postDoc(W, H, lockupW) {
  const s = L.stacked({ id: 'ps', onDark: true });
  return doc(
    W,
    H,
    bgDefs + s.defs,
    darkBg(W, H) +
      centerLockup(s, W / 2, H / 2 - 60, lockupW) +
      textEl(W / 2, H / 2 + 104, 34, '600', '#C8D6F5', 'middle', '0', 'Kiểm thử &amp; đăng tải ứng dụng') +
      textEl(W / 2, H / 2 + 162, 27, '500', '#7E93C4', 'middle', '0', '12 tester · 14 ngày · App Store &amp; Google Play') +
      textEl(W / 2, H - 90, 26, '700', '#5B7BC7', 'middle', '5', 'TE2SR.COM')
  );
}
for (const [name, W, H, lw] of [
  ['fb-post-1080x1080.png', 1080, 1080, 660],
  ['fb-story-1080x1920.png', 1080, 1920, 700],
]) {
  const p = path.join(TMP, name.replace('.png', '.svg'));
  fs.writeFileSync(p, postDoc(W, H, lw));
  png(p, path.join(FB, name), W, H);
}

// ═════════════════════════════════════ 5. MODULE CHO WEBSITE (React inline) ══
// Nhúng thẳng vector vào trang thay vì tải ảnh: không chớp font, không thêm
// request, và nét ở mọi devicePixelRatio. Mỗi id được thay bằng một hậu tố duy
// nhất lúc chạy (useId) để nhiều logo trên cùng trang không đụng id gradient/mask.
{
  const marks = {
    stackedLight: L.stacked({ id: '__ID__', onDark: false }),
    stackedDark: L.stacked({ id: '__ID__', onDark: true }),
    inlineLight: L.inline({ id: '__ID__', onDark: false }),
    inlineDark: L.inline({ id: '__ID__', onDark: true }),
    wordmarkLight: L.wordmark({ id: '__ID__', onDark: false }),
    wordmarkDark: L.wordmark({ id: '__ID__', onDark: true }),
  };
  const body =
    `// TỆP SINH TỰ ĐỘNG — không sửa tay.\n` +
    `// Nguồn: scripts/brand/glyphs.js + scripts/brand/lockups.js\n` +
    `// Sinh lại bằng:  node scripts/brand/build.js\n\n` +
    `export type Mark = { w: number; h: number; markup: string };\n\n` +
    Object.entries(marks)
      .map(
        ([k, m]) =>
          `export const ${k}: Mark = {\n  w: ${Math.round(m.w * 100) / 100},\n  h: ${Math.round(m.h * 100) / 100},\n  markup: ${JSON.stringify(`<defs>${m.defs}</defs>${m.svg}`)},\n};\n`
      )
      .join('\n');
  const out = path.join(ROOT, 'src/components/brand/marks.generated.ts');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, body);
  written.push('src/components/brand/marks.generated.ts');
}

fs.rmSync(TMP, { recursive: true, force: true });

console.log('Đã sinh ' + written.length + ' tệp:');
for (const f of written.sort()) console.log('  ' + f);

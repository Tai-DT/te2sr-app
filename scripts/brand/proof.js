#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// TE2SR — ảnh bằng chứng cho bài đăng.
//
//   node scripts/brand/proof.js
//
// Hai loại:
//   1. Thẻ bằng chứng — đóng khung thương hiệu quanh ảnh chụp Play Console THẬT
//      đã có trong public/blog/. Ảnh thật, chỉ thêm khung, không sửa nội dung.
//   2. Thẻ trích lời — MẪU TRỐNG để dán lời khách hàng thật vào.
//
// Script này cố tình không sinh ra lời chứng thực nào. Ô trích lời để trống với
// chữ nhắc rõ ràng, đăng nguyên si sẽ thấy ngay là chưa điền — như vậy không thể
// vô tình đăng một lời chứng thực bịa.
//
// Xuất vào assets-social/bang-chung/
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const L = require('./lockups');
const G = require('./glyphs');

const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'assets-social', 'bang-chung');
const TMP = path.join(ROOT, '.brand-tmp-proof');
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const n = G.n;

const doc = (w, h, defs, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
  `<defs>${defs}</defs>${body}</svg>`;
const textEl = (x, y, size, weight, fill, anchor, letter, content) =>
  `<text x="${n(x)}" y="${n(y)}" font-family="${FONT}" font-size="${n(size)}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${n(letter)}">${content}</text>`;
const fit = (txt, maxW, cap) => Math.min(cap, maxW / (0.52 * txt.replace(/&amp;/g, '&').length));

const bgDefs =
  L.navyGradient('bg') +
  `<radialGradient id="gA" cx="0.16" cy="0.06" r="0.9"><stop offset="0" stop-color="#2E8BFF" stop-opacity="0.38"/><stop offset="1" stop-color="#2E8BFF" stop-opacity="0"/></radialGradient>` +
  `<radialGradient id="gB" cx="0.9" cy="0.98" r="0.85"><stop offset="0" stop-color="#6D3BF5" stop-opacity="0.34"/><stop offset="1" stop-color="#6D3BF5" stop-opacity="0"/></radialGradient>`;
const darkBg = (w, h) =>
  `<rect width="${w}" height="${h}" fill="url(#bg)"/><rect width="${w}" height="${h}" fill="url(#gA)"/><rect width="${w}" height="${h}" fill="url(#gB)"/>`;

const logoAt = (x, y, targetW) => {
  const wm = L.wordmark({ id: 'pf', onDark: true });
  const k = targetW / wm.w;
  return { defs: wm.defs, svg: `<g transform="translate(${n(x)} ${n(y)}) scale(${n(k)})">${wm.svg}</g>`, h: wm.h * k };
};

// ── 1. Thẻ bằng chứng ───────────────────────────────────────────────────────
// Khung để trống một ô, ảnh thật được ghép vào bằng ImageMagick ở bước sau.
// aspect = rộng/cao của ảnh thật. Khung được dựng vừa khít ảnh sau khi thu phóng,
// nên không còn khoảng trống thừa như khi đoán trước chiều cao ô.
function proofFrame(W, H, opts) {
  const pad = W * 0.07;
  const logo = logoAt(pad, pad * 0.9, W * 0.2);
  const top = pad * 0.9 + logo.h + W * 0.055;
  const capSize = W * 0.032;
  const bottom = H - pad * 1.15 - capSize * 1.4;
  const availW = W - pad * 2;
  const availH = bottom - top;

  // thu ảnh cho vừa cả hai chiều, giữ nguyên tỉ lệ
  let slotW = availW;
  let slotH = slotW / opts.aspect;
  if (slotH > availH) { slotH = availH; slotW = slotH * opts.aspect; }
  const slotX = (W - slotW) / 2;
  const slotY = top + (availH - slotH) / 2;

  let body = darkBg(W, H) + logo.svg;
  const tagSize = W * 0.026;
  body += textEl(W - pad, pad * 0.9 + logo.h * 0.72, tagSize, '700', '#7FB0FF', 'end', tagSize * 0.1, opts.tag);
  body += `<rect x="${n(slotX - W * 0.008)}" y="${n(slotY - W * 0.008)}" width="${n(slotW + W * 0.016)}" height="${n(slotH + W * 0.016)}" rx="${n(W * 0.026)}" fill="#FFFFFF" opacity="0.08"/>`;

  // chú thích phải chừa chỗ cho TE2SR.COM bên phải, nếu không sẽ đè lên nhau
  const domainW = capSize * 0.85 * 0.62 * 'TE2SR.COM'.length;
  const cap = fit(opts.caption, availW - domainW - W * 0.04, capSize);
  body += textEl(pad, H - pad * 1.15, cap, '600', '#C8D6F5', 'start', 0, opts.caption);
  body += textEl(W - pad, H - pad * 1.15, capSize * 0.85, '700', '#5B7BC7', 'end', capSize * 0.1, 'TE2SR.COM');

  return {
    svg: doc(W, H, bgDefs + logo.defs, body),
    slot: { x: slotX, y: slotY, w: slotW, h: slotH, r: Math.round(W * 0.02) },
  };
}

// ── 2. Thẻ trích lời — MẪU TRỐNG ────────────────────────────────────────────
// Không có lời chứng thực nào ở đây. Ô để trống kèm chữ nhắc.
function quoteTemplate(W, H, onDark) {
  const pad = W * 0.09;
  const ink = onDark ? '#FFFFFF' : '#0F1738';
  const dim = onDark ? '#8CA0C6' : '#6B7B99';
  const hint = onDark ? '#F59E0B' : '#B45309';

  const logo = onDark ? logoAt(pad, H - pad * 1.5, W * 0.18) : null;
  const wmLight = L.wordmark({ id: 'qw', onDark: false });
  const kLight = (W * 0.18) / wmLight.w;

  let defs = bgDefs;
  let body = onDark
    ? darkBg(W, H)
    : `<rect width="${W}" height="${H}" fill="#FFFFFF"/><rect x="0" y="0" width="${W}" height="${n(W * 0.012)}" fill="#1E6BEB"/>`;

  // dấu ngoặc kép lớn
  body += textEl(pad, pad + W * 0.13, W * 0.2, '700', onDark ? '#2E8BFF' : '#DCE7FF', 'start', 0, '&#8220;');

  // ô trống để dán lời khách
  const boxY = pad + W * 0.16;
  const boxH = H * 0.34;
  body += `<rect x="${n(pad)}" y="${n(boxY)}" width="${n(W - pad * 2)}" height="${n(boxH)}" rx="${n(W * 0.02)}" fill="none" stroke="${hint}" stroke-width="${n(W * 0.004)}" stroke-dasharray="${n(W * 0.018)} ${n(W * 0.014)}"/>`;
  const h1 = W * 0.032;
  body += textEl(W / 2, boxY + boxH / 2 - h1 * 0.6, h1, '700', hint, 'middle', 0, 'DÁN LỜI KHÁCH HÀNG THẬT VÀO ĐÂY');
  body += textEl(W / 2, boxY + boxH / 2 + h1 * 0.9, h1 * 0.8, '500', hint, 'middle', 0, 'chưa điền thì đừng đăng');

  // dòng tên người nói — cũng để trống
  const nameY = boxY + boxH + W * 0.09;
  body += textEl(pad, nameY, W * 0.03, '700', ink, 'start', 0, '[ Tên khách · loại app · quốc gia ]');
  body += textEl(pad, nameY + W * 0.045, W * 0.026, '500', dim, 'start', 0, '[ chỉ đăng khi khách đã đồng ý bằng văn bản ]');

  if (onDark) {
    body += logo.svg;
    defs += logo.defs;
  } else {
    body += `<g transform="translate(${n(pad)} ${n(H - pad * 1.5)}) scale(${n(kLight)})">${wmLight.svg}</g>`;
    defs += wmLight.defs;
  }
  return doc(W, H, defs, body);
}

// ── Xuất ────────────────────────────────────────────────────────────────────
fs.mkdirSync(TMP, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });
const written = [];

// Ảnh thật đã có trong repo. Chú thích mô tả đúng thứ ảnh cho thấy, không thêm gì.
const PROOFS = [
  ['01-playconsole-du-3-dieu-kien.jpg', 'PROOF', 'All three requirements cleared', 'du-3-dieu-kien'],
  ['02-playconsole-duoc-cap-quyen-phat-hanh.jpg', 'RESULT', 'Granted access to publish', 'duoc-cap-quyen'],
  ['03-phat-hanh-3-quoc-gia.jpg', 'RELEASED', 'Live in production', 'da-phat-hanh'],
  ['06-google-play-7min-workout.jpg', 'ON STORE', 'A finished app, live on Google Play', 'app-tren-store'],
];

const SIZES = [[1080, 1080, 'vuong'], [1200, 630, 'link']];

for (const [file, tag, caption, slug] of PROOFS) {
  const src = path.join(ROOT, 'public', 'blog', file);
  if (!fs.existsSync(src)) { console.warn('bo qua, khong thay:', file); continue; }
  const dim = execFileSync('magick', ['identify', '-format', '%w %h', src]).toString().split(' ').map(Number);
  const aspect = dim[0] / dim[1];
  for (const [W, H, sizeName] of SIZES) {
    const f = proofFrame(W, H, { tag, caption, aspect });
    const framePath = path.join(TMP, `${slug}-${sizeName}-frame.svg`);
    const framePng = path.join(TMP, `${slug}-${sizeName}-frame.png`);
    fs.writeFileSync(framePath, f.svg);
    execFileSync('rsvg-convert', ['-w', String(W), '-h', String(H), framePath, '-o', framePng]);

    // ảnh thật: vừa khít ô, bo góc, không cắt xén nội dung quan trọng
    const shot = path.join(TMP, `${slug}-${sizeName}-shot.png`);
    execFileSync('magick', [
      src,
      '-resize', `${Math.round(f.slot.w)}x${Math.round(f.slot.h)}!`,
      '(', '+clone', '-alpha', 'extract', '-draw', `fill black polygon 0,0 0,${f.slot.r} ${f.slot.r},0 fill white circle ${f.slot.r},${f.slot.r} ${f.slot.r},0`,
      '(', '+clone', '-flip', ')', '-compose', 'Multiply', '-composite',
      '(', '+clone', '-flop', ')', '-compose', 'Multiply', '-composite', ')',
      '-alpha', 'off', '-compose', 'CopyOpacity', '-composite', shot,
    ]);
    const meta = execFileSync('magick', ['identify', '-format', '%w %h', shot]).toString().split(' ').map(Number);
    const ox = Math.round(f.slot.x + (f.slot.w - meta[0]) / 2);
    const oy = Math.round(f.slot.y + (f.slot.h - meta[1]) / 2);
    const out = path.join(OUT, `${slug}-${sizeName}.png`);
    execFileSync('magick', [framePng, shot, '-geometry', `+${ox}+${oy}`, '-composite', out]);
    written.push(path.relative(ROOT, out));
  }
}

for (const [W, H, name, onDark] of [[1080, 1080, 'mau-trich-loi-toi', true], [1080, 1080, 'mau-trich-loi-sang', false]]) {
  const p = path.join(TMP, name + '.svg');
  fs.writeFileSync(p, quoteTemplate(W, H, onDark));
  const out = path.join(OUT, name + '.png');
  execFileSync('rsvg-convert', ['-w', String(W), '-h', String(H), p, '-o', out]);
  written.push(path.relative(ROOT, out));
}

fs.rmSync(TMP, { recursive: true, force: true });
console.log('Đã sinh ' + written.length + ' ảnh trong assets-social/bang-chung/:');
for (const f of written.sort()) console.log('  ' + f);

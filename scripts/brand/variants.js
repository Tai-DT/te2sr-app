// Sinh các phương án logo để đưa vào Figma cho người dùng chọn.
//   node scripts/brand/variants.js <thư-mục-xuất>
// Mỗi phương án là một SVG độc lập, import thẳng vào Figma thành vector sửa được.

const fs = require('fs');
const path = require('path');
const G = require('./glyphs');
const L = require('./lockups');
const { n } = G;

const OUT = process.argv[2] || '.';
const SHEAR = L.SHEAR;
const TAN = L.TAN;
const SHIFT = L.SHIFT;

const doc = (w, h, defs, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(w)}" height="${Math.ceil(h)}" viewBox="0 0 ${Math.ceil(w)} ${Math.ceil(h)}"><defs>${defs}</defs>${body}</svg>`;

// ── Gradient: 4 hướng ───────────────────────────────────────────────────────
const GRADIENTS = {
  // Hiện tại — chuyển đủ navy → cyan → xanh → tím → navy.
  g1: [
    [0.02, '#0A1F4E'], [0.2, '#123C8E'], [0.23, '#22A7F5'], [0.3, '#1B8CF7'],
    [0.39, '#1B72F0'], [0.41, '#2A6BFF'], [0.5, '#3F63FF'], [0.585, '#6D3BF5'],
    [0.6, '#5A34D8'], [0.66, '#2A2A72'], [0.73, '#17204A'], [1.0, '#0E1636'],
  ],
  // Trầm, ít mốc màu hơn — đỡ "cầu vồng", nhìn đắt hơn ở cỡ nhỏ.
  g2: [
    [0.0, '#0B1C46'], [0.28, '#1E6BEB'], [0.55, '#4A5BF0'], [0.72, '#5B34D8'],
    [1.0, '#101838'],
  ],
  // Hai tông xanh — an toàn nhất, hợp mọi nền.
  g3: [
    [0.0, '#0F2A6B'], [0.45, '#1E6BEB'], [1.0, '#2E8BFF'],
  ],
  // Một màu đặc — dùng khi in ấn, dập nổi, hoặc đặt trên ảnh nền phức tạp.
  g4: [[0, '#1E6BEB'], [1, '#1E6BEB']],
};

const gradDef = (id, stops) =>
  `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="430" y2="90">${stops
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
    .join('')}</linearGradient>`;

// ── Wordmark có thể chọn kiểu chân chữ R ────────────────────────────────────
// legKind:
//   'chuan'   — chân chéo thường, đọc rõ "R". Tam giác Play nằm ở hàng store.
//   'goc'     — như ảnh gốc: tam giác Play thay hẳn chân R.
//   'mui'     — chân chéo thường + tam giác Play làm mũi chân, chạm vào nhau.
//   'sau'     — chân chéo thường + tam giác Play tách rời, đặt sau chữ R.
function wordmark({ id, gradKey = 'g1', legKind = 'chuan', bar = 27, tracking = 5 }) {
  const rW = 90;
  const gradId = `${id}-g`;
  const maskId = `${id}-m`;

  let x = 0;
  let shapes = '';
  for (const f of [G.T, G.E_STRIPED, G.TWO, G.S]) {
    const g = f(bar, '#fff');
    shapes += `<g transform="translate(${n(x)} 0)">${g.svg}</g>`;
    x += g.w + tracking;
  }
  const xR = x;
  let rBody = G.R_BASE(bar, '#fff', rW);
  if (legKind !== 'goc') {
    rBody += G.stroke(`M ${n(44)} ${n(53.5)} L ${n(rW - bar / 2)} ${n(100 - bar / 2)}`, bar, '#fff');
  }
  shapes += `<g transform="translate(${n(xR)} 0)">${rBody}</g>`;

  const extra = legKind === 'goc' ? 12 : legKind === 'sau' ? 58 : 8;
  const W = xR + rW + extra + SHIFT;
  const italic = (b) => `<g transform="translate(${n(SHIFT)} 0) skewX(-${SHEAR})">${b}</g>`;

  // Tam giác Play. skewX(+SHEAR) triệt tiêu độ nghiêng của wordmark; translate
  // đưa nó về đúng chỗ phần chữ đã bị nghiêng tới.
  const play = (cx, cy, h, deg) =>
    italic(
      `<g transform="translate(${n(xR)} 0)"><g transform="skewX(${SHEAR}) translate(${n(-cy * TAN)} 0)">${G.playGlyphRotated(cx, cy, h, deg)}</g></g>`
    );

  let accent = '';
  if (legKind === 'goc') accent = play(70, 78, 36, 38);
  if (legKind === 'mui') accent = play(84, 84, 30, 38);
  if (legKind === 'sau') accent = play(120, 72, 44, 0);

  return {
    w: W,
    h: 100,
    defs:
      gradDef(gradId, GRADIENTS[gradKey]) +
      `<mask id="${maskId}" maskUnits="userSpaceOnUse" x="-6" y="-6" width="${n(W + 12)}" height="112">${italic(shapes)}</mask>`,
    svg: `<rect x="0" y="0" width="${n(W)}" height="100" fill="url(#${gradId})" mask="url(#${maskId})"/>${accent}`,
  };
}

// ── Hàng store: 3 mức tinh chỉnh ────────────────────────────────────────────
const ROWS = {
  // Hiện tại.
  t1: { cap: 26, icon: 30, gap: 14, rule: 40, tracking: 30 },
  // Gọn hơn, cân với wordmark hơn ở cỡ nhỏ.
  t2: { cap: 21, icon: 26, gap: 12, rule: 30, tracking: 26 },
  // Không đường kẻ — sạch nhất, chữ giãn rộng làm nhịp.
  t3: { cap: 21, icon: 26, gap: 18, rule: 0, tracking: 34 },
};

function storeRow({ id, key = 't1', onDark = false }) {
  const o = ROWS[key];
  const asGrad = `${id}-as`;
  const ink = onDark ? L.PALETTE.textOnDark : L.PALETTE.ink;
  const line = onDark ? L.PALETTE.ruleDark : L.PALETTE.rule;
  const txt = L.testerText({ paint: ink, cap: o.cap, tracking: o.tracking });
  const playW = o.icon * G.playGlyph.ratio;
  const mid = o.icon / 2;

  let x = 0;
  let body = G.appStoreGlyph(0, 0, o.icon, asGrad);
  x += o.icon + o.gap;
  if (o.rule) {
    body += `<rect x="${n(x)}" y="${n(mid - 1)}" width="${n(o.rule)}" height="2" fill="${line}"/>`;
    x += o.rule + o.gap;
  }
  body += `<g transform="translate(${n(x)} ${n(mid - o.cap / 2)})">${txt.svg}</g>`;
  x += txt.w + o.gap;
  if (o.rule) {
    body += `<rect x="${n(x)}" y="${n(mid - 1)}" width="${n(o.rule)}" height="2" fill="${line}"/>`;
    x += o.rule + o.gap;
  }
  body += G.playGlyph(x, mid - o.icon / 2, o.icon);
  return { w: x + playW, h: o.icon, defs: L.appStoreGradient(asGrad), svg: body };
}

function stacked({ id, gradKey, legKind, rowKey, gap = 34 }) {
  const wm = wordmark({ id, gradKey, legKind });
  const row = storeRow({ id, key: rowKey });
  const W = Math.max(wm.w, row.w);
  return {
    w: W,
    h: wm.h + gap + row.h,
    defs: wm.defs + row.defs,
    svg:
      `<g transform="translate(${n((W - wm.w) / 2)} 0)">${wm.svg}</g>` +
      `<g transform="translate(${n((W - row.w) / 2)} ${n(wm.h + gap)})">${row.svg}</g>`,
  };
}

// ── Xuất ────────────────────────────────────────────────────────────────────
const files = {};

// Chân chữ R — cùng gradient, chỉ khác cách xử lý chân.
for (const [k, legKind] of [['goc', 'goc'], ['chuan', 'chuan'], ['mui', 'mui'], ['sau', 'sau']]) {
  const w = wordmark({ id: 'leg' + k, gradKey: 'g1', legKind });
  files[`chan-R-${k}.svg`] = doc(w.w, w.h, w.defs, w.svg);
}

// Gradient — cùng chân chuẩn, chỉ khác dải màu.
for (const g of ['g1', 'g2', 'g3', 'g4']) {
  const w = wordmark({ id: 'grad' + g, gradKey: g, legKind: 'chuan' });
  files[`gradient-${g}.svg`] = doc(w.w, w.h, w.defs, w.svg);
}

// Hàng store — tách riêng để so sánh.
for (const t of ['t1', 't2', 't3']) {
  const r = storeRow({ id: 'row' + t, key: t });
  files[`hang-store-${t}.svg`] = doc(r.w, r.h, r.defs, r.svg);
}

// Lockup ghép sẵn của phương án đề xuất.
{
  const s = stacked({ id: 'deXuat', gradKey: 'g2', legKind: 'mui', rowKey: 't2' });
  files['lockup-de-xuat.svg'] = doc(s.w, s.h, s.defs, s.svg);
}

fs.mkdirSync(OUT, { recursive: true });
const report = [];
for (const [name, svg] of Object.entries(files)) {
  fs.writeFileSync(path.join(OUT, name), svg);
  report.push(`${name}\t${svg.length}`);
}
console.log(report.join('\n'));

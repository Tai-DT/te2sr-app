// ─────────────────────────────────────────────────────────────────────────────
// TE2SR — các lockup dựng từ glyph vector.
//   wordmark()  → "TE2SR" (hộp W × 100)
//   storeRow()  → [App Store] — TESTER — [Google Play]
//   monogram()  → "T2" cho favicon / app icon / avatar
//   stacked() / inline() → lockup ghép sẵn
//
// Mỗi hàm trả về { w, h, defs, svg }. Bên gọi ghép `defs` vào <defs> và `svg`
// vào thân tài liệu.
//
// LƯU Ý QUAN TRỌNG — vì sao chữ được tô qua <mask>:
// gradient `userSpaceOnUse` được tính trong hệ toạ độ của *chính phần tử* tham
// chiếu nó, nên nếu mỗi chữ nằm trong một <g transform="translate(x)"> riêng thì
// dải màu sẽ khởi động lại ở từng chữ. Giải pháp: dựng toàn bộ chữ thành một
// mask, rồi tô đúng MỘT <rect> gradient qua mask ⇒ một dải màu trải đều cả
// wordmark, và kết quả giống nhau trên mọi bộ dựng hình (browser, rsvg, Figma).
// ─────────────────────────────────────────────────────────────────────────────

const G = require('./glyphs');
const { n } = G;

const SHEAR = 10; // độ nghiêng italic
const TAN = Math.tan((SHEAR * Math.PI) / 180); // ≈ 0.1763
const SHIFT = 100 * TAN; // bù trừ để bbox bắt đầu ở x = 0

// ── Bảng màu ────────────────────────────────────────────────────────────────
const PALETTE = {
  navyDeep: '#0A1330',
  navy: '#0F1738',
  navy2: '#12224F',
  blue: '#1E6BEB',
  blueLight: '#2E8BFF',
  cyan: '#22A7F5',
  violet: '#6D3BF5',
  ink: '#1B2A4E',
  rule: '#C7CEDA',
  ruleDark: '#3C4766',
  textOnDark: '#EAEFFA',
};

// Gradient wordmark. Trục gần ngang (430, 90) trong hệ toạ độ glyph nên mỗi
// khoảng offset ứng gọn vào một chữ:
//   T ≈ .02–.21 · E ≈ .22–.39 · 2 ≈ .40–.59 · S ≈ .60–.77 · R ≈ .78–1
const WM_STOPS_LIGHT = [
  [0.0, '#0B1C46'],
  [0.28, '#1E6BEB'],
  [0.55, '#4A5BF0'],
  [0.72, '#5B34D8'],
  [1.0, '#101838'],
];
const WM_STOPS_DARK = [
  [0.0, '#A8C6FF'],
  [0.28, '#7FB0FF'],
  [0.55, '#A9AEFF'],
  [0.72, '#CBB4FF'],
  [1.0, '#F4F7FF'],
];

// mono: mã màu đặc — dùng khi nền đã nhiều màu, gradient trên gradient sẽ chìm.
function wordmarkGradient(id, onDark, mono) {
  const stops = mono ? [[0, mono], [1, mono]] : onDark ? WM_STOPS_DARK : WM_STOPS_LIGHT;
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="430" y2="90">${stops
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
    .join('')}</linearGradient>`;
}

function appStoreGradient(id) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#18BFFB"/><stop offset="1" stop-color="#2072F3"/></linearGradient>`;
}

function tileGradient(id) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3D93FF"/><stop offset="0.42" stop-color="#1E6BEB"/><stop offset="1" stop-color="#6D3BF5"/></linearGradient>`;
}

function navyGradient(id) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#12224F"/><stop offset="1" stop-color="#080F26"/></linearGradient>`;
}

// ── Wordmark "TE2SR" ────────────────────────────────────────────────────────
// leg:
//   'mui'   — chân chéo thường + tam giác Google Play làm mũi chân (bản đã chốt)
//   'chuan' — chỉ chân chéo, dùng ở cỡ nhỏ như navbar/favicon
//   'goc'   — tam giác thay hẳn chân R, giống ảnh gốc ban đầu
function wordmark({ id = 'te2sr', onDark = false, leg = 'mui', bar = 27, tracking = 5, mono = null }) {
  const rW = 90;
  const gradId = `${id}-wg`;
  const maskId = `${id}-wm`;

  let x = 0;
  let shapes = '';
  for (const f of [G.T, G.E_STRIPED, G.TWO, G.S]) {
    const g = f(bar, '#fff');
    shapes += `<g transform="translate(${n(x)} 0)">${g.svg}</g>`;
    x += g.w + tracking;
  }
  const xR = x;
  let rBody = G.R_BASE(bar, '#fff', rW);
  if (leg !== 'goc') {
    rBody += G.stroke(`M ${n(44)} ${n(53.5)} L ${n(rW - bar / 2)} ${n(100 - bar / 2)}`, bar, '#fff');
  }
  shapes += `<g transform="translate(${n(xR)} 0)">${rBody}</g>`;

  const W = x + rW + (leg === 'goc' ? 12 : leg === 'mui' ? 10 : 8) + SHIFT;
  const italic = (body) => `<g transform="translate(${n(SHIFT)} 0) skewX(-${SHEAR})">${body}</g>`;

  // Tam giác Play: skewX(+SHEAR) triệt tiêu shear của wordmark ⇒ tam giác giữ
  // đúng hình; translate(-cy·tan) đưa nó về đúng chỗ mà chữ R đã bị shear tới.
  const play = (cx, cy, h, deg) =>
    italic(
      `<g transform="translate(${n(xR)} 0)"><g transform="skewX(${SHEAR}) translate(${n(-cy * TAN)} 0)">${G.playGlyphRotated(cx, cy, h, deg)}</g></g>`
    );
  const accent = leg === 'goc' ? play(76, 78, 38, 38) : leg === 'mui' ? play(84, 84, 30, 38) : '';

  return {
    w: W,
    h: 100,
    defs:
      wordmarkGradient(gradId, onDark, mono) +
      `<mask id="${maskId}" maskUnits="userSpaceOnUse" x="-6" y="-6" width="${n(W + 12)}" height="112">${italic(shapes)}</mask>`,
    svg: `<rect x="0" y="0" width="${n(W)}" height="100" fill="url(#${gradId})" mask="url(#${maskId})"/>${accent}`,
  };
}

// ── Dòng "TESTER" đứng, giãn chữ ────────────────────────────────────────────
function testerText({ paint, cap = 26, bar = 17, tracking = 30 }) {
  const s = cap / 100;
  let x = 0;
  let body = '';
  for (const k of ['T', 'E', 'S', 'T', 'E', 'R']) {
    const g = G.UP[k](bar, paint);
    body += `<g transform="translate(${n(x)} 0)">${g.svg}</g>`;
    x += g.w + tracking;
  }
  return { w: (x - tracking) * s, h: cap, svg: `<g transform="scale(${n(s)})">${body}</g>` };
}

// ── Hàng store: [App Store] — TESTER — [Google Play] ────────────────────────
function storeRow({ id = 'te2sr', onDark = false, cap = 21, icon = 26, gap = 12, rule = 30, tracking = 26, ink: inkOverride = null, ruleColor = null }) {
  const asGrad = `${id}-as`;
  const ink = inkOverride || (onDark ? PALETTE.textOnDark : PALETTE.ink);
  const line = ruleColor || (onDark ? PALETTE.ruleDark : PALETTE.rule);
  const txt = testerText({ paint: ink, cap, tracking });
  const playW = icon * G.playGlyph.ratio;
  const mid = icon / 2;

  let x = 0;
  let body = G.appStoreGlyph(0, 0, icon, asGrad);
  x += icon + gap;
  body += `<rect x="${n(x)}" y="${n(mid - 1)}" width="${n(rule)}" height="2" fill="${line}"/>`;
  x += rule + gap;
  body += `<g transform="translate(${n(x)} ${n(mid - cap / 2)})">${txt.svg}</g>`;
  x += txt.w + gap;
  body += `<rect x="${n(x)}" y="${n(mid - 1)}" width="${n(rule)}" height="2" fill="${line}"/>`;
  x += rule + gap;
  body += G.playGlyph(x, mid - icon / 2, icon);

  return { w: x + playW, h: icon, defs: appStoreGradient(asGrad), svg: body };
}

// ── Monogram "T2" — dùng cho favicon / app icon / avatar ────────────────────
// paint: màu đặc. Nếu truyền `gradId`, chữ được tô qua mask bằng một dải
// gradient duy nhất (xem ghi chú đầu tệp về lý do phải dùng mask).
function monogram({ paint = '#fff', gradId = null, id = 'te2sr', bar = 27, gap = 16 }) {
  const fill = gradId ? '#fff' : paint;
  const t = G.T(bar, fill);
  const two = G.TWO(bar, fill);
  const W = t.w + gap + two.w + SHIFT;
  const shapes = `<g transform="translate(${n(SHIFT)} 0) skewX(-${SHEAR})">${t.svg}<g transform="translate(${n(t.w + gap)} 0)">${two.svg}</g></g>`;

  if (!gradId) return { w: W, h: 100, defs: '', svg: shapes };

  const maskId = `${id}-mm`;
  return {
    w: W,
    h: 100,
    defs: `<mask id="${maskId}" maskUnits="userSpaceOnUse" x="-6" y="-6" width="${n(W + 12)}" height="112">${shapes}</mask>`,
    svg: `<rect x="0" y="0" width="${n(W)}" height="100" fill="url(#${gradId})" mask="url(#${maskId})"/>`,
  };
}

// Dải màu cho monogram, khai báo trong hệ toạ độ nội bộ của monogram (0…W × 0…100).
function monogramGradient(id, w) {
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${n(w)}" y2="100"><stop offset="0" stop-color="#1E6BEB"/><stop offset="0.55" stop-color="#3E77F6"/><stop offset="1" stop-color="#6D3BF5"/></linearGradient>`;
}


// ── Ảnh đại diện ────────────────────────────────────────────────────────────
// Dùng wordmark TE2SR, không dùng monogram: avatar là chỗ người ta nhìn thấy
// thương hiệu, chữ viết tắt không nói lên tên.
//
// Wordmark rộng gấp ~4,6 lần chiều cao. Trong khung bị cắt tròn, một dải ngang
// cao h chỉ nằm lọt nếu w² + h² ≤ D². Với tỉ lệ đó, bề ngang tối đa ≈ 0,98·D —
// ta lùi về 0,80·D để chừa lề. Đây là giới hạn hình học, không phải chọn tuỳ ý.
//   kind: 'gradient' (nền thương hiệu, chữ trắng đặc)
//       | 'navy'     (nền xanh đêm, chữ gradient sáng)
//       | 'trang'    (nền trắng, chữ gradient đậm, có viền mảnh)
function avatarBody({ size, kind = 'gradient', id = 'av' }) {
  const onDark = kind !== 'trang';
  const mono = kind === 'gradient' ? '#FFFFFF' : null;
  const wm = wordmark({ id, onDark, mono });
  const w = size * 0.8;
  const k = w / wm.w;
  const h = wm.h * k;

  const bg =
    kind === 'trang'
      ? `<rect width="${n(size)}" height="${n(size)}" fill="#FFFFFF"/>` +
        `<circle cx="${n(size / 2)}" cy="${n(size / 2)}" r="${n(size / 2 - size * 0.008)}" fill="none" stroke="#DCE3F0" stroke-width="${n(size * 0.011)}"/>`
      : `<rect width="${n(size)}" height="${n(size)}" fill="url(#${id}-bg)"/>` +
        `<rect width="${n(size)}" height="${n(size)}" fill="url(#${id}-sheen)"/>`;

  const defs =
    wm.defs +
    (kind === 'trang'
      ? ''
      : (kind === 'navy' ? navyGradient(`${id}-bg`) : tileGradient(`${id}-bg`)) +
        `<radialGradient id="${id}-sheen" cx="0.28" cy="0.18" r="0.9"><stop offset="0" stop-color="#fff" stop-opacity="0.2"/><stop offset="0.62" stop-color="#fff" stop-opacity="0"/></radialGradient>`);

  return {
    defs,
    body: bg + `<g transform="translate(${n((size - w) / 2)} ${n((size - h) / 2)}) scale(${n(k)})">${wm.svg}</g>`,
  };
}

// ── Lockup xếp dọc (hero / footer / avatar) ─────────────────────────────────
function stacked({ id = 'te2sr', onDark = false, leg = 'mui', gap = 30, mono = null, ink = null, ruleColor = null }) {
  const wm = wordmark({ id, onDark, leg, mono });
  const row = storeRow({ id, onDark, ink, ruleColor });
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

// ── Lockup xếp ngang (navbar) ──────────────────────────────────────────────
function inline({ id = 'te2sr', onDark = false, leg = 'chuan', icon = 46, gap = 20, mono = null }) {
  const wm = wordmark({ id, onDark, leg, mono });
  const asGrad = `${id}-as`;
  const playW = icon * G.playGlyph.ratio;
  const top = (100 - icon) / 2;
  return {
    w: wm.w + gap + icon + 10 + playW,
    h: 100,
    defs: wm.defs + appStoreGradient(asGrad),
    svg:
      wm.svg +
      G.appStoreGlyph(wm.w + gap, top, icon, asGrad) +
      G.playGlyph(wm.w + gap + icon + 10, top, icon),
  };
}

module.exports = {
  PALETTE,
  SHEAR,
  TAN,
  SHIFT,
  wordmarkGradient,
  appStoreGradient,
  tileGradient,
  navyGradient,
  wordmark,
  testerText,
  storeRow,
  monogram,
  monogramGradient,
  avatarBody,
  stacked,
  inline,
};

// ─────────────────────────────────────────────────────────────────────────────
// TE2SR — bộ chữ vector dựng tay.
// Mọi glyph nằm trong hộp cao 100 đơn vị (cap-height), baseline y = 100.
// Không dùng <text>, không phụ thuộc font ⇒ nét ở mọi kích thước, mọi máy.
// ─────────────────────────────────────────────────────────────────────────────

const R2 = 2.5; // bán kính bo góc rất nhẹ, giữ cảm giác hình học sắc nét

const rect = (x, y, w, h, f) =>
  `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${R2}" fill="${f}"/>`;

const stroke = (d, w, f, cap = 'butt') =>
  `<path d="${d}" fill="none" stroke="${f}" stroke-width="${n(w)}" stroke-linecap="${cap}" stroke-linejoin="round"/>`;

function n(v) {
  return Math.round(v * 1000) / 1000;
}

// ── Glyph nghiêng (wordmark) ────────────────────────────────────────────────
// bar = bề dày nét. Mặc định 27/100 ⇒ rất đậm, khớp bản gốc.

const T = (bar, f) => ({
  w: 84,
  svg: rect(0, 0, 84, bar, f) + rect((84 - bar) / 2, 0, bar, 100, f),
});

// "E" ba thanh, không sống dọc — chi tiết nhận diện của bản gốc.
const E_STRIPED = (bar, f) => ({
  w: 76,
  svg:
    rect(0, 0, 76, bar, f) +
    rect(8, (100 - bar) / 2, 62, bar, f) +
    rect(0, 100 - bar, 76, bar, f),
});

const TWO = (bar, f) => {
  const h = bar / 2;
  return {
    w: 82,
    svg:
      stroke(
        `M ${n(h)} ${n(30)}
         C ${n(h)} ${n(11)}, ${n(20)} ${n(h)}, ${n(41)} ${n(h)}
         C ${n(62)} ${n(h)}, ${n(82 - h)} ${n(12)}, ${n(82 - h)} ${n(30)}
         C ${n(82 - h)} ${n(44)}, ${n(66)} ${n(55)}, ${n(52)} ${n(67)}
         L ${n(30)} ${n(86)}`,
        bar,
        f
      ) + rect(0, 100 - bar, 82, bar, f),
  };
};

const S = (bar, f) => {
  const h = bar / 2;
  const w = 78;
  return {
    w,
    svg: stroke(
      `M ${n(w - h)} ${n(26)}
       C ${n(w - 16)} ${n(13)}, ${n(46)} ${n(h)}, ${n(33)} ${n(13)}
       C ${n(19)} ${n(18)}, ${n(16)} ${n(31)}, ${n(30)} ${n(39)}
       C ${n(41)} ${n(45)}, ${n(56)} ${n(48)}, ${n(w - h - 1)} ${n(57)}
       C ${n(w + 4)} ${n(69)}, ${n(66)} ${n(100 - h)}, ${n(46)} ${n(100 - h - 1)}
       C ${n(29)} ${n(100 - h - 3)}, ${n(16)} ${n(84)}, ${n(h + 1)} ${n(72)}`,
      bar,
      f
    ),
  };
};

// R: sống dọc + bát trên. Chân R do bên gọi vẽ (tam giác Play hoặc nét thường).
const R_BASE = (bar, f, w = 90) => {
  const h = bar / 2;
  return (
    rect(0, 0, bar, 100, f) +
    stroke(
      `M ${n(h)} ${n(h)} H ${n(50)}
       C ${n(w - h - 14)} ${n(h)}, ${n(w - h)} ${n(bar * 0.82)}, ${n(w - h)} ${n(33.5)}
       C ${n(w - h)} ${n(45)}, ${n(w - h - 14)} ${n(53.5)}, ${n(50)} ${n(53.5)} H ${n(h)}`,
      bar,
      f
    )
  );
};

// ── Store glyph chính thức ──────────────────────────────────────────────────
// Google Play — bbox gốc ≈ x 13.3…44.0, y 9.1…43.8 (30.7 × 34.7)
const PLAY_BB = { x: 13.3, y: 9.1, w: 30.7, h: 34.7 };
const PLAY_PATHS = `
  <path fill="#EB3131" d="m27.622 25.899-14.194 15.066c5.34e-4 0.0031 0.0016 0.0057 0.0021 0.0089 0.43532 1.636 1.9296 2.8406 3.703 2.8406 0.70892 0 1.3745-0.19166 1.9453-0.52812l0.04533-0.02656 15.978-9.22-7.479-8.141"/>
  <path fill="#F6B60B" d="m41.983 23.334-0.0136-0.0093-6.8982-3.999-7.7717 6.9156 7.7987 7.7977 6.8618-3.9592c1.203-0.64945 2.0197-1.9177 2.0197-3.3802 0-1.452-0.80571-2.7139-1.9968-3.3655"/>
  <path fill="#5778C5" d="m13.426 12.37c-0.08533 0.31466-0.13018 0.64425-0.13018 0.98651v26.623c0 0.34162 0.04432 0.67233 0.13072 0.98587l14.684-14.681-14.684-13.914"/>
  <path fill="#3BAD49" d="m27.727 26.668 7.3473-7.3451-15.96-9.2534c-0.58012-0.34746-1.2572-0.54799-1.9817-0.54799-1.7734 0-3.2697 1.2068-3.7051 2.8447-5.34e-4 0.0016-5.34e-4 0.0027-5.34e-4 0.0041l14.3 14.298"/>`;

// Đặt glyph Play với chiều cao h tại (x,y) — góc trên-trái của bbox.
function playGlyph(x, y, h) {
  const s = h / PLAY_BB.h;
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${n(s)}) translate(${-PLAY_BB.x} ${-PLAY_BB.y})">${PLAY_PATHS}</g>`;
}

// Biến thể quay quanh tâm — dùng làm chân chữ R (mũi tam giác chỉ xuống-phải).
function playGlyphRotated(cx, cy, h, deg) {
  const s = h / PLAY_BB.h;
  const w = PLAY_BB.w * s;
  return `<g transform="translate(${n(cx)} ${n(cy)}) rotate(${n(deg)}) translate(${n(-w / 2)} ${n(-h / 2)}) scale(${n(s)}) translate(${-PLAY_BB.x} ${-PLAY_BB.y})">${PLAY_PATHS}</g>`;
}
playGlyph.ratio = PLAY_BB.w / PLAY_BB.h; // ≈ 0.885

// App Store — ô bo góc + chữ A. Hộp gốc 800 × 800.
function appStoreGlyph(x, y, size, gradId) {
  const s = size / 800;
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${n(s)})">
    <rect width="800" height="800" rx="180" fill="url(#${gradId})"/>
    <path fill="#fff" d="M396.6,183.8l16.2-28c10-17.5,32.3-23.4,49.8-13.4s23.4,32.3,13.4,49.8L319.9,462.4h112.9c36.6,0,57.1,43,41.2,72.8H143c-20.2,0-36.4-16.2-36.4-36.4c0-20.2,16.2-36.4,36.4-36.4h92.8l118.8-205.9l-37.1-64.4c-10-17.5-4.1-39.6,13.4-49.8c17.5-10,39.6-4.1,49.8,13.4L396.6,183.8L396.6,183.8z M256.2,572.7l-35,60.7c-10,17.5-32.3,23.4-49.8,13.4S148,614.5,158,597l26-45C213.4,542.9,237.3,549.9,256.2,572.7L256.2,572.7z M557.6,462.6h94.7c20.2,0,36.4,16.2,36.4,36.4c0,20.2-16.2,36.4-36.4,36.4h-52.6l35.5,61.6c10,17.5,4.1,39.6-13.4,49.8c-17.5,10-39.6,4.1-49.8-13.4c-59.8-103.7-104.7-181.3-134.5-233c-30.5-52.6-8.7-105.4,12.8-123.3C474.2,318.1,509.9,380,557.6,462.6L557.6,462.6z"/>
  </g>`;
}

// ── Glyph đứng, thanh mảnh — dùng cho dòng "TESTER" ─────────────────────────
const UP = {
  T: (bar, f) => ({ w: 72, svg: rect(0, 0, 72, bar, f) + rect((72 - bar) / 2, 0, bar, 100, f) }),
  E: (bar, f) => ({
    w: 64,
    svg:
      rect(0, 0, bar, 100, f) +
      rect(0, 0, 64, bar, f) +
      rect(0, (100 - bar) / 2, 55, bar, f) +
      rect(0, 100 - bar, 64, bar, f),
  }),
  S: (bar, f) => {
    const h = bar / 2;
    const w = 66;
    return {
      w,
      svg: stroke(
        `M ${n(w - h)} ${n(24)}
         C ${n(w - 12)} ${n(13)}, ${n(40)} ${n(h)}, ${n(28)} ${n(11)}
         C ${n(15)} ${n(15)}, ${n(12)} ${n(28)}, ${n(24)} ${n(34)}
         C ${n(33)} ${n(39)}, ${n(47)} ${n(42)}, ${n(w - h - 2)} ${n(50)}
         C ${n(w + 2)} ${n(60)}, ${n(57)} ${n(100 - h - 5)}, ${n(39)} ${n(100 - h - 5)}
         C ${n(25)} ${n(100 - h - 4)}, ${n(12)} ${n(82)}, ${n(h)} ${n(70)}`,
        bar,
        f
      ),
    };
  },
  R: (bar, f) => {
    const h = bar / 2;
    const w = 72;
    return {
      w,
      svg:
        rect(0, 0, bar, 100, f) +
        stroke(
          `M ${n(h)} ${n(h)} H ${n(42)}
           C ${n(w - h - 9)} ${n(h)}, ${n(w - h)} ${n(16)}, ${n(w - h)} ${n(27)}
           C ${n(w - h)} ${n(37)}, ${n(w - h - 9)} ${n(45.5)}, ${n(42)} ${n(45.5)} H ${n(h)}`,
          bar,
          f
        ) +
        stroke(`M ${n(38)} ${n(45.5)} L ${n(w - h)} ${n(100 - h)}`, bar, f),
    };
  },
};

module.exports = {
  n,
  rect,
  stroke,
  T,
  E_STRIPED,
  TWO,
  S,
  R_BASE,
  UP,
  playGlyph,
  playGlyphRotated,
  appStoreGlyph,
};

// Bản xem thử để soi hình học trước khi xuất bộ asset.
const fs = require('fs');
const L = require('./lockups');

const st = L.stacked({ id: 'a' });
const inl = L.inline({ id: 'b' });
const mono = L.monogram({ paint: '#1E6BEB' });
const dark = L.stacked({ id: 'c', onDark: true });
const small = L.stacked({ id: 'd' });

const P = 40;
const W = Math.max(st.w, inl.w) + P * 2;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="700" viewBox="0 0 ${W} 700">
<defs>${st.defs}${inl.defs}${mono.defs}${dark.defs}${small.defs}</defs>
<rect width="${W}" height="700" fill="#fff"/>
<g transform="translate(${P} 30)">${st.svg}</g>
<rect x="0" y="230" width="${W}" height="180" fill="#0B1224"/>
<g transform="translate(${P} 255) scale(0.72)">${dark.svg}</g>
<g transform="translate(${P} 435) scale(0.55)">${inl.svg}</g>
<g transform="translate(${P + 360} 425) scale(0.75)">${mono.svg}</g>
<g transform="translate(${P} 560) scale(0.24)">${small.svg}</g>
<g transform="translate(${P + 190} 570) scale(0.15)">${small.svg}</g>
</svg>`;
fs.writeFileSync(process.argv[2] || '/tmp/preview.svg', svg);
console.log('ok', Math.round(W));

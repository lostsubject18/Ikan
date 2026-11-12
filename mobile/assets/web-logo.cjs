// Writes the fish logo as an inline SVG into the web app's header (public/index.html, between the
// <!--logo--> markers). Its colours come from CSS (--logo-ink, --logo-line), so it follows the light
// and dark theme. Run by make-icons.cjs.
const fs = require('fs'), path = require('path');
const { fish } = require('./logo.cjs');

// Placeholder colours become classes; every 4th point of the long outline curves is plenty at header size.
const thin = d => d.replace(/M([^M]+)/g, seg => {
  const pts = seg.slice(1).split(' L');
  if (pts.length < 20) return seg;
  return 'M' + pts.filter((p, i) => i % 4 === 0 || i === pts.length - 1).join(' L');
});
const body = fish(1, 705, 360, { line: '#111111', letter: '#222222' })
  .replace(/ d="([^"]+)"/g, (m, d) => ` d="${thin(d)}"`)
  .replace(/stroke="#111111"/g, 'class="logo-line"').replace(/stroke="#222222"/g, 'class="logo-ink"');
const svg = `<svg viewBox="64 160 1278 420" aria-hidden="true">${body}</svg>`;

const file = path.join(__dirname, '..', '..', 'public', 'index.html');
const html = fs.readFileSync(file, 'utf8');
const re = /<!--logo-->[\s\S]*?<!--\/logo-->/;
if (!re.test(html)) throw new Error('<!--logo--> markers not found in index.html');
fs.writeFileSync(file, html.replace(re, `<!--logo-->${svg}<!--/logo-->`));
console.log('web logo written,', svg.length, 'bytes');

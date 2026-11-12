// Renders the source PNGs for @capacitor/assets from inline SVG (run: node assets/make-icons.cjs)
const sharp = require('sharp'), path = require('path');
const fish = (scale, cx, cy) => `<g transform="translate(${cx} ${cy}) scale(${scale})">
  <path d="M-150 0 C-90 -120 90 -120 150 0 C90 120 -90 120 -150 0 Z" fill="#fff"/>
  <path d="M120 0 L230 -95 C215 -35 215 35 230 95 Z" fill="#fff"/>
  <circle cx="-80" cy="-18" r="20" fill="#58cc02"/>
  <path d="M-10 -55 Q20 0 -10 55" fill="none" stroke="#58cc02" stroke-width="16" stroke-linecap="round"/>
</g>`;
const svg = (bg, body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">${bg}${body}</svg>`);
const out = f => path.join(__dirname, f);
(async () => {
  await sharp(svg('<rect width="1024" height="1024" fill="#58cc02"/>', fish(1.9, 470, 512))).png().toFile(out('icon-only.png'));
  await sharp(svg('', fish(1.25, 480, 512))).png().toFile(out('icon-foreground.png'));
  await sharp(svg('<rect width="1024" height="1024" fill="#58cc02"/>', '')).png().toFile(out('icon-background.png'));
  const splash = s => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="2732" height="2732"><rect width="2732" height="2732" fill="#131f24"/>
    <rect x="1066" y="1066" width="600" height="600" rx="150" fill="#58cc02"/>${fish(1.1, 1350, 1366)}</svg>`);
  await sharp(splash()).png().toFile(out('splash.png'));
  await sharp(splash()).png().toFile(out('splash-dark.png'));
  console.log('icons rendered');
})();

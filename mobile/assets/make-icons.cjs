// Renders every app icon from the logo in logo.cjs (run: node assets/make-icons.cjs, then npm run icons / icons:ios)
const sharp = require('sharp'), path = require('path'), fs = require('fs');
const { fish, COLORS } = require('./logo.cjs');
const BG = COLORS.bg;
const svg = (bg, body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">${bg}${body}</svg>`);
const square = `<rect width="1024" height="1024" fill="${BG}"/>`;
const out = f => path.join(__dirname, f);
(async () => {
  // Sources for @capacitor/assets (Android and iOS)
  await sharp(svg(square, fish(0.74, 512, 512))).png().toFile(out('icon-only.png'));
  // Android insets this layer by 16.7%, so the whole image is the visible area: 0.72 is the largest
  // size at which the tail and the nose still fit inside a round launcher mask
  await sharp(svg('', fish(0.72, 512, 512))).png().toFile(out('icon-foreground.png'));
  await sharp(svg(square, '')).png().toFile(out('icon-background.png'));
  const splash = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="2732" height="2732"><rect width="2732" height="2732" fill="#131f24"/>
    <rect x="1066" y="1066" width="600" height="600" rx="150" fill="${BG}"/>${fish(0.435, 1366, 1366)}</svg>`);
  await sharp(splash).png().toFile(out('splash.png'));
  await sharp(splash).png().toFile(out('splash-dark.png'));

  // Web app (browser tab, home screen) and Unraid template icons, same logo
  const root = path.join(__dirname, '..', '..');
  const rounded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><rect width="1024" height="1024" rx="224" fill="${BG}"/>${fish(0.74, 512, 512)}</svg>`;
  fs.writeFileSync(path.join(root, 'public', 'icon.svg'), rounded + '\n');
  const full = svg(square, fish(0.74, 512, 512));
  const maskable = svg(square, fish(0.58, 512, 512)); // stays inside the 80% safe circle
  await sharp(Buffer.from(rounded)).resize(192).png().toFile(path.join(root, 'public', 'icon-192.png'));
  await sharp(Buffer.from(rounded)).resize(512).png().toFile(path.join(root, 'public', 'icon-512.png'));
  await sharp(maskable).resize(512).png().toFile(path.join(root, 'public', 'icon-maskable-512.png'));
  await sharp(full).resize(180).png().toFile(path.join(root, 'public', 'apple-touch-icon.png'));
  await sharp(Buffer.from(rounded)).resize(256).png().toFile(path.join(root, 'unraid', 'icon.png'));
  console.log('icons rendered');
})();

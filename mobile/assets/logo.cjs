// Ikan logo: a fish outline whose strokes spell "ikan". The letters are cut out of the very same
// curves as the outline, so wherever a letter follows the fish it lies exactly on top of the line.
// Coordinates: about 1400 x 700, fish centre at (705, 360).

const bez = (p0, p1, p2, p3) => t => {
  const u = 1 - t;
  return [0, 1].map(i => u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i]);
};
const line = (a, b) => t => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const N = 240;
const sample = (f, t0 = 0, t1 = 1) => Array.from({ length: N + 1 }, (_, i) => f(t0 + (t1 - t0) * i / N));
// parameter t at which a curve passes x (curves here are monotonic in x)
const atX = (f, x) => { let lo = 0, hi = 1; const up = f(1)[0] > f(0)[0]; for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; ((f(m)[0] < x) === up) ? lo = m : hi = m; } return (lo + hi) / 2; };
const poly = pts => 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');

// --- the fish ---
const P = [330, 388];                       // where tail meets body
const TOP = [860, 232], NOSE = [1306, 446], BOT = [860, 552];
const tailV = line([100, 196], [100, 532]);  // back edge of the tail
const tailL = line([100, 532], P);            // lower tail edge
const s1 = bez(P, [470, 306], [680, 234], TOP);                 // back, tail side
const s2 = bez(TOP, [1090, 232], [1306, 330], NOSE);           // back, head side
const s3 = bez(NOSE, [1306, 530], [1060, 552], BOT);           // belly, head side (vertical tangent at the nose: round head)
const s4 = bez(BOT, [670, 552], [470, 480], P);                // belly, tail side
const outline = [poly(sample(tailV)), poly([...sample(tailL), ...sample(s1).slice(1), ...sample(s2).slice(1), ...sample(s3).slice(1), ...sample(s4).slice(1)])];

// --- the letters ---
// i: the back edge of the tail
const I = poly(sample(tailV, 0, 0.97));
// k: a shorter stem through the tail joint, arms running along the back and the belly
const K = [poly([[P[0] + 6, 262], [P[0], P[1]], [P[0] - 6, 512]]),
  poly(sample(s1, atX(s1, 548), 0).concat(sample(s4, 1, atX(s4, 560)).slice(1)))];
// a: arch along the back that turns down into a leg reaching the belly, plus the little bowl hook
const aStart = atX(s1, 655), aTurn = atX(s1, 820);
const archA = sample(s1, aStart, aTurn);
const legX = 878, belly = s4(atX(s4, legX))[1];
const a0 = s1(aTurn), a1 = s1(aTurn + 1e-3), al = Math.hypot(a1[0] - a0[0], a1[1] - a0[1]);
const turnA = sample(bez(a0, [a0[0] + (a1[0] - a0[0]) / al * 38, a0[1] + (a1[1] - a0[1]) / al * 38], [legX, a0[1] + 8], [legX, a0[1] + 70])).slice(1); // leaves the back along its own tangent
const A = [poly([...archA, ...turnA, [legX + 4, belly + 2]]), 'M712 412 C672 420 672 468 712 474'];
// n: a leg dropping from the back, and the arch following the head round to the nose
const nT = atX(s2, 975);
const n0 = s2(nT);
const N1 = 'M' + n0.join(' ') + ` C1010 ${n0[1] + 60} 1062 360 1058 500`;
const N2 = poly(sample(s2, nT, 1).concat(sample(s3, 0, 0.035).slice(1)));
const letters = [I, ...K, ...A, N1, N2];

const art = ({ line: lc, letter: tc, lw = 40, tw = 56 }) =>
  `<g fill="none" stroke-linecap="round" stroke-linejoin="round">` +
  outline.map(d => `<path d="${d}" stroke="${lc}" stroke-width="${lw}"/>`).join('') +
  letters.map(d => `<path d="${d}" stroke="${tc}" stroke-width="${tw}"/>`).join('') + `</g>`;

// Colour scheme "2d": petrol letters on a cream fish, on the app's green
const COLORS = { bg: '#58cc02', line: '#fff3c4', letter: '#0b5563' };
// scale s, centred on (cx, cy)
const fish = (s, cx, cy, colors = COLORS) => `<g transform="translate(${cx} ${cy}) scale(${s}) translate(-705 -360)">${art(colors)}</g>`;
module.exports = { fish, COLORS };

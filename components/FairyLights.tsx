import { FESTIVE } from '@/lib/festive';
import styles from './FairyLights.module.css';

const SWAG = 150;   // px width of one garland swag
const UNITS = 32;   // swags rendered (row is clipped to the viewport)
const TILE_H = 58;  // height of the tinsel artwork

/* Build one seamless swag of *tinsel* — hundreds of fine metallic strands in
   red/green/gold radiating off a drooping cord — as an SVG data-URI we
   repeat-x. Deterministic (seeded) so SSR and client render identically. */
function tinselTile(): string {
  const W = SWAG;
  const y0 = 22;
  const dip = 36;

  let seed = 20241225;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const pt = (t: number): [number, number] => {
    const x = 2 * (1 - t) * t * (W / 2) + t * t * W;
    const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * dip + t * t * y0;
    return [x, y];
  };

  const SAMPLES = 54;
  const pass = (
    colors: string[],
    [wMin, wMax]: [number, number],
    [lMin, lMax]: [number, number],
    perPoint: number,
    op: number,
  ): string => {
    let s = '';
    for (let i = 0; i <= SAMPLES; i++) {
      const t = i / SAMPLES;
      const [cx, cy] = pt(t);
      for (let k = 0; k < perPoint; k++) {
        const down = rand() < 0.56;
        const ang = (down ? 20 + rand() * 140 : 200 + rand() * 140) * (Math.PI / 180);
        const len = down
          ? lMin + rand() * (lMax - lMin)
          : lMin * 0.7 + rand() * (lMax - lMin) * 0.72;
        const w = wMin + rand() * (wMax - wMin);
        const ox = cx + (rand() * 5 - 2.5);
        const x2 = cx + Math.cos(ang) * len;
        const y2 = cy + Math.sin(ang) * len;
        const col = colors[Math.floor(rand() * colors.length)];
        s += `<line x1="${ox.toFixed(1)}" y1="${cy.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${col}" stroke-width="${w.toFixed(1)}" stroke-linecap="round" opacity="${op}"/>`;
      }
    }
    return s;
  };

  // Warm, on-brand-ish Christmas tinsel: gold-led, with red and deep green.
  const back = ['#6f1c15', '#7a5e12', '#13472a', '#8a6d12', '#5e2a0f'];
  const mid = ['#bc3a2a', '#c9a227', '#1d6e38', '#d6a62c', '#b5461e'];
  const front = ['#ef6b50', '#f4d152', '#3fae63', '#ffe39a', '#ffcf6b'];

  const body =
    pass(back, [1.7, 2.6], [12, 20], 4, 0.92) +
    pass(mid, [1.1, 1.9], [10, 17], 4, 0.96) +
    pass(front, [0.7, 1.25], [8, 14], 3, 1);

  let sparkle = '';
  for (let i = 0; i < 16; i++) {
    const [cx, cy] = pt(rand());
    sparkle += `<circle cx="${(cx + rand() * 7 - 3.5).toFixed(1)}" cy="${(cy + rand() * 12 - 2).toFixed(1)}" r="${(0.5 + rand() * 0.8).toFixed(1)}" fill="#fff" opacity="0.9"/>`;
  }

  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${TILE_H}' viewBox='0 0 ${W} ${TILE_H}'>` +
    body + sparkle +
    `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/* Reusable so other spots (e.g. the footer) can rest a strand of the same
   tinsel on an element. */
export const TINSEL_BG = tinselTile();
export const TINSEL_TILE = `${SWAG}px ${TILE_H}px`;

/** Tinsel garland with warm fairy lights nestled in it, strung under the
 *  header site-wide. Gated by FESTIVE; respects reduced motion. */
function jitter(seed: number, n: number): number[] {
  let s = seed >>> 0;
  return Array.from({ length: n }, () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  });
}

export function FairyLights() {
  if (!FESTIVE) return null;
  const jx = jitter(5501, UNITS);
  const jy = jitter(6601, UNITS);
  return (
    <div
      className={styles.garland}
      aria-hidden="true"
      style={{ backgroundImage: TINSEL_BG, backgroundSize: TINSEL_TILE }}
    >
      <div className={styles.row}>
        {Array.from({ length: UNITS }).map((_, i) => (
          <span key={i} className={styles.unit}>
            <span
              className={styles.bulb}
              style={{
                ['--i' as string]: i,
                left: `calc(50% + ${(jx[i] - 0.5) * 40}px)`,
                top: `${30 + jy[i] * 7}px`,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

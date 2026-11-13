import { FESTIVE } from '@/lib/festive';
import styles from './FairyLights.module.css';

const SWAG = 150;   // px width of one garland swag
const UNITS = 32;   // swags rendered (row is clipped to the viewport)
const TILE_H = 46;  // height of the garland rope artwork

/* Build one seamless swag of pine garland (overlapping green blobs following a
   drooping curve, with a few red berries) as an SVG data-URI we repeat-x. */
function garlandTile(): string {
  const W = SWAG;
  const y0 = 11;   // wire height at the pins
  const dip = 33;  // lowest point of the swag
  const pt = (t: number): [number, number] => {
    const x = 2 * (1 - t) * t * (W / 2) + t * t * W;
    const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * dip + t * t * y0;
    return [x, y];
  };

  const greens = ['#1f3d29', '#2c5338', '#3c6b49'];
  let foliage = '';
  for (let i = 0; i <= 26; i++) {
    const t = i / 26;
    const [x, y] = pt(t);
    const j = Math.sin(i * 1.9) * 3;
    const g1 = greens[i % 3];
    const g2 = greens[(i + 2) % 3];
    foliage += `<ellipse cx="${x.toFixed(1)}" cy="${(y + 3 + j).toFixed(1)}" rx="11" ry="6.5" fill="${g1}" transform="rotate(${(j * 4).toFixed(0)} ${x.toFixed(1)} ${(y + 3 + j).toFixed(1)})"/>`;
    foliage += `<ellipse cx="${x.toFixed(1)}" cy="${(y - 1 + j * 0.5).toFixed(1)}" rx="7" ry="4.2" fill="${g2}"/>`;
  }
  let berries = '';
  [5, 13, 21].forEach(i => {
    const [x, y] = pt(i / 26);
    berries += `<circle cx="${x.toFixed(1)}" cy="${(y + 7).toFixed(1)}" r="2.4" fill="#c23b30"/>`;
    berries += `<circle cx="${(x + 4).toFixed(1)}" cy="${(y + 4).toFixed(1)}" r="2" fill="#a82f26"/>`;
  });

  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${TILE_H}' viewBox='0 0 ${W} ${TILE_H}'>` +
    foliage + berries +
    `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** Draped evergreen garland with warm fairy lights and the odd bauble, strung
 *  under the header site-wide. Gated by FESTIVE; respects reduced motion. */
export function FairyLights() {
  if (!FESTIVE) return null;
  return (
    <div
      className={styles.garland}
      aria-hidden="true"
      style={{ backgroundImage: garlandTile(), backgroundSize: `${SWAG}px ${TILE_H}px` }}
    >
      <div className={styles.row}>
        {Array.from({ length: UNITS }).map((_, i) => (
          <span key={i} className={styles.unit}>
            <span className={styles.bulb} style={{ ['--i' as string]: i }} />
            {i % 4 === 2 && (
              <span className={`${styles.bauble} ${i % 8 === 2 ? styles.baubleRed : styles.baubleGold}`} />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

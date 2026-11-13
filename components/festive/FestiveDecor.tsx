import { TINSEL_BG, TINSEL_TILE } from '../FairyLights';
import { FESTIVE } from '@/lib/festive';
import styles from './FestiveDecor.module.css';

/* Deterministic jitter so SSR and client match (no hydration mismatch)
   while nothing lines up too neatly. */
function jitter(seed: number, n: number): number[] {
  let s = seed >>> 0;
  return Array.from({ length: n }, () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  });
}

const UNIT = 112; // px per swag of wire
type Tone = 'forge' | 'gold' | 'cream' | 'red' | 'green';
const BULB_TONES: readonly Tone[] = ['forge', 'gold', 'cream', 'red'];

/** A string of fairy lights hung across the top of a container: the wire
 *  sags in swags and the bulbs dangle at slightly irregular spots — never a
 *  perfectly even row. Drop it inside a `position: relative` parent. */
export function LightString({
  units = 12,
  wire = 'rgba(255,255,255,0.28)',
  tones = BULB_TONES,
  seed = 0,
  className = '',
}: {
  units?: number;
  wire?: string;
  tones?: readonly Tone[];
  seed?: number;
  className?: string;
}) {
  if (!FESTIVE) return null;

  const wireSvg =
    `url("data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='${UNIT}' height='40' viewBox='0 0 ${UNIT} 40'>` +
        `<path d='M0 5 Q${UNIT / 2} 27 ${UNIT} 5' fill='none' stroke='${wire}' stroke-width='1.4'/>` +
        `</svg>`,
    )}")`;

  const o = seed * 97;
  const jx = jitter(1171 + o, units);
  const jy = jitter(2273 + o, units);
  const js = jitter(3391 + o, units);
  const jc = jitter(4493 + o, units);

  return (
    <div
      className={`${styles.string} ${className}`}
      aria-hidden="true"
      style={{ backgroundImage: wireSvg, backgroundSize: `${UNIT}px 40px`, ['--fl-wire' as string]: wire }}
    >
      <div className={styles.row}>
        {Array.from({ length: units }).map((_, i) => {
          const tone = tones[Math.floor(jc[i] * tones.length)];
          const size = 7 + Math.round(js[i] * 4);
          return (
            <span key={i} className={styles.unit}>
              <span
                className={`${styles.bulb} ${styles[tone]}`}
                style={{
                  left: `calc(50% + ${(jx[i] - 0.5) * 22}px)`,
                  top: `${18 + jy[i] * 9}px`,
                  width: size,
                  height: size + 3,
                  animationDelay: `${(jc[i] * 3.2).toFixed(2)}s`,
                  transform: `translateX(-50%) rotate(${(jx[i] - 0.5) * 26}deg)`,
                }}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** A length of the same tinsel draped over an element, tilted and overhanging
 *  so it looks laid there by hand. Place in a `position: relative` parent;
 *  position it with a wrapper class passed in `className`. */
export function TinselDrape({
  width = 170,
  angle = -5,
  className = '',
}: {
  width?: number;
  angle?: number;
  className?: string;
}) {
  if (!FESTIVE) return null;
  return (
    <div
      className={`${styles.drape} ${className}`}
      aria-hidden="true"
      style={{
        width,
        backgroundImage: TINSEL_BG,
        backgroundSize: TINSEL_TILE,
        transform: `rotate(${angle}deg)`,
      }}
    />
  );
}

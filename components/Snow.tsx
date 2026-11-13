'use client';

import { useEffect, useState } from 'react';
import { FESTIVE } from '@/lib/festive';
import styles from './Snow.module.css';

interface Flake {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
  shape: 'dot' | 'flake';
  variant: 0 | 1;
  spin: number;
}

const COUNT = 32;

function makeFlakes(): Flake[] {
  return Array.from({ length: COUNT }, () => {
    // ~45% fall as proper snowflake shapes; the rest stay as fine dots.
    const isFlake = Math.random() < 0.45;
    return {
      left: Math.random() * 100,
      size: isFlake ? 11 + Math.random() * 11 : 2 + Math.random() * 3.5,
      duration: 10 + Math.random() * 12,
      delay: -Math.random() * 22,
      drift: (Math.random() * 2 - 1) * 60,
      opacity: isFlake ? 0.6 + Math.random() * 0.35 : 0.35 + Math.random() * 0.4,
      shape: isFlake ? 'flake' : 'dot',
      variant: (Math.random() < 0.5 ? 0 : 1) as 0 | 1,
      spin: (Math.random() * 2 - 1) * 300,
    };
  });
}

/* Two crisp 6-fold snowflakes (white strokes; a soft shadow in CSS gives them
   an edge on the light paper and makes them glow on the dark sections). */
function SnowflakeSvg({ variant }: { variant: 0 | 1 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={styles.svg} aria-hidden="true">
      <g stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1.5" x2="12" y2="22.5" />
        <line x1="2.9" y1="6.75" x2="21.1" y2="17.25" />
        <line x1="2.9" y1="17.25" x2="21.1" y2="6.75" />
        {/* chevrons near each of the six tips */}
        <path d="M12 4.5l-2.4-1.6M12 4.5l2.4-1.6M12 19.5l-2.4 1.6M12 19.5l2.4 1.6" />
        <path d="M5.1 8.0l-2.7-.5M5.1 8.0l.4-2.7M18.9 16.0l2.7.5M18.9 16.0l-.4 2.7" />
        <path d="M18.9 8.0l.4 2.7M18.9 8.0l2.7-.5M5.1 16.0l-.4-2.7M5.1 16.0l-2.7.5" />
        {variant === 1 && (
          <path d="M12 9.2l-1.7 1M12 9.2l1.7 1M12 14.8l-1.7-1M12 14.8l1.7-1M9.4 10.7l-.05 2M14.6 10.7l.05 2M9.4 13.3l-.05-2M14.6 13.3l.05-2" />
        )}
      </g>
    </svg>
  );
}

/** Very subtle site-wide snowfall — a mix of fine dots and crisp snowflakes.
 *  Generated on the client only (no hydration mismatch), hidden for
 *  prefers-reduced-motion, and gated by the FESTIVE flag. */
export function Snow() {
  const [flakes, setFlakes] = useState<Flake[] | null>(null);

  useEffect(() => {
    if (!FESTIVE) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setFlakes(makeFlakes());
  }, []);

  if (!FESTIVE || !flakes) return null;

  return (
    <div className={styles.snow} aria-hidden="true">
      {flakes.map((f, i) => (
        <span
          key={i}
          className={`${styles.flake} ${f.shape === 'flake' ? styles.glyph : ''}`}
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            ['--drift' as string]: `${f.drift}px`,
            ['--spin' as string]: `${f.spin}deg`,
          }}
        >
          {f.shape === 'flake' && <SnowflakeSvg variant={f.variant} />}
        </span>
      ))}
    </div>
  );
}

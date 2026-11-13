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
  glyph: string | null;
  spin: number;
}

const COUNT = 30;
const GLYPHS = ['❄', '❅', '❆'];

function makeFlakes(): Flake[] {
  return Array.from({ length: COUNT }, () => {
    // ~40% fall as little snowflake shapes; the rest stay as fine dots.
    const isGlyph = Math.random() < 0.4;
    return {
      left: Math.random() * 100,
      size: isGlyph ? 7 + Math.random() * 8 : 2 + Math.random() * 4,
      duration: 9 + Math.random() * 11,
      delay: -Math.random() * 20,
      drift: (Math.random() * 2 - 1) * 60,
      opacity: isGlyph ? 0.45 + Math.random() * 0.4 : 0.35 + Math.random() * 0.4,
      glyph: isGlyph ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : null,
      spin: (Math.random() * 2 - 1) * 360,
    };
  });
}

/** Very subtle site-wide snowfall. Generated on the client only (no hydration
 *  mismatch), hidden for prefers-reduced-motion, and gated by the FESTIVE flag. */
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
          className={`${styles.flake} ${f.glyph ? styles.glyph : ''}`}
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            fontSize: f.glyph ? `${f.size}px` : undefined,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            ['--drift' as string]: `${f.drift}px`,
            ['--spin' as string]: `${f.spin}deg`,
          }}
        >
          {f.glyph}
        </span>
      ))}
    </div>
  );
}

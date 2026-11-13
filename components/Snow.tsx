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
}

const COUNT = 26;

function makeFlakes(): Flake[] {
  return Array.from({ length: COUNT }, () => ({
    left: Math.random() * 100,
    size: 2 + Math.random() * 4,
    duration: 9 + Math.random() * 11,
    delay: -Math.random() * 20,
    drift: (Math.random() * 2 - 1) * 60,
    opacity: 0.35 + Math.random() * 0.4,
  }));
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
          className={styles.flake}
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            ['--drift' as string]: `${f.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

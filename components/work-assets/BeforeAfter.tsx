'use client';

import { useEffect, useRef, useState } from 'react';
import { Picture } from '@/components/Picture';
import styles from './BeforeAfter.module.css';

/**
 * Drag-to-compare before/after. A native range input drives the split so it
 * works with keyboard and screen readers; on first view the divider sweeps
 * once to show it can be moved.
 */
export function BeforeAfter({ before, after, label }: { before: string; after: string; label: string }) {
  const [pos, setPos] = useState(50);
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const touchedRef = useRef(false);
  touchedRef.current = touched;

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - start) / 1800, 1);
        const eased = Math.sin(p * Math.PI * 2) * (1 - p);
        setPos(prev => (touchedRef.current ? prev : 50 + eased * 22));
        if (p < 1 && !touchedRef.current) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={ref} className={styles.frame} style={{ '--pos': `${pos}%` } as React.CSSProperties}>
      <Picture src={after} alt={`${label} — after`} className={styles.img} intrinsicSize={false} />
      <div className={styles.beforeLayer} aria-hidden="true">
        <Picture src={before} alt="" className={styles.img} intrinsicSize={false} />
      </div>
      <span className={`${styles.tag} ${styles.tagBefore}`}>Before</span>
      <span className={`${styles.tag} ${styles.tagAfter}`}>After</span>
      <div className={styles.handle} aria-hidden="true">
        <span className={styles.knob}>
          <svg viewBox="0 0 24 24"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={0.5}
        value={pos}
        onChange={e => { setTouched(true); setPos(Number(e.target.value)); }}
        onPointerDown={() => setTouched(true)}
        className={styles.range}
        aria-label={`Compare before and after: ${label}`}
      />
    </div>
  );
}

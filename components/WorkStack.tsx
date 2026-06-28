'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { WorkPlaceholder } from './WorkPlaceholder';
import styles from './WorkStack.module.css';

const EASE = 'cubic-bezier(.22,.61,.36,1)';

export interface Study {
  slug: string;
  brand: string;
  cat: string;
  headline: string;
  body: string;
  image?: string;
  sampleHref: string;
  bg: string;
  tint: string;
  isConcept?: boolean;
}

/* Card position maths — taken verbatim from the approved prototype. */
function tf(rel: number): React.CSSProperties {
  if (rel >= 0) {
    const x = rel * 32;
    const sc = Math.max(0.8, 1 - rel * 0.06);
    const y = rel * 10;
    return {
      transform: `translate3d(${x}px,${y}px,0) scale(${sc})`,
      opacity: rel < 4.4 ? 1 : 0,
      zIndex: 1000 - Math.round(rel * 10),
      filter: `brightness(${Math.max(0.62, 1 - rel * 0.09)})`,
    };
  }
  const k = Math.min(1, -rel);
  return {
    transform: `translate3d(${-k * 128}%,0,0) scale(${1 - k * 0.05}) rotate(${-k * 3}deg)`,
    opacity: 1 - k,
    zIndex: 1200,
    filter: 'brightness(1)',
  };
}

export function WorkStack({ items }: { items: Study[] }) {
  const [cur, setCur] = useState(0);
  const [drag, setDrag] = useState(0);
  const dragging = useRef(false);
  const stage = useRef<HTMLDivElement>(null);
  const p = useRef({ startX: 0, lastX: 0, lastT: 0, vel: 0, w: 1 });
  const N = items.length;

  const go = (i: number) => { setCur(Math.max(0, Math.min(N - 1, i))); setDrag(0); };

  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-sample]')) return;
    dragging.current = true;
    const card = stage.current!.querySelector('[data-card]') as HTMLElement;
    p.current = { startX: e.clientX, lastX: e.clientX, lastT: performance.now(), vel: 0, w: card.offsetWidth || 1 };
    stage.current!.setPointerCapture(e.pointerId);
  };

  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - p.current.startX;
    let d = -dx / p.current.w;
    if ((cur === 0 && d < 0) || (cur === N - 1 && d > 0)) d *= 0.32;
    const now = performance.now();
    p.current.vel = (e.clientX - p.current.lastX) / ((now - p.current.lastT) || 16);
    p.current.lastX = e.clientX; p.current.lastT = now;
    setDrag(d);
  };

  const onUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const { vel } = p.current;
    if (drag > 0.22 || vel < -0.45) setCur(c => Math.min(N - 1, c + 1));
    else if (drag < -0.22 || vel > 0.45) setCur(c => Math.max(0, c - 1));
    setDrag(0);
  };

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(cur + 1);
      if (e.key === 'ArrowLeft') go(cur - 1);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [cur]); // eslint-disable-line react-hooks/exhaustive-deps

  if (N === 0) return null;

  return (
    <section className={styles.work} aria-roledescription="card stack" aria-label="Selected concept work">
      <div className="container">
        <div className={styles.head}>
          <p className="index-label">
            <span className="point point--sm" aria-hidden="true" />
            Selected work
          </p>
          <h2 className={styles.title}>
            Six sample projects.<br />Swipe the stack.
          </h2>
        </div>

        <div
          className={styles.stage}
          ref={stage}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          {items.map((s, i) => {
            const rel = (i - cur) - drag;
            const st = tf(rel);
            const front = i === cur;
            return (
              <article
                key={s.slug}
                data-card
                className={styles.card}
                style={{
                  ...st,
                  transition: dragging.current
                    ? 'none'
                    : `transform .55s ${EASE}, opacity .45s ${EASE}, filter .55s ${EASE}`,
                  pointerEvents: front && !dragging.current ? 'auto' : 'none',
                  background: s.bg,
                  cursor: front ? (dragging.current ? 'grabbing' : 'grab') : 'default',
                }}
                aria-hidden={!front}
              >
                <div className={styles.inner}>
                  <div className={styles.media}>
                    {s.image ? (
                      <>
                        <img src={s.image} alt={`${s.brand} — sample work`} />
                        <span className={styles.veil} style={{ background: s.tint }} />
                      </>
                    ) : (
                      <WorkPlaceholder label={s.brand} />
                    )}
                    {s.isConcept && <span className={styles.badge}>Concept</span>}
                  </div>
                  <div className={styles.meta}>
                    <div className={styles.brand}><b />{s.brand}</div>
                    <div className={styles.cat}>{s.cat}</div>
                    <h3 className={styles.headline}>{s.headline}</h3>
                    <p className={styles.body}>{s.body}</p>
                    <Link className={styles.sample} data-sample href={s.sampleHref}>See the sample →</Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.controls}>
          <div className={styles.dots}>
            {items.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                className={`${styles.dot} ${i === cur ? styles.on : ''}`}
                aria-label={`Project ${i + 1}: ${s.brand}`}
                aria-current={i === cur}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <div className={styles.count}>
            <em>{String(cur + 1).padStart(2, '0')}</em> / {String(N).padStart(2, '0')}
          </div>
          <div className={styles.nav}>
            <button onClick={() => go(cur - 1)} disabled={cur === 0} aria-label="Previous">‹</button>
            <button onClick={() => go(cur + 1)} disabled={cur === N - 1} aria-label="Next">›</button>
          </div>
        </div>
      </div>
    </section>
  );
}

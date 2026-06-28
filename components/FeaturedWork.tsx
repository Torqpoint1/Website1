'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './FeaturedWork.module.css';

export interface FeaturedItem {
  slug: string;
  client?: string;
  sector?: string;
  location?: string;
  title: string;
  summary?: string;
  cover: string;
}

export function FeaturedWork({ items }: { items: FeaturedItem[] }) {
  const [active, setActive] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    if (items.length <= 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (!paused.current) setActive(a => (a + 1) % items.length);
    }, 5500);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;
  const item = items[active];

  const hold = () => { paused.current = true; };
  const release = () => { paused.current = false; };

  return (
    <section
      className={styles.section}
      aria-label="Selected concept work"
      onMouseEnter={hold}
      onMouseLeave={release}
      onFocusCapture={hold}
      onBlurCapture={release}
    >
      <div className="container">
        <div className={`section-header ${styles.head}`}>
          <p className="index-label">
            <span className="point point--sm" aria-hidden="true" />
            Selected work
          </p>
          <h2 id="featured-heading">
            Sample projects, <span className={styles.forge}>made real.</span>
          </h2>
          <Link href="/work" className={styles.seeAll}>See all work →</Link>
        </div>

        <Link key={active} href={`/work/${item.slug}/`} className={styles.card}>
          <div className={styles.media}>
            <span className={styles.badge}>Concept</span>
            <img src={item.cover} alt="" />
          </div>
          <div className={styles.body}>
            {item.client && (
              <p className="eyebrow">
                <span className="point point--sm" aria-hidden="true" />
                {item.client}
              </p>
            )}
            {(item.sector || item.location) && (
              <p className={styles.meta}>{[item.sector, item.location].filter(Boolean).join(' · ')}</p>
            )}
            <h3 className={styles.title}>{item.title}</h3>
            {item.summary && <p className={styles.summary}>{item.summary}</p>}
            <span className={styles.cta}>See the sample →</span>
          </div>
        </Link>

        <div className={styles.dots} role="tablist" aria-label="Choose a project">
          {items.map((it, i) => (
            <button
              key={it.slug}
              type="button"
              className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
              aria-label={it.client ?? it.title}
              aria-selected={i === active}
              role="tab"
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

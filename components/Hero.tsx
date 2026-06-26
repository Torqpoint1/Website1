'use client';

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { HeroEntrance } from './HeroEntrance';
import styles from './Hero.module.css';

export function Hero() {
  const blobRef = useRef<HTMLDivElement>(null);

  /* Scroll-driven parallax on the background glow */
  useEffect(() => {
    const blob = blobRef.current;
    if (!blob || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const update = () => {
      blob.style.transform = `translateY(${window.scrollY * 0.22}px)`;
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <section className={styles.hero} aria-label="Introduction">
      {/* Scroll-parallax background glow */}
      <div ref={blobRef} className={styles.bgBlob} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <HeroEntrance className={styles.grid}>
          <div className={styles.content}>
            <p className={`eyebrow ${styles.eyebrow}`} data-hero>
              <span className="point point--sm" aria-hidden="true" />
              Content &amp; marketing · Gloucestershire
            </p>

            <h1 className={styles.headline} data-hero>
              Your best work deserves better than the{' '}
              <span className={styles.forge}>
                camera roll<span className={styles.signaturePoint} aria-hidden="true" />
              </span>
            </h1>

            <p className={`${styles.lead} font-serif`} data-hero>
              We turn your finished projects into posts, case studies and emails
              that win the next job — so you look{' '}
              <em>as good online as the work actually is.</em>
            </p>

            <div className={styles.ctas} data-hero>
              <Link href="/contact" className="btn btn-primary">
                Start a project
              </Link>
              <Link href="/services" className="btn btn-ghost">
                See what we do
              </Link>
            </div>
          </div>
        </HeroEntrance>

        {/* Scroll cue */}
        <div className={styles.scrollCue} aria-hidden="true" data-hero>
          <span className={styles.scrollLine} />
          Scroll
        </div>
      </div>
    </section>
  );
}

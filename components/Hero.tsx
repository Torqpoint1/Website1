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
              Content &amp; marketing for trades · Gloucestershire
            </p>

            <h1 className={styles.headline} data-hero>
              Stop renting your leads. Start owning your{' '}
              <span className={styles.forge}>
                proof<span className={styles.signaturePoint} aria-hidden="true" />
              </span>
            </h1>

            <p className={`${styles.lead} font-serif`} data-hero>
              Directory sites charge you every month to hand the same enquiry to
              four other firms. We turn your finished jobs into case studies, photos
              and a Google presence that <em>belong to you</em> — and keep working
              long after the invoice is paid.
            </p>

            <div className={styles.ctas} data-hero>
              <Link href="/contact" className="btn btn-primary" data-track="book_call_click" data-track-place="hero">
                Book a call
              </Link>
              <Link href="/pricing" className="btn btn-ghost" data-track="see_pricing_click" data-track-place="hero">
                See what it costs
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

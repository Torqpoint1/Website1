'use client';

import Link from 'next/link';
import { useRef, useCallback, useEffect } from 'react';
import { HeroEntrance } from './HeroEntrance';
import styles from './Hero.module.css';

export function Hero() {
  const socialRef = useRef<HTMLDivElement>(null);
  const caseRef   = useRef<HTMLDivElement>(null);
  const proofRef  = useRef<HTMLDivElement>(null);
  const blobRef   = useRef<HTMLDivElement>(null);

  /* Scroll-driven parallax on the background blob */
  useEffect(() => {
    const blob = blobRef.current;
    if (!blob || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const update = () => {
      blob.style.transform = `translateY(${window.scrollY * 0.28}px)`;
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  /* Mouse parallax on the proof artifacts */
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 920) return;
    const rect = proofRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = (e.clientX - rect.left - rect.width  / 2) / rect.width;
    const dy = (e.clientY - rect.top  - rect.height / 2) / rect.height;
    if (socialRef.current)
      socialRef.current.style.transform = `translate(${dx * 22}px, ${dy * 16}px)`;
    if (caseRef.current)
      caseRef.current.style.transform   = `translate(${dx * -16}px, ${dy * -12}px)`;
  }, []);

  const onMouseLeave = useCallback(() => {
    if (socialRef.current) socialRef.current.style.transform = '';
    if (caseRef.current)   caseRef.current.style.transform   = '';
  }, []);

  return (
    <section className={styles.hero} aria-label="Introduction">
      {/* Scroll-parallax background blob */}
      <div ref={blobRef} className={styles.bgBlob} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <HeroEntrance className={styles.grid}>
          {/* ── Left: the statement ─────────────────────── */}
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

          {/* ── Right: the proof — what your work becomes ── */}
          <div
            ref={proofRef}
            className={styles.proof}
            aria-hidden="true"
            data-hero
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
          >
            {/* Social post artifact — parallax layer A + auto-rock */}
            <div ref={socialRef} className={styles.wrapSocial}>
              <div className={`${styles.artifact} ${styles.artifactSocial}`}>
                <div className={styles.artHead}>
                  <span className={styles.artLabel}>
                    <span className="point point--sm" />
                    Social post
                  </span>
                </div>
                <div className={styles.artPhoto} />
                <div className={styles.artCaption}>
                  <span className={styles.lineWide} />
                  <span className={styles.lineMid} />
                </div>
              </div>
            </div>

            {/* Case study artifact — parallax layer B + counter-rock */}
            <div ref={caseRef} className={styles.wrapCase}>
              <div className={`${styles.artifact} ${styles.artifactCase}`}>
                <span className={styles.artLabel}>
                  <span className="point point--sm" />
                  Case study
                </span>
                <p className={`${styles.caseTitle} font-serif`}>
                  A kitchen, rebuilt from the ground up.
                </p>
                <div className={styles.caseBody}>
                  <span className={styles.lineWide} />
                  <span className={styles.lineWide} />
                  <span className={styles.lineMid} />
                </div>
                <div className={styles.caseFoot}>
                  <span className={styles.caseMeta}>Read case study</span>
                  <span className={styles.caseArrow}>→</span>
                </div>
              </div>
            </div>

            {/* Newsletter chip — gently floats */}
            <div className={styles.chip}>
              <span className="point point--sm" />
              Newsletter · in your voice
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

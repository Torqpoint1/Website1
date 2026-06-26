'use client';

import Link from 'next/link';
import { HeroEntrance } from './HeroEntrance';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero} aria-label="Introduction">
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
          <div className={styles.proof} aria-hidden="true" data-hero>
            {/* Social post artifact (behind) */}
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

            {/* Case study artifact (front) */}
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

            {/* Newsletter chip (floating) */}
            <div className={`${styles.chip}`}>
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

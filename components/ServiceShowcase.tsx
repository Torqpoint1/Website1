'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import styles from './ServiceShowcase.module.css';

interface Card {
  label: string;
  desc: string;
  rot: number;
  tx: number;
  w: number;
  render: () => React.ReactNode;
}

const cards: Card[] = [
  {
    label: 'Case study page',
    desc: 'The job written up on your own website — yours for good.',
    rot: 2.5,
    tx: 16,
    w: 272,
    render: () => (
      <>
        <p className={`${styles.serifTitle} font-serif`}>Leckhampton wet room, strip-out to handover.</p>
        <div className={styles.lines}>
          <span className={styles.lineWide} />
          <span className={styles.lineWide} />
          <span className={styles.lineMid} />
        </div>
      </>
    ),
  },
  {
    label: 'Before & after set',
    desc: 'Edited, ordered and captioned — the proof a homeowner asks for.',
    rot: -3,
    tx: -14,
    w: 312,
    render: () => (
      <div className={styles.baPair}>
        <div className={`${styles.baShot} ${styles.baBefore}`}><span>Before</span></div>
        <div className={`${styles.baShot} ${styles.baAfter}`}><span>After</span></div>
      </div>
    ),
  },
  {
    label: 'Google Business post',
    desc: 'The finished job, right where local searches start.',
    rot: 2.5,
    tx: 14,
    w: 300,
    render: () => (
      <>
        <p className={styles.subject}>
          <span className={styles.subjectLabel}>Update · Cheltenham</span>
          Just finished: a walk-in wet room in Leckhampton.
        </p>
        <div className={styles.photoSm} />
      </>
    ),
  },
  {
    label: 'Four social posts',
    desc: 'Built from the job photos, ready to publish.',
    rot: -2,
    tx: -12,
    w: 290,
    render: () => (
      <>
        <div className={styles.photo} />
        <div className={styles.lines}>
          <span className={styles.lineWide} />
          <span className={styles.lineMid} />
        </div>
      </>
    ),
  },
  {
    label: 'Review request',
    desc: 'Written for you to send the homeowner on handover day.',
    rot: 3,
    tx: 16,
    w: 284,
    render: () => (
      <>
        <p className={styles.subject}>
          <span className={styles.subjectLabel}>To: Mrs Carter</span>
          Thanks for having us — would you mind leaving a quick review?
        </p>
        <div className={styles.lines}>
          <span className={styles.lineWide} />
          <span className={styles.lineMid} />
        </div>
      </>
    ),
  },
];

export function ServiceShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const total = section.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-section.getBoundingClientRect().top, 0), total);
      const progress = total > 0 ? scrolled / total : 0;
      const idx = Math.min(cards.length - 1, Math.floor(progress * cards.length));
      setActive(idx);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.showcase}
      aria-label="What one finished job becomes"
    >
      <div className={styles.sticky}>
        <div className={styles.deskGrid}>
          {/* Desktop-only statement (left column). Hidden on mobile,
              where the standalone Hero handles this instead. */}
          <div className={styles.deskText}>
            <p className={`eyebrow ${styles.eyebrow}`}>
              <span className="point point--sm" aria-hidden="true" />
              Content &amp; marketing for trades · Gloucestershire
            </p>
            <h1 className={styles.headline}>
              Stop renting your leads. Start owning your{' '}
              <span className={styles.forge}>
                proof<span className={styles.signaturePoint} aria-hidden="true" />
              </span>
            </h1>
            <p className={`${styles.lead} font-serif`}>
              Directory sites charge you every month to hand the same enquiry to
              four other firms. We turn your finished jobs into case studies, photos
              and a Google presence that <em>belong to you</em> — and keep working
              long after the invoice is paid.
            </p>
            <div className={styles.ctas}>
              <Link href="/contact" className="btn btn-primary" data-track="book_call_click" data-track-place="hero">Book a call</Link>
              <Link href="/pricing" className="btn btn-ghost" data-track="see_pricing_click" data-track-place="hero">See what it costs</Link>
            </div>
          </div>

          <div className={styles.stage}>
            {/* faint cards behind, for layered depth */}
            <div className={styles.ghost} aria-hidden="true" />
            <div className={styles.ghost2} aria-hidden="true" />

            {cards.map((card, i) => (
            <article
              key={card.label}
              style={{ '--rot': `${card.rot}deg`, '--tx': `${card.tx}px`, '--w': `${card.w}px` } as React.CSSProperties}
              className={`${styles.card} ${
                i === active ? styles.cardActive : i < active ? styles.cardPrev : styles.cardNext
              }`}
              aria-hidden={i !== active}
            >
              <span className={styles.cardLabel}>
                <span className="point point--sm" aria-hidden="true" />
                {card.label}
              </span>
              <div className={styles.cardBody}>{card.render()}</div>
              <p className={styles.desc}>{card.desc}</p>
            </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

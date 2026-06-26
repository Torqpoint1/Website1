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
    label: 'Case study',
    desc: 'Your finished jobs, written up to win the next one.',
    rot: 2.5,
    tx: 16,
    w: 262,
    render: () => (
      <>
        <p className={`${styles.serifTitle} font-serif`}>Your project, written up properly.</p>
        <div className={styles.lines}>
          <span className={styles.lineWide} />
          <span className={styles.lineWide} />
          <span className={styles.lineMid} />
        </div>
      </>
    ),
  },
  {
    label: 'Email & newsletter',
    desc: 'Keeps you in front of past customers and warm leads.',
    rot: -3,
    tx: -14,
    w: 284,
    render: () => (
      <>
        <p className={styles.subject}>
          <span className={styles.subjectLabel}>Subject</span>
          One job done, the next one lined up.
        </p>
        <div className={styles.lines}>
          <span className={styles.lineWide} />
          <span className={styles.lineMid} />
        </div>
      </>
    ),
  },
  {
    label: 'Website design & build',
    desc: 'A fast, on-brand site that turns visitors into enquiries.',
    rot: 2.5,
    tx: 14,
    w: 324,
    render: () => (
      <>
        <div className={styles.browser}>
          <span className={styles.browserDot} />
          <span className={styles.browserDot} />
          <span className={styles.browserDot} />
        </div>
        <div className={styles.siteHero} />
        <div className={styles.siteRow}>
          <span className={styles.siteBlock} />
          <span className={styles.siteBlock} />
          <span className={styles.siteBlock} />
        </div>
      </>
    ),
  },
  {
    label: 'Blog article',
    desc: 'Genuinely useful pieces that help you rank on Google.',
    rot: -2,
    tx: -12,
    w: 256,
    render: () => (
      <>
        <p className={`${styles.serifTitle} font-serif`}>The five questions every customer asks first.</p>
        <div className={styles.lines}>
          <span className={styles.lineWide} />
          <span className={styles.lineWide} />
          <span className={styles.lineMid} />
        </div>
      </>
    ),
  },
  {
    label: 'Social post',
    desc: 'A month of scheduled posts, built from your project photos.',
    rot: 3,
    tx: 16,
    w: 300,
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
      aria-label="What your work becomes"
    >
      <div className={styles.sticky}>
        <div className={styles.deskGrid}>
          {/* Desktop-only statement (left column). Hidden on mobile,
              where the standalone Hero handles this instead. */}
          <div className={styles.deskText}>
            <p className={`eyebrow ${styles.eyebrow}`}>
              <span className="point point--sm" aria-hidden="true" />
              Content &amp; marketing · Gloucestershire
            </p>
            <h1 className={styles.headline}>
              Your best work deserves better than the{' '}
              <span className={styles.forge}>
                camera roll<span className={styles.signaturePoint} aria-hidden="true" />
              </span>
            </h1>
            <p className={`${styles.lead} font-serif`}>
              We turn your finished projects into posts, case studies and emails
              that win the next job — so you look{' '}
              <em>as good online as the work actually is.</em>
            </p>
            <div className={styles.ctas}>
              <Link href="/contact" className="btn btn-primary">Start a project</Link>
              <Link href="/services" className="btn btn-ghost">See what we do</Link>
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

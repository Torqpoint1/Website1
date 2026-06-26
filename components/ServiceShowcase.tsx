'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ServiceShowcase.module.css';

interface Card {
  label: string;
  render: () => React.ReactNode;
}

const cards: Card[] = [
  {
    label: 'Social post',
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
    label: 'Case study',
    render: () => (
      <>
        <p className={`${styles.serifTitle} font-serif`}>Your project, written up properly.</p>
        <div className={styles.lines}>
          <span className={styles.lineWide} />
          <span className={styles.lineWide} />
          <span className={styles.lineMid} />
        </div>
        <div className={styles.foot}>
          <span className={styles.footLink}>Read case study</span>
          <span className={styles.footArrow}>→</span>
        </div>
      </>
    ),
  },
  {
    label: 'Email & newsletter',
    render: () => (
      <>
        <p className={styles.subject}>
          <span className={styles.subjectLabel}>Subject</span>
          One job done, the next one lined up.
        </p>
        <div className={styles.lines}>
          <span className={styles.lineWide} />
          <span className={styles.lineWide} />
          <span className={styles.lineMid} />
        </div>
        <div className={styles.foot}>
          <span className={styles.footTag}>Written in your voice</span>
        </div>
      </>
    ),
  },
  {
    label: 'Blog article',
    render: () => (
      <>
        <p className={`${styles.serifTitle} font-serif`}>The five questions every customer asks first.</p>
        <div className={styles.lines}>
          <span className={styles.lineWide} />
          <span className={styles.lineWide} />
          <span className={styles.lineWide} />
          <span className={styles.lineMid} />
        </div>
        <div className={styles.foot}>
          <span className={styles.footTag}>Helps you rank on Google</span>
        </div>
      </>
    ),
  },
  {
    label: 'Website design & build',
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
        <div className={styles.intro}>
          <p className="eyebrow">
            <span className="point point--sm" aria-hidden="true" />
            What your work becomes
          </p>
          <h2 className={styles.heading}>
            One project. <span className={styles.forge}>Everywhere it should be.</span>
          </h2>
        </div>

        <div className={styles.stage}>
          {cards.map((card, i) => (
            <article
              key={card.label}
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
            </article>
          ))}
        </div>

        <div className={styles.dots} aria-hidden="true">
          {cards.map((card, i) => (
            <span
              key={card.label}
              className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

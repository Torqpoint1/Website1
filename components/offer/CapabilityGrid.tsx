'use client';

import Link from 'next/link';
import { ScrollReveal } from '@/components/ScrollReveal';
import { CAPABILITY_ORDER, SERVICES } from '@/lib/services';
import styles from './CapabilityGrid.module.css';

/* Short, punchy one-liners for each capability tile. */
const BLURB: Record<string, string> = {
  'case-studies': 'Your best jobs, written up as proof.',
  'social-posts': 'A month of posts from your photos.',
  'google-business-posts': 'Show up when people search nearby.',
  'blog-articles': 'Answer what customers Google first.',
  'email-newsletters': 'Stay in front of past customers.',
  'profiles-setup': 'Every profile, set up to convert.',
  'website-design-build': 'A fast site built to win enquiries.',
  'anything-else': 'If it wins work, just ask.',
};

/* Simple, consistent line icons (stroke = currentColor). */
const ICONS: Record<string, React.ReactNode> = {
  'case-studies': (
    <>
      <path d="M6 3.5h8l4 4V20.5H6Z" />
      <path d="M14 3.5v4h4" />
      <path d="M9 12h6M9 15.5h6" />
    </>
  ),
  'social-posts': (
    <>
      <path d="M4 5.5h16v10H9l-4 3.5v-3.5H4Z" />
      <path d="M8.5 10.5h7M8.5 13h4" />
    </>
  ),
  'google-business-posts': (
    <>
      <path d="M12 21s6.5-5.2 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.8 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.4" />
    </>
  ),
  'blog-articles': (
    <>
      <path d="M5 4.5h10l4 4v11H5Z" />
      <path d="M8 10h6M8 13h8M8 16h5" />
    </>
  ),
  'email-newsletters': (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  'profiles-setup': (
    <>
      <circle cx="9" cy="9" r="2.6" />
      <path d="M4.5 19c0-2.8 2-4.6 4.5-4.6s4.5 1.8 4.5 4.6" />
      <path d="M15.5 8.5h5M15.5 12h5M15.5 15.5h3" />
    </>
  ),
  'website-design-build': (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <path d="M3.5 9h17" />
      <circle cx="6.5" cy="6.75" r=".6" fill="currentColor" stroke="none" />
      <circle cx="8.6" cy="6.75" r=".6" fill="currentColor" stroke="none" />
    </>
  ),
  'anything-else': (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8.5v7M8.5 12h7" />
    </>
  ),
};

function setSpot(e: React.PointerEvent<HTMLAnchorElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
}

export function CapabilityGrid() {
  const items = CAPABILITY_ORDER;

  return (
    <ScrollReveal className={styles.grid} stagger staggerStep={0.06} direction="scale">
      {items.map((slug, i) => (
        <Link
          key={slug}
          href={`/services/${slug}`}
          className={styles.tile}
          onPointerMove={setSpot}
        >
          <span className={styles.spot} aria-hidden="true" />
          <span className={styles.top}>
            <span className={styles.icon} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                {ICONS[slug]}
              </svg>
            </span>
            <span className={styles.index} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          </span>

          <span className={styles.name}>{SERVICES[slug].name}</span>
          <span className={styles.blurb}>{BLURB[slug]}</span>

          <span className={styles.cue} aria-hidden="true">
            See how <span className={styles.arrow}>→</span>
          </span>
        </Link>
      ))}
    </ScrollReveal>
  );
}

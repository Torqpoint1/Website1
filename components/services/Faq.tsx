'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { Faq } from '@/lib/services';
import { withEmphasis } from './emphasis';
import styles from './service.module.css';

/**
 * Accessible FAQ accordion. Real <button> triggers with aria-expanded /
 * aria-controls; panels are role="region" + aria-labelledby. Height animates
 * via a measured max-height; reduced-motion users get instant open/close
 * (the transition is disabled in CSS). Multiple panels may be open at once.
 */
export function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number[]>([0]);
  const baseId = useId();

  const toggle = (i: number) =>
    setOpen(prev => (prev.includes(i) ? prev.filter(n => n !== i) : [...prev, i]));

  return (
    <div className={styles.faqList}>
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        const btnId = `${baseId}-faq-btn-${i}`;
        const panelId = `${baseId}-faq-panel-${i}`;
        return (
          <div key={item.q} className={styles.faqItem} data-open={isOpen}>
            <h3 className={styles.faqHeading}>
              <button
                type="button"
                id={btnId}
                className={styles.faqButton}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
              >
                <span>{item.q}</span>
                <span className={styles.faqChevron} aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M4 6.5L9 11.5L14 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </h3>
            <FaqPanel id={panelId} labelledBy={btnId} open={isOpen}>
              {withEmphasis(item.a)}
            </FaqPanel>
          </div>
        );
      })}
    </div>
  );
}

function FaqPanel({
  id,
  labelledBy,
  open,
  children,
}: {
  id: string;
  labelledBy: string;
  open: boolean;
  children: React.ReactNode;
}) {
  const inner = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(open ? 'none' : '0px');

  // Measure on open/close so the height transition has a concrete target.
  const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
  useIsoLayoutEffect(() => {
    const h = inner.current?.scrollHeight ?? 0;
    setMaxHeight(open ? `${h}px` : '0px');
  }, [open]);

  return (
    <div
      id={id}
      role="region"
      aria-labelledby={labelledBy}
      className={styles.faqPanel}
      style={{ maxHeight }}
    >
      <div ref={inner} className={styles.faqAnswer}>
        <p>{children}</p>
      </div>
    </div>
  );
}

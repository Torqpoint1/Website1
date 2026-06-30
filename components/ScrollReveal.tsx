'use client';

import { useEffect, useRef } from 'react';

type Direction = 'up' | 'left' | 'right' | 'scale';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
  /** Seconds between each staggered child. Lower = gentler, tighter cascade. */
  staggerStep?: number;
  delay?: number;
  direction?: Direction;
}

export function ScrollReveal({
  children,
  className = '',
  stagger = false,
  staggerStep = 0.14,
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const targets = stagger
      ? (Array.from(el.children) as HTMLElement[])
      : [el];

    targets.forEach((t, i) => {
      t.classList.add('will-animate');
      if (direction !== 'up') t.classList.add(`will-animate--${direction}`);
      (t as HTMLElement).style.transitionDelay = `${delay + i * staggerStep}s`;
    });

    const reveal = () => {
      targets.forEach(t => t.classList.add('is-visible'));
      clearTimeout(safety);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            reveal();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
    );

    observer.observe(el);

    // Safety timeout only for elements already visible on mount — prevents
    // content that's in the initial viewport from getting stuck invisible.
    // Below-fold elements stay hidden until scrolled into view (no timeout).
    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    const safety = alreadyVisible ? setTimeout(reveal, 2500) : 0;

    return () => {
      observer.disconnect();
      if (safety) clearTimeout(safety);
    };
  }, [stagger, staggerStep, delay, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

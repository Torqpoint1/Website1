'use client';

import { useEffect, useRef } from 'react';

type Direction = 'up' | 'left' | 'right' | 'scale';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
  delay?: number;
  direction?: Direction;
}

export function ScrollReveal({
  children,
  className = '',
  stagger = false,
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
      (t as HTMLElement).style.transitionDelay = `${delay + i * 0.085}s`;
    });

    const reveal = () => targets.forEach(t => t.classList.add('is-visible'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            reveal();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    );

    observer.observe(el);

    const safety = setTimeout(reveal, 2500);

    return () => {
      observer.disconnect();
      clearTimeout(safety);
    };
  }, [stagger, delay, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

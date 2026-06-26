'use client';

import { useEffect, useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
  delay?: number;
}

export function ScrollReveal({ children, className = '', stagger = false, delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const targets = stagger
      ? Array.from(el.children) as HTMLElement[]
      : [el];

    targets.forEach((t, i) => {
      t.classList.add('will-animate');
      (t as HTMLElement).style.transitionDelay = `${delay + i * 0.07}s`;
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
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(el);

    // Safety net: never leave content invisible. If the observer hasn't
    // fired within 2.5s (e.g. element already on-screen but callback missed,
    // or an odd webview), reveal anyway.
    const safety = setTimeout(reveal, 2500);

    return () => {
      observer.disconnect();
      clearTimeout(safety);
    };
  }, [stagger, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';

export function HeroEntrance({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const targets = Array.from(el.querySelectorAll('[data-hero]')) as HTMLElement[];

    targets.forEach(t => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(32px)';
      t.style.transition = 'opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1)';
    });

    let cancelled = false;
    const timer = setTimeout(() => {
      if (cancelled) return;
      targets.forEach((t, i) => {
        setTimeout(() => {
          if (cancelled) return;
          t.style.opacity = '1';
          t.style.transform = 'translateY(0)';
        }, i * 90);
      });
    }, 80);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

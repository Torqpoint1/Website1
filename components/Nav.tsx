'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import styles from './Nav.module.css';

const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/journal', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      drawerRef.current?.querySelector('a')?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Trap focus in drawer when open
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  const isHome = pathname === '/';

  return (
    <>
      <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} role="banner">
        <div className={`container ${styles.inner}`}>
          <Logo />

          <nav className={styles.desktop} aria-label="Main navigation">
            <ul className={styles.links}>
              {!isHome && (
                <li>
                  <Link href="/" className={styles.link}>
                    Home
                  </Link>
                </li>
              )}
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`${styles.link} ${pathname === href || pathname.startsWith(href + '/') ? styles.active : ''}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <Link href="/contact" className="btn btn-primary">
              Start a project
            </Link>
            <button
              className={styles.burger}
              onClick={() => setOpen(o => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-drawer"
            >
              <span className={`${styles.burgerLine} ${open ? styles.burgerOpen : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        id="mobile-drawer"
        ref={drawerRef}
        className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <nav aria-label="Mobile navigation">
          <ul className={styles.drawerLinks}>
            {!isHome && (
              <li>
                <Link
                  href="/"
                  className={styles.drawerLink}
                  tabIndex={open ? 0 : -1}
                >
                  <span className="point point--md" aria-hidden="true" />
                  Home
                </Link>
              </li>
            )}
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.drawerLink} ${pathname === href ? styles.drawerActive : ''}`}
                  tabIndex={open ? 0 : -1}
                >
                  <span className="point point--md" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.drawerCta}>
            <Link href="/contact" className="btn btn-primary" tabIndex={open ? 0 : -1}>
              Start a project
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}

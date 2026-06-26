import Link from 'next/link';
import { Logo } from './Logo';
import styles from './Footer.module.css';

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo size="lg" />
            <p className={styles.tagline}>
              Content that makes your work look as good as it is.{' '}
              <span className={styles.location}>Gloucestershire.</span>
            </p>
          </div>

          <div className={styles.columns}>
            <div className={styles.col}>
              <p className={styles.colHeading}>Pages</p>
              <ul className={styles.colLinks}>
                {[
                  { href: '/services', label: 'Services' },
                  { href: '/work', label: 'Work' },
                  { href: '/journal', label: 'Journal' },
                  { href: '/about', label: 'About' },
                  { href: '/contact', label: 'Contact' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className={styles.colLink}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.col}>
              <p className={styles.colHeading}>Get in touch</p>
              <ul className={styles.colLinks}>
                <li>
                  <Link href="/contact" className={styles.colLink}>Book a call</Link>
                </li>
                <li>
                  <a href="mailto:info@torqpoint.com" className={styles.colLink}>
                    info@torqpoint.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/torqpoint.co"
                    className={styles.colLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @torqpoint.co
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.legal}>
            &copy; {year} Torqpoint. All rights reserved.
          </p>
          <p className={styles.built}>
            Built in Gloucestershire<span className="point point--sm" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  );
}

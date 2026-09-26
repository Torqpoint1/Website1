import Link from 'next/link';
import { Logo } from './Logo';
import { EMAIL, INSTAGRAM_URL, PHONE_DISPLAY, hasPhone, telHref, whatsappHref } from '@/lib/contact';
import styles from './Footer.module.css';

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo size="lg" dark />
            <p className={styles.tagline}>
              Proof you own, not leads you rent. Content and marketing for trades across{' '}
              <Link href="/marketing-agency-gloucestershire" className={styles.location}>
                Gloucestershire.
              </Link>
            </p>
          </div>

          <div className={styles.columns}>
            <div className={styles.col}>
              <p className={styles.colHeading}>Pages</p>
              <ul className={styles.colLinks}>
                {[
                  { href: '/services', label: 'Services' },
                  { href: '/pricing', label: 'Pricing' },
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
                {hasPhone && (
                  <>
                    <li>
                      <a href={telHref} className={styles.colLink} data-track-place="footer">{PHONE_DISPLAY}</a>
                    </li>
                    <li>
                      <a href={whatsappHref} className={styles.colLink} data-track-place="footer" target="_blank" rel="noopener noreferrer">
                        WhatsApp us
                      </a>
                    </li>
                  </>
                )}
                <li>
                  <a href={`mailto:${EMAIL}`} className={styles.colLink}>
                    {EMAIL}
                  </a>
                </li>
                <li>
                  <a
                    href={INSTAGRAM_URL}
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
            <span className={styles.legalSep} aria-hidden="true">·</span>
            <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
          </p>
          <p className={styles.built}>
            Designed &amp; built in-house by{' '}
            <Link href="/services" className={styles.builtLink}>Torqpoint</Link>
            <span className="point point--sm" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  );
}

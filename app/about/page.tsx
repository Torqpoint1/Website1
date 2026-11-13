import type { Metadata } from 'next';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ScrollReveal';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const metadata: Metadata = pageMetadata({
  path: '/about/',
  title: 'About — the studio',
  description:
    'Torqpoint is a content and marketing studio in Gloucestershire. We turn the work local businesses do into case studies, photos and a Google presence they own.',
  og: 'about',
});

const credentials = [
  { big: 'Gloucestershire', small: 'based in the county we work across' },
  { big: 'A studio', small: 'one point of contact, never a call centre' },
  { big: 'Owned by you', small: 'everything we make is yours to keep' },
];

const values = [
  {
    name: 'No jargon',
    desc: 'Plain words about your work, in your voice. If it could have been written about any business, it doesn’t go out.',
  },
  {
    name: 'No retainer you can’t leave',
    desc: 'Job Stories are one-off. Engine is month to month with a month’s notice. Everything we make is yours.',
  },
  {
    name: 'No vanity metrics',
    desc: 'The point is enquiries and work won — not likes, reach or a monthly report nobody reads.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Header ──────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div className="container">
          <ScrollReveal stagger>
            <p className="eyebrow">
              <span className="point point--sm" aria-hidden="true" />
              About
            </p>
            <h1 className={styles.pageTitle}>
              A studio built to make good work{' '}
              <span className={styles.underline}>impossible to miss.</span>
            </h1>
          </ScrollReveal>
        </div>
      </div>

      {/* ── Studio ──────────────────────────────────────── */}
      <section className={`section ${styles.bodySection}`} aria-labelledby="about-body">
        <div className="container">
          <ScrollReveal className={styles.bodyText} stagger>
            <h2 id="about-body" className={styles.srOnly}>About the studio</h2>
            <p className={styles.leadPara}>
              Torqpoint is a content and marketing studio in Gloucestershire. We take
              the work local businesses are proud of and make sure the next customer
              actually sees it.
            </p>
            <p>
              Across the county, the businesses doing the best work are often the worst
              at showing it. A project worth thousands gets two phone photos and then
              disappears, while a competitor with half the craft and a decent feed takes
              the next enquiry. That gap — between how good the work is and how good it
              looks online — is the whole reason we exist.
            </p>
            <p>
              You send the raw material — a few photos and a voice note — and it comes
              back as finished work: written, shaped and edited until it sounds like you,
              not like us. When a job calls for a proper photographer or a specialist, we
              bring one in from the people we trust. Throughout, you deal with one point
              of contact and one consistent standard — no account managers relaying
              messages, no production line.
            </p>
            <p>
              What we don’t do is lock you in or dress it up. No jargon, no retainer you
              can’t leave, no vanity metrics — just your work, written up and put where
              people can find it, and kept entirely yours.
            </p>
          </ScrollReveal>

          <ScrollReveal className={styles.credentials} stagger staggerStep={0.1}>
            {credentials.map(c => (
              <div key={c.big} className={styles.credential}>
                <span className={styles.credentialBig}>{c.big}</span>
                <span className={styles.credentialSmall}>{c.small}</span>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ── How we work ─────────────────────────────────── */}
      <section className={`section ${styles.valuesSection}`} aria-labelledby="values-heading">
        <div className="container">
          <ScrollReveal className="section-header" stagger direction="left">
            <p className="eyebrow">
              <span className="point point--sm" aria-hidden="true" />
              How we work
            </p>
            <h2 id="values-heading">Three things you won&rsquo;t get from us.</h2>
          </ScrollReveal>
          <ScrollReveal className={styles.valuesGrid} stagger>
            {values.map(({ name, desc }) => (
              <div key={name} className={`card ${styles.valueCard}`}>
                <div className={styles.valueMarker} aria-hidden="true">
                  <span className="point point--md" />
                </div>
                <h3 className={styles.valueName}>{name}</h3>
                <p className={styles.valueDesc}>{desc}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA Band ────────────────────────────────────── */}
      <section className="cta-band cta-band--forge" aria-label="Call to action">
        <div className="container">
          <div className="cta-band__inner">
            <p className="cta-band__statement">
              Want to see what your best work could become?
            </p>
            <div className={styles.ctaPair}>
              <Link href="/contact" className="btn btn-ghost-light">
                Contact us
              </Link>
              <Link href="/pricing" className={`btn ${styles.ctaSolid}`}>
                See the plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ProductCards } from '@/components/offer/ProductCards';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const metadata: Metadata = pageMetadata({
  path: '/services/',
  title: 'Services — Job Story and Engine',
  description:
    'Two products for Gloucestershire trades: a Job Story (£350) turns one finished job into proof you keep; Engine (from £450/month) does it every month and manages your Google profile.',
  og: 'services',
});

const serviceList = [
  {
    name: 'Case studies',
    slug: 'case-studies',
    desc: 'The job written up — brief, problem, fit, handover — for your site and for prospects.',
  },
  {
    name: 'Social posts',
    slug: 'social-posts',
    desc: 'Four posts from every job, written and formatted for the platform.',
  },
  {
    name: 'Google Business posts',
    slug: 'google-business-posts',
    desc: 'Your profile kept active, so you show up where local searches start.',
  },
  {
    name: 'Blog articles',
    slug: 'blog-articles',
    desc: 'Answers to what homeowners search before they call — written to rank.',
  },
  {
    name: 'Email & newsletters',
    slug: 'email-newsletters',
    desc: 'Staying in front of past customers, so the referral comes to you.',
  },
  {
    name: 'Profiles & setup',
    slug: 'profiles-setup',
    desc: 'Google profile, socials and directories set up properly, once.',
  },
  {
    name: 'Website design & build',
    slug: 'website-design-build',
    desc: 'A fast site built around your finished jobs, so every project page sells the next.',
  },
  {
    name: 'Anything else',
    slug: 'anything-else',
    desc: 'Vans, signage, a review drive, a one-off campaign — if it wins work, ask.',
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* ── Header ──────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div className="container">
          <ScrollReveal stagger>
            <p className="eyebrow">
              <span className="point point--sm" aria-hidden="true" />
              Services
            </p>
            <h1 className={styles.pageTitle}>
              Two things to buy.{' '}
              <span className={styles.ink}>Both priced up front.</span>
            </h1>
            <p className={styles.pageIntro}>
              A Job Story turns one finished job into proof you keep. Engine does it every
              month and looks after your Google profile and reviews too. Everything
              further down the page is what goes into them.
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* ── What you can buy ────────────────────────────── */}
      <section className={`section ${styles.buySection}`} aria-labelledby="buy-heading">
        <div className="container">
          <ScrollReveal>
            <h2 id="buy-heading" className={styles.menuHeading}>What you can buy</h2>
          </ScrollReveal>
          <ProductCards />
          <ScrollReveal>
            <p className={styles.menuHint}>
              Paying a directory for leads?{' '}
              <Link href="/pricing/#compare" className={styles.menuHintLink}>
                See how it compares
              </Link>
              .
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── What goes into it ───────────────────────────── */}
      <section className={`section ${styles.menuSection}`} aria-labelledby="menu-heading">
        <div className="container">
          <ScrollReveal>
            <h2 id="menu-heading" className={styles.menuHeading}>What goes into it — and other work</h2>
            <p className={styles.menuHint}>
              The pieces behind every Job Story, and the bigger jobs we take on alongside.
              Click any one to see how it works — or see how it all comes together for{' '}
              <Link href="/marketing-agency-gloucestershire" className={styles.menuHintLink}>
                Gloucestershire trades
              </Link>.
            </p>
          </ScrollReveal>
          <ScrollReveal className={`${styles.serviceMenu} ${styles.serviceMenuCompact}`} stagger staggerStep={0.06}>
            {serviceList.map(({ name, slug, desc }) => (
              <Link key={name} href={`/services/${slug}`} className={styles.menuItem}>
                <div className={styles.menuItemInner}>
                  <div className={styles.menuMarker}>
                    <span className="point point--md" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className={styles.menuItemName}>
                      {name}
                      <span className={styles.menuItemArrow} aria-hidden="true">→</span>
                    </h3>
                    <p className={styles.menuItemDesc}>{desc}</p>
                    <span className={styles.menuItemMore}>
                      Find out more <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </ScrollReveal>

          <ScrollReveal>
            <p className={styles.supportNote}>
              <strong>Need professional photography or video?</strong> If a job really
              deserves a proper shoot, we can source and arrange it through our network —
              just mention it when you get in touch.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA Band ────────────────────────────────────── */}
      <section className="cta-band cta-band--dark" aria-label="Call to action">
        <div className="container">
          <div className="cta-band__inner">
            <p className="cta-band__statement">
              Not sure which? Fifteen minutes on the phone will tell you.
            </p>
            <Link href="/contact" className="btn btn-ghost-light">
              Book a call
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

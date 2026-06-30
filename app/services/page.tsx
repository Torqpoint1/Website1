import type { Metadata } from 'next';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ScrollReveal';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'No rigid packages. We build a quote around what you actually need — social posts, case studies, email newsletters, blog articles and more.',
};

const serviceList = [
  {
    name: 'Social posts',
    slug: 'social-posts',
    desc: 'One post or a month\'s worth — written, formatted and scheduled.',
  },
  {
    name: 'Case studies',
    slug: 'case-studies',
    desc: 'Your finished jobs written up to win trust and send to prospects.',
  },
  {
    name: 'Email & newsletters',
    slug: 'email-newsletters',
    desc: 'A single send, or a regular newsletter to past customers and leads.',
  },
  {
    name: 'Blog articles',
    slug: 'blog-articles',
    desc: 'Written properly, in your voice — and they help you show up on Google.',
  },
  {
    name: 'Google Business posts',
    slug: 'google-business-posts',
    desc: 'Keep your local listing active and working for you.',
  },
  {
    name: 'Profiles & setup',
    slug: 'profiles-setup',
    desc: 'Get your social profiles and listings set up and looking the part.',
  },
  {
    name: 'Website design & build',
    slug: 'website-design-build',
    desc: 'Need a proper online home to go with your content? We oversee high-quality website builds — designed in your brand, built to win enquiries.',
  },
  {
    name: 'Anything else',
    slug: 'anything-else',
    desc: 'No content or marketing challenge is off the table. If it grows your business or builds your reputation, we\'ll make it happen.',
  },
];

const wayFeatures = {
  oneOff: [
    'Pick any items from the list',
    'One-time, no commitment',
    'We quote the job, you approve',
    'Delivered ready to publish',
  ],
  monthly: [
    'Mix and match',
    'Scale up or down any month',
    'Consistent, hands-off, on-brand',
    'One simple monthly quote',
  ],
};

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
              Take exactly what you need —{' '}
              <span className={styles.ink}>nothing you don&rsquo;t.</span>
            </h1>
            <p className={styles.pageIntro}>
              Some clients want the works, every month. Others want a single newsletter
              or three posts before a busy spell. Both are completely fine. There are no
              rigid packages here — and if your challenge isn&rsquo;t on the list, just
              ask. There&rsquo;s no content or marketing task we can&rsquo;t facilitate.
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* ── Service Menu ────────────────────────────────── */}
      <section className={`section ${styles.menuSection}`} aria-labelledby="menu-heading">
        <div className="container">
          <ScrollReveal>
            <h2 id="menu-heading" className={styles.menuHeading}>What we can do for you</h2>
            <p className={styles.menuHint}>
              Click any service to see how it works, what you get and the proof behind it.
            </p>
          </ScrollReveal>
          <ScrollReveal className={styles.serviceMenu} stagger>
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
              <strong>Need professional photography or video?</strong> If getting the
              most from your content requires a proper shoot, we can source and arrange
              it through our network — just mention it when you get in touch.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Two Ways to Work ────────────────────────────── */}
      <section className={`section ${styles.waysSection}`} aria-labelledby="ways-heading">
        <div className="container">
          <ScrollReveal className="section-header" stagger>
            <p className="eyebrow">
              <span className="point point--sm" aria-hidden="true" />
              How we work
            </p>
            <h2 id="ways-heading">
              Two ways to work —{' '}
              <span className={styles.forge}>both built around you.</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal className={styles.waysGrid} stagger>
            {/* One-off */}
            <article className={`card ${styles.wayCard}`}>
              <p className={styles.wayLabel}>One-off</p>
              <p className={styles.waySubLabel}>A single job</p>
              <h3 className={styles.wayTitle}>
                Need just one thing? A newsletter, a handful of posts, one case study written up.
              </h3>
              <ul className={styles.wayFeatures} aria-label="One-off features">
                {wayFeatures.oneOff.map(f => (
                  <li key={f}>
                    <span className="point point--sm" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className={`btn btn-ghost ${styles.wayBtn}`}>
                Get a quote
              </Link>
            </article>

            {/* Monthly — featured */}
            <article className={`card ${styles.wayCard} ${styles.wayCardFeatured}`} aria-label="Monthly ongoing — recommended">
              <div className={styles.featuredBadge}>Most popular</div>
              <p className={styles.wayLabel} style={{ color: 'var(--dark-eyebrow)' }}>Monthly · ongoing</p>
              <p className={styles.waySubLabel} style={{ color: 'var(--dark-body)' }}>A rolling engine</p>
              <h3 className={styles.wayTitle} style={{ color: 'var(--dark-heading)' }}>
                Want it handled every month? We build a package from the list and run it for you.
              </h3>
              <ul className={styles.wayFeatures} style={{ color: 'var(--dark-body)' }} aria-label="Monthly features">
                {wayFeatures.monthly.map(f => (
                  <li key={f}>
                    <span className="point point--sm" style={{ background: 'var(--dark-eyebrow)' }} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className={`btn btn-primary ${styles.wayBtn}`}>
                Book a call
              </Link>
            </article>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA Band ────────────────────────────────────── */}
      <section className="cta-band cta-band--dark" aria-label="Call to action">
        <div className="container">
          <div className="cta-band__inner">
            <p className="cta-band__statement">
              Tell us what you need — we&rsquo;ll build a quote around it.
            </p>
            <Link href="/contact" className="btn btn-ghost-light">
              Start a project
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

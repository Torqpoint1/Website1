import type { Metadata } from 'next';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ScrollReveal';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About',
  description: 'Torqpoint is a content & marketing studio based in Gloucestershire. Plain-spoken, substance over hype.',
  alternates: { canonical: '/about/' },
};

const values = [
  {
    name: 'Grounded',
    desc: 'Plain words, real specifics, no buzzwords. We write like someone who actually gets your business.',
  },
  {
    name: 'Built around you',
    desc: 'You send the raw material and approve the output. No shoots to schedule, no time away from the work that pays.',
  },
  {
    name: 'Substance over hype',
    desc: "We don't chase vanity metrics. The point is enquiries and trust, not noise.",
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
              We&rsquo;re not a flashy agency. We&rsquo;re the people who make
              your work <span className={styles.underline}>actually get seen.</span>
            </h1>
          </ScrollReveal>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────── */}
      <section className={`section ${styles.bodySection}`} aria-labelledby="about-body">
        <div className="container">
          <div className={styles.twoCol}>
            <ScrollReveal className={styles.bodyText} stagger>
              <p>
                A lot of marketing looks slick and says nothing — all polish, no
                substance, over a message that never actually lands.
              </p>
              <p>
                Torqpoint works the other way round. We take the time to understand
                your business properly, then turn what you already do into clear,
                honest content your customers actually trust.
              </p>
              <p>
                We&rsquo;re based in Gloucestershire, we keep things plain-spoken, and
                we believe in substance over hype. Your work is the proof. Our job is
                simply to make sure the right people see it.
              </p>
              <p className={styles.founder}>— Luke, founder</p>
            </ScrollReveal>

            <ScrollReveal className={styles.valuesAside} stagger delay={0.1}>
              <h2 className={styles.valuesHeading}>How we work</h2>
              {values.map(({ name, desc }) => (
                <div key={name} className={styles.value}>
                  <div className={styles.valueMarker} aria-hidden="true">
                    <span className="point point--md" />
                  </div>
                  <div>
                    <h3 className={styles.valueName}>{name}</h3>
                    <p className={styles.valueDesc}>{desc}</p>
                  </div>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CTA Band ────────────────────────────────────── */}
      <section className="cta-band cta-band--forge" aria-label="Call to action">
        <div className="container">
          <div className="cta-band__inner">
            <p className="cta-band__statement">
              Want to see what we&rsquo;d do with your work?
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

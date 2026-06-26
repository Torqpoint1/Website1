import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroEntrance } from '@/components/HeroEntrance';
import { ScrollReveal } from '@/components/ScrollReveal';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Torqpoint — Content & Marketing Studio, Gloucestershire',
  description:
    'We turn your finished projects into posts, case studies and emails that win the next job. Content & marketing studio, Gloucestershire.',
};

const services = [
  {
    name: 'Social posts',
    desc: 'A month of scheduled posts built from your project photos — consistent, on-brand, and actually worth following.',
  },
  {
    name: 'Case studies',
    desc: 'Your best projects, written up properly. A page that wins trust and doubles as a sales tool you can send to prospects.',
  },
  {
    name: 'Email & newsletters',
    desc: 'Stay in front of past customers and quote-stage leads, so the work you\'ve already done keeps paying you back.',
  },
];

const steps = [
  {
    n: '01',
    title: 'Send us your work',
    desc: 'A batch of photos and a few lines on the work. No shoots to schedule, no time away from running your business.',
  },
  {
    n: '02',
    title: 'We research & write',
    desc: 'We learn your business and turn the raw material into posts, a case study and an email — in your voice, not generic filler.',
  },
  {
    n: '03',
    title: 'You review, we publish',
    desc: 'Two minutes to approve, then it goes out and gets scheduled. Repeat every month.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className={styles.hero} aria-label="Hero">
        <div className={`container ${styles.heroInner}`}>
          <HeroEntrance className={styles.heroContent}>
            <p className={`eyebrow ${styles.heroEyebrow}`} data-hero>
              <span className="point point--sm" aria-hidden="true" />
              Content &amp; marketing · Gloucestershire
            </p>
            <h1 className={styles.heroHeadline} data-hero>
              Your best work deserves better<br className={styles.br} /> than the{' '}
              <span className={styles.forge}>camera roll.</span>
            </h1>
            <p className={`${styles.heroLead} font-serif`} data-hero>
              We turn your finished projects into posts, case studies and emails
              that win the next job — so you look{' '}
              <em>as good online as the work actually is.</em>
            </p>
            <div className={styles.heroCtas} data-hero>
              <Link href="/contact" className="btn btn-primary">
                Start a project
              </Link>
              <Link href="/services" className="btn btn-ghost">
                See what we do
              </Link>
            </div>
          </HeroEntrance>
        </div>
      </section>

      {/* ── What We Do ────────────────────────────────────── */}
      <section className={`section ${styles.whatWeDo}`} aria-labelledby="what-heading">
        <div className="container">
          <ScrollReveal className="section-header" stagger>
            <p className="eyebrow">
              <span className="point point--sm" aria-hidden="true" />
              What we do
            </p>
            <h2 id="what-heading">
              You do the work. We make sure the{' '}
              <span className={styles.forge}>right people see it.</span>
            </h2>
            <p>
              You do great work and it vanishes into a phone gallery. We take that raw
              material — your photos and the story behind the work — research your
              business, and turn it into a steady stream of content that brings the
              next enquiry.
            </p>
          </ScrollReveal>

          <ScrollReveal className={styles.serviceGrid} stagger>
            {services.map(({ name, desc }) => (
              <article key={name} className={`card ${styles.serviceCard}`}>
                <div className={styles.cardMarker} aria-hidden="true">
                  <span className="point point--md" />
                </div>
                <h3 className={styles.cardTitle}>{name}</h3>
                <p className={styles.cardDesc}>{desc}</p>
              </article>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ── How It Works (dark band) ───────────────────────── */}
      <section className={styles.howItWorks} aria-labelledby="how-heading">
        <div className="container">
          <ScrollReveal stagger>
            <p className="eyebrow eyebrow--dark">
              <span className="point point--sm" aria-hidden="true" style={{ background: 'var(--dark-eyebrow)' }} />
              How it works
            </p>
            <h2 id="how-heading" className={styles.howHeading}>
              Built to fit around a <em className={styles.howHeadingItalic}>working business.</em>
            </h2>
          </ScrollReveal>

          <ScrollReveal className={styles.steps} stagger delay={0.1}>
            {steps.map(({ n, title, desc }) => (
              <div key={n} className={styles.step}>
                <span className={styles.stepNum} aria-hidden="true">{n}</span>
                <div>
                  <h3 className={`${styles.stepTitle} font-serif`}>{title}</h3>
                  <p className={styles.stepDesc}>{desc}</p>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA Band ──────────────────────────────────────── */}
      <section className={`cta-band cta-band--forge`} aria-label="Call to action">
        <div className="container">
          <div className="cta-band__inner">
            <p className="cta-band__statement">
              Let&rsquo;s make your work look as good as it is.
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

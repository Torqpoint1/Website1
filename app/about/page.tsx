import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ScrollReveal';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';
import { Picture } from '@/components/Picture';

export const metadata: Metadata = pageMetadata({
  path: '/about/',
  title: 'About — Luke Deakin, founder',
  description:
    'Torqpoint is a content and marketing studio for Gloucestershire building trades, run by someone who works in the construction supply chain every day.',
  og: 'about',
});

const FOUNDER_PHOTO = '/about/luke-deakin.jpg';
const hasFounderPhoto = fs.existsSync(path.join(process.cwd(), 'public', FOUNDER_PHOTO));

const credentials = [
  { big: 'Day job', small: 'inside the construction supply chain' },
  { big: 'Local', small: 'based in Gloucestershire, working across the Cotswolds' },
  { big: 'One focus', small: 'established home-improvement trades' },
];

const values = [
  {
    name: 'No jargon',
    desc: 'Plain words about your jobs, in your voice. If it could have been written about any firm, it doesn’t go out.',
  },
  {
    name: 'No retainer you can’t leave',
    desc: 'Job Stories are one-off. Engine is month to month with a month’s notice. Everything we make is yours.',
  },
  {
    name: 'No vanity metrics',
    desc: 'The point is enquiries and quotes won — not likes, reach or a monthly report nobody reads.',
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
              Built by someone who knows how{' '}
              <span className={styles.underline}>jobs get won.</span>
            </h1>
          </ScrollReveal>
        </div>
      </div>

      {/* ── Founder ─────────────────────────────────────── */}
      <section className={`section ${styles.bodySection}`} aria-labelledby="about-body">
        <div className="container">
          <div className={styles.founderGrid}>
            <ScrollReveal className={styles.portraitCol} direction="left">
              <figure className={styles.portrait}>
                {hasFounderPhoto ? (
                  <Picture
                    src={FOUNDER_PHOTO}
                    alt="Luke Deakin, founder of Torqpoint, on site"
                    width={800}
                    height={1000}
                    className={styles.portraitImg}
                  />
                ) : (
                  <div className={styles.portraitFallback} aria-hidden="true">
                    <span className={styles.monogram}>LD</span>
                  </div>
                )}
                <figcaption className={styles.portraitCaption}>
                  <strong>Luke Deakin</strong>
                  <span>Founder, Torqpoint · Gloucestershire</span>
                </figcaption>
              </figure>
            </ScrollReveal>

            <ScrollReveal className={styles.bodyText} stagger>
              <h2 id="about-body" className={styles.srOnly}>About the founder</h2>
              <p className={styles.leadPara}>
                I spend my working week inside the construction supply chain —
                coordinating manufacturers, merchants, installers and site teams, and
                watching where jobs get won and lost.
              </p>
              <p>
                What I kept noticing is that the firms doing the best work are often the
                worst at showing it. A £20,000 bathroom gets two phone photos and then
                disappears, while the firm down the road with half the craft and a decent
                Instagram takes the next enquiry.
              </p>
              <p>
                Torqpoint exists to fix that specific problem, for that specific kind of
                business. No jargon, no retainer you can&rsquo;t leave, no vanity metrics —
                just your finished work, written up and put where people can find it.
              </p>
              <p className={styles.founder}>— Luke Deakin, founder</p>
            </ScrollReveal>
          </div>

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
              Want to see what one of your finished jobs could become?
            </p>
            <div className={styles.ctaPair}>
              <Link href="/contact" className="btn btn-ghost-light">
                Book a call
              </Link>
              <Link href="/pricing" className={`btn ${styles.ctaSolid}`}>
                See what it costs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

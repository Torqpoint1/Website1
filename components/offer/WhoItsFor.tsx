import Link from 'next/link';
import { ScrollReveal } from '@/components/ScrollReveal';
import styles from './WhoItsFor.module.css';

const TRADES = ['Bathrooms', 'Kitchens', 'Landscaping', 'Joinery', 'Roofing', 'Extensions'];

const SIGNALS = [
  { big: 'A team', small: 'not a one-man band' },
  { big: '2+ vans', small: 'on the road most days' },
  { big: '£5k+', small: 'typical job value' },
];

/** The fit statement: who Torqpoint is built for, phrased as fit rather than exclusion. */
export function WhoItsFor({ index }: { index?: string }) {
  return (
    <section className={styles.section} aria-labelledby="fit-heading">
      <div className="container">
        <div className={styles.panel}>
          <ScrollReveal className={styles.copy} stagger direction="left">
            <p className="index-label">
              {index && <span className="index-label__num">{index}</span>}
              <span className="point point--sm" aria-hidden="true" />
              Who this is for
            </p>
            <h2 id="fit-heading" className={styles.heading}>
              Built for <em>established</em> trades.
            </h2>
            <p className={styles.lead}>
              Firms with a team, a couple of vans, and jobs worth £5,000 and up —
              bathroom and kitchen fitters, landscapers, joiners, roofers and
              extension builders across Gloucestershire and the Cotswolds.
            </p>
            <ul className={styles.trades} aria-label="Trades we work with">
              {TRADES.map(t => (
                <li key={t} className={styles.trade}>{t}</li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal className={styles.signals} stagger staggerStep={0.1} delay={0.15}>
            {SIGNALS.map(s => (
              <div key={s.big} className={styles.signal}>
                <span className={styles.signalBig}>{s.big}</span>
                <span className={styles.signalSmall}>{s.small}</span>
              </div>
            ))}
            <p className={styles.notYet}>
              Sole trader just starting out? We&rsquo;re probably not the right fit yet — but the{' '}
              <Link href="/journal/" className={styles.notYetLink}>journal</Link> is free, and
              there&rsquo;s no catch.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

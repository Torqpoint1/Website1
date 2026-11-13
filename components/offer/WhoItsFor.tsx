import Link from 'next/link';
import { ScrollReveal } from '@/components/ScrollReveal';
import { LightString } from '@/components/festive/FestiveDecor';
import styles from './WhoItsFor.module.css';

const SECTORS = ['Trades & building', 'Interiors & design', 'Hospitality & events', 'Retail & salons', 'Professional services', 'Landscaping'];

const SIGNALS = [
  { big: 'Established', small: 'past the just-starting-out stage' },
  { big: 'Proud of it', small: 'work that’s worth showing off' },
  { big: 'Word of mouth', small: 'reputation brings the next job' },
];

/** The fit statement: who Torqpoint is built for, phrased as fit rather than exclusion. */
export function WhoItsFor({ index }: { index?: string }) {
  return (
    <section className={styles.section} aria-labelledby="fit-heading">
      <div className="container">
        <div className={styles.panelWrap}>
        <LightString className={styles.panelLights} units={13} wire="rgba(40,30,22,0.3)" tones={['forge', 'red', 'gold', 'green']} />
        <div className={styles.panel}>
          <ScrollReveal className={styles.copy} stagger direction="left">
            <p className="index-label">
              {index && <span className="index-label__num">{index}</span>}
              <span className="point point--sm" aria-hidden="true" />
              Who this is for
            </p>
            <h2 id="fit-heading" className={styles.heading}>
              Built for businesses that do <em>good work.</em>
            </h2>
            <p className={styles.lead}>
              Gloucestershire businesses that take pride in what they do and want more
              people to see it — trades and builders, interiors and design studios,
              hospitality and events, shops, salons and professional services, right
              across the county and the Cotswolds.
            </p>
            <ul className={styles.trades} aria-label="Who we work with">
              {SECTORS.map(t => (
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
              Just getting started? The{' '}
              <Link href="/journal/" className={styles.notYetLink}>journal</Link> is free, and
              genuinely useful while you build up.
            </p>
          </ScrollReveal>
        </div>
        </div>
      </div>
    </section>
  );
}

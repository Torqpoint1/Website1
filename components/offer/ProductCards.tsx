import Link from 'next/link';
import { PRODUCT_ORDER, SERVICES } from '@/lib/services';
import { ScrollReveal } from '@/components/ScrollReveal';
import styles from './ProductCards.module.css';

/** Short "what's included" lines for the product cards (full lists live on the product pages). */
const INCLUDES: Record<string, string[]> = {
  'job-story': [
    'Case study page for your website',
    'Before, during & after photo set',
    'Four social posts',
    'Google Business Profile post',
    'Review request for the homeowner',
  ],
  engine: [
    'Two Job Stories every month',
    'Google Business Profile managed',
    'Every review replied to',
    'Monthly report and 20-minute call',
    'Everything stays yours if you stop',
  ],
};

export function ProductCards({ headingLevel = 'h3' }: { headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel;
  return (
    <ScrollReveal className={styles.grid} stagger staggerStep={0.12} direction="scale">
      {PRODUCT_ORDER.map(slug => {
        const p = SERVICES[slug];
        const featured = slug === 'engine';
        return (
          <article
            key={slug}
            className={`${styles.card} ${featured ? styles.featured : ''}`}
            aria-labelledby={`product-${slug}`}
          >
            {featured && <span className={styles.badge}>Best value</span>}
            <p className={styles.kind}>{featured ? 'Monthly' : 'One-off'}</p>
            <Heading id={`product-${slug}`} className={styles.name}>
              {p.name}
            </Heading>
            <p className={styles.tagline}>{p.tagline}</p>

            {p.price && (
              <div className={styles.priceBlock}>
                <p className={styles.price}>
                  <span className={styles.amount}>{p.price.amount}</span>
                  <span className={styles.unit}>{p.price.unit}</span>
                </p>
                <p className={styles.qualifier}>{p.price.qualifier}</p>
                {p.price.founderRate && (
                  <p className={styles.founder}>
                    <span className="point point--sm" aria-hidden="true" />
                    {p.price.founderRate}
                  </p>
                )}
              </div>
            )}

            <ul className={styles.includes}>
              {INCLUDES[slug].map(item => (
                <li key={item}>
                  <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.tick}>
                    <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <div className={styles.actions}>
              <Link
                href={`/contact/?interest=${slug}`}
                className={`btn ${featured ? 'btn-primary' : 'btn-ghost'} ${styles.cta}`}
                data-track="product_cta_click"
              >
                Book a call
              </Link>
              <Link href={`/services/${slug}/`} className={styles.more}>
                How {p.name} works <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        );
      })}
    </ScrollReveal>
  );
}

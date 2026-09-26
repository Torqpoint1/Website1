import { getTestimonials } from '@/lib/testimonials';
import { ScrollReveal } from './ScrollReveal';
import styles from './Testimonials.module.css';

/** Real client quotes from content/testimonials/. Renders nothing until one exists. */
export function Testimonials({ heading = 'What clients say' }: { heading?: string }) {
  const items = getTestimonials();
  if (items.length === 0) return null;

  return (
    <section className={`section ${styles.section}`} aria-labelledby="testimonials-heading">
      <div className="container">
        <ScrollReveal className="section-header" stagger direction="left">
          <p className="eyebrow">
            <span className="point point--sm" aria-hidden="true" />
            In their words
          </p>
          <h2 id="testimonials-heading">{heading}</h2>
        </ScrollReveal>
        <ScrollReveal className={styles.grid} stagger>
          {items.map(t => (
            <figure key={t.slug} className={styles.card}>
              <span className={styles.mark} aria-hidden="true">&ldquo;</span>
              <blockquote className={styles.quote}>{t.quote}</blockquote>
              <figcaption className={styles.who}>
                {t.photo && (
                  <img src={t.photo} alt="" width={48} height={48} className={styles.photo} loading="lazy" />
                )}
                <span>
                  <strong>{t.name}</strong>
                  <span className={styles.biz}>
                    {[t.business, t.town].filter(Boolean).join(', ')}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}

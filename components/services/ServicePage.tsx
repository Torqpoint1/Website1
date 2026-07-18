import Link from 'next/link';
import { getPost } from '@/lib/content';
import {
  getAdjacent,
  getService,
  type ProofCard,
  type ServiceData,
  BASE_URL,
} from '@/lib/services';
import { ScrollReveal } from '@/components/ScrollReveal';
import { WorkPlaceholder } from '@/components/WorkPlaceholder';
import { FaqAccordion } from './Faq';
import { withEmphasis } from './emphasis';
import styles from './service.module.css';

/* ── Section primitives ─────────────────────────────────── */

function ProseSection({
  id,
  title,
  paragraphs,
}: {
  id?: string;
  title: string;
  paragraphs: string[];
}) {
  return (
    <section className={`section ${styles.section}`} id={id}>
      <div className="container">
        <ScrollReveal>
          <div className={styles.block}>
            <h2 className={styles.sectionHeading}>{title}</h2>
            <div className={styles.proseCol}>
              {paragraphs.map((p, i) => (
                <p key={i} className={styles.prose}>
                  {withEmphasis(p)}
                </p>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function WhatYouGet({ items }: { items: string[] }) {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <ScrollReveal>
          <h2 className={styles.sectionHeading}>What you get</h2>
        </ScrollReveal>
        <ScrollReveal className={styles.checklist} stagger>
          {items.map(item => (
            <div key={item} className={styles.checkItem}>
              <span className="point point--sm" aria-hidden="true" />
              <span>{withEmphasis(item)}</span>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}

function HowItWorks({ steps }: { steps: ServiceData['howItWorks'] }) {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <ScrollReveal>
          <h2 className={styles.sectionHeading}>How it works</h2>
        </ScrollReveal>
        <ScrollReveal className={styles.steps} stagger>
          {steps.map((step, i) => (
            <div key={step.title} className={styles.step}>
              <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <span className={styles.stepTitle}>{step.title}</span>
                <p className={styles.stepDesc}>{withEmphasis(step.desc)}</p>
              </div>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}

function ProofGrid({ proof, single }: { proof: ProofCard[]; single?: boolean }) {
  const cards = (single ? proof.slice(0, 1) : proof).map(card => {
    const post = getPost('work', card.workSlug);
    return { ...card, coverImage: post?.coverImage, fallback: post?.client ?? card.client };
  });

  return (
    <section className={`section ${styles.section}`} id="proof">
      <div className="container">
        <ScrollReveal>
          <div className={styles.proofHead}>
            <p className="eyebrow">
              <span className="point point--sm" aria-hidden="true" />
              See it in the work
            </p>
            <p className={styles.proofNote}>
              Every example below is a concept project — sample work, not a real client.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal className={single ? styles.proofGridSingle : styles.proofGrid} stagger>
          {cards.map(card => (
            <Link
              key={card.workSlug}
              href={`/work/${card.workSlug}`}
              className={`card ${styles.proofCard}`}
            >
              <div className={styles.proofCover}>
                <span className={styles.proofBadge}>Concept</span>
                {card.coverImage ? (
                  <img
                    src={card.coverImage}
                    alt={`${card.fallback} — sample work`}
                    className={styles.proofCoverImg}
                    loading="lazy"
                  />
                ) : (
                  <WorkPlaceholder label={card.fallback} />
                )}
              </div>
              <div className={styles.proofBody}>
                <h3 className={styles.proofTitle}>{card.client}</h3>
                <p className={styles.proofBlurb}>{withEmphasis(card.blurb)}</p>
                <span className={styles.proofLink}>See the sample →</span>
              </div>
            </Link>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}

function PairsWith({ slugs }: { slugs: string[] }) {
  const services = slugs.map(getService).filter(Boolean) as ServiceData[];
  if (services.length === 0) return null;
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <ScrollReveal>
          <h2 className={styles.sectionHeading}>Pairs well with</h2>
          <div className={styles.pairsRow}>
            {services.map(s => (
              <Link key={s.slug} href={`/services/${s.slug}`} className={styles.pairChip}>
                <span className="point point--sm" aria-hidden="true" />
                {s.name}
                <span className={styles.pairArrow} aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function PrevNext({ slug }: { slug: string }) {
  const { prev, next } = getAdjacent(slug);
  return (
    <nav className={styles.prevNext} aria-label="More services">
      <div className="container">
        <div className={styles.prevNextRow}>
          <Link href={`/services/${prev.slug}`} className={styles.pnLink}>
            <span className={styles.pnLabel}>
              <span aria-hidden="true">←</span> Previous service
            </span>
            <span className={styles.pnName}>{prev.name}</span>
          </Link>
          <Link href={`/services/${next.slug}`} className={`${styles.pnLink} ${styles.pnNext}`}>
            <span className={styles.pnLabel}>
              Next service <span aria-hidden="true">→</span>
            </span>
            <span className={styles.pnName}>{next.name}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ── Structured data ────────────────────────────────────── */

function JsonLd({ service }: { service: ServiceData }) {
  const url = `${BASE_URL}/services/${service.slug}/`;
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${BASE_URL}/services/` },
      { '@type': 'ListItem', position: 3, name: service.name, item: url },
    ],
  };

  const faqLd =
    service.faqs && service.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: service.faqs.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.a.replace(/\*/g, ''),
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
    </>
  );
}

/* ── Page composition ───────────────────────────────────── */

export function ServicePage({ slug }: { slug: string }) {
  const service = getService(slug);
  if (!service) return null;
  const { tier } = service;

  return (
    <>
      <JsonLd service={service} />

      {/* Breadcrumb + hero */}
      <div className={styles.hero}>
        <div className="container">
          <Link href="/services" className={styles.back}>
            <span aria-hidden="true">←</span> Back to services
          </Link>
          <ScrollReveal stagger>
            <p className={`eyebrow ${styles.heroEyebrow}`}>
              <span className="point point--sm" aria-hidden="true" />
              {service.eyebrow}
            </p>
            <h1 className={styles.h1}>{withEmphasis(service.h1)}</h1>
            <p className={styles.standfirst}>{withEmphasis(service.standfirst)}</p>
            <div className={styles.heroCtas}>
              <Link href={service.primaryCta.href} className="btn btn-primary">
                {service.primaryCta.label}
              </Link>
              {service.secondaryCta && (
                <a href={service.secondaryCta.href} className="btn btn-ghost">
                  {service.secondaryCta.label}
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* The short version */}
      <ProseSection title="The short version" paragraphs={[service.shortVersion]} />

      {/* Tier 1: separate Why / Who. Tier 2: merged. */}
      {tier === 1 && service.whyItMatters && (
        <ProseSection title="Why it matters" paragraphs={service.whyItMatters} />
      )}
      {tier === 1 && service.whoItsFor && (
        <ProseSection title="Who it’s for" paragraphs={[service.whoItsFor]} />
      )}
      {tier === 2 && (service.whyItMatters || service.whoItsFor) && (
        <ProseSection
          title="Why it matters — and who it’s for"
          paragraphs={[...(service.whyItMatters ?? []), ...(service.whoItsFor ? [service.whoItsFor] : [])]}
        />
      )}

      {/* Tier 3: things we get asked for */}
      {tier === 3 && service.thingsWeGetAskedFor && (
        <section className={`section ${styles.section}`}>
          <div className="container">
            <ScrollReveal>
              <h2 className={styles.sectionHeading}>Things we get asked for</h2>
            </ScrollReveal>
            <ScrollReveal className={styles.capabilityGrid} stagger>
              {service.thingsWeGetAskedFor.map(item => (
                <div key={item.title} className={styles.capabilityItem}>
                  <span className="point point--sm" aria-hidden="true" />
                  <p>
                    <strong>{item.title}</strong> — {item.desc}
                  </p>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* What you get (Tier 1 + 2) */}
      {service.whatYouGet && tier !== 3 && <WhatYouGet items={service.whatYouGet} />}

      {/* How it works */}
      <HowItWorks steps={service.howItWorks} />

      {/* Proof — Tier 1 full row, Tier 2 single card, Tier 3 none */}
      {service.proof && service.proof.length > 0 && tier !== 3 && (
        <ProofGrid proof={service.proof} single={tier === 2} />
      )}

      {/* FAQs — Tier 1 only */}
      {tier === 1 && service.faqs && service.faqs.length > 0 && (
        <section className={`section ${styles.section}`}>
          <div className="container">
            <ScrollReveal>
              <h2 className={styles.sectionHeading}>FAQs</h2>
            </ScrollReveal>
            <FaqAccordion items={service.faqs} />
          </div>
        </section>
      )}

      {/* Tier 3: closing line + photography callout */}
      {tier === 3 && (
        <section className={`section ${styles.section}`}>
          <div className="container">
            <ScrollReveal>
              <p className={styles.closingLine}>{withEmphasis(service.closingLine ?? '')}</p>
              {service.photoNote && (
                <p className={styles.photoNote}>
                  <strong>Need professional photography or video?</strong>{' '}
                  {withEmphasis(service.photoNote)}
                </p>
              )}
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Pairs well with */}
      <PairsWith slugs={service.pairsWith} />

      {/* Closing CTA band */}
      <section className="cta-band cta-band--forge" aria-label="Call to action">
        <div className="container">
          <div className="cta-band__inner">
            <p className="cta-band__statement">
              Let’s make your work look as good as it is.
            </p>
            <Link href="/contact" className="btn btn-ghost-light">
              Book a call
            </Link>
          </div>
        </div>
      </section>

      {/* Prev / next */}
      <PrevNext slug={slug} />
    </>
  );
}

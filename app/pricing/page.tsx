import type { Metadata } from 'next';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ScrollReveal';
import { FaqAccordion } from '@/components/services/Faq';
import { ProductCards } from '@/components/offer/ProductCards';
import { CompareTable } from '@/components/offer/CompareTable';
import { WhoItsFor } from '@/components/offer/WhoItsFor';
import { DirectContact } from '@/components/offer/DirectContact';
import { Testimonials } from '@/components/Testimonials';
import { pageMetadata, BASE_URL } from '@/lib/seo';
import { ORGANIZATION_ID } from '@/lib/schema';
import styles from './page.module.css';

export const metadata: Metadata = pageMetadata({
  path: '/pricing/',
  title: 'Pricing — trades marketing from £350',
  description:
    'Straightforward pricing for trades marketing in Gloucestershire. One job written up from £350, or ongoing content from £450 a month. No contract, no per-lead fees.',
  og: 'pricing',
});

const faqs = [
  {
    q: 'How long is the contract?',
    a: 'There isn’t one. A Job Story is a one-off, fixed price. Engine rolls month to month and you can stop with one month’s notice.',
  },
  {
    q: 'What happens if I stop?',
    a: 'You keep everything we’ve made — every case study, photo set, post and page. Compare that with a directory listing, where you stop paying and you’re left with nothing.',
  },
  {
    q: 'Do you need my photos?',
    a: 'Yes — phone photos from the job are what we work with, and that’s all it takes. We send you a simple shot list for before, during and after so you know what to grab. If a job really deserves a proper shoot, we can arrange one.',
  },
  {
    q: 'How long until I see anything?',
    a: 'Your first Job Story comes back within five working days, ready to send to the next homeowner who asks for examples. On Engine, your Google profile is active within a fortnight; search visibility builds over three to six months and keeps compounding.',
  },
  {
    q: 'Can I start with one Job Story and move to Engine later?',
    a: 'Yes, and it’s a sensible way to start. See what a finished job looks like written up properly, then decide whether you want it every month.',
  },
  {
    q: 'What’s the founding rate?',
    a: 'Our first three clients get Job Stories at £150 and Engine at £450 a month (standard £650). In return we ask for permission to use the work as a case study, an honest testimonial, and two introductions to firms you rate.',
  },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Pricing', item: `${BASE_URL}/pricing/` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    about: { '@id': ORGANIZATION_ID },
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
];

export default function PricingPage() {
  return (
    <>
      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

      {/* ── Header + products (price above the fold) ───────── */}
      <section className={styles.top} aria-labelledby="pricing-heading">
        <div className={styles.glow} aria-hidden="true" />
        <div className="container">
          <ScrollReveal className={styles.header} stagger staggerStep={0.08}>
            <p className="eyebrow">
              <span className="point point--sm" aria-hidden="true" />
              Pricing
            </p>
            <h1 id="pricing-heading" className={styles.title}>
              Straight prices. <em>No per-lead fees.</em>
            </h1>
            <p className={styles.intro}>
              Two things to buy, both priced up front. One finished job written up
              properly, or the whole thing handled every month. No contract, and
              everything we make is yours to keep.
            </p>
          </ScrollReveal>

          <ProductCards headingLevel="h2" />

          <ScrollReveal>
            <p className={styles.smallPrint}>
              Need something that isn&rsquo;t here — a website, a one-off campaign?{' '}
              <Link href="/services/" className={styles.inlineLink}>See everything we do</Link>.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── The comparison ─────────────────────────────────── */}
      <section id="compare" className={`section ${styles.compare}`} aria-labelledby="compare-heading">
        <div className="container">
          <ScrollReveal className="section-header" stagger direction="left">
            <p className="index-label">
              <span className="index-label__num">01</span>
              <span className="point point--sm" aria-hidden="true" />
              Owned vs rented
            </p>
            <h2 id="compare-heading">
              You already spend this budget.{' '}
              <span className={styles.forge}>Spend it on something you keep.</span>
            </h2>
            <p>
              Directory sites list you alongside your competitors, and lead-based
              platforms sell the same enquiry to several firms at once. You pay whether
              you win the job or not — and the day you stop paying, it all disappears.
            </p>
          </ScrollReveal>

          <CompareTable />

          <ScrollReveal>
            <p className={styles.footnote}>
              Directory costs are typical annual membership and lead fees reported
              by UK trades on platforms such as Checkatrade, MyBuilder and Bark. How
              enquiries are shared, and what they cost, varies by platform, trade and
              area — check your own invoices for the real number.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Founding rate ──────────────────────────────────── */}
      <section className={styles.founding} aria-labelledby="founding-heading">
        <div className="container">
          <ScrollReveal className={styles.foundingPanel} stagger staggerStep={0.1}>
            <div>
              <p className="eyebrow eyebrow--dark">
                <span className="point point--sm" aria-hidden="true" />
                Founding clients · 3 places
              </p>
              <h2 id="founding-heading" className={styles.foundingTitle}>
                A lower rate for our first three clients — <em>honestly framed.</em>
              </h2>
            </div>
            <div className={styles.foundingBody}>
              <p>
                We&rsquo;re a new studio, so our first three clients get Job Stories at{' '}
                <strong>£150</strong> and Engine at <strong>£450 a month</strong>{' '}
                (standard £650).
              </p>
              <p>In return, we ask for three things:</p>
              <ol className={styles.asks}>
                <li><span>1</span>Permission to use your work as a case study</li>
                <li><span>2</span>An honest testimonial once you&rsquo;ve seen results</li>
                <li><span>3</span>Two introductions to firms you rate</li>
              </ol>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Who this is for ────────────────────────────────── */}
      <WhoItsFor index="02" />

      <Testimonials />

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className={`section ${styles.faq}`} aria-labelledby="pricing-faq-heading">
        <div className="container">
          <ScrollReveal className="section-header" stagger direction="left">
            <p className="index-label">
              <span className="index-label__num">03</span>
              <span className="point point--sm" aria-hidden="true" />
              Pricing questions
            </p>
            <h2 id="pricing-faq-heading">
              The small print, <span className={styles.forge}>in plain English.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal className={styles.faqWrap}>
            <FaqAccordion items={faqs} />
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className={`cta-band cta-band--dark ${styles.cta}`} aria-label="Call to action">
        <div className="container">
          <ScrollReveal className={styles.ctaInner} stagger direction="left">
            <p className="cta-band__statement">
              Fifteen minutes on the phone is usually enough to know if it&rsquo;s a fit.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/contact/" className="btn btn-primary" data-track="book_call_click">
                Book a call
              </Link>
              <DirectContact tone="dark" place="pricing-cta" />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

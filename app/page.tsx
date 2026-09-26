import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { Marquee } from '@/components/Marquee';
import { ServiceShowcase } from '@/components/ServiceShowcase';
import { WorkStack, type Study } from '@/components/WorkStack';
import { PageDecor } from '@/components/PageDecor';
import { ScrollReveal } from '@/components/ScrollReveal';
import { FaqAccordion } from '@/components/services/Faq';
import { ProductCards } from '@/components/offer/ProductCards';
import { WhoItsFor } from '@/components/offer/WhoItsFor';
import { Testimonials } from '@/components/Testimonials';
import { getAllPosts } from '@/lib/content';
import { CAPABILITY_ORDER, SERVICES } from '@/lib/services';
import { pageMetadata, SITE_DESCRIPTION } from '@/lib/seo';

/* Per-brand card background + photo tint for the Selected work stack. */
const BRAND_TINT: Record<string, { bg: string; tint: string }> = {
  'maeve-clarke-interiors-townhouse':       { bg: '#F1EEE4', tint: 'rgba(96,104,78,.18)' },
  'fieldhouse-landscapes-cotswold-garden':  { bg: '#EEF0E6', tint: 'rgba(58,92,52,.22)' },
  'marsh-vale-bathrooms-wet-room':          { bg: '#EAEEF0', tint: 'rgba(52,82,96,.20)' },
  'ashcroft-joinery-oak-staircase':         { bg: '#F2ECE2', tint: 'rgba(120,86,52,.20)' },
  'hollins-webb-kitchens-cottage-kitchen':  { bg: '#EDF0E8', tint: 'rgba(84,104,80,.20)' },
  'severn-slate-roofing-victorian-reroof':  { bg: '#ECEDEF', tint: 'rgba(60,66,78,.20)' },
  'cleeve-build-rear-extension':            { bg: '#F1EEE8', tint: 'rgba(96,92,84,.18)' },
};
import styles from './page.module.css';

export const metadata: Metadata = pageMetadata({
  path: '/',
  title: 'Torqpoint — Content & Marketing for Trades, Gloucestershire',
  absoluteTitle: true,
  description: SITE_DESCRIPTION,
});

const services = [
  {
    name: 'Stop renting leads',
    desc: 'Every job you finish becomes proof you own — a case study, a photo set, a page on your site. No per-lead fee, no sharing it with four competitors.',
  },
  {
    name: 'Get chosen, not compared',
    desc: 'When a homeowner is deciding between three quotes, the firm that can show the work in detail wins. We make that easy to show.',
  },
  {
    name: 'Show up in local search',
    desc: 'Your Google Business Profile is where most local jobs start. We keep it active, complete and working while you’re on site.',
  },
];

const steps = [
  {
    n: '01',
    title: 'Photograph the job as you go',
    desc: 'Before you start, at first fix, at handover. We send you a shot list — phone photos are fine, and it adds about two minutes to your day.',
  },
  {
    n: '02',
    title: 'Send a voice note from the van',
    desc: 'Two or three minutes on WhatsApp: what the customer wanted, what was tricky, what you’re proud of. That’s your whole part.',
  },
  {
    n: '03',
    title: 'We write it up, you approve',
    desc: 'Case study, photo set, posts, Google update and a review request — back within five working days, in your voice, ready to go live.',
  },
];

/* Homepage FAQ. Schema below is generated from this same copy so the
   page text and FAQPage JSON-LD never drift. */
const faqs = [
  {
    q: 'Who do you work with?',
    a: 'Established home-improvement trades across Gloucestershire and the Cotswolds — bathroom and kitchen fitters, landscapers, joiners, roofers and extension builders. Usually firms with a team, a couple of vans, and jobs worth £5,000 and up. If you’re a sole trader just starting out we’re probably not the right fit yet, but the journal is free and genuinely useful in the meantime.',
  },
  {
    q: 'What does it cost?',
    a: 'One job written up properly is £350. Ongoing content is £450 a month, which covers two jobs written up, your Google Business Profile managed, and review replies handled. No contract, one month’s notice. Full detail on the pricing page.',
  },
  {
    q: 'How is this different from Checkatrade?',
    a: 'Directory sites like Checkatrade put you in a list alongside your competitors, and lead-based platforms such as MyBuilder and Bark sell the same enquiry to several firms at once. You pay whether you win the job or not, and if you stop paying you’re left with nothing. We build things you keep — a case study, photographs, a page on your own site, a Google profile that ranks. Stop paying us and all of it is still yours.',
  },
  {
    q: 'Do I need to organise a photo shoot or take time off site?',
    a: 'No — that’s the whole point. You take a few photos on your phone as the job goes, send a voice note from the van, and we do the rest. No shoot to schedule, no day off site. If you can send a WhatsApp, you can work with us.',
  },
  {
    q: 'My photos are just phone snaps — is that good enough?',
    a: 'Usually, yes. A good job shot on a modern phone is plenty to work with, and a lot of the craft is making everyday photos look considered. We send a simple shot list so you know what to grab at each stage.',
  },
  {
    q: 'Will it actually sound like me, or like AI filler?',
    a: 'Like you. We work from your voice notes — how you describe the job, the words you use with customers — and write in that voice. Anything that could’ve been written about any firm isn’t good enough to send you.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function HomePage() {
  /* Trade studies lead; the adjacent interiors study sits last. */
  const TRADE_FIRST = [
    'marsh-vale-bathrooms-wet-room',
    'hollins-webb-kitchens-cottage-kitchen',
    'fieldhouse-landscapes-cotswold-garden',
    'severn-slate-roofing-victorian-reroof',
    'ashcroft-joinery-oak-staircase',
    'cleeve-build-rear-extension',
  ];
  const rank = (slug: string) => (TRADE_FIRST.includes(slug) ? TRADE_FIRST.indexOf(slug) : TRADE_FIRST.length);
  const studies: Study[] = getAllPosts('work')
    .filter(p => !p.archived)
    .sort((a, b) => rank(a.slug) - rank(b.slug))
    .map(p => {
    const town = p.location ? p.location.split(',')[0].trim() : '';
    return {
      slug: p.slug,
      brand: p.client ?? p.title,
      cat: [p.sector, town].filter(Boolean).join(' · '),
      headline: p.title,
      body: p.summary ?? '',
      image: p.coverImage,
      sampleHref: `/work/${p.slug}/`,
      bg: BRAND_TINT[p.slug]?.bg ?? '#F3EFE7',
      tint: BRAND_TINT[p.slug]?.tint ?? 'rgba(26,23,20,.12)',
      isConcept: p.concept,
    };
  });

  return (
    <div className={styles.page}>
      {/* Continuous faint-square texture behind every white section */}
      <PageDecor />

      {/* ── Hero ──────────────────────────────────────────── */}
      <Hero />

      {/* ── Pinned scroll-through: what your work becomes ──── */}
      <ServiceShowcase />

      {/* ── Deliverables marquee ──────────────────────────── */}
      <Marquee />

      {/* ── What We Do ────────────────────────────────────── */}
      <section className={`section ${styles.whatWeDo}`} aria-labelledby="what-heading">
        <div className="container">
          <ScrollReveal className="section-header" stagger direction="left">
            <p className="index-label">
              <span className="index-label__num">01</span>
              <span className="point point--sm" aria-hidden="true" />
              What we do
            </p>
            <h2 id="what-heading">
              You finish the job. We make sure it{' '}
              <span className={styles.forge}>keeps paying.</span>
            </h2>
            <p>
              A £20,000 bathroom gets two phone photos and then disappears. We take
              the photos from the job and a voice note from the van, and turn them into
              proof that sits on your website and your Google profile — winning the
              next quote long after the handover.
            </p>
          </ScrollReveal>

          <ScrollReveal className={styles.serviceGrid} stagger direction="scale">
            {services.map(({ name, desc }, i) => (
              <article key={name} className={`card ${styles.serviceCard}`}>
                <div className={styles.cardTop}>
                  <div className={styles.cardMarker} aria-hidden="true">
                    <span className="point point--md" />
                  </div>
                  <span className={styles.cardIndex} aria-hidden="true">
                    0{i + 1}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{name}</h3>
                <p className={styles.cardDesc}>{desc}</p>
              </article>
            ))}
          </ScrollReveal>

          {/* Clickable shortcut into the capability pages behind the products */}
          <div className={styles.serviceLinks}>
            <ScrollReveal className={styles.serviceLinksHead} stagger direction="left">
              <h3 className={styles.serviceLinksTitle}>What goes into it</h3>
              <Link href="/services" className={styles.serviceLinksAll}>
                See everything we do <span aria-hidden="true">→</span>
              </Link>
            </ScrollReveal>
            <ScrollReveal className={styles.serviceChips} stagger staggerStep={0.05}>
              {CAPABILITY_ORDER.filter(slug => slug !== 'anything-else').map(slug => (
                <Link key={slug} href={`/services/${slug}`} className={styles.serviceChip}>
                  <span className="point point--sm" aria-hidden="true" />
                  {SERVICES[slug].name}
                  <span className={styles.chipArrow} aria-hidden="true">→</span>
                </Link>
              ))}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Who this is for ───────────────────────────────── */}
      <WhoItsFor />

      {/* ── Pricing (02) ──────────────────────────────────── */}
      <section className={`section ${styles.pricing}`} aria-labelledby="pricing-heading">
        <div className="container">
          <ScrollReveal className={`section-header ${styles.pricingHeader}`} stagger direction="left">
            <p className="index-label">
              <span className="index-label__num">02</span>
              <span className="point point--sm" aria-hidden="true" />
              Pricing
            </p>
            <h2 id="pricing-heading">
              Two things to buy.{' '}
              <span className={styles.forge}>Prices on the page.</span>
            </h2>
            <p>
              No quotes to chase, no per-lead fees, no contract. Start with one job
              written up, or have it all handled every month.
            </p>
          </ScrollReveal>

          <ProductCards />

          <ScrollReveal>
            <Link href="/pricing/#compare" className={styles.compareLink} data-track="see_pricing_click" data-track-place="home-pricing">
              <span className={styles.compareLinkText}>
                <strong>Paying Checkatrade, MyBuilder or Bark?</strong> See how it compares
              </span>
              <span className={styles.compareArrow} aria-hidden="true">→</span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Selected work (overlapping card stack) ─────────── */}
      {studies.length > 0 && (
        <ScrollReveal>
          <WorkStack items={studies} />
        </ScrollReveal>
      )}

      {/* ── How It Works (dark band) ───────────────────────── */}
      <section className={styles.howItWorks} aria-labelledby="how-heading">
        <div className="container">
          <ScrollReveal stagger direction="left">
            <p className="index-label" style={{ color: 'var(--dark-eyebrow)' }}>
              <span className="index-label__num" style={{ color: 'var(--dark-body)' }}>03</span>
              <span className="point point--sm" aria-hidden="true" style={{ background: 'var(--dark-eyebrow)' }} />
              How it works
            </p>
            <h2 id="how-heading" className={styles.howHeading}>
              Ten minutes a job. <em className={styles.howHeadingItalic}>We do the rest.</em>
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

      <Testimonials />

      {/* ── FAQ (04) ──────────────────────────────────────── */}
      <section className={`section ${styles.faqSection}`} aria-labelledby="faq-heading">
        <div className="container">
          <ScrollReveal className="section-header" stagger direction="left">
            <p className="index-label">
              <span className="index-label__num">04</span>
              <span className="point point--sm" aria-hidden="true" />
              FAQ
            </p>
            <h2 id="faq-heading">
              Good questions, <span className={styles.forge}>straight answers.</span>
            </h2>
            <p className={styles.faqIntro}>
              The things people want to know before they get in touch.
            </p>
          </ScrollReveal>

          <ScrollReveal className={styles.faqWrap}>
            <FaqAccordion items={faqs} />
          </ScrollReveal>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </section>

      {/* ── CTA Band ──────────────────────────────────────── */}
      <section className={`cta-band cta-band--forge`} aria-label="Call to action">
        <div className="container">
          <ScrollReveal className="cta-band__inner" stagger direction="left">
            <p className="cta-band__statement">
              Your next job&rsquo;s best sales pitch is already on your phone.
            </p>
            <div className={styles.ctaPair}>
              <Link href="/contact" className="btn btn-ghost-light" data-track="book_call_click" data-track-place="home-cta">
                Book a call
              </Link>
              <Link href="/pricing" className={`btn ${styles.ctaSolid}`} data-track="see_pricing_click" data-track-place="home-cta">
                See what it costs
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

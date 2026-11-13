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
import { CapabilityGrid } from '@/components/offer/CapabilityGrid';
import { InstagramCta } from '@/components/InstagramCta';
import { LightString } from '@/components/festive/FestiveDecor';
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
  title: 'Torqpoint — Content & Marketing Studio, Gloucestershire',
  absoluteTitle: true,
  description: SITE_DESCRIPTION,
});

const services = [
  {
    name: 'Stop renting attention',
    desc: 'Every project you finish becomes proof you own — a case study, a photo set, a page on your site. No per-lead fee, no borrowed audience, no sharing it with your competitors.',
  },
  {
    name: 'Get chosen, not compared',
    desc: 'When a customer is weighing you up against two other options, the business that can show its work in detail wins. We make that easy to show.',
  },
  {
    name: 'Show up in local search',
    desc: 'Your Google Business Profile is where most local enquiries start. We keep it active, complete and working while you get on with the business.',
  },
];

const steps = [
  {
    n: '01',
    title: 'Send us the raw material',
    desc: 'A few photos and a voice note — from the job, the shop floor, the event, wherever you work. We send a simple prompt so you know what to grab. It adds a couple of minutes to your day.',
  },
  {
    n: '02',
    title: 'We research and write it up',
    desc: 'We learn your business and turn it into content in your voice — a case study, posts, an email, a Google update — never generic filler.',
  },
  {
    n: '03',
    title: 'You approve, it goes live',
    desc: 'Back within five working days, ready to check over. Approve it and it goes live on your site, your socials and your Google profile — yours to keep.',
  },
];

/* Homepage FAQ. Schema below is generated from this same copy so the
   page text and FAQPage JSON-LD never drift. */
const faqs = [
  {
    q: 'Who do you work with?',
    a: 'All sorts of Gloucestershire businesses that do work worth showing — trades and home-improvement firms, interior and design studios, hospitality and events, shops, salons and professional services. The common thread is simple: you do good work, and most of it never gets seen by the next customer. If your business runs on reputation and repeat work, this is built for you.',
  },
  {
    q: 'What does it cost?',
    a: 'We keep it simple: two ways to work with us — one finished project written up as a one-off, or everything handled every month, with no contract. We’ve taken prices off the site while we finalise them, so book a quick call and we’ll give you a straight figure for your business.',
  },
  {
    q: 'How is this different from a directory or lead platform?',
    a: 'Directory and lead-generation platforms — Checkatrade, MyBuilder, Bark and their equivalents in other industries — put you in a list alongside your competitors and often sell the same enquiry to several businesses at once. You pay whether you win the work or not, and if you stop paying you’re left with nothing. We build things you keep — a case study, photographs, a page on your own site, a Google profile that ranks. Stop paying us and all of it is still yours.',
  },
  {
    q: 'Do I need to organise a photo shoot or take time out to do this?',
    a: 'No — that’s the whole point. You grab a few photos on your phone as you work and send a short voice note, and we do the rest. No shoot to schedule, no day lost. If you can send a WhatsApp, you can work with us.',
  },
  {
    q: 'My photos are just phone snaps — is that good enough?',
    a: 'Usually, yes. A good photo taken on a modern phone is plenty to work with, and a lot of the craft is making everyday photos look considered. We send a simple prompt so you know what to grab.',
  },
  {
    q: 'Will it actually sound like me, or like AI filler?',
    a: 'Like you. We work from your voice notes — how you describe the work, the words you use with customers — and write in that voice. Anything that could’ve been written about any business isn’t good enough to send you.',
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
              You do the work. We make sure it{' '}
              <span className={styles.forge}>keeps paying.</span>
            </h2>
            <p>
              Your best work — the project you&rsquo;re proud of — gets a couple of phone
              photos and then disappears. We take those photos and a voice note, and turn
              them into proof that sits on your website and your Google profile — winning
              the next customer long after the work is finished.
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
            <CapabilityGrid />
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
              <span className={styles.forge}>Simple either way.</span>
            </h2>
            <p>
              No per-lead fees, no contract. Start with one project written up, or have
              it all handled every month — book a call and we’ll give you a price.
            </p>
          </ScrollReveal>

          <ProductCards />

          <ScrollReveal>
            <Link href="/pricing/#compare" className={styles.compareLink} data-track="see_pricing_click" data-track-place="home-pricing">
              <span className={styles.compareLinkText}>
                <strong>Paying a directory or lead platform?</strong> See how it compares
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

      {/* ── Instagram promo ────────────────────────────────── */}
      <InstagramCta />

      {/* ── How It Works (dark band) ───────────────────────── */}
      <section className={styles.howItWorks} aria-labelledby="how-heading">
        <LightString units={14} />
        <div className="container">
          <ScrollReveal stagger direction="left">
            <p className="index-label" style={{ color: 'var(--dark-eyebrow)' }}>
              <span className="index-label__num" style={{ color: 'var(--dark-body)' }}>03</span>
              <span className="point point--sm" aria-hidden="true" style={{ background: 'var(--dark-eyebrow)' }} />
              How it works
            </p>
            <h2 id="how-heading" className={styles.howHeading}>
              Ten minutes of your time. <em className={styles.howHeadingItalic}>We do the rest.</em>
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
        <LightString units={14} wire="rgba(255,255,255,0.42)" tones={['cream', 'gold', 'cream']} />
        <div className="container">
          <ScrollReveal className="cta-band__inner" stagger direction="left">
            <p className="cta-band__statement">
              Your best sales pitch is already on your phone.
            </p>
            <div className={styles.ctaPair}>
              <Link href="/contact" className="btn btn-ghost-light" data-track="book_call_click" data-track-place="home-cta">
                Contact us
              </Link>
              <Link href="/pricing" className={`btn ${styles.ctaSolid}`} data-track="see_pricing_click" data-track-place="home-cta">
                See the plans
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

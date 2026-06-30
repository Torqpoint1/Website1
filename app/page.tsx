import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { Marquee } from '@/components/Marquee';
import { ServiceShowcase } from '@/components/ServiceShowcase';
import { WorkStack, type Study } from '@/components/WorkStack';
import { PageDecor } from '@/components/PageDecor';
import { ScrollReveal } from '@/components/ScrollReveal';
import { FaqAccordion } from '@/components/services/Faq';
import { getAllPosts } from '@/lib/content';
import { SERVICE_ORDER, SERVICES } from '@/lib/services';

/* Per-brand card background + photo tint for the Selected work stack. */
const BRAND_TINT: Record<string, { bg: string; tint: string }> = {
  'foxglove-and-fern-wedding-florist':      { bg: '#F4ECEC', tint: 'rgba(150,70,90,.18)' },
  'maeve-clarke-interiors-townhouse':       { bg: '#F1EEE4', tint: 'rgba(96,104,78,.18)' },
  'the-old-cartshed-holiday-let':           { bg: '#F3EBDD', tint: 'rgba(150,80,28,.24)' },
  'fieldhouse-landscapes-cotswold-garden':  { bg: '#EEF0E6', tint: 'rgba(58,92,52,.22)' },
  'marsh-vale-bathrooms-wet-room':          { bg: '#EAEEF0', tint: 'rgba(52,82,96,.20)' },
  'ashcroft-joinery-oak-staircase':         { bg: '#F2ECE2', tint: 'rgba(120,86,52,.20)' },
};
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Torqpoint — Content & Marketing Studio, Gloucestershire',
  description:
    'Torqpoint is a content & marketing studio in Gloucestershire. We turn the work you do into posts, case studies, emails, blogs and websites that win the next job.',
};

const services = [
  {
    name: 'Win more work',
    desc: 'Case studies and social posts that turn your finished jobs into proof — so prospects pick you over the quote down the road.',
  },
  {
    name: 'Stay front of mind',
    desc: 'Regular email and social that keeps you in front of past customers and warm leads, so the next job comes back to you.',
  },
  {
    name: 'Get found online',
    desc: 'Blog articles, your Google Business profile and a proper website that help the right people find you when they\'re searching.',
  },
];

const steps = [
  {
    n: '01',
    title: 'Tell us what you need',
    desc: 'Send a batch of photos and a few lines, or just tell us the goal. No shoots to schedule, no time away from running your business.',
  },
  {
    n: '02',
    title: 'We research & create',
    desc: 'We learn your business and make it — posts, a case study, an email, even a whole website — in your voice, never generic filler.',
  },
  {
    n: '03',
    title: 'You review, we deliver',
    desc: 'A couple of minutes to approve, then it goes live. One-off or every month — whatever suits you.',
  },
];

/* Homepage FAQ — the cost question is intentionally held back until real
   pricing is set. Schema below is generated from this same copy so the
   page text and FAQPage JSON-LD never drift. */
const faqs = [
  {
    q: 'What kinds of businesses do you work with?',
    a: 'Trades, makers and project-based businesses where the work itself is the selling point — landscapers, joiners, builders, bathroom and kitchen fitters, interior designers, holiday lets, florists, studios and agencies. Whether you run steady day-to-day jobs or deliver bigger one-off projects, if you do work people would be impressed by in person but rarely see online, you’re exactly who we’re built for.',
  },
  {
    q: 'How is this different from hiring someone to run my social media?',
    a: 'A social media manager fills a feed. We build a system. Every job you finish becomes a case study, a set of posts, an email to past customers, maybe a piece that ranks on Google — one piece of work feeding every channel that brings the next enquiry. We’re not here to keep you posting for the sake of it. We’re here to turn the work you’ve already done into work that comes back.',
  },
  {
    q: 'Do I need to organise a photo shoot or take time out of my week?',
    a: 'No — that’s the whole point. You send a batch of photos from your phone and a few lines about the job, or just tell us the goal, and we do the rest. No shoot to schedule, no day off site, no learning curve. If you can send a text, you can work with us.',
  },
  {
    q: 'My photos are just phone snaps — is that good enough?',
    a: 'Usually, yes. A good job shot on a modern phone is plenty to work with, and a lot of the craft is making everyday photos look considered. When a project really deserves it, we can arrange a photographer or videographer too — but you never need professional shots to get started.',
  },
  {
    q: 'Will it actually sound like me, or like AI filler?',
    a: 'Like you. We research your business first — how you talk, what you care about, who you’re trying to reach — and write in that voice. AI is a tool we use to move fast, not a shortcut to generic filler. Anything that could’ve been written about any business isn’t good enough to send you.',
  },
  {
    q: 'Am I tied into a contract?',
    a: 'No lock-in. Work with us for a single case study, or have us produce content every month — whichever suits. Everything’s quoted up front, so you see the number before you commit to anything, and you can stop the moment it stops being worth it.',
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
  const studies: Study[] = getAllPosts('work').map(p => {
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

          {/* Clickable shortcut into every individual service page */}
          <div className={styles.serviceLinks}>
            <ScrollReveal className={styles.serviceLinksHead} stagger direction="left">
              <h3 className={styles.serviceLinksTitle}>What we can do for you</h3>
              <Link href="/services" className={styles.serviceLinksAll}>
                See all services <span aria-hidden="true">→</span>
              </Link>
            </ScrollReveal>
            <ScrollReveal className={styles.serviceChips} stagger staggerStep={0.05}>
              {SERVICE_ORDER.map(slug => (
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
              <span className="index-label__num" style={{ color: 'var(--dark-body)' }}>02</span>
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

      {/* ── FAQ (03) ──────────────────────────────────────── */}
      <section className={`section ${styles.faqSection}`} aria-labelledby="faq-heading">
        <div className="container">
          <ScrollReveal className="section-header" stagger direction="left">
            <p className="index-label">
              <span className="index-label__num">03</span>
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
              Let&rsquo;s make your work look as good as it is.
            </p>
            <Link href="/contact" className="btn btn-ghost-light">
              Book a call
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

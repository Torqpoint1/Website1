import type { Metadata } from 'next';
import Link from 'next/link';
import { getPost } from '@/lib/content';
import { ScrollReveal } from '@/components/ScrollReveal';
import { FaqAccordion } from '@/components/services/Faq';
import { WorkPlaceholder } from '@/components/WorkPlaceholder';
import styles from './page.module.css';

const PAGE_URL = 'https://torqpoint.com/marketing-agency-gloucestershire/';
const DESCRIPTION =
  'A content and social media studio in Gloucestershire for Cotswold trades, makers and independent businesses. Beautiful work deserves to be seen. Let’s talk.';

export const metadata: Metadata = {
  title: 'Marketing Agency in Gloucestershire — Content & Social',
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Marketing Agency in Gloucestershire — Content & Social | Torqpoint',
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'Torqpoint',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marketing Agency in Gloucestershire — Content & Social | Torqpoint',
    description: DESCRIPTION,
  },
};

/* ── Content data ───────────────────────────────────────── */

const contentServices = [
  {
    name: 'Social posts & reels',
    desc: 'the work, shot and written so it stops the scroll.',
    href: '/services/social-posts',
    anchor: 'Social posts',
  },
  {
    name: 'Blog & journal articles',
    desc: 'the words that answer what your customers are already Googling.',
    href: '/services/blog-articles',
    anchor: 'Blog articles',
  },
  {
    name: 'Email newsletters',
    desc: 'staying close to the people who’ve already bought.',
    href: '/services/email-newsletters',
    anchor: 'Email newsletters',
  },
  {
    name: 'Case studies',
    desc: 'your best jobs, told as proof.',
    href: '/services/case-studies',
    anchor: 'Case studies',
  },
];

const presenceServices = [
  {
    name: 'Google Business posts',
    desc: 'showing up when someone nearby searches.',
    href: '/services/google-business-posts',
    anchor: 'Google Business posts',
  },
  {
    name: 'Profile setup',
    desc: 'the accounts built right, once.',
    href: '/services/profiles-setup',
    anchor: 'Profile setup',
  },
  {
    name: 'Website design & build',
    desc: 'the home everything else points back to.',
    href: '/services/website-design-build',
    anchor: 'Website design & build',
  },
];

const sectors = [
  {
    name: 'Trades & construction',
    desc: 'joiners, builders, bathroom and kitchen fitters, landscapers.',
  },
  {
    name: 'Makers & craft',
    desc: 'furniture, interiors, florists, studios.',
  },
  {
    name: 'Home & property',
    desc: 'interior designers, holiday lets, garden design.',
  },
  {
    name: 'Independent local services',
    desc: 'the Gloucestershire and Cotswold businesses that live and die on reputation and word of mouth.',
  },
];

const workCards = [
  { slug: 'foxglove-and-fern-wedding-florist', label: 'Foxglove & Fern', role: 'wedding florist' },
  { slug: 'the-old-cartshed-holiday-let', label: 'The Old Cartshed', role: 'holiday let' },
  { slug: 'maeve-clarke-interiors-townhouse', label: 'Maeve Clarke Interiors', role: 'townhouse project' },
  { slug: 'marsh-vale-bathrooms-wet-room', label: 'Marsh Vale', role: 'bathrooms & wet room' },
  { slug: 'fieldhouse-landscapes-cotswold-garden', label: 'Fieldhouse Landscapes', role: 'Cotswold garden' },
  { slug: 'ashcroft-joinery-oak-staircase', label: 'Ashcroft Joinery', role: 'oak staircase' },
];

const differentiators = [
  {
    name: 'A studio, not a machine.',
    desc: 'You deal with the person doing the work, not an account manager relaying messages. One point of contact. One standard.',
  },
  {
    name: 'Editorial, not “content”.',
    desc: 'We care how the words read and how the images sit. Everything leaves here looking considered, because it is.',
  },
  {
    name: 'Local, and glad of it.',
    desc: 'We’re in Gloucestershire. We know the Cotswold market, the seasons, the customers you’re trying to reach.',
  },
  {
    name: 'Substance over noise.',
    desc: 'No vanity metrics, no jargon, no ten-point growth-hack threads. Work worth showing, shown well.',
  },
];

const steps = [
  {
    title: 'Talk.',
    desc: 'A proper conversation about the business, the work, and where the enquiries need to come from. No pitch theatre.',
  },
  {
    title: 'Plan.',
    desc: 'A simple, clear plan of what we’ll make and where it goes — sized to your budget, not ours.',
  },
  {
    title: 'Produce.',
    desc: 'We create the content and set up (or take over) the channels.',
  },
  {
    title: 'Publish & keep going.',
    desc: 'It ships on a rhythm you can rely on, and we adjust as we learn what your audience responds to.',
  },
];

/* Single source for the visible FAQ and the FAQPage schema, so the two can
   never drift out of sync (Google flags mismatches). */
const faqs = [
  {
    q: 'Do you only work with businesses in Gloucestershire?',
    a: 'We’re based in Gloucestershire and know the local market best, so it’s our natural home — but we work with independent businesses and trades across the wider Cotswolds and beyond. If the work’s good and you want it seen, distance isn’t the deciding factor.',
  },
  {
    q: 'I’m a tradesperson, not a “brand”. Is this really for me?',
    a: 'Especially for you. Our best work is for people who make or build something real and haven’t had the time to show it properly. You don’t need to be a big name — you need work worth photographing, which you already have.',
  },
  {
    q: 'Do you do the whole lot, or can I just get content made?',
    a: 'Both. Some clients hand over their social presence entirely; others just want great posts, articles or a newsletter produced and delivered ready to publish. We’ll fit around what you actually need.',
  },
  {
    q: 'What does it cost?',
    a: 'It depends on how much you want made and how often. We size it to your budget rather than forcing you into a package — the honest answer comes out of a short conversation about what you’re trying to achieve.',
  },
  {
    q: 'Will I have to be in front of the camera?',
    a: 'Only if you want to be. Plenty of our content is the work itself — the finished job, the process, the detail. If you’re happy on camera, great; if not, the work carries it.',
  },
  {
    q: 'How soon will I see results?',
    a: 'Consistent, good content compounds — the first few weeks build the foundation, and momentum comes over the following months. Anyone promising overnight floods of enquiries is selling something. We’re honest about the curve.',
  },
];

/* ── Structured data ────────────────────────────────────── */

const breadcrumbList = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://torqpoint.com/' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Marketing Agency in Gloucestershire',
      item: PAGE_URL,
    },
  ],
};

const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

/* ── Page ───────────────────────────────────────────────── */

export default function MarketingAgencyGloucestershirePage() {
  const covers = workCards.map(card => {
    const post = getPost('work', card.slug);
    return { ...card, coverImage: post?.coverImage, client: post?.client ?? card.label };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />

      {/* 1 ── Hero */}
      <div className={styles.hero}>
        <div className="container">
          <ScrollReveal stagger>
            <p className="eyebrow">
              <span className="point point--sm" aria-hidden="true" />
              Content &amp; marketing · Gloucestershire
            </p>
            <h1 className={styles.h1}>
              Marketing agency in Gloucestershire
              <span className={styles.heroPoint} aria-hidden="true" />
            </h1>
            <p className={styles.standfirst}>
              A content and social studio for Cotswold trades, makers and independent
              businesses — the ones doing beautiful work that too few people ever see.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/contact" className="btn btn-primary">
                Start a conversation
              </Link>
              <Link href="/work" className="btn btn-ghost">
                See the work
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* 2 ── Positioning strip */}
      <section className={styles.strip} aria-label="Who we work with">
        <div className="container">
          <p className={styles.stripText}>
            For florists, joiners, interior designers, landscapers, holiday lets and the
            independent businesses of Gloucestershire and the wider Cotswolds. We make
            the content and run the social presence. You get back to the work.
          </p>
        </div>
      </section>

      {/* 3 ── The problem */}
      <section className={`section ${styles.section}`}>
        <div className="container">
          <ScrollReveal>
            <div className={styles.split}>
              <h2 className={styles.h2}>Your work is the best-kept secret in the county.</h2>
              <div className={styles.prose}>
                <p>
                  You’ve built something worth looking at. The finished staircase, the
                  planted garden, the room that finally works, the day that went
                  perfectly. Then it goes up as one dark phone photo, or nowhere at all —
                  and the next enquiry never sees it.
                </p>
                <p>
                  Most local businesses aren’t short of quality. They’re short of time,
                  and they’re short of anyone whose actual job is to make the work look
                  as good online as it does in person.
                </p>
                <p>That’s the whole gap. It’s the one we fill.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4 ── What we do */}
      <section className={`section ${styles.section}`}>
        <div className="container">
          <ScrollReveal>
            <h2 className={styles.h2}>Content and social, done properly.</h2>
            <p className={styles.sectionIntro}>
              Two things, done well, instead of ten things done thinly. We produce the
              content and we run the presence — as an extension of your business, in a
              voice that sounds like you.
            </p>
          </ScrollReveal>
          <div className={styles.pillars}>
            <ScrollReveal>
              <h3 className={styles.pillarHeading}>Content</h3>
              <ul className={styles.serviceList}>
                {contentServices.map(s => (
                  <li key={s.href}>
                    <strong>{s.name}</strong> — {s.desc}{' '}
                    <Link href={s.href} className={styles.serviceLink}>
                      {s.anchor} <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal>
              <h3 className={styles.pillarHeading}>Presence &amp; foundations</h3>
              <ul className={styles.serviceList}>
                {presenceServices.map(s => (
                  <li key={s.href}>
                    <strong>{s.name}</strong> — {s.desc}{' '}
                    <Link href={s.href} className={styles.serviceLink}>
                      {s.anchor} <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
                <li>
                  Something else in mind?{' '}
                  <Link href="/services/anything-else" className={styles.serviceLink}>
                    Let’s talk about it <span aria-hidden="true">→</span>
                  </Link>
                </li>
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 5 ── Who it's for */}
      <section className={`section ${styles.section}`}>
        <div className="container">
          <ScrollReveal>
            <h2 className={styles.h2}>Built for Cotswold trades, makers and local businesses.</h2>
            <p className={styles.sectionIntro}>
              We work best with people who make or do something real, and want it seen by
              the right people nearby. If you recognise your business here, we’ll get on
              well:
            </p>
          </ScrollReveal>
          <ScrollReveal className={styles.sectorGrid} stagger>
            {sectors.map(s => (
              <div key={s.name} className={styles.sector}>
                <span className="point point--sm" aria-hidden="true" />
                <div>
                  <h3 className={styles.sectorName}>{s.name}</h3>
                  <p className={styles.sectorDesc}>{s.desc}</p>
                </div>
              </div>
            ))}
          </ScrollReveal>
          <ScrollReveal>
            <p className={styles.sectionOutro}>
              You don’t need a marketing department. You need someone who treats your
              content and social media like their own — which is where a studio, not an
              agency machine, earns its place.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 6 ── The work */}
      <section className={`section ${styles.section}`}>
        <div className="container">
          <ScrollReveal>
            <h2 className={styles.h2}>Some of the work.</h2>
            <p className={styles.sectionIntro}>
              Proof beats promises. A few of the businesses we’ve made content for across
              Gloucestershire and the Cotswolds:
            </p>
          </ScrollReveal>
          <ScrollReveal className={styles.workGrid} stagger>
            {covers.map(card => (
              <Link key={card.slug} href={`/work/${card.slug}`} className={`card ${styles.workCard}`}>
                <div className={styles.workCover}>
                  {card.coverImage ? (
                    <img
                      src={card.coverImage}
                      alt={`Content produced for ${card.client}, a Cotswold ${card.role}`}
                      className={styles.workCoverImg}
                      loading="lazy"
                    />
                  ) : (
                    <WorkPlaceholder label={card.label} />
                  )}
                </div>
                <div className={styles.workBody}>
                  <h3 className={styles.workName}>{card.label}</h3>
                  <p className={styles.workRole}>{card.role}</p>
                </div>
              </Link>
            ))}
          </ScrollReveal>
          <ScrollReveal>
            <p className={styles.allWork}>
              <Link href="/work" className={styles.serviceLink}>
                See all of the work <span aria-hidden="true">→</span>
              </Link>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 7 ── Why Torqpoint */}
      <section className={`section ${styles.section}`}>
        <div className="container">
          <ScrollReveal>
            <h2 className={styles.h2}>Why work with us.</h2>
          </ScrollReveal>
          <ScrollReveal className={styles.whyGrid} stagger>
            {differentiators.map(d => (
              <div key={d.name} className={styles.why}>
                <span className="point point--sm" aria-hidden="true" />
                <p>
                  <strong>{d.name}</strong> {d.desc}
                </p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* 8 ── How it works */}
      <section className={`section ${styles.section}`}>
        <div className="container">
          <ScrollReveal>
            <h2 className={styles.h2}>How it works.</h2>
          </ScrollReveal>
          <ScrollReveal className={styles.steps} stagger>
            {steps.map((step, i) => (
              <div key={step.title} className={styles.step}>
                <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <span className={styles.stepTitle}>{step.title}</span>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </ScrollReveal>
          <ScrollReveal>
            <div className={styles.midCta}>
              <Link href="/contact" className="btn btn-primary">
                Start a conversation
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 9 ── FAQ */}
      <section className={`section ${styles.section}`}>
        <div className="container">
          <ScrollReveal>
            <h2 className={styles.h2}>Questions we’re often asked.</h2>
          </ScrollReveal>
          <div className={styles.faqWrap}>
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>

      {/* 10 ── Local relevance */}
      <section className={`section ${styles.section}`}>
        <div className="container">
          <ScrollReveal>
            <div className={styles.split}>
              <h2 className={styles.h2}>Based in Gloucestershire, working across the Cotswolds.</h2>
              <div className={styles.prose}>
                <p>
                  We’re a Gloucestershire studio, close enough to the businesses we work
                  with to actually turn up, understand the local market, and shoot the
                  work in person when it matters. From Gloucester and Cheltenham out
                  through Cirencester, Stroud, Tewkesbury and the Cotswold villages, we
                  work with independent businesses who want to be found by the people
                  nearby — and to look, online, as good as they are in real life.
                </p>
                <p>
                  If you’d like the background on how being found locally actually works,
                  we’ve written a plain-English guide to{' '}
                  <Link href="/journal/local-seo-gloucestershire-guide" className={styles.inlineLink}>
                    local SEO for Gloucestershire businesses
                  </Link>
                  .
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 11 ── Final CTA */}
      <section className={`cta-band cta-band--forge ${styles.finalCta}`} aria-label="Call to action">
        <div className="container">
          <h2 className={styles.finalHeading}>Let’s make your work impossible to miss.</h2>
          <p className={styles.finalText}>
            If you’re a Gloucestershire or Cotswold business doing work you’re proud of,
            and you’re tired of it going unseen, that’s exactly the problem we’re here
            for.
          </p>
          <div className={styles.finalRow}>
            <Link href="/contact" className="btn btn-ghost-light">
              Start a conversation
            </Link>
            <p className={styles.finalContact}>
              Or email us directly:{' '}
              <a href="mailto:info@torqpoint.com">info@torqpoint.com</a>
              {' · '}
              <a href="https://instagram.com/torqpoint.co" target="_blank" rel="noopener noreferrer">
                @torqpoint.co
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

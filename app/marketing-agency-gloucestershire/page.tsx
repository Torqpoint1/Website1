import type { Metadata } from 'next';
import Link from 'next/link';
import { getPost } from '@/lib/content';
import { ScrollReveal } from '@/components/ScrollReveal';
import { FaqAccordion } from '@/components/services/Faq';
import { WorkPlaceholder } from '@/components/WorkPlaceholder';
import { ProductCards } from '@/components/offer/ProductCards';
import { DirectContact } from '@/components/offer/DirectContact';
import { pageMetadata } from '@/lib/seo';
import { hasPhone } from '@/lib/contact';
import styles from './page.module.css';
import { Picture } from '@/components/Picture';

const PAGE_URL = 'https://torqpoint.com/marketing-agency-gloucestershire/';

export const metadata: Metadata = pageMetadata({
  path: '/marketing-agency-gloucestershire/',
  title: 'Marketing Agency in Gloucestershire for Trades',
  description:
    'A content and marketing studio for Gloucestershire building trades. Case studies, photos and a Google presence you own, instead of leads you rent. From £350.',
});

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
    name: 'Bathrooms & kitchens',
    desc: 'fitters whose best jobs disappear the day the homeowner moves back in.',
  },
  {
    name: 'Landscaping & gardens',
    desc: 'the before-and-afters that sell the next garden on their own.',
  },
  {
    name: 'Joinery & carpentry',
    desc: 'staircases, doors and fitted work where the detail is the argument.',
  },
  {
    name: 'Roofing & extensions',
    desc: 'big-ticket jobs where the homeowner wants proof before they commit.',
  },
];

const workCards = [
  { slug: 'marsh-vale-bathrooms-wet-room', label: 'Marsh & Vale Bathrooms', role: 'wet room, Cheltenham' },
  { slug: 'fieldhouse-landscapes-cotswold-garden', label: 'Fieldhouse Landscapes', role: 'garden, Cirencester' },
  { slug: 'ashcroft-joinery-oak-staircase', label: 'Ashcroft Joinery', role: 'oak staircase, Stroud' },
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
    desc: 'We’re in Gloucestershire. We know the towns you cover, the seasons your work follows, and the homeowners you’re trying to reach.',
  },
  {
    name: 'We know how the trade works.',
    desc: 'Run by someone who works in the construction supply chain every day — who understands how you quote, schedule and get paid.',
  },
];

const steps = [
  {
    title: 'Talk.',
    desc: 'Fifteen minutes on the phone about the jobs you want more of and the areas you cover. No pitch theatre.',
  },
  {
    title: 'Photograph the job.',
    desc: 'Before, during and after, on your phone. We send a shot list so you know what to grab.',
  },
  {
    title: 'Send a voice note.',
    desc: 'Two minutes from the van on WhatsApp. We write it up, in your voice, and send it back to approve.',
  },
  {
    title: 'It goes live — and stays yours.',
    desc: 'On your website, your Google profile and your socials. Stop any time and you keep all of it.',
  },
];

/* Single source for the visible FAQ and the FAQPage schema, so the two can
   never drift out of sync (Google flags mismatches). */
const faqs = [
  {
    q: 'Which areas do you cover?',
    a: 'Gloucestershire and the Cotswolds — Gloucester, Cheltenham, Cirencester, Stroud, Tewkesbury and the villages in between. Most of the work happens over WhatsApp, so if you cover the edges of the county, that’s fine too.',
  },
  {
    q: 'I’m a tradesperson, not a “brand”. Is this really for me?',
    a: 'Especially for you. It’s built for established trades — bathroom and kitchen fitters, landscapers, joiners, roofers, extension builders — with a team, a couple of vans, and jobs worth £5,000 and up. You don’t need to be a big name; you need finished jobs worth showing, which you already have.',
  },
  {
    q: 'How is this different from Checkatrade or MyBuilder?',
    a: 'Directories list you alongside your competitors, and lead-based platforms sell the same enquiry to several firms at once. You pay whether you win it or not, and when you stop paying it all disappears. We build things you keep — a case study, photos, a page on your own site, a Google profile that ranks.',
  },
  {
    q: 'What does it cost?',
    a: 'One job written up properly — a Job Story — is £350. Engine, which is two jobs a month plus your Google profile and review replies handled, is £450 a month with no contract. Full detail is on the pricing page.',
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
              Content &amp; marketing for trades · Gloucestershire
            </p>
            <h1 className={styles.h1}>
              Marketing agency in Gloucestershire, built for trades
              <span className={styles.heroPoint} aria-hidden="true" />
            </h1>
            <p className={styles.standfirst}>
              For bathroom and kitchen fitters, landscapers, joiners, roofers and
              extension builders who are tired of paying directories for leads that go
              to four other firms. We turn your finished jobs into proof you own.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/contact" className="btn btn-primary">
                Book a call
              </Link>
              <Link href="/pricing" className="btn btn-ghost">
                See what it costs
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* 2 ── Positioning strip */}
      <section className={styles.strip} aria-label="Who we work with">
        <div className="container">
          <p className={styles.stripText}>
            Bathrooms, kitchens, landscaping, joinery, roofing and extensions — across
            Gloucester, Cheltenham, Cirencester, Stroud, Tewkesbury and the Cotswolds.
            You send the photos. We do the rest. You get back on site.
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
                  planted garden, the wet room that finally works, the roof that’ll
                  outlast the house. Then it goes up as one dark phone photo, or nowhere
                  at all — and the next homeowner never sees it.
                </p>
                <p>
                  So the enquiries come from directories instead: pay per lead, shared with
                  four other firms, gone the day you stop paying. Most good trades aren’t
                  short of quality. They’re short of time, and short of anyone whose job
                  is to make the work win the next quote.
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
            <h2 className={styles.h2}>Two products, priced up front.</h2>
            <p className={styles.sectionIntro}>
              One finished job written up properly, or the whole thing handled every
              month. Both built from the photos already on your phone.
            </p>
          </ScrollReveal>
          <div className={styles.products}>
            <ProductCards />
          </div>
          <ScrollReveal>
            <h3 className={styles.goesInto}>What goes into them</h3>
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
            <h2 className={styles.h2}>Built for established Gloucestershire trades.</h2>
            <p className={styles.sectionIntro}>
              Firms with a team, a couple of vans, and jobs worth £5,000 and up. If you
              recognise your business here, we’ll get on well:
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
              Sole trader just starting out? We’re probably not the right fit yet — but the{' '}
              <Link href="/journal" className={styles.inlineLink}>journal</Link> is free, and
              there’s no catch.
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
              Proof beats promises. Concept projects showing exactly what we’d produce
              from one of your finished jobs:
            </p>
          </ScrollReveal>
          <ScrollReveal className={styles.workGrid} stagger>
            {covers.map(card => (
              <Link key={card.slug} href={`/work/${card.slug}`} className={`card ${styles.workCard}`}>
                <div className={styles.workCover}>
                  {card.coverImage ? (
                    <Picture
                      src={card.coverImage}
                      alt={`Concept content for ${card.client} — ${card.role}`}
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
                Book a call
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
                  We’re a Gloucestershire studio, close enough to the firms we work with
                  to actually turn up, understand the local market, and see the work in
                  person when it matters. From Gloucester and Cheltenham out through
                  Cirencester, Stroud, Tewkesbury and the Cotswold villages, we work with
                  trades who want to be found by the homeowners nearby — without paying
                  per lead for the privilege.
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
          <h2 className={styles.finalHeading}>Stop renting your leads. Start owning your proof.</h2>
          <p className={styles.finalText}>
            If you run a Gloucestershire trade business doing work you’re proud of, and
            you’re tired of paying for enquiries you share with four other firms, that’s
            exactly the problem we’re here for.
          </p>
          <div className={styles.finalRow}>
            <Link href="/contact" className="btn btn-ghost-light">
              Book a call
            </Link>
            {hasPhone && <DirectContact tone="forge" place="landing-cta" />}
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

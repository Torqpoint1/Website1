import type { Post } from '@/lib/content';
import { WorkPlaceholder } from '@/components/WorkPlaceholder';
import styles from './FoxgloveAssets.module.css';

/* Foxglove & Fern — concept brand assets.
   Identity, Instagram carousel, email and website hero, reproduced in
   the brand's own scoped palette (claret/sage) and type (Cormorant
   Garamond + Jost). Photo slots fill from /public/work/foxglove-and-fern. */

const SLUG = 'foxglove-and-fern';

function Photo({ name, label, has, className }: { name: string; label: string; has: boolean; className?: string }) {
  const src = `/work/${SLUG}/${name}.jpg`;
  if (has) return <img src={src} alt="" className={className} loading="lazy" />;
  return (
    <div className={`${styles.slot} ${className ?? ''}`}>
      <WorkPlaceholder label={label} />
    </div>
  );
}

export function FoxgloveAssets({ post }: { post: Post }) {
  // A photo slot fills when its file exists in /public (degrades to a
  // styled placeholder otherwise).
  const ok = (n: string) =>
    post.galleryImages?.some(g => g.endsWith(`${n}.jpg`)) ||
    post.coverImage?.endsWith(`${n}.jpg`) ||
    false;

  return (
    <section className={styles.fox} aria-label="Sample brand assets for Foxglove & Fern">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap"
      />

      <div className={styles.inner}>
        {/* ── 01 Identity ─────────────────────────────── */}
        <p className={styles.kicker}><span>01</span> Identity</p>
        <div className={styles.identity}>
          <Monogram />
          <p className={styles.wordmark}>Foxglove <span className={styles.amp}>&amp;</span> Fern</p>
          <p className={styles.tagline}>Seasonal flowers · Cotswolds</p>
          <ul className={styles.swatches} aria-hidden="true">
            <li><span style={{ background: '#26222A' }} />Ink</li>
            <li><span style={{ background: '#6E2C3E' }} />Claret</li>
            <li><span style={{ background: '#94A189' }} />Sage</li>
            <li><span style={{ background: '#46563F' }} />Stem</li>
            <li><span style={{ background: '#F2ECE2', border: '1px solid #E2DACB' }} />Chalk</li>
          </ul>
          <div className={styles.typePair}>
            <span className={styles.typeDisplay}>Aa</span>
            <span className={styles.typeLabel}>Cormorant Garamond — display</span>
          </div>
          <div className={styles.typePair}>
            <span className={styles.typeBody}>Aa</span>
            <span className={styles.typeLabel}>Jost — labels &amp; body</span>
          </div>
        </div>

        {/* ── 02 Instagram carousel ───────────────────── */}
        <p className={styles.kicker}><span>02</span> Instagram carousel</p>
        <div className={styles.carousel}>
          <article className={styles.slide}>
            <Photo name="cover" label="Ceremony arch" has={ok('cover')} className={styles.slidePhoto} />
            <div className={styles.slideCaption}>
              <p className={styles.slideLabel}>Real Cotswold wedding</p>
              <p className={styles.slideQuote}>&ldquo;Like the garden <em>wandered in.</em>&rdquo;</p>
              <span className={styles.slideNum}>1 / 3</span>
            </div>
          </article>
          <article className={styles.slide}>
            <Photo name="bouquet-detail" label="Bouquet detail" has={ok('bouquet-detail')} className={styles.slidePhoto} />
            <div className={styles.slideCaption}>
              <p className={styles.slideBody}>Locally grown, loosely gathered — nothing too neat.</p>
              <span className={styles.slideNum}>2 / 3</span>
            </div>
          </article>
          <article className={`${styles.slide} ${styles.slideText}`}>
            <div className={styles.slideTextInner}>
              <p className={styles.slideBody}>
                Planning a 2027 wedding? We take a limited number each season.
              </p>
              <p className={styles.slideCta}>Enquiries open → link in bio</p>
            </div>
            <p className={styles.slideMark}>Foxglove &amp; Fern</p>
            <span className={styles.slideNum}>3 / 3</span>
          </article>
        </div>

        {/* ── 03 Email & newsletter ───────────────────── */}
        <p className={styles.kicker}><span>03</span> Email &amp; newsletter</p>
        <div className={styles.email}>
          <p className={styles.emailSubject}>Subject — Three dates left for 2026 weddings</p>
          <div className={styles.emailBody}>
            <p className={styles.emailBrand}>Foxglove &amp; Fern</p>
            <Photo name="email-hero" label="Marquee tablescape" has={ok('email-hero')} className={styles.emailHero} />
            <h4 className={styles.emailHeadline}>The marquee wedding everyone&rsquo;s been asking about.</h4>
            <p className={styles.emailText}>
              Last month we dressed a marquee near Cirencester — a foxglove-and-cosmos arch,
              fifteen tablescapes, the lot. We&rsquo;ve written the whole day up, and it&rsquo;s the
              loveliest thing we&rsquo;ve done this season.
            </p>
            <p className={styles.emailText}>
              We hold only a handful of dates each year, and three remain for autumn 2026.
              If you&rsquo;re planning, now&rsquo;s the moment to talk.
            </p>
            <span className={styles.emailBtn}>See the wedding →</span>
            <p className={styles.emailFoot}>Foxglove &amp; Fern · Cirencester · Wedding &amp; event flowers · Unsubscribe anytime</p>
          </div>
        </div>

        {/* ── 04 Website hero ─────────────────────────── */}
        <p className={styles.kicker}><span>04</span> Website hero</p>
        <div className={styles.site}>
          <div className={styles.browser}>
            <span className={styles.url}>foxgloveandfern.co.uk</span>
          </div>
          <div className={styles.siteHero}>
            <Photo name="site-hero" label="Full-bleed wedding florals" has={ok('site-hero')} className={styles.siteHeroPhoto} />
            <div className={styles.siteOverlay}>
              <p className={styles.siteWordmark}>Foxglove <span className={styles.amp}>&amp;</span> Fern</p>
              <p className={styles.siteLabel}>Wedding &amp; event florist · Cirencester</p>
              <h3 className={styles.siteHeadline}>
                Flowers that look like the <em>garden wandered in.</em>
              </h3>
              <p className={styles.siteText}>
                Loose, seasonal, locally grown arrangements for Cotswold weddings.
                A small studio taking a limited number of dates each year.
              </p>
              <span className={styles.siteBtn}>Enquire for your date</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Monogram() {
  return (
    <svg className={styles.monogram} viewBox="0 0 48 56" fill="none" aria-hidden="true">
      <path d="M24 54V14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M24 20c-6 0-10-3-11-9 6 0 10 3 11 9Z" fill="currentColor" />
      <path d="M24 30c6 0 10-3 11-9-6 0-10 3-11 9Z" fill="currentColor" />
      <path d="M24 32c-5 0-8-2.5-9-7.5 5 0 8 2.5 9 7.5Z" fill="currentColor" />
      <circle cx="24" cy="10" r="4" fill="currentColor" />
    </svg>
  );
}

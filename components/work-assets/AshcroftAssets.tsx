import type { Post } from '@/lib/content';
import { WorkPlaceholder } from '@/components/WorkPlaceholder';
import { assetHas } from './AssetPhoto';
import styles from './AshcroftAssets.module.css';

/* Ashcroft Joinery — concept brand assets.
   Identity, Instagram carousel, website hero and case-study layout in the
   brand's own scoped palette (walnut/amber/steel) and type (Bitter slab +
   Archivo). Photo slots fill from /public/work/ashcroft-joinery. */

const SLUG = 'ashcroft-joinery';

function Photo({ name, label, has, className }: { name: string; label: string; has: boolean; className?: string }) {
  const src = `/work/${SLUG}/${name}.jpg`;
  if (has) return <img src={src} alt={label} className={className} loading="lazy" />;
  return (
    <div className={`${styles.slot} ${className ?? ''}`}>
      <WorkPlaceholder label={label} />
    </div>
  );
}

export function AshcroftAssets({ post }: { post: Post }) {
  const ok = (n: string) => assetHas(post, n);

  return (
    <section className={styles.ash} aria-label="Sample brand assets for Ashcroft Joinery">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Bitter:wght@400;500;700&family=Archivo:wght@400;500;600&display=swap"
      />

      <div className={styles.inner}>
        {/* ── 01 Identity ─────────────────────────────── */}
        <p className={styles.kicker}><span>01</span> Identity</p>
        <div className={styles.identity}>
          <Monogram />
          <p className={styles.wordmark}>Ashcroft<br />Joinery</p>
          <p className={styles.tagline}>Est · Craft · Stroud</p>
          <ul className={styles.swatches} aria-hidden="true">
            <li><span style={{ background: '#2A211A' }} />Walnut</li>
            <li><span style={{ background: '#BC6B2E' }} />Amber</li>
            <li><span style={{ background: '#6C727A' }} />Steel</li>
            <li><span style={{ background: '#93998C' }} />Sage</li>
            <li><span style={{ background: '#E8DFCD', border: '1px solid #D8CDB6' }} />Sawn</li>
          </ul>
          <div className={styles.typePair}>
            <span className={styles.typeDisplay}>Aa</span>
            <span className={styles.typeLabel}>Bitter — display (slab)</span>
          </div>
          <div className={styles.typePair}>
            <span className={styles.typeBody}>AA</span>
            <span className={styles.typeLabel}>Archivo — labels &amp; body</span>
          </div>
        </div>

        {/* ── 02 Instagram carousel ───────────────────── */}
        <p className={styles.kicker}><span>02</span> Instagram carousel</p>
        <div className={styles.carousel}>
          <article className={styles.slide}>
            <Photo name="staircase-full" label="Finished oak staircase" has={ok('staircase-full')} className={styles.slidePhoto} />
            <div className={styles.slideShade} aria-hidden="true" />
            <div className={styles.slideText}>
              <p className={styles.slideHead}>Six weeks of work. One staircase. <span className={styles.amber}>Zero screws.</span></p>
            </div>
            <span className={styles.slideNum}>1 / 3</span>
          </article>
          <article className={styles.slide}>
            <Photo name="joint-detail" label="Hand-cut joint detail" has={ok('joint-detail')} className={styles.slidePhoto} />
            <div className={styles.slideShade} aria-hidden="true" />
            <div className={styles.slideText}>
              <p className={styles.slideHead}>The detail most people never notice — and the reason it lasts a century.</p>
            </div>
            <span className={styles.slideNum}>2 / 3</span>
          </article>
          <article className={`${styles.slide} ${styles.slideSolid}`}>
            <div className={styles.slideText}>
              <p className={styles.slideLabel}>Ashcroft Joinery</p>
              <p className={styles.slideHead}>
                A staircase that&rsquo;s actually built to last? <span className={styles.amber}>That&rsquo;s all we do.</span>
              </p>
              <p className={styles.slideCta}>Enquiries → link in bio</p>
            </div>
            <span className={styles.slideNum}>3 / 3</span>
          </article>
        </div>

        {/* ── 03 Website hero ─────────────────────────── */}
        <p className={styles.kicker}><span>03</span> Website hero</p>
        <div className={styles.site}>
          <div className={styles.browser}>
            <span className={styles.url}>ashcroftjoinery.co.uk</span>
          </div>
          <div className={styles.siteHero}>
            <Photo name="site-hero" label="Staircase in the barn" has={ok('site-hero')} className={styles.siteHeroPhoto} />
            <div className={styles.siteShade} aria-hidden="true" />
            <div className={styles.siteTop}>
              <span className={styles.siteWordmark}>Ashcroft</span>
              <span className={styles.siteNav}>Staircases · Joinery · Work · Quote</span>
            </div>
            <div className={styles.siteOverlay}>
              <p className={styles.siteLabel}>Bespoke joinery &amp; staircases · Stroud</p>
              <h3 className={styles.siteHeadline}>
                Built by hand. Built to <span className={styles.amber}>outlive you.</span>
              </h3>
              <p className={styles.siteTextLine}>
                Solid timber staircases and bespoke joinery, designed and made in our Stroud
                workshop. No filler, no fudging, no metal where it shouldn&rsquo;t be.
              </p>
              <span className={styles.siteBtn}>Request a quote</span>
            </div>
          </div>
        </div>

        {/* ── 04 Case study layout ────────────────────── */}
        <p className={styles.kicker}><span>04</span> Case study layout</p>
        <div className={styles.case}>
          <div className={styles.caseTags}>
            <span>Staircase</span><span>Solid oak</span><span>Stroud</span>
          </div>
          <h4 className={styles.caseHeadline}>The barn staircase bought on a single joint.</h4>
          <p className={styles.caseText}>
            The owners of a converted threshing barn near Stroud had three quotes. Ours
            wasn&rsquo;t the cheapest — it was the one where you could see exactly where the
            money went.
          </p>
          <blockquote className={styles.caseQuote}>
            &ldquo;Oak on oak, tight enough that you&rsquo;d struggle to slide a receipt into the gap.&rdquo;
          </blockquote>
          <p className={styles.caseText}>
            Six weeks in the workshop, installed in a single day, finished by hand. The kind of
            work that wins the next three jobs — if it&rsquo;s written up properly.
          </p>
        </div>
      </div>
    </section>
  );
}

function Monogram() {
  return (
    <svg className={styles.monogram} viewBox="0 0 56 52" fill="none" aria-hidden="true">
      <path
        d="M6 46h11V35h11V24h11V13h11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 46h44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

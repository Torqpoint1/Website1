import type { Post } from '@/lib/content';
import { AssetPhoto } from './AssetPhoto';
import styles from './MaeveAssets.module.css';

const SLUG = 'maeve-clarke-interiors';

export function MaeveAssets({ post }: { post: Post }) {
  const Photo = (p: { name: string; label: string; className?: string }) => (
    <AssetPhoto post={post} slug={SLUG} {...p} />
  );

  return (
    <section className={styles.maeve} aria-label="Sample brand assets for Maeve Clarke Interiors">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500&display=swap"
      />
      <div className={styles.inner}>
        {/* 01 Identity */}
        <p className={styles.kicker}><span>01</span> Identity</p>
        <div className={styles.identity}>
          <Monogram />
          <p className={styles.wordmark}>Maeve Clarke<br />Interiors</p>
          <p className={styles.tagline}>Considered · Cheltenham</p>
          <ul className={styles.swatches} aria-hidden="true">
            <li><span style={{ background: '#232021' }} />Ink</li>
            <li><span style={{ background: '#AE894F' }} />Brass</li>
            <li><span style={{ background: '#6E747C' }} />Slate</li>
            <li><span style={{ background: '#C3B9A9' }} />Stone</li>
            <li><span style={{ background: '#F1ECE3', border: '1px solid #E4DDD0' }} />Plaster</li>
          </ul>
          <div className={styles.typePair}>
            <span className={styles.typeDisplay}>Aa</span>
            <span className={styles.typeLabel}>Marcellus — display</span>
          </div>
          <div className={styles.typePair}>
            <span className={styles.typeBody}>Aa</span>
            <span className={styles.typeLabel}>Jost — labels &amp; body</span>
          </div>
        </div>

        {/* 02 Instagram carousel */}
        <p className={styles.kicker}><span>02</span> Instagram carousel</p>
        <div className={styles.carousel}>
          <article className={styles.slide}>
            <Photo name="living-room" label="Living room — wide" className={styles.slidePhoto} />
            <div className={styles.slideCaption}>
              <p className={styles.slideLabel}>A Cheltenham townhouse</p>
              <p className={styles.slideQuote}>The brief was one word: <em>calm.</em></p>
              <span className={styles.slideNum}>1 / 3</span>
            </div>
          </article>
          <article className={styles.slide}>
            <Photo name="styling-detail" label="Styling detail" className={styles.slidePhoto} />
            <div className={styles.slideCaption}>
              <p className={styles.slideBody}>Three tones, and a long eye for what to leave out.</p>
              <span className={styles.slideNum}>2 / 3</span>
            </div>
          </article>
          <article className={`${styles.slide} ${styles.slideText}`}>
            <div className={styles.slideTextInner}>
              <p className={styles.slideBody}>Planning a room that finally feels like yours?</p>
              <p className={styles.slideCta}>Enquiries open → link in bio</p>
            </div>
            <p className={styles.slideMark}>Maeve Clarke Interiors</p>
            <span className={styles.slideNum}>3 / 3</span>
          </article>
        </div>

        {/* 03 Website hero */}
        <p className={styles.kicker}><span>03</span> Website hero</p>
        <div className={styles.site}>
          <div className={styles.browser}><span className={styles.url}>maeveclarke.co.uk</span></div>
          <div className={styles.siteHero}>
            <Photo name="site-hero" label="Finished room, full-bleed" className={styles.siteHeroPhoto} />
            <div className={styles.siteOverlay}>
              <p className={styles.siteWordmark}>Maeve Clarke</p>
              <p className={styles.siteLabel}>Interior design · Cheltenham &amp; the Cotswolds</p>
              <h3 className={styles.siteHeadline}>Interiors for homes with <em>good bones.</em></h3>
              <p className={styles.siteText}>
                Considered, liveable rooms for period properties. A small studio with a long
                eye for detail and a portfolio worth taking your time over.
              </p>
              <span className={styles.siteBtn}>View the work</span>
            </div>
          </div>
        </div>

        {/* 04 Profile & setup */}
        <p className={styles.kicker}><span>04</span> Profile &amp; setup</p>
        <div className={styles.profile}>
          <div className={styles.profileBar}>
            <span className={styles.url}>instagram.com/maeveclarkeinteriors</span>
          </div>
          <div className={styles.profileHead}>
            <div className={styles.avatar}><Monogram /></div>
            <div className={styles.profileMeta}>
              <p className={styles.profileName}>Maeve Clarke Interiors</p>
              <ul className={styles.stats}>
                <li><strong>48</strong> posts</li>
                <li><strong>3,210</strong> followers</li>
                <li><strong>180</strong> following</li>
              </ul>
              <p className={styles.bio}>
                Considered, liveable interiors for period homes.<br />
                Cheltenham &amp; the Cotswolds · By appointment<br />
                ↓ Latest project
              </p>
            </div>
          </div>
          <div className={styles.grid}>
            {[1, 2, 3, 4, 5, 6].map(n => (
              <Photo key={n} name={`grid-${n}`} label={`Grid ${n}`} className={styles.gridItem} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Monogram() {
  return (
    <svg className={styles.monogram} viewBox="0 0 64 60" fill="none" aria-hidden="true">
      <path d="M14 58V30a18 18 0 0 1 36 0v28" stroke="currentColor" strokeWidth="1.4" />
      <path d="M22 58V32a10 10 0 0 1 20 0v26" stroke="currentColor" strokeWidth="1.4" />
      <path d="M32 58V40" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

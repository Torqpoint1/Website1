import { ScrollReveal } from '@/components/ScrollReveal';
import { INSTAGRAM_URL } from '@/lib/contact';
import { BEHOLD_FEED_URL } from '@/lib/social';
import { InstagramFeed } from '@/components/InstagramFeed';
import styles from './InstagramCta.module.css';

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" />
    </svg>
  );
}

function FollowButton() {
  return (
    <a
      href={INSTAGRAM_URL}
      className={`btn btn-primary ${styles.followBtn}`}
      target="_blank"
      rel="noopener noreferrer"
      data-track="instagram_click"
      data-track-place="home-ig"
    >
      <InstagramGlyph className={styles.btnGlyph} />
      Follow @torqpoint.co
    </a>
  );
}

/** Home-page promo for the Instagram profile. Shows the live post grid once a
 *  Behold feed is connected (see lib/social.ts); until then, a styled card. */
export function InstagramCta() {
  /* ── Connected: live, clickable post grid ─────────────── */
  if (BEHOLD_FEED_URL) {
    return (
      <section className={styles.ig} aria-labelledby="ig-heading">
        <div className="container">
          <div className={styles.feedPanel}>
            <ScrollReveal className={styles.feedHead} stagger direction="left">
              <div>
                <p className="eyebrow">
                  <span className="point point--sm" aria-hidden="true" />
                  Instagram
                </p>
                <h2 id="ig-heading" className={styles.heading}>
                  See the work <span className={styles.forge}>as it happens.</span>
                </h2>
                <p className={styles.leadTight}>
                  Finished jobs, before-and-afters and the odd look behind the scenes.
                  Tap any post to open it on Instagram.
                </p>
              </div>
              <FollowButton />
            </ScrollReveal>

            <ScrollReveal className={styles.feedReveal}>
              <InstagramFeed limit={8} />
            </ScrollReveal>
          </div>
        </div>
      </section>
    );
  }

  /* ── Fallback: styled Follow card (no feed connected yet) ─ */
  return (
    <section className={styles.ig} aria-labelledby="ig-heading">
      <div className="container">
        <ScrollReveal className={styles.panel} stagger direction="left">
          <div className={styles.copy}>
            <p className="eyebrow">
              <span className="point point--sm" aria-hidden="true" />
              Instagram
            </p>
            <h2 id="ig-heading" className={styles.heading}>
              See the work <span className={styles.forge}>as it happens.</span>
            </h2>
            <p className={styles.lead}>
              Finished jobs, before-and-afters and the odd look behind the scenes — the
              kind of content we make, posted as we go. Follow along for a steady look at
              what your business could be putting out.
            </p>
            <div className={styles.actions}>
              <FollowButton />
              <span className={styles.handle}>@torqpoint.co</span>
            </div>
          </div>

          <a
            href={INSTAGRAM_URL}
            className={styles.visual}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Torqpoint on Instagram"
            data-track="instagram_click"
            data-track-place="home-ig-tile"
          >
            <span className={styles.phone} aria-hidden="true">
              <span className={styles.phoneHead}>
                <span className={styles.avatar}>Tp.</span>
                <span className={styles.phoneName}>
                  <b>torqpoint.co</b>
                  <i>Content &amp; marketing · Gloucestershire</i>
                </span>
              </span>
              <span className={styles.gridTiles}>
                <span /><span /><span />
                <span /><span /><span />
              </span>
              <span className={styles.phoneGlyph}>
                <InstagramGlyph className={styles.bigGlyph} />
              </span>
            </span>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}

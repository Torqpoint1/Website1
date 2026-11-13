'use client';

import { useEffect, useState } from 'react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { INSTAGRAM_URL } from '@/lib/contact';
import { BEHOLD_FEED_URL } from '@/lib/social';
import { InstagramGrid, InstagramSkeleton, normaliseBehold, type IgPost } from '@/components/InstagramFeed';
import styles from './InstagramCta.module.css';

const LIMIT = 8;

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

type State = 'loading' | 'ready' | 'empty';

export function InstagramCta() {
  const configured = Boolean(BEHOLD_FEED_URL);
  const [posts, setPosts] = useState<IgPost[]>([]);
  const [state, setState] = useState<State>(configured ? 'loading' : 'empty');

  useEffect(() => {
    if (!configured) return;
    let alive = true;
    fetch(BEHOLD_FEED_URL)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(data => {
        if (!alive) return;
        const mapped = normaliseBehold(data, LIMIT);
        setPosts(mapped);
        setState(mapped.length ? 'ready' : 'empty');
      })
      .catch(() => alive && setState('empty'));
    return () => {
      alive = false;
    };
  }, [configured]);

  /* ── Live feed: header + clickable post grid (or skeleton) ── */
  if (configured && state !== 'empty') {
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
              {state === 'loading'
                ? <InstagramSkeleton count={LIMIT} />
                : <InstagramGrid posts={posts} />}
            </ScrollReveal>
          </div>
        </div>
      </section>
    );
  }

  /* ── Fallback: styled Follow card (not configured, or feed unavailable) ── */
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

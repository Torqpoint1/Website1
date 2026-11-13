'use client';

import { useEffect, useState } from 'react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { INSTAGRAM_URL } from '@/lib/contact';
import { BEHOLD_FEED_URL } from '@/lib/social';
import Link from 'next/link';
import { InstagramGrid, InstagramSkeleton, normaliseBehold, normaliseBeholdProfile, type IgPost, type IgProfile } from '@/components/InstagramFeed';
import { LightString } from '@/components/festive/FestiveDecor';
import styles from './InstagramCta.module.css';

const LIMIT = 9;
const DISPLAY_NAME = 'Torqpoint';
const CATEGORY = 'Marketing agency';

const fmt = (n: number | null) => (n === null ? null : n.toLocaleString('en-GB'));

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

const DEFAULT_PROFILE: IgProfile = {
  username: 'torqpoint.co',
  followers: null,
  following: null,
  bio: 'We make your work look as good as it is.\nFinished projects → posts, case studies, websites & more ▪ Gloucestershire\n↓ See the work / book a call',
  website: 'https://torqpoint.com',
};

export function InstagramCta() {
  const configured = Boolean(BEHOLD_FEED_URL);
  const [posts, setPosts] = useState<IgPost[]>([]);
  const [profile, setProfile] = useState<IgProfile | null>(null);
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
        setProfile(normaliseBeholdProfile(data));
        setState(mapped.length ? 'ready' : 'empty');
      })
      .catch(() => alive && setState('empty'));
    return () => {
      alive = false;
    };
  }, [configured]);

  const p = profile ?? DEFAULT_PROFILE;

  /* ── Live feed: header + clickable post grid (or skeleton) ── */
  if (configured && state !== 'empty') {
    return (
      <section className={styles.ig} aria-labelledby="ig-heading">
        <div className="container">
          <div className={styles.panelWrap}>
            <LightString className={styles.panelLights} units={11} wire="rgba(40,30,22,0.3)" tones={['forge', 'red', 'gold', 'green']} />
            <div className={styles.feedPanel}>
            <ScrollReveal className={styles.feedIntro} stagger direction="left">
              <p className="eyebrow">
                <span className="point point--sm" aria-hidden="true" />
                Instagram
              </p>
              <h2 id="ig-heading" className={styles.heading}>
                See the work <span className={styles.forge}>as it happens.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal className={styles.profile} direction="up">
              <img
                className={styles.profileAvatar}
                src="/torqpoint-instagram.jpg"
                alt="Torqpoint’s Instagram profile picture"
                width={88}
                height={88}
                loading="lazy"
              />

              <div className={styles.profileMain}>
                <div className={styles.identity}>
                  <span className={styles.profileName}>{DISPLAY_NAME}</span>
                  <span className={styles.profileHandle}>@{p.username}</span>
                </div>

                {p.followers !== null && (
                  <div className={styles.stats}>
                    <span className={styles.liveStat}>
                      <span className={styles.liveDot} aria-hidden="true" />
                      <b className={styles.liveNum}>{fmt(p.followers)}</b> followers
                    </span>
                    {p.following !== null && (
                      <span className={styles.stat}><b>{fmt(p.following)}</b> following</span>
                    )}
                  </div>
                )}

                <p className={styles.category}>{CATEGORY}</p>
                <p className={styles.bio}>{p.bio}</p>
                <Link
                  className={styles.bioLink}
                  href="/contact/"
                  data-track="instagram_biolink_click"
                  data-track-place="home-ig"
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={styles.linkIcon}>
                    <path d="M9 15l6-6M8.5 10.5l-1 1a3.2 3.2 0 0 0 4.5 4.5l1-1M15.5 13.5l1-1a3.2 3.2 0 0 0-4.5-4.5l-1 1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  torqpoint.com
                </Link>

                <div className={styles.profileActions}>
                  <FollowButton />
                  <Link href="/contact" className={`btn btn-ghost ${styles.secondaryBtn}`} data-track="book_call_click" data-track-place="home-ig">
                    Contact us
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal className={styles.feedReveal}>
              {state === 'loading'
                ? <InstagramSkeleton count={LIMIT} />
                : <InstagramGrid posts={posts} />}
            </ScrollReveal>
            </div>
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
                <img className={styles.avatarImg} src="/torqpoint-instagram.jpg" alt="" width={46} height={46} loading="lazy" />
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

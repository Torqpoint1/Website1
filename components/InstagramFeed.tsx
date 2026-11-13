'use client';

import { useEffect, useState } from 'react';
import { BEHOLD_FEED_URL } from '@/lib/social';
import styles from './InstagramFeed.module.css';

interface Post {
  id: string;
  permalink: string;
  img: string;
  alt: string;
  isVideo: boolean;
  isAlbum: boolean;
}

/* Behold's JSON shape has shifted over versions; read it defensively so a
   connected feed renders whether it returns a bare array or { posts: [] }. */
function normalise(data: unknown, limit: number): Post[] {
  const raw: any[] = Array.isArray(data)
    ? data
    : ((data as any)?.posts ?? []);
  return raw
    .map((p: any): Post => ({
      id: String(p.id ?? p.permalink ?? ''),
      permalink: p.permalink ?? '',
      img:
        p?.sizes?.medium?.mediaUrl ||
        p?.sizes?.small?.mediaUrl ||
        p?.sizes?.full?.mediaUrl ||
        p.thumbnailUrl ||
        p.mediaUrl ||
        '',
      alt: (p.caption ? String(p.caption) : 'Instagram post from Torqpoint')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 140),
      isVideo: p.mediaType === 'VIDEO',
      isAlbum: p.mediaType === 'CAROUSEL_ALBUM',
    }))
    .filter(p => p.img && p.permalink)
    .slice(0, limit);
}

export function InstagramFeed({ limit = 8 }: { limit?: number }) {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!BEHOLD_FEED_URL) return;
    let alive = true;
    fetch(BEHOLD_FEED_URL)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(data => alive && setPosts(normalise(data, limit)))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [limit]);

  // Not configured, or the feed errored — render nothing so the parent’s
  // fallback (the Follow card) shows instead.
  if (!BEHOLD_FEED_URL || failed || (posts && posts.length === 0)) return null;

  // Loading skeleton so the grid doesn’t pop in abruptly.
  if (!posts) {
    return (
      <div className={styles.grid} aria-hidden="true">
        {Array.from({ length: limit }).map((_, i) => (
          <span key={i} className={`${styles.tile} ${styles.skeleton}`} />
        ))}
      </div>
    );
  }

  return (
    <ul className={styles.grid} aria-label="Latest Instagram posts">
      {posts.map(p => (
        <li key={p.id} className={styles.cell}>
          <a
            href={p.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.tile}
            data-track="instagram_post_click"
            data-track-place="home-ig-feed"
          >
            <img src={p.img} alt={p.alt} loading="lazy" />
            <span className={styles.overlay} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" className={styles.glyph}>
                <rect x="3" y="3" width="18" height="18" rx="5.5" stroke="currentColor" strokeWidth="1.7" />
                <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
                <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" />
              </svg>
            </span>
            {(p.isVideo || p.isAlbum) && (
              <span className={styles.badge} aria-hidden="true">
                {p.isVideo ? '▶' : '❏'}
              </span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}

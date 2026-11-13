import styles from './InstagramFeed.module.css';

export interface IgPost {
  id: string;
  permalink: string;
  img: string;
  alt: string;
  isVideo: boolean;
  isAlbum: boolean;
}

export interface IgProfile {
  username: string;
  followers: number | null;
  following: number | null;
  bio: string;
  website: string;
}

const DEFAULT_BIO =
  'We make your work look as good as it is.\nFinished projects → posts, case studies, websites & more ▪ Gloucestershire\n↓ See the work / book a call';

/** Pull the live profile header fields (followers, bio, etc.) from a Behold feed. */
export function normaliseBeholdProfile(data: unknown): IgProfile {
  const d: any = data && !Array.isArray(data) ? data : {};
  return {
    username: d.username || 'torqpoint.co',
    followers: typeof d.followersCount === 'number' ? d.followersCount : null,
    following: typeof d.followsCount === 'number' ? d.followsCount : null,
    bio: (d.biography && String(d.biography).trim()) || DEFAULT_BIO,
    website: d.website || 'https://torqpoint.com',
  };
}

/* Behold's JSON: { posts: [...] }, each post with sizes.{small,medium,large,full}.mediaUrl
   (a still image even for videos/reels), a permalink, mediaType and caption. Read it
   defensively so a shape change degrades rather than breaks. */
export function normaliseBehold(data: unknown, limit: number): IgPost[] {
  const raw: any[] = Array.isArray(data) ? data : ((data as any)?.posts ?? []);
  return raw
    .map((p: any): IgPost => ({
      id: String(p.id ?? p.permalink ?? ''),
      permalink: p.permalink ?? '',
      img:
        p?.sizes?.medium?.mediaUrl ||
        p?.sizes?.large?.mediaUrl ||
        p?.sizes?.small?.mediaUrl ||
        p?.sizes?.full?.mediaUrl ||
        p.thumbnailUrl ||
        '',
      alt: (p.prunedCaption || p.caption || 'Instagram post from Torqpoint')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 140),
      isVideo: p.mediaType === 'VIDEO',
      isAlbum: p.mediaType === 'CAROUSEL_ALBUM',
    }))
    .filter(p => p.img && p.permalink)
    .slice(0, limit);
}

function Glyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={styles.glyph} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" />
    </svg>
  );
}

export function InstagramSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={styles.grid} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={`${styles.tile} ${styles.skeleton}`} />
      ))}
    </div>
  );
}

export function InstagramGrid({ posts }: { posts: IgPost[] }) {
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
            <span className={styles.overlay} aria-hidden="true"><Glyph /></span>
            {(p.isVideo || p.isAlbum) && (
              <span className={styles.badge} aria-hidden="true">{p.isVideo ? '▶' : '❏'}</span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, formatDate } from '@/lib/content';
import { ScrollReveal } from '@/components/ScrollReveal';
import { pageMetadata } from '@/lib/seo';
import type { Post } from '@/lib/content';
import styles from './page.module.css';

export const metadata: Metadata = pageMetadata({
  path: '/journal/',
  title: 'Journal — marketing for trades, in plain English',
  description:
    'Plain-spoken pieces for Gloucestershire trades: directory leads, Google reviews, photographing jobs, getting found locally. No hype, no jargon.',
  og: 'journal',
});

function PostRow({ post }: { post: Post }) {
  return (
    <Link href={`/journal/${post.slug}`} className={styles.postRow}>
      <div className={styles.postMeta}>
        {post.category && <span className={styles.postCategory}>{post.category}</span>}
        {post.date && <time className={styles.postDate} dateTime={post.date}>{formatDate(post.date)}</time>}
      </div>
      <div className={styles.postMain}>
        <h3 className={styles.postTitle}>{post.title}</h3>
        {post.excerpt && <p className={styles.postExcerpt}>{post.excerpt}</p>}
      </div>
      <span className={styles.postArrow} aria-hidden="true">→</span>
    </Link>
  );
}

export default function JournalPage() {
  const posts = getAllPosts('journal');
  const isEmpty = posts.length === 0;
  const tradePosts = posts.filter(p => p.audience === 'trade');
  const otherPosts = posts.filter(p => p.audience !== 'trade');

  return (
    <>
      <div className={styles.pageHeader}>
        <div className="container">
          <ScrollReveal stagger>
            <p className="eyebrow">
              <span className="point point--sm" aria-hidden="true" />
              Journal
            </p>
            <h1 className={styles.pageTitle}>
              Notes on doing the work{' '}
              <span className={styles.underline}>properly.</span>
            </h1>
            <p className={styles.pageIntro}>
              Plain-spoken pieces for trades who&rsquo;d rather win work on their
              reputation than pay per lead. Free, no catch, no jargon.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <section className="section" aria-label="Journal posts">
        <div className="container">
          {isEmpty ? (
            <ScrollReveal>
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon} aria-hidden="true">
                  <span className="point" style={{ width: 32, height: 32 }} />
                </div>
                <h2 className={styles.emptyTitle}>First pieces coming soon</h2>
                <p className={styles.emptyDesc}>
                  Plain-spoken notes on marketing for businesses that want to grow.
                  Watch this space.
                </p>
              </div>
            </ScrollReveal>
          ) : (
            <>
              {tradePosts.length > 0 && (
                <div className={styles.group}>
                  <ScrollReveal className={styles.groupHead} direction="left">
                    <h2 className={styles.groupTitle}>
                      <span className="point point--sm" aria-hidden="true" />
                      For trades
                    </h2>
                    <p className={styles.groupNote}>Start here if you fit, finish or build for a living.</p>
                  </ScrollReveal>
                  <ScrollReveal className={styles.postList} stagger staggerStep={0.08}>
                    {tradePosts.map(post => <PostRow key={post.slug} post={post} />)}
                  </ScrollReveal>
                </div>
              )}
              {otherPosts.length > 0 && (
                <div className={styles.group}>
                  <ScrollReveal className={styles.groupHead} direction="left">
                    <h2 className={styles.groupTitle}>
                      <span className="point point--sm" aria-hidden="true" />
                      Websites &amp; marketing
                    </h2>
                    <p className={styles.groupNote}>The wider picture — your site, your copy, getting found.</p>
                  </ScrollReveal>
                  <ScrollReveal className={styles.postList} stagger staggerStep={0.06}>
                    {otherPosts.map(post => <PostRow key={post.slug} post={post} />)}
                  </ScrollReveal>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, formatDate } from '@/lib/content';
import { ScrollReveal } from '@/components/ScrollReveal';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Short, plain-spoken pieces on marketing for businesses that want to grow. No hype, no jargon.',
};

export default function JournalPage() {
  const posts = getAllPosts('journal');
  const isEmpty = posts.length === 0;

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
              Short, plain-spoken pieces on marketing for businesses that want to
              grow. No hype, no jargon.
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
            <ScrollReveal className={styles.postList} stagger>
              {posts.map(post => (
                <Link key={post.slug} href={`/journal/${post.slug}`} className={styles.postRow}>
                  <div className={styles.postMeta}>
                    {post.date && <time className={styles.postDate} dateTime={post.date}>{formatDate(post.date)}</time>}
                  </div>
                  <div className={styles.postMain}>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                    {post.excerpt && <p className={styles.postExcerpt}>{post.excerpt}</p>}
                  </div>
                  <span className={styles.postArrow} aria-hidden="true">→</span>
                </Link>
              ))}
            </ScrollReveal>
          )}
        </div>
      </section>
    </>
  );
}

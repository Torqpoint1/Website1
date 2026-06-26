import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, formatDate } from '@/lib/content';
import { ScrollReveal } from '@/components/ScrollReveal';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Work',
  description: 'A growing record of projects we\'ve turned into content — case studies that win trust and send to prospects.',
};

export default function WorkPage() {
  const posts = getAllPosts('work');
  const isEmpty = posts.length === 0;

  return (
    <>
      <div className={styles.pageHeader}>
        <div className="container">
          <ScrollReveal stagger>
            <p className="eyebrow">
              <span className="point point--sm" aria-hidden="true" />
              Work
            </p>
            <h1 className={styles.pageTitle}>
              The work, <span className={styles.underline}>written up properly.</span>
            </h1>
            <p className={styles.pageIntro}>
              A growing record of projects we&rsquo;ve turned into content — and the
              kind of thing your own case studies will look like.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <section className={`section`} aria-label="Case studies">
        <div className="container">
          {isEmpty ? (
            <ScrollReveal>
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon} aria-hidden="true">
                  <span className="point" style={{ width: 32, height: 32 }} />
                </div>
                <h2 className={styles.emptyTitle}>First projects landing soon</h2>
                <p className={styles.emptyDesc}>
                  We&rsquo;re putting the first case studies together now. Want yours
                  to be one of them?
                </p>
                <Link href="/contact" className="btn btn-primary">
                  Start a project
                </Link>
              </div>
            </ScrollReveal>
          ) : (
            <ScrollReveal className={styles.grid} stagger>
              {posts.map(post => (
                <Link key={post.slug} href={`/work/${post.slug}`} className={`card ${styles.postCard}`}>
                  {post.cover && (
                    <div className={styles.cardCover}>
                      <img src={post.cover} alt="" loading="lazy" />
                    </div>
                  )}
                  {!post.cover && <div className={styles.cardCoverPlaceholder} aria-hidden="true" />}
                  <div className={styles.cardBody}>
                    {post.client && (
                      <p className="eyebrow">
                        <span className="point point--sm" aria-hidden="true" />
                        {post.client}
                      </p>
                    )}
                    <h2 className={styles.cardTitle}>{post.title}</h2>
                    {post.summary && <p className={styles.cardSummary}>{post.summary}</p>}
                    <span className={styles.cardLink} aria-hidden="true">
                      Read case study →
                    </span>
                  </div>
                </Link>
              ))}
            </ScrollReveal>
          )}
        </div>
      </section>

      {!isEmpty && (
        <section className="cta-band cta-band--forge" aria-label="Call to action">
          <div className="container">
            <div className="cta-band__inner">
              <p className="cta-band__statement">
                Want yours to be next?
              </p>
              <Link href="/contact" className="btn btn-ghost-light">
                Start a project
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

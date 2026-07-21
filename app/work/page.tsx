import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/content';
import { ScrollReveal } from '@/components/ScrollReveal';
import { WorkPlaceholder } from '@/components/WorkPlaceholder';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Concept projects — sample work showing what we\'d create for a business like yours. Not real client case studies.',
  alternates: { canonical: '/work/' },
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
              Sample work, <span className={styles.underline}>written up properly.</span>
            </h1>
            <p className={styles.pageIntro}>
              We&rsquo;re a new studio, so we haven&rsquo;t published real client case
              studies yet. Instead, here are <strong>concept projects</strong> — sample
              work that shows exactly what we&rsquo;d create for a business like yours.
              The businesses are made up; the thinking and the standard are real.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <section className="section" aria-label="Concept case studies">
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
                <Link key={post.slug} href={`/work/${post.slug}/`} className={`card ${styles.postCard}`}>
                  <div className={styles.cardCover}>
                    {post.concept && <span className={styles.conceptBadge}>Concept</span>}
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={[post.client, post.sector].filter(Boolean).join(' — ')}
                        className={styles.cardCoverImg}
                        loading="lazy"
                      />
                    ) : (
                      <WorkPlaceholder label={post.client ?? post.title} />
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    {post.client && (
                      <p className="eyebrow">
                        <span className="point point--sm" aria-hidden="true" />
                        {post.client}
                      </p>
                    )}
                    {(post.sector || post.location) && (
                      <p className={styles.cardMeta}>
                        {[post.sector, post.location].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <h2 className={styles.cardTitle}>{post.title}</h2>
                    {post.summary && <p className={styles.cardSummary}>{post.summary}</p>}
                    <span className={styles.cardLink} aria-hidden="true">
                      See the sample →
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
                Want work like this for your business?
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

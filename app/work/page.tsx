import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/content';
import { ScrollReveal } from '@/components/ScrollReveal';
import { WorkPlaceholder } from '@/components/WorkPlaceholder';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';
import { Picture } from '@/components/Picture';

export const metadata: Metadata = pageMetadata({
  path: '/work/',
  title: 'Work — case studies for Gloucestershire trades',
  description:
    'Case studies for Gloucestershire building trades — bathrooms, landscaping, joinery and more, written up the way they should be. See what we’d produce for your next job.',
  og: 'work',
});

export default function WorkPage() {
  // Real client work (concept: false) sorts above concept work.
  const posts = getAllPosts('work')
    .filter(p => !p.archived)
    .sort((a, b) => Number(a.concept ?? false) - Number(b.concept ?? false));
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
              Finished jobs, <span className={styles.underline}>written up properly.</span>
            </h1>
            <p className={styles.pageIntro}>
              What one job becomes: the case study, the before-and-after set, the posts
              and the Google update — for bathroom fitters, landscapers and joiners across
              Gloucestershire.
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
                      <Picture
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

          {!isEmpty && (
            <ScrollReveal>
              <aside className={styles.disclosure} aria-label="About these examples">
                <span className={styles.disclosureBadge}>Concept</span>
                <p>
                  <strong>A straight answer about these.</strong> We&rsquo;re a new studio, so
                  the projects marked <em>Concept</em> are sample work — the businesses are
                  made up; the thinking, the writing and the standard are exactly what
                  you&rsquo;d get. Real client work will appear here first as it lands.
                </p>
              </aside>
            </ScrollReveal>
          )}
        </div>
      </section>

      {!isEmpty && (
        <section className="cta-band cta-band--forge" aria-label="Call to action">
          <div className="container">
            <div className="cta-band__inner">
              <p className="cta-band__statement">
                Want your next finished job written up like this?
              </p>
              <div className={styles.ctaPair}>
                <Link href="/contact" className="btn btn-ghost-light">
                  Start a project
                </Link>
                <Link href="/pricing" className={`btn ${styles.ctaSolid}`}>
                  See what it costs
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

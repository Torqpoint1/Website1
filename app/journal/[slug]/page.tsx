import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPost, getAllPosts, formatDate } from '@/lib/content';
import { marked } from 'marked';
import { getService } from '@/lib/services';
import { ORGANIZATION_ID } from '@/lib/schema';
import { BASE_URL, absoluteUrl, pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

interface Props {
  params: { slug: string };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPosts('journal').map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost('journal', params.slug);
  if (!post) return {};
  const meta = pageMetadata({
    path: `/journal/${params.slug}/`,
    title: post.title,
    description: post.description ?? post.excerpt,
    keywords: post.keywords,
    og: 'journal',
    type: 'article',
  });
  return {
    ...meta,
    openGraph: { ...meta.openGraph, type: 'article', publishedTime: post.date || undefined },
  };
}

/** Default end-of-article CTA target when an article doesn't name one. */
const DEFAULT_RELATED = 'job-story';

export default async function JournalPostPage({ params }: Props) {
  const post = getPost('journal', params.slug);
  if (!post) notFound();

  const html = await marked(post.content);
  const related = getService(post.relatedService ?? DEFAULT_RELATED) ?? getService(DEFAULT_RELATED)!;
  const url = absoluteUrl(`/journal/${post.slug}/`);

  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description ?? post.excerpt,
    datePublished: post.date || undefined,
    dateModified: post.date || undefined,
    image: `${BASE_URL}/og/journal.png`,
    author: { '@type': 'Person', name: 'Luke Deakin', url: `${BASE_URL}/about/` },
    publisher: { '@id': ORGANIZATION_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: post.keywords?.join(', '),
    articleSection: post.category,
    inLanguage: 'en-GB',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting) }} />

      <div className={styles.hero}>
        <div className="container">
          <Link href="/journal" className={styles.back}>
            <span aria-hidden="true">←</span> Back to journal
          </Link>
          <div className={styles.heroMeta}>
            {post.category && <span className={styles.category}>{post.category}</span>}
            {post.date && (
              <time className={styles.date} dateTime={post.date}>{formatDate(post.date)}</time>
            )}
          </div>
          <h1 className={`${styles.title} font-serif`}>{post.title}</h1>
          {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
        </div>
      </div>

      <article className="section">
        <div className="container">
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* Contextual CTA — turns every article into an entry point */}
          <aside className={styles.relatedCta} aria-label="How Torqpoint can help">
            <div className={styles.relatedText}>
              <p className={styles.relatedEyebrow}>
                <span className="point point--sm" aria-hidden="true" />
                We do this for Gloucestershire trades
              </p>
              <p className={styles.relatedTitle}>
                {related.isProduct ? related.name : `${related.name} — part of every Job Story`}
              </p>
              <p className={styles.relatedDesc}>
                {related.tagline ?? related.metaDescription}
              </p>
            </div>
            <div className={styles.relatedActions}>
              <Link
                href="/pricing/"
                className="btn btn-primary"
                data-track="journal_cta_click"
                data-track-place={`journal:${post.slug}`}
              >
                See what it costs
              </Link>
              <Link
                href={`/services/${related.slug}/`}
                className={styles.relatedLink}
                data-track="journal_cta_click"
                data-track-place={`journal:${post.slug}`}
              >
                How {related.name} works <span aria-hidden="true">→</span>
              </Link>
            </div>
          </aside>
        </div>
      </article>

      <section className="cta-band cta-band--dark" aria-label="Call to action">
        <div className="container">
          <div className="cta-band__inner">
            <p className="cta-band__statement">
              Stop renting your leads. Start owning your proof.
            </p>
            <Link href="/contact" className="btn btn-ghost-light">
              Book a call
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPost, getAllPosts, formatDate } from '@/lib/content';
import { marked } from 'marked';
import styles from './page.module.css';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllPosts('work').map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost('work', params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary ?? post.excerpt,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const post = getPost('work', params.slug);
  if (!post) notFound();

  const html = await marked(post.content);

  return (
    <>
      <div className={styles.hero}>
        <div className="container">
          <Link href="/work" className={styles.back}>
            <span aria-hidden="true">←</span> Back to work
          </Link>
          {post.client && (
            <p className="eyebrow" style={{ marginBottom: 20 }}>
              <span className="point point--sm" aria-hidden="true" />
              {post.client}
            </p>
          )}
          <h1 className={styles.title}>{post.title}</h1>
          {post.summary && <p className={styles.summary}>{post.summary}</p>}
          {post.date && (
            <p className={styles.meta}>{formatDate(post.date)}</p>
          )}
        </div>
      </div>

      {post.cover && (
        <div className={styles.coverWrap}>
          <div className="container">
            <div className={styles.cover}>
              <img src={post.cover} alt={post.title} />
            </div>
          </div>
        </div>
      )}

      <article className={`section`}>
        <div className="container">
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </article>

      <section className="cta-band cta-band--forge" aria-label="Call to action">
        <div className="container">
          <div className="cta-band__inner">
            <p className="cta-band__statement">
              Want content like this for your business?
            </p>
            <Link href="/contact" className="btn btn-ghost-light">
              Start a project
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

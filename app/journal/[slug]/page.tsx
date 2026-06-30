import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPost, getAllPosts, formatDate } from '@/lib/content';
import { marked } from 'marked';
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
  return {
    title: post.title,
    description: post.description ?? post.excerpt,
    keywords: post.keywords,
  };
}

export default async function JournalPostPage({ params }: Props) {
  const post = getPost('journal', params.slug);
  if (!post) notFound();

  const html = await marked(post.content);

  return (
    <>
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
        </div>
      </article>

      <section className="cta-band cta-band--dark" aria-label="Call to action">
        <div className="container">
          <div className="cta-band__inner">
            <p className="cta-band__statement">
              Want content like this working for your business?
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

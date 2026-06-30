import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPost, getAllPosts } from '@/lib/content';
import { WorkPlaceholder } from '@/components/WorkPlaceholder';
import { BrandAssets } from '@/components/work-assets/BrandAssets';
import { marked } from 'marked';
import styles from './page.module.css';

interface Props {
  params: { slug: string };
}

export const dynamicParams = false;

/** Map case-study service tags to their dedicated service pages. */
const SERVICE_SLUGS: Record<string, string> = {
  'Social posts': 'social-posts',
  'Case studies': 'case-studies',
  'Email & newsletters': 'email-newsletters',
  'Blog articles': 'blog-articles',
  'Google Business posts': 'google-business-posts',
  'Profiles & setup': 'profiles-setup',
  'Website design & build': 'website-design-build',
};

function serviceHref(name: string): string {
  const slug = SERVICE_SLUGS[name];
  return slug ? `/services/${slug}` : '/services';
}

export async function generateStaticParams() {
  return getAllPosts('work').map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost('work', params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — Concept project`,
    description: post.summary ?? post.excerpt,
  };
}

export default async function WorkPage({ params }: Props) {
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

          {post.concept && (
            <p className={styles.conceptNotice}>
              <span className={styles.conceptTag}>Concept project</span>
              Sample work — not a real client. This shows what we&rsquo;d create for a
              business like this one.
            </p>
          )}

          {(post.sector || post.location) && (
            <p className={styles.meta}>
              {[post.sector, post.location].filter(Boolean).join(' · ')}
            </p>
          )}
          <h1 className={`${styles.title} font-serif`}>{post.title}</h1>
          {post.summary && <p className={styles.excerpt}>{post.summary}</p>}

          {post.services && post.services.length > 0 && (
            <ul className={styles.tags} aria-label="What we made">
              {post.services.map(s => (
                <li key={s}>
                  <Link href={serviceHref(s)} className={styles.tag}>{s}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="container">
        <div className={styles.cover}>
          {post.coverImage ? (
            <img src={post.coverImage} alt="" className={styles.coverImg} />
          ) : (
            <WorkPlaceholder label={post.client} />
          )}
        </div>
      </div>

      <BrandAssets post={post} />

      <article className="section">
        <div className="container">
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

          {post.gallery && post.gallery.length > 0 && (
            <div className={styles.gallery}>
              {post.gallery.map((g, i) => (
                <div key={i} className={styles.galleryItem}>
                  {post.galleryImages?.includes(g) ? (
                    <img src={g} alt="" className={styles.galleryImg} loading="lazy" />
                  ) : (
                    <WorkPlaceholder />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </article>

      <section className="cta-band cta-band--forge" aria-label="Call to action">
        <div className="container">
          <div className="cta-band__inner">
            <p className="cta-band__statement">
              This is what we&rsquo;d do with your work.
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

import type { Post } from '@/lib/content';
import { Picture } from '@/components/Picture';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BeforeAfter } from './BeforeAfter';
import styles from './JobStoryAssets.module.css';

/**
 * Generic Job Story layout for trade case studies: drag-to-compare
 * before/after beside the during shot. Renders when the study's image
 * folder holds before.jpg and after.jpg.
 */
export function JobStoryAssets({ post }: { post: Post }) {
  const find = (name: string) => post.assetImages?.find(src => src.endsWith(`/${name}.jpg`));
  const before = find('before');
  const after = find('after');
  const during = find('during');
  if (!before || !after) return null;
  const label = post.client ?? post.title;

  return (
    <section className={`section ${styles.section}`} aria-labelledby="job-story-heading">
      <div className="container">
        <ScrollReveal className="section-header" stagger direction="left">
          <p className="eyebrow">
            <span className="point point--sm" aria-hidden="true" />
            The Job Story
          </p>
          <h2 id="job-story-heading">
            Before, during, after. <span className={styles.forge}>Drag to compare.</span>
          </h2>
        </ScrollReveal>

        <div className={styles.grid}>
          <ScrollReveal direction="scale">
            <BeforeAfter before={before} after={after} label={label} />
          </ScrollReveal>

          {during && (
            <ScrollReveal className={styles.duringCol} delay={0.15} direction="right">
              <figure className={styles.during}>
                <Picture src={during} alt={`${label} — work in progress`} className={styles.duringImg} intrinsicSize={false} />
                <figcaption className={styles.caption}>
                  <span className={styles.stage}>During</span>
                  The bit homeowners never see — and the photo that wins the argument on price.
                </figcaption>
              </figure>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}

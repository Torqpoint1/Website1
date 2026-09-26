import type { Post } from '@/lib/content';
import { WorkPlaceholder } from '@/components/WorkPlaceholder';
import { Picture } from '@/components/Picture';

export function assetHas(post: Post, name: string): boolean {
  return post.assetImages?.some(g => g.endsWith(`/${name}.jpg`)) ?? false;
}

/* A photo slot that fills from /public/work/{slug}/{name}.jpg when the
   file exists, and falls back to the branded placeholder otherwise. */
export function AssetPhoto({
  post,
  slug,
  name,
  label,
  className,
}: {
  post: Post;
  slug: string;
  name: string;
  label: string;
  className?: string;
}) {
  const src = `/work/${slug}/${name}.jpg`;
  if (assetHas(post, name)) {
    return <Picture src={src} alt={label} className={className} intrinsicSize={false} />;
  }
  return (
    <div className={className}>
      <WorkPlaceholder label={label} />
    </div>
  );
}

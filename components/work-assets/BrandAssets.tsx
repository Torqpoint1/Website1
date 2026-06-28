import type { Post } from '@/lib/content';
import { FoxgloveAssets } from './FoxgloveAssets';

/* Renders the per-brand sample-asset section for a concept case study,
   each in its own scoped brand identity. Returns null for brands whose
   lookbook hasn't been built yet. */
export function BrandAssets({ post }: { post: Post }) {
  switch (post.slug) {
    case 'foxglove-and-fern-wedding-florist':
      return <FoxgloveAssets post={post} />;
    default:
      return null;
  }
}

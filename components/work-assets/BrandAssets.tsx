import type { Post } from '@/lib/content';
import { FoxgloveAssets } from './FoxgloveAssets';
import { MaeveAssets } from './MaeveAssets';
import { FieldhouseAssets } from './FieldhouseAssets';
import { CartshedAssets } from './CartshedAssets';

/* Renders the per-brand sample-asset section for a concept case study,
   each in its own scoped brand identity. Returns null for brands whose
   lookbook hasn't been built yet (Ashcroft, Marsh & Vale). */
export function BrandAssets({ post }: { post: Post }) {
  switch (post.slug) {
    case 'foxglove-and-fern-wedding-florist':
      return <FoxgloveAssets post={post} />;
    case 'maeve-clarke-interiors-townhouse':
      return <MaeveAssets post={post} />;
    case 'fieldhouse-landscapes-cotswold-garden':
      return <FieldhouseAssets post={post} />;
    case 'the-old-cartshed-holiday-let':
      return <CartshedAssets post={post} />;
    default:
      return null;
  }
}

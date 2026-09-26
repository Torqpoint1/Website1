import type { Metadata } from 'next';

export const BASE_URL = 'https://torqpoint.com';

export const SITE_DESCRIPTION =
  'Content and marketing for Gloucestershire trades. We turn your finished jobs into case studies, photos and a Google presence you own — instead of leads you rent. Bathrooms, kitchens, landscaping, joinery, roofing, extensions.';

export type OgImage = 'default' | 'pricing' | 'work' | 'journal' | 'about' | 'services';

/** Absolute URL with a trailing slash for any site path. */
export function absoluteUrl(path: string) {
  const clean = path === '/' ? '/' : `/${path.replace(/^\/|\/$/g, '')}/`;
  return `${BASE_URL}${clean}`;
}

/**
 * One code path for every page's metadata: absolute trailing-slash
 * canonical, matching og:url, and a static share image from /public/og/.
 */
export function pageMetadata({
  path,
  title,
  description,
  og = 'default',
  keywords,
  absoluteTitle,
  type = 'website',
  image,
}: {
  path: string;
  title: string;
  description: string;
  og?: OgImage;
  keywords?: string[];
  /** true when the title should not get the " | Torqpoint" suffix */
  absoluteTitle?: boolean;
  type?: 'website' | 'article';
  /** site path of a page-specific share image, overriding the og type */
  image?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const shareTitle = absoluteTitle ? title : `${title} | Torqpoint`;
  const ogImage = image
    ? { url: `${BASE_URL}${image}`, alt: shareTitle }
    : { url: `${BASE_URL}/og/${og}.png`, width: 1200, height: 630, alt: shareTitle };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title: shareTitle,
      description,
      url,
      siteName: 'Torqpoint',
      locale: 'en_GB',
      type,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description,
      images: [ogImage.url],
    },
  };
}

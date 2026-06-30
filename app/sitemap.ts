import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/content';
import { SERVICE_ORDER } from '@/lib/services';

const BASE_URL = 'https://torqpoint.com';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages = [
    { path: '/', priority: 1.0 },
    { path: '/services/', priority: 0.9 },
    { path: '/work/', priority: 0.8 },
    { path: '/journal/', priority: 0.7 },
    { path: '/about/', priority: 0.7 },
    { path: '/contact/', priority: 0.8 },
  ].map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority,
  }));

  // Service detail pages
  const servicePages = SERVICE_ORDER.map(slug => ({
    url: `${BASE_URL}/services/${slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Journal posts
  const journalPosts = getAllPosts('journal').map(post => ({
    url: `${BASE_URL}/journal/${post.slug}/`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  // Work / concept case studies
  const workPosts = getAllPosts('work').map(post => ({
    url: `${BASE_URL}/work/${post.slug}/`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...servicePages, ...journalPosts, ...workPosts];
}

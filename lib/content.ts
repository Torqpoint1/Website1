import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentRoot = path.join(process.cwd(), 'content');

export interface PostMeta {
  title: string;
  date: string;
  excerpt: string;
  client?: string;
  summary?: string;
  cover?: string;
  slug: string;
  sector?: string;
  location?: string;
  concept?: boolean;
  gallery?: string[];
  services?: string[];
  /** cover path if the image actually exists in /public, else undefined */
  coverImage?: string;
  /** gallery paths filtered to those that actually exist in /public */
  galleryImages?: string[];
}

export interface Post extends PostMeta {
  content: string;
}

function getDir(collection: string) {
  return path.join(contentRoot, collection);
}

export function getSlugs(collection: string): string[] {
  const dir = getDir(collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(f => /\.(md|mdx)$/.test(f))
    .map(f => f.replace(/\.(md|mdx)$/, ''));
}

export function getPost(collection: string, slug: string): Post | null {
  const dir = getDir(collection);
  const tryPaths = [
    path.join(dir, `${slug}.md`),
    path.join(dir, `${slug}.mdx`),
  ];
  const filepath = tryPaths.find(p => fs.existsSync(p));
  if (!filepath) return null;

  const raw = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(raw);

  const publicDir = path.join(process.cwd(), 'public');
  const exists = (p?: string) =>
    typeof p === 'string' && fs.existsSync(path.join(publicDir, p.replace(/^\//, '')));

  const gallery = Array.isArray(data.gallery) ? (data.gallery as string[]) : undefined;

  return {
    slug,
    title: data.title ?? 'Untitled',
    date: data.date ? String(data.date) : '',
    excerpt: data.excerpt ?? '',
    client: data.client,
    summary: data.summary,
    cover: data.cover,
    sector: data.sector,
    location: data.location,
    concept: data.concept === true,
    gallery,
    services: Array.isArray(data.services) ? data.services : undefined,
    coverImage: exists(data.cover) ? data.cover : undefined,
    galleryImages: gallery?.filter(exists),
    content,
  };
}

export function getAllPosts(collection: string): Post[] {
  return getSlugs(collection)
    .map(slug => getPost(collection, slug))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

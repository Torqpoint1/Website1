import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Testimonial {
  slug: string;
  name: string;
  business: string;
  town?: string;
  quote: string;
  photo?: string;
  date?: string;
}

const dir = path.join(process.cwd(), 'content', 'testimonials');

/** Every testimonial in content/testimonials/*.md, newest first. */
export function getTestimonials(): Testimonial[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), 'utf-8'));
      return {
        slug: f.replace(/\.md$/, ''),
        name: String(data.name ?? ''),
        business: String(data.business ?? ''),
        town: data.town ? String(data.town) : undefined,
        quote: String(data.quote ?? content).trim(),
        photo: data.photo ? String(data.photo) : undefined,
        date: data.date ? String(data.date) : undefined,
      };
    })
    .filter(t => t.name && t.quote)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}

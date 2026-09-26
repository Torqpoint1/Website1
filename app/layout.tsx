import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ClickTracker } from '@/components/ClickTracker';
import { organizationSchema } from '@/lib/schema';
import { BASE_URL, SITE_DESCRIPTION } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    default: 'Torqpoint — Content & Marketing for Trades, Gloucestershire',
    template: '%s | Torqpoint',
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: `${BASE_URL}/`,
    siteName: 'Torqpoint',
    images: [{ url: `${BASE_URL}/og/default.png`, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Nav />
        <main id="main-content">{children}</main>
        <Footer />
        <ClickTracker />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

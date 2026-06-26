import type { Metadata } from 'next';
import './globals.css';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Torqpoint — Content & Marketing Studio, Gloucestershire',
    template: '%s | Torqpoint',
  },
  description:
    'We turn your finished projects into posts, case studies and emails that win the next job. Content & marketing studio based in Gloucestershire.',
  metadataBase: new URL('https://torqpoint.com'),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://torqpoint.com',
    siteName: 'Torqpoint',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Nav />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

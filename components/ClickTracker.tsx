'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/track';

/**
 * Sitewide conversion tracking without touching every link: listens for
 * taps on tel: and WhatsApp links, and on anything marked data-track, and
 * records page-type views for pricing and case studies.
 */
export function ClickTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/pricing/' || pathname === '/pricing') trackEvent('pricing_view');
    const work = pathname.match(/^\/work\/([^/]+)\/?$/);
    if (work) trackEvent('case_study_view', { slug: work[1] });
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest('a');
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      const where = a.dataset.trackPlace ?? pathname;
      if (href.startsWith('tel:')) trackEvent('phone_click', { where });
      else if (href.includes('wa.me/')) trackEvent('whatsapp_click', { where });
      if (a.dataset.track) trackEvent(a.dataset.track, { where, href });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [pathname]);

  return null;
}

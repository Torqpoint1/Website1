import { track } from '@vercel/analytics';

type Props = Record<string, string | number | boolean | null>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Sends a conversion event to Vercel Analytics, and to GA4 if it is ever added. */
export function trackEvent(name: string, props?: Props) {
  try {
    track(name, props);
  } catch {}
  window.gtag?.('event', name, props ?? {});
}

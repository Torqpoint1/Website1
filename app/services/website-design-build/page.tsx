import type { Metadata } from 'next';
import { ServicePage } from '@/components/services/ServicePage';
import { serviceMetadata } from '@/lib/services';

const SLUG = 'website-design-build';

export const metadata: Metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}

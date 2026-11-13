/**
 * Sitewide Organization entity (schema.org ProfessionalService, a subtype of
 * LocalBusiness) rendered once in the root layout so every page carries it.
 * Page-level schema (BreadcrumbList, FAQPage) references this entity by @id
 * rather than duplicating it. Service-area business: region-level address
 * only, no invented street address; sameAs lists only profiles that exist.
 */
import { EMAIL, PHONE_E164, hasPhone } from './contact';

export const ORGANIZATION_ID = 'https://torqpoint.com/#organization';

/** Schema.org Offer for a priced product, shared by the org catalogue and product pages. */
export function productOffer(p: { name: string; slug: string; description: string; price: string; unit: 'job' | 'month' }) {
  return {
    '@type': 'Offer',
    price: p.price,
    priceCurrency: 'GBP',
    url: `https://torqpoint.com/services/${p.slug}/`,
    availability: 'https://schema.org/InStock',
    ...(p.unit === 'month'
      ? {
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: p.price,
            priceCurrency: 'GBP',
            unitCode: 'MON',
            referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
          },
        }
      : {}),
    itemOffered: {
      '@type': 'Service',
      name: p.name,
      description: p.description,
      provider: { '@id': ORGANIZATION_ID },
      areaServed: { '@type': 'AdministrativeArea', name: 'Gloucestershire' },
    },
  };
}

/** Price-free service catalogue for the Organization schema (prices removed for now). */
export const PRODUCT_OFFERS = [
  {
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: 'Job Story',
      description:
        'One finished job turned into a case study page, a before-and-after photo set, four social posts, a Google Business post and a review request.',
      provider: { '@id': ORGANIZATION_ID },
      areaServed: { '@type': 'AdministrativeArea', name: 'Gloucestershire' },
    },
  },
  {
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: 'Engine',
      description:
        'Two Job Stories a month, Google Business Profile management, review responses, and a monthly report and call.',
      provider: { '@id': ORGANIZATION_ID },
      areaServed: { '@type': 'AdministrativeArea', name: 'Gloucestershire' },
    },
  },
];

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': ORGANIZATION_ID,
  name: 'Torqpoint',
  url: 'https://torqpoint.com/',
  description:
    'A content and marketing studio for Gloucestershire businesses. We turn the work you do into case studies, photos, articles and a Google presence you own — instead of leads you rent from directories.',
  email: EMAIL,
  ...(hasPhone ? { telephone: PHONE_E164 } : {}),
  image: 'https://torqpoint.com/icon.png',
  logo: 'https://torqpoint.com/icon.png',
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Gloucestershire' },
    { '@type': 'Place', name: 'The Cotswolds' },
    { '@type': 'City', name: 'Gloucester' },
    { '@type': 'City', name: 'Cheltenham' },
    { '@type': 'City', name: 'Cirencester' },
    { '@type': 'City', name: 'Stroud' },
    { '@type': 'City', name: 'Tewkesbury' },
  ],
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Gloucestershire',
    addressCountry: 'GB',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
  ],
  sameAs: ['https://www.instagram.com/torqpoint.co/'],
  knowsAbout: [
    'Content marketing for small businesses',
    'Case studies and customer stories',
    'Local SEO in Gloucestershire',
    'Google Business Profile management',
    'Social media and email marketing',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Content and marketing for Gloucestershire businesses',
    itemListElement: PRODUCT_OFFERS,
  },
};

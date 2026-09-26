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

export const PRODUCT_OFFERS = [
  productOffer({
    name: 'Job Story',
    slug: 'job-story',
    description:
      'One finished job turned into a case study page, a before-and-after photo set, four social posts, a Google Business post and a review request.',
    price: '350',
    unit: 'job',
  }),
  productOffer({
    name: 'Engine',
    slug: 'engine',
    description:
      'Two Job Stories a month, Google Business Profile management, review responses, and a monthly report and call.',
    price: '450',
    unit: 'month',
  }),
];

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': ORGANIZATION_ID,
  name: 'Torqpoint',
  url: 'https://torqpoint.com/',
  description:
    'A content and marketing studio for Gloucestershire building trades. We turn finished jobs into case studies, photos and a Google presence the business owns — instead of leads it rents from directories.',
  email: EMAIL,
  ...(hasPhone ? { telephone: PHONE_E164 } : {}),
  priceRange: '££',
  image: 'https://torqpoint.com/icon.png',
  logo: 'https://torqpoint.com/icon.png',
  founder: { '@type': 'Person', name: 'Luke Deakin' },
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
    'Marketing for building trades',
    'Case studies for tradespeople',
    'Local SEO for home improvement businesses',
    'Google Business Profile management',
    'Content marketing Gloucestershire',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Content and marketing for trades',
    itemListElement: PRODUCT_OFFERS,
  },
};

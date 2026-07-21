/**
 * Sitewide Organization entity (schema.org ProfessionalService, a subtype of
 * LocalBusiness) rendered once in the root layout so every page carries it.
 * Page-level schema (BreadcrumbList, FAQPage) references this entity by @id
 * rather than duplicating it. Service-area business: region-level address
 * only, no invented street address; sameAs lists only profiles that exist.
 */
export const ORGANIZATION_ID = 'https://torqpoint.com/#organization';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': ORGANIZATION_ID,
  name: 'Torqpoint',
  url: 'https://torqpoint.com/',
  description:
    'A content and social media studio in Gloucestershire for Cotswold trades, makers and independent businesses. Beautiful work deserves to be seen.',
  email: 'info@torqpoint.com',
  priceRange: '££',
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
  sameAs: ['https://www.instagram.com/torqpoint.co/'],
  knowsAbout: [
    'Content marketing',
    'Social media management',
    'Content creation for small businesses',
    'Marketing for trades and makers',
  ],
  makesOffer: [
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Social media content and management' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Blog and journal articles' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Email newsletters' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Google Business Profile posts' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Website design and build' } },
  ],
};

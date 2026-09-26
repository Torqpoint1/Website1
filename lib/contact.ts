/**
 * Single source for direct contact routes. Phone and WhatsApp render
 * everywhere (nav, footer, contact, pricing, schema) only once PHONE_E164
 * is filled in — leave both empty rather than publishing a placeholder.
 */
export const EMAIL = 'info@torqpoint.com';

/** International format, digits only after the plus, e.g. '+447700900000'. */
export const PHONE_E164 = '';
/** How the number is printed on the page, e.g. '07700 900000'. */
export const PHONE_DISPLAY = '';

const WHATSAPP_TEXT = 'Hi Torqpoint — saw your site';

export const hasPhone = PHONE_E164.length > 0;

export const telHref = `tel:${PHONE_E164}`;

export const whatsappHref = `https://wa.me/${PHONE_E164.replace(/\D/g, '')}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

export const INSTAGRAM_URL = 'https://instagram.com/torqpoint.co';

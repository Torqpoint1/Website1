import type { Metadata } from 'next';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ContactForm } from '@/components/ContactForm';
import { DirectContact } from '@/components/offer/DirectContact';
import { EMAIL, INSTAGRAM_URL, PHONE_DISPLAY, hasPhone, telHref } from '@/lib/contact';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const metadata: Metadata = pageMetadata({
  path: '/contact/',
  title: 'Contact — book a call',
  description:
    'Book a call with Torqpoint. Tell us about your trade business in a few lines — we reply the same working day if you get in touch before 4pm.',
});

export default function ContactPage() {
  return (
    <>
      <div className={styles.pageHeader}>
        <div className="container">
          <ScrollReveal stagger>
            <p className="eyebrow">
              <span className="point point--sm" aria-hidden="true" />
              Contact
            </p>
            <h1 className={styles.pageTitle}>Tell us about the business.</h1>
            <p className={styles.pageIntro}>
              A few lines is plenty. We&rsquo;ll come back to you personally — no call
              centre, no bot, no hard sell. Rather talk? {hasPhone ? 'Call or WhatsApp.' : 'Email is fine too.'}
            </p>
          </ScrollReveal>
        </div>
      </div>

      <section className="section" aria-labelledby="contact-form-heading">
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.formCol}>
              <h2 id="contact-form-heading" className={styles.srOnly}>Enquiry form</h2>
              <ContactForm />
            </div>

            <aside className={styles.infoCol} aria-label="Contact information">
              <ScrollReveal stagger>
                {hasPhone && (
                  <div className={`${styles.infoBlock} ${styles.directBlock}`}>
                    <p className={styles.infoLabel}>Quickest way</p>
                    <p className={styles.infoValue}>
                      {hasPhone
                        ? 'In the van? Send a WhatsApp or give us a ring — whichever’s easier.'
                        : 'Drop us an email with a line or two about the business.'}
                    </p>
                    <DirectContact place="contact" />
                  </div>
                )}
                {hasPhone && (
                  <div className={styles.infoBlock}>
                    <p className={styles.infoLabel}>Phone</p>
                    <a href={telHref} className={styles.infoLink} data-track-place="contact-info">
                      {PHONE_DISPLAY}
                    </a>
                  </div>
                )}
                <div className={styles.infoBlock}>
                  <p className={styles.infoLabel}>Email</p>
                  <a href={`mailto:${EMAIL}`} className={styles.infoLink}>
                    {EMAIL}
                  </a>
                </div>
                <div className={styles.infoBlock}>
                  <p className={styles.infoLabel}>Based in</p>
                  <p className={styles.infoValue}>Gloucestershire, UK</p>
                </div>
                <div className={styles.infoBlock}>
                  <p className={styles.infoLabel}>Working with</p>
                  <p className={styles.infoValue}>
                    Established trades across Gloucestershire and the Cotswolds —
                    bathrooms, kitchens, landscaping, joinery, roofing and extensions.
                  </p>
                </div>
                <div className={styles.infoBlock}>
                  <p className={styles.infoLabel}>Instagram</p>
                  <a
                    href={INSTAGRAM_URL}
                    className={styles.infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @torqpoint.co
                  </a>
                </div>
              </ScrollReveal>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

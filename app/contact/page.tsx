import type { Metadata } from 'next';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ContactForm } from '@/components/ContactForm';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Tell us about your work. A few lines is plenty to get started.',
};

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
            <h1 className={styles.pageTitle}>Tell us about your work.</h1>
            <p className={styles.pageIntro}>
              A few lines is plenty to get started. We&rsquo;ll come back to you
              personally — no call centre, no bot.
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
                <div className={styles.infoBlock}>
                  <p className={styles.infoLabel}>Email</p>
                  <a href="mailto:info@torqpoint.com" className={styles.infoLink}>
                    info@torqpoint.com
                  </a>
                </div>
                <div className={styles.infoBlock}>
                  <p className={styles.infoLabel}>Based in</p>
                  <p className={styles.infoValue}>Gloucestershire, UK</p>
                </div>
                <div className={styles.infoBlock}>
                  <p className={styles.infoLabel}>Working with</p>
                  <p className={styles.infoValue}>
                    Businesses across Gloucestershire that want to look as good
                    online as the work they do.
                  </p>
                </div>
                <div className={styles.infoBlock}>
                  <p className={styles.infoLabel}>Instagram</p>
                  <a
                    href="https://instagram.com/torqpoint.co"
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

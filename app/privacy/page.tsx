import type { Metadata } from 'next';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ScrollReveal';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Torqpoint collects, uses and protects the information you share through this website.',
  alternates: { canonical: '/privacy/' },
};

const LAST_UPDATED = '26 June 2026';

export default function PrivacyPage() {
  return (
    <>
      {/* ── Header ──────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div className="container">
          <ScrollReveal stagger>
            <p className="eyebrow">
              <span className="point point--sm" aria-hidden="true" />
              Privacy
            </p>
            <h1 className={styles.pageTitle}>Privacy Policy</h1>
            <p className={styles.updated}>Last updated: {LAST_UPDATED}</p>
          </ScrollReveal>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────── */}
      <section className={`section ${styles.bodySection}`} aria-label="Privacy policy">
        <div className="container">
          <div className={styles.prose}>
            <p className={styles.lead}>
              This policy explains what information Torqpoint collects when you use
              this website, why we collect it, and how it&rsquo;s kept safe. We keep it
              plain and we keep it short — because we collect very little.
            </p>

            <h2>Who we are</h2>
            <p>
              Torqpoint is a content &amp; marketing studio based in Gloucestershire,
              United Kingdom. For any privacy question, or to ask us to update or delete
              your information, email{' '}
              <a href="mailto:info@torqpoint.com">info@torqpoint.com</a>.
            </p>

            <h2>What we collect</h2>
            <p>
              The only personal information we collect is what you choose to send us
              through our contact form:
            </p>
            <ul>
              <li>Your name</li>
              <li>Your business name</li>
              <li>Your email address</li>
              <li>Anything you write in the message field</li>
            </ul>
            <p>
              We do not ask for, or store, any payment details, passwords or sensitive
              personal information on this website.
            </p>

            <h2>How we use it</h2>
            <p>
              We use the details you send for one purpose: to reply to your enquiry and,
              if you go on to work with us, to deliver the work you&rsquo;ve asked for.
              We don&rsquo;t sell your information, and we don&rsquo;t share it with
              anyone for marketing.
            </p>

            <h2>How your enquiry reaches us</h2>
            <p>
              When you submit the contact form, it is delivered to us by email through a
              third-party form service,{' '}
              <a href="https://web3forms.com/privacy" target="_blank" rel="noopener noreferrer">
                Web3Forms
              </a>
              . Your details pass securely through their system purely so the message can
              reach our inbox. We&rsquo;d encourage you to read their privacy policy if
              you&rsquo;d like to know how they handle data in transit.
            </p>

            <h2>Cookies and tracking</h2>
            <p>
              This website does not use tracking or advertising cookies, and we
              don&rsquo;t build a profile of you as you browse. If we add analytics in
              the future to understand which pages are useful, we&rsquo;ll update this
              policy first.
            </p>

            <h2>How long we keep it</h2>
            <p>
              We keep enquiry emails only for as long as we need them — to answer you and
              to keep a record of work we&rsquo;ve discussed or done together. You can ask
              us to delete your information at any time and we&rsquo;ll do so, unless we
              are legally required to keep it.
            </p>

            <h2>Your rights</h2>
            <p>
              Under UK data protection law you have the right to ask what information we
              hold about you, to have it corrected or deleted, and to object to how we
              use it. To exercise any of these, just email{' '}
              <a href="mailto:info@torqpoint.com">info@torqpoint.com</a> and we&rsquo;ll
              sort it out. If you&rsquo;re ever unhappy with how we&rsquo;ve handled your
              data, you can also contact the UK&rsquo;s Information Commissioner&rsquo;s
              Office (ICO) at{' '}
              <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
                ico.org.uk
              </a>
              .
            </p>

            <h2>Changes to this policy</h2>
            <p>
              If we change how we handle your information, we&rsquo;ll update this page
              and change the &ldquo;last updated&rdquo; date at the top. This is the
              current version.
            </p>

            <p className={styles.footNote}>
              Questions about any of this? Just{' '}
              <Link href="/contact">get in touch</Link> — we&rsquo;re happy to explain.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

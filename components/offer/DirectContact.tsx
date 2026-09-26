import { EMAIL, PHONE_DISPLAY, hasPhone, telHref, whatsappHref } from '@/lib/contact';
import styles from './DirectContact.module.css';

/**
 * Phone + WhatsApp buttons for trades who'd rather not fill in a form.
 * Falls back to email until a number is configured in lib/contact.ts.
 */
export function DirectContact({
  tone = 'light',
  place,
}: {
  tone?: 'light' | 'dark' | 'forge';
  place: string;
}) {
  return (
    <div className={`${styles.row} ${styles[tone]}`}>
      {hasPhone ? (
        <>
          <a href={whatsappHref} className={`${styles.btn} ${styles.wa}`} data-track-place={place} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            WhatsApp us
          </a>
          <a href={telHref} className={styles.btn} data-track-place={place}>
            <PhoneIcon />
            {PHONE_DISPLAY}
          </a>
        </>
      ) : (
        <a href={`mailto:${EMAIL}`} className={styles.btn} data-track="email_click" data-track-place={place}>
          <MailIcon />
          {EMAIL}
        </a>
      )}
    </div>
  );
}

export function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? styles.icon} aria-hidden="true">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="currentColor" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? styles.icon} aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3 .78.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.25-.12-1.46-.72-1.69-.8s-.39-.12-.55.12-.63.8-.78.96-.29.19-.53.06a6.7 6.7 0 0 1-3.34-2.92c-.25-.43.25-.4.72-1.33a.46.46 0 0 0-.02-.43c-.06-.12-.55-1.33-.76-1.82s-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.85 2.03 4.76 4.76 0 0 0 1 2.52 10.9 10.9 0 0 0 4.17 3.68c1.55.67 2.16.73 2.93.61a2.5 2.5 0 0 0 1.65-1.16 2.04 2.04 0 0 0 .14-1.16c-.06-.1-.22-.16-.47-.28z" fill="currentColor" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm8 7.2L4.8 7h14.4L12 12.2zM5 8.3V17h14V8.3l-7 5-7-5z" fill="currentColor" />
    </svg>
  );
}

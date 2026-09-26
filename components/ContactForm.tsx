'use client';

import { useEffect, useState, FormEvent } from 'react';
import { trackEvent } from '@/lib/track';
import styles from './ContactForm.module.css';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const TRADES = ['Bathrooms', 'Kitchens', 'Landscaping', 'Joinery', 'Roofing', 'Extensions', 'Other'];

const INTERESTS = [
  { value: 'One job written up (Job Story)', key: 'job-story' },
  { value: 'Monthly content (Engine)', key: 'engine' },
  { value: 'Not sure yet', key: 'not-sure' },
];

const SOURCES = ['Google', 'Instagram', 'A recommendation', 'Met you', 'Other'];

export function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [interest, setInterest] = useState('');

  /* Product pages link here with ?interest=job-story|engine */
  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get('interest');
    const match = INTERESTS.find(i => i.key === key);
    if (match) setInterest(match.value);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setState('submitting');
    setErrorMsg('');

    const data = new FormData(form);
    data.set('subject', `New enquiry — ${data.get('trade') ?? 'trade'} · ${data.get('interest') ?? ''}`);

    // Also drop the enquiry into the Torqpoint CRM as a new lead.
    // Only active when NEXT_PUBLIC_CRM_ENQUIRY_URL is set; failures are
    // silent so the visitor's enquiry always goes through via email.
    const crmUrl = process.env.NEXT_PUBLIC_CRM_ENQUIRY_URL;
    if (crmUrl) {
      fetch(crmUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          business: data.get('business'),
          phone: data.get('phone'),
          email: data.get('email'),
          trade: data.get('trade'),
          interest: data.get('interest'),
          source: data.get('source'),
          message: data.get('message'),
          botcheck: data.get('botcheck'),
        }),
      }).catch(() => {});
    }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      if (json.success) {
        trackEvent('enquiry_submitted', {
          trade: String(data.get('trade') ?? ''),
          interest: String(data.get('interest') ?? ''),
          source: String(data.get('source') ?? ''),
        });
        setState('success');
        form.reset();
      } else {
        throw new Error(json.message ?? 'Submission failed');
      }
    } catch (err) {
      setState('error');
      setErrorMsg(
        err instanceof Error ? err.message : 'Something went wrong. Please email us directly.'
      );
    }
  }

  if (state === 'success') {
    return (
      <div className={styles.success} role="status" aria-live="polite">
        <div className={styles.successIcon} aria-hidden="true">
          <span className="point" style={{ width: 20, height: 20 }} />
        </div>
        <h3 className={styles.successTitle}>Enquiry sent.</h3>
        <p className={styles.successDesc}>
          Thanks — we&rsquo;ve got it. We read every enquiry ourselves, and you&rsquo;ll
          hear back the same working day if you sent it before 4pm.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {/* Web3Forms access key — replace with your key from web3forms.com */}
      <input type="hidden" name="access_key" value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? 'YOUR_WEB3FORMS_ACCESS_KEY'} />
      <input type="hidden" name="subject" value="New enquiry from Torqpoint website" />
      <input type="hidden" name="from_name" value="Torqpoint Website" />
      {/* Honeypot */}
      <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />

      <div className={styles.fields}>
        <div className={styles.pair}>
          <div className="form-field">
            <label htmlFor="name">Your name</label>
            <input type="text" id="name" name="name" autoComplete="name" required placeholder="Dave Harris" />
          </div>
          <div className="form-field">
            <label htmlFor="business">Business name</label>
            <input type="text" id="business" name="business" autoComplete="organization" required placeholder="Harris Bathrooms Ltd" />
          </div>
        </div>

        <div className={styles.pair}>
          <div className="form-field">
            <label htmlFor="phone">Phone</label>
            <input type="tel" id="phone" name="phone" autoComplete="tel" inputMode="tel" required placeholder="07700 900000" />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" autoComplete="email" required placeholder="dave@harrisbathrooms.co.uk" />
          </div>
        </div>

        <div className={styles.pair}>
          <div className="form-field">
            <label htmlFor="trade">What do you do?</label>
            <div className={styles.selectWrap}>
              <select id="trade" name="trade" required defaultValue="">
                <option value="" disabled>Choose your trade</option>
                {TRADES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="interest">What are you after?</label>
            <div className={styles.selectWrap}>
              <select
                id="interest"
                name="interest"
                required
                value={interest}
                onChange={e => setInterest(e.target.value)}
              >
                <option value="" disabled>Choose one</option>
                {INTERESTS.map(i => <option key={i.key} value={i.value}>{i.value}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="message">Tell us about the business</label>
          <textarea
            id="message"
            name="message"
            required
            placeholder="How many are you, what sort of jobs, and what you're trying to fix. A few lines is plenty."
          />
        </div>

        <div className="form-field">
          <label htmlFor="source">How did you hear about us?</label>
          <div className={styles.selectWrap}>
            <select id="source" name="source" defaultValue="">
              <option value="">Choose one (optional)</option>
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {state === 'error' && (
        <p className={styles.error} role="alert">{errorMsg}</p>
      )}

      <p className={styles.promise}>
        <span className={styles.promiseDot} aria-hidden="true" />
        We read every enquiry ourselves. You&rsquo;ll get a reply the same working day
        if you send it before 4pm.
      </p>

      <button
        type="submit"
        className={`btn btn-primary ${styles.submit}`}
        disabled={state === 'submitting'}
        aria-busy={state === 'submitting'}
      >
        {state === 'submitting' ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  );
}

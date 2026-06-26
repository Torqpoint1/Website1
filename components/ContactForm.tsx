'use client';

import { useState, FormEvent } from 'react';
import styles from './ContactForm.module.css';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('submitting');
    setErrorMsg('');

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      if (json.success) {
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
          Thanks for getting in touch. We&rsquo;ll come back to you personally —
          usually within one working day.
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
        <div className="form-field">
          <label htmlFor="name">Your name</label>
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            required
            placeholder="Jane Smith"
          />
        </div>

        <div className="form-field">
          <label htmlFor="business">Your business</label>
          <input
            type="text"
            id="business"
            name="business"
            required
            placeholder="Smith Builders"
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            placeholder="jane@smithbuilders.co.uk"
          />
        </div>

        <div className="form-field">
          <label htmlFor="message">Tell us about your business</label>
          <textarea
            id="message"
            name="message"
            required
            placeholder="What do you do, what kind of content are you after, and anything else that's useful — a few lines is plenty."
          />
        </div>
      </div>

      {state === 'error' && (
        <p className={styles.error} role="alert">{errorMsg}</p>
      )}

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

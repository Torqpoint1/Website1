import { useEffect, useState, type FormEvent } from 'react';
import { db } from '../lib/supabase';
import { getSettings } from '../lib/money';
import type { CompanySettings } from '../lib/types';
import PointLoader from '../components/PointLoader';

export default function Settings() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load.'));
  }, []);

  if (error) return <p className="p-6 text-sm text-forge">{error}</p>;
  if (!settings) return <PointLoader label="Loading settings" />;

  function patch(p: Partial<CompanySettings>) {
    setSettings((s) => (s ? { ...s, ...p } : s));
    setSaved(false);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { id, ...payload } = settings!;
    const { error: err } = await db()
      .from('company_settings')
      .update(payload)
      .eq('id', id);
    setBusy(false);
    if (err) setError(err.message);
    else setSaved(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-8 sm:px-8 lg:py-12">
      <h1 className="pb-8 font-editorial text-4xl tracking-tight">Settings</h1>

      <form onSubmit={submit} className="flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <SectionHead label="Business" />
          <Field label="Business name">
            <input
              className="field"
              value={settings.business_name}
              onChange={(e) => patch({ business_name: e.target.value })}
            />
          </Field>
          <Field label="Address (shown on quotes & invoices)">
            <textarea
              className="field min-h-20"
              value={settings.address ?? ''}
              onChange={(e) => patch({ address: e.target.value })}
            />
          </Field>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHead label="VAT" />
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.vat_registered}
              onChange={(e) => patch({ vat_registered: e.target.checked })}
              className="h-4 w-4 accent-[#EE5A1E]"
            />
            <span className="text-sm font-semibold">VAT registered</span>
            <span className="text-sm text-slate">
              — off by default; flip on when you register, nothing else changes.
            </span>
          </label>
          {settings.vat_registered && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="VAT number">
                <input
                  className="field"
                  value={settings.vat_number ?? ''}
                  onChange={(e) => patch({ vat_number: e.target.value })}
                />
              </Field>
              <Field label="VAT rate %">
                <input
                  type="number"
                  step="0.1"
                  className="field"
                  value={settings.vat_rate}
                  onChange={(e) => patch({ vat_rate: Number(e.target.value) })}
                />
              </Field>
            </div>
          )}
        </section>

        <section className="flex flex-col gap-4">
          <SectionHead label="Getting paid" />
          <Field label="Bank details (printed on invoices)">
            <textarea
              className="field min-h-20"
              placeholder={'Account name\nSort code · Account number'}
              value={settings.bank_details ?? ''}
              onChange={(e) => patch({ bank_details: e.target.value })}
            />
          </Field>
          <Field label="Payment link (optional)">
            <input
              className="field"
              placeholder="e.g. a Stripe or Monzo link"
              value={settings.payment_link ?? ''}
              onChange={(e) => patch({ payment_link: e.target.value })}
            />
          </Field>
          <Field label="Payment terms">
            <input
              className="field"
              value={settings.payment_terms}
              onChange={(e) => patch({ payment_terms: e.target.value })}
            />
          </Field>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHead label="Numbering" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Invoice prefix">
              <input
                className="field"
                value={settings.invoice_prefix}
                onChange={(e) => patch({ invoice_prefix: e.target.value })}
              />
            </Field>
            <Field label="Next invoice #">
              <input
                type="number"
                min="1"
                className="field"
                value={settings.next_invoice_number}
                onChange={(e) => patch({ next_invoice_number: Number(e.target.value) })}
              />
            </Field>
            <Field label="Quote prefix">
              <input
                className="field"
                value={settings.quote_prefix}
                onChange={(e) => patch({ quote_prefix: e.target.value })}
              />
            </Field>
            <Field label="Next quote #">
              <input
                type="number"
                min="1"
                className="field"
                value={settings.next_quote_number}
                onChange={(e) => patch({ next_quote_number: Number(e.target.value) })}
              />
            </Field>
          </div>
        </section>

        {error && <p className="text-sm text-forge">{error}</p>}
        <div>
          <button type="submit" disabled={busy} className="btn-forge">
            {busy ? 'Saving…' : saved ? 'Saved ✓' : 'Save settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

function SectionHead({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="point" aria-hidden />
      <h2 className="label-caps text-slate">{label}</h2>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="label-caps text-slate">{label}</span>
      {children}
    </label>
  );
}

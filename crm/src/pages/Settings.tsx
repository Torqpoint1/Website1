import { useEffect, useState, type FormEvent } from 'react';
import { db } from '../lib/supabase';
import { getSettings } from '../lib/money';
import { downloadBackup } from '../lib/backup';
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
    let { error: err } = await db()
      .from('company_settings')
      .update(payload)
      .eq('id', id);
    // Price list column not switched on yet — save everything else.
    if (err?.code === '42703' && 'price_list' in payload) {
      const { price_list: _pl, ...rest } = payload;
      ({ error: err } = await db()
        .from('company_settings')
        .update(rest)
        .eq('id', id));
      if (!err) {
        setError(
          'Saved — except the price list, which needs a small database paste from Claude first.',
        );
        setBusy(false);
        return;
      }
    }
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
          <SectionHead label="Price list" />
          <p className="-mt-2 text-sm text-slate">
            Your standard services and prices — one tap adds them as line items
            when building quotes and invoices.
          </p>
          {(settings.price_list ?? []).map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                aria-label="Service"
                className="field flex-1"
                placeholder="e.g. Case study — written & designed"
                value={item.description}
                onChange={(e) =>
                  patch({
                    price_list: (settings.price_list ?? []).map((x, idx) =>
                      idx === i ? { ...x, description: e.target.value } : x,
                    ),
                  })
                }
              />
              <input
                aria-label="Price"
                inputMode="decimal"
                className="field w-28"
                placeholder="£"
                value={item.unit_price === 0 ? '' : String(item.unit_price)}
                onChange={(e) =>
                  patch({
                    price_list: (settings.price_list ?? []).map((x, idx) =>
                      idx === i
                        ? { ...x, unit_price: Number(e.target.value) || 0 }
                        : x,
                    ),
                  })
                }
              />
              <button
                type="button"
                aria-label="Remove"
                onClick={() =>
                  patch({
                    price_list: (settings.price_list ?? []).filter(
                      (_, idx) => idx !== i,
                    ),
                  })
                }
                className="px-1 text-slate transition-colors hover:text-forge"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              patch({
                price_list: [
                  ...(settings.price_list ?? []),
                  { description: '', unit_price: 0 },
                ],
              })
            }
            className="label-caps self-start text-forge"
          >
            + Add service
          </button>
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

      <BackupSection />
    </div>
  );
}

function BackupSection() {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [detail, setDetail] = useState('');

  async function run() {
    setState('busy');
    try {
      const { rows } = await downloadBackup();
      setDetail(`${rows.toLocaleString('en-GB')} records saved`);
      setState('done');
    } catch (err) {
      setDetail(err instanceof Error ? err.message : 'Export failed.');
      setState('error');
    }
  }

  return (
    <section className="mt-14 rounded-xl border border-line bg-white p-5">
      <div className="flex items-center gap-2.5 pb-3">
        <span className="point" aria-hidden />
        <h2 className="label-caps text-slate">Backup</h2>
      </div>
      <p className="max-w-xl pb-4 text-sm leading-relaxed text-slate">
        Downloads everything — clients, contacts, deals, projects,
        deliverables, follow-ups, the full activity history, quotes, invoices,
        retainers and these settings — as one dated file. Tap it monthly and
        keep the file somewhere safe; it's your copy of the business, whatever
        happens.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={state === 'busy'}
          className="btn-primary"
        >
          {state === 'busy' ? 'Gathering everything…' : 'Download backup'}
        </button>
        {state === 'done' && (
          <span className="text-sm font-semibold text-graphite">✓ {detail}</span>
        )}
        {state === 'error' && <span className="text-sm text-forge">{detail}</span>}
      </div>
    </section>
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

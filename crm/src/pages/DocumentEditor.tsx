import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { db } from '../lib/supabase';
import { logSystemActivity } from '../lib/actions';
import {
  computeTotals,
  convertQuoteToInvoice,
  getSettings,
  markInvoicePaid,
  nextInvoiceNumber,
  nextQuoteNumber,
} from '../lib/money';
import { money } from '../lib/format';
import type {
  Account,
  CompanySettings,
  Invoice,
  InvoiceStatus,
  LineItem,
  Quote,
  QuoteStatus,
} from '../lib/types';
import PointLoader from '../components/PointLoader';
import Modal from '../components/Modal';

type Kind = 'quote' | 'invoice';

interface DocState {
  id: string | null;
  number: string;
  account_id: string;
  status: QuoteStatus | InvoiceStatus;
  line_items: LineItem[];
  issue_date: string;
  due_date: string;
}

const EMPTY_ITEM: LineItem = { description: '', qty: 1, unit_price: 0, line_total: 0 };

export default function DocumentEditor({ kind }: { kind: Kind }) {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [doc, setDoc] = useState<DocState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const table = kind === 'quote' ? 'quotes' : 'invoices';

  const load = useCallback(async () => {
    try {
      const [stg, acc] = await Promise.all([
        getSettings(),
        db().from('accounts').select('*').order('name'),
      ]);
      setSettings(stg);
      setAccounts((acc.data ?? []) as Account[]);

      if (id) {
        const { data, error: err } = await db()
          .from(table)
          .select('*')
          .eq('id', id)
          .single();
        if (err) throw err;
        setDoc({
          id: data.id,
          number: data.number,
          account_id: data.account_id,
          status: data.status,
          line_items:
            (data.line_items as LineItem[])?.length > 0
              ? (data.line_items as LineItem[])
              : [{ ...EMPTY_ITEM }],
          issue_date: data.issue_date ?? data.sent_date ?? '',
          due_date: data.due_date ?? '',
        });
      } else {
        const today = new Date().toISOString().slice(0, 10);
        const due = new Date();
        due.setDate(due.getDate() + 14);
        setDoc({
          id: null,
          number: '',
          account_id: params.get('account') ?? '',
          status: 'draft',
          line_items: [{ ...EMPTY_ITEM }],
          issue_date: today,
          due_date: due.toISOString().slice(0, 10),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load.');
    }
  }, [id, table, params]);

  useEffect(() => {
    load();
  }, [load]);

  const totals = useMemo(
    () =>
      doc && settings
        ? computeTotals(doc.line_items, settings)
        : { subtotal: 0, vat_amount: 0, total: 0 },
    [doc, settings],
  );

  if (error) return <p className="p-6 text-sm text-forge">{error}</p>;
  if (!doc || !settings) return <PointLoader label="Loading" />;

  function patchItem(index: number, patch: Partial<LineItem>) {
    setDoc((d) => {
      if (!d) return d;
      const items = d.line_items.map((item, i) => {
        if (i !== index) return item;
        const next = { ...item, ...patch };
        next.line_total =
          Math.round(Number(next.qty) * Number(next.unit_price) * 100) / 100;
        return next;
      });
      return { ...d, line_items: items };
    });
  }

  async function save(overrides: Partial<DocState> = {}): Promise<string | null> {
    if (!doc!.account_id) {
      setError('Choose a client first.');
      return null;
    }
    setBusy(true);
    setError(null);
    try {
      const state = { ...doc!, ...overrides };
      const items = state.line_items.filter((i) => i.description.trim() !== '');
      const t = computeTotals(items, settings!);
      let docId = state.id;

      if (!docId) {
        const number =
          kind === 'quote' ? await nextQuoteNumber() : await nextInvoiceNumber();
        const payload: Record<string, unknown> = {
          account_id: state.account_id,
          number,
          line_items: items,
          ...t,
          status: state.status,
        };
        if (kind === 'invoice') {
          payload.issue_date = state.issue_date || null;
          payload.due_date = state.due_date || null;
          payload.pricing_type = 'one_off';
        }
        const { data, error: err } = await db()
          .from(table)
          .insert(payload)
          .select('id, number')
          .single();
        if (err) throw err;
        docId = data.id;
        setDoc({ ...state, id: data.id, number: data.number, line_items: items });
        await logSystemActivity(
          state.account_id,
          `${kind === 'quote' ? 'Quote' : 'Invoice'} ${data.number} created`,
        );
      } else {
        const payload: Record<string, unknown> = {
          account_id: state.account_id,
          line_items: items,
          ...t,
          status: state.status,
        };
        if (kind === 'invoice') {
          payload.issue_date = state.issue_date || null;
          payload.due_date = state.due_date || null;
        } else if (state.status === 'sent') {
          payload.sent_date = state.issue_date || null;
        }
        const { error: err } = await db().from(table).update(payload).eq('id', docId);
        if (err) throw err;
        setDoc({ ...state, line_items: items.length ? items : [{ ...EMPTY_ITEM }] });
      }
      setSavedAt(Date.now());
      return docId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function saveAndGo(status?: DocState['status']) {
    const docId = await save(status ? { status } : {});
    if (docId && isNew) navigate(`/money/${kind}s/${docId}`, { replace: true });
  }

  async function convert() {
    const docId = await save({ status: 'accepted' });
    if (!docId) return;
    const { data } = await db().from('quotes').select('*').eq('id', docId).single();
    const invoiceId = await convertQuoteToInvoice(data as Quote);
    navigate(`/money/invoices/${invoiceId}`);
  }

  async function paid() {
    const docId = await save();
    if (!docId) return;
    const { data } = await db().from('invoices').select('*').eq('id', docId).single();
    await markInvoicePaid(data as Invoice);
    navigate('/money');
  }

  async function removeDoc() {
    if (!doc!.id) return;
    await db().from(table).delete().eq('id', doc!.id);
    navigate('/money');
  }

  async function duplicate() {
    if (!doc!.id) return;
    setBusy(true);
    try {
      const number =
        kind === 'quote' ? await nextQuoteNumber() : await nextInvoiceNumber();
      const t = computeTotals(doc!.line_items, settings!);
      const payload: Record<string, unknown> = {
        account_id: doc!.account_id,
        number,
        line_items: doc!.line_items,
        ...t,
        status: 'draft',
      };
      if (kind === 'invoice') {
        const today = new Date();
        const due = new Date();
        due.setDate(due.getDate() + 14);
        payload.issue_date = today.toISOString().slice(0, 10);
        payload.due_date = due.toISOString().slice(0, 10);
        payload.pricing_type = 'one_off';
      }
      const { data, error: err } = await db()
        .from(table)
        .insert(payload)
        .select('id')
        .single();
      if (err) throw err;
      navigate(`/money/${kind}s/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not duplicate.');
    } finally {
      setBusy(false);
    }
  }

  const title = doc.number
    ? `${kind === 'quote' ? 'Quote' : 'Invoice'} ${doc.number}`
    : `New ${kind}`;

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 lg:py-12">
      <Link to="/money" className="label-caps text-slate hover:text-graphite">
        ← Finance
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 pb-8">
        <h1 className="font-editorial text-4xl tracking-tight">{title}</h1>
        <span className="label-caps rounded-full border border-graphite/25 px-2 py-1 text-slate">
          {doc.status}
        </span>
      </div>

      <div className="flex flex-col gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="label-caps text-slate">Client</span>
          <select
            className="field"
            value={doc.account_id}
            onChange={(e) => setDoc({ ...doc, account_id: e.target.value })}
            disabled={!isNew}
          >
            <option value="" disabled>
              Choose a business…
            </option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>

        {kind === 'invoice' && (
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="label-caps text-slate">Issue date</span>
              <input
                type="date"
                className="field"
                value={doc.issue_date}
                onChange={(e) => setDoc({ ...doc, issue_date: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="label-caps text-slate">Due date</span>
              <input
                type="date"
                className="field"
                value={doc.due_date}
                onChange={(e) => setDoc({ ...doc, due_date: e.target.value })}
              />
            </label>
          </div>
        )}

        {/* Line items */}
        <div>
          <div className="flex items-center gap-2.5 pb-3">
            <span className="point" aria-hidden />
            <h2 className="label-caps text-slate">Line items</h2>
          </div>
          <div className="card divide-y divide-line">
            <div className="hidden grid-cols-[1fr_4.5rem_6rem_6rem_2rem] gap-2 px-4 py-2 sm:grid">
              {['Description', 'Qty', 'Unit £', 'Total', ''].map((h) => (
                <span key={h} className="label-caps text-slate">
                  {h}
                </span>
              ))}
            </div>
            {doc.line_items.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-2 gap-2 px-4 py-3 sm:grid-cols-[1fr_4.5rem_6rem_6rem_2rem] sm:items-center"
              >
                <input
                  aria-label="Description"
                  className="field col-span-2 sm:col-span-1"
                  placeholder="What's being charged for"
                  value={item.description}
                  onChange={(e) => patchItem(i, { description: e.target.value })}
                />
                <input
                  aria-label="Quantity"
                  type="number"
                  min="0"
                  step="any"
                  className="field"
                  value={item.qty}
                  onChange={(e) => patchItem(i, { qty: Number(e.target.value) })}
                />
                <input
                  aria-label="Unit price"
                  type="number"
                  min="0"
                  step="0.01"
                  className="field"
                  value={item.unit_price}
                  onChange={(e) =>
                    patchItem(i, { unit_price: Number(e.target.value) })
                  }
                />
                <span className="self-center text-sm font-semibold">
                  {money(item.line_total)}
                </span>
                <button
                  type="button"
                  aria-label="Remove line"
                  onClick={() =>
                    setDoc({
                      ...doc,
                      line_items:
                        doc.line_items.length > 1
                          ? doc.line_items.filter((_, x) => x !== i)
                          : [{ ...EMPTY_ITEM }],
                    })
                  }
                  className="justify-self-end text-slate transition-colors hover:text-forge"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              setDoc({ ...doc, line_items: [...doc.line_items, { ...EMPTY_ITEM }] })
            }
            className="label-caps pt-3 text-forge"
          >
            + Add line
          </button>
        </div>

        {/* Totals */}
        <div className="ml-auto w-full max-w-xs border-t border-graphite pt-3">
          <div className="flex justify-between py-1 text-sm">
            <span className="text-slate">Subtotal</span>
            <span>{money(totals.subtotal)}</span>
          </div>
          {settings.vat_registered && (
            <div className="flex justify-between py-1 text-sm">
              <span className="text-slate">VAT {Number(settings.vat_rate)}%</span>
              <span>{money(totals.vat_amount)}</span>
            </div>
          )}
          <div className="flex items-baseline justify-between py-1">
            <span className="label-caps text-slate">Total</span>
            <span className="font-editorial text-3xl">{money(totals.total)}</span>
          </div>
        </div>

        {error && <p className="text-sm text-forge">{error}</p>}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 border-t border-line pt-5">
          <button type="button" disabled={busy} onClick={() => saveAndGo()} className="btn-primary">
            {busy ? 'Saving…' : savedAt && Date.now() - savedAt < 2500 ? 'Saved ✓' : 'Save'}
          </button>
          {doc.status === 'draft' && (
            <button
              type="button"
              disabled={busy}
              onClick={() => saveAndGo('sent')}
              className="btn-forge"
            >
              Mark sent
            </button>
          )}
          {kind === 'quote' && (doc.status === 'sent' || doc.status === 'accepted') && (
            <>
              <button type="button" disabled={busy} onClick={convert} className="btn-forge">
                Accepted → invoice
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => saveAndGo('declined')}
                className="btn-ghost"
              >
                Declined
              </button>
            </>
          )}
          {kind === 'invoice' && doc.status !== 'paid' && !isNew && (
            <button type="button" disabled={busy} onClick={paid} className="btn-forge">
              Mark paid
            </button>
          )}
          {!isNew && (
            <Link to={`/print/${kind}/${doc.id}`} className="btn-ghost">
              Print / PDF
            </Link>
          )}
          {!isNew && (
            <button type="button" disabled={busy} onClick={duplicate} className="btn-ghost">
              Duplicate
            </button>
          )}
          {!isNew && (
            <button
              type="button"
              onClick={() => setDeleting(true)}
              className="btn-ghost ml-auto text-slate hover:border-forge hover:text-forge"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {deleting && (
        <Modal title={`Delete ${kind}`} onClose={() => setDeleting(false)}>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate">
              Delete {doc.number || `this ${kind}`} for good? The number won't be
              reused.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={removeDoc} className="btn-forge flex-1">
                Delete
              </button>
              <button type="button" onClick={() => setDeleting(false)} className="btn-ghost">
                Keep it
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

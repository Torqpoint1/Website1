import { useState, type FormEvent } from 'react';
import Modal from './Modal';
import { db } from '../lib/supabase';
import { logSystemActivity } from '../lib/actions';
import type { Deal, PricingType } from '../lib/types';

export default function DealModal({
  deal,
  onClose,
  onSaved,
}: {
  deal: Deal;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(deal.title);
  const [value, setValue] = useState(deal.value != null ? String(deal.value) : '');
  const [pricingType, setPricingType] = useState<PricingType>(deal.pricing_type);
  const [monthly, setMonthly] = useState(
    deal.monthly_amount != null ? String(deal.monthly_amount) : '',
  );
  const [closeDate, setCloseDate] = useState(deal.expected_close_date ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const num = (v: string) => {
      const n = Number(v);
      return v.trim() !== '' && Number.isFinite(n) ? n : null;
    };
    const { error: err } = await db()
      .from('deals')
      .update({
        title: title.trim(),
        value: num(value),
        pricing_type: pricingType,
        monthly_amount: pricingType === 'retainer' ? num(monthly) : null,
        expected_close_date: closeDate || null,
      })
      .eq('id', deal.id);
    if (err) {
      setError(err.message);
      setBusy(false);
      return;
    }
    await logSystemActivity(deal.account_id, `Deal “${title.trim()}” updated`);
    onSaved();
    onClose();
  }

  async function remove() {
    setBusy(true);
    await db()
      .from('tasks')
      .delete()
      .eq('related_type', 'deal')
      .eq('related_id', deal.id);
    const { error: err } = await db().from('deals').delete().eq('id', deal.id);
    if (err) {
      setError(err.message);
      setBusy(false);
      return;
    }
    await logSystemActivity(deal.account_id, `Deal “${deal.title}” deleted`);
    onSaved();
    onClose();
  }

  return (
    <Modal title="Edit deal" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="label-caps text-slate">Title</span>
          <input
            required
            className="field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="label-caps text-slate">Value (£)</span>
            <input
              inputMode="decimal"
              className="field"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="label-caps text-slate">Expected close</span>
            <input
              type="date"
              className="field"
              value={closeDate}
              onChange={(e) => setCloseDate(e.target.value)}
            />
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="label-caps text-slate">Pricing</span>
          <select
            className="field"
            value={pricingType}
            onChange={(e) => setPricingType(e.target.value as PricingType)}
          >
            <option value="one_off">One-off</option>
            <option value="retainer">Retainer</option>
          </select>
        </label>
        {pricingType === 'retainer' && (
          <label className="flex flex-col gap-1.5">
            <span className="label-caps text-slate">Monthly amount (£)</span>
            <input
              inputMode="decimal"
              className="field"
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
            />
          </label>
        )}

        {error && <p className="text-sm text-forge">{error}</p>}

        {confirmingDelete ? (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-forge/40 bg-white p-3">
            <p className="min-w-0 flex-1 text-sm text-slate">
              Delete this deal for good?
            </p>
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="btn-forge px-4 py-1.5 text-xs"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="btn-ghost px-4 py-1.5 text-xs"
            >
              Keep
            </button>
          </div>
        ) : (
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={busy} className="btn-forge flex-1">
              {busy ? 'Saving…' : 'Save deal'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="btn-ghost text-slate hover:border-forge hover:text-forge"
            >
              Delete
            </button>
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
          </div>
        )}
      </form>
    </Modal>
  );
}

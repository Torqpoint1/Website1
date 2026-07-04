import { useState, type FormEvent } from 'react';
import { db } from '../lib/supabase';
import { logSystemActivity } from '../lib/actions';
import { money } from '../lib/format';
import {
  DELIVERABLE_TYPES,
  DELIVERABLE_TYPE_LABELS,
  type DeliverableType,
  type Retainer,
  type RetainerTemplateItem,
} from '../lib/types';
import Modal from './Modal';

export default function RetainerSection({
  accountId,
  accountName,
  retainer,
  onChanged,
}: {
  accountId: string;
  accountName: string;
  retainer: Retainer | null;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);

  async function setStatus(status: Retainer['status']) {
    if (!retainer) return;
    await db().from('retainers').update({ status }).eq('id', retainer.id);
    await logSystemActivity(accountId, `Retainer ${status}`);
    onChanged();
  }

  return (
    <section>
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <span className="point" aria-hidden />
          <h2 className="label-caps text-slate">Retainer</h2>
        </div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="label-caps text-forge"
        >
          {retainer ? 'Edit' : '+ Set up'}
        </button>
      </div>

      {!retainer ? (
        <p className="text-sm text-slate">
          No retainer. Set one up and “Run the month” will draft the invoice and
          schedule the monthly deliverables in one tap.
        </p>
      ) : (
        <div className="card p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-editorial text-2xl">
              {money(Number(retainer.monthly_amount))}/mo
            </span>
            <select
              aria-label="Retainer status"
              className="field w-auto py-1.5 text-xs"
              value={retainer.status}
              onChange={(e) => setStatus(e.target.value as Retainer['status'])}
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          {retainer.deliverable_template.length > 0 && (
            <ul className="pt-3">
              {retainer.deliverable_template.map((t, i) => (
                <li key={i} className="flex items-center gap-2 py-0.5 text-sm">
                  <span className="h-1.5 w-1.5 bg-forge" aria-hidden />
                  {t.title}
                  <span className="text-slate">
                    · {DELIVERABLE_TYPE_LABELS[t.type]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {editing && (
        <RetainerModal
          accountId={accountId}
          accountName={accountName}
          existing={retainer}
          onClose={() => setEditing(false)}
          onSaved={onChanged}
        />
      )}
    </section>
  );
}

function RetainerModal({
  accountId,
  accountName,
  existing,
  onClose,
  onSaved,
}: {
  accountId: string;
  accountName: string;
  existing: Retainer | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [amount, setAmount] = useState(
    existing ? String(existing.monthly_amount) : '',
  );
  const [items, setItems] = useState<RetainerTemplateItem[]>(
    existing?.deliverable_template?.length
      ? existing.deliverable_template
      : [{ type: 'social_posts', title: 'Monthly social posts' }],
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function patchItem(i: number, patch: Partial<RetainerTemplateItem>) {
    setItems((list) => list.map((item, x) => (x === i ? { ...item, ...patch } : item)));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const template = items.filter((i) => i.title.trim() !== '');
    const payload = {
      account_id: accountId,
      monthly_amount: Number(amount),
      deliverable_template: template,
      status: existing?.status ?? 'active',
    };
    const query = existing
      ? db().from('retainers').update(payload).eq('id', existing.id)
      : db().from('retainers').insert(payload);
    const { error: err } = await query;
    if (err) {
      setError(err.message);
      setBusy(false);
      return;
    }
    await logSystemActivity(
      accountId,
      existing
        ? `Retainer updated — ${money(Number(amount))}/mo`
        : `Retainer started — ${money(Number(amount))}/mo`,
    );
    onSaved();
    onClose();
  }

  return (
    <Modal
      title={existing ? `Retainer — ${accountName}` : `New retainer — ${accountName}`}
      onClose={onClose}
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="label-caps text-slate">Monthly amount (£)</span>
          <input
            required
            inputMode="decimal"
            autoFocus={!existing}
            className="field"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        <div className="flex items-center gap-2.5 pt-2">
          <span className="point" aria-hidden />
          <span className="label-caps text-slate">Standard monthly set</span>
        </div>
        <p className="-mt-2 text-sm text-slate">
          What gets delivered every month. “Run the month” schedules these
          automatically.
        </p>
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              aria-label="Deliverable title"
              className="field flex-1"
              placeholder="e.g. 4 social posts"
              value={item.title}
              onChange={(e) => patchItem(i, { title: e.target.value })}
            />
            <select
              aria-label="Deliverable type"
              className="field w-40"
              value={item.type}
              onChange={(e) => patchItem(i, { type: e.target.value as DeliverableType })}
            >
              {DELIVERABLE_TYPES.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              aria-label="Remove"
              onClick={() => setItems((l) => l.filter((_, x) => x !== i))}
              className="px-1 text-slate transition-colors hover:text-forge"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setItems((l) => [...l, { type: 'social_posts', title: '' }])
          }
          className="label-caps self-start text-forge"
        >
          + Add item
        </button>

        {error && <p className="text-sm text-forge">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={busy} className="btn-forge flex-1">
            {busy ? 'Saving…' : existing ? 'Save retainer' : 'Start retainer'}
          </button>
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

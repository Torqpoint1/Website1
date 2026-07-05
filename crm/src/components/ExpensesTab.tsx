import { useRef, useState, type FormEvent } from 'react';
import { db } from '../lib/supabase';
import { money, shortDate } from '../lib/format';
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_LABELS,
  type Expense,
  type ExpenseCategory,
} from '../lib/types';
import EmptyState from './EmptyState';
import Modal from './Modal';

function sameMonth(dateStr: string, ref = new Date()) {
  const d = new Date(dateStr);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

/** Recurring templates with no logged copy (and not themselves dated) this month. */
export function dueRecurring(expenses: Expense[]): Expense[] {
  return expenses.filter(
    (t) =>
      t.recurring &&
      !sameMonth(t.expense_date) &&
      !expenses.some((e) => e.recurring_source === t.id && sameMonth(e.expense_date)),
  );
}

export default function ExpensesTab({
  expenses,
  needsSetup,
  onChanged,
}: {
  expenses: Expense[];
  needsSetup: boolean;
  onChanged: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logging, setLogging] = useState(false);
  const [showAll, setShowAll] = useState(false);

  async function remove(exp: Expense) {
    if (exp.receipt_path) {
      await db().storage.from('assets').remove([exp.receipt_path]);
    }
    await db().from('expenses').delete().eq('id', exp.id);
    onChanged();
  }

  async function openReceipt(exp: Expense) {
    if (!exp.receipt_path) return;
    const { data } = await db()
      .storage.from('assets')
      .createSignedUrl(exp.receipt_path, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank', 'noreferrer');
  }

  const due = dueRecurring(expenses);

  async function logRecurring() {
    setLogging(true);
    setError(null);
    try {
      const { error: err } = await db()
        .from('expenses')
        .insert(
          due.map((t) => ({
            expense_date: new Date().toISOString().slice(0, 10),
            supplier: t.supplier,
            description: t.description,
            category: t.category,
            amount: t.amount,
            recurring: false,
            recurring_source: t.id,
          })),
        );
      if (err) throw err;
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not log them.');
    } finally {
      setLogging(false);
    }
  }

  if (needsSetup) {
    return (
      <EmptyState
        title="Expenses needs one switch-on step."
        hint="The expenses table hasn't been added to the database yet — ask Claude for the short SQL paste (same routine as before: SQL Editor → paste → Run), then refresh."
      />
    );
  }

  const now = new Date();
  const thisMonth = expenses.filter((e) => sameMonth(e.expense_date));
  const thisYear = expenses.filter(
    (e) => new Date(e.expense_date).getFullYear() === now.getFullYear(),
  );
  const sum = (list: Expense[]) => list.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 pb-4">
        <div>
          <p className="label-caps text-slate">Spent</p>
          <p className="text-sm text-slate">
            <span className="font-editorial text-2xl text-graphite">
              {money(sum(thisMonth))}
            </span>{' '}
            this month ·{' '}
            <span className="font-semibold text-graphite">
              {money(sum(thisYear))}
            </span>{' '}
            in {now.getFullYear()}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="btn-forge shrink-0"
        >
          <span className="h-1.5 w-1.5 bg-paper" aria-hidden />
          Add expense
        </button>
      </div>

      {due.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-forge/40 bg-white px-4 py-3">
          <p className="text-sm">
            <span className="font-semibold">
              {due.length} recurring expense{due.length === 1 ? '' : 's'}
            </span>{' '}
            not logged for{' '}
            {now.toLocaleDateString('en-GB', { month: 'long' })} yet —{' '}
            <span className="text-slate">
              {due.map((d) => d.supplier).join(', ')}
            </span>
          </p>
          <button
            type="button"
            onClick={logRecurring}
            disabled={logging}
            className="btn-forge"
          >
            {logging ? 'Logging…' : 'Log them'}
          </button>
        </div>
      )}

      {error && <p className="pb-3 text-sm text-forge">{error}</p>}

      {expenses.length === 0 ? (
        <EmptyState
          title="No expenses yet."
          hint="Log what the business spends — software, kit, travel, ads — and the tax return builds itself as you go."
        />
      ) : (
        <ul className="card divide-y divide-line">
          {(showAll ? expenses : expenses.slice(0, 20)).map((exp) => (
            <li key={exp.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
              <span className="w-20 shrink-0 text-xs text-slate">
                {shortDate(exp.expense_date)}
              </span>
              <button
                type="button"
                onClick={() => setEditing(exp)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate text-sm font-semibold underline-offset-4 hover:underline">
                  {exp.supplier}
                  {exp.recurring && (
                    <span className="label-caps pl-2 text-forge">Monthly</span>
                  )}
                </p>
                <p className="truncate text-xs text-slate">
                  {EXPENSE_CATEGORY_LABELS[exp.category]}
                  {exp.description && ` · ${exp.description}`}
                </p>
              </button>
              {exp.receipt_path && (
                <button
                  type="button"
                  onClick={() => openReceipt(exp)}
                  className="label-caps text-forge"
                >
                  Receipt
                </button>
              )}
              <span className="font-editorial text-lg">{money(Number(exp.amount))}</span>
              <button
                type="button"
                onClick={() => remove(exp)}
                aria-label={`Delete expense from ${exp.supplier}`}
                className="px-1 text-slate transition-colors hover:text-forge"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {!showAll && expenses.length > 20 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="label-caps pt-3 text-forge"
        >
          Show all {expenses.length}
        </button>
      )}

      {adding && (
        <ExpenseModal onClose={() => setAdding(false)} onSaved={onChanged} />
      )}
      {editing && (
        <ExpenseModal
          existing={editing}
          onClose={() => setEditing(null)}
          onSaved={onChanged}
        />
      )}
    </div>
  );
}

function ExpenseModal({
  existing,
  onClose,
  onSaved,
}: {
  existing?: Expense;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [date, setDate] = useState(
    existing?.expense_date ?? new Date().toISOString().slice(0, 10),
  );
  const [supplier, setSupplier] = useState(existing?.supplier ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [category, setCategory] = useState<ExpenseCategory>(
    existing?.category ?? 'software',
  );
  const [amount, setAmount] = useState(
    existing ? String(existing.amount) : '',
  );
  const [recurring, setRecurring] = useState(existing?.recurring ?? false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const receiptRef = useRef<HTMLInputElement>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      let receipt_path: string | null = existing?.receipt_path ?? null;
      const receipt = receiptRef.current?.files?.[0];
      if (receipt) {
        receipt_path = `receipts/${Date.now()}-${receipt.name.replace(/[^\w.\-() ]/g, '_')}`;
        const { error: upErr } = await db()
          .storage.from('assets')
          .upload(receipt_path, receipt);
        if (upErr) {
          throw new Error(
            upErr.message.toLowerCase().includes('bucket')
              ? 'Receipt uploads need the storage step from the Files feature — ask Claude. (You can save the expense without the receipt.)'
              : upErr.message,
          );
        }
      }
      const payload: Record<string, unknown> = {
        expense_date: date,
        supplier: supplier.trim(),
        description: description.trim() || null,
        category,
        amount: Number(amount),
        receipt_path,
      };
      if (recurring || existing?.recurring != null) payload.recurring = recurring;
      const query = existing
        ? db().from('expenses').update(payload).eq('id', existing.id)
        : db().from('expenses').insert(payload);
      const { error: insErr } = await query;
      if (insErr) {
        if (insErr.code === '42703') {
          throw new Error(
            'Repeating expenses need a tiny database update — ask Claude for the paste, or untick "repeats monthly" for now.',
          );
        }
        throw insErr;
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
      setBusy(false);
    }
  }

  return (
    <Modal title={existing ? 'Edit expense' : 'Add expense'} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="label-caps text-slate">Date</span>
            <input
              type="date"
              required
              className="field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="label-caps text-slate">Amount (£)</span>
            <input
              required
              inputMode="decimal"
              className="field"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="label-caps text-slate">Supplier</span>
          <input
            required
            autoFocus
            className="field"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="e.g. Adobe"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="label-caps text-slate">Category</span>
          <select
            className="field"
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="label-caps text-slate">What for (optional)</span>
          <input
            className="field"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Creative Cloud monthly"
          />
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={recurring}
            onChange={(e) => setRecurring(e.target.checked)}
            className="h-4 w-4 accent-[#EE5A1E]"
          />
          <span className="text-sm font-semibold">Repeats monthly</span>
          <span className="text-sm text-slate">
            — Finance will offer to log it each month.
          </span>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="label-caps text-slate">Receipt (optional)</span>
          <input ref={receiptRef} type="file" accept="image/*,.pdf" className="field" />
        </label>

        {error && <p className="text-sm text-forge">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={busy} className="btn-forge flex-1">
            {busy ? 'Saving…' : existing ? 'Save changes' : 'Add expense'}
          </button>
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

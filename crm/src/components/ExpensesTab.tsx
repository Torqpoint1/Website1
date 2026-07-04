import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
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

export default function ExpensesTab() {
  const [expenses, setExpenses] = useState<Expense[] | null>(null);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: err } = await db()
      .from('expenses')
      .select('*')
      .order('expense_date', { ascending: false });
    if (err) {
      // Table missing → the one-off SQL paste hasn't been run yet.
      if (err.code === '42P01') setNeedsSetup(true);
      else setError(err.message);
      setExpenses([]);
      return;
    }
    setExpenses((data ?? []) as Expense[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(exp: Expense) {
    if (exp.receipt_path) {
      await db().storage.from('assets').remove([exp.receipt_path]);
    }
    await db().from('expenses').delete().eq('id', exp.id);
    load();
  }

  async function openReceipt(exp: Expense) {
    if (!exp.receipt_path) return;
    const { data } = await db()
      .storage.from('assets')
      .createSignedUrl(exp.receipt_path, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank', 'noreferrer');
  }

  if (!expenses) return null;

  if (needsSetup) {
    return (
      <EmptyState
        title="Expenses needs one switch-on step."
        hint="The expenses table hasn't been added to the database yet — ask Claude for the short SQL paste (same routine as before: SQL Editor → paste → Run), then refresh."
      />
    );
  }

  const now = new Date();
  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.expense_date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
  const thisYear = expenses.filter(
    (e) => new Date(e.expense_date).getFullYear() === now.getFullYear(),
  );
  const sum = (list: Expense[]) => list.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <p className="text-sm text-slate">
          <span className="font-editorial text-2xl text-graphite">
            {money(sum(thisMonth))}
          </span>{' '}
          this month ·{' '}
          <span className="font-semibold text-graphite">{money(sum(thisYear))}</span>{' '}
          in {now.getFullYear()}
        </p>
        <button type="button" onClick={() => setAdding(true)} className="btn-forge">
          <span className="h-1.5 w-1.5 bg-paper" aria-hidden />
          Add expense
        </button>
      </div>

      {error && <p className="pb-3 text-sm text-forge">{error}</p>}

      {expenses.length === 0 ? (
        <EmptyState
          title="No expenses yet."
          hint="Log what the business spends — software, kit, travel, ads — and the tax return builds itself as you go."
        />
      ) : (
        <ul className="card divide-y divide-line">
          {expenses.map((exp) => (
            <li key={exp.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
              <span className="w-20 shrink-0 text-xs text-slate">
                {shortDate(exp.expense_date)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{exp.supplier}</p>
                <p className="truncate text-xs text-slate">
                  {EXPENSE_CATEGORY_LABELS[exp.category]}
                  {exp.description && ` · ${exp.description}`}
                </p>
              </div>
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

      {adding && (
        <AddExpenseModal onClose={() => setAdding(false)} onSaved={load} />
      )}
    </div>
  );
}

function AddExpenseModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [supplier, setSupplier] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('software');
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const receiptRef = useRef<HTMLInputElement>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      let receipt_path: string | null = null;
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
      const { error: insErr } = await db().from('expenses').insert({
        expense_date: date,
        supplier: supplier.trim(),
        description: description.trim() || null,
        category,
        amount: Number(amount),
        receipt_path,
      });
      if (insErr) throw insErr;
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
      setBusy(false);
    }
  }

  return (
    <Modal title="Add expense" onClose={onClose}>
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
        <label className="flex flex-col gap-1.5">
          <span className="label-caps text-slate">Receipt (optional)</span>
          <input ref={receiptRef} type="file" accept="image/*,.pdf" className="field" />
        </label>

        {error && <p className="text-sm text-forge">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={busy} className="btn-forge flex-1">
            {busy ? 'Saving…' : 'Add expense'}
          </button>
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

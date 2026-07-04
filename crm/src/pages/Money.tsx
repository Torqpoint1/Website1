import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../lib/supabase';
import { createInvoiceFromProject, flagOverdueInvoices } from '../lib/money';
import { runTheMonth, type RunResult } from '../lib/retainers';
import { money, shortDate } from '../lib/format';
import type { Deal, Expense, Invoice, Project, Quote, Retainer } from '../lib/types';
import PointLoader from '../components/PointLoader';
import EmptyState from '../components/EmptyState';
import ExpensesTab from '../components/ExpensesTab';

export default function Money() {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [retainers, setRetainers] = useState<Retainer[]>([]);
  const [readyProjects, setReadyProjects] = useState<Project[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expensesReady, setExpensesReady] = useState(true);
  const [openDeals, setOpenDeals] = useState<Deal[]>([]);
  const [clientCount, setClientCount] = useState(0);
  const [tab, setTab] = useState<'invoices' | 'quotes' | 'expenses'>('invoices');
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      await flagOverdueInvoices();
      const [inv, qts, rts, prj, exp, dls, cls] = await Promise.all([
        db()
          .from('invoices')
          .select('*, account:accounts(name)')
          .order('created_at', { ascending: false }),
        db()
          .from('quotes')
          .select('*, account:accounts(name)')
          .order('created_at', { ascending: false }),
        db().from('retainers').select('*, account:accounts(name)'),
        db()
          .from('projects')
          .select('*, account:accounts(name)')
          .eq('ready_to_invoice', true),
        db()
          .from('expenses')
          .select('*')
          .order('expense_date', { ascending: false }),
        db().from('deals').select('*').eq('status', 'open'),
        db()
          .from('accounts')
          .select('id', { count: 'exact', head: true })
          .in('status', ['active', 'one_off']),
      ]);
      const err = inv.error ?? qts.error ?? rts.error ?? prj.error ?? dls.error;
      if (err) throw err;
      setInvoices(inv.data as Invoice[]);
      setQuotes(qts.data as Quote[]);
      setRetainers(rts.data as Retainer[]);
      setReadyProjects(prj.data as Project[]);
      setOpenDeals((dls.data ?? []) as Deal[]);
      setClientCount(cls.count ?? 0);
      if (exp.error) {
        // Table missing until the expenses paste is run — metrics show £0.
        if (exp.error.code === '42P01') setExpensesReady(false);
        else throw exp.error;
      } else {
        setExpenses((exp.data ?? []) as Expense[]);
        setExpensesReady(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load money.');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (error) return <p className="p-6 text-sm text-forge">{error}</p>;
  if (!invoices) return <PointLoader label="Counting the money" />;

  const mrr = retainers
    .filter((r) => r.status === 'active')
    .reduce((s, r) => s + Number(r.monthly_amount), 0);
  const owed = invoices.filter((i) => i.status === 'sent' || i.status === 'overdue');
  const owedTotal = owed.reduce((s, i) => s + Number(i.total), 0);
  const overdueTotal = invoices
    .filter((i) => i.status === 'overdue')
    .reduce((s, i) => s + Number(i.total), 0);

  // --- The numbers (cash basis: paid invoices in, logged expenses out) ---
  const now = new Date();
  const paid = invoices.filter((i) => i.status === 'paid' && i.paid_date);
  const inMonth = (d: string, ref: Date) => {
    const x = new Date(d);
    return x.getFullYear() === ref.getFullYear() && x.getMonth() === ref.getMonth();
  };
  const inYear = (d: string) => new Date(d).getFullYear() === now.getFullYear();
  const sumInv = (list: Invoice[]) => list.reduce((s, i) => s + Number(i.total), 0);
  const sumExp = (list: Expense[]) => list.reduce((s, e) => s + Number(e.amount), 0);

  const turnover = {
    month: sumInv(paid.filter((i) => inMonth(i.paid_date!, now))),
    year: sumInv(paid.filter((i) => inYear(i.paid_date!))),
    all: sumInv(paid),
  };
  const spent = {
    month: sumExp(expenses.filter((e) => inMonth(e.expense_date, now))),
    year: sumExp(expenses.filter((e) => inYear(e.expense_date))),
    all: sumExp(expenses),
  };
  const profit = {
    month: turnover.month - spent.month,
    year: turnover.year - spent.year,
    all: turnover.all - spent.all,
  };

  const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
    const ref = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const inn = sumInv(paid.filter((x) => inMonth(x.paid_date!, ref)));
    const out = sumExp(expenses.filter((x) => inMonth(x.expense_date, ref)));
    return {
      label: ref.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
      inn,
      out,
    };
  });

  const paidThisYear = paid.filter((i) => inYear(i.paid_date!));
  const retainerRevenue = sumInv(
    paidThisYear.filter((i) => i.pricing_type === 'retainer'),
  );
  const oneOffRevenue = sumInv(
    paidThisYear.filter((i) => i.pricing_type !== 'retainer'),
  );

  const avgInvoice = paid.length > 0 ? turnover.all / paid.length : 0;
  const byMonth = new Map<string, number>();
  for (const i of paid) {
    const key = i.paid_date!.slice(0, 7);
    byMonth.set(key, (byMonth.get(key) ?? 0) + Number(i.total));
  }
  const bestMonthEntry = [...byMonth.entries()].sort((a, b) => b[1] - a[1])[0];
  const bestMonth = bestMonthEntry
    ? {
        label: new Date(`${bestMonthEntry[0]}-01`).toLocaleDateString('en-GB', {
          month: 'short',
          year: 'numeric',
        }),
        value: bestMonthEntry[1],
      }
    : null;
  const decidedQuotes = quotes.filter(
    (q) => q.status === 'accepted' || q.status === 'declined',
  );
  const winRate =
    decidedQuotes.length > 0
      ? Math.round(
          (quotes.filter((q) => q.status === 'accepted').length /
            decidedQuotes.length) *
            100,
        )
      : null;
  const pipelineValue = openDeals.reduce((s, d) => s + Number(d.value ?? 0), 0);

  async function invoiceProject(p: Project) {
    const id = await createInvoiceFromProject(p);
    navigate(`/money/invoices/${id}`);
  }

  async function handleRunTheMonth() {
    setRunning(true);
    setRunResult(null);
    try {
      const result = await runTheMonth();
      setRunResult(result);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Run the month failed.');
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8">
        <h1 className="font-editorial text-4xl tracking-tight">Finance</h1>
        <div className="flex gap-2">
          <Link to="/money/quotes/new" className="btn-ghost">
            New quote
          </Link>
          <Link to="/money/invoices/new" className="btn-forge">
            <span className="h-1.5 w-1.5 bg-paper" aria-hidden />
            New invoice
          </Link>
        </div>
      </div>

      {/* 1 — This month, the numbers that matter right now */}
      <section>
        <div className="flex items-center gap-2.5 pb-4">
          <span className="point" aria-hidden />
          <h2 className="label-caps text-slate">
            {now.toLocaleDateString('en-GB', { month: 'long' })} so far
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
          <Stat
            label="Profit"
            value={money(profit.month)}
            alert={profit.month < 0}
            accent
          />
          <Stat label="Turnover" value={money(turnover.month)} sub="invoices paid" />
          <Stat label="Expenses" value={money(spent.month)} sub="money out" />
          <Stat label="MRR" value={money(mrr)} sub="active retainers" />
        </div>
      </section>

      {/* 2 — What's owed to you */}
      <section className="pt-8">
        <div className="flex items-center gap-2.5 pb-4">
          <span className="point" aria-hidden />
          <h2 className="label-caps text-slate">Owed to you</h2>
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
          <Stat
            label="Awaiting payment"
            value={money(owedTotal)}
            sub={`${owed.length} invoice${owed.length === 1 ? '' : 's'} out`}
          />
          <Stat
            label="Overdue"
            value={money(overdueTotal)}
            alert={overdueTotal > 0}
            sub={overdueTotal > 0 ? 'chase these' : 'nothing late'}
          />
          <Stat
            label="Open pipeline"
            value={money(pipelineValue)}
            sub={`${openDeals.length} open deal${openDeals.length === 1 ? '' : 's'}`}
          />
        </div>
      </section>

      {/* Retainers + Run the month */}
      <section className="pt-10">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2.5">
            <span className="point" aria-hidden />
            <h2 className="label-caps text-slate">Retainers</h2>
          </div>
          {retainers.some((r) => r.status === 'active') && (
            <button
              type="button"
              onClick={handleRunTheMonth}
              disabled={running}
              className="btn-forge"
            >
              {running ? 'Running…' : 'Run the month'}
            </button>
          )}
        </div>
        {runResult && (
          <p className="pb-4 text-sm text-graphite">
            <span className="font-semibold">Done.</span> {runResult.invoicesCreated}{' '}
            invoice{runResult.invoicesCreated === 1 ? '' : 's'} drafted,{' '}
            {runResult.deliverablesCreated} deliverable
            {runResult.deliverablesCreated === 1 ? '' : 's'} scheduled
            {runResult.skipped > 0 &&
              ` · ${runResult.skipped} retainer${
                runResult.skipped === 1 ? '' : 's'
              } already run this month`}
            .
          </p>
        )}
        {retainers.length === 0 ? (
          <EmptyState
            title="No retainers yet."
            hint="Set one up from a client's account page — then one tap here runs the month: invoice drafted, deliverables scheduled."
          />
        ) : (
          <ul className="card divide-y divide-line">
            {retainers.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <Link
                  to={`/accounts/${r.account_id}`}
                  className="min-w-0 flex-1 font-semibold underline-offset-4 hover:underline"
                >
                  {r.account?.name}
                </Link>
                <span className="font-editorial text-lg">
                  {money(Number(r.monthly_amount))}/mo
                </span>
                <span
                  className={`label-caps ${
                    r.status === 'active' ? 'text-forge' : 'text-slate'
                  }`}
                >
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Ready to invoice */}
      {readyProjects.length > 0 && (
        <section className="pt-10">
          <div className="flex items-center gap-2.5 pb-4">
            <span className="point" aria-hidden />
            <h2 className="label-caps text-slate">Ready to invoice</h2>
          </div>
          <ul className="card divide-y divide-line">
            {readyProjects.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{p.name}</p>
                  <p className="text-sm text-slate">{p.account?.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => invoiceProject(p)}
                  className="btn-forge"
                >
                  Draft invoice
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 3 — This year */}
      <section className="pt-10">
        <div className="flex items-center gap-2.5 pb-4">
          <span className="point" aria-hidden />
          <h2 className="label-caps text-slate">{now.getFullYear()} so far</h2>
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
          <Stat small label="Profit" value={money(profit.year)} alert={profit.year < 0} />
          <Stat small label="Turnover" value={money(turnover.year)} />
          <Stat small label="Expenses" value={money(spent.year)} />
          <Stat
            small
            label="Retainer / one-off"
            value={`${money(retainerRevenue)} / ${money(oneOffRevenue)}`}
          />
        </div>
        {!expensesReady && (
          <p className="pt-3 text-sm text-slate">
            Expense figures show £0 until the expenses table is switched on —
            see the Expenses tab below.
          </p>
        )}
      </section>

      {/* 4 — The trend */}
      <section className="pt-10">
        <div className="flex items-center gap-2.5 pb-4">
          <span className="point" aria-hidden />
          <h2 className="label-caps text-slate">Month by month</h2>
        </div>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-4 py-2.5"></th>
                <th className="label-caps px-4 py-2.5 text-right font-semibold text-slate">
                  In
                </th>
                <th className="label-caps px-4 py-2.5 text-right font-semibold text-slate">
                  Out
                </th>
                <th className="label-caps px-4 py-2.5 text-right font-semibold text-slate">
                  Profit
                </th>
              </tr>
            </thead>
            <tbody>
              {lastSixMonths.map((m) => (
                <tr key={m.label} className="border-b border-line last:border-0">
                  <td className="px-4 py-2.5 font-semibold">{m.label}</td>
                  <td className="px-4 py-2.5 text-right">{money(m.inn)}</td>
                  <td className="px-4 py-2.5 text-right">{money(m.out)}</td>
                  <td
                    className={`px-4 py-2.5 text-right font-editorial text-base ${
                      m.inn - m.out < 0 ? 'text-forge' : ''
                    }`}
                  >
                    {money(m.inn - m.out)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5 — The bigger picture */}
      <section className="pt-10">
        <div className="flex items-center gap-2.5 pb-4">
          <span className="point" aria-hidden />
          <h2 className="label-caps text-slate">All time</h2>
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
          <Stat small label="Profit" value={money(profit.all)} alert={profit.all < 0} />
          <Stat small label="Turnover" value={money(turnover.all)} />
          <Stat small label="Expenses" value={money(spent.all)} />
          <Stat small label="Average invoice" value={money(avgInvoice)} />
          <Stat
            small
            label="Best month"
            value={bestMonth ? money(bestMonth.value) : '—'}
            sub={bestMonth?.label}
          />
          <Stat
            small
            label="Quote win rate"
            value={winRate != null ? `${winRate}%` : '—'}
            sub={
              decidedQuotes.length > 0
                ? `${decidedQuotes.length} decided · ${clientCount} active client${
                    clientCount === 1 ? '' : 's'
                  }`
                : `${clientCount} active client${clientCount === 1 ? '' : 's'}`
            }
          />
        </div>
      </section>

      {/* Documents */}
      <section className="pt-10">
        <div className="flex gap-1.5 pb-4">
          {(
            [
              ['invoices', `Invoices (${invoices.length})`],
              ['quotes', `Quotes (${quotes.length})`],
              ['expenses', 'Expenses'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${
                tab === key
                  ? 'bg-graphite text-paper'
                  : 'border border-graphite/20 text-slate hover:border-graphite'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'invoices' &&
          (invoices.length === 0 ? (
            <EmptyState
              title="No invoices yet."
              hint="Build one from scratch, from an accepted quote, or from a project marked ready to invoice."
            />
          ) : (
            <ul className="card divide-y divide-line">
              {invoices.map((inv) => (
                <li key={inv.id}>
                  <Link
                    to={`/money/invoices/${inv.id}`}
                    className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 transition-colors hover:bg-paper"
                  >
                    <span className="w-24 shrink-0 text-sm font-semibold">
                      {inv.number}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm">
                      {inv.account?.name}
                    </span>
                    <span className="hidden text-xs text-slate sm:inline">
                      due {shortDate(inv.due_date)}
                    </span>
                    <span className="font-editorial text-lg">
                      {money(Number(inv.total))}
                    </span>
                    <DocStatus status={inv.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ))}

        {tab === 'quotes' &&
          (quotes.length === 0 ? (
            <EmptyState
              title="No quotes yet."
              hint="The quote is the proposal — build it, send it, and one tap turns acceptance into an invoice."
            />
          ) : (
            <ul className="card divide-y divide-line">
              {quotes.map((q) => (
                <li key={q.id}>
                  <Link
                    to={`/money/quotes/${q.id}`}
                    className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 transition-colors hover:bg-paper"
                  >
                    <span className="w-24 shrink-0 text-sm font-semibold">
                      {q.number}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm">
                      {q.account?.name}
                    </span>
                    <span className="font-editorial text-lg">
                      {money(Number(q.total))}
                    </span>
                    <DocStatus status={q.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ))}

        {tab === 'expenses' && (
          <ExpensesTab
            expenses={expenses}
            needsSetup={!expensesReady}
            onChanged={load}
          />
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  alert,
  small,
  sub,
}: {
  label: string;
  value: string;
  accent?: boolean;
  alert?: boolean;
  small?: boolean;
  sub?: string;
}) {
  return (
    <div className="bg-white px-4 py-4">
      <p className="label-caps text-slate">{label}</p>
      <p
        className={`pt-1 font-editorial ${small ? 'text-xl' : 'text-3xl'} ${
          alert ? 'text-forge' : 'text-graphite'
        }`}
      >
        {value}
      </p>
      {sub && <p className="pt-0.5 text-xs text-slate">{sub}</p>}
      {accent && <span className="mt-2 block h-1 w-6 bg-forge" aria-hidden />}
    </div>
  );
}

function DocStatus({ status }: { status: string }) {
  const style =
    status === 'paid' || status === 'accepted'
      ? 'border-graphite bg-graphite text-paper'
      : status === 'overdue'
        ? 'border-forge bg-forge text-paper'
        : status === 'sent'
          ? 'border-forge/50 text-forge'
          : status === 'declined'
            ? 'border-graphite/20 text-slate line-through'
            : 'border-graphite/25 text-slate';
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${style}`}
    >
      {status}
    </span>
  );
}

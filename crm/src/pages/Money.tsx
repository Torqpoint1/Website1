import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../lib/supabase';
import { createInvoiceFromProject, flagOverdueInvoices } from '../lib/money';
import { runTheMonth, type RunResult } from '../lib/retainers';
import { money, shortDate } from '../lib/format';
import type { Invoice, Project, Quote, Retainer } from '../lib/types';
import PointLoader from '../components/PointLoader';
import EmptyState from '../components/EmptyState';

export default function Money() {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [retainers, setRetainers] = useState<Retainer[]>([]);
  const [readyProjects, setReadyProjects] = useState<Project[]>([]);
  const [tab, setTab] = useState<'invoices' | 'quotes'>('invoices');
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      await flagOverdueInvoices();
      const [inv, qts, rts, prj] = await Promise.all([
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
      ]);
      const err = inv.error ?? qts.error ?? rts.error ?? prj.error;
      if (err) throw err;
      setInvoices(inv.data as Invoice[]);
      setQuotes(qts.data as Quote[]);
      setRetainers(rts.data as Retainer[]);
      setReadyProjects(prj.data as Project[]);
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

  const paidThisYear = invoices.filter(
    (i) =>
      i.status === 'paid' &&
      i.paid_date &&
      new Date(i.paid_date).getFullYear() === new Date().getFullYear(),
  );
  const retainerRevenue = paidThisYear
    .filter((i) => i.pricing_type === 'retainer')
    .reduce((s, i) => s + Number(i.total), 0);
  const oneOffRevenue = paidThisYear
    .filter((i) => i.pricing_type !== 'retainer')
    .reduce((s, i) => s + Number(i.total), 0);

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
        <h1 className="font-editorial text-4xl tracking-tight">Money</h1>
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

      {/* Headline numbers */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
        <Stat label="MRR" value={money(mrr)} accent />
        <Stat label="Money owed" value={money(owedTotal)} />
        <Stat label="Overdue" value={money(overdueTotal)} alert={overdueTotal > 0} />
        <Stat
          label={`Paid ${new Date().getFullYear()} · retainer / one-off`}
          value={`${money(retainerRevenue)} / ${money(oneOffRevenue)}`}
          small
        />
      </div>

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

      {/* Documents */}
      <section className="pt-10">
        <div className="flex gap-1.5 pb-4">
          {(
            [
              ['invoices', `Invoices (${invoices.length})`],
              ['quotes', `Quotes (${quotes.length})`],
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
}: {
  label: string;
  value: string;
  accent?: boolean;
  alert?: boolean;
  small?: boolean;
}) {
  return (
    <div className="bg-white px-4 py-4">
      <p className="label-caps text-slate">{label}</p>
      <p
        className={`pt-1 font-editorial ${small ? 'text-xl' : 'text-3xl'} ${
          alert ? 'text-forge' : accent ? 'text-graphite' : 'text-graphite'
        }`}
      >
        {value}
      </p>
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

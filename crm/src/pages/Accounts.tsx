import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/supabase';
import {
  ACCOUNT_STATUSES,
  type Account,
  type AccountStatus,
} from '../lib/types';
import StagePill from '../components/StagePill';
import PointLoader from '../components/PointLoader';
import AddLeadModal from '../components/AddLeadModal';
import EmptyState from '../components/EmptyState';

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AccountStatus | 'all'>('all');
  const [showAddLead, setShowAddLead] = useState(false);

  const load = useCallback(async () => {
    const { data, error: err } = await db()
      .from('accounts')
      .select('*')
      .order('updated_at', { ascending: false });
    if (err) setError(err.message);
    else setAccounts(data as Account[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (error) return <p className="p-6 text-sm text-forge">{error}</p>;
  if (!accounts) return <PointLoader label="Loading leads & clients" />;

  const q = query.trim().toLowerCase();
  const filtered = accounts.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (!q) return true;
    return [a.name, a.niche, a.location]
      .filter(Boolean)
      .some((v) => (v as string).toLowerCase().includes(q));
  });

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
        <h1 className="font-editorial text-4xl tracking-tight">Leads &amp; Clients</h1>
        <button type="button" onClick={() => setShowAddLead(true)} className="btn-forge">
          <span className="h-1.5 w-1.5 bg-paper" aria-hidden />
          New lead
        </button>
      </div>

      <div className="flex flex-col gap-3 pb-6 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Search name, niche or location…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="field sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-1.5">
          {(['all', ...ACCOUNT_STATUSES.map((s) => s.key)] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatusFilter(key as AccountStatus | 'all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${
                statusFilter === key
                  ? 'bg-graphite text-paper'
                  : 'border border-graphite/20 text-slate hover:border-graphite'
              }`}
            >
              {key === 'all'
                ? 'All'
                : ACCOUNT_STATUSES.find((s) => s.key === key)?.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={accounts.length === 0 ? 'No leads yet.' : 'Nothing matches.'}
          hint={
            accounts.length === 0
              ? 'Add your first lead — it takes thirty seconds and starts the whole loop.'
              : 'Try a different search or clear the status filter.'
          }
          action={
            accounts.length === 0 ? (
              <button
                type="button"
                onClick={() => setShowAddLead(true)}
                className="btn-forge"
              >
                Add a lead
              </button>
            ) : undefined
          }
        />
      ) : (
        <ul className="card divide-y divide-line">
          {filtered.map((a) => (
            <li key={a.id}>
              <Link
                to={`/accounts/${a.id}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3.5 transition-colors hover:bg-paper sm:px-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{a.name}</p>
                  <p className="truncate text-sm text-slate">
                    {[a.niche, a.location].filter(Boolean).join(' · ') || '—'}
                  </p>
                </div>
                <span className="label-caps hidden text-slate sm:inline">
                  {a.lead_source}
                </span>
                <StagePill stage={a.pipeline_stage} />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {showAddLead && (
        <AddLeadModal onClose={() => setShowAddLead(false)} onCreated={load} />
      )}
    </div>
  );
}

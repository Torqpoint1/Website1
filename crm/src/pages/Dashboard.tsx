import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/supabase';
import { money, timeAgo, isOverdue, isToday, shortDate } from '../lib/format';
import {
  PIPELINE_STAGES,
  type Activity,
  type Deal,
  type FollowUpTask,
} from '../lib/types';
import PointLoader from '../components/PointLoader';
import AddLeadModal from '../components/AddLeadModal';
import EmptyState from '../components/EmptyState';
import AIPanel from '../components/AIPanel';
import { buildWeekContext } from '../lib/ai';

interface DashboardData {
  mrr: number;
  openDeals: Deal[];
  activities: Activity[];
  tasks: FollowUpTask[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [retainers, deals, activities, tasks] = await Promise.all([
        db().from('retainers').select('monthly_amount').eq('status', 'active'),
        db()
          .from('deals')
          .select('*, account:accounts(name)')
          .eq('status', 'open'),
        db()
          .from('activities')
          .select('*, account:accounts(name)')
          .order('occurred_at', { ascending: false })
          .limit(8),
        db()
          .from('tasks')
          .select('*')
          .eq('done', false)
          .not('due_date', 'is', null)
          .order('due_date', { ascending: true })
          .limit(10),
      ]);
      const firstError =
        retainers.error ?? deals.error ?? activities.error ?? tasks.error;
      if (firstError) throw firstError;
      setData({
        mrr: (retainers.data ?? []).reduce(
          (sum, r) => sum + Number(r.monthly_amount ?? 0),
          0,
        ),
        openDeals: (deals.data ?? []) as Deal[],
        activities: (activities.data ?? []) as Activity[],
        tasks: ((tasks.data ?? []) as FollowUpTask[]).filter(
          (t) => isOverdue(t.due_date) || isToday(t.due_date),
        ),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the dashboard.');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function completeTask(task: FollowUpTask) {
    await db().from('tasks').update({ done: true }).eq('id', task.id);
    load();
  }

  if (error) {
    return <p className="p-6 text-sm text-forge">{error}</p>;
  }
  if (!data) return <PointLoader label="Loading the numbers" />;

  const pipelineValue = data.openDeals.reduce(
    (sum, d) => sum + Number(d.value ?? 0),
    0,
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-10">
        <div>
          <p className="label-caps text-slate">Monthly recurring revenue</p>
          <p className="font-editorial text-6xl tracking-tight text-graphite sm:text-7xl">
            {money(data.mrr)}
          </p>
          <p className="pt-2 text-sm text-slate">
            The sum of your active retainers — the number that matters most.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setShowBriefing(true)} className="btn-ghost">
            Run my week
          </button>
          <button type="button" onClick={() => setShowAddLead(true)} className="btn-forge">
            <span className="h-1.5 w-1.5 bg-paper" aria-hidden />
            New lead
          </button>
        </div>
      </div>

      {/* Pipeline snapshot */}
      <section className="pb-10">
        <div className="flex items-center gap-2.5 pb-4">
          <span className="point" aria-hidden />
          <h2 className="label-caps text-slate">Pipeline</h2>
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
          {PIPELINE_STAGES.filter((s) => s.key !== 'lost').map((stage) => {
            const stageDeals =
              stage.key === 'won'
                ? [] // won deals leave the open pipeline
                : data.openDeals.filter((d) => d.pipeline_stage === stage.key);
            return (
              <Link
                key={stage.key}
                to="/pipeline"
                className="bg-white px-4 py-4 transition-colors hover:bg-paper"
              >
                <p className="label-caps text-slate">{stage.label}</p>
                <p className="pt-1 font-editorial text-3xl text-graphite">
                  {stage.key === 'won' ? '—' : stageDeals.length}
                </p>
                {stage.key !== 'won' && (
                  <p className="text-xs text-slate">
                    {money(stageDeals.reduce((s, d) => s + Number(d.value ?? 0), 0))}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
        <p className="pt-3 text-sm text-slate">
          {data.openDeals.length} open{' '}
          {data.openDeals.length === 1 ? 'deal' : 'deals'} worth{' '}
          <span className="font-semibold text-graphite">{money(pipelineValue)}</span>
        </p>
      </section>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Due today / overdue */}
        <section>
          <div className="flex items-center gap-2.5 pb-4">
            <span className="point" aria-hidden />
            <h2 className="label-caps text-slate">Needs you today</h2>
          </div>
          {data.tasks.length === 0 ? (
            <EmptyState
              title="Nothing due today."
              hint="Follow-ups you add on an account will surface here when they’re due or overdue."
            />
          ) : (
            <ul className="card divide-y divide-line">
              {data.tasks.map((task) => (
                <li key={task.id} className="flex items-center gap-3 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => completeTask(task)}
                    aria-label={`Mark “${task.title}” done`}
                    className="h-4 w-4 shrink-0 rounded border border-graphite/40 transition-colors hover:bg-forge hover:border-forge"
                  />
                  <span className="min-w-0 flex-1 truncate text-sm">{task.title}</span>
                  <span
                    className={`label-caps ${
                      isOverdue(task.due_date) ? 'text-forge' : 'text-slate'
                    }`}
                  >
                    {isOverdue(task.due_date) ? 'Overdue' : shortDate(task.due_date)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent activity */}
        <section>
          <div className="flex items-center gap-2.5 pb-4">
            <span className="point" aria-hidden />
            <h2 className="label-caps text-slate">Recent activity</h2>
          </div>
          {data.activities.length === 0 ? (
            <EmptyState
              title="Quiet so far."
              hint="Add your first lead and every note, call and stage move lands here."
            />
          ) : (
            <ul className="card divide-y divide-line">
              {data.activities.map((a) => (
                <li key={a.id} className="px-4 py-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="label-caps text-slate">
                      {a.account?.name ?? '—'} · {a.type}
                    </span>
                    <span className="shrink-0 text-xs text-slate">
                      {timeAgo(a.occurred_at)}
                    </span>
                  </div>
                  <p className="pt-1 text-sm leading-relaxed">{a.body}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Money owed — Layer 3 placeholder */}
      <section className="pt-10">
        <div className="flex items-center gap-2.5 pb-4">
          <span className="point" aria-hidden />
          <h2 className="label-caps text-slate">Money owed</h2>
        </div>
        <EmptyState
          title="Coming with invoices."
          hint="Unpaid and overdue invoices appear here once the money layer (Layer 3) is built."
        />
      </section>

      {showAddLead && (
        <AddLeadModal onClose={() => setShowAddLead(false)} onCreated={load} />
      )}
      {showBriefing && (
        <AIPanel
          title="Run my week"
          action="run_my_week"
          getContext={buildWeekContext}
          onClose={() => setShowBriefing(false)}
        />
      )}
    </div>
  );
}

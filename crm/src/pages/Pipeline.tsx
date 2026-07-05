import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/supabase';
import { moveDealStage } from '../lib/actions';
import { money, shortDate } from '../lib/format';
import {
  PIPELINE_STAGES,
  STAGE_LABELS,
  type Deal,
  type PipelineStage,
} from '../lib/types';
import PointLoader from '../components/PointLoader';
import AddLeadModal from '../components/AddLeadModal';
import Modal from '../components/Modal';

export default function Pipeline() {
  const [deals, setDeals] = useState<Deal[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [dragOver, setDragOver] = useState<PipelineStage | null>(null);
  const [losing, setLosing] = useState<Deal | null>(null);
  const [lostReason, setLostReason] = useState('');

  const load = useCallback(async () => {
    const { data, error: err } = await db()
      .from('deals')
      .select('*, account:accounts(name)')
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setDeals(data as Deal[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function move(deal: Deal, stage: PipelineStage) {
    if (stage === deal.pipeline_stage) return;
    if (stage === 'lost') {
      setLostReason('');
      setLosing(deal);
      return;
    }
    await moveDealStage(deal, stage);
    load();
  }

  async function confirmLost(e: FormEvent) {
    e.preventDefault();
    if (!losing) return;
    await moveDealStage(losing, 'lost', lostReason);
    setLosing(null);
    load();
  }

  if (error) return <p className="p-6 text-sm text-forge">{error}</p>;
  if (!deals) return <PointLoader label="Loading the pipeline" />;

  return (
    <div className="px-5 py-8 sm:px-8 lg:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8">
        <h1 className="font-editorial text-4xl tracking-tight">Pipeline</h1>
        <button type="button" onClick={() => setShowAddLead(true)} className="btn-forge">
          <span className="h-1.5 w-1.5 bg-paper" aria-hidden />
          New lead
        </button>
      </div>

      {/* Stages stack vertically on phones; kanban columns from lg up */}
      <div className="pb-4 lg:-mx-8 lg:overflow-x-auto lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:min-w-[64rem] lg:grid-cols-5">
          {PIPELINE_STAGES.map((stage) => {
            const stageDeals = deals.filter((d) => d.pipeline_stage === stage.key);
            const total = stageDeals.reduce((s, d) => s + Number(d.value ?? 0), 0);
            // Won/Lost accumulate forever — keep the board light, history
            // stays on each client's page.
            const isClosed = stage.key === 'won' || stage.key === 'lost';
            const visibleDeals = isClosed ? stageDeals.slice(0, 15) : stageDeals;
            const hiddenCount = stageDeals.length - visibleDeals.length;
            return (
              <div
                key={stage.key}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(stage.key);
                }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(null);
                  const id = e.dataTransfer.getData('text/deal-id');
                  const deal = deals.find((d) => d.id === id);
                  if (deal) move(deal, stage.key);
                }}
                className={`flex flex-col rounded-xl border transition-colors lg:min-h-[60vh] ${
                  dragOver === stage.key
                    ? 'border-forge bg-forge/5'
                    : 'border-line bg-paper-2/60'
                }`}
              >
                <div className="flex items-baseline justify-between border-b border-line px-3.5 py-3">
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 ${
                        stage.key === 'quote_sent' || stage.key === 'won'
                          ? 'bg-forge'
                          : 'bg-graphite/30'
                      }`}
                      aria-hidden
                    />
                    <span className="label-caps text-graphite">{stage.label}</span>
                  </span>
                  <span className="text-xs text-slate">
                    {stageDeals.length}
                    {total > 0 && ` · ${money(total)}`}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2.5 p-2.5">
                  {visibleDeals.map((deal) => (
                    <article
                      key={deal.id}
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData('text/deal-id', deal.id)
                      }
                      className="card cursor-grab p-3.5 active:cursor-grabbing"
                    >
                      <Link
                        to={`/accounts/${deal.account_id}`}
                        className="font-semibold leading-snug underline-offset-4 hover:underline"
                      >
                        {deal.account?.name ?? 'Unknown'}
                      </Link>
                      <p className="pt-0.5 text-sm text-slate">{deal.title}</p>
                      <div className="flex items-baseline justify-between pt-2.5">
                        <span className="font-editorial text-lg">
                          {deal.pricing_type === 'retainer' && deal.monthly_amount != null
                            ? `${money(deal.monthly_amount)}/mo`
                            : money(deal.value)}
                        </span>
                        {deal.expected_close_date && (
                          <span className="text-xs text-slate">
                            {shortDate(deal.expected_close_date)}
                          </span>
                        )}
                      </div>
                      {deal.pipeline_stage === 'lost' && deal.lost_reason && (
                        <p className="pt-2 text-xs italic text-slate">
                          {deal.lost_reason}
                        </p>
                      )}
                      {/* Tap-friendly stage move (drag needs a pointer) */}
                      <select
                        aria-label="Move stage"
                        className="mt-2.5 w-full rounded-md border border-graphite/15 bg-paper px-2 py-1.5 text-xs text-slate"
                        value={deal.pipeline_stage}
                        onChange={(e) => move(deal, e.target.value as PipelineStage)}
                      >
                        {PIPELINE_STAGES.map((s) => (
                          <option key={s.key} value={s.key}>
                            {s.key === deal.pipeline_stage
                              ? STAGE_LABELS[s.key]
                              : `Move to ${s.label}`}
                          </option>
                        ))}
                      </select>
                    </article>
                  ))}
                  {stageDeals.length === 0 && (
                    <p className="px-1 pt-2 text-xs text-slate/70">No deals here.</p>
                  )}
                  {hiddenCount > 0 && (
                    <p className="px-1 pt-1 text-xs text-slate/70">
                      +{hiddenCount} earlier — on each client's page.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showAddLead && (
        <AddLeadModal onClose={() => setShowAddLead(false)} onCreated={load} />
      )}

      {losing && (
        <Modal title="Mark as lost" onClose={() => setLosing(null)}>
          <form onSubmit={confirmLost} className="flex flex-col gap-4">
            <p className="text-sm text-slate">
              “{losing.title}” for{' '}
              <span className="font-semibold text-graphite">
                {losing.account?.name}
              </span>
              . A one-liner on why keeps the source report honest.
            </p>
            <label className="flex flex-col gap-1.5">
              <span className="label-caps text-slate">Reason (optional)</span>
              <input
                autoFocus
                className="field"
                value={lostReason}
                onChange={(e) => setLostReason(e.target.value)}
                placeholder="e.g. Went with a cheaper freelancer"
              />
            </label>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1">
                Mark lost
              </button>
              <button type="button" onClick={() => setLosing(null)} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

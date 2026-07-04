import type { DeliverableStatus } from '../lib/types';
import { DELIVERABLE_STATUS_LABELS } from '../lib/types';

const STYLES: Record<DeliverableStatus, string> = {
  to_do: 'border-graphite/25 text-slate',
  in_progress: 'border-graphite/40 text-graphite',
  ready_for_review: 'border-forge/50 text-forge',
  approved: 'border-graphite text-graphite',
  live: 'border-graphite bg-graphite text-paper',
};

export default function DeliverableStatusPill({
  status,
}: {
  status: DeliverableStatus;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${STYLES[status]}`}
    >
      {DELIVERABLE_STATUS_LABELS[status]}
    </span>
  );
}

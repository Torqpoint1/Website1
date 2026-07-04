import type { PipelineStage } from '../lib/types';
import { STAGE_LABELS } from '../lib/types';

const STYLES: Record<PipelineStage, string> = {
  new_lead: 'border-graphite/25 text-graphite',
  call: 'border-graphite/25 text-graphite',
  quote_sent: 'border-forge/50 text-forge',
  won: 'border-graphite bg-graphite text-paper',
  lost: 'border-graphite/20 text-slate line-through',
};

export default function StagePill({ stage }: { stage: PipelineStage }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${STYLES[stage]}`}
    >
      {STAGE_LABELS[stage]}
    </span>
  );
}

import { useState, type FormEvent } from 'react';
import Modal from './Modal';
import AIPanel from './AIPanel';
import { db } from '../lib/supabase';
import { buildAccountContext } from '../lib/ai';
import {
  DELIVERABLE_STATUSES,
  DELIVERABLE_TYPES,
  DELIVERABLE_TYPE_LABELS,
  type Deliverable,
  type DeliverableStatus,
  type DeliverableType,
} from '../lib/types';

export default function DeliverableModal({
  projectId,
  existing,
  onClose,
  onSaved,
}: {
  projectId: string;
  existing?: Deliverable;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(existing?.title ?? '');
  const [type, setType] = useState<DeliverableType>(existing?.type ?? 'social_posts');
  const [status, setStatus] = useState<DeliverableStatus>(existing?.status ?? 'to_do');
  const [dueDate, setDueDate] = useState(existing?.due_date ?? '');
  const [body, setBody] = useState(existing?.body ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drafting, setDrafting] = useState(false);

  async function deliverableContext() {
    const { data: project } = await db()
      .from('projects')
      .select('account_id, name')
      .eq('id', projectId)
      .single();
    const accountContext = project
      ? await buildAccountContext(project.account_id)
      : {};
    return {
      ...accountContext,
      deliverable: {
        title,
        type: DELIVERABLE_TYPE_LABELS[type],
        brief: body || '(no brief yet)',
        project: project?.name,
      },
    };
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payload = {
      project_id: projectId,
      title: title.trim(),
      type,
      status,
      due_date: dueDate || null,
      body: body.trim() || null,
    };
    const query = existing
      ? db().from('deliverables').update(payload).eq('id', existing.id)
      : db().from('deliverables').insert(payload);
    const { error: err } = await query;
    if (err) {
      setError(err.message);
      setBusy(false);
      return;
    }
    onSaved();
    onClose();
  }

  async function remove() {
    if (!existing) return;
    setBusy(true);
    const { error: err } = await db()
      .from('deliverables')
      .delete()
      .eq('id', existing.id);
    if (err) {
      setError(err.message);
      setBusy(false);
      return;
    }
    onSaved();
    onClose();
  }

  return (
    <Modal title={existing ? 'Edit deliverable' : 'Add deliverable'} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="label-caps text-slate">Title</span>
          <input
            required
            autoFocus={!existing}
            className="field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Oak kitchen case study"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="label-caps text-slate">Type</span>
            <select
              className="field"
              value={type}
              onChange={(e) => setType(e.target.value as DeliverableType)}
            >
              {DELIVERABLE_TYPES.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="label-caps text-slate">Due date</span>
            <input
              type="date"
              className="field"
              value={dueDate ?? ''}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="label-caps text-slate">Status</span>
          <select
            className="field"
            value={status}
            onChange={(e) => setStatus(e.target.value as DeliverableStatus)}
          >
            {DELIVERABLE_STATUSES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="flex items-center justify-between">
            <span className="label-caps text-slate">Content</span>
            <button
              type="button"
              onClick={() => setDrafting(true)}
              className="label-caps text-forge"
            >
              Draft with Claude
            </button>
          </span>
          <textarea
            className="field min-h-36 leading-relaxed"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="The work itself — drafts live here. AI drafting arrives with the AI layer."
          />
        </label>

        {error && <p className="text-sm text-forge">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={busy} className="btn-forge flex-1">
            {busy ? 'Saving…' : existing ? 'Save changes' : 'Add deliverable'}
          </button>
          {existing && (
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="btn-ghost text-slate hover:border-forge hover:text-forge"
            >
              Delete
            </button>
          )}
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
        </div>
      </form>
      {drafting && (
        <AIPanel
          title={`Draft: ${title || 'deliverable'}`}
          action="draft_deliverable"
          getContext={deliverableContext}
          onClose={() => setDrafting(false)}
          insertLabel="Use as content"
          onInsert={(text) => setBody(text)}
        />
      )}
    </Modal>
  );
}

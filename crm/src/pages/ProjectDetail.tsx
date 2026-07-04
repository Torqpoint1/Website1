import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { db } from '../lib/supabase';
import { logSystemActivity } from '../lib/actions';
import { shortDate } from '../lib/format';
import {
  DELIVERABLE_TYPE_LABELS,
  PROJECT_STATUSES,
  type Deliverable,
  type Project,
  type ProjectStatus,
} from '../lib/types';
import PointLoader from '../components/PointLoader';
import Modal from '../components/Modal';
import DeliverableModal from '../components/DeliverableModal';
import DeliverableStatusPill from '../components/DeliverableStatusPill';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Deliverable | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    const [prj, dlv] = await Promise.all([
      db().from('projects').select('*, account:accounts(name)').eq('id', id).single(),
      db()
        .from('deliverables')
        .select('*')
        .eq('project_id', id)
        .order('due_date', { ascending: true, nullsFirst: false }),
    ]);
    if (prj.error ?? dlv.error) {
      setError((prj.error ?? dlv.error)!.message);
      return;
    }
    setProject(prj.data as Project);
    setDeliverables(dlv.data as Deliverable[]);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (error) return <p className="p-6 text-sm text-forge">{error}</p>;
  if (!project) return <PointLoader label="Loading project" />;

  async function setStatus(status: ProjectStatus) {
    await db().from('projects').update({ status }).eq('id', project!.id);
    load();
  }

  async function toggleReadyToInvoice() {
    const next = !project!.ready_to_invoice;
    await db()
      .from('projects')
      .update({ ready_to_invoice: next })
      .eq('id', project!.id);
    if (next) {
      await logSystemActivity(
        project!.account_id,
        `Project “${project!.name}” marked ready to invoice`,
      );
    }
    load();
  }

  async function removeProject() {
    await db()
      .from('tasks')
      .delete()
      .eq('related_type', 'project')
      .eq('related_id', project!.id);
    const { error: err } = await db().from('projects').delete().eq('id', project!.id);
    if (err) {
      setError(err.message);
      return;
    }
    navigate('/projects');
  }

  const live = deliverables.filter((d) => d.status === 'live').length;

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
      <Link to="/projects" className="label-caps text-slate hover:text-graphite">
        ← Projects
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 pt-4">
        <div className="min-w-0">
          <h1 className="font-editorial text-4xl tracking-tight">{project.name}</h1>
          <p className="pt-1.5 text-sm text-slate">
            <Link
              to={`/accounts/${project.account_id}`}
              className="font-semibold text-graphite underline decoration-forge underline-offset-4"
            >
              {project.account?.name}
            </Link>
            {project.start_date && ` · starts ${shortDate(project.start_date)}`}
            {project.due_date && ` · due ${shortDate(project.due_date)}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            aria-label="Project status"
            className="field w-auto py-1.5 text-xs"
            value={project.status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          >
            {PROJECT_STATUSES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ready to invoice */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-3.5">
        <div>
          <p className="font-semibold">
            {project.ready_to_invoice ? 'Ready to invoice' : 'Not ready to invoice yet'}
          </p>
          <p className="text-sm text-slate">
            {live}/{deliverables.length || 0} deliverables live.
            {project.ready_to_invoice &&
              ' Generate the invoice from the Money screen — it pulls this project in.'}
          </p>
        </div>
        <button
          type="button"
          onClick={toggleReadyToInvoice}
          className={project.ready_to_invoice ? 'btn-ghost' : 'btn-forge'}
        >
          {project.ready_to_invoice ? 'Undo' : 'Mark ready to invoice'}
        </button>
      </div>

      {/* Deliverables */}
      <div className="flex items-center justify-between pb-3 pt-10">
        <div className="flex items-center gap-2.5">
          <span className="point" aria-hidden />
          <h2 className="label-caps text-slate">Deliverables</h2>
        </div>
        <button type="button" onClick={() => setAdding(true)} className="label-caps text-forge">
          + Add
        </button>
      </div>
      {deliverables.length === 0 ? (
        <p className="text-sm text-slate">
          Nothing yet — add the pieces of work this project covers.
        </p>
      ) : (
        <ul className="card divide-y divide-line">
          {deliverables.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => setEditing(d)}
                className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-left transition-colors hover:bg-paper"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{d.title}</p>
                  <p className="text-sm text-slate">
                    {DELIVERABLE_TYPE_LABELS[d.type]}
                    {d.due_date && ` · ${shortDate(d.due_date)}`}
                    {d.body && ' · has content'}
                  </p>
                </div>
                <DeliverableStatusPill status={d.status} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-16 border-t border-line pt-6">
        <button
          type="button"
          onClick={() => setDeleting(true)}
          className="label-caps text-slate transition-colors hover:text-forge"
        >
          Delete this project…
        </button>
      </div>

      {adding && (
        <DeliverableModal
          projectId={project.id}
          onClose={() => setAdding(false)}
          onSaved={load}
        />
      )}
      {editing && (
        <DeliverableModal
          projectId={project.id}
          existing={editing}
          onClose={() => setEditing(null)}
          onSaved={load}
        />
      )}
      {deleting && (
        <Modal title="Delete project" onClose={() => setDeleting(false)}>
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed text-slate">
              This removes{' '}
              <span className="font-semibold text-graphite">{project.name}</span> and
              its deliverables. Invoices already raised are kept. No undo.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={removeProject} className="btn-forge flex-1">
                Delete for good
              </button>
              <button
                type="button"
                onClick={() => setDeleting(false)}
                className="btn-ghost"
              >
                Keep it
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

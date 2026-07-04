import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { db } from '../lib/supabase';
import { logSystemActivity } from '../lib/actions';
import { shortDate } from '../lib/format';
import {
  DELIVERABLE_STATUSES,
  DELIVERABLE_TYPE_LABELS,
  type Account,
  type Deliverable,
  type DeliverableStatus,
  type Project,
} from '../lib/types';
import PointLoader from '../components/PointLoader';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import MonthCalendar, { type CalendarEvent } from '../components/MonthCalendar';
import DeliverableModal from '../components/DeliverableModal';

type View = 'projects' | 'board' | 'calendar';

export default function Projects() {
  const [params, setParams] = useSearchParams();
  const view = (params.get('view') as View) ?? 'projects';
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Deliverable | null>(null);

  const load = useCallback(async () => {
    const [prj, dlv] = await Promise.all([
      db()
        .from('projects')
        .select('*, account:accounts(name)')
        .order('created_at', { ascending: false }),
      db()
        .from('deliverables')
        .select('*, project:projects(name, account_id)')
        .order('due_date', { ascending: true, nullsFirst: false }),
    ]);
    if (prj.error ?? dlv.error) {
      setError((prj.error ?? dlv.error)!.message);
      return;
    }
    setProjects(prj.data as Project[]);
    setDeliverables(dlv.data as Deliverable[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (error) return <p className="p-6 text-sm text-forge">{error}</p>;
  if (!projects) return <PointLoader label="Loading projects" />;

  const events: CalendarEvent[] = deliverables
    .filter((d) => d.due_date)
    .map((d) => ({
      id: d.id,
      date: d.due_date!,
      label: d.title,
      sublabel: d.project?.name,
      to: `/projects/${d.project_id}`,
      tone:
        d.status === 'live'
          ? 'graphite'
          : d.status === 'ready_for_review'
            ? 'forge'
            : 'slate',
    }));

  return (
    <div className="px-5 py-8 sm:px-8 lg:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
        <h1 className="font-editorial text-4xl tracking-tight">Projects</h1>
        <button type="button" onClick={() => setCreating(true)} className="btn-forge">
          <span className="h-1.5 w-1.5 bg-paper" aria-hidden />
          New project
        </button>
      </div>

      <div className="flex gap-1.5 pb-8">
        {(
          [
            ['projects', 'Projects'],
            ['board', 'Board'],
            ['calendar', 'Calendar'],
          ] as [View, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setParams(key === 'projects' ? {} : { view: key })}
            className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${
              view === key
                ? 'bg-graphite text-paper'
                : 'border border-graphite/20 text-slate hover:border-graphite'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {view === 'projects' && (
        <ProjectList projects={projects} deliverables={deliverables} />
      )}
      {view === 'board' && (
        <Board deliverables={deliverables} onOpen={setEditing} onChanged={load} />
      )}
      {view === 'calendar' && <MonthCalendar events={events} />}

      {creating && (
        <NewProjectModal onClose={() => setCreating(false)} onCreated={load} />
      )}
      {editing && (
        <DeliverableModal
          projectId={editing.project_id}
          existing={editing}
          onClose={() => setEditing(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}

function ProjectList({
  projects,
  deliverables,
}: {
  projects: Project[];
  deliverables: Deliverable[];
}) {
  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects yet."
        hint="Win a deal, then create the project here to start tracking deliverables. (You set projects up yourself, by design.)"
      />
    );
  }
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => {
        const dlv = deliverables.filter((d) => d.project_id === p.id);
        const done = dlv.filter((d) => d.status === 'live').length;
        return (
          <li key={p.id}>
            <Link to={`/projects/${p.id}`} className="card block p-4 transition-colors hover:bg-paper">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold leading-snug">{p.name}</p>
                {p.ready_to_invoice && (
                  <span className="label-caps shrink-0 text-forge">To invoice</span>
                )}
              </div>
              <p className="pt-0.5 text-sm text-slate">{p.account?.name}</p>
              <div className="flex items-baseline justify-between pt-3">
                <span className="text-sm text-slate">
                  {dlv.length === 0
                    ? 'No deliverables'
                    : `${done}/${dlv.length} live`}
                </span>
                {p.due_date && (
                  <span className="text-xs text-slate">{shortDate(p.due_date)}</span>
                )}
              </div>
              {dlv.length > 0 && (
                <div className="mt-2 flex h-1 overflow-hidden bg-paper-2">
                  <div
                    className="bg-forge"
                    style={{ width: `${(done / dlv.length) * 100}%` }}
                  />
                </div>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Board({
  deliverables,
  onOpen,
  onChanged,
}: {
  deliverables: Deliverable[];
  onOpen: (d: Deliverable) => void;
  onChanged: () => void;
}) {
  const [dragOver, setDragOver] = useState<DeliverableStatus | null>(null);

  async function move(d: Deliverable, status: DeliverableStatus) {
    if (status === d.status) return;
    await db().from('deliverables').update({ status }).eq('id', d.id);
    onChanged();
  }

  return (
    <div className="-mx-5 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8">
      <div className="grid min-w-[64rem] grid-cols-5 gap-4">
        {DELIVERABLE_STATUSES.map((stage) => {
          const items = deliverables.filter((d) => d.status === stage.key);
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
                const id = e.dataTransfer.getData('text/deliverable-id');
                const d = deliverables.find((x) => x.id === id);
                if (d) move(d, stage.key);
              }}
              className={`flex min-h-[55vh] flex-col border transition-colors ${
                dragOver === stage.key
                  ? 'border-forge bg-forge/5'
                  : 'border-line bg-paper-2/60'
              }`}
            >
              <div className="flex items-baseline justify-between border-b border-line px-3.5 py-3">
                <span className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 ${
                      stage.key === 'ready_for_review' || stage.key === 'live'
                        ? 'bg-forge'
                        : 'bg-graphite/30'
                    }`}
                    aria-hidden
                  />
                  <span className="label-caps text-graphite">{stage.label}</span>
                </span>
                <span className="text-xs text-slate">{items.length}</span>
              </div>
              <div className="flex flex-1 flex-col gap-2.5 p-2.5">
                {items.map((d) => (
                  <article
                    key={d.id}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData('text/deliverable-id', d.id)
                    }
                    className="card cursor-grab p-3.5 active:cursor-grabbing"
                  >
                    <button
                      type="button"
                      onClick={() => onOpen(d)}
                      className="text-left font-semibold leading-snug underline-offset-4 hover:underline"
                    >
                      {d.title}
                    </button>
                    <p className="pt-0.5 text-xs text-slate">
                      {DELIVERABLE_TYPE_LABELS[d.type]}
                      {d.project?.name && ` · ${d.project.name}`}
                    </p>
                    {d.due_date && (
                      <p className="pt-2 text-xs text-slate">{shortDate(d.due_date)}</p>
                    )}
                    <select
                      aria-label="Move status"
                      className="mt-2.5 w-full border border-graphite/15 bg-paper px-2 py-1.5 text-xs text-slate"
                      value={d.status}
                      onChange={(e) => move(d, e.target.value as DeliverableStatus)}
                    >
                      {DELIVERABLE_STATUSES.map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </article>
                ))}
                {items.length === 0 && (
                  <p className="px-1 pt-2 text-xs text-slate/70">Nothing here.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NewProjectModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountId, setAccountId] = useState('');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    db()
      .from('accounts')
      .select('*')
      .order('name')
      .then(({ data }) => setAccounts((data ?? []) as Account[]));
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { data, error: err } = await db()
      .from('projects')
      .insert({
        account_id: accountId,
        name: name.trim(),
        status: 'active',
        start_date: startDate || null,
        due_date: dueDate || null,
      })
      .select('id')
      .single();
    if (err) {
      setError(err.message);
      setBusy(false);
      return;
    }
    await logSystemActivity(accountId, `Project “${name.trim()}” created`);
    onCreated();
    onClose();
    navigate(`/projects/${data.id}`);
  }

  return (
    <Modal title="New project" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="label-caps text-slate">Client</span>
          <select
            required
            className="field"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          >
            <option value="" disabled>
              Choose a business…
            </option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="label-caps text-slate">Project name</span>
          <input
            required
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Oak kitchen content pack"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="label-caps text-slate">Start</span>
            <input
              type="date"
              className="field"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="label-caps text-slate">Due</span>
            <input
              type="date"
              className="field"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>
        </div>
        {error && <p className="text-sm text-forge">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={busy} className="btn-forge flex-1">
            {busy ? 'Creating…' : 'Create project'}
          </button>
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

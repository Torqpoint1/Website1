import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { db } from '../lib/supabase';
import { deleteAccount, logSystemActivity, moveDealStage } from '../lib/actions';
import { money, shortDate, timeAgo, isOverdue } from '../lib/format';
import {
  ACCOUNT_STATUSES,
  ACTIVITY_TYPES,
  PIPELINE_STAGES,
  STAGE_LABELS,
  type Account,
  type AccountStatus,
  type Activity,
  type ActivityType,
  type Contact,
  type Deal,
  type FollowUpTask,
  type PipelineStage,
  type Project,
  type Retainer,
} from '../lib/types';
import PointLoader from '../components/PointLoader';
import StagePill from '../components/StagePill';
import Modal from '../components/Modal';
import RetainerSection from '../components/RetainerSection';
import FilesSection from '../components/FilesSection';
import AIPanel from '../components/AIPanel';
import { buildAccountContext, type AIAction } from '../lib/ai';

export default function AccountDetail() {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<FollowUpTask[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [retainer, setRetainer] = useState<Retainer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    const [acc, cts, dls, acts, tks, prjs, rtn] = await Promise.all([
      db().from('accounts').select('*').eq('id', id).single(),
      db().from('contacts').select('*').eq('account_id', id).order('name'),
      db()
        .from('deals')
        .select('*')
        .eq('account_id', id)
        .order('created_at', { ascending: false }),
      db()
        .from('activities')
        .select('*')
        .eq('account_id', id)
        .order('occurred_at', { ascending: false }),
      db()
        .from('tasks')
        .select('*')
        .eq('related_type', 'account')
        .eq('related_id', id)
        .order('due_date', { ascending: true, nullsFirst: false }),
      db()
        .from('projects')
        .select('*')
        .eq('account_id', id)
        .order('created_at', { ascending: false }),
      db()
        .from('retainers')
        .select('*')
        .eq('account_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);
    const firstError =
      acc.error ?? cts.error ?? dls.error ?? acts.error ?? tks.error ?? prjs.error ?? rtn.error;
    if (firstError) {
      setError(firstError.message);
      return;
    }
    setAccount(acc.data as Account);
    setContacts((cts.data ?? []) as Contact[]);
    setDeals((dls.data ?? []) as Deal[]);
    setActivities((acts.data ?? []) as Activity[]);
    setTasks((tks.data ?? []) as FollowUpTask[]);
    setProjects((prjs.data ?? []) as Project[]);
    setRetainer((rtn.data as Retainer) ?? null);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (error) return <p className="p-6 text-sm text-forge">{error}</p>;
  if (!account) return <PointLoader label="Loading account" />;

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
      <Link to="/accounts" className="label-caps text-slate hover:text-graphite">
        ← Leads &amp; Clients
      </Link>

      <Header account={account} onChanged={load} />

      <AISection account={account} onChanged={load} />

      <div className="grid gap-10 pt-10 lg:grid-cols-[1fr_minmax(0,1.2fr)]">
        <div className="flex min-w-0 flex-col gap-10">
          <ContactsSection
            account={account}
            contacts={contacts}
            onChanged={load}
          />
          <ResearchNotes account={account} onSaved={load} />
          <DealsSection account={account} deals={deals} onChanged={load} />
          <ProjectsSection projects={projects} />
          <RetainerSection
            accountId={account.id}
            accountName={account.name}
            retainer={retainer}
            onChanged={load}
          />
          <FilesSection accountId={account.id} />
          <TasksSection accountId={account.id} tasks={tasks} onChanged={load} />
        </div>
        <ActivityLog accountId={account.id} activities={activities} onChanged={load} />
      </div>

      <DangerZone account={account} />
    </div>
  );
}

/* ---------- delete account ---------- */

function DangerZone({ account }: { account: Account }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function confirmDelete() {
    setBusy(true);
    setError(null);
    try {
      await deleteAccount(account.id);
      navigate('/accounts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete.');
      setBusy(false);
    }
  }

  return (
    <div className="mt-16 border-t border-line pt-6">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="label-caps text-slate transition-colors hover:text-forge"
      >
        Delete this account…
      </button>

      {confirming && (
        <Modal title="Delete account" onClose={() => setConfirming(false)}>
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed text-slate">
              This removes{' '}
              <span className="font-semibold text-graphite">{account.name}</span>{' '}
              and everything logged under it — contacts, deals, activity,
              follow-ups, the lot. There's no undo.
            </p>
            {error && <p className="text-sm text-forge">{error}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={confirmDelete}
                disabled={busy}
                className="btn-forge flex-1"
              >
                {busy ? 'Deleting…' : 'Delete for good'}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
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

/* ---------- AI actions ---------- */

const AI_ACTIONS: { key: AIAction; label: string; title: string }[] = [
  { key: 'summarise', label: 'Summarise', title: 'Summary' },
  { key: 'draft_outreach', label: 'Draft outreach', title: 'Outreach draft' },
  { key: 'draft_followup', label: 'Draft follow-up', title: 'Follow-up draft' },
  { key: 'next_move', label: 'Next move', title: 'Suggested next move' },
  { key: 'chase_draft', label: 'Chase draft', title: 'Chase draft' },
  { key: 'lead_research', label: 'Research (web)', title: 'Lead research' },
];

function AISection({
  account,
  onChanged,
}: {
  account: Account;
  onChanged: () => void;
}) {
  const [open, setOpen] = useState<(typeof AI_ACTIONS)[number] | null>(null);

  async function saveResearch(text: string) {
    const existing = account.research_notes?.trim();
    await db()
      .from('accounts')
      .update({
        research_notes: existing ? `${existing}\n\n---\n\n${text}` : text,
      })
      .eq('id', account.id);
    await logSystemActivity(account.id, 'AI research added to notes');
    onChanged();
  }

  return (
    <div className="mt-8 rounded-xl border border-line bg-white px-4 py-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-2 pr-2">
          <span className="point" aria-hidden />
          <span className="label-caps text-slate">Ask Claude</span>
        </span>
        {AI_ACTIONS.map((a) => (
          <button
            key={a.key}
            type="button"
            onClick={() => setOpen(a)}
            className="rounded-lg border border-graphite/20 px-3 py-1.5 text-xs font-semibold text-graphite transition-colors hover:border-forge hover:text-forge"
          >
            {a.label}
          </button>
        ))}
      </div>
      {open && (
        <AIPanel
          title={open.title}
          action={open.key}
          getContext={() => buildAccountContext(account.id)}
          onClose={() => setOpen(null)}
          insertLabel={open.key === 'lead_research' ? 'Save to research notes' : undefined}
          onInsert={open.key === 'lead_research' ? saveResearch : undefined}
        />
      )}
    </div>
  );
}

/* ---------- header ---------- */

function Header({ account, onChanged }: { account: Account; onChanged: () => void }) {
  async function setStatus(status: AccountStatus) {
    await db().from('accounts').update({ status }).eq('id', account.id);
    await logSystemActivity(
      account.id,
      `Status changed to ${ACCOUNT_STATUSES.find((s) => s.key === status)?.label}`,
    );
    onChanged();
  }

  const links = [
    account.website && { label: 'Website', href: withProtocol(account.website) },
    account.instagram && {
      label: 'Instagram',
      href: `https://instagram.com/${account.instagram.replace(/^@/, '')}`,
    },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 pt-4">
      <div className="min-w-0">
        <h1 className="font-editorial text-4xl tracking-tight sm:text-5xl">
          {account.name}
        </h1>
        <p className="pt-1.5 text-sm text-slate">
          {[account.niche, account.location].filter(Boolean).join(' · ') || 'No details yet'}
          {' · '}
          <span className="uppercase tracking-[0.08em]">{account.lead_source}</span>
        </p>
        {links.length > 0 && (
          <p className="flex gap-4 pt-2 text-sm">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-graphite underline decoration-forge underline-offset-4"
              >
                {l.label}
              </a>
            ))}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <StagePill stage={account.pipeline_stage} />
        <select
          aria-label="Account status"
          className="field w-auto py-1.5 text-xs"
          value={account.status}
          onChange={(e) => setStatus(e.target.value as AccountStatus)}
        >
          {ACCOUNT_STATUSES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function withProtocol(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

/* ---------- contacts ---------- */

function ContactsSection({
  account,
  contacts,
  onChanged,
}: {
  account: Account;
  contacts: Contact[];
  onChanged: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', email: '', phone: '' });

  async function submit(e: FormEvent) {
    e.preventDefault();
    const { error } = await db().from('contacts').insert({
      account_id: account.id,
      name: form.name.trim(),
      role: form.role.trim() || null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
    });
    if (!error) {
      setAdding(false);
      setForm({ name: '', role: '', email: '', phone: '' });
      onChanged();
    }
  }

  const hasPrimary =
    account.primary_contact_name ||
    account.primary_contact_email ||
    account.primary_contact_phone;

  return (
    <section>
      <SectionHead label="Contacts">
        <button type="button" onClick={() => setAdding(true)} className="label-caps text-forge">
          + Add
        </button>
      </SectionHead>
      <div className="card divide-y divide-line">
        {hasPrimary && (
          <ContactRow
            name={account.primary_contact_name ?? '—'}
            role={account.primary_contact_role}
            email={account.primary_contact_email}
            phone={account.primary_contact_phone}
            primary
          />
        )}
        {contacts.map((c) => (
          <ContactRow
            key={c.id}
            name={c.name}
            role={c.role}
            email={c.email}
            phone={c.phone}
          />
        ))}
        {!hasPrimary && contacts.length === 0 && (
          <p className="px-4 py-4 text-sm text-slate">No contacts yet.</p>
        )}
      </div>

      {adding && (
        <Modal title="Add contact" onClose={() => setAdding(false)}>
          <form onSubmit={submit} className="flex flex-col gap-3">
            {(
              [
                ['Name', 'name', { required: true, autoFocus: true }],
                ['Role', 'role', {}],
                ['Email', 'email', { type: 'email' }],
                ['Phone', 'phone', { type: 'tel' }],
              ] as const
            ).map(([label, key, props]) => (
              <label key={key} className="flex flex-col gap-1.5">
                <span className="label-caps text-slate">{label}</span>
                <input
                  className="field"
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  {...props}
                />
              </label>
            ))}
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-forge flex-1">
                Save contact
              </button>
              <button type="button" onClick={() => setAdding(false)} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}

function ContactRow({
  name,
  role,
  email,
  phone,
  primary,
}: {
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  primary?: boolean;
}) {
  return (
    <div className="px-4 py-3">
      <p className="flex items-center gap-2 font-semibold">
        {name}
        {primary && <span className="label-caps text-forge">Primary</span>}
      </p>
      <p className="text-sm text-slate">
        {[role, email, phone].filter(Boolean).join(' · ') || '—'}
      </p>
    </div>
  );
}

/* ---------- research notes ---------- */

function ResearchNotes({ account, onSaved }: { account: Account; onSaved: () => void }) {
  const [notes, setNotes] = useState(account.research_notes ?? '');
  const [saved, setSaved] = useState(true);

  async function save() {
    await db()
      .from('accounts')
      .update({ research_notes: notes.trim() || null })
      .eq('id', account.id);
    setSaved(true);
    onSaved();
  }

  return (
    <section>
      <SectionHead label="Research notes">
        {!saved && (
          <button type="button" onClick={save} className="label-caps text-forge">
            Save
          </button>
        )}
      </SectionHead>
      <textarea
        className="field min-h-32 leading-relaxed"
        placeholder="Voice, audience, what they care about — the pre-pitch homework."
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setSaved(false);
        }}
        onBlur={() => {
          if (!saved) save();
        }}
      />
    </section>
  );
}

/* ---------- deals ---------- */

function DealsSection({
  account,
  deals,
  onChanged,
}: {
  account: Account;
  deals: Deal[];
  onChanged: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: '', value: '' });

  async function submit(e: FormEvent) {
    e.preventDefault();
    const value = form.value.trim() === '' ? null : Number(form.value);
    const { error } = await db().from('deals').insert({
      account_id: account.id,
      title: form.title.trim(),
      pipeline_stage: 'new_lead',
      value: Number.isFinite(value as number) ? value : null,
      status: 'open',
    });
    if (!error) {
      await logSystemActivity(account.id, `Deal “${form.title.trim()}” added`);
      setAdding(false);
      setForm({ title: '', value: '' });
      onChanged();
    }
  }

  async function move(deal: Deal, stage: PipelineStage) {
    if (stage === deal.pipeline_stage) return;
    const reason =
      stage === 'lost'
        ? window.prompt('Why was it lost? (optional)') ?? undefined
        : undefined;
    await moveDealStage({ ...deal, account: { name: account.name } }, stage, reason);
    onChanged();
  }

  return (
    <section>
      <SectionHead label="Deals">
        <button type="button" onClick={() => setAdding(true)} className="label-caps text-forge">
          + Add
        </button>
      </SectionHead>
      <div className="card divide-y divide-line">
        {deals.length === 0 && (
          <p className="px-4 py-4 text-sm text-slate">No deals yet.</p>
        )}
        {deals.map((deal) => (
          <div key={deal.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{deal.title}</p>
              <p className="text-sm text-slate">
                {money(deal.value)}
                {deal.lost_reason && ` · ${deal.lost_reason}`}
              </p>
            </div>
            <select
              aria-label={`Stage for ${deal.title}`}
              className="field w-auto py-1.5 text-xs"
              value={deal.pipeline_stage}
              onChange={(e) => move(deal, e.target.value as PipelineStage)}
            >
              {PIPELINE_STAGES.map((s) => (
                <option key={s.key} value={s.key}>
                  {STAGE_LABELS[s.key]}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {adding && (
        <Modal title="Add deal" onClose={() => setAdding(false)}>
          <form onSubmit={submit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="label-caps text-slate">Title</span>
              <input
                required
                autoFocus
                className="field"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Monthly content retainer"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="label-caps text-slate">Value (£)</span>
              <input
                inputMode="decimal"
                className="field"
                value={form.value}
                onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
              />
            </label>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-forge flex-1">
                Add deal
              </button>
              <button type="button" onClick={() => setAdding(false)} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}

/* ---------- projects ---------- */

function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section>
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <span className="point" aria-hidden />
          <h2 className="label-caps text-slate">Projects</h2>
        </div>
        <Link to="/projects" className="label-caps text-forge">
          All projects →
        </Link>
      </div>
      {projects.length === 0 ? (
        <p className="text-sm text-slate">
          No projects yet — create one from the Projects screen when a deal lands.
        </p>
      ) : (
        <ul className="card divide-y divide-line">
          {projects.map((p) => (
            <li key={p.id}>
              <Link
                to={`/projects/${p.id}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-paper"
              >
                <span className="min-w-0 flex-1 truncate font-semibold">{p.name}</span>
                {p.ready_to_invoice && (
                  <span className="label-caps text-forge">To invoice</span>
                )}
                <span className="label-caps text-slate">{p.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ---------- follow-up tasks ---------- */

function TasksSection({
  accountId,
  tasks,
  onChanged,
}: {
  accountId: string;
  tasks: FollowUpTask[];
  onChanged: () => void;
}) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    const { error } = await db().from('tasks').insert({
      related_type: 'account',
      related_id: accountId,
      title: title.trim(),
      due_date: dueDate || null,
    });
    if (!error) {
      setTitle('');
      setDueDate('');
      onChanged();
    }
  }

  async function toggle(task: FollowUpTask) {
    await db().from('tasks').update({ done: !task.done }).eq('id', task.id);
    onChanged();
  }

  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <section>
      <SectionHead label="Follow-ups" />
      <form onSubmit={submit} className="flex flex-wrap gap-2 pb-3">
        <input
          required
          className="field min-w-40 flex-1"
          placeholder="e.g. Chase the quote"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          aria-label="Due date"
          className="field w-auto shrink-0"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit" className="btn-primary shrink-0 px-4">
          Add
        </button>
      </form>
      {tasks.length === 0 ? (
        <p className="text-sm text-slate">Nothing scheduled. Calm, not naggy.</p>
      ) : (
        <ul className="card divide-y divide-line">
          {[...open, ...done].map((task) => (
            <li key={task.id} className="flex items-center gap-3 px-4 py-2.5">
              <button
                type="button"
                onClick={() => toggle(task)}
                aria-label={task.done ? 'Reopen' : 'Mark done'}
                className={`h-4 w-4 shrink-0 rounded border transition-colors ${
                  task.done
                    ? 'border-forge bg-forge'
                    : 'border-graphite/40 hover:border-forge'
                }`}
              />
              <span
                className={`min-w-0 flex-1 truncate text-sm ${
                  task.done ? 'text-slate line-through' : ''
                }`}
              >
                {task.title}
              </span>
              {task.due_date && !task.done && (
                <span
                  className={`label-caps ${
                    isOverdue(task.due_date) ? 'text-forge' : 'text-slate'
                  }`}
                >
                  {isOverdue(task.due_date) ? 'Overdue' : shortDate(task.due_date)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ---------- activity log ---------- */

function ActivityLog({
  accountId,
  activities,
  onChanged,
}: {
  accountId: string;
  activities: Activity[];
  onChanged: () => void;
}) {
  const [type, setType] = useState<ActivityType>('note');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await db()
      .from('activities')
      .insert({ account_id: accountId, type, body: body.trim() });
    setBusy(false);
    if (!error) {
      setBody('');
      onChanged();
    }
  }

  return (
    <section className="min-w-0">
      <SectionHead label="Activity — log everything" />
      <form onSubmit={submit} className="card flex flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-1.5">
          {ACTIVITY_TYPES.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setType(t.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${
                type === t.key
                  ? 'bg-graphite text-paper'
                  : 'border border-graphite/20 text-slate hover:border-graphite'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <textarea
          required
          className="field min-h-20"
          placeholder="What happened?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button type="submit" disabled={busy} className="btn-forge self-start">
          Log it
        </button>
      </form>

      <ol className="pt-6">
        {activities.length === 0 && (
          <p className="text-sm text-slate">Nothing logged yet.</p>
        )}
        {activities.map((a) => (
          <li key={a.id} className="relative border-l border-line pb-6 pl-5 last:pb-0">
            <span
              className={`absolute -left-[4.5px] top-1 h-2 w-2 ${
                a.type === 'system' ? 'bg-graphite/30' : 'bg-forge'
              }`}
              aria-hidden
            />
            <p className="label-caps text-slate">
              {a.type} · {timeAgo(a.occurred_at)}
            </p>
            <p
              className={`pt-1 text-sm leading-relaxed ${
                a.type === 'system' ? 'text-slate' : 'text-graphite'
              }`}
            >
              {a.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- shared ---------- */

function SectionHead({
  label,
  children,
}: {
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between pb-3">
      <div className="flex items-center gap-2.5">
        <span className="point" aria-hidden />
        <h2 className="label-caps text-slate">{label}</h2>
      </div>
      {children}
    </div>
  );
}

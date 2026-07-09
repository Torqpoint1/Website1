import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { db } from '../lib/supabase';
import { shortDate } from '../lib/format';
import type { Deliverable, FollowUpTask, Project, WorkEvent } from '../lib/types';
import MonthCalendar, { type CalendarEvent } from '../components/MonthCalendar';
import PointLoader from '../components/PointLoader';
import Modal from '../components/Modal';
import { getCached, setCached } from '../lib/pageCache';

export default function CalendarPage() {
  const [entries, setEntries] = useState<CalendarEvent[] | null>(() =>
    getCached<CalendarEvent[]>('calendar-entries'),
  );
  const [events, setEvents] = useState<WorkEvent[]>(
    () => getCached<WorkEvent[]>('calendar-events') ?? [],
  );
  const [eventsReady, setEventsReady] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    const [dlv, tks, prj, evs] = await Promise.all([
      db()
        .from('deliverables')
        .select('*, project:projects(name, account_id)')
        .not('due_date', 'is', null)
        .neq('status', 'live'),
      db().from('tasks').select('*').not('due_date', 'is', null).eq('done', false),
      db()
        .from('projects')
        .select('*')
        .not('due_date', 'is', null)
        .eq('status', 'active'),
      db().from('events').select('*').order('event_date', { ascending: true }),
    ]);
    const err = dlv.error ?? tks.error ?? prj.error;
    if (err) {
      setError(err.message);
      return;
    }
    let workEvents: WorkEvent[] = [];
    if (evs.error) {
      if (evs.error.code === '42P01') setEventsReady(false);
      else {
        setError(evs.error.message);
        return;
      }
    } else {
      workEvents = (evs.data ?? []) as WorkEvent[];
      setEventsReady(true);
    }
    const nextEntries: CalendarEvent[] = [
      ...workEvents.map((e) => ({
        id: `e-${e.id}`,
        date: e.event_date,
        label: e.start_time ? `${e.start_time.slice(0, 5)} ${e.title}` : e.title,
        tone: 'graphite' as const,
      })),
      ...((dlv.data ?? []) as Deliverable[]).map((d) => ({
        id: `d-${d.id}`,
        date: d.due_date!,
        label: d.title,
        sublabel: d.project?.name,
        to: `/projects/${d.project_id}`,
        tone: 'forge' as const,
      })),
      ...((tks.data ?? []) as FollowUpTask[]).map((t) => ({
        id: `t-${t.id}`,
        date: t.due_date!,
        label: t.title,
        to: t.related_type === 'account' ? `/accounts/${t.related_id}` : undefined,
        tone: 'slate' as const,
      })),
      ...((prj.data ?? []) as Project[]).map((p) => ({
        id: `p-${p.id}`,
        date: p.due_date!,
        label: `${p.name} due`,
        to: `/projects/${p.id}`,
        tone: 'slate' as const,
      })),
    ];
    setCached('calendar-events', workEvents);
    setCached('calendar-entries', nextEntries);
    setEvents(workEvents);
    setEntries(nextEntries);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function removeEvent(event: WorkEvent) {
    await db().from('events').delete().eq('id', event.id);
    load();
  }

  if (error) return <p className="p-6 text-sm text-forge">{error}</p>;
  if (!entries) return <PointLoader label="Loading the calendar" />;

  const upcoming = events
    .filter((e) => e.event_date >= new Date().toISOString().slice(0, 10))
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
      <div className="flex items-center justify-between gap-4 pb-8">
        <h1 className="font-editorial text-4xl tracking-tight">Calendar</h1>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="btn-forge shrink-0"
        >
          <span className="h-1.5 w-1.5 bg-paper" aria-hidden />
          Add event
        </button>
      </div>

      <MonthCalendar events={entries} />

      <div className="mt-6 flex flex-wrap gap-5 text-xs text-slate">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-graphite" aria-hidden /> Event / call
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-forge" aria-hidden /> Deliverable deadline
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm border border-line bg-paper-2" aria-hidden />{' '}
          Follow-up / project due
        </span>
      </div>

      {/* Upcoming events */}
      <section className="mt-12">
        <div className="flex items-center gap-2.5 pb-3">
          <span className="point" aria-hidden />
          <h2 className="label-caps text-slate">Upcoming events</h2>
        </div>
        {!eventsReady ? (
          <p className="text-sm text-slate">
            Events need one switch-on step — ask Claude for the short SQL paste,
            then refresh.
          </p>
        ) : upcoming.length === 0 ? (
          <p className="text-sm text-slate">
            Nothing booked — add calls, shoots and meetings with the button above.
          </p>
        ) : (
          <ul className="card divide-y divide-line">
            {upcoming.map((e) => (
              <li key={e.id} className="flex items-center gap-3 px-4 py-3">
                <span className="w-24 shrink-0 text-xs text-slate">
                  {shortDate(e.event_date)}
                  {e.start_time && ` · ${e.start_time.slice(0, 5)}`}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{e.title}</p>
                  {e.notes && (
                    <p className="truncate text-xs text-slate">{e.notes}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeEvent(e)}
                  aria-label={`Delete ${e.title}`}
                  className="px-1 text-slate transition-colors hover:text-forge"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12 rounded-xl border border-line bg-white p-5">
        <div className="flex items-center gap-2.5 pb-3">
          <span className="point" aria-hidden />
          <h2 className="label-caps text-slate">See these in Google Calendar</h2>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-slate">
          The CRM publishes a private calendar feed that Google can subscribe
          to — every deadline, follow-up and event here appears in your Google
          Calendar automatically, no logins connected. Once the feed is
          switched on (one approval tap), open Google Calendar → next to
          “Other calendars” tap <span className="font-semibold text-graphite">+</span>{' '}
          → <span className="font-semibold text-graphite">From URL</span> → paste your
          private feed address. Google refreshes it every few hours.
        </p>
      </section>

      {adding && (
        <AddEventModal
          onClose={() => setAdding(false)}
          onSaved={load}
          needsSetup={!eventsReady}
        />
      )}
    </div>
  );
}

function AddEventModal({
  onClose,
  onSaved,
  needsSetup,
}: {
  onClose: () => void;
  onSaved: () => void;
  needsSetup: boolean;
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(
    needsSetup
      ? 'Events need one switch-on step first — ask Claude for the short SQL paste.'
      : null,
  );

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await db().from('events').insert({
      title: title.trim(),
      event_date: date,
      start_time: time || null,
      notes: notes.trim() || null,
    });
    if (err) {
      setError(
        err.code === '42P01'
          ? 'Events need one switch-on step first — ask Claude for the short SQL paste.'
          : err.message,
      );
      setBusy(false);
      return;
    }
    onSaved();
    onClose();
  }

  return (
    <Modal title="Add event" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="label-caps text-slate">What</span>
          <input
            required
            autoFocus
            className="field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Shoot at Ashcroft Joinery"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="label-caps text-slate">Date</span>
            <input
              type="date"
              required
              className="field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="label-caps text-slate">Time (optional)</span>
            <input
              type="time"
              className="field"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="label-caps text-slate">Notes (optional)</span>
          <input
            className="field"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. bring the gimbal"
          />
        </label>

        {error && <p className="text-sm text-forge">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={busy} className="btn-forge flex-1">
            {busy ? 'Saving…' : 'Add event'}
          </button>
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

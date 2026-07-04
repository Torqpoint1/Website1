import { useEffect, useState } from 'react';
import { db } from '../lib/supabase';
import type { Deliverable, FollowUpTask, Project } from '../lib/types';
import MonthCalendar, { type CalendarEvent } from '../components/MonthCalendar';
import PointLoader from '../components/PointLoader';

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [dlv, tks, prj] = await Promise.all([
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
      ]);
      const err = dlv.error ?? tks.error ?? prj.error;
      if (err) {
        setError(err.message);
        return;
      }
      setEvents([
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
          tone: 'graphite' as const,
        })),
        ...((prj.data ?? []) as Project[]).map((p) => ({
          id: `p-${p.id}`,
          date: p.due_date!,
          label: `${p.name} due`,
          to: `/projects/${p.id}`,
          tone: 'slate' as const,
        })),
      ]);
    })();
  }, []);

  if (error) return <p className="p-6 text-sm text-forge">{error}</p>;
  if (!events) return <PointLoader label="Loading the calendar" />;

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
      <h1 className="pb-8 font-editorial text-4xl tracking-tight">Calendar</h1>

      <MonthCalendar events={events} />

      <div className="mt-6 flex flex-wrap gap-5 text-xs text-slate">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 bg-forge" aria-hidden /> Deliverable deadline
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 bg-graphite" aria-hidden /> Follow-up / call
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 border border-line bg-paper-2" aria-hidden /> Project due
        </span>
      </div>

      <section className="mt-12 border border-line bg-white p-5">
        <div className="flex items-center gap-2.5 pb-3">
          <span className="point" aria-hidden />
          <h2 className="label-caps text-slate">See these in Google Calendar</h2>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-slate">
          The CRM publishes a private calendar feed that Google can subscribe
          to — every deadline and follow-up here appears in your Google
          Calendar automatically, no logins connected. Once the feed is
          switched on (one approval tap), open Google Calendar → next to
          “Other calendars” tap <span className="font-semibold text-graphite">+</span>{' '}
          → <span className="font-semibold text-graphite">From URL</span> → paste your
          private feed address. Google refreshes it every few hours.
        </p>
      </section>
    </div>
  );
}

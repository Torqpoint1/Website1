// Secret-token ICS feed so Google Calendar can subscribe to CRM deadlines —
// no OAuth needed. Requires two env vars (approval tap):
//   SUPABASE_SERVICE_ROLE_KEY — server-side read access (never sent to browsers)
//   CALENDAR_FEED_TOKEN       — long random string; part of the private feed URL

function icsEscape(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function icsDate(date: string): string {
  return date.replaceAll('-', '');
}

function nextDay(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10).replaceAll('-', '');
}

interface FeedEvent {
  id: string;
  date: string;
  title: string;
  description: string;
}

export default async function handler(req: any, res: any) {
  const token = req.query?.token;
  const expected = process.env.CALENDAR_FEED_TOKEN;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!expected || !serviceKey || !supabaseUrl) {
    res.status(503).send('Calendar feed is not configured yet.');
    return;
  }
  if (token !== expected) {
    res.status(401).send('Invalid feed token.');
    return;
  }

  const headers = {
    apikey: serviceKey,
    authorization: `Bearer ${serviceKey}`,
  };
  const get = async (path: string) => {
    const r = await fetch(`${supabaseUrl}/rest/v1/${path}`, { headers });
    return r.ok ? r.json() : [];
  };

  const [deliverables, tasks, projects] = await Promise.all([
    get('deliverables?select=id,title,due_date,status,project:projects(name)&due_date=not.is.null&status=neq.live'),
    get('tasks?select=id,title,due_date&due_date=not.is.null&done=eq.false'),
    get('projects?select=id,name,due_date&due_date=not.is.null&status=eq.active'),
  ]);

  const events: FeedEvent[] = [
    ...deliverables.map((d: any) => ({
      id: `dlv-${d.id}`,
      date: d.due_date,
      title: `${d.title} due`,
      description: `Torqpoint CRM deliverable${d.project?.name ? ` — ${d.project.name}` : ''}`,
    })),
    ...tasks.map((t: any) => ({
      id: `task-${t.id}`,
      date: t.due_date,
      title: t.title,
      description: 'Torqpoint CRM follow-up',
    })),
    ...projects.map((p: any) => ({
      id: `prj-${p.id}`,
      date: p.due_date,
      title: `${p.name} — project due`,
      description: 'Torqpoint CRM project deadline',
    })),
  ];

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Torqpoint//CRM//EN',
    'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:Torqpoint CRM',
    'X-WR-CALDESC:Deliverable deadlines and follow-ups from the Torqpoint CRM',
    ...events.flatMap((e) => [
      'BEGIN:VEVENT',
      `UID:${e.id}@torqpoint-crm`,
      `DTSTAMP:${icsDate(new Date().toISOString().slice(0, 10))}T000000Z`,
      `DTSTART;VALUE=DATE:${icsDate(e.date)}`,
      `DTEND;VALUE=DATE:${nextDay(e.date)}`,
      `SUMMARY:${icsEscape(e.title)}`,
      `DESCRIPTION:${icsEscape(e.description)}`,
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ];

  res.setHeader('content-type', 'text/calendar; charset=utf-8');
  res.setHeader('cache-control', 'no-cache');
  res.status(200).send(lines.join('\r\n'));
}

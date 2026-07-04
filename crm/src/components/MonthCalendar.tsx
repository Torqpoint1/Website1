import { useState } from 'react';
import { Link } from 'react-router-dom';

export interface CalendarEvent {
  id: string;
  date: string; // yyyy-mm-dd
  label: string;
  sublabel?: string;
  to?: string;
  tone?: 'forge' | 'graphite' | 'slate';
}

const DAY_HEADS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

export default function MonthCalendar({ events }: { events: CalendarEvent[] }) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const byDate = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    if (!byDate.has(e.date)) byDate.set(e.date, []);
    byDate.get(e.date)!.push(e);
  }

  const firstWeekday = (cursor.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(
    cursor.getFullYear(),
    cursor.getMonth() + 1,
    0,
  ).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1),
    ),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const todayKey = ymd(new Date());

  const toneClass = {
    forge: 'bg-forge text-paper',
    graphite: 'bg-graphite text-paper',
    slate: 'bg-paper-2 text-graphite border border-line',
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <p className="font-editorial text-2xl">
          {cursor.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </p>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
            }
            className="btn-ghost px-3 py-1.5"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => {
              const now = new Date();
              setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
            }}
            className="btn-ghost px-3 py-1.5 text-xs"
          >
            Today
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
            }
            className="btn-ghost px-3 py-1.5"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-line bg-line">
        {DAY_HEADS.map((d) => (
          <div key={d} className="bg-paper-2 px-2 py-1.5">
            <span className="label-caps text-slate">{d}</span>
          </div>
        ))}
        {cells.map((date, i) => {
          const key = date ? ymd(date) : `empty-${i}`;
          const dayEvents = date ? byDate.get(key) ?? [] : [];
          return (
            <div key={key} className="min-h-20 bg-white p-1.5 sm:min-h-24">
              {date && (
                <>
                  <span
                    className={`inline-flex h-5 w-5 items-center justify-center text-xs font-semibold ${
                      key === todayKey ? 'bg-forge text-paper' : 'text-slate'
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  <div className="flex flex-col gap-1 pt-1">
                    {dayEvents.slice(0, 3).map((e) => {
                      const chip = (
                        <span
                          className={`block truncate rounded px-1.5 py-0.5 text-[10px] font-semibold leading-tight ${
                            toneClass[e.tone ?? 'slate']
                          }`}
                          title={`${e.label}${e.sublabel ? ` — ${e.sublabel}` : ''}`}
                        >
                          {e.label}
                        </span>
                      );
                      return e.to ? (
                        <Link key={e.id} to={e.to}>
                          {chip}
                        </Link>
                      ) : (
                        <span key={e.id}>{chip}</span>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <span className="px-1.5 text-[10px] text-slate">
                        +{dayEvents.length - 3} more
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

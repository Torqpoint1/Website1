import type { ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const NAV = [
  { to: '/', label: 'Dashboard', short: 'Home', icon: 'home', end: true },
  { to: '/pipeline', label: 'Pipeline', short: 'Pipeline', icon: 'pipeline', end: false },
  { to: '/accounts', label: 'Leads & Clients', short: 'Clients', icon: 'clients', end: false },
  { to: '/projects', label: 'Projects', short: 'Projects', icon: 'projects', end: false },
  { to: '/money', label: 'Finance', short: 'Finance', icon: 'money', end: false },
  { to: '/calendar', label: 'Calendar', short: 'Calendar', icon: 'calendar', end: false },
] as const;

function TabIcon({ name }: { name: (typeof NAV)[number]['icon'] }) {
  const paths: Record<string, ReactNode> = {
    home: (
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1v-9.5Z" />
    ),
    pipeline: (
      <>
        <rect x="4" y="4" width="4.5" height="16" rx="1" />
        <rect x="10" y="4" width="4.5" height="10" rx="1" />
        <rect x="16" y="4" width="4.5" height="13" rx="1" />
      </>
    ),
    clients: (
      <>
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M5 20c.8-3.2 3.6-5 7-5s6.2 1.8 7 5" />
      </>
    ),
    projects: (
      <>
        <rect x="4" y="4" width="7" height="7" rx="1" />
        <rect x="13" y="4" width="7" height="7" rx="1" />
        <rect x="4" y="13" width="7" height="7" rx="1" />
        <rect x="13" y="13" width="7" height="7" rx="1" />
      </>
    ),
    money: (
      <>
        <rect x="3" y="6.5" width="18" height="11" rx="1.5" />
        <circle cx="12" cy="12" r="2.8" />
      </>
    ),
    calendar: (
      <>
        <rect x="4" y="5.5" width="16" height="15" rx="1.5" />
        <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
      </>
    ),
  };
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}

function navClasses(isActive: boolean) {
  return [
    'group flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors',
    isActive ? 'text-paper' : 'text-paper/60 hover:text-paper',
  ].join(' ');
}

export default function Layout() {
  return (
    <div className="min-h-dvh lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col bg-graphite lg:flex">
        <div className="sticky top-0 flex h-dvh flex-col">
          <div className="flex items-baseline gap-1.5 px-6 pb-10 pt-8">
            <span className="font-display text-2xl font-bold tracking-tight text-paper">
              Torqpoint
            </span>
            <span className="point" aria-hidden />
          </div>
          <nav className="flex flex-col gap-1 px-2">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end}>
                {({ isActive }) => (
                  <span className={navClasses(isActive)}>
                    <span
                      className={`h-2 w-2 shrink-0 transition-colors ${
                        isActive ? 'bg-forge' : 'bg-transparent group-hover:bg-paper/20'
                      }`}
                      aria-hidden
                    />
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3 px-6 pb-6">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `label-caps transition-colors ${
                  isActive ? 'text-paper' : 'text-paper/50 hover:text-paper'
                }`
              }
            >
              Settings
            </NavLink>
            <button
              type="button"
              onClick={() => supabase?.auth.signOut()}
              className="label-caps text-left text-paper/50 transition-colors hover:text-paper"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-graphite px-5 py-4 lg:hidden">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-xl font-bold tracking-tight text-paper">
            Torqpoint
          </span>
          <span className="point" aria-hidden />
        </div>
        <div className="flex items-center gap-4">
          <NavLink to="/settings" className="label-caps text-paper/60">
            Settings
          </NavLink>
          <button
            type="button"
            onClick={() => supabase?.auth.signOut()}
            className="label-caps text-paper/60"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="min-w-0 flex-1 pb-24 lg:pb-0">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line-dark bg-graphite px-1 pb-[env(safe-area-inset-bottom)] lg:hidden">
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className="min-w-0 flex-1">
            {({ isActive }) => (
              <span
                className={`flex flex-col items-center gap-1 pb-2 pt-2.5 transition-colors ${
                  isActive ? 'text-forge' : 'text-paper/45'
                }`}
              >
                <TabIcon name={item.icon} />
                <span
                  className={`truncate text-[9px] font-semibold tracking-wide ${
                    isActive ? 'text-paper' : ''
                  }`}
                >
                  {item.short}
                </span>
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

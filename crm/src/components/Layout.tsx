import { NavLink, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const NAV = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/pipeline', label: 'Pipeline', end: false },
  { to: '/accounts', label: 'Leads & Clients', end: false },
];

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
          <div className="mt-auto px-6 pb-6">
            <button
              type="button"
              onClick={() => supabase?.auth.signOut()}
              className="label-caps text-paper/50 transition-colors hover:text-paper"
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
        <button
          type="button"
          onClick={() => supabase?.auth.signOut()}
          className="label-caps text-paper/60"
        >
          Sign out
        </button>
      </header>

      <main className="min-w-0 flex-1 pb-24 lg:pb-0">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line-dark bg-graphite pb-[env(safe-area-inset-bottom)] lg:hidden">
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className="flex-1">
            {({ isActive }) => (
              <span
                className={`flex flex-col items-center gap-1.5 py-3 text-[11px] font-semibold ${
                  isActive ? 'text-paper' : 'text-paper/50'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 ${isActive ? 'bg-forge' : 'bg-transparent'}`}
                  aria-hidden
                />
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

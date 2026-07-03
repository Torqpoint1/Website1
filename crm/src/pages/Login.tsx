import { useState, type FormEvent } from 'react';
import { db } from '../lib/supabase';

export default function Login() {
  const [mode, setMode] = useState<'sign_in' | 'first_time'>('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      if (mode === 'sign_in') {
        const { error } = await db().auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await db().auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) {
          setMessage('Check your inbox — confirm the email, then sign in here.');
        }
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-graphite px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-baseline gap-1.5 pb-2">
          <span className="font-display text-3xl font-bold tracking-tight text-paper">
            Torqpoint
          </span>
          <span className="point-lg" aria-hidden />
        </div>
        <p className="pb-8 font-editorial text-lg italic text-paper/70">
          The point of leverage.
        </p>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="label-caps text-paper/60">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="label-caps text-paper/60">Password</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete={mode === 'sign_in' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field"
            />
          </label>
          <button type="submit" disabled={busy} className="btn-forge mt-2">
            {busy ? 'One moment…' : mode === 'sign_in' ? 'Sign in' : 'Create my login'}
          </button>
        </form>

        {message && <p className="pt-4 text-sm text-paper/80">{message}</p>}

        <button
          type="button"
          onClick={() => setMode(mode === 'sign_in' ? 'first_time' : 'sign_in')}
          className="pt-6 text-sm text-paper/50 underline-offset-4 transition-colors hover:text-paper hover:underline"
        >
          {mode === 'sign_in' ? 'First time? Create your login' : 'Already set up? Sign in'}
        </button>
      </div>
    </div>
  );
}

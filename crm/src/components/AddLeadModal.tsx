import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { db } from '../lib/supabase';
import { createLead, type NewLeadForm } from '../lib/actions';
import { LEAD_SOURCES } from '../lib/types';

const EMPTY: NewLeadForm = {
  name: '',
  niche: '',
  location: '',
  website: '',
  instagram: '',
  lead_source: 'outbound',
  contact_name: '',
  contact_role: '',
  contact_email: '',
  contact_phone: '',
  deal_title: '',
  deal_value: '',
};

export default function AddLeadModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated?: () => void;
}) {
  const [form, setForm] = useState<NewLeadForm>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existing, setExisting] = useState<{ id: string; name: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    db()
      .from('accounts')
      .select('id, name')
      .then(({ data }) => setExisting((data ?? []) as { id: string; name: string }[]));
  }, []);

  const typed = form.name.trim().toLowerCase();
  const duplicate =
    typed.length >= 3
      ? existing.find(
          (a) =>
            a.name.toLowerCase() === typed ||
            a.name.toLowerCase().includes(typed) ||
            typed.includes(a.name.toLowerCase()),
        )
      : undefined;

  function set<K extends keyof NewLeadForm>(key: K, value: NewLeadForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const accountId = await createLead(form);
      onCreated?.();
      onClose();
      navigate(`/accounts/${accountId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the lead.');
      setBusy(false);
    }
  }

  const input = (label: string, key: keyof NewLeadForm, props: object = {}) => (
    <label className="flex flex-col gap-1.5">
      <span className="label-caps text-slate">{label}</span>
      <input
        className="field"
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        {...props}
      />
    </label>
  );

  return (
    <Modal title="New lead" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        {input('Business name', 'name', { required: true, autoFocus: true })}
        {duplicate && (
          <p className="-mt-2 text-sm text-slate">
            Looks like{' '}
            <Link
              to={`/accounts/${duplicate.id}`}
              onClick={onClose}
              className="font-semibold text-forge underline underline-offset-4"
            >
              {duplicate.name}
            </Link>{' '}
            is already in here — open it instead of adding twice?
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          {input('Niche', 'niche', { placeholder: 'e.g. Bespoke joinery' })}
          {input('Location', 'location', { placeholder: 'e.g. Stroud' })}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {input('Website', 'website', { placeholder: 'https://…', inputMode: 'url' })}
          {input('Instagram', 'instagram', { placeholder: '@handle' })}
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="label-caps text-slate">Lead source</span>
          <select
            className="field"
            value={form.lead_source}
            onChange={(e) => set('lead_source', e.target.value as NewLeadForm['lead_source'])}
          >
            {LEAD_SOURCES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-2.5 pt-2">
          <span className="point" aria-hidden />
          <span className="label-caps text-slate">Contact</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {input('Name', 'contact_name')}
          {input('Role', 'contact_role')}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {input('Email', 'contact_email', { type: 'email' })}
          {input('Phone', 'contact_phone', { type: 'tel' })}
        </div>

        <div className="flex items-center gap-2.5 pt-2">
          <span className="point" aria-hidden />
          <span className="label-caps text-slate">Opportunity</span>
        </div>
        {input('Deal title', 'deal_title', {
          placeholder: 'e.g. Case study + social pack',
        })}
        {input('Estimated value (£)', 'deal_value', {
          inputMode: 'decimal',
          placeholder: 'Leave blank if unknown',
        })}

        {error && <p className="text-sm text-forge">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={busy} className="btn-forge flex-1">
            {busy ? 'Saving…' : 'Add lead'}
          </button>
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

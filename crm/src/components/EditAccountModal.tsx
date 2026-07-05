import { useState, type FormEvent } from 'react';
import Modal from './Modal';
import { db } from '../lib/supabase';
import { LEAD_SOURCES, type Account, type LeadSource } from '../lib/types';

export default function EditAccountModal({
  account,
  onClose,
  onSaved,
}: {
  account: Account;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: account.name,
    niche: account.niche ?? '',
    location: account.location ?? '',
    website: account.website ?? '',
    instagram: account.instagram ?? '',
    tiktok: account.tiktok ?? '',
    other_socials: account.other_socials ?? '',
    lead_source: account.lead_source,
    primary_contact_name: account.primary_contact_name ?? '',
    primary_contact_role: account.primary_contact_role ?? '',
    primary_contact_email: account.primary_contact_email ?? '',
    primary_contact_phone: account.primary_contact_phone ?? '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const clean = (v: string) => (v.trim() === '' ? null : v.trim());
    const { error: err } = await db()
      .from('accounts')
      .update({
        name: form.name.trim(),
        niche: clean(form.niche),
        location: clean(form.location),
        website: clean(form.website),
        instagram: clean(form.instagram),
        tiktok: clean(form.tiktok),
        other_socials: clean(form.other_socials),
        lead_source: form.lead_source,
        primary_contact_name: clean(form.primary_contact_name),
        primary_contact_role: clean(form.primary_contact_role),
        primary_contact_email: clean(form.primary_contact_email),
        primary_contact_phone: clean(form.primary_contact_phone),
      })
      .eq('id', account.id);
    if (err) {
      setError(err.message);
      setBusy(false);
      return;
    }
    onSaved();
    onClose();
  }

  const input = (
    label: string,
    key: keyof typeof form,
    props: object = {},
  ) => (
    <label className="flex flex-col gap-1.5">
      <span className="label-caps text-slate">{label}</span>
      <input
        className="field"
        value={form[key]}
        onChange={(e) => set(key, e.target.value as never)}
        {...props}
      />
    </label>
  );

  return (
    <Modal title={`Edit ${account.name}`} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        {input('Business name', 'name', { required: true })}
        <div className="grid grid-cols-2 gap-3">
          {input('Niche', 'niche')}
          {input('Location', 'location')}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {input('Website', 'website', { inputMode: 'url' })}
          {input('Instagram', 'instagram')}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {input('TikTok', 'tiktok')}
          {input('Other socials', 'other_socials')}
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="label-caps text-slate">Lead source</span>
          <select
            className="field"
            value={form.lead_source}
            onChange={(e) => set('lead_source', e.target.value as LeadSource)}
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
          <span className="label-caps text-slate">Primary contact</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {input('Name', 'primary_contact_name')}
          {input('Role', 'primary_contact_role')}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {input('Email', 'primary_contact_email', { type: 'email' })}
          {input('Phone', 'primary_contact_phone', { type: 'tel' })}
        </div>

        {error && <p className="text-sm text-forge">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={busy} className="btn-forge flex-1">
            {busy ? 'Saving…' : 'Save changes'}
          </button>
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

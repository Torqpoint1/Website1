import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { db } from '../lib/supabase';
import type { Asset, AssetKind } from '../lib/types';
import Modal from './Modal';

function kindOf(asset: Asset): AssetKind {
  if (asset.type === 'link') return 'link';
  if (asset.type === 'location') return 'location';
  return 'file';
}

const KIND_LABEL: Record<AssetKind, string> = {
  file: 'Uploaded',
  link: 'Link',
  location: 'On your computer',
};

export default function FilesSection({ accountId }: { accountId: string }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await db()
      .from('assets')
      .select('*')
      .eq('account_id', accountId)
      .order('uploaded_at', { ascending: false });
    setAssets((data ?? []) as Asset[]);
  }, [accountId]);

  useEffect(() => {
    load();
  }, [load]);

  async function open(asset: Asset) {
    setError(null);
    const kind = kindOf(asset);
    if (kind === 'link') {
      window.open(asset.storage_path, '_blank', 'noreferrer');
      return;
    }
    if (kind === 'location') {
      await navigator.clipboard.writeText(asset.storage_path);
      setCopiedId(asset.id);
      setTimeout(() => setCopiedId(null), 2000);
      return;
    }
    const { data, error: err } = await db()
      .storage.from('assets')
      .createSignedUrl(asset.storage_path, 3600);
    if (err || !data?.signedUrl) {
      setError(
        'Could not open the file — if uploads are new, the storage step may need running (ask Claude).',
      );
      return;
    }
    window.open(data.signedUrl, '_blank', 'noreferrer');
  }

  async function remove(asset: Asset) {
    if (kindOf(asset) === 'file') {
      await db().storage.from('assets').remove([asset.storage_path]);
    }
    await db().from('assets').delete().eq('id', asset.id);
    load();
  }

  return (
    <section>
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <span className="point" aria-hidden />
          <h2 className="label-caps text-slate">Files</h2>
        </div>
        <button type="button" onClick={() => setAdding(true)} className="label-caps text-forge">
          + Add
        </button>
      </div>

      {error && <p className="pb-2 text-sm text-forge">{error}</p>}

      {assets.length === 0 ? (
        <p className="text-sm text-slate">
          Nothing yet — upload a file, link a Drive/Dropbox folder, or note
          where something lives on your computer.
        </p>
      ) : (
        <ul className="card divide-y divide-line">
          {assets.map((asset) => {
            const kind = kindOf(asset);
            return (
              <li key={asset.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{asset.name}</p>
                  <p className="truncate text-xs text-slate">
                    {KIND_LABEL[kind]}
                    {kind === 'location' && ` · ${asset.storage_path}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => open(asset)}
                  className="btn-ghost px-3 py-1.5 text-xs"
                >
                  {kind === 'location'
                    ? copiedId === asset.id
                      ? 'Copied ✓'
                      : 'Copy path'
                    : 'Open'}
                </button>
                <button
                  type="button"
                  onClick={() => remove(asset)}
                  aria-label={`Remove ${asset.name}`}
                  className="px-1 text-slate transition-colors hover:text-forge"
                >
                  ×
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {adding && (
        <AddAssetModal
          accountId={accountId}
          onClose={() => setAdding(false)}
          onSaved={load}
        />
      )}
    </section>
  );
}

function AddAssetModal({
  accountId,
  onClose,
  onSaved,
}: {
  accountId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [mode, setMode] = useState<AssetKind>('link');
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === 'file') {
        const file = fileRef.current?.files?.[0];
        if (!file) throw new Error('Choose a file first.');
        const path = `${accountId}/${Date.now()}-${file.name.replace(/[^\w.\-() ]/g, '_')}`;
        const { error: upErr } = await db()
          .storage.from('assets')
          .upload(path, file);
        if (upErr) {
          throw new Error(
            upErr.message.toLowerCase().includes('bucket')
              ? 'Uploads need a one-off storage step in Supabase — ask Claude for the paste. (Links and location notes work now.)'
              : upErr.message,
          );
        }
        const { error: insErr } = await db().from('assets').insert({
          account_id: accountId,
          name: name.trim() || file.name,
          storage_path: path,
          type: file.type || 'file',
        });
        if (insErr) throw insErr;
      } else {
        if (!value.trim()) throw new Error('Fill in the details first.');
        const { error: insErr } = await db().from('assets').insert({
          account_id: accountId,
          name: name.trim() || (mode === 'link' ? 'Link' : 'File location'),
          storage_path: value.trim(),
          type: mode,
        });
        if (insErr) throw insErr;
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
      setBusy(false);
    }
  }

  return (
    <Modal title="Add file" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex gap-1.5">
          {(
            [
              ['link', 'Link'],
              ['file', 'Upload'],
              ['location', 'On my computer'],
            ] as [AssetKind, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${
                mode === key
                  ? 'bg-graphite text-paper'
                  : 'border border-graphite/20 text-slate hover:border-graphite'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="label-caps text-slate">Name</span>
          <input
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Brand kit"
          />
        </label>

        {mode === 'link' && (
          <label className="flex flex-col gap-1.5">
            <span className="label-caps text-slate">Web address</span>
            <input
              required
              inputMode="url"
              className="field"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Google Drive / Dropbox / iCloud share link"
            />
          </label>
        )}
        {mode === 'location' && (
          <label className="flex flex-col gap-1.5">
            <span className="label-caps text-slate">Where it lives</span>
            <input
              required
              className="field"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. Mac → Documents/Clients/Ashcroft/Brand kit"
            />
            <span className="text-xs text-slate">
              Browsers can't open files on your computer directly — this keeps
              the address on record with a one-tap copy.
            </span>
          </label>
        )}
        {mode === 'file' && (
          <label className="flex flex-col gap-1.5">
            <span className="label-caps text-slate">File</span>
            <input ref={fileRef} type="file" required className="field" />
            <span className="text-xs text-slate">
              Stored safely in the CRM — open it from any device.
            </span>
          </label>
        )}

        {error && <p className="text-sm text-forge">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={busy} className="btn-forge flex-1">
            {busy ? 'Saving…' : 'Add'}
          </button>
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

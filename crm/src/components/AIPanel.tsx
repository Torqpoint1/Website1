import { useEffect, useState } from 'react';
import Modal from './Modal';
import { runAI, type AIAction } from '../lib/ai';

export default function AIPanel({
  title,
  action,
  getContext,
  onClose,
  insertLabel,
  onInsert,
}: {
  title: string;
  action: AIAction;
  getContext: () => Promise<Record<string, unknown>>;
  onClose: () => void;
  insertLabel?: string;
  onInsert?: (text: string) => void | Promise<void>;
}) {
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setText(null);
    setError(null);
    try {
      const context = await getContext();
      setText(await runAI(action, context));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function copy() {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Modal title={title} onClose={onClose}>
      {!text && !error && (
        <div className="flex flex-col items-center gap-4 py-12">
          <span className="point-lg point-loading" aria-hidden />
          <span className="label-caps text-slate">Claude is on it</span>
        </div>
      )}
      {error && (
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-relaxed text-forge">{error}</p>
          <button type="button" onClick={generate} className="btn-ghost self-start">
            Try again
          </button>
        </div>
      )}
      {text && (
        <div className="flex flex-col gap-4">
          <div className="max-h-[55vh] overflow-y-auto whitespace-pre-wrap rounded-lg border border-line bg-white p-4 text-sm leading-relaxed">
            {text}
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={copy} className="btn-primary">
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
            {onInsert && (
              <button
                type="button"
                onClick={async () => {
                  await onInsert(text);
                  onClose();
                }}
                className="btn-forge"
              >
                {insertLabel ?? 'Use this'}
              </button>
            )}
            <button type="button" onClick={generate} className="btn-ghost">
              Regenerate
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

import type { ReactNode } from 'react';

export default function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-graphite/20 bg-white/50 px-6 py-10">
      <span className="point" aria-hidden />
      <p className="font-editorial text-xl text-graphite">{title}</p>
      {hint && <p className="max-w-md text-sm text-slate">{hint}</p>}
      {action}
    </div>
  );
}

export default function PointLoader({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
      <span className="point-lg point-loading" aria-hidden />
      <span className="label-caps text-slate">{label ?? 'Loading'}</span>
    </div>
  );
}

export default function Setup() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-graphite px-6">
      <div className="max-w-md">
        <div className="flex items-baseline gap-1.5 pb-8">
          <span className="font-display text-3xl font-bold tracking-tight text-paper">
            Torqpoint
          </span>
          <span className="point-lg" aria-hidden />
        </div>
        <p className="font-editorial text-2xl leading-snug text-paper">
          Nearly there — the CRM just needs its database connected.
        </p>
        <p className="pt-4 text-sm leading-relaxed text-paper/70">
          This is the Supabase approval step. Once the project is created and
          its keys are added to the hosting environment, this screen is
          replaced by your login. Nothing for you to fix here — if you can see
          this, tell Claude and it will walk you through the one tap needed.
        </p>
      </div>
    </div>
  );
}

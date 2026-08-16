export function DashboardHeader() {
  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-6 py-7 text-white shadow-lg shadow-blue-500/30 sm:px-8">
      <span aria-hidden className="absolute left-10 top-3 text-xl text-white/40">✦</span>
      <span aria-hidden className="absolute right-16 bottom-3 text-2xl text-white/30">✦</span>
      <span aria-hidden className="absolute right-6 top-8 text-sm text-white/30">✦</span>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-sky-300/20 blur-2xl"
      />

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Creative Performance Dashboard
            </h1>
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur">
              Creative Analytics
            </span>
          </div>
          <p className="mt-1.5 text-sm font-medium text-blue-50">Performance Marketing Analytics</p>
        </div>
      </div>
    </header>
  );
}

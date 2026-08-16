export function DashboardHeader() {
  return (
    <header className="rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-6 py-5 text-white shadow-lg shadow-blue-500/20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Creative Performance Dashboard
            </h1>
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide backdrop-blur">
              Creative Analytics
            </span>
          </div>
          <p className="mt-1 text-sm text-blue-100">Performance Marketing Analytics</p>
        </div>
      </div>
    </header>
  );
}

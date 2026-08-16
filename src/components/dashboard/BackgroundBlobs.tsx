export function BackgroundBlobs() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-blue-50"
    >
      <div className="animate-blob-float absolute -top-32 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-blue-400 to-sky-300 opacity-30 blur-3xl" />
      <div className="animate-blob-float-slow absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 opacity-25 blur-3xl" />
      <div className="animate-blob-float absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-sky-300 to-cyan-200 opacity-30 blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/60 to-blue-50" />
    </div>
  );
}

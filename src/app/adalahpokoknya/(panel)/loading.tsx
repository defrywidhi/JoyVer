export default function Loading() {
  return (
    <div className="animate-pulse space-y-5" aria-busy="true" aria-label="Memuat halaman">
      <div className="h-9 w-48 rounded-xl bg-clover-green/15" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 rounded-card bg-white" />
        ))}
      </div>
      <div className="space-y-px overflow-hidden rounded-card border border-deep-green/10 bg-white">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between px-5 py-4">
            <div className="space-y-2">
              <div className="h-4 w-40 rounded-full bg-deep-green/10" />
              <div className="h-3 w-56 rounded-full bg-deep-green/5" />
            </div>
            <div className="h-6 w-20 rounded-full bg-clover-soft" />
          </div>
        ))}
      </div>
    </div>
  );
}

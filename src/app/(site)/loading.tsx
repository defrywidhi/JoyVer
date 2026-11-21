export default function Loading() {
  return (
    <main
      className="mx-auto max-w-6xl animate-pulse px-5 py-12"
      aria-busy="true"
      aria-label="Memuat halaman"
    >
      <div className="h-10 w-64 rounded-xl bg-clover-green/15" />
      <div className="mt-4 h-4 w-full max-w-md rounded-full bg-deep-green/10" />
      <div className="mt-2 h-4 w-3/4 max-w-sm rounded-full bg-deep-green/10" />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="overflow-hidden rounded-card border border-deep-green/10 bg-white">
            <div className="aspect-[4/3] bg-clover-soft" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-24 rounded-full bg-clover-green/15" />
              <div className="h-6 w-3/4 rounded-lg bg-deep-green/10" />
              <div className="h-4 w-full rounded-full bg-deep-green/10" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

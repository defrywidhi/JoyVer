export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${rating} dari 5 bintang`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`size-5 ${i <= rating ? "text-golden-yellow" : "text-deep-green/15"}`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6L10 15.1 4.7 18l1.1-6L1.4 7.8l6-.8L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

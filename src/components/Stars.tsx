export function Stars({ rating, count }: { rating: number; count?: number }) {
  const full = Math.round(rating);
  return (
    <span className="stars" title={`${rating.toFixed(1)} out of 5`}>
      <span aria-hidden>{'★'.repeat(full)}<span className="stars-empty">{'★'.repeat(5 - full)}</span></span>
      <span className="sr-only">{rating.toFixed(1)} out of 5</span>
      {count !== undefined && <span className="muted"> ({count.toLocaleString()})</span>}
    </span>
  );
}

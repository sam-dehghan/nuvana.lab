export function PlaceholderBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return <span className="placeholder-badge">Platzhalter</span>;
}

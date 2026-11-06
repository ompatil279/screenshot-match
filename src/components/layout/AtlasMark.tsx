export function AtlasMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden>
      <rect width="28" height="28" rx="7.5" className="fill-foreground" />
      <circle cx="14" cy="14" r="7.25" fill="none" strokeWidth="1.4" className="stroke-background" opacity="0.55" />
      <ellipse cx="14" cy="14" rx="3.2" ry="7.25" fill="none" strokeWidth="1.4" className="stroke-background" opacity="0.55" />
      <path d="M8.5 19.5 14 7.5l5.5 12" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-background" />
    </svg>
  );
}

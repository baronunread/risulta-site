export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path fill="currentColor" d="M9 23C10 15 16 9 25 8C22 14 15 19 9 23Z" />
      <path
        d="M10.5 21.3C14 17 18 13 21.8 10"
        fill="none"
        className="stroke-background"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

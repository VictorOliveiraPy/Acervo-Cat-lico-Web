/**
 * Marca do Compêndio: cruz em losango, do protótipo aprovado. Um traço só, no
 * bordô da marca, e sempre decorativa: o nome do site vai em texto ao lado.
 */
export function BrandMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      aria-hidden="true"
      fill="none"
      className={`shrink-0 text-accent ${className}`}
    >
      <path d="M22 2 41 22 22 42 3 22Z" stroke="currentColor" strokeWidth="1.1" />
      <path d="M22 7v30M7 22h30" stroke="currentColor" strokeWidth="2.7" />
      <path
        d="M17 12 22 7l5 5m-10 20 5 5 5-5M12 17l-5 5 5 5m20-10 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

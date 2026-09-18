type Props = {
  size?: number;
  className?: string;
};

/**
 * Selo de São Carlos Acutis — cruz e halo (iconografia tradicional de
 * santidade) descendo até uma fileira de pixels, em referência ao trabalho
 * dele catalogando milagres eucarísticos no site que ele mesmo construiu.
 * Um traço só (`currentColor`), sem retrato: mesma moderação ornamental do
 * resto do acervo, não um mascote.
 */
export function SeloCarlosAcutis({ size = 44, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={className ?? "text-gold"}
    >
      <g stroke="currentColor" fill="none" strokeLinecap="round">
        <line x1="50" y1="4" x2="50" y2="14" strokeWidth="2.5" />
        <line x1="45" y1="8" x2="55" y2="8" strokeWidth="2.5" />
        <line x1="50" y1="18" x2="50" y2="26" strokeWidth="2" />
        <line x1="32" y1="24" x2="37" y2="30" strokeWidth="2" />
        <line x1="68" y1="24" x2="63" y2="30" strokeWidth="2" />
        <line x1="20" y1="38" x2="27" y2="40" strokeWidth="2" />
        <line x1="80" y1="38" x2="73" y2="40" strokeWidth="2" />
        <circle cx="50" cy="52" r="34" strokeWidth="2.5" />
      </g>
      <g fill="currentColor">
        <rect x="30" y="70" width="6" height="6" />
        <rect x="41" y="70" width="6" height="6" />
        <rect x="52" y="70" width="6" height="6" />
        <rect x="63" y="70" width="6" height="6" />
      </g>
    </svg>
  );
}

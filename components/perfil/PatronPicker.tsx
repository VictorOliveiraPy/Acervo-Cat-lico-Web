import { PATRONS, type PatronId } from "@/lib/padroeiros";

/** Um botão por santo; o escolhido fica marcado. Quem usa decide o que fazer com a escolha. */
export function PatronPicker({
  selected,
  onChoose,
}: {
  selected: PatronId | null;
  onChoose: (id: PatronId) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {PATRONS.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={option.id === selected}
          onClick={() => onChoose(option.id)}
          className={`flex min-h-[36px] items-center gap-2 rounded-full border bg-surface py-1 pl-1.5 pr-3 text-meta transition-colors ${
            option.id === selected
              ? "border-accent font-semibold text-accent"
              : "border-border text-ink hover:border-accent"
          }`}
        >
          <span
            aria-hidden="true"
            className="h-5 w-5 rounded-full border border-border"
            style={{
              background: `linear-gradient(135deg, ${option.cores.tunica} 50%, ${option.cores.manto ?? option.cores.tunica} 50%)`,
            }}
          />
          {option.nomeCurto}
        </button>
      ))}
    </div>
  );
}

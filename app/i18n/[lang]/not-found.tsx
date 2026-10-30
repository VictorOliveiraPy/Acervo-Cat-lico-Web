import { StatusMessage } from "@/components/Editorial";

/** Fica sem texto por idioma: o `lang` da rota não chega a este arquivo. */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-shell px-4 py-16 sm:px-6">
      <StatusMessage title="404">
        <p>
          <a href="/" className="text-accent underline underline-offset-4">
            compendio-catolico.com
          </a>
        </p>
      </StatusMessage>
    </div>
  );
}

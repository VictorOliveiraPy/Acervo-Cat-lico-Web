import { paragraphs } from "@/lib/entryDisplay";
import { entryTocLinks, type EntrySectionFields } from "@/lib/entrySections";

const HEADING = "font-display text-title-md text-ink";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-10 max-w-measure">
      <h2 id={id} className={`scroll-mt-32 ${HEADING}`}>
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-body text-ink">{children}</div>
    </section>
  );
}

function Prose({ text }: { text: string }) {
  return (
    <>
      {paragraphs(text).map((block, index) => (
        <p key={index}>{block}</p>
      ))}
    </>
  );
}

/** Sumário no corpo do artigo; telas grandes usam o da lateral (`PageToc`). */
export function EntrySectionsToc({ entry }: { entry: EntrySectionFields }) {
  const links = entryTocLinks(entry);
  if (links.length === 0) return null;

  return (
    <nav aria-label="Seções do artigo" className="mt-8 rounded-panel border border-border bg-surface p-4 lg:hidden">
      <p className="kicker">Neste artigo</p>
      <ul className="mt-2 flex flex-col gap-1">
        {links.map(({ href, label }) => (
          <li key={href}>
            <a href={href} className="text-meta text-accent underline-offset-4 hover:underline">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Seções opcionais do verbete. Só aparece a que tem conteúdo. */
export function EntrySections({ entry }: { entry: EntrySectionFields }) {
  return (
    <>
      {entry.biografia.map(({ titulo, texto }, index) => (
        <Section key={titulo} id={`biografia-${index + 1}`} title={titulo}>
          <Prose text={texto} />
        </Section>
      ))}
      {entry.oracao ? (
        <Section id="oracao" title="Oração">
          <blockquote className="border-l-2 border-border-strong pl-6 font-display text-lead italic">
            <p className="whitespace-pre-line">{entry.oracao}</p>
          </blockquote>
        </Section>
      ) : null}
      {entry.frases.length > 0 ? (
        <Section id="frases" title="Frases">
          <ul className="space-y-3">
            {entry.frases.map((frase) => (
              <li key={frase} className="border-l-2 border-border pl-4 italic">
                {frase}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
      {entry.iconografia ? (
        <Section id="iconografia" title="Iconografia">
          <Prose text={entry.iconografia} />
        </Section>
      ) : null}
      {entry.curiosidades.length > 0 ? (
        <Section id="curiosidades" title="Curiosidades">
          <ul className="list-disc space-y-2 pl-5">
            {entry.curiosidades.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>
      ) : null}
      {entry.faq.length > 0 ? (
        <Section id="faq" title="Perguntas frequentes">
          {entry.faq.map(({ pergunta, resposta }) => (
            <div key={pergunta}>
              <h3 className="font-display text-title-sm text-ink">{pergunta}</h3>
              <div className="mt-1 space-y-3">
                <Prose text={resposta} />
              </div>
            </div>
          ))}
        </Section>
      ) : null}
    </>
  );
}

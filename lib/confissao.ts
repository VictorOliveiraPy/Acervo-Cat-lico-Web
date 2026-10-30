/**
 * Conteúdo fixo da preparação para a confissão, igual para todo mundo.
 *
 * As respostas de cada pessoa não passam por este módulo. Só a data da última
 * confissão é guardada, e só neste navegador; o exame fica na memória da tela.
 */

export const EXAME: ReadonlyArray<{
  numero: string;
  titulo: string;
  perguntas: readonly string[];
}> = [
  {
    numero: "1º",
    titulo: "Amar a Deus sobre todas as coisas",
    perguntas: [
      "Deixei de rezar por vários dias?",
      "Busquei horóscopo, simpatias ou superstições?",
      "Tive vergonha de mostrar minha fé?",
    ],
  },
  {
    numero: "2º",
    titulo: "Não tomar seu santo nome em vão",
    perguntas: [
      "Usei o nome de Deus com raiva ou em brincadeira?",
      "Fiz uma promessa a Deus e não cumpri?",
    ],
  },
  {
    numero: "3º",
    titulo: "Guardar domingos e festas",
    perguntas: [
      "Faltei à Missa no domingo ou dia santo sem motivo grave?",
      "Fiquei distraído na Missa por descuido?",
    ],
  },
  {
    numero: "4º",
    titulo: "Honrar pai e mãe",
    perguntas: [
      "Fui desrespeitoso ou ingrato com meus pais?",
      "Descuidei de alguém da família que precisava de mim?",
    ],
  },
  {
    numero: "5º",
    titulo: "Não matar",
    perguntas: [
      "Guardei rancor ou desejei mal a alguém?",
      "Recusei perdoar?",
      "Prejudiquei minha saúde com excessos?",
    ],
  },
  {
    numero: "6º e 9º",
    titulo: "Castidade",
    perguntas: [
      "Consenti em pensamentos ou conteúdos impuros?",
      "Faltei com a castidade própria do meu estado de vida?",
    ],
  },
  {
    numero: "7º e 10º",
    titulo: "Não roubar nem cobiçar",
    perguntas: [
      "Peguei ou deixei de devolver algo que não é meu?",
      "Fui desonesto no trabalho ou nos estudos?",
      "Tive inveja do que os outros têm?",
    ],
  },
  {
    numero: "8º",
    titulo: "Não levantar falso testemunho",
    perguntas: ["Menti?", "Falei mal de alguém pelas costas?"],
  },
];

export const CINCO_PASSOS: ReadonlyArray<{ nome: string; detalhe: string }> = [
  { nome: "Exame de consciência", detalhe: ", com calma e sinceridade." },
  { nome: "Arrependimento", detalhe: " por ter ofendido a Deus." },
  { nome: "Propósito", detalhe: " firme de não pecar mais." },
  { nome: "Confessar", detalhe: " os pecados ao sacerdote." },
  { nome: "Cumprir a penitência", detalhe: " recebida." },
];

/**
 * Texto do apêndice "Orações comuns" do Compêndio do Catecismo. A edição do Vaticano
 * está na grafia de Portugal; só "Ámen" foi adaptado para "Amém".
 */
export const ATO_DE_CONTRICAO =
  "Meu Deus, porque sois infinitamente bom e Vos amo de todo o meu coração, pesa-me de Vos ter ofendido e, com o auxílio da Vossa divina graça, proponho firmemente emendar-me e nunca mais Vos tornar a ofender. Peço e espero o perdão das minhas culpas pela Vossa infinita misericórdia. Amém.";

export const ATO_DE_CONTRICAO_FONTE = {
  nome: "Compêndio do Catecismo da Igreja Católica, Apêndice A",
  url: "https://www.vatican.va/archive/compendium_ccc/documents/archive_2005_compendium-ccc_po.html",
};

const LAST_CONFESSION_KEY = "compendio:ultima-confissao";

/** A data é o único dado da confissão que sobrevive à tela, e só neste navegador. */
export function readLastConfession(): string {
  try {
    const value = localStorage.getItem(LAST_CONFESSION_KEY) ?? "";
    return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
  } catch {
    return "";
  }
}

export function saveLastConfession(iso: string): void {
  try {
    if (iso) localStorage.setItem(LAST_CONFESSION_KEY, iso);
    else localStorage.removeItem(LAST_CONFESSION_KEY);
  } catch {
    // Navegador sem armazenamento: a data só não fica salva para a próxima visita.
  }
}

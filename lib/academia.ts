import type { CategorySlug } from "@/lib/schemas";

/**
 * Lições da Academia da Fé.
 *
 * O conteúdo mora aqui porque o backend não tem aulas nem contas: nada de API
 * inventada para sustentar a tela. Os artigos do acervo continuam públicos; a
 * lição é um caminho a mais para estudar, nunca uma condição para ler.
 *
 * Não há pontos, XP nem níveis, e oração não entra aqui como atividade: a
 * regra aprovada é não gamificar a oração nem a santidade.
 */

export type LessonOption = {
  id: string;
  text: string;
};

export type Lesson = {
  slug: string;
  module: string;
  title: string;
  subtitle: string;
  /**
   * `pending` mantém a lição fora do sitemap, com `noindex` e um aviso visível.
   * Só uma pessoa revisora troca para `reviewed`: conteúdo doutrinal não se
   * publica como definitivo sem revisão humana.
   */
  review: "pending" | "reviewed";
  concept: {
    title: string;
    paragraphs: readonly string[];
    /** Termos exibidos lado a lado como apoio visual da explicação. */
    highlights: readonly string[];
  };
  sources: readonly string[];
  quiz: {
    question: string;
    prompt: string;
    options: readonly LessonOption[];
    correctId: string;
    onCorrect: string;
    onWrong: string;
  };
  completion: {
    title: string;
    text: string;
  };
  /** Verbetes reais do acervo; o primeiro é o artigo de referência da lição. */
  relatedEntries: readonly { categoria: CategorySlug; slug: string }[];
  /** Santo apresentado com discrição ao lado da lição, nunca como mascote. */
  contextSaint?: { slug: string; note: string };
};

export const LESSONS: readonly Lesson[] = [
  {
    slug: "santissima-trindade",
    module: "Fundamentos da Fé",
    title: "Santíssima Trindade",
    subtitle: "O mistério central da fé cristã: um só Deus em três Pessoas.",
    review: "pending",
    concept: {
      title: "Um Deus, três Pessoas.",
      paragraphs: [
        "O cristianismo professa um só Deus, não três. Nesse único Deus há três Pessoas distintas: Pai, Filho e Espírito Santo. Nenhuma delas é menos Deus que as outras.",
        "Não são três deuses, nem três maneiras diferentes de chamar a mesma Pessoa. Cada uma das três Pessoas é plenamente Deus, e todas compartilham a única natureza divina.",
      ],
      highlights: ["Pai", "Filho", "Espírito Santo"],
    },
    sources: [
      "Catecismo da Igreja Católica, nn. 232–267, especialmente nn. 253–255",
      "Evangelho segundo Mateus 28,19",
    ],
    quiz: {
      question: "Qual afirmação está correta?",
      prompt:
        "Escolha a alternativa que expressa o ensinamento católico sobre a Santíssima Trindade.",
      options: [
        { id: "a", text: "Há três deuses independentes: o Pai, o Filho e o Espírito Santo." },
        { id: "b", text: "Há um só Deus em três Pessoas distintas." },
        { id: "c", text: "O Pai, o Filho e o Espírito Santo são apenas três nomes da mesma Pessoa." },
      ],
      correctId: "b",
      onCorrect:
        "A fé católica afirma um só Deus, em três Pessoas realmente distintas, da mesma natureza divina.",
      onWrong:
        "A Igreja não ensina que existem três deuses, nem que Pai, Filho e Espírito Santo são apenas três nomes da mesma Pessoa. Você pode mudar a resposta ou rever a explicação.",
    },
    completion: {
      title: "Conceito compreendido.",
      text: "Você identificou corretamente o ensinamento católico sobre a Santíssima Trindade. A aprendizagem continua com a leitura do artigo e dos documentos citados.",
    },
    relatedEntries: [
      { categoria: "catecismo", slug: "santissima-trindade" },
      { categoria: "crisma", slug: "santissima-trindade" },
    ],
    contextSaint: {
      slug: "patricio-da-irlanda",
      note: "A tradição popular irlandesa associa São Patrício ao trevo, como imagem para falar da Trindade.",
    },
  },
];

export function lessonBySlug(slug: string): Lesson | null {
  return LESSONS.find((lesson) => lesson.slug === slug) ?? null;
}

/** A lição ligada a um verbete, para o artigo oferecer o estudo guiado. */
export function lessonForEntry(categoria: string, slug: string): Lesson | null {
  return (
    LESSONS.find((lesson) =>
      lesson.relatedEntries.some((entry) => entry.categoria === categoria && entry.slug === slug),
    ) ?? null
  );
}

/** Só o que já passou por revisão humana vai para buscadores. */
export function indexableLessons(): Lesson[] {
  return LESSONS.filter((lesson) => lesson.review === "reviewed");
}

/** A resposta certa é decidida aqui, num só lugar, e não dentro da tela. */
export function isCorrectAnswer(lesson: Lesson, optionId: string): boolean {
  return lesson.quiz.correctId === optionId;
}

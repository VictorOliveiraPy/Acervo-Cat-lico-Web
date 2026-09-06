/**
 * Cliente HTTP genérico do acervo.
 *
 * Cuida só do transporte: monta a URL base, serializa query string, trata
 * status de erro e valida o corpo da resposta contra um schema Zod. Regra de
 * domínio (quais rotas existem, o que fazer com um 404) mora nos serviços em
 * `lib/services/`; componente nenhum chama `apiGet` direto.
 *
 * A validação Zod aqui não é preciosismo: a resposta da API é entrada externa,
 * e um campo que mudou de forma deve estourar num ponto único e legível — não
 * virar `undefined` renderizado no meio da página.
 */

import type { ZodType } from "zod";
import { z } from "zod";

const DEFAULT_BASE_URL = "http://localhost:8000/api";

/** Cache padrão das leituras: o acervo é curado, muda em ritmo editorial. */
const DEFAULT_REVALIDATE_SECONDS = 300;

/** Contrato de erro do backend: `code` é estável, `message` é texto de UX. */
const apiErrorPayloadSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).default({}),
});

/** Códigos que o frontend trata de forma específica (o resto é erro genérico). */
export const ERROR_CODE = {
  categoryNotFound: "CATEGORY_NOT_FOUND",
  entryNotFound: "ENTRY_NOT_FOUND",
  validation: "VALIDATION_ERROR",
  network: "NETWORK_ERROR",
  malformedResponse: "MALFORMED_RESPONSE",
} as const;

/** Falha de uma chamada à API, já normalizada para uso na interface. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    code: string,
    details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  /** Verdadeiro quando o recurso pedido não existe (categoria ou entrada). */
  get isNotFound(): boolean {
    return this.status === 404;
  }
}

export type QueryParams = Record<string, string | number | boolean | undefined>;

export type GetOptions = {
  query?: QueryParams;
  /** Janela de revalidação do cache do Next, em segundos. */
  revalidateSeconds?: number;
};

/**
 * URL base da API, sempre sem barra final para concatenação previsível.
 *
 * Usa `||`, não `??`: uma env var configurada como string vazia (acontece
 * ao criar a variável na Vercel sem preencher o valor) deve cair no
 * default local, não virar uma URL relativa que quebra o `fetch` com
 * "Failed to parse URL from /categories".
 */
export function getApiBaseUrl(): string {
  const raw = process.env.API_URL || DEFAULT_BASE_URL;
  return raw.replace(/\/+$/, "");
}

/**
 * Monta a query string ignorando parâmetros ausentes.
 *
 * Exportada porque a construção de links de paginação e de filtro na busca
 * precisa exatamente da mesma regra — duplicá-la geraria `?q=undefined`.
 */
export function buildQueryString(query: QueryParams = {}): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === "") continue;
    params.set(key, String(value));
  }
  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

/** Extrai mensagem legível de um valor desconhecido lançado num `catch`. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Erro inesperado ao falar com o acervo.";
}

async function readErrorPayload(
  response: Response,
): Promise<{ code: string; message: string; details: Record<string, unknown> }> {
  try {
    const parsed = apiErrorPayloadSchema.safeParse(await response.json());
    if (parsed.success) return parsed.data;
  } catch {
    // Corpo não-JSON (proxy, gateway, HTML de erro): cai no texto genérico
    // abaixo em vez de mascarar o status real da resposta.
  }
  return {
    code: `HTTP_${response.status}`,
    message: `O acervo respondeu com erro ${response.status}.`,
    details: {},
  };
}

/**
 * Executa um GET na API e devolve o corpo já validado pelo schema.
 *
 * Lança `ApiError` em qualquer caminho de falha (rede, status >= 400 ou corpo
 * fora do contrato), para que quem chama tenha um único tipo a tratar.
 *
 * Genérico em `S extends ZodType` (não `ZodType<T>`) de propósito: os
 * schemas do acervo usam `.default()` (ex: `tags` vira opcional na entrada,
 * obrigatório na saída) — `Input` e `Output` do Zod diferem. Fixar
 * `ZodType<T>` força os dois a serem iguais e quebra a inferência de tipo
 * ("Two different types with this name exist, but they are unrelated",
 * erro real encontrado ao rodar `npm run typecheck`). `z.output<S>` lê
 * exatamente o tipo de SAÍDA do schema, que é o que `safeParse` devolve.
 */
export async function apiGet<S extends ZodType>(
  path: string,
  schema: S,
  { query, revalidateSeconds = DEFAULT_REVALIDATE_SECONDS }: GetOptions = {},
): Promise<z.output<S>> {
  const url = `${getApiBaseUrl()}${path}${buildQueryString(query)}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: revalidateSeconds },
    });
  } catch (error: unknown) {
    throw new ApiError(
      `Não foi possível falar com o acervo (${getErrorMessage(error)}).`,
      503,
      ERROR_CODE.network,
    );
  }

  if (!response.ok) {
    const payload = await readErrorPayload(response);
    throw new ApiError(
      payload.message,
      response.status,
      payload.code,
      payload.details,
    );
  }

  const parsed = schema.safeParse(await response.json());
  if (!parsed.success) {
    throw new ApiError(
      `A resposta de ${path} não corresponde ao formato esperado do acervo.`,
      502,
      ERROR_CODE.malformedResponse,
      { issues: parsed.error.issues },
    );
  }
  return parsed.data;
}

/**
 * Executa um POST na API com corpo JSON e devolve a resposta validada.
 *
 * Existe à parte de `apiGet` porque é a única escrita do site (mural de
 * velas): sem cache (`cache: "no-store"`, explícito — uma mutação nunca deve
 * herdar o `revalidate` padrão do `fetch` do Next por descuido) e sem
 * parâmetro de query, só corpo.
 */
export async function apiPost<S extends ZodType>(
  path: string,
  body: unknown,
  schema: S,
): Promise<z.output<S>> {
  const url = `${getApiBaseUrl()}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch (error: unknown) {
    throw new ApiError(
      `Não foi possível falar com o acervo (${getErrorMessage(error)}).`,
      503,
      ERROR_CODE.network,
    );
  }

  if (!response.ok) {
    const payload = await readErrorPayload(response);
    throw new ApiError(
      payload.message,
      response.status,
      payload.code,
      payload.details,
    );
  }

  const parsed = schema.safeParse(await response.json());
  if (!parsed.success) {
    throw new ApiError(
      `A resposta de ${path} não corresponde ao formato esperado do acervo.`,
      502,
      ERROR_CODE.malformedResponse,
      { issues: parsed.error.issues },
    );
  }
  return parsed.data;
}

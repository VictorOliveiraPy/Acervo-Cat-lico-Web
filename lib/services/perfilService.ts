/**
 * Serviço do perfil e do ranking. Só roda no servidor: o segredo que atesta quem
 * está logado nunca pode ir para o navegador.
 */

import { z } from "zod";

import { ApiError, apiGet, getApiBaseUrl } from "@/lib/api";
import {
  favoriteSchema,
  noteSchema,
  type Favorite,
  type Note,
} from "@/lib/perfil";

const profileSchema = z.object({
  nome: z.string(),
  preferencias: z.array(z.string()),
  no_ranking: z.boolean(),
  pontos: z.number(),
  licoes: z.array(z.string()),
  padroeiro_id: z.string(),
});

export type Profile = z.output<typeof profileSchema>;

const rankingSchema = z.array(z.object({ nome: z.string(), pontos: z.number() }));

export type RankingRow = z.output<typeof rankingSchema>[number];

async function privateRequest(
  method: string,
  path: string,
  subject: string,
  body?: unknown,
): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      method,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": process.env.INTERNAL_API_SECRET ?? "",
        "X-User-Sub": subject,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Não foi possível falar com o acervo.", 503, "NETWORK_ERROR");
  }
  if (!response.ok) {
    throw new ApiError("Não foi possível acessar o perfil.", response.status, "PERFIL_ERRO");
  }
  return response;
}

async function profileFrom(response: Response): Promise<Profile> {
  return profileSchema.parse(await response.json());
}

/** Devolve o perfil, criando-o no primeiro acesso com o primeiro nome do Google. */
export async function syncProfile(subject: string, googleName?: string | null): Promise<Profile> {
  const firstName = googleName?.trim().split(/\s+/)[0] ?? "";
  const nome = firstName.length >= 2 ? firstName : "Estudante";
  return profileFrom(await privateRequest("POST", "/perfil", subject, { nome }));
}

export async function updateProfile(
  subject: string,
  data: { nome: string; preferencias: string[]; no_ranking: boolean },
): Promise<Profile> {
  return profileFrom(await privateRequest("PUT", "/perfil", subject, data));
}

export async function completeLessons(subject: string, licoes: string[]): Promise<Profile> {
  return profileFrom(await privateRequest("POST", "/perfil/licoes", subject, { licoes }));
}

export async function deleteProfile(subject: string): Promise<void> {
  await privateRequest("DELETE", "/perfil", subject);
}

export async function setPatron(subject: string, padroeiroId: string): Promise<Profile> {
  return profileFrom(
    await privateRequest("PUT", "/perfil/padroeiro", subject, { padroeiro_id: padroeiroId }),
  );
}

export async function listFavorites(subject: string): Promise<Favorite[]> {
  const response = await privateRequest("GET", "/perfil/favoritos", subject);
  return z.array(favoriteSchema).parse(await response.json());
}

export async function addFavorite(
  subject: string,
  data: { tipo: string; texto: string; referencia: string; url_origem: string | null },
): Promise<Favorite> {
  const response = await privateRequest("POST", "/perfil/favoritos", subject, data);
  return favoriteSchema.parse(await response.json());
}

export async function deleteFavorite(subject: string, id: number): Promise<void> {
  await privateRequest("DELETE", `/perfil/favoritos/${id}`, subject);
}

export async function listNotes(subject: string): Promise<Note[]> {
  const response = await privateRequest("GET", "/perfil/anotacoes", subject);
  return z.array(noteSchema).parse(await response.json());
}

export async function addNote(
  subject: string,
  data: { categoria: string; texto: string; licao: string | null },
): Promise<Note> {
  const response = await privateRequest("POST", "/perfil/anotacoes", subject, data);
  return noteSchema.parse(await response.json());
}

export async function deleteNote(subject: string, id: number): Promise<void> {
  await privateRequest("DELETE", `/perfil/anotacoes/${id}`, subject);
}

export function fetchRanking(): Promise<RankingRow[]> {
  return apiGet("/ranking", rankingSchema, { revalidateSeconds: 0 });
}

import "server-only";
import { cookies } from "next/headers";
import {
  COOKIE_NOME,
  DURACAO_SESSAO_SEGUNDOS,
  verificarSessao,
  type SessaoPayload,
} from "./jwt";

export { COOKIE_NOME, assinarSessao, verificarSessao, type SessaoPayload } from "./jwt";

export async function getSessao(): Promise<SessaoPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NOME)?.value;
  if (!token) return null;
  return await verificarSessao(token);
}

export async function exigirSessao(): Promise<SessaoPayload> {
  const s = await getSessao();
  if (!s) throw new Error("Não autenticado");
  return s;
}

export async function setCookieSessao(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NOME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACAO_SESSAO_SEGUNDOS,
  });
}

export async function limparCookieSessao(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NOME);
}

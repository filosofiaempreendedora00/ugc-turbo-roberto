import "server-only";
import { NextResponse } from "next/server";
import { getSessao, type SessaoPayload } from "./session";

export type ResultadoSessaoApi =
  | { ok: true; sessao: SessaoPayload }
  | { ok: false; resposta: NextResponse };

export async function obterSessaoApi(): Promise<ResultadoSessaoApi> {
  const sessao = await getSessao();
  if (!sessao) {
    return {
      ok: false,
      resposta: NextResponse.json({ error: "não autenticado" }, { status: 401 }),
    };
  }
  return { ok: true, sessao };
}

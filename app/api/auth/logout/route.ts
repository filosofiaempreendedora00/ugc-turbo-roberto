import { NextRequest, NextResponse } from "next/server";
import { getSessao, COOKIE_NOME } from "@/lib/auth/session";
import { registrar } from "@/lib/auth/audit";
import { urlAppPublica } from "@/lib/auth/urls";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const sessao = await getSessao();
  if (sessao) {
    await registrar({
      usuarioId: sessao.sub,
      usuarioEmail: sessao.email,
      acao: "logout",
    });
  }
  const resp = NextResponse.redirect(new URL("/login", urlAppPublica(req)), { status: 303 });
  resp.cookies.delete(COOKIE_NOME);
  return resp;
}

export async function GET(req: NextRequest) {
  return POST(req);
}

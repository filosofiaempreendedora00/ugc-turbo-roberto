import { NextRequest, NextResponse } from "next/server";
import { trocarCodigoPorIdToken } from "@/lib/auth/google";
import { emailNoDominio } from "@/lib/auth/admins";
import { upsertUsuarioPorGoogle } from "@/lib/auth/usuarios";
import { assinarSessao, COOKIE_NOME } from "@/lib/auth/session";
import { registrar } from "@/lib/auth/audit";
import { urlAppPublica, urlCallback } from "@/lib/auth/urls";

export const dynamic = "force-dynamic";

const COOKIE_STATE = "ugc_oauth_state";
const COOKIE_RETORNO = "ugc_oauth_retorno";

function urlErro(req: NextRequest, motivo: string): URL {
  const u = new URL("/login", urlAppPublica(req));
  u.searchParams.set("erro", motivo);
  return u;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const erroGoogle = req.nextUrl.searchParams.get("error");

  const stateCookie = req.cookies.get(COOKIE_STATE)?.value;
  const retornoCookie = req.cookies.get(COOKIE_RETORNO)?.value ?? "/dashboard";

  if (erroGoogle) return NextResponse.redirect(urlErro(req, erroGoogle));
  if (!code || !state || !stateCookie || state !== stateCookie) {
    return NextResponse.redirect(urlErro(req, "state_invalido"));
  }

  let info;
  try {
    info = await trocarCodigoPorIdToken(code, urlCallback(req));
  } catch (err) {
    console.error("[auth/callback] troca de code falhou", err);
    return NextResponse.redirect(urlErro(req, "falha_google"));
  }

  if (!info.emailVerificado) {
    return NextResponse.redirect(urlErro(req, "email_nao_verificado"));
  }
  if (!emailNoDominio(info.email)) {
    return NextResponse.redirect(urlErro(req, "dominio_nao_permitido"));
  }

  const usuario = await upsertUsuarioPorGoogle(info);

  const token = await assinarSessao({
    sub: usuario.id,
    email: usuario.email,
    nome: usuario.nome,
    picture: usuario.picture,
    role: usuario.role,
  });

  await registrar({
    usuarioId: usuario.id,
    usuarioEmail: usuario.email,
    acao: "login",
  });

  const destino = retornoCookie.startsWith("/") ? retornoCookie : "/dashboard";
  const resp = NextResponse.redirect(new URL(destino, urlAppPublica(req)));
  resp.cookies.set(COOKIE_NOME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  resp.cookies.delete(COOKIE_STATE);
  resp.cookies.delete(COOKIE_RETORNO);
  return resp;
}

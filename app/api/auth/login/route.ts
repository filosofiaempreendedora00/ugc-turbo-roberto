import { NextRequest, NextResponse } from "next/server";
import { urlAutorizacao } from "@/lib/auth/google";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

const COOKIE_STATE = "ugc_oauth_state";
const COOKIE_RETORNO = "ugc_oauth_retorno";

function redirectUri(req: NextRequest): string {
  const url = new URL("/api/auth/callback", req.nextUrl.origin);
  return url.toString();
}

export async function GET(req: NextRequest) {
  const retorno = req.nextUrl.searchParams.get("retorno") ?? "/dashboard";
  const state = randomBytes(16).toString("hex");
  const url = urlAutorizacao(state, redirectUri(req));

  const resp = NextResponse.redirect(url);
  resp.cookies.set(COOKIE_STATE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  resp.cookies.set(COOKIE_RETORNO, retorno, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return resp;
}

import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NOME = "ugc_session";
const DURACAO_SESSAO_DIAS = 7;

export type SessaoPayload = {
  sub: string;
  email: string;
  nome: string;
  picture: string | null;
  role: "admin" | "analista";
};

function chave(): Uint8Array {
  const segredo = process.env.SESSION_SECRET;
  if (!segredo || segredo.length < 32) {
    throw new Error("SESSION_SECRET ausente ou curto demais (mínimo 32 chars).");
  }
  return new TextEncoder().encode(segredo);
}

export async function assinarSessao(payload: SessaoPayload): Promise<string> {
  return await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DURACAO_SESSAO_DIAS}d`)
    .sign(chave());
}

export async function verificarSessao(token: string): Promise<SessaoPayload | null> {
  try {
    const { payload } = await jwtVerify(token, chave(), { algorithms: ["HS256"] });
    if (
      typeof payload.sub === "string" &&
      typeof payload.email === "string" &&
      typeof payload.nome === "string" &&
      (payload.role === "admin" || payload.role === "analista")
    ) {
      return {
        sub: payload.sub,
        email: payload.email,
        nome: payload.nome,
        picture: typeof payload.picture === "string" ? payload.picture : null,
        role: payload.role,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export const DURACAO_SESSAO_SEGUNDOS = DURACAO_SESSAO_DIAS * 24 * 60 * 60;

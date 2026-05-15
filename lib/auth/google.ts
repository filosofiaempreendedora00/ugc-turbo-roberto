import "server-only";
import { DOMINIO_PERMITIDO } from "./admins";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

export type GoogleUserInfo = {
  sub: string;
  email: string;
  emailVerificado: boolean;
  nome: string;
  picture: string | null;
};

function exigirEnv(nome: string): string {
  const v = process.env[nome];
  if (!v) throw new Error(`Variável de ambiente ${nome} ausente.`);
  return v;
}

export function urlAutorizacao(state: string, redirectUri: string): string {
  const clientId = exigirEnv("GOOGLE_CLIENT_ID");
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    hd: DOMINIO_PERMITIDO,
    state,
  });
  return `${AUTH_URL}?${params.toString()}`;
}

export async function trocarCodigoPorIdToken(
  code: string,
  redirectUri: string,
): Promise<GoogleUserInfo> {
  const clientId = exigirEnv("GOOGLE_CLIENT_ID");
  const clientSecret = exigirEnv("GOOGLE_CLIENT_SECRET");

  const resp = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Falha ao trocar code por token: ${resp.status} ${txt}`);
  }
  const data = (await resp.json()) as { id_token?: string };
  if (!data.id_token) throw new Error("id_token ausente na resposta do Google.");
  return decodificarIdToken(data.id_token);
}

function decodeBase64Url(s: string): string {
  const norm = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = norm.length % 4 === 0 ? "" : "=".repeat(4 - (norm.length % 4));
  return Buffer.from(norm + pad, "base64").toString("utf-8");
}

function decodificarIdToken(idToken: string): GoogleUserInfo {
  const partes = idToken.split(".");
  if (partes.length !== 3) throw new Error("id_token mal formatado.");
  const payload = JSON.parse(decodeBase64Url(partes[1])) as {
    sub?: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
    hd?: string;
  };
  if (!payload.sub || !payload.email || !payload.name) {
    throw new Error("id_token sem campos obrigatórios.");
  }
  return {
    sub: payload.sub,
    email: payload.email,
    emailVerificado: payload.email_verified === true,
    nome: payload.name,
    picture: payload.picture ?? null,
  };
}

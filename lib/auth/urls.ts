import "server-only";
import type { NextRequest } from "next/server";

/**
 * Retorna a URL pública do app (sem barra final).
 *
 * Ordem de precedência:
 *   1. APP_URL              — override manual (útil pra domínio custom)
 *   2. RENDER_EXTERNAL_URL  — setado automaticamente pelo Render
 *   3. X-Forwarded-Host/Proto — headers que proxies (Vercel, Cloudflare etc.) injetam
 *   4. req.nextUrl.origin   — fallback pra dev local (sem proxy)
 *
 * Sem isso, em produção atrás de proxy o Next.js usa o host INTERNO
 * (ex.: localhost:10000) e quebra OAuth (redirect_uri inválido).
 */
export function urlAppPublica(req: NextRequest): string {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  if (process.env.RENDER_EXTERNAL_URL)
    return process.env.RENDER_EXTERNAL_URL.replace(/\/$/, "");

  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto");
  if (forwardedHost) {
    const proto = forwardedProto ?? "https";
    return `${proto}://${forwardedHost}`;
  }

  return req.nextUrl.origin;
}

export function urlCallback(req: NextRequest): string {
  return `${urlAppPublica(req)}/api/auth/callback`;
}

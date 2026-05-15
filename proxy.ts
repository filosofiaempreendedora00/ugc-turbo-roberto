import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NOME, verificarSessao } from "@/lib/auth/jwt";

const ROTAS_PUBLICAS = ["/login", "/api/auth/login", "/api/auth/callback", "/api/auth/logout"];

function rotaPublica(pathname: string): boolean {
  return ROTAS_PUBLICAS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (rotaPublica(pathname)) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NOME)?.value;
  const sessao = token ? await verificarSessao(token) : null;

  if (!sessao) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "não autenticado" }, { status: 401 });
    }
    const url = new URL("/login", req.nextUrl.origin);
    if (pathname !== "/") url.searchParams.set("retorno", pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica em todas as rotas EXCETO:
     * - arquivos estáticos do Next (_next/*)
     * - favicon
     * - imagens públicas
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)$).*)",
  ],
};

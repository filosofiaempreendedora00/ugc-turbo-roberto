import { NextResponse } from "next/server";
import { getSessao } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const sessao = await getSessao();
  if (!sessao) return NextResponse.json({ autenticado: false }, { status: 401 });
  return NextResponse.json({
    autenticado: true,
    usuario: {
      id: sessao.sub,
      email: sessao.email,
      nome: sessao.nome,
      picture: sessao.picture,
      role: sessao.role,
    },
  });
}

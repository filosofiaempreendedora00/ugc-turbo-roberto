import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { obterSessaoApi } from "@/lib/auth/api";
import { registrar } from "@/lib/auth/audit";

export const dynamic = "force-dynamic";

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await obterSessaoApi();
  if (!auth.ok) return auth.resposta;
  const { id } = await ctx.params;
  const [removido] = await db
    .delete(schema.roteiros)
    .where(eq(schema.roteiros.id, id))
    .returning({ id: schema.roteiros.id, titulo: schema.roteiros.titulo });
  if (removido) {
    await registrar({
      usuarioId: auth.sessao.sub,
      usuarioEmail: auth.sessao.email,
      acao: "roteiro.excluir",
      recursoTipo: "roteiro",
      recursoId: removido.id,
      detalhes: { titulo: removido.titulo },
    });
  }
  return NextResponse.json({ ok: true });
}

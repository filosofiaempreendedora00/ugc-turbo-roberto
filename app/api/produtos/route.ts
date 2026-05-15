import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { asc, eq } from "drizzle-orm";
import type { Produto } from "@/types";
import { obterSessaoApi } from "@/lib/auth/api";
import { registrar } from "@/lib/auth/audit";

export const dynamic = "force-dynamic";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function GET(req: NextRequest) {
  const auth = await obterSessaoApi();
  if (!auth.ok) return auth.resposta;
  const clienteId = req.nextUrl.searchParams.get("clienteId");
  const rows = clienteId
    ? await db
        .select()
        .from(schema.produtos)
        .where(eq(schema.produtos.clienteId, clienteId))
        .orderBy(asc(schema.produtos.criadoEm))
    : await db.select().from(schema.produtos).orderBy(asc(schema.produtos.criadoEm));
  return NextResponse.json(rows.map(toProduto));
}

export async function POST(req: NextRequest) {
  const auth = await obterSessaoApi();
  if (!auth.ok) return auth.resposta;
  const body = await req.json();
  const nome = String(body?.nome ?? "").trim();
  const clienteId = String(body?.clienteId ?? "").trim();
  if (!nome || !clienteId)
    return NextResponse.json({ error: "nome e clienteId obrigatórios" }, { status: 400 });
  const now = new Date();
  const [row] = await db
    .insert(schema.produtos)
    .values({
      id: generateId(),
      userId: auth.sessao.sub,
      clienteId,
      nome,
      guia: {
        descricao: "",
        beneficios: "",
        doresQueResolve: "",
        diferenciais: "",
        oferta: "",
        observacoes: "",
      },
      criadoEm: now,
      atualizadoEm: now,
    })
    .returning();
  await registrar({
    usuarioId: auth.sessao.sub,
    usuarioEmail: auth.sessao.email,
    acao: "produto.criar",
    recursoTipo: "produto",
    recursoId: row.id,
    detalhes: { nome, clienteId },
  });
  return NextResponse.json(toProduto(row));
}

function toProduto(row: typeof schema.produtos.$inferSelect): Produto {
  return {
    id: row.id,
    clienteId: row.clienteId,
    nome: row.nome,
    guia: row.guia,
    criadoEm: row.criadoEm.toISOString(),
    atualizadoEm: row.atualizadoEm.toISOString(),
  };
}

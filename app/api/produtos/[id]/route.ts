import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import type { Produto } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const [row] = await db.select().from(schema.produtos).where(eq(schema.produtos.id, id));
  if (!row) return NextResponse.json({ error: "não encontrado" }, { status: 404 });
  return NextResponse.json(toProduto(row));
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json();
  const update: Partial<typeof schema.produtos.$inferInsert> = { atualizadoEm: new Date() };
  if (typeof body.nome === "string") update.nome = body.nome;
  if (body.guia) update.guia = body.guia;
  const [row] = await db
    .update(schema.produtos)
    .set(update)
    .where(eq(schema.produtos.id, id))
    .returning();
  if (!row) return NextResponse.json({ error: "não encontrado" }, { status: 404 });
  return NextResponse.json(toProduto(row));
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await db.delete(schema.produtos).where(eq(schema.produtos.id, id));
  return NextResponse.json({ ok: true });
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

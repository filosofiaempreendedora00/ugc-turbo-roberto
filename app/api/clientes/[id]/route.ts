import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import type { Cliente } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const [row] = await db.select().from(schema.clientes).where(eq(schema.clientes.id, id));
  if (!row) return NextResponse.json({ error: "não encontrado" }, { status: 404 });
  return NextResponse.json(toCliente(row));
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json();
  const update: Partial<typeof schema.clientes.$inferInsert> = { atualizadoEm: new Date() };
  if (typeof body.nome === "string") update.nome = body.nome;
  if (body.guiaMarca) update.guiaMarca = body.guiaMarca;
  if (Array.isArray(body.avatares)) update.avatares = body.avatares;
  const [row] = await db
    .update(schema.clientes)
    .set(update)
    .where(eq(schema.clientes.id, id))
    .returning();
  if (!row) return NextResponse.json({ error: "não encontrado" }, { status: 404 });
  return NextResponse.json(toCliente(row));
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await db.delete(schema.clientes).where(eq(schema.clientes.id, id));
  return NextResponse.json({ ok: true });
}

function toCliente(row: typeof schema.clientes.$inferSelect): Cliente {
  return {
    id: row.id,
    nome: row.nome,
    guiaMarca: row.guiaMarca,
    avatares: row.avatares ?? [],
    criadoEm: row.criadoEm.toISOString(),
    atualizadoEm: row.atualizadoEm.toISOString(),
  };
}

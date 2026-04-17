import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { asc, eq } from "drizzle-orm";
import type { Roteiro } from "@/types";

export const dynamic = "force-dynamic";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function GET(req: NextRequest) {
  const clienteId = req.nextUrl.searchParams.get("clienteId");
  const rows = clienteId
    ? await db
        .select()
        .from(schema.roteiros)
        .where(eq(schema.roteiros.clienteId, clienteId))
        .orderBy(asc(schema.roteiros.geradoEm))
    : await db.select().from(schema.roteiros).orderBy(asc(schema.roteiros.geradoEm));
  return NextResponse.json(rows.map(toRoteiro));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body?.clienteId || !body?.produtoId || !body?.titulo || !body?.foco || !body?.formato || !body?.icp) {
    return NextResponse.json({ error: "campos obrigatórios faltando" }, { status: 400 });
  }
  const [row] = await db
    .insert(schema.roteiros)
    .values({
      id: generateId(),
      clienteId: body.clienteId,
      produtoId: body.produtoId,
      titulo: body.titulo,
      icp: body.icp,
      foco: body.foco,
      formato: body.formato,
      mensagemObrigatoria: body.mensagemObrigatoria ?? "",
      hooks: body.hooks ?? [],
      cenas: body.cenas ?? null,
      geradoEm: new Date(),
    })
    .returning();
  return NextResponse.json(toRoteiro(row));
}

function toRoteiro(row: typeof schema.roteiros.$inferSelect): Roteiro {
  return {
    id: row.id,
    titulo: row.titulo,
    clienteId: row.clienteId,
    produtoId: row.produtoId,
    icp: row.icp,
    foco: row.foco,
    formato: row.formato,
    mensagemObrigatoria: row.mensagemObrigatoria,
    hooks: row.hooks ?? [],
    cenas: row.cenas ?? undefined,
    geradoEm: row.geradoEm.toISOString(),
  };
}

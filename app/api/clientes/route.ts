import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { asc } from "drizzle-orm";
import type { Cliente } from "@/types";

export const dynamic = "force-dynamic";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function GET() {
  const rows = await db.select().from(schema.clientes).orderBy(asc(schema.clientes.criadoEm));
  return NextResponse.json(rows.map(toCliente));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const nome = String(body?.nome ?? "").trim();
  if (!nome) return NextResponse.json({ error: "nome obrigatório" }, { status: 400 });
  const now = new Date();
  const [row] = await db
    .insert(schema.clientes)
    .values({
      id: generateId(),
      nome,
      guiaMarca: {
        nome,
        tomDeVoz: "",
        publicoAlvo: "",
        diferenciais: "",
        posicionamento: "",
        observacoes: "",
      },
      avatares: [],
      criadoEm: now,
      atualizadoEm: now,
    })
    .returning();
  return NextResponse.json(toCliente(row));
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

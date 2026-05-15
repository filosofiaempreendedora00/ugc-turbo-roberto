import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { asc } from "drizzle-orm";
import type { Cliente } from "@/types";
import { obterSessaoApi } from "@/lib/auth/api";
import { registrar } from "@/lib/auth/audit";

export const dynamic = "force-dynamic";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function GET() {
  const auth = await obterSessaoApi();
  if (!auth.ok) return auth.resposta;
  const rows = await db.select().from(schema.clientes).orderBy(asc(schema.clientes.criadoEm));
  return NextResponse.json(rows.map(toCliente));
}

export async function POST(req: NextRequest) {
  const auth = await obterSessaoApi();
  if (!auth.ok) return auth.resposta;
  const body = await req.json();
  const nome = String(body?.nome ?? "").trim();
  if (!nome) return NextResponse.json({ error: "nome obrigatório" }, { status: 400 });
  const now = new Date();
  const [row] = await db
    .insert(schema.clientes)
    .values({
      id: generateId(),
      userId: auth.sessao.sub,
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
  await registrar({
    usuarioId: auth.sessao.sub,
    usuarioEmail: auth.sessao.email,
    acao: "cliente.criar",
    recursoTipo: "cliente",
    recursoId: row.id,
    detalhes: { nome },
  });
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

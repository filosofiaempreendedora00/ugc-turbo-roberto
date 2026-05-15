import "server-only";
import { db, schema } from "@/lib/db/client";

export type AcaoAudit =
  | "login"
  | "logout"
  | "cliente.criar"
  | "cliente.atualizar"
  | "cliente.excluir"
  | "produto.criar"
  | "produto.atualizar"
  | "produto.excluir"
  | "roteiro.gerar"
  | "roteiro.regenerar_cenas"
  | "roteiro.excluir"
  | "avatar.gerar"
  | "site.analisar"
  | "produto.analisar";

export type RegistroAudit = {
  usuarioId: string;
  usuarioEmail: string;
  acao: AcaoAudit;
  recursoTipo?: string;
  recursoId?: string;
  detalhes?: Record<string, unknown>;
};

function gerarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function registrar(reg: RegistroAudit): Promise<void> {
  try {
    await db.insert(schema.auditoriaAcoes).values({
      id: gerarId(),
      usuarioId: reg.usuarioId,
      usuarioEmail: reg.usuarioEmail,
      acao: reg.acao,
      recursoTipo: reg.recursoTipo ?? null,
      recursoId: reg.recursoId ?? null,
      detalhes: reg.detalhes ?? null,
    });
  } catch (err) {
    console.error("[audit] falha ao registrar ação", reg.acao, err);
  }
}

import "server-only";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { ehAdmin } from "./admins";
import type { GoogleUserInfo } from "./google";

export type Usuario = typeof schema.usuarios.$inferSelect;

function gerarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function upsertUsuarioPorGoogle(info: GoogleUserInfo): Promise<Usuario> {
  const email = info.email.toLowerCase();
  const role: "admin" | "analista" = ehAdmin(email) ? "admin" : "analista";
  const agora = new Date();

  const existente = await db
    .select()
    .from(schema.usuarios)
    .where(eq(schema.usuarios.email, email))
    .limit(1);

  if (existente.length > 0) {
    const [atualizado] = await db
      .update(schema.usuarios)
      .set({
        nome: info.nome,
        picture: info.picture,
        role,
        googleSub: info.sub,
        ultimoLoginEm: agora,
      })
      .where(eq(schema.usuarios.email, email))
      .returning();
    return atualizado;
  }

  const [criado] = await db
    .insert(schema.usuarios)
    .values({
      id: gerarId(),
      email,
      nome: info.nome,
      picture: info.picture,
      role,
      googleSub: info.sub,
      ultimoLoginEm: agora,
    })
    .returning();
  return criado;
}

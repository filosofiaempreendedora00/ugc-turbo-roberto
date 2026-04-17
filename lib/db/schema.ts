import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import type { GuiaMarca, GuiaProduto, AvatarICP, CenaRoteiro, FocoRoteiro, FormatoRoteiro } from "@/types";

export const clientes = pgTable("clientes", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  nome: text("nome").notNull(),
  guiaMarca: jsonb("guia_marca").$type<GuiaMarca>().notNull(),
  avatares: jsonb("avatares").$type<AvatarICP[]>().notNull().default([]),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true }).notNull().defaultNow(),
});

export const produtos = pgTable("produtos", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  clienteId: text("cliente_id")
    .notNull()
    .references(() => clientes.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  guia: jsonb("guia").$type<GuiaProduto>().notNull(),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true }).notNull().defaultNow(),
});

export const roteiros = pgTable("roteiros", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  clienteId: text("cliente_id")
    .notNull()
    .references(() => clientes.id, { onDelete: "cascade" }),
  produtoId: text("produto_id")
    .notNull()
    .references(() => produtos.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  icp: text("icp").notNull(),
  foco: text("foco").$type<FocoRoteiro>().notNull(),
  formato: text("formato").$type<FormatoRoteiro>().notNull(),
  mensagemObrigatoria: text("mensagem_obrigatoria").notNull().default(""),
  hooks: jsonb("hooks").$type<string[]>().notNull().default([]),
  cenas: jsonb("cenas").$type<CenaRoteiro[]>(),
  geradoEm: timestamp("gerado_em", { withTimezone: true }).notNull().defaultNow(),
});

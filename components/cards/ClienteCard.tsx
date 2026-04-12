"use client";

import Link from "next/link";
import { Cliente, Produto } from "@/types";
import { ArrowRight, Package, Pencil, Trash2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-blue-100",   text: "text-blue-700"   },
  { bg: "bg-emerald-100",text: "text-emerald-700" },
  { bg: "bg-rose-100",   text: "text-rose-700"    },
  { bg: "bg-amber-100",  text: "text-amber-700"   },
  { bg: "bg-teal-100",   text: "text-teal-700"    },
  { bg: "bg-indigo-100", text: "text-indigo-700"  },
  { bg: "bg-fuchsia-100",text: "text-fuchsia-700" },
];

function getAvatarColor(nome: string) {
  const hash = nome.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function getInitials(nome: string) {
  const parts = nome.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function guiaScore(guia: Cliente["guiaMarca"]) {
  return [guia.tomDeVoz, guia.observacoes, guia.diferenciais, guia.posicionamento]
    .filter(Boolean).length;
}

const TOM_LABELS: Record<string, string> = {
  divertido: "Divertido",
  sério: "Sério",
  inspirador: "Inspirador",
  educativo: "Educativo",
  provocativo: "Provocativo",
  emocional: "Emocional",
  direto: "Direto",
  conversacional: "Conversacional",
};

// ─── Component ────────────────────────────────────────────────────────────────

interface ClienteCardProps {
  cliente: Cliente;
  produtos: Produto[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: string) => void;
}

export function ClienteCard({ cliente, produtos, onEdit, onDelete }: ClienteCardProps) {
  const color    = getAvatarColor(cliente.nome);
  const initials = getInitials(cliente.nome);
  const score    = guiaScore(cliente.guiaMarca);
  const guiaOk   = score >= 4;
  const qtd      = produtos.length;
  const qtdAvatares = (cliente.avatares ?? []).length;

  return (
    <Link href={`/cliente/${cliente.id}`} className="group block" tabIndex={0}>
      <div
        className={cn(
          "relative bg-white rounded-2xl ring-1 ring-gray-200/80 overflow-hidden",
          "transition-all duration-200 hover:-translate-y-0.5",
          "hover:shadow-xl hover:shadow-violet-100/50 hover:ring-violet-200/70"
        )}
      >
        {/* Top accent bar */}
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* Body */}
        <div className="p-5">

          {/* Avatar + name + actions */}
          <div className="flex items-start gap-3 mb-4">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 select-none", color.bg, color.text)}>
              {initials}
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                {cliente.nome}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(cliente.criadoEm).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>

            {/* Contextual actions — only visible on hover */}
            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(cliente); }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
                aria-label="Editar cliente"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(cliente.id); }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                aria-label="Remover cliente"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Status chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className={cn(
              "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium",
              guiaOk ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", guiaOk ? "bg-emerald-500" : "bg-amber-400")} />
              {guiaOk ? "Guia completo" : `Guia ${score}/4`}
            </span>

            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium bg-gray-50 text-gray-600">
              <Package size={11} className="shrink-0" />
              {qtd} {qtd === 1 ? "produto" : "produtos"}
            </span>

            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium bg-gray-50 text-gray-600">
              <Users size={11} className="shrink-0" />
              {qtdAvatares} {qtdAvatares === 1 ? "avatar" : "avatares"}
            </span>

          </div>

          {/* Personalidade snippet */}
          {cliente.guiaMarca.diferenciais && (
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
              {cliente.guiaMarca.diferenciais}
            </p>
          )}

        </div>

        {/* Footer — navigation hint */}
        <div className={cn(
          "flex items-center justify-between px-5 py-3",
          "border-t border-gray-100",
          "bg-gray-50/60 group-hover:bg-violet-50/60 transition-colors duration-200"
        )}>
          <span className="text-xs font-medium text-gray-400 group-hover:text-violet-600 transition-colors">
            Abrir cliente
          </span>
          <ArrowRight
            size={13}
            className="text-gray-300 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all duration-200"
          />
        </div>

      </div>
    </Link>
  );
}

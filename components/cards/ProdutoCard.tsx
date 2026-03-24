"use client";

import Link from "next/link";
import { Produto } from "@/types";
import { BookOpen, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseBeneficios(raw: string): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch { /* fallthrough */ }
  return raw.split(",").map(s => s.trim()).filter(Boolean);
}

function guiaScore(guia: Produto["guia"]): number {
  return [guia.doresQueResolve, guia.beneficios, guia.diferenciais, guia.oferta, guia.descricao]
    .filter(Boolean).length;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ProdutoCardProps {
  produto: Produto;
  clienteNome: string;
  onEdit: (produto: Produto) => void;
  onDelete: (id: string) => void;
}

export function ProdutoCard({ produto, clienteNome, onEdit, onDelete }: ProdutoCardProps) {
  const score     = guiaScore(produto.guia);
  const guiaOk    = score >= 5;
  const beneficios = parseBeneficios(produto.guia.beneficios).slice(0, 3);

  return (
    <div className={cn(
      "group relative bg-white rounded-2xl ring-1 ring-gray-200/80 overflow-hidden",
      "transition-all duration-200 hover:-translate-y-0.5",
      "hover:shadow-xl hover:shadow-indigo-100/50 hover:ring-indigo-200/70"
    )}>
      {/* Top accent */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-indigo-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* Body */}
      <div className="p-5">

        {/* Name + actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm leading-tight truncate">{produto.nome}</h4>
            <p className="text-xs text-gray-400 mt-0.5">{clienteNome}</p>
          </div>
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => onEdit(produto)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(produto.id)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Guia status chip */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium",
            guiaOk ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full", guiaOk ? "bg-emerald-500" : "bg-amber-400")} />
            {guiaOk ? "Guia completo" : `Guia ${score}/5`}
          </span>
        </div>

        {/* Benefícios preview */}
        {beneficios.length > 0 ? (
          <div className="flex flex-wrap gap-1 mb-1">
            {beneficios.map(b => (
              <span key={b} className="inline-flex px-2 py-0.5 rounded-md text-xs bg-gray-50 text-gray-500 ring-1 ring-gray-100">
                {b}
              </span>
            ))}
            {parseBeneficios(produto.guia.beneficios).length > 3 && (
              <span className="inline-flex px-2 py-0.5 rounded-md text-xs bg-gray-50 text-gray-400 ring-1 ring-gray-100">
                +{parseBeneficios(produto.guia.beneficios).length - 3}
              </span>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-300 italic mb-1">Benefícios não definidos ainda.</p>
        )}

      </div>

      {/* Footer */}
      <div className={cn(
        "flex px-5 py-3 border-t border-gray-100",
        "bg-gray-50/60 group-hover:bg-indigo-50/40 transition-colors duration-200"
      )}>
        <Link href={`/produto/${produto.id}`} className="flex-1">
          <button className={cn(
            "w-full inline-flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium transition-all",
            "bg-white ring-1 ring-gray-200 text-gray-600 hover:ring-indigo-300 hover:text-indigo-700 group-hover:ring-indigo-200"
          )}>
            <BookOpen size={12} />
            Editar guia do produto
          </button>
        </Link>
      </div>
    </div>
  );
}

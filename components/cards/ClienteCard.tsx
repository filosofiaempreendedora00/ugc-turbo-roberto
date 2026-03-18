"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Cliente, Produto } from "@/types";
import { ArrowRight, BookOpen, Package, Pencil, Trash2 } from "lucide-react";

interface ClienteCardProps {
  cliente: Cliente;
  produtos: Produto[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: string) => void;
}

function guiaMarcaCompleto(guia: Cliente["guiaMarca"]): boolean {
  return !!(guia.tomDeVoz && guia.publicoAlvo && guia.diferenciais && guia.posicionamento);
}

export function ClienteCard({ cliente, produtos, onEdit, onDelete }: ClienteCardProps) {
  const guiaOk = guiaMarcaCompleto(cliente.guiaMarca);
  const qtdProdutos = produtos.length;

  return (
    <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-violet-200 hover:shadow-md transition-all duration-200">
      <div className="absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base truncate">
              {cliente.nome}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Criado em {new Date(cliente.criadoEm).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => onEdit(cliente)}
            >
              <Pencil size={13} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50"
              onClick={() => onDelete(cliente.id)}
            >
              <Trash2 size={13} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <BookOpen size={12} className={guiaOk ? "text-emerald-500" : "text-amber-500"} />
            <Badge
              variant="outline"
              className={
                guiaOk
                  ? "text-emerald-600 border-emerald-200 bg-emerald-50 text-xs"
                  : "text-amber-600 border-amber-200 bg-amber-50 text-xs"
              }
            >
              {guiaOk ? "Guia completo" : "Guia pendente"}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5">
            <Package size={12} className="text-gray-400" />
            <Badge
              variant="outline"
              className="text-gray-500 border-gray-200 bg-gray-50 text-xs"
            >
              {qtdProdutos} {qtdProdutos === 1 ? "produto" : "produtos"}
            </Badge>
          </div>
        </div>

        {cliente.guiaMarca.publicoAlvo && (
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            <span className="text-gray-300">Público: </span>
            {cliente.guiaMarca.publicoAlvo}
          </p>
        )}

        <Link href={`/cliente/${cliente.id}`}>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-1 border-gray-200 bg-gray-50 text-gray-600 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 group/btn"
          >
            Abrir cliente
            <ArrowRight size={13} className="ml-2 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

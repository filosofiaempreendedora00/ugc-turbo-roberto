"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Produto } from "@/types";
import { BookOpen, Pencil, Trash2, Wand2 } from "lucide-react";

interface ProdutoCardProps {
  produto: Produto;
  clienteNome: string;
  onEdit: (produto: Produto) => void;
  onDelete: (id: string) => void;
}

function guiaProdutoCompleto(guia: Produto["guia"]): boolean {
  return !!(guia.descricao && guia.beneficios && guia.doresQueResolve);
}

export function ProdutoCard({ produto, clienteNome, onEdit, onDelete }: ProdutoCardProps) {
  const guiaOk = guiaProdutoCompleto(produto.guia);

  return (
    <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-violet-200 hover:shadow-md transition-all duration-200">
      <div className="absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r from-indigo-500 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 text-sm truncate">{produto.nome}</h4>
            <p className="text-xs text-gray-400 mt-0.5">{clienteNome}</p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => onEdit(produto)}
            >
              <Pencil size={13} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50"
              onClick={() => onDelete(produto.id)}
            >
              <Trash2 size={13} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
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
            {guiaOk ? "Guia preenchido" : "Guia incompleto"}
          </Badge>
        </div>

        {produto.guia.descricao && (
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {produto.guia.descricao}
          </p>
        )}

        <div className="flex gap-2">
          <Link href={`/produto/${produto.id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 text-xs"
            >
              <BookOpen size={12} className="mr-1.5" />
              Editar guia
            </Button>
          </Link>
          <Link href={`/gerar?clienteId=${produto.clienteId}&produtoId=${produto.id}`} className="flex-1">
            <Button size="sm" className="w-full bg-violet-600 hover:bg-violet-500 text-white text-xs">
              <Wand2 size={12} className="mr-1.5" />
              Gerar roteiro
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

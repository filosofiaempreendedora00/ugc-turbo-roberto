"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Roteiro, FOCO_LABELS, FORMATO_LABELS } from "@/types";
import { Check, ClipboardCopy, RefreshCw, Wand2 } from "lucide-react";

interface RoteiroTableProps {
  roteiros: Roteiro[];
  onRegenerate: () => void;
  onGerarNovo: () => void;
  loading?: boolean;
}

interface RoteiroCopyState {
  [id: string]: boolean;
}

function formatRoteiroParaTexto(roteiro: Roteiro): string {
  const linhas: string[] = [
    `ROTEIRO: ${roteiro.titulo}`,
    `Foco: ${FOCO_LABELS[roteiro.foco]} | Formato: ${FORMATO_LABELS[roteiro.formato]}`,
    `ICP: ${roteiro.icp || "—"}`,
    ``,
    `CENAS:`,
    ``,
  ];

  roteiro.cenas.forEach((cena) => {
    linhas.push(`🎬 CENA ${cena.cena}`);
    linhas.push(`Fala: ${cena.fala}`);
    linhas.push(`Filmagem: ${cena.briefingFilmagem}`);
    linhas.push(``);
  });

  if (roteiro.mensagemObrigatoria) {
    linhas.push(`📌 Mensagem obrigatória: ${roteiro.mensagemObrigatoria}`);
  }

  return linhas.join("\n");
}

export function RoteiroTable({ roteiros, onRegenerate, onGerarNovo, loading }: RoteiroTableProps) {
  const [copied, setCopied] = useState<RoteiroCopyState>({});
  const [activeIndex, setActiveIndex] = useState(0);

  async function handleCopy(roteiro: Roteiro) {
    const texto = formatRoteiroParaTexto(roteiro);
    await navigator.clipboard.writeText(texto);
    setCopied((prev) => ({ ...prev, [roteiro.id]: true }));
    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [roteiro.id]: false }));
    }, 2000);
  }

  if (roteiros.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Wand2 size={20} className="text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">Nenhum roteiro gerado</p>
        <p className="text-gray-400 text-sm mt-1">Configure os parâmetros e clique em Gerar</p>
      </div>
    );
  }

  const roteiro = roteiros[activeIndex];

  return (
    <div className="space-y-4">
      {/* Header com seletor de roteiros */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {roteiros.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setActiveIndex(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeIndex === i
                  ? "bg-violet-600 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              }`}
            >
              Roteiro {i + 1}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-xs"
            onClick={onRegenerate}
            disabled={loading}
          >
            <RefreshCw size={12} className={`mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Regenerar
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-xs"
            onClick={onGerarNovo}
            disabled={loading}
          >
            <Wand2 size={12} className="mr-1.5" />
            Gerar novo
          </Button>
          <Button
            size="sm"
            className="bg-violet-600 hover:bg-violet-500 text-white text-xs"
            onClick={() => handleCopy(roteiro)}
          >
            {copied[roteiro.id] ? (
              <><Check size={12} className="mr-1.5" />Copiado!</>
            ) : (
              <><ClipboardCopy size={12} className="mr-1.5" />Copiar roteiro</>
            )}
          </Button>
        </div>
      </div>

      {/* Roteiro ativo */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        {/* Meta */}
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-3 flex-wrap">
          <h3 className="text-sm font-medium text-gray-900">{roteiro.titulo}</h3>
          <Badge variant="outline" className="text-violet-600 border-violet-200 bg-violet-50 text-xs">
            {FOCO_LABELS[roteiro.foco]}
          </Badge>
          <Badge variant="outline" className="text-sky-600 border-sky-200 bg-sky-50 text-xs">
            {FORMATO_LABELS[roteiro.formato]}
          </Badge>
          {roteiro.icp && (
            <span className="text-xs text-gray-400">ICP: {roteiro.icp}</span>
          )}
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-16">
                  Cena
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-2/5">
                  Fala / Script
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Briefing de Filmagem
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {roteiro.cenas.map((cena) => (
                <tr key={cena.cena} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 align-top">
                    <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-violet-600">{cena.cena}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="text-gray-800 leading-relaxed text-sm">{cena.fala}</p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="text-gray-500 leading-relaxed text-sm">{cena.briefingFilmagem}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mensagem obrigatória */}
        {roteiro.mensagemObrigatoria && (
          <div className="px-4 py-3 border-t border-amber-100 bg-amber-50">
            <p className="text-xs text-amber-700 flex items-center gap-2">
              <span className="font-semibold">📌 Mensagem obrigatória:</span>
              <span>{roteiro.mensagemObrigatoria}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

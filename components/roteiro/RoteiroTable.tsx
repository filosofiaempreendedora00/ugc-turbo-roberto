"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CenaRoteiro, Roteiro, FOCO_LABELS, FORMATO_LABELS } from "@/types";
import { Check, ChevronDown, ChevronUp, ClipboardCopy, Loader2, RefreshCw, Wand2 } from "lucide-react";

interface RoteiroTableProps {
  roteiros: Roteiro[];
  onRegenerate: () => void;
  onGerarNovo: () => void;
  loading?: boolean;
  cenesGeradas: { [id: string]: CenaRoteiro[] };
  cenesLoading: { [id: string]: boolean };
  onGerarCenas: (roteiroId: string) => void;
}

function formatRoteiroParaTexto(roteiro: Roteiro, cenas?: CenaRoteiro[], includeBriefing = false): string {
  const linhas: string[] = [
    `ROTEIRO: ${roteiro.titulo}`,
    `Foco: ${FOCO_LABELS[roteiro.foco]} | Formato: ${FORMATO_LABELS[roteiro.formato]}`,
    `ICP: ${roteiro.icp || "—"}`,
    ``,
    `HOOKS:`,
    ``,
  ];

  roteiro.hooks.forEach((hook, i) => {
    linhas.push(`${i + 1}. ${hook}`);
  });

  if (cenas && cenas.length > 0) {
    linhas.push(``);
    linhas.push(`CENAS:`);
    linhas.push(``);
    cenas.forEach((cena) => {
      linhas.push(`🎬 CENA ${cena.cena}`);
      linhas.push(`Fala: ${cena.fala}`);
      if (includeBriefing) linhas.push(`Filmagem: ${cena.briefingFilmagem}`);
      linhas.push(``);
    });
  }

  if (roteiro.mensagemObrigatoria) {
    linhas.push(`📌 Mensagem obrigatória: ${roteiro.mensagemObrigatoria}`);
  }

  return linhas.join("\n");
}

export function RoteiroTable({ roteiros, onRegenerate, onGerarNovo, loading, cenesGeradas, cenesLoading }: RoteiroTableProps) {
  const [copied, setCopied] = useState<{ [id: string]: boolean }>({});
  const [showBriefing, setShowBriefing] = useState(false);

  async function handleCopy(roteiro: Roteiro) {
    const texto = formatRoteiroParaTexto(roteiro, cenesGeradas[roteiro.id], showBriefing);
    await navigator.clipboard.writeText(texto);
    setCopied((prev) => ({ ...prev, [roteiro.id]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [roteiro.id]: false })), 2000);
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

  const roteiro = roteiros[0];
  const cenas = cenesGeradas[roteiro.id];
  const loadingCenas = cenesLoading[roteiro.id];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
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
        </div>

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

      {/* Roteiro */}
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

        {/* Hooks */}
        <div className="p-5 space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            5 Hooks — escolha o melhor para o seu roteiro
          </p>
          {roteiro.hooks.map((hook, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-md bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[11px] font-bold text-violet-600">{i + 1}</span>
              </div>
              <p className="text-gray-800 text-sm leading-relaxed">{hook}</p>
            </div>
          ))}
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

        {/* Cenas */}
        {loadingCenas ? (
          <div className="border-t border-gray-100 px-5 py-4 flex items-center gap-2 text-sm text-gray-400">
            <Loader2 size={14} className="animate-spin text-violet-500" />
            <span>Gerando cenas...</span>
          </div>
        ) : cenas && cenas.length > 0 ? (
          <div className="border-t border-gray-100">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cenas</p>
              <button
                onClick={() => setShowBriefing(!showBriefing)}
                className="inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-500 transition-colors font-medium"
              >
                {showBriefing ? (
                  <><ChevronUp size={12} />Ocultar briefing de filmagem</>
                ) : (
                  <><ChevronDown size={12} />Ver briefing de filmagem</>
                )}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-16">Cena</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Fala</th>
                    {showBriefing && (
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-2/5">Briefing de Filmagem</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cenas.map((cena) => (
                    <tr key={cena.cena} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 align-top">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center">
                          <span className="text-xs font-bold text-violet-600">{cena.cena}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <p className="text-gray-800 leading-relaxed text-sm">{cena.fala}</p>
                      </td>
                      {showBriefing && (
                        <td className="px-4 py-4 align-top">
                          <p className="text-gray-500 leading-relaxed text-sm">{cena.briefingFilmagem}</p>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

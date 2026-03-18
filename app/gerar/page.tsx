"use client";

import { useEffect, useReducer, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RoteiroTable } from "@/components/roteiro/RoteiroTable";
import {
  Cliente, ConfiguracaoGeracao, FocoRoteiro, FormatoRoteiro,
  Produto, Roteiro, FOCO_LABELS, FORMATO_ICONS, FORMATO_LABELS,
} from "@/types";
import { getClientes, getClienteById, getProdutosByCliente, getProdutoById } from "@/lib/storage";
import { gerarRoteiros } from "@/lib/roteiro-generator";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";

const FOCOS: FocoRoteiro[] = ["dor", "benefício", "transformação", "prova", "oferta", "objeção"];
const FORMATOS: FormatoRoteiro[] = ["face_to_camera", "tiktok_style", "lifestyle", "demo", "unboxing", "looks"];

type Estado = {
  clienteId: string;
  produtoId: string;
  icp: string;
  foco: FocoRoteiro | "";
  formato: FormatoRoteiro | "";
  mensagemObrigatoria: string;
  quantidade: number;
};

type Acao = { type: "SET_CAMPO"; campo: keyof Estado; valor: string | number };

const ESTADO_INICIAL: Estado = {
  clienteId: "", produtoId: "", icp: "", foco: "", formato: "",
  mensagemObrigatoria: "", quantidade: 3,
};

function reducer(state: Estado, acao: Acao): Estado {
  return { ...state, [acao.campo]: acao.valor };
}

function GerarPageInner() {
  const searchParams = useSearchParams();
  const [estado, dispatch] = useReducer(reducer, ESTADO_INICIAL);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [roteiros, setRoteiros] = useState<Roteiro[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const todos = getClientes();
    setClientes(todos);
    const clienteIdParam = searchParams.get("clienteId") || "";
    const produtoIdParam = searchParams.get("produtoId") || "";
    if (clienteIdParam) {
      dispatch({ type: "SET_CAMPO", campo: "clienteId", valor: clienteIdParam });
      const prods = getProdutosByCliente(clienteIdParam);
      setProdutos(prods);
      if (produtoIdParam) {
        dispatch({ type: "SET_CAMPO", campo: "produtoId", valor: produtoIdParam });
      }
    }
  }, [searchParams]);

  function handleClienteChange(clienteId: string) {
    if (!clienteId) return;
    dispatch({ type: "SET_CAMPO", campo: "clienteId", valor: clienteId });
    dispatch({ type: "SET_CAMPO", campo: "produtoId", valor: "" });
    setProdutos(getProdutosByCliente(clienteId));
    setRoteiros([]);
  }

  function handleProdutoChange(produtoId: string) {
    if (!produtoId) return;
    dispatch({ type: "SET_CAMPO", campo: "produtoId", valor: produtoId });
    setRoteiros([]);
  }

  function handleGerar() {
    if (!estado.clienteId) { toast.error("Selecione um cliente."); return; }
    if (!estado.produtoId) { toast.error("Selecione um produto."); return; }
    if (!estado.foco) { toast.error("Escolha o foco do roteiro."); return; }
    if (!estado.formato) { toast.error("Escolha o formato do roteiro."); return; }

    const cliente = getClienteById(estado.clienteId);
    const produto = getProdutoById(estado.produtoId);
    if (!cliente || !produto) { toast.error("Cliente ou produto não encontrado."); return; }

    setLoading(true);
    setTimeout(() => {
      const config: ConfiguracaoGeracao = {
        clienteId: estado.clienteId,
        produtoId: estado.produtoId,
        icp: estado.icp,
        foco: estado.foco as FocoRoteiro,
        formato: estado.formato as FormatoRoteiro,
        mensagemObrigatoria: estado.mensagemObrigatoria,
        quantidade: Number(estado.quantidade),
      };
      const gerados = gerarRoteiros(cliente, produto, config);
      const roteirosFull: Roteiro[] = gerados.map((r, i) => ({
        ...r, id: `${Date.now()}-${i}`, geradoEm: new Date().toISOString(),
      }));
      setRoteiros(roteirosFull);
      setLoading(false);
      toast.success(`${roteirosFull.length} roteiro${roteirosFull.length > 1 ? "s" : ""} gerado${roteirosFull.length > 1 ? "s" : ""}!`);
    }, 900);
  }

  const clienteSelecionado = clientes.find((c) => c.id === estado.clienteId);
  const produtoSelecionado = produtos.find((p) => p.id === estado.produtoId);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gerar Roteiro</h1>
        <p className="text-gray-500 text-sm mt-1">Configure os parâmetros e gere roteiros UGC prontos para produção.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        {/* Painel de configuração */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-5 shadow-sm">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Configuração</h2>

            {/* Cliente */}
            <div className="space-y-2">
              <Label className="text-gray-700 text-xs">Cliente</Label>
              <select
                value={estado.clienteId}
                onChange={(e) => handleClienteChange(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-gray-400">Selecionar cliente...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>

            {/* Produto */}
            <div className="space-y-2">
              <Label className="text-gray-700 text-xs">Produto</Label>
              <select
                value={estado.produtoId}
                onChange={(e) => handleProdutoChange(e.target.value)}
                disabled={!estado.clienteId}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" disabled className="text-gray-400">Selecionar produto...</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            {/* ICP */}
            <div className="space-y-2">
              <Label className="text-gray-700 text-xs">
                ICP <span className="text-gray-400 font-normal">(perfil ideal do cliente)</span>
              </Label>
              <Textarea
                placeholder="Ex: Mulher 28-42 anos, preocupada com saúde da pele, usa Instagram..."
                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm resize-none"
                rows={3}
                value={estado.icp}
                onChange={(e) => dispatch({ type: "SET_CAMPO", campo: "icp", valor: e.target.value })}
              />
            </div>

            {/* Foco */}
            <div className="space-y-2">
              <Label className="text-gray-700 text-xs">Foco do roteiro</Label>
              <div className="grid grid-cols-2 gap-2">
                {FOCOS.map((foco) => (
                  <button
                    key={foco}
                    type="button"
                    onClick={() => dispatch({ type: "SET_CAMPO", campo: "foco", valor: foco })}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all text-left ${
                      estado.foco === foco
                        ? "bg-violet-50 border-violet-300 text-violet-700"
                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {FOCO_LABELS[foco]}
                  </button>
                ))}
              </div>
            </div>

            {/* Formato */}
            <div className="space-y-2">
              <Label className="text-gray-700 text-xs">Formato</Label>
              <div className="grid grid-cols-2 gap-2">
                {FORMATOS.map((formato) => (
                  <button
                    key={formato}
                    type="button"
                    onClick={() => dispatch({ type: "SET_CAMPO", campo: "formato", valor: formato })}
                    className={`px-3 py-2.5 rounded-lg text-xs font-medium border transition-all text-left ${
                      estado.formato === formato
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    <span className="mr-1.5">{FORMATO_ICONS[formato]}</span>
                    {FORMATO_LABELS[formato]}
                  </button>
                ))}
              </div>
            </div>

            {/* Mensagem obrigatória */}
            <div className="space-y-2">
              <Label className="text-gray-700 text-xs">
                Mensagem obrigatória <span className="text-gray-400 font-normal">(opcional)</span>
              </Label>
              <Input
                placeholder="Ex: Link na bio com 20% de desconto!"
                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                value={estado.mensagemObrigatoria}
                onChange={(e) => dispatch({ type: "SET_CAMPO", campo: "mensagemObrigatoria", valor: e.target.value })}
              />
            </div>

            {/* Quantidade */}
            <div className="space-y-2">
              <Label className="text-gray-700 text-xs">
                Quantidade de roteiros <span className="text-gray-400 font-normal">({estado.quantidade})</span>
              </Label>
              <div className="flex gap-2">
                {[1, 2, 3, 5, 10].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => dispatch({ type: "SET_CAMPO", campo: "quantidade", valor: n })}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      Number(estado.quantidade) === n
                        ? "bg-gray-800 border-gray-800 text-white"
                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={handleGerar}
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-5 text-sm shadow-sm"
          >
            {loading ? (
              <><Loader2 size={16} className="mr-2 animate-spin" />Gerando roteiros...</>
            ) : (
              <><Wand2 size={16} className="mr-2" />Gerar roteiros</>
            )}
          </Button>

          {(clienteSelecionado || produtoSelecionado) && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2 shadow-sm">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Selecionado</p>
              {clienteSelecionado && (
                <div>
                  <p className="text-xs text-gray-400">Cliente</p>
                  <p className="text-sm text-gray-800 font-medium">{clienteSelecionado.nome}</p>
                </div>
              )}
              {produtoSelecionado && (
                <div>
                  <p className="text-xs text-gray-400">Produto</p>
                  <p className="text-sm text-gray-800 font-medium">{produtoSelecionado.nome}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Painel de resultados */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="relative mb-5">
                <div className="w-14 h-14 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center">
                  <Wand2 size={22} className="text-violet-500" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
              </div>
              <p className="text-gray-700 font-medium">Gerando roteiros...</p>
              <p className="text-gray-400 text-sm mt-1">
                Criando {estado.quantidade} roteiro{Number(estado.quantidade) > 1 ? "s" : ""}
              </p>
            </div>
          ) : (
            <RoteiroTable
              roteiros={roteiros}
              onRegenerate={handleGerar}
              onGerarNovo={() => setRoteiros([])}
              loading={loading}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default function GerarPage() {
  return (
    <Suspense fallback={<div className="text-gray-400">Carregando...</div>}>
      <GerarPageInner />
    </Suspense>
  );
}

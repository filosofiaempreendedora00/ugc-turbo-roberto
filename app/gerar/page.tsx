"use client";

import { useEffect, useReducer, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RoteiroTable } from "@/components/roteiro/RoteiroTable";
import {
  CenaRoteiro, Cliente, ConfiguracaoGeracao, FocoRoteiro, FormatoRoteiro,
  Produto, Roteiro, FOCO_LABELS, FORMATO_LABELS, AvatarICP,
} from "@/types";
import { getClientes, getClienteById, getProdutosByCliente, getProdutoById, getAvataresByCliente } from "@/lib/storage";
import { ChevronDown, Lock, Loader2, Wand2, RotateCcw } from "lucide-react";
import { SEED_HOOKS, STORAGE_HOOKS } from "@/lib/hooks-seed";
import { SEED_CTAS, STORAGE_CTAS } from "@/lib/ctas-seed";

const GERAR_SESSION_KEY = "ugc:gerar:session";

// ─── Banco de Hooks ────────────────────────────────────────────────────────────

const FOCO_PARA_CATEGORIAS: Record<string, string[]> = {
  dor:          ["Dor", "Identificação"],
  benefício:    ["Benefício"],
  transformação:["Transformação"],
  prova:        ["Prova social"],
  oferta:       ["Oferta", "Urgência"],
  objeção:      ["Objeção", "Persuasão"],
};

const NICHO_KEYWORDS: Record<string, string[]> = {
  "Beleza & Higiene":    ["beleza", "pele", "cabelo", "unhas", "maquiagem", "skin", "cosmético", "higiene", "glow", "skincare"],
  "Saúde & Bem-estar":   ["saúde", "suplemento", "vitamina", "imunidade", "treino", "fitness", "creatina", "proteína", "nutrição", "emagrecimento"],
  "Alimentos & Bebidas": ["alimento", "comida", "bebida", "receita", "food"],
  "Moda & Estilo":       ["moda", "roupa", "vestido", "estilo", "look", "fashion"],
};

function selecionarHooksDeReferencia(
  foco: FocoRoteiro,
  cliente: Cliente,
  produto: Produto
): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_HOOKS);
    // Fall back to built-in seeds if localStorage is empty or not yet seeded
    const todos: Array<{ estrutura: string; categoria: string; nicho: string }> =
      saved ? JSON.parse(saved) : SEED_HOOKS;

    const categoriasAlvo = FOCO_PARA_CATEGORIAS[foco] ?? [];

    // Detecta nicho do cliente por keywords nos campos de texto
    const textoCliente = [
      cliente.guiaMarca.publicoAlvo,
      cliente.guiaMarca.posicionamento,
      cliente.guiaMarca.diferenciais,
      produto.guia.descricao,
      produto.guia.doresQueResolve,
    ].join(" ").toLowerCase();

    const nichoCliente = Object.entries(NICHO_KEYWORDS).find(
      ([, kws]) => kws.some((k) => textoCliente.includes(k))
    )?.[0];

    const filtrados = todos.filter((h) => {
      if (!categoriasAlvo.includes(h.categoria)) return false;
      if (h.nicho === "Geral") return true;
      if (nichoCliente && h.nicho === nichoCliente) return true;
      return false;
    });

    // Embaralha e retorna no máximo 5 estruturas
    return filtrados
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map((h) => h.estrutura);
  } catch {
    return [];
  }
}
// ─── Banco de CTAs ─────────────────────────────────────────────────────────────

const FOCO_PARA_TIPOS_CTA: Record<string, string[]> = {
  dor:            ["dor"],
  "benefício":    ["benefício"],
  "transformação":["dor", "benefício"],
  prova:          ["benefício"],
  oferta:         ["benefício"],
  "objeção":      ["dor"],
};

function selecionarCtasDeReferencia(foco: FocoRoteiro): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_CTAS);
    const todos: Array<{ texto: string; tipo: string }> =
      saved ? JSON.parse(saved) : SEED_CTAS;

    const tiposAlvo = FOCO_PARA_TIPOS_CTA[foco] ?? [];

    const filtrados = todos.filter((c) => tiposAlvo.includes(c.tipo));

    return filtrados
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map((c) => c.texto);
  } catch {
    return [];
  }
}

import { toast } from "sonner";

const FOCOS: FocoRoteiro[] = ["dor", "benefício"];
const FORMATOS: FormatoRoteiro[] = ["face_to_camera", "tiktok_style", "lifestyle", "demo", "unboxing", "looks"];

type OfertaTipo = "" | "frete" | "desconto" | "compre_leve" | "manual";

type Estado = {
  clienteId: string;
  produtoId: string;
  icp: string;
  foco: FocoRoteiro | "";
  formato: FormatoRoteiro | "";
  ofertaTipo: OfertaTipo;
  ofertaV1: string;
  ofertaV2: string;
  mensagemObrigatoria: string;
};

type Acao = { type: "SET_CAMPO"; campo: keyof Estado; valor: string };

const ESTADO_INICIAL: Estado = {
  clienteId: "", produtoId: "", icp: "", foco: "", formato: "face_to_camera",
  ofertaTipo: "", ofertaV1: "", ofertaV2: "", mensagemObrigatoria: "",
};

function computeOferta(estado: Estado): string {
  switch (estado.ofertaTipo) {
    case "frete":      return `Frete grátis acima de R$${estado.ofertaV1 || "___"} hoje`;
    case "desconto":   return `${estado.ofertaV1 || "__"}% off na primeira compra`;
    case "compre_leve": return `Compre ${estado.ofertaV1 || "__"}, leve ${estado.ofertaV2 || "__"}`;
    case "manual":     return estado.ofertaV1;
    default:           return "";
  }
}

function reducer(state: Estado, acao: Acao): Estado {
  return { ...state, [acao.campo]: acao.valor };
}

function ResumoLinha({ label, valor }: { label: string; valor?: string }) {
  return (
    <div className="flex justify-between items-baseline gap-2">
      <p className="text-xs text-gray-400 shrink-0">{label}</p>
      {valor
        ? <p className="text-xs text-gray-800 font-medium text-right truncate max-w-[160px]">{valor}</p>
        : <p className="text-xs text-gray-300">—</p>
      }
    </div>
  );
}

function GerarPageInner() {
  const searchParams = useSearchParams();
  const [estado, dispatch] = useReducer(reducer, ESTADO_INICIAL);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [avatares, setAvatares] = useState<AvatarICP[]>([]);
  const [avatarSelecionadoId, setAvatarSelecionadoId] = useState("");
  const [roteiros, setRoteiros] = useState<Roteiro[]>([]);
  const [loading, setLoading] = useState(false);
  const resultadoRef = useRef<HTMLDivElement>(null);
  const [cenesGeradas, setCenesGeradas] = useState<{ [id: string]: CenaRoteiro[] }>({});
  const [cenesLoading, setCenesLoading] = useState<{ [id: string]: boolean }>({});
  const [doresTags, setDoresTags] = useState<string[]>([]);
  const [beneficiosTags, setBeneficiosTags] = useState<string[]>([]);
  const [angulosSelecionados, setAngulosSelecionados] = useState<string[]>([]);

  useEffect(() => {
    const todos = getClientes();
    setClientes(todos);
    const clienteIdParam = searchParams.get("clienteId") || "";
    const produtoIdParam = searchParams.get("produtoId") || "";

    if (clienteIdParam) {
      // URL params têm prioridade — navegação vinda de outra tela
      dispatch({ type: "SET_CAMPO", campo: "clienteId", valor: clienteIdParam });
      const prods = getProdutosByCliente(clienteIdParam);
      setProdutos(prods);
      if (produtoIdParam) {
        dispatch({ type: "SET_CAMPO", campo: "produtoId", valor: produtoIdParam });
      }
    } else {
      // Sem URL params — tenta restaurar sessão anterior
      try {
        const saved = sessionStorage.getItem(GERAR_SESSION_KEY);
        if (saved) {
          const session = JSON.parse(saved);
          if (session.estado) {
            (Object.keys(session.estado) as (keyof Estado)[]).forEach((campo) => {
              dispatch({ type: "SET_CAMPO", campo, valor: session.estado[campo] });
            });
            if (session.estado.clienteId) {
              setProdutos(getProdutosByCliente(session.estado.clienteId));
              setAvatares(getAvataresByCliente(session.estado.clienteId));
            }
            if (session.estado.produtoId) {
              const prod = getProdutoById(session.estado.produtoId);
              if (prod) {
                setBeneficiosTags(parseTags(prod.guia.beneficios));
                setDoresTags(parseTags(prod.guia.doresQueResolve));
              }
            }
          }
          if (session.roteiros?.length) setRoteiros(session.roteiros);
          if (session.cenesGeradas) setCenesGeradas(session.cenesGeradas);
          if (session.angulosSelecionados) setAngulosSelecionados(session.angulosSelecionados);
          if (session.avatarSelecionadoId) setAvatarSelecionadoId(session.avatarSelecionadoId);
        }
      } catch { /* sessionStorage indisponível ou dado corrompido */ }
    }
  }, [searchParams]);

  // Persiste sessão sempre que estado relevante muda
  useEffect(() => {
    try {
      sessionStorage.setItem(GERAR_SESSION_KEY, JSON.stringify({
        estado, roteiros, cenesGeradas, angulosSelecionados, avatarSelecionadoId,
      }));
    } catch { /* ignore */ }
  }, [estado, roteiros, cenesGeradas, angulosSelecionados, avatarSelecionadoId]);

  function handleClienteChange(clienteId: string) {
    if (!clienteId) return;
    dispatch({ type: "SET_CAMPO", campo: "clienteId", valor: clienteId });
    dispatch({ type: "SET_CAMPO", campo: "produtoId", valor: "" });
    dispatch({ type: "SET_CAMPO", campo: "icp", valor: "" });
    setProdutos(getProdutosByCliente(clienteId));
    setAvatares(getAvataresByCliente(clienteId));
    setAvatarSelecionadoId("");
    setRoteiros([]);
    setDoresTags([]);
    setBeneficiosTags([]);
    setAngulosSelecionados([]);
  }

  function parseTags(raw: string): string[] {
    if (!raw?.trim()) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch { /* fallthrough */ }
    return raw.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
  }

  function handleProdutoChange(produtoId: string) {
    if (!produtoId) return;
    dispatch({ type: "SET_CAMPO", campo: "produtoId", valor: produtoId });
    setRoteiros([]);
    setAngulosSelecionados([]);
    const prod = getProdutoById(produtoId);
    if (prod) {
      setBeneficiosTags(parseTags(prod.guia.beneficios));
      setDoresTags(parseTags(prod.guia.doresQueResolve));
    } else {
      setBeneficiosTags([]);
      setDoresTags([]);
    }
  }

  function toggleAngulo(tag: string) {
    setAngulosSelecionados(prev =>
      prev.includes(tag) ? prev.filter(a => a !== tag) : [...prev, tag]
    );
  }

  function handleNovoRoteiro() {
    try { sessionStorage.removeItem(GERAR_SESSION_KEY); } catch { /* ignore */ }
    (Object.keys(ESTADO_INICIAL) as (keyof Estado)[]).forEach((campo) => {
      dispatch({ type: "SET_CAMPO", campo, valor: ESTADO_INICIAL[campo] });
    });
    setRoteiros([]);
    setCenesGeradas({});
    setAngulosSelecionados([]);
    setAvatarSelecionadoId("");
    setProdutos([]);
    setAvatares([]);
    setDoresTags([]);
    setBeneficiosTags([]);
  }

  async function handleGerar() {
    if (!estado.clienteId) { toast.error("Selecione um cliente."); return; }
    if (!estado.produtoId) { toast.error("Selecione um produto."); return; }
    if (!estado.foco) { toast.error("Escolha o foco do roteiro."); return; }

    resultadoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    const cliente = getClienteById(estado.clienteId);
    const produto = getProdutoById(estado.produtoId);
    if (!cliente || !produto) { toast.error("Cliente ou produto não encontrado."); return; }

    const config: ConfiguracaoGeracao = {
      clienteId: estado.clienteId,
      produtoId: estado.produtoId,
      icp: estado.icp,
      foco: estado.foco as FocoRoteiro,
      formato: "face_to_camera",
      oferta: computeOferta(estado),
      mensagemObrigatoria: estado.mensagemObrigatoria,
      anguloCentral: angulosSelecionados.length > 0 ? angulosSelecionados.join(", ") : undefined,
    };

    const hooksDeReferencia = selecionarHooksDeReferencia(estado.foco as FocoRoteiro, cliente, produto);

    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);
    try {
      const res = await fetch("/api/gerar-roteiros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente, produto, config, hooksDeReferencia }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Erro ao gerar roteiro."); return; }
      const roteiroFull: Roteiro = {
        ...data.roteiro,
        id: `${Date.now()}`,
        geradoEm: new Date().toISOString(),
        clienteId: config.clienteId,
        produtoId: config.produtoId,
        icp: config.icp,
        foco: config.foco,
        formato: config.formato,
        mensagemObrigatoria: config.mensagemObrigatoria,
      };
      setRoteiros([roteiroFull]);
      setCenesGeradas({});
      toast.success("Roteiro gerado!");
      gerarCenas(roteiroFull, cliente, produto);
    } catch {
      toast.error("Erro de conexão ao gerar roteiro.");
    } finally {
      setLoading(false);
    }
  }

  async function gerarCenas(roteiro: Roteiro, clienteObj: ReturnType<typeof getClienteById>, produtoObj: ReturnType<typeof getProdutoById>) {
    if (!clienteObj || !produtoObj) return;
    setCenesLoading((prev) => ({ ...prev, [roteiro.id]: true }));
    try {
      const res = await fetch("/api/gerar-cenas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente: clienteObj,
          produto: produtoObj,
          config: {
            icp: roteiro.icp,
            foco: roteiro.foco,
            formato: roteiro.formato,
            oferta: computeOferta(estado),
            mensagemObrigatoria: roteiro.mensagemObrigatoria,
            anguloCentral: angulosSelecionados.length > 0 ? angulosSelecionados.join(", ") : undefined,
          },
          roteiro,
          ctasDeReferencia: selecionarCtasDeReferencia(roteiro.foco),
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Erro ao gerar cenas."); return; }
      setCenesGeradas((prev) => ({ ...prev, [roteiro.id]: data.cenas }));
    } catch {
      toast.error("Erro de conexão ao gerar cenas.");
    } finally {
      setCenesLoading((prev) => ({ ...prev, [roteiro.id]: false }));
    }
  }

  async function handleGerarCenas(roteiroId: string) {
    const roteiro = roteiros.find((r) => r.id === roteiroId);
    if (!roteiro) return;
    const cliente = getClienteById(estado.clienteId);
    const produto = getProdutoById(estado.produtoId);
    await gerarCenas(roteiro, cliente, produto);
  }

  async function handleRegenerateHooks(locked: { index: number; text: string }[]) {
    if (!estado.clienteId || !estado.produtoId || !estado.foco) return;
    const cliente = getClienteById(estado.clienteId);
    const produto = getProdutoById(estado.produtoId);
    if (!cliente || !produto) return;

    const config: ConfiguracaoGeracao = {
      clienteId: estado.clienteId,
      produtoId: estado.produtoId,
      icp: estado.icp,
      foco: estado.foco as FocoRoteiro,
      formato: "face_to_camera",
      oferta: computeOferta(estado),
      mensagemObrigatoria: estado.mensagemObrigatoria,
      anguloCentral: angulosSelecionados.length > 0 ? angulosSelecionados.join(", ") : undefined,
    };

    const hooksDeReferencia = selecionarHooksDeReferencia(estado.foco as FocoRoteiro, cliente, produto);

    setLoading(true);
    try {
      const res = await fetch("/api/gerar-roteiros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente, produto, config, hooksDeReferencia }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Erro ao regenerar hooks."); return; }

      const newHooks: string[] = data.roteiro.hooks;
      const lockedMap = new Map(locked.map((l) => [l.index, l.text]));
      const mergedHooks = newHooks.map((h, i) => lockedMap.get(i) ?? h);

      setRoteiros((prev) => prev.map((r, i) => (i === 0 ? { ...r, hooks: mergedHooks } : r)));
      toast.success(locked.length > 0 ? `${locked.length} hook(s) preservado(s), demais regenerados!` : "Hooks regenerados!");
    } catch {
      toast.error("Erro de conexão ao regenerar hooks.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegenerateCenas(lockedBodyCenas: CenaRoteiro[], ctaLocked: boolean, lockedCta?: CenaRoteiro) {
    const roteiro = roteiros[0];
    if (!roteiro) return;
    const cliente = getClienteById(estado.clienteId);
    const produto = getProdutoById(estado.produtoId);
    if (!cliente || !produto) return;

    setCenesLoading((prev) => ({ ...prev, [roteiro.id]: true }));
    try {
      const res = await fetch("/api/gerar-cenas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente,
          produto,
          config: {
            icp: roteiro.icp,
            foco: roteiro.foco,
            formato: roteiro.formato,
            oferta: computeOferta(estado),
            mensagemObrigatoria: roteiro.mensagemObrigatoria,
            anguloCentral: angulosSelecionados.length > 0 ? angulosSelecionados.join(", ") : undefined,
          },
          roteiro,
          ctasDeReferencia: selecionarCtasDeReferencia(roteiro.foco),
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Erro ao regenerar cenas."); return; }

      const newCenas: CenaRoteiro[] = data.cenas;
      const newBodyCenas = newCenas.slice(1, -1);
      const newCtaCena = newCenas[newCenas.length - 1];

      // Map locked body cenas to their relative positions within the current body
      const currentCenas = cenesGeradas[roteiro.id] ?? [];
      const currentBodyCenas = currentCenas.slice(1, -1);
      const lockedRelPosMap = new Map<number, CenaRoteiro>();
      lockedBodyCenas.forEach((lc) => {
        const relPos = currentBodyCenas.findIndex((c) => c.cena === lc.cena);
        if (relPos !== -1) lockedRelPosMap.set(relPos, lc);
      });

      // Merge: substitute new body cenas at locked relative positions
      const mergedBodyCenas = newBodyCenas.map((c, relIdx) =>
        lockedRelPosMap.has(relIdx) ? { ...lockedRelPosMap.get(relIdx)!, cena: c.cena } : c
      );

      // Preserve hook cena (cena 1) from current cenas
      const hookCena = currentCenas[0] ?? newCenas[0];

      // CTA: preserve if ctaLocked, otherwise use new
      const mergedCta = ctaLocked && lockedCta ? { ...lockedCta, cena: newCtaCena.cena } : newCtaCena;

      setCenesGeradas((prev) => ({ ...prev, [roteiro.id]: [hookCena, ...mergedBodyCenas, mergedCta] }));
      toast.success("Cenas regeneradas!");
    } catch {
      toast.error("Erro de conexão ao regenerar cenas.");
    } finally {
      setCenesLoading((prev) => ({ ...prev, [roteiro.id]: false }));
    }
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
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Configuração</h2>
              {(roteiros.length > 0 || estado.clienteId) && (
                <button
                  onClick={handleNovoRoteiro}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-violet-600 transition-colors"
                >
                  <RotateCcw size={12} />
                  Novo roteiro
                </button>
              )}
            </div>

            {/* Cliente */}
            <div className="space-y-2">
              <Label className="text-gray-700 text-xs">Cliente</Label>
              <div className="relative">
                <select
                  value={estado.clienteId}
                  onChange={(e) => handleClienteChange(e.target.value)}
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white pl-3 pr-9 text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-gray-400">Selecionar cliente...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Produto */}
            <div className="space-y-2">
              <Label className="text-gray-700 text-xs">Produto</Label>
              <div className="relative">
                <select
                  value={estado.produtoId}
                  onChange={(e) => handleProdutoChange(e.target.value)}
                  disabled={!estado.clienteId}
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white pl-3 pr-9 text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" disabled className="text-gray-400">Selecionar produto...</option>
                  {produtos.map((p) => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* ICP */}
            <div className="space-y-2">
              <Label className="text-gray-700 text-xs">
                Avatar (Persona)
              </Label>

              <div className="relative">
                <select
                  value={avatarSelecionadoId}
                  disabled={!estado.clienteId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAvatarSelecionadoId(val);
                    if (val === "manual") {
                      dispatch({ type: "SET_CAMPO", campo: "icp", valor: "" });
                    } else if (val) {
                      const avatar = avatares.find((a) => a.id === val);
                      if (avatar) {
                        const parts: string[] = [`Nome: ${avatar.nome}`];
                        if (avatar.idadeRange) parts.push(`Faixa etária: ${avatar.idadeRange}`);
                        if (avatar.genero) parts.push(`Gênero: ${avatar.genero}`);
                        if (avatar.situacao) parts.push(`Situação atual: ${avatar.situacao}`);
                        if (avatar.dores?.length) parts.push(`Dores: ${avatar.dores.join(", ")}`);
                        if (avatar.desejos?.length) parts.push(`Desejos: ${avatar.desejos.join(", ")}`);
                        if (avatar.objecoes?.length) parts.push(`Objeções: ${avatar.objecoes.join(", ")}`);
                        dispatch({ type: "SET_CAMPO", campo: "icp", valor: parts.join("\n") });
                      }
                    } else {
                      dispatch({ type: "SET_CAMPO", campo: "icp", valor: "" });
                    }
                  }}
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white pl-3 pr-9 text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Selecionar avatar (persona)...</option>
                  {avatares.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nome}{a.descricao ? ` (${a.descricao.length > 70 ? a.descricao.slice(0, 70) + "…" : a.descricao})` : ""}
                    </option>
                  ))}
                  <option value="manual">✏️ Digitar manualmente...</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {avatarSelecionadoId === "manual" && (
                <Textarea
                  autoFocus
                  placeholder="Ex: Mulher 28-42 anos, preocupada com saúde da pele, usa Instagram..."
                  className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm resize-none"
                  rows={3}
                  value={estado.icp}
                  onChange={(e) => dispatch({ type: "SET_CAMPO", campo: "icp", valor: e.target.value })}
                />
              )}
            </div>

            {/* Foco */}
            <div className="space-y-2">
              <Label className="text-gray-700 text-xs">Foco do roteiro</Label>
              <div className="grid grid-cols-2 gap-2">
                {FOCOS.map((foco) => {
                  const meta = ({
                    dor: { icon: "😩", desc: "Problema que o produto resolve" },
                    "benefício": { icon: "🤩", desc: "Vantagens e resultados obtidos" },
                  } as Record<string, { icon: string; desc: string }>)[foco];
                  return (
                    <button
                      key={foco}
                      type="button"
                      onClick={() => { dispatch({ type: "SET_CAMPO", campo: "foco", valor: foco }); setAngulosSelecionados([]); }}
                      className={`flex flex-col gap-0.5 px-3 py-3 rounded-lg border transition-all text-left ${
                        estado.foco === foco
                          ? "bg-violet-50 border-violet-300 shadow-sm"
                          : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-base leading-none">{meta?.icon}</span>
                      <span className={`text-sm font-semibold mt-1.5 ${estado.foco === foco ? "text-violet-700" : "text-gray-800"}`}>
                        {FOCO_LABELS[foco]}
                      </span>
                      <span className={`text-[10px] leading-tight ${estado.foco === foco ? "text-violet-500" : "text-gray-400"}`}>
                        {meta?.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ângulo Central */}
            {estado.foco && estado.produtoId && (() => {
              const tags = estado.foco === "dor" ? doresTags : beneficiosTags;
              if (tags.length === 0) return null;
              return (
                <div className="space-y-2">
                  <div>
                    <Label className="text-gray-700 text-xs">Ângulo central</Label>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Selecione o(s) ângulo(s) que vão nortear o roteiro — hooks e body
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => {
                      const ativo = angulosSelecionados.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleAngulo(tag)}
                          className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            ativo
                              ? "bg-violet-600 border-violet-600 text-white shadow-sm"
                              : "bg-white border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50"
                          }`}
                        >
                          {ativo && <span className="mr-1 text-[10px]">✓</span>}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                  {angulosSelecionados.length > 0 && (
                    <p className="text-[11px] text-violet-500 font-medium">
                      {angulosSelecionados.length === 1
                        ? "1 ângulo selecionado — será a espinha dorsal do roteiro"
                        : `${angulosSelecionados.length} ângulos selecionados`}
                    </p>
                  )}
                </div>
              );
            })()}

            {/* Oferta */}
            <div className="space-y-2">
              <Label className="text-gray-700 text-xs">
                Oferta <span className="text-gray-400 font-normal">(opcional)</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(["", "frete", "desconto", "compre_leve", "manual"] as OfertaTipo[]).map((tipo) => {
                  const meta = {
                    "":          { icon: "—", label: "Nenhuma", sub: "" },
                    frete:       { icon: "🚚", label: "Frete grátis", sub: "" },
                    desconto:    { icon: "🏷️", label: "% de desconto", sub: "" },
                    compre_leve: { icon: "🛍️", label: "Compre e Leve", sub: "" },
                    manual:      { icon: "✏️", label: "Personalizada", sub: "" },
                  }[tipo]!;
                  const ativo = estado.ofertaTipo === tipo;
                  return (
                    <button
                      key={tipo === "" ? "nenhuma" : tipo}
                      type="button"
                      onClick={() => {
                        dispatch({ type: "SET_CAMPO", campo: "ofertaTipo", valor: tipo });
                        dispatch({ type: "SET_CAMPO", campo: "ofertaV1", valor: "" });
                        dispatch({ type: "SET_CAMPO", campo: "ofertaV2", valor: "" });
                      }}
                      className={`flex flex-col gap-0.5 px-3 py-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                        ativo && tipo === ""
                          ? "bg-violet-50 border-violet-300 text-violet-700 shadow-sm"
                          : ativo
                          ? "bg-violet-50 border-violet-300 text-violet-700 shadow-sm"
                          : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      <span>{meta.icon}</span>
                      <span className="mt-0.5">{meta.label}</span>
                      {meta.sub && (
                        <span className="text-[10px] font-normal text-gray-400">{meta.sub}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Campos inline por tipo */}
              {estado.ofertaTipo === "frete" && (
                <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 mt-1">
                  <p className="text-xs text-violet-500 font-medium mb-2">Preencha os valores</p>
                  <div className="flex items-center gap-1.5 flex-wrap text-sm text-violet-900 font-medium">
                    <span>Frete grátis acima de</span>
                    <span>R$</span>
                    <input
                      autoFocus
                      type="text"
                      inputMode="decimal"
                      placeholder="150,00"
                      value={estado.ofertaV1}
                      onChange={(e) => dispatch({ type: "SET_CAMPO", campo: "ofertaV1", valor: e.target.value })}
                      className="w-24 rounded-md border border-violet-300 bg-white px-2 py-1 text-sm text-violet-900 font-semibold outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 placeholder:text-violet-300 text-center"
                    />
                    <span>hoje</span>
                  </div>
                </div>
              )}

              {estado.ofertaTipo === "desconto" && (
                <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 mt-1">
                  <p className="text-xs text-violet-500 font-medium mb-2">Preencha os valores</p>
                  <div className="flex items-center gap-1.5 flex-wrap text-sm text-violet-900 font-medium">
                    <input
                      autoFocus
                      type="text"
                      inputMode="numeric"
                      placeholder="10"
                      value={estado.ofertaV1}
                      onChange={(e) => dispatch({ type: "SET_CAMPO", campo: "ofertaV1", valor: e.target.value })}
                      className="w-16 rounded-md border border-violet-300 bg-white px-2 py-1 text-sm text-violet-900 font-semibold outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 placeholder:text-violet-300 text-center"
                    />
                    <span>% off na primeira compra</span>
                  </div>
                </div>
              )}

              {estado.ofertaTipo === "compre_leve" && (
                <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 mt-1">
                  <p className="text-xs text-violet-500 font-medium mb-2">Preencha os valores</p>
                  <div className="flex items-center gap-1.5 flex-wrap text-sm text-violet-900 font-medium">
                    <span>Compre</span>
                    <input
                      autoFocus
                      type="text"
                      inputMode="numeric"
                      placeholder="2"
                      value={estado.ofertaV1}
                      onChange={(e) => dispatch({ type: "SET_CAMPO", campo: "ofertaV1", valor: e.target.value })}
                      className="w-14 rounded-md border border-violet-300 bg-white px-2 py-1 text-sm text-violet-900 font-semibold outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 placeholder:text-violet-300 text-center"
                    />
                    <span>, leve</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="3"
                      value={estado.ofertaV2}
                      onChange={(e) => dispatch({ type: "SET_CAMPO", campo: "ofertaV2", valor: e.target.value })}
                      className="w-14 rounded-md border border-violet-300 bg-white px-2 py-1 text-sm text-violet-900 font-semibold outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 placeholder:text-violet-300 text-center"
                    />
                  </div>
                </div>
              )}

              {estado.ofertaTipo === "manual" && (
                <Textarea
                  autoFocus
                  placeholder="Descreva a oferta livremente..."
                  className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm resize-none mt-1"
                  rows={2}
                  value={estado.ofertaV1}
                  onChange={(e) => dispatch({ type: "SET_CAMPO", campo: "ofertaV1", valor: e.target.value })}
                />
              )}
            </div>

            {/* Direcionamento adicional */}
            <div className="space-y-2">
              <Label className="text-gray-700 text-xs">
                Direcionamento adicional <span className="text-gray-400 font-normal">(opcional)</span>
              </Label>
              <Input
                placeholder="Ex: Mencionar o frete grátis no final"
                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                value={estado.mensagemObrigatoria}
                onChange={(e) => dispatch({ type: "SET_CAMPO", campo: "mensagemObrigatoria", valor: e.target.value })}
              />
            </div>

          </div>

          <Button
            onClick={handleGerar}
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-5 text-sm shadow-md shadow-violet-200"
          >
            {loading ? (
              <><Loader2 size={16} className="mr-2 animate-spin" />Gerando roteiro...</>
            ) : (
              <><Wand2 size={16} className="mr-2" />Gerar roteiro</>
            )}
          </Button>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Resumo</p>
            <div className="space-y-2.5">
              <ResumoLinha label="Cliente" valor={clienteSelecionado?.nome} />
              <ResumoLinha label="Produto" valor={produtoSelecionado?.nome} />
              <ResumoLinha
                label="Avatar (Persona)"
                valor={
                  avatarSelecionadoId === "manual"
                    ? "Manual"
                    : avatarSelecionadoId
                    ? avatares.find((a) => a.id === avatarSelecionadoId)?.nome
                    : undefined
                }
              />
              <ResumoLinha label="Foco" valor={estado.foco ? FOCO_LABELS[estado.foco as FocoRoteiro] : undefined} />
              <ResumoLinha label="Ângulo central" valor={angulosSelecionados.length > 0 ? angulosSelecionados.join(", ") : undefined} />
              <ResumoLinha label="Oferta" valor={computeOferta(estado) || undefined} />
              <ResumoLinha label="Direcionamento" valor={estado.mensagemObrigatoria || undefined} />
            </div>
          </div>
        </div>

        {/* Painel de resultados */}
        <div ref={resultadoRef} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="relative mb-5">
                <div className="w-14 h-14 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center">
                  <Wand2 size={22} className="text-violet-500" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
              </div>
              <p className="text-gray-700 font-medium">Gerando roteiro...</p>
              <p className="text-gray-400 text-sm mt-1">Criando 5 hooks de alta conversão</p>
            </div>
          ) : (
            <RoteiroTable
              roteiros={roteiros}
              onRegenerateHooks={handleRegenerateHooks}
              onRegenerateCenas={handleRegenerateCenas}
              onGerarNovo={() => { setRoteiros([]); setCenesGeradas({}); }}
              hooksLoading={loading}
              cenesGeradas={cenesGeradas}
              cenesLoading={cenesLoading}
              onGerarCenas={handleGerarCenas}
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

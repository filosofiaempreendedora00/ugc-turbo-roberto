"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  Search, Star, X, Compass, ChevronRight, SlidersHorizontal,
  Construction, ExternalLink, Plus, Link2, Trash2,
  FishingHook, Tag, Globe, FileText, Pencil, Check, MessageSquare,
  ArrowLeft, Trophy, User, Film,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SEED_HOOKS, STORAGE_HOOKS, STORAGE_HOOKS_SEEDED } from "@/lib/hooks-seed";
import type { HookEstrutura } from "@/lib/hooks-seed";
import { SEED_CTAS, STORAGE_CTAS, STORAGE_CTAS_SEEDED, TIPOS_CTA } from "@/lib/ctas-seed";
import type { CtaEstrutura } from "@/lib/ctas-seed";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Nicho {
  id: string;
  emoji: string;
  nome: string;
  subnichos: string[];
  emojiBg: string;
  tagBg: string;
  tagText: string;
  tagRing: string;
  hoverShadow: string;
  drawerFrom: string;
  badgeBorder: string;
}

interface MarcaRef {
  id: string;
  nome: string;
  url: string;
  nichoId: string;
  subnicho: string;
  addedAt: string;
}

interface UGCItem {
  id: string;
  creator: string;   // nome do(a) creator que gravou
  videoUrl: string;  // link Google Drive
  roteiro: string;   // script / texto do roteiro
  addedAt: string;
}

interface CaseTurbo {
  id: string;
  nome: string;      // nome do cliente
  nichoId: string;
  subnicho: string;
  ugcs: UGCItem[];
  addedAt: string;
}

// ─── Data (sorted alphabetically) ─────────────────────────────────────────────

const NICHOS_DATA: Nicho[] = [
  {
    id: "alimentos",
    emoji: "🍔",
    nome: "Alimentos & Bebidas",
    subnichos: [
      "Alimentos funcionais / saudáveis",
      "Snacks / indulgência",
      "Bebidas",
      "Restaurantes / delivery",
    ],
    emojiBg: "bg-amber-100",
    tagBg: "bg-amber-50",
    tagText: "text-amber-700",
    tagRing: "ring-amber-200/70",
    hoverShadow: "hover:shadow-amber-100/60",
    drawerFrom: "from-amber-50",
    badgeBorder: "border-amber-200",
  },
  {
    id: "automotivo",
    emoji: "🚗",
    nome: "Automotivo",
    subnichos: ["Acessórios", "Manutenção", "Estética automotiva"],
    emojiBg: "bg-slate-100",
    tagBg: "bg-slate-50",
    tagText: "text-slate-600",
    tagRing: "ring-slate-200/70",
    hoverShadow: "hover:shadow-slate-100/60",
    drawerFrom: "from-slate-50",
    badgeBorder: "border-slate-200",
  },
  {
    id: "beleza",
    emoji: "💄",
    nome: "Beleza & Higiene",
    subnichos: [
      "Skincare",
      "Haircare",
      "Maquiagem",
      "Perfumaria",
      "Higiene pessoal",
      "Procedimentos estéticos",
    ],
    emojiBg: "bg-rose-100",
    tagBg: "bg-rose-50",
    tagText: "text-rose-700",
    tagRing: "ring-rose-200/70",
    hoverShadow: "hover:shadow-rose-100/60",
    drawerFrom: "from-rose-50",
    badgeBorder: "border-rose-200",
  },
  {
    id: "casa",
    emoji: "🏠",
    nome: "Casa & Utilidades Domésticas",
    subnichos: ["Organização", "Limpeza", "Utensílios domésticos", "Decoração"],
    emojiBg: "bg-teal-100",
    tagBg: "bg-teal-50",
    tagText: "text-teal-700",
    tagRing: "ring-teal-200/70",
    hoverShadow: "hover:shadow-teal-100/60",
    drawerFrom: "from-teal-50",
    badgeBorder: "border-teal-200",
  },
  {
    id: "educacao",
    emoji: "📚",
    nome: "Educação & Treinamento",
    subnichos: [
      "Cursos profissionalizantes",
      "Idiomas",
      "Acadêmico / concursos",
      "Habilidades digitais",
    ],
    emojiBg: "bg-blue-100",
    tagBg: "bg-blue-50",
    tagText: "text-blue-700",
    tagRing: "ring-blue-200/70",
    hoverShadow: "hover:shadow-blue-100/60",
    drawerFrom: "from-blue-50",
    badgeBorder: "border-blue-200",
  },
  {
    id: "infantil",
    emoji: "👶",
    nome: "Infantil",
    subnichos: ["Produtos para bebê", "Cuidados infantis"],
    emojiBg: "bg-sky-100",
    tagBg: "bg-sky-50",
    tagText: "text-sky-700",
    tagRing: "ring-sky-200/70",
    hoverShadow: "hover:shadow-sky-100/60",
    drawerFrom: "from-sky-50",
    badgeBorder: "border-sky-200",
  },
  {
    id: "moda",
    emoji: "👗",
    nome: "Moda & Acessórios",
    subnichos: ["Vestuário", "Moda íntima", "Acessórios"],
    emojiBg: "bg-fuchsia-100",
    tagBg: "bg-fuchsia-50",
    tagText: "text-fuchsia-700",
    tagRing: "ring-fuchsia-200/70",
    hoverShadow: "hover:shadow-fuchsia-100/60",
    drawerFrom: "from-fuchsia-50",
    badgeBorder: "border-fuchsia-200",
  },
  {
    id: "pets",
    emoji: "🐶",
    nome: "Pets",
    subnichos: ["Alimentação", "Saúde", "Acessórios"],
    emojiBg: "bg-yellow-100",
    tagBg: "bg-yellow-50",
    tagText: "text-yellow-700",
    tagRing: "ring-yellow-200/70",
    hoverShadow: "hover:shadow-yellow-100/60",
    drawerFrom: "from-yellow-50",
    badgeBorder: "border-yellow-200",
  },
  {
    id: "saude",
    emoji: "💊",
    nome: "Saúde & Suplementação",
    subnichos: [
      "Suplementos esportivos",
      "Emagrecimento",
      "Hormonal & libido",
      "Energia & foco",
      "Sono",
    ],
    emojiBg: "bg-orange-100",
    tagBg: "bg-orange-50",
    tagText: "text-orange-700",
    tagRing: "ring-orange-200/70",
    hoverShadow: "hover:shadow-orange-100/60",
    drawerFrom: "from-orange-50",
    badgeBorder: "border-orange-200",
  },
  {
    id: "saude-mental",
    emoji: "🧠",
    nome: "Saúde Mental & Comportamento",
    subnichos: [
      "Terapia / saúde mental",
      "Produtividade & hábitos",
      "Relacionamentos",
      "Autoconhecimento",
    ],
    emojiBg: "bg-violet-100",
    tagBg: "bg-violet-50",
    tagText: "text-violet-700",
    tagRing: "ring-violet-200/70",
    hoverShadow: "hover:shadow-violet-100/60",
    drawerFrom: "from-violet-50",
    badgeBorder: "border-violet-200",
  },
  {
    id: "financeiro",
    emoji: "💰",
    nome: "Serviços Financeiros",
    subnichos: ["Bancos & contas", "Crédito", "Investimentos", "Pagamentos"],
    emojiBg: "bg-emerald-100",
    tagBg: "bg-emerald-50",
    tagText: "text-emerald-700",
    tagRing: "ring-emerald-200/70",
    hoverShadow: "hover:shadow-emerald-100/60",
    drawerFrom: "from-emerald-50",
    badgeBorder: "border-emerald-200",
  },
];

// ─── Seed data ─────────────────────────────────────────────────────────────────

const SEED_MARCAS: MarcaRef[] = [
  {
    id: "sallve-001",
    nome: "Sallve",
    url: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&is_targeted_country=false&media_type=all&search_type=page&sort_data[direction]=desc&sort_data[mode]=total_impressions&view_all_page_id=451409601978604",
    nichoId: "beleza",
    subnicho: "Skincare",
    addedAt: new Date().toISOString(),
  },
];

const STORAGE_MARCAS = "ugc:referencias:marcas";
const STORAGE_FAVORITES = "ugc:referencias:favorites";
const STORAGE_SEEDED = "ugc:referencias:seeded";
const STORAGE_CASES = "ugc:referencias:cases";

// ─── Sub-components ────────────────────────────────────────────────────────────

const VISIBLE_TAGS = 4;

function NichoCard({
  nicho,
  onOpen,
  searchTerm,
  marcasCount,
  caseSubnichos,
  caseNamesBySub,
  filterByCases,
}: {
  nicho: Nicho;
  onOpen: (nicho: Nicho) => void;
  searchTerm: string;
  marcasCount: number;
  caseSubnichos: Set<string>;
  caseNamesBySub: Record<string, string[]>;
  filterByCases: boolean;
}) {
  const allSubs = filterByCases
    ? nicho.subnichos.filter((s) => caseSubnichos.has(s))
    : nicho.subnichos;
  const visibleSubs = allSubs.slice(0, VISIBLE_TAGS);
  const hiddenCount = allSubs.length - VISIBLE_TAGS;

  function highlight(text: string) {
    if (!searchTerm.trim()) return text;
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-violet-100 text-violet-800 rounded px-0.5 not-italic font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-white rounded-2xl ring-1 ring-gray-200/80 p-5 cursor-pointer",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-gray-300/60",
        nicho.hoverShadow
      )}
      onClick={() => onOpen(nicho)}
    >
      {/* Emoji */}
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 select-none shrink-0", nicho.emojiBg)}>
        {nicho.emoji}
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-3 pr-6">
        {highlight(nicho.nome)}
      </h3>

      {/* Subniche tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {visibleSubs.map((sub) => {
          const hasCase = caseSubnichos.has(sub);
          const caseNames = caseNamesBySub[sub] ?? [];
          return (
            <div key={sub} className="relative group/tag" onClick={(e) => e.stopPropagation()}>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ring-1 cursor-default",
                  nicho.tagBg, nicho.tagText, nicho.tagRing
                )}
              >
                {hasCase && <Trophy size={9} className="shrink-0 text-amber-500" />}
                {highlight(sub)}
              </span>

              {/* Tooltip com cases */}
              {hasCase && caseNames.length > 0 && (
                <div className="absolute bottom-full left-0 mb-2 z-20 pointer-events-none opacity-0 group-hover/tag:opacity-100 transition-opacity duration-150">
                  <div className="bg-gray-900 rounded-xl px-3 py-2.5 shadow-xl shadow-black/20 min-w-[140px] max-w-[220px]">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Trophy size={9} className="text-amber-400" />Cases
                    </p>
                    <ul className="space-y-0.5">
                      {caseNames.map((name) => (
                        <li key={name} className="text-xs text-white font-medium leading-snug truncate">
                          {name}
                        </li>
                      ))}
                    </ul>
                    {/* Seta */}
                    <div className="absolute top-full left-4 border-[5px] border-transparent border-t-gray-900" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {hiddenCount > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ring-1 ring-gray-200/60 bg-gray-50 text-gray-500">
            +{hiddenCount} mais
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {nicho.subnichos.length} subnicho{nicho.subnichos.length !== 1 ? "s" : ""}
          </span>
          {marcasCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 ring-1 ring-gray-200/60 rounded-md px-1.5 py-0.5">
              <Link2 size={10} />
              {marcasCount} ref{marcasCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <span className={cn("flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-violet-600 transition-colors")}>
          Explorar
          <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
}

// ─── Brand chip ────────────────────────────────────────────────────────────────

function MarcaChip({ marca, onRemove }: { marca: MarcaRef; onRemove: (id: string) => void }) {
  return (
    <div className="inline-flex items-center rounded-lg ring-1 ring-gray-200 overflow-hidden bg-white group/chip transition-all hover:ring-violet-300">
      <a
        href={marca.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-1.5 pl-2.5 pr-2 py-1 text-xs font-medium text-gray-700 hover:text-violet-700 transition-colors"
      >
        <Link2 size={10} className="text-gray-400 group-hover/chip:text-violet-500 transition-colors shrink-0" />
        <span>{marca.nome}</span>
        <ExternalLink size={9} className="text-gray-300 group-hover/chip:text-violet-400 transition-colors shrink-0" />
      </a>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(marca.id); }}
        className="px-1.5 py-1 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all border-l border-gray-200"
        aria-label={`Remover ${marca.nome}`}
      >
        <X size={10} />
      </button>
    </div>
  );
}

// ─── Case chip ─────────────────────────────────────────────────────────────────

function CaseChip({ caso, onClick, onRemove }: {
  caso: CaseTurbo;
  onClick: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="inline-flex items-center rounded-lg overflow-hidden bg-amber-500 hover:bg-amber-600 transition-all shadow-sm shadow-amber-200">
      <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 text-xs font-semibold text-white transition-colors"
      >
        <Trophy size={10} className="text-amber-200 shrink-0" />
        <span>{caso.nome}</span>
        <ChevronRight size={9} className="text-amber-200 shrink-0" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="px-1.5 py-1 text-amber-200 hover:text-white hover:bg-amber-700 transition-all border-l border-amber-400"
      >
        <X size={10} />
      </button>
    </div>
  );
}

// ─── Drawer ────────────────────────────────────────────────────────────────────

function NichoDrawer({
  nicho, isOpen, onClose,
  marcas, onAddMarca, onRemoveMarca,
  cases, onAddCase, onUpdateCase, onRemoveCase,
}: {
  nicho: Nicho | null;
  isOpen: boolean;
  onClose: () => void;
  marcas: MarcaRef[];
  onAddMarca: (m: MarcaRef) => void;
  onRemoveMarca: (id: string) => void;
  cases: CaseTurbo[];
  onAddCase: (c: CaseTurbo) => void;
  onUpdateCase: (c: CaseTurbo) => void;
  onRemoveCase: (id: string) => void;
}) {
  // ── Navigation ─────────────────────────────────────────────────────────────
  const [view, setView] = useState<"list" | "case">("list");
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);

  // ── Benchmark form ─────────────────────────────────────────────────────────
  const [addingBenchTo, setAddingBenchTo] = useState<string | null>(null);
  const [benchNome, setBenchNome] = useState("");
  const [benchUrl, setBenchUrl] = useState("");
  const [benchError, setBenchError] = useState("");
  const benchNomeRef = useRef<HTMLInputElement>(null);

  // ── Case name edit ─────────────────────────────────────────────────────────
  const [editingCaseName, setEditingCaseName] = useState(false);
  const [caseNameDraft, setCaseNameDraft] = useState("");

  // ── UGC form (add new) ─────────────────────────────────────────────────────
  const [addingUGC, setAddingUGC] = useState(false);
  const [ugcCreator, setUGCCreator] = useState("");
  const [ugcUrl, setUGCUrl] = useState("");
  const [ugcRoteiro, setUGCRoteiro] = useState("");

  // ── UGC expand / roteiro edit ──────────────────────────────────────────────
  const [expandedUGCId, setExpandedUGCId] = useState<string | null>(null);
  const [editingUGCRoteiroId, setEditingUGCRoteiroId] = useState<string | null>(null);
  const [ugcRoteiroEditDraft, setUGCRoteiroEditDraft] = useState("");

  const activeCase = cases.find((c) => c.id === activeCaseId) ?? null;

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (view === "case") { setView("list"); setActiveCaseId(null); }
        else if (addingBenchTo) { cancelBench(); }
        else { onClose(); }
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, addingBenchTo, view]);

  useEffect(() => {
    if (addingBenchTo) setTimeout(() => benchNomeRef.current?.focus(), 50);
  }, [addingBenchTo]);

  useEffect(() => {
    if (!isOpen) { setView("list"); setActiveCaseId(null); cancelBench(); }
  }, [isOpen]);

  useEffect(() => {
    if (activeCase) {
      setCaseNameDraft(activeCase.nome);
      setEditingCaseName(false);
      setAddingUGC(false);
      setExpandedUGCId(null);
      setEditingUGCRoteiroId(null);
    }
  }, [activeCaseId]); // eslint-disable-line

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getMarcasForSub = (sub: string) =>
    marcas.filter((m) => m.nichoId === nicho?.id && m.subnicho === sub);

  const getCasesForSub = (sub: string) =>
    cases.filter((c) => c.nichoId === nicho?.id && c.subnicho === sub);

  const totalMarcas = nicho ? marcas.filter((m) => m.nichoId === nicho.id).length : 0;
  const totalCases  = nicho ? cases.filter((c) => c.nichoId === nicho.id).length : 0;

  // ── Benchmark handlers ─────────────────────────────────────────────────────

  function cancelBench() {
    setAddingBenchTo(null); setBenchNome(""); setBenchUrl(""); setBenchError("");
  }

  function saveBench() {
    if (!benchNome.trim()) { setBenchError("Informe o nome da marca."); return; }
    if (!benchUrl.trim() || !benchUrl.startsWith("http")) { setBenchError("Informe uma URL válida (começa com http)."); return; }
    onAddMarca({ id: `${nicho!.id}-${Date.now()}`, nome: benchNome.trim(), url: benchUrl.trim(), nichoId: nicho!.id, subnicho: addingBenchTo!, addedAt: new Date().toISOString() });
    cancelBench();
  }

  // ── Case navigation ────────────────────────────────────────────────────────

  function createCase(sub: string) {
    const novo: CaseTurbo = { id: `case-${Date.now()}`, nome: "Novo cliente", nichoId: nicho!.id, subnicho: sub, ugcs: [], addedAt: new Date().toISOString() };
    onAddCase(novo);
    setActiveCaseId(novo.id);
    setView("case");
  }

  function openCase(caseId: string) {
    setActiveCaseId(caseId);
    setView("case");
  }

  function backToList() { setView("list"); setActiveCaseId(null); }

  // ── Case name ──────────────────────────────────────────────────────────────

  function saveCaseName() {
    if (!activeCase || !caseNameDraft.trim()) return;
    onUpdateCase({ ...activeCase, nome: caseNameDraft.trim() });
    setEditingCaseName(false);
  }

  // ── UGC handlers ───────────────────────────────────────────────────────────

  function cancelAddUGC() {
    setAddingUGC(false); setUGCCreator(""); setUGCUrl(""); setUGCRoteiro("");
  }

  function addUGC() {
    if (!activeCase || !ugcCreator.trim()) return;
    const novo: UGCItem = {
      id: `ugc-${Date.now()}`,
      creator: ugcCreator.trim(),
      videoUrl: ugcUrl.trim(),
      roteiro: ugcRoteiro,
      addedAt: new Date().toISOString(),
    };
    onUpdateCase({ ...activeCase, ugcs: [...activeCase.ugcs, novo] });
    setExpandedUGCId(novo.id);
    cancelAddUGC();
  }

  function removeUGC(ugcId: string) {
    if (!activeCase) return;
    onUpdateCase({ ...activeCase, ugcs: activeCase.ugcs.filter((u) => u.id !== ugcId) });
    if (expandedUGCId === ugcId) setExpandedUGCId(null);
  }

  function saveUGCRoteiro(ugcId: string) {
    if (!activeCase) return;
    onUpdateCase({ ...activeCase, ugcs: activeCase.ugcs.map((u) => u.id === ugcId ? { ...u, roteiro: ugcRoteiroEditDraft } : u) });
    setEditingUGCRoteiroId(null);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn("fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn("fixed top-0 right-0 h-full w-full sm:w-[460px] bg-white z-50 flex flex-col shadow-2xl shadow-black/10 transition-transform duration-300 ease-out", isOpen ? "translate-x-0" : "translate-x-full")}
        role="dialog"
        aria-modal="true"
        aria-label={nicho?.nome}
      >

        {/* ── LIST VIEW ──────────────────────────────────────────────────────── */}
        {nicho && view === "list" && (
          <>
            {/* Header */}
            <div className={cn("flex items-start gap-4 p-6 border-b border-gray-100 bg-gradient-to-br to-white", nicho.drawerFrom)}>
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-3xl select-none shrink-0 shadow-sm", nicho.emojiBg)}>
                {nicho.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 text-base leading-snug">{nicho.nome}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-gray-400">{nicho.subnichos.length} subnicho{nicho.subnichos.length !== 1 ? "s" : ""}</span>
                  {totalMarcas > 0 && (<><span className="text-gray-200">·</span><span className="flex items-center gap-1 text-xs text-gray-400"><Link2 size={10} />{totalMarcas} bench{totalMarcas !== 1 ? "marks" : "mark"}</span></>)}
                  {totalCases  > 0 && (<><span className="text-gray-200">·</span><span className="flex items-center gap-1 text-xs text-amber-500"><Trophy size={10} />{totalCases} case{totalCases !== 1 ? "s" : ""}</span></>)}
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all" aria-label="Fechar"><X size={16} /></button>
            </div>

            {/* Subnichos list */}
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <ul className="space-y-4">
                {[...nicho.subnichos].sort((a, b) => a.localeCompare(b, "pt-BR")).map((sub, i) => {
                  const subMarcas = getMarcasForSub(sub);
                  const subCases  = getCasesForSub(sub);
                  const isAddingBench = addingBenchTo === sub;
                  return (
                    <li key={sub} className="rounded-2xl ring-1 ring-gray-200 bg-white shadow-sm overflow-hidden">

                      {/* Subnicho header */}
                      <div className={cn("flex items-center gap-3 px-4 py-3 border-b border-gray-100", nicho.drawerFrom, "bg-gradient-to-r to-white")}>
                        <span className={cn("w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-sm", nicho.tagBg, nicho.tagText)}>
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-800 font-semibold flex-1 leading-snug">{sub}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {subMarcas.length > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-medium text-gray-400 bg-white/70 px-1.5 py-0.5 rounded-md ring-1 ring-gray-200/60">
                              <Link2 size={9} />{subMarcas.length}
                            </span>
                          )}
                          {subCases.length > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-medium text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-md ring-1 ring-amber-200/60">
                              <Trophy size={9} />{subCases.length}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Benchmarks do Mercado */}
                      <div className="px-4 pt-3.5 pb-3 bg-white">
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-violet-500 uppercase tracking-wider">
                            <Link2 size={9} />Benchmarks do Mercado
                          </span>
                          {!isAddingBench && (
                            <button onClick={() => { cancelBench(); setAddingBenchTo(sub); }} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-all ring-1 ring-transparent hover:ring-violet-100">
                              <Plus size={10} />Novo bench
                            </button>
                          )}
                        </div>
                        {subMarcas.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {subMarcas.map((m) => <MarcaChip key={m.id} marca={m} onRemove={onRemoveMarca} />)}
                          </div>
                        )}
                        {isAddingBench && (
                          <div className="space-y-2 bg-violet-50/60 rounded-xl p-3 ring-1 ring-violet-100">
                            <input ref={benchNomeRef} type="text" placeholder="Nome da marca (ex: Sallve)" value={benchNome} onChange={(e) => { setBenchNome(e.target.value); setBenchError(""); }} onKeyDown={(e) => e.key === "Enter" && saveBench()} className="w-full h-8 px-3 rounded-lg text-xs bg-white ring-1 ring-violet-200 focus:ring-violet-400 focus:outline-none placeholder:text-gray-400 text-gray-800" />
                            <input type="url" placeholder="URL da Biblioteca de Anúncios" value={benchUrl} onChange={(e) => { setBenchUrl(e.target.value); setBenchError(""); }} onKeyDown={(e) => e.key === "Enter" && saveBench()} className="w-full h-8 px-3 rounded-lg text-xs bg-white ring-1 ring-violet-200 focus:ring-violet-400 focus:outline-none placeholder:text-gray-400 text-gray-800" />
                            {benchError && <p className="text-xs text-red-500">{benchError}</p>}
                            <div className="flex gap-2">
                              <button onClick={saveBench} className="flex-1 h-7 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors">Salvar</button>
                              <button onClick={cancelBench} className="flex-1 h-7 rounded-lg ring-1 ring-violet-200 text-gray-500 text-xs font-medium hover:bg-white transition-colors">Cancelar</button>
                            </div>
                          </div>
                        )}
                        {subMarcas.length === 0 && !isAddingBench && (
                          <p className="text-[11px] text-gray-300 italic">Nenhum benchmark ainda.</p>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="mx-4 h-px bg-gray-100" />

                      {/* Cases Turbo */}
                      <div className="px-4 pt-3 pb-3.5 bg-amber-50/30">
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-600 uppercase tracking-wider">
                            <Trophy size={9} />Cases Turbo
                          </span>
                          <button onClick={() => createCase(sub)} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium text-gray-400 hover:text-amber-600 hover:bg-amber-100 transition-all ring-1 ring-transparent hover:ring-amber-200">
                            <Plus size={10} />Novo case
                          </button>
                        </div>
                        {subCases.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {subCases.map((c) => (
                              <CaseChip key={c.id} caso={c} onClick={() => openCase(c.id)} onRemove={() => onRemoveCase(c.id)} />
                            ))}
                          </div>
                        )}
                        {subCases.length === 0 && (
                          <p className="text-[11px] text-gray-300 italic">Nenhum case ainda.</p>
                        )}
                      </div>

                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="p-4 border-t border-gray-100">
              <p className="text-center text-xs text-gray-400">Use esses subnichos para direcionar seus roteiros UGC ✨</p>
            </div>
          </>
        )}

        {/* ── CASE VIEW ──────────────────────────────────────────────────────── */}
        {nicho && view === "case" && activeCase && (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-white shrink-0">
              <button onClick={backToList} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all shrink-0" aria-label="Voltar">
                <ArrowLeft size={16} />
              </button>
              {editingCaseName ? (
                <>
                  <input
                    autoFocus
                    value={caseNameDraft}
                    onChange={(e) => setCaseNameDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveCaseName();
                      if (e.key === "Escape") { setCaseNameDraft(activeCase.nome); setEditingCaseName(false); }
                    }}
                    className="flex-1 min-w-0 text-sm font-semibold text-gray-900 bg-gray-50 border border-violet-300 rounded-lg px-2.5 py-1 focus:outline-none focus:border-violet-500"
                  />
                  <button
                    onClick={saveCaseName}
                    className="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition-colors shrink-0"
                  >
                    <Check size={12} />Salvar
                  </button>
                  <button
                    onClick={() => { setCaseNameDraft(activeCase.nome); setEditingCaseName(false); }}
                    className="h-7 px-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-xs transition-all shrink-0"
                  >
                    <X size={13} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setCaseNameDraft(activeCase.nome); setEditingCaseName(true); }}
                  className="flex-1 text-sm font-semibold text-gray-900 text-left hover:text-violet-700 transition-colors flex items-center gap-1.5 group min-w-0"
                >
                  <span className="truncate">{activeCase.nome}</span>
                  <Pencil size={11} className="text-gray-300 group-hover:text-violet-400 transition-colors shrink-0" />
                </button>
              )}
              <span className={cn("text-[10px] px-2 py-0.5 rounded-md font-medium shrink-0 truncate max-w-[100px]", nicho.tagBg, nicho.tagText)}>
                {activeCase.subnicho}
              </span>
              <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all shrink-0" aria-label="Fechar">
                <X size={15} />
              </button>
            </div>

            {/* Sub-header: UGC count */}
            <div className="flex items-center gap-2 px-5 py-2.5 bg-amber-50/60 border-b border-amber-100/60 shrink-0">
              <Film size={13} className="text-amber-500 shrink-0" />
              <p className="text-xs text-amber-700 font-medium">
                {activeCase.ugcs.length === 0
                  ? "Nenhum vídeo UGC adicionado"
                  : `${activeCase.ugcs.length} vídeo${activeCase.ugcs.length !== 1 ? "s" : ""} UGC`}
              </p>
            </div>

            {/* UGC list */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-3">

                {activeCase.ugcs.map((ugc, idx) => {
                  const isExpanded  = expandedUGCId === ugc.id;
                  const isEditingRot = editingUGCRoteiroId === ugc.id;
                  return (
                    <div key={ugc.id} className="rounded-2xl ring-1 ring-gray-200 bg-white overflow-hidden shadow-sm">

                      {/* UGC row */}
                      <div className="flex items-center gap-3 px-4 py-3">
                        {/* Avatar numérico */}
                        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0", nicho.tagBg, nicho.tagText)}>
                          {idx + 1}
                        </div>

                        {/* Creator + link */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <User size={11} className="text-gray-400 shrink-0" />
                            <p className="text-sm font-semibold text-gray-800 truncate">{ugc.creator}</p>
                          </div>
                          {ugc.videoUrl ? (
                            <a
                              href={ugc.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 mt-0.5 text-[11px] text-violet-600 hover:text-violet-800 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={9} className="shrink-0" />
                              <span className="truncate">Ver vídeo no Drive</span>
                            </a>
                          ) : (
                            <p className="text-[11px] text-gray-300 mt-0.5 italic">Sem link de vídeo</p>
                          )}
                        </div>

                        {/* Roteiro toggle */}
                        <button
                          onClick={() => setExpandedUGCId(isExpanded ? null : ugc.id)}
                          className={cn(
                            "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all",
                            isExpanded
                              ? "bg-violet-100 text-violet-700"
                              : "text-gray-400 hover:text-violet-600 hover:bg-violet-50"
                          )}
                        >
                          <FileText size={12} />
                          Roteiro
                          <ChevronRight size={11} className={cn("transition-transform", isExpanded && "rotate-90")} />
                        </button>

                        {/* Remove */}
                        <button
                          onClick={() => removeUGC(ugc.id)}
                          className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                          aria-label="Remover UGC"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Roteiro expandido */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-3.5">
                          {isEditingRot ? (
                            <div className="space-y-2.5">
                              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Editando roteiro</p>
                              <textarea
                                autoFocus
                                value={ugcRoteiroEditDraft}
                                onChange={(e) => setUGCRoteiroEditDraft(e.target.value)}
                                rows={10}
                                placeholder="Cole ou escreva o script completo aqui..."
                                className="w-full px-3.5 py-3 rounded-xl text-xs bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none text-gray-800 resize-none leading-relaxed transition-shadow"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveUGCRoteiro(ugc.id)}
                                  className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition-colors"
                                >
                                  <Check size={12} />Salvar
                                </button>
                                <button
                                  onClick={() => setEditingUGCRoteiroId(null)}
                                  className="h-8 px-3 rounded-lg ring-1 ring-gray-200 text-gray-500 text-xs font-medium hover:bg-white transition-colors"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              {ugc.roteiro ? (
                                <pre className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed font-sans mb-3">{ugc.roteiro}</pre>
                              ) : (
                                <p className="text-xs text-gray-300 italic mb-3">Roteiro ainda não adicionado.</p>
                              )}
                              <button
                                onClick={() => { setUGCRoteiroEditDraft(ugc.roteiro); setEditingUGCRoteiroId(ugc.id); }}
                                className="flex items-center gap-1.5 h-7 px-3 rounded-lg ring-1 ring-gray-200 bg-white text-gray-500 text-xs font-medium hover:text-violet-600 hover:ring-violet-300 hover:bg-violet-50 transition-all"
                              >
                                <Pencil size={11} />{ugc.roteiro ? "Editar roteiro" : "Adicionar roteiro"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}

                {/* Add UGC form / button */}
                {addingUGC ? (
                  <div className="rounded-2xl ring-1 ring-amber-200 bg-amber-50/50 p-4 space-y-2.5">
                    <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                      <Film size={13} />Novo vídeo UGC
                    </p>
                    <input
                      autoFocus
                      type="text"
                      placeholder="Nome do(a) creator *"
                      value={ugcCreator}
                      onChange={(e) => setUGCCreator(e.target.value)}
                      onKeyDown={(e) => e.key === "Escape" && cancelAddUGC()}
                      className="w-full h-9 px-3.5 rounded-xl text-xs bg-white ring-1 ring-amber-200 focus:ring-2 focus:ring-amber-400 focus:outline-none placeholder:text-gray-400 text-gray-800"
                    />
                    <input
                      type="url"
                      placeholder="Link do Google Drive (opcional)"
                      value={ugcUrl}
                      onChange={(e) => setUGCUrl(e.target.value)}
                      className="w-full h-9 px-3.5 rounded-xl text-xs bg-white ring-1 ring-amber-200 focus:ring-2 focus:ring-amber-400 focus:outline-none placeholder:text-gray-400 text-gray-800"
                    />
                    <textarea
                      placeholder="Roteiro / script (pode preencher depois)"
                      value={ugcRoteiro}
                      onChange={(e) => setUGCRoteiro(e.target.value)}
                      rows={4}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white ring-1 ring-amber-200 focus:ring-2 focus:ring-amber-400 focus:outline-none placeholder:text-gray-400 text-gray-800 resize-none leading-relaxed"
                    />
                    <div className="flex gap-2 pt-0.5">
                      <button
                        onClick={addUGC}
                        disabled={!ugcCreator.trim()}
                        className="flex-1 h-9 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold disabled:opacity-40 transition-colors"
                      >
                        Adicionar UGC
                      </button>
                      <button
                        onClick={cancelAddUGC}
                        className="flex-1 h-9 rounded-xl ring-1 ring-amber-200 text-gray-500 text-xs font-medium hover:bg-white transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingUGC(true)}
                    className="flex items-center justify-center gap-2 w-full h-9 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors shadow-sm shadow-amber-200"
                  >
                    <Plus size={14} />Adicionar vídeo UGC
                  </button>
                )}

                {activeCase.ugcs.length === 0 && !addingUGC && (
                  <p className="text-xs text-gray-400 text-center py-6 italic">
                    Nenhum vídeo UGC neste case ainda.
                  </p>
                )}

              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── Banco de CTAs ─────────────────────────────────────────────────────────────

function BancoDeCTAs() {
  const [ctas, setCtas] = useState<CtaEstrutura[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchCta, setSearchCta] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyForm = { texto: "", tipo: "", exemplo: "" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    try {
      const seeded = localStorage.getItem(STORAGE_CTAS_SEEDED);
      const saved = localStorage.getItem(STORAGE_CTAS);
      if (!seeded) {
        localStorage.setItem(STORAGE_CTAS, JSON.stringify(SEED_CTAS));
        localStorage.setItem(STORAGE_CTAS_SEEDED, "1");
        setCtas(SEED_CTAS);
      } else if (saved) {
        setCtas(JSON.parse(saved));
      }
    } catch { /* ignore */ }
  }, []);

  const saveCtas = (updated: CtaEstrutura[]) => {
    setCtas(updated);
    try { localStorage.setItem(STORAGE_CTAS, JSON.stringify(updated)); } catch { /* ignore */ }
  };

  const handleSubmit = () => {
    if (!form.texto.trim()) return;
    if (editingId) {
      saveCtas(ctas.map((c) => c.id === editingId ? { ...c, ...form } : c));
      setEditingId(null);
    } else {
      const novo: CtaEstrutura = {
        id: `${Date.now()}-${Math.random()}`,
        ...form,
        addedAt: new Date().toISOString(),
      };
      saveCtas([...ctas, novo]);
    }
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleEdit = (c: CtaEstrutura) => {
    setForm({ texto: c.texto, tipo: c.tipo, exemplo: c.exemplo });
    setEditingId(c.id);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    saveCtas(ctas.filter((c) => c.id !== id));
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const filtered = ctas.filter((c) => {
    const q = searchCta.toLowerCase();
    const matchQ = !q || c.texto.toLowerCase().includes(q) || c.exemplo.toLowerCase().includes(q);
    const matchTipo = !filterTipo || c.tipo === filterTipo;
    return matchQ && matchTipo;
  });

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchCta}
            onChange={(e) => setSearchCta(e.target.value)}
            placeholder="Buscar texto ou exemplo…"
            className="w-full h-10 pl-10 pr-9 rounded-xl text-sm bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none placeholder:text-gray-400 text-gray-900 transition-shadow"
          />
          {searchCta && (
            <button onClick={() => setSearchCta("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-gray-400 hover:text-gray-600 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
          className="h-10 px-3 rounded-xl text-sm bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none text-gray-700 transition-shadow"
        >
          <option value="">Todos os tipos</option>
          {TIPOS_CTA.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          className="h-10 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium flex items-center gap-2 shrink-0 transition-colors shadow-sm"
        >
          <Plus size={15} />
          Adicionar CTA
        </button>
      </div>

      {/* Form — adicionar novo */}
      {showForm && (
        <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-800">Nova estrutura de CTA</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Texto <span className="text-red-400">*</span></label>
              <input
                autoFocus
                value={form.texto}
                onChange={(e) => setForm((f) => ({ ...f, texto: e.target.value }))}
                placeholder="Ex: Corre no link da bio antes de acabar o estoque!"
                className="w-full h-10 px-3.5 rounded-xl text-sm bg-gray-50 ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none text-gray-900 transition-shadow"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}
                className="w-full h-10 px-3.5 rounded-xl text-sm bg-gray-50 ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none text-gray-700 transition-shadow"
              >
                <option value="">Selecionar…</option>
                {TIPOS_CTA.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Exemplo preenchido</label>
              <input
                value={form.exemplo}
                onChange={(e) => setForm((f) => ({ ...f, exemplo: e.target.value }))}
                placeholder="Ex: Corre no link da bio, o desconto vai até meia-noite!"
                className="w-full h-10 px-3.5 rounded-xl text-sm bg-gray-50 ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none text-gray-900 transition-shadow"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button onClick={handleCancel} className="h-9 px-4 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 ring-1 ring-gray-200 hover:ring-gray-300 bg-white transition-all">
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!form.texto.trim()}
              className="h-9 px-4 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Check size={14} />
              Adicionar
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {ctas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-5 text-3xl select-none">
            💬
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1.5">Banco de CTAs vazio</h3>
          <p className="text-sm text-gray-400 max-w-xs mb-5">
            Adicione os textos de CTA que mais convertem para usar como referência nos seus roteiros UGC.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={14} />
            Adicionar primeiro CTA
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-gray-400">Nenhum CTA encontrado para essa busca.</p>
          <button onClick={() => { setSearchCta(""); setFilterTipo(""); }} className="mt-3 text-xs text-violet-600 hover:underline font-medium">
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl ring-1 ring-gray-200 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><FileText size={11} />Texto / Exemplo</span>
            <span className="flex items-center gap-1.5 justify-center"><Tag size={11} />Tipo</span>
            <span />
          </div>
          {/* Rows */}
          <div className="divide-y divide-gray-50">
            {filtered.map((c, i) => (
              editingId === c.id ? (
                <div key={c.id} className="px-4 py-4 bg-violet-50/40 space-y-3">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1.5 block">Texto <span className="text-red-400">*</span></label>
                      <input
                        autoFocus
                        value={form.texto}
                        onChange={(e) => setForm((f) => ({ ...f, texto: e.target.value }))}
                        className="w-full h-10 px-3.5 rounded-xl text-sm bg-white ring-1 ring-violet-300 focus:ring-2 focus:ring-violet-400 focus:outline-none text-gray-900 transition-shadow"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1.5 block">Tipo</label>
                      <select
                        value={form.tipo}
                        onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}
                        className="w-full h-10 px-3.5 rounded-xl text-sm bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none text-gray-700 transition-shadow"
                      >
                        <option value="">Selecionar…</option>
                        {TIPOS_CTA.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1.5 block">Exemplo preenchido</label>
                      <input
                        value={form.exemplo}
                        onChange={(e) => setForm((f) => ({ ...f, exemplo: e.target.value }))}
                        placeholder="Ex: Corre no link da bio, o desconto vai até meia-noite!"
                        className="w-full h-10 px-3.5 rounded-xl text-sm bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none text-gray-900 transition-shadow"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={handleCancel} className="h-9 px-4 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 ring-1 ring-gray-200 hover:ring-gray-300 bg-white transition-all">
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!form.texto.trim()}
                      className="h-9 px-4 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Check size={14} />
                      Salvar
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={c.id}
                  className={cn(
                    "grid grid-cols-[1fr_auto_auto] gap-x-4 px-4 py-3.5 items-start group hover:bg-gray-50/70 transition-colors",
                    i % 2 === 0 ? "" : "bg-gray-50/30"
                  )}
                >
                  {/* Texto + exemplo */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 leading-snug">{c.texto}</p>
                    {c.exemplo && (
                      <p className="text-xs text-gray-400 mt-1 italic leading-relaxed">&ldquo;{c.exemplo}&rdquo;</p>
                    )}
                  </div>
                  {/* Tipo */}
                  <div className="flex items-start pt-0.5">
                    {c.tipo ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-violet-50 text-violet-700 ring-1 ring-violet-100 whitespace-nowrap capitalize">
                        {c.tipo}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(c)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                      title="Editar"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      title="Remover"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
          {/* Footer count */}
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400">
              {filtered.length} CTA{filtered.length !== 1 ? "s" : ""}
              {(searchCta || filterTipo) ? ` (filtrado de ${ctas.length})` : " no banco"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Banco de Hooks ────────────────────────────────────────────────────────────

const CATEGORIAS_HOOK = ["Dor", "Desejo"];

function BancoDeHooks() {
  const [hooks, setHooks] = useState<HookEstrutura[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchHook, setSearchHook] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterNicho, setFilterNicho] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyForm = { estrutura: "", categoria: "", nicho: "", exemplo: "" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    try {
      const seeded = localStorage.getItem(STORAGE_HOOKS_SEEDED);
      const saved = localStorage.getItem(STORAGE_HOOKS);
      if (!seeded) {
        localStorage.setItem(STORAGE_HOOKS, JSON.stringify(SEED_HOOKS));
        localStorage.setItem(STORAGE_HOOKS_SEEDED, "1");
        setHooks(SEED_HOOKS);
      } else if (saved) {
        // Migração: normaliza categorias legadas → só "Dor" ou "Desejo"
        const parsed: HookEstrutura[] = JSON.parse(saved);
        const migrated = parsed.map((h) =>
          h.categoria !== "Dor" && h.categoria !== "Desejo"
            ? { ...h, categoria: "Desejo" }
            : h
        );
        const changed = migrated.some((h, i) => h.categoria !== parsed[i].categoria);
        if (changed) localStorage.setItem(STORAGE_HOOKS, JSON.stringify(migrated));
        setHooks(migrated);
      }
    } catch { /* ignore */ }
  }, []);

  const saveHooks = (updated: HookEstrutura[]) => {
    setHooks(updated);
    try { localStorage.setItem(STORAGE_HOOKS, JSON.stringify(updated)); } catch { /* ignore */ }
  };

  const handleSubmit = () => {
    if (!form.estrutura.trim()) return;
    if (editingId) {
      saveHooks(hooks.map((h) => h.id === editingId ? { ...h, ...form } : h));
      setEditingId(null);
    } else {
      const novo: HookEstrutura = {
        id: `${Date.now()}-${Math.random()}`,
        ...form,
        addedAt: new Date().toISOString(),
      };
      saveHooks([...hooks, novo]);
    }
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleEdit = (h: HookEstrutura) => {
    setForm({ estrutura: h.estrutura, categoria: h.categoria, nicho: h.nicho, exemplo: h.exemplo });
    setEditingId(h.id);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    saveHooks(hooks.filter((h) => h.id !== id));
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const nichos = useMemo(() => {
    const set = new Set<string>();
    hooks.forEach((h) => { if (h.nicho) set.add(h.nicho); });
    return Array.from(set).sort();
  }, [hooks]);

  const filtered = hooks.filter((h) => {
    const q = searchHook.toLowerCase();
    const matchQ = !q || h.estrutura.toLowerCase().includes(q) || h.exemplo.toLowerCase().includes(q) || h.nicho.toLowerCase().includes(q);
    const matchCat = !filterCategoria || h.categoria === filterCategoria;
    const matchNicho = !filterNicho || h.nicho === filterNicho;
    return matchQ && matchCat && matchNicho;
  });

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        {/* Row 1: search + nicho dropdown + add button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchHook}
              onChange={(e) => setSearchHook(e.target.value)}
              placeholder="Buscar estrutura, exemplo…"
              className="w-full h-10 pl-10 pr-9 rounded-xl text-sm bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none placeholder:text-gray-400 text-gray-900 transition-shadow"
            />
            {searchHook && (
              <button onClick={() => setSearchHook("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-gray-400 hover:text-gray-600 transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
          <select
            value={filterNicho}
            onChange={(e) => setFilterNicho(e.target.value)}
            className="h-10 px-3 rounded-xl text-sm bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none text-gray-700 transition-shadow"
          >
            <option value="">Todos os nichos</option>
            {nichos.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
            className="h-10 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium flex items-center gap-2 shrink-0 transition-colors shadow-sm"
          >
            <Plus size={15} />
            Adicionar hook
          </button>
        </div>
        {/* Row 2: categoria pill filters */}
        <div className="flex items-center gap-2">
          {["", ...CATEGORIAS_HOOK].map((c) => (
            <button
              key={c}
              onClick={() => setFilterCategoria(c)}
              className={cn(
                "h-8 px-3.5 rounded-lg text-xs font-medium transition-all",
                filterCategoria === c
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-white ring-1 ring-gray-200 text-gray-500 hover:ring-violet-300 hover:text-violet-600"
              )}
            >
              {c === "" ? "Todos" : c}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-800">
            {editingId ? "Editar estrutura" : "Nova estrutura de hook"}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Estrutura <span className="text-red-400">*</span></label>
              <input
                value={form.estrutura}
                onChange={(e) => setForm((f) => ({ ...f, estrutura: e.target.value }))}
                placeholder="Ex: Você sabia que [fato surpreendente] sobre [tema]?"
                className="w-full h-10 px-3.5 rounded-xl text-sm bg-gray-50 ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none text-gray-900 transition-shadow"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Categoria</label>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
                  className="w-full h-10 px-3.5 rounded-xl text-sm bg-gray-50 ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none text-gray-700 transition-shadow"
                >
                  <option value="">Selecionar…</option>
                  {CATEGORIAS_HOOK.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Nicho (opcional)</label>
                <input
                  value={form.nicho}
                  onChange={(e) => setForm((f) => ({ ...f, nicho: e.target.value }))}
                  placeholder="Ex: Skincare, Geral, Fitness…"
                  className="w-full h-10 px-3.5 rounded-xl text-sm bg-gray-50 ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none text-gray-900 transition-shadow"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Exemplo preenchido</label>
              <input
                value={form.exemplo}
                onChange={(e) => setForm((f) => ({ ...f, exemplo: e.target.value }))}
                placeholder="Ex: Você sabia que 70% das mulheres erram na rotina de skincare?"
                className="w-full h-10 px-3.5 rounded-xl text-sm bg-gray-50 ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none text-gray-900 transition-shadow"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button onClick={handleCancel} className="h-9 px-4 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 ring-1 ring-gray-200 hover:ring-gray-300 bg-white transition-all">
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!form.estrutura.trim()}
              className="h-9 px-4 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Check size={14} />
              {editingId ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {hooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-5 text-3xl select-none">
            ⚡
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1.5">Banco de hooks vazio</h3>
          <p className="text-sm text-gray-400 max-w-xs mb-5">
            Adicione as estruturas de hooks vencedores para usar como referência nos seus roteiros UGC.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={14} />
            Adicionar primeiro hook
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-gray-400">Nenhuma estrutura encontrada para essa busca.</p>
          <button onClick={() => { setSearchHook(""); setFilterCategoria(""); setFilterNicho(""); }} className="mt-3 text-xs text-violet-600 hover:underline font-medium">
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl ring-1 ring-gray-200 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><FileText size={11} />Estrutura / Exemplo</span>
            <span className="flex items-center gap-1.5 justify-center"><Tag size={11} />Categoria</span>
            <span className="flex items-center gap-1.5 justify-center"><Globe size={11} />Nicho</span>
            <span />
          </div>
          {/* Rows */}
          <div className="divide-y divide-gray-50">
            {filtered.map((h, i) => (
              editingId === h.id ? (
                <div key={h.id} className="px-4 py-4 bg-violet-50/40 space-y-3">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1.5 block">Estrutura <span className="text-red-400">*</span></label>
                      <input
                        autoFocus
                        value={form.estrutura}
                        onChange={(e) => setForm((f) => ({ ...f, estrutura: e.target.value }))}
                        className="w-full h-10 px-3.5 rounded-xl text-sm bg-white ring-1 ring-violet-300 focus:ring-2 focus:ring-violet-400 focus:outline-none text-gray-900 transition-shadow"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1.5 block">Categoria</label>
                        <select
                          value={form.categoria}
                          onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
                          className="w-full h-10 px-3.5 rounded-xl text-sm bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none text-gray-700 transition-shadow"
                        >
                          <option value="">Selecionar…</option>
                          {CATEGORIAS_HOOK.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1.5 block">Nicho (opcional)</label>
                        <input
                          value={form.nicho}
                          onChange={(e) => setForm((f) => ({ ...f, nicho: e.target.value }))}
                          placeholder="Ex: Skincare, Geral, Fitness…"
                          className="w-full h-10 px-3.5 rounded-xl text-sm bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none text-gray-900 transition-shadow"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1.5 block">Exemplo preenchido</label>
                      <input
                        value={form.exemplo}
                        onChange={(e) => setForm((f) => ({ ...f, exemplo: e.target.value }))}
                        placeholder="Ex: Você sabia que 70% das mulheres erram na rotina de skincare?"
                        className="w-full h-10 px-3.5 rounded-xl text-sm bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none text-gray-900 transition-shadow"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={handleCancel} className="h-9 px-4 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 ring-1 ring-gray-200 hover:ring-gray-300 bg-white transition-all">
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!form.estrutura.trim()}
                      className="h-9 px-4 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Check size={14} />
                      Salvar
                    </button>
                  </div>
                </div>
              ) : (
              <div
                key={h.id}
                className={cn(
                  "grid grid-cols-[1fr_auto_auto_auto] gap-x-4 px-4 py-3.5 items-start group hover:bg-gray-50/70 transition-colors",
                  i % 2 === 0 ? "" : "bg-gray-50/30"
                )}
              >
                {/* Estrutura + exemplo */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 leading-snug">{h.estrutura}</p>
                  {h.exemplo && (
                    <p className="text-xs text-gray-400 mt-1 italic leading-relaxed">&ldquo;{h.exemplo}&rdquo;</p>
                  )}
                </div>
                {/* Categoria */}
                <div className="flex items-start pt-0.5">
                  {h.categoria ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-violet-50 text-violet-700 ring-1 ring-violet-100 whitespace-nowrap">
                      {h.categoria}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </div>
                {/* Nicho */}
                <div className="flex items-start pt-0.5">
                  {h.nicho ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 ring-1 ring-gray-200 whitespace-nowrap">
                      {h.nicho}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-300">Geral</span>
                  )}
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(h)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                    title="Editar"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(h.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    title="Remover"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              )
            ))}
          </div>
          {/* Footer count */}
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400">
              {filtered.length} estrutura{filtered.length !== 1 ? "s" : ""}
              {(searchHook || filterCategoria || filterNicho) ? ` (filtrado de ${hooks.length})` : " no banco"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Roteiros Turbo Tab ────────────────────────────────────────────────────────

function RoteirosturboTab({
  cases,
  onAddCase,
  onUpdateCase,
  onRemoveCase,
}: {
  cases: CaseTurbo[];
  onAddCase: (c: CaseTurbo) => void;
  onUpdateCase: (c: CaseTurbo) => void;
  onRemoveCase: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({ nome: "", nichoId: "", subnicho: "", creator: "", videoUrl: "", roteiro: "" });
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);
  const [addingUGCForCaseId, setAddingUGCForCaseId] = useState<string | null>(null);
  const [ugcForm, setUgcForm] = useState({ creator: "", videoUrl: "", roteiro: "" });
  const [expandedUGCId, setExpandedUGCId] = useState<string | null>(null);
  const [editingRoteiroUGCId, setEditingRoteiroUGCId] = useState<string | null>(null);
  const [roteiroEditDraft, setRoteiroEditDraft] = useState("");
  const [confirmDeleteCaseId, setConfirmDeleteCaseId] = useState<string | null>(null);

  const selectedNicho = NICHOS_DATA.find((n) => n.id === createForm.nichoId);
  const subnichoOptions = selectedNicho?.subnichos ?? [];

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return cases;
    return cases.filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        c.subnicho.toLowerCase().includes(q)
    );
  }, [cases, search]);

  function handleCreateCase() {
    if (!createForm.nome.trim() || !createForm.nichoId || !createForm.subnicho || !createForm.creator.trim() || !createForm.videoUrl.trim() || !createForm.roteiro.trim()) return;
    const newCase: CaseTurbo = {
      id: `case-${Date.now()}`,
      nome: createForm.nome.trim(),
      nichoId: createForm.nichoId,
      subnicho: createForm.subnicho,
      ugcs: [{
        id: `ugc-${Date.now()}`,
        creator: createForm.creator.trim(),
        videoUrl: createForm.videoUrl.trim(),
        roteiro: createForm.roteiro.trim(),
        addedAt: new Date().toISOString(),
      }],
      addedAt: new Date().toISOString(),
    };
    onAddCase(newCase);
    setCreateForm({ nome: "", nichoId: "", subnicho: "", creator: "", videoUrl: "", roteiro: "" });
    setShowCreateForm(false);
    setExpandedCaseId(newCase.id);
  }

  function handleAddUGC(caso: CaseTurbo) {
    if (!ugcForm.creator.trim()) return;
    const newUGC: UGCItem = {
      id: `ugc-${Date.now()}`,
      creator: ugcForm.creator.trim(),
      videoUrl: ugcForm.videoUrl.trim(),
      roteiro: ugcForm.roteiro.trim(),
      addedAt: new Date().toISOString(),
    };
    onUpdateCase({ ...caso, ugcs: [...caso.ugcs, newUGC] });
    setUgcForm({ creator: "", videoUrl: "", roteiro: "" });
    setAddingUGCForCaseId(null);
  }

  function handleRemoveUGC(caso: CaseTurbo, ugcId: string) {
    onUpdateCase({ ...caso, ugcs: caso.ugcs.filter((u) => u.id !== ugcId) });
    if (expandedUGCId === ugcId) setExpandedUGCId(null);
    if (editingRoteiroUGCId === ugcId) setEditingRoteiroUGCId(null);
  }

  function handleSaveRoteiro(caso: CaseTurbo, ugcId: string) {
    onUpdateCase({
      ...caso,
      ugcs: caso.ugcs.map((u) =>
        u.id === ugcId ? { ...u, roteiro: roteiroEditDraft } : u
      ),
    });
    setEditingRoteiroUGCId(null);
    setRoteiroEditDraft("");
  }

  return (
    <div>
      {/* Modal de confirmação de exclusão */}
      {confirmDeleteCaseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDeleteCaseId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50 mx-auto mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="text-base font-bold text-gray-900 text-center mb-1">Excluir este case?</h3>
            <p className="text-sm text-gray-400 text-center leading-relaxed mb-6">Todos os UGCs e roteiros vinculados serão perdidos permanentemente. Essa ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteCaseId(null)}
                className="flex-1 h-10 rounded-xl ring-1 ring-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => { onRemoveCase(confirmDeleteCaseId); setConfirmDeleteCaseId(null); }}
                className="flex-1 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar case ou subnicho..."
            className={cn(
              "w-full h-10 pl-10 pr-9 rounded-xl text-sm bg-white",
              "ring-1 ring-gray-200 focus:ring-2 focus:ring-amber-400 focus:outline-none",
              "placeholder:text-gray-400 text-gray-900 transition-shadow"
            )}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => { setShowCreateForm((v) => !v); }}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ring-1 transition-all duration-150",
            showCreateForm
              ? "bg-amber-500 text-white ring-amber-500 shadow-sm shadow-amber-200"
              : "bg-amber-500 text-white ring-amber-500 shadow-sm shadow-amber-200 hover:bg-amber-600"
          )}
        >
          <Plus size={14} />
          Adicionar case
        </button>
      </div>

      {/* Create form */}
      {showCreateForm && (
        <div className="mb-6 p-5 rounded-2xl ring-1 ring-amber-200 bg-amber-50/40">
          <h3 className="text-sm font-semibold text-amber-800 mb-4 flex items-center gap-2">
            <Trophy size={14} className="text-amber-500" />
            Novo case
          </h3>
          {/* Dados do case */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <input
              type="text"
              value={createForm.nome}
              onChange={(e) => setCreateForm((f) => ({ ...f, nome: e.target.value }))}
              placeholder="Nome do cliente *"
              className={cn(
                "h-10 px-3.5 rounded-xl text-sm bg-white",
                "ring-1 ring-amber-200 focus:ring-2 focus:ring-amber-400 focus:outline-none",
                "placeholder:text-gray-400 text-gray-900 transition-shadow"
              )}
            />
            <select
              value={createForm.nichoId}
              onChange={(e) => setCreateForm((f) => ({ ...f, nichoId: e.target.value, subnicho: "" }))}
              className={cn(
                "h-10 px-3.5 rounded-xl text-sm bg-white",
                "ring-1 ring-amber-200 focus:ring-2 focus:ring-amber-400 focus:outline-none",
                "text-gray-900 transition-shadow"
              )}
            >
              <option value="">Selecionar nicho *</option>
              {NICHOS_DATA.map((n) => (
                <option key={n.id} value={n.id}>{n.emoji} {n.nome}</option>
              ))}
            </select>
            <select
              value={createForm.subnicho}
              onChange={(e) => setCreateForm((f) => ({ ...f, subnicho: e.target.value }))}
              disabled={!createForm.nichoId}
              className={cn(
                "h-10 px-3.5 rounded-xl text-sm bg-white",
                "ring-1 ring-amber-200 focus:ring-2 focus:ring-amber-400 focus:outline-none",
                "text-gray-900 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <option value="">Selecionar subnicho *</option>
              {subnichoOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Dados do UGC */}
          <div className="mb-4 pt-4 border-t border-amber-100">
            <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5 mb-3">
              <Film size={12} />
              Vídeo UGC *
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                value={createForm.creator}
                onChange={(e) => setCreateForm((f) => ({ ...f, creator: e.target.value }))}
                placeholder="Nome do creator *"
                className={cn(
                  "h-10 px-3.5 rounded-xl text-sm bg-white",
                  "ring-1 ring-amber-200 focus:ring-2 focus:ring-amber-400 focus:outline-none",
                  "placeholder:text-gray-400 text-gray-900 transition-shadow"
                )}
              />
              <input
                type="url"
                value={createForm.videoUrl}
                onChange={(e) => setCreateForm((f) => ({ ...f, videoUrl: e.target.value }))}
                placeholder="Link do Google Drive *"
                className={cn(
                  "h-10 px-3.5 rounded-xl text-sm bg-white",
                  "ring-1 ring-amber-200 focus:ring-2 focus:ring-amber-400 focus:outline-none",
                  "placeholder:text-gray-400 text-gray-900 transition-shadow"
                )}
              />
            </div>
            <textarea
              value={createForm.roteiro}
              onChange={(e) => setCreateForm((f) => ({ ...f, roteiro: e.target.value }))}
              placeholder="Roteiro *"
              rows={5}
              className={cn(
                "w-full px-3.5 py-2.5 rounded-xl text-sm bg-white resize-none leading-relaxed",
                "ring-1 ring-amber-200 focus:ring-2 focus:ring-amber-400 focus:outline-none",
                "placeholder:text-gray-400 text-gray-900 transition-shadow"
              )}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCreateCase}
              disabled={!createForm.nome.trim() || !createForm.nichoId || !createForm.subnicho || !createForm.creator.trim() || !createForm.videoUrl.trim() || !createForm.roteiro.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-amber-500 text-white ring-1 ring-amber-500 shadow-sm shadow-amber-200 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Check size={14} />
              Criar
            </button>
            <button
              onClick={() => { setShowCreateForm(false); setCreateForm({ nome: "", nichoId: "", subnicho: "", creator: "", videoUrl: "", roteiro: "" }); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white text-gray-500 ring-1 ring-gray-200 hover:text-gray-700 transition-all"
            >
              <X size={14} />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Cases list */}
      {cases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-5 text-3xl select-none">
            🏆
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1.5">Nenhum case ainda</h3>
          <p className="text-sm text-gray-400 max-w-xs mb-5">
            Adicione seus cases turbo para guardar roteiros que funcionaram com cada cliente.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold ring-1 ring-amber-500 shadow-sm shadow-amber-200 hover:bg-amber-600 transition-all"
          >
            <Plus size={14} />
            Adicionar primeiro case
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 text-2xl select-none">
            👀
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1.5">Nenhum case encontrado</h3>
          <p className="text-sm text-gray-400 max-w-xs mb-4">Tente ajustar sua busca.</p>
          <button
            onClick={() => setSearch("")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white ring-1 ring-gray-200 text-sm font-medium text-gray-600 hover:ring-gray-300 hover:text-gray-800 transition-all"
          >
            <X size={14} />
            Limpar busca
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((caso) => {
            const nichoEmoji = NICHOS_DATA.find((n) => n.id === caso.nichoId)?.emoji ?? "📁";
            const isExpanded = expandedCaseId === caso.id;
            return (
              <div
                key={caso.id}
                className="rounded-2xl ring-1 ring-amber-200 bg-amber-50/20 overflow-hidden"
              >
                {/* Case header */}
                <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-amber-50 to-white">
                  <Trophy size={15} className="text-amber-400 shrink-0" />
                  <span className="flex-1 text-sm font-semibold text-gray-800 truncate">{caso.nome}</span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-100 text-amber-700 ring-1 ring-amber-200 whitespace-nowrap shrink-0">
                    {nichoEmoji} {caso.subnicho}
                  </span>
                  <button
                    onClick={() => setExpandedCaseId(isExpanded ? null : caso.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-100 transition-all shrink-0"
                    title={isExpanded ? "Recolher" : "Expandir"}
                  >
                    <ChevronRight
                      size={15}
                      className={cn("transition-transform duration-200", isExpanded && "rotate-90")}
                    />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteCaseId(caso.id)}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                    title="Remover case"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-amber-100">
                    {/* UGC items */}
                    {caso.ugcs.length === 0 && addingUGCForCaseId !== caso.id && (
                      <p className="text-xs text-gray-400 italic py-3 text-center">
                        Nenhum UGC adicionado ainda.
                      </p>
                    )}
                    {caso.ugcs.map((ugc, idx) => {
                      const isUGCExpanded = expandedUGCId === ugc.id;
                      const isEditingRoteiro = editingRoteiroUGCId === ugc.id;
                      return (
                        <div key={ugc.id} className="mb-2 rounded-xl ring-1 ring-amber-100 bg-white overflow-hidden">
                          {/* UGC row */}
                          <div className="flex items-center gap-3 px-3.5 py-2.5">
                            {/* Numbered avatar */}
                            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </div>
                            <User size={13} className="text-gray-400 shrink-0" />
                            <span className="flex-1 text-sm text-gray-700 font-medium truncate">{ugc.creator}</span>
                            {ugc.videoUrl && (
                              <a
                                href={ugc.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 hover:underline shrink-0"
                                title="Ver vídeo"
                              >
                                <Film size={12} />
                                Vídeo
                                <ExternalLink size={11} />
                              </a>
                            )}
                            <button
                              onClick={() => setExpandedUGCId(isUGCExpanded ? null : ugc.id)}
                              className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all shrink-0",
                                isUGCExpanded
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-600"
                              )}
                              title="Ver roteiro"
                            >
                              <FileText size={12} />
                              Roteiro
                            </button>
                            <button
                              onClick={() => handleRemoveUGC(caso, ugc.id)}
                              className="p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                              title="Remover UGC"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {/* Roteiro expanded */}
                          {isUGCExpanded && (
                            <div className="border-t border-amber-100 px-3.5 py-3 bg-amber-50/30">
                              {isEditingRoteiro ? (
                                <div className="flex flex-col gap-2">
                                  <textarea
                                    value={roteiroEditDraft}
                                    onChange={(e) => setRoteiroEditDraft(e.target.value)}
                                    rows={6}
                                    className={cn(
                                      "w-full px-3.5 py-3 rounded-xl text-sm bg-white resize-none",
                                      "ring-1 ring-amber-300 focus:ring-2 focus:ring-amber-400 focus:outline-none",
                                      "text-gray-800 placeholder:text-gray-400 transition-shadow"
                                    )}
                                    placeholder="Cole ou escreva o roteiro aqui..."
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleSaveRoteiro(caso, ugc.id)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-all"
                                    >
                                      <Check size={12} />
                                      Salvar
                                    </button>
                                    <button
                                      onClick={() => { setEditingRoteiroUGCId(null); setRoteiroEditDraft(""); }}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-gray-500 ring-1 ring-gray-200 hover:text-gray-700 transition-all"
                                    >
                                      <X size={12} />
                                      Cancelar
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  {ugc.roteiro ? (
                                    <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed mb-2 max-h-48 overflow-y-auto">
                                      {ugc.roteiro}
                                    </pre>
                                  ) : (
                                    <p className="text-xs text-gray-400 italic mb-2">Roteiro não adicionado.</p>
                                  )}
                                  <button
                                    onClick={() => {
                                      setEditingRoteiroUGCId(ugc.id);
                                      setRoteiroEditDraft(ugc.roteiro);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-amber-600 ring-1 ring-amber-200 hover:bg-amber-50 transition-all"
                                  >
                                    <Pencil size={12} />
                                    {ugc.roteiro ? "Editar roteiro" : "Adicionar roteiro"}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Add UGC section */}
                    {addingUGCForCaseId === caso.id ? (
                      <div className="mt-2 p-4 rounded-xl ring-1 ring-amber-200 bg-amber-50/30">
                        <p className="text-xs font-semibold text-amber-700 mb-3 flex items-center gap-1.5">
                          <User size={12} />
                          Novo UGC
                        </p>
                        <div className="flex flex-col gap-2 mb-3">
                          <input
                            type="text"
                            value={ugcForm.creator}
                            onChange={(e) => setUgcForm((f) => ({ ...f, creator: e.target.value }))}
                            placeholder="Nome do creator *"
                            className={cn(
                              "h-9 px-3.5 rounded-xl text-sm bg-white",
                              "ring-1 ring-amber-200 focus:ring-2 focus:ring-amber-400 focus:outline-none",
                              "placeholder:text-gray-400 text-gray-900 transition-shadow"
                            )}
                          />
                          <input
                            type="url"
                            value={ugcForm.videoUrl}
                            onChange={(e) => setUgcForm((f) => ({ ...f, videoUrl: e.target.value }))}
                            placeholder="URL do vídeo (Google Drive, etc.)"
                            className={cn(
                              "h-9 px-3.5 rounded-xl text-sm bg-white",
                              "ring-1 ring-amber-200 focus:ring-2 focus:ring-amber-400 focus:outline-none",
                              "placeholder:text-gray-400 text-gray-900 transition-shadow"
                            )}
                          />
                          <textarea
                            value={ugcForm.roteiro}
                            onChange={(e) => setUgcForm((f) => ({ ...f, roteiro: e.target.value }))}
                            placeholder="Roteiro"
                            rows={4}
                            className={cn(
                              "px-3.5 py-2.5 rounded-xl text-sm bg-white resize-none",
                              "ring-1 ring-amber-200 focus:ring-2 focus:ring-amber-400 focus:outline-none",
                              "placeholder:text-gray-400 text-gray-900 transition-shadow"
                            )}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddUGC(caso)}
                            disabled={!ugcForm.creator.trim()}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                          >
                            <Check size={12} />
                            Adicionar
                          </button>
                          <button
                            onClick={() => { setAddingUGCForCaseId(null); setUgcForm({ creator: "", videoUrl: "", roteiro: "" }); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-gray-500 ring-1 ring-gray-200 hover:text-gray-700 transition-all"
                          >
                            <X size={12} />
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setAddingUGCForCaseId(caso.id); setUgcForm({ creator: "", videoUrl: "", roteiro: "" }); }}
                        className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-600 ring-1 ring-dashed ring-amber-300 hover:bg-amber-50 transition-all"
                      >
                        <Plus size={13} />
                        Adicionar UGC
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ReferenciasPage() {
  const [activeTab, setActiveTab] = useState<"nichos" | "hooks" | "ctas" | "turbo">("nichos");
  const [search, setSearch] = useState("");
  const [marcas, setMarcas] = useState<MarcaRef[]>([]);
  const [activeNicho, setActiveNicho] = useState<Nicho | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cases, setCases] = useState<CaseTurbo[]>([]);
  const [filterByCases, setFilterByCases] = useState(false);

  // ── Persistence ────────────────────────────────────────────────────────────

  useEffect(() => {
    try {
      const seeded = localStorage.getItem(STORAGE_SEEDED);
      const savedMarcas = localStorage.getItem(STORAGE_MARCAS);

      if (!seeded) {
        // First load: seed with Sallve example
        localStorage.setItem(STORAGE_MARCAS, JSON.stringify(SEED_MARCAS));
        localStorage.setItem(STORAGE_SEEDED, "1");
        setMarcas(SEED_MARCAS);
      } else if (savedMarcas) {
        setMarcas(JSON.parse(savedMarcas));
      }
    } catch {
      // ignore
    }

    try {
      const savedCases = localStorage.getItem(STORAGE_CASES);
      if (savedCases) setCases(JSON.parse(savedCases));
    } catch {
      // ignore
    }
  }, []);

  const saveMarcas = (updated: MarcaRef[]) => {
    setMarcas(updated);
    localStorage.setItem(STORAGE_MARCAS, JSON.stringify(updated));
  };

  const addMarca = useCallback((marca: MarcaRef) => {
    setMarcas((prev) => {
      const updated = [...prev, marca];
      localStorage.setItem(STORAGE_MARCAS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeMarca = useCallback((id: string) => {
    setMarcas((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      localStorage.setItem(STORAGE_MARCAS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addCase = useCallback((c: CaseTurbo) => {
    setCases((prev) => {
      const updated = [...prev, c];
      localStorage.setItem(STORAGE_CASES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateCase = useCallback((c: CaseTurbo) => {
    setCases((prev) => {
      const updated = prev.map((x) => (x.id === c.id ? c : x));
      localStorage.setItem(STORAGE_CASES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeCase = useCallback((id: string) => {
    setCases((prev) => {
      const updated = prev.filter((x) => x.id !== id);
      localStorage.setItem(STORAGE_CASES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ── Drawer handlers ────────────────────────────────────────────────────────

  const openDrawer = useCallback((nicho: Nicho) => {
    setActiveNicho(nicho);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setActiveNicho(null), 300);
  }, []);

  // Marcas count per nicho for cards
  const marcasCountByNicho = useMemo(() => {
    const counts: Record<string, number> = {};
    marcas.forEach((m) => {
      counts[m.nichoId] = (counts[m.nichoId] || 0) + 1;
    });
    return counts;
  }, [marcas]);

  // Subnichos que possuem pelo menos 1 case, agrupados por nichoId
  const caseSubnichosByNicho = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    cases.forEach((c) => {
      if (!map[c.nichoId]) map[c.nichoId] = new Set();
      map[c.nichoId].add(c.subnicho);
    });
    return map;
  }, [cases]);

  // Nomes dos clientes (cases) por nichoId → subnicho
  const caseNamesByNichoAndSub = useMemo(() => {
    const map: Record<string, Record<string, string[]>> = {};
    cases.forEach((c) => {
      if (!map[c.nichoId]) map[c.nichoId] = {};
      if (!map[c.nichoId][c.subnicho]) map[c.nichoId][c.subnicho] = [];
      map[c.nichoId][c.subnicho].push(c.nome);
    });
    return map;
  }, [cases]);

  // ── Filter logic ───────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return NICHOS_DATA.filter((nicho) => {
      // Filtro por cases: só mostra nichos que têm pelo menos 1 subnicho com case
      if (filterByCases) {
        const subSet = caseSubnichosByNicho[nicho.id];
        if (!subSet || subSet.size === 0) return false;
      }
      // Filtro por busca textual
      if (!q) return true;
      const matchMacro = nicho.nome.toLowerCase().includes(q);
      const matchSub = nicho.subnichos.some((s) => s.toLowerCase().includes(q));
      return matchMacro || matchSub;
    });
  }, [search, filterByCases, caseSubnichosByNicho]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen">

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1.5">
          Central de Referências
        </h1>
        <p className="text-sm text-gray-400 max-w-lg">
          Nichos de mercado, estruturas de hooks vencedores e referências para seus vídeos UGC.
        </p>
      </div>

      {/* ── Filtrar por cases ─────────────────────────────────────────────── */}
      <div className="mb-5">
        <button
          onClick={() => setFilterByCases((v) => !v)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ring-1",
            filterByCases
              ? "bg-amber-500 text-white ring-amber-500 shadow-sm shadow-amber-200"
              : "bg-white text-gray-500 ring-gray-200 hover:ring-amber-300 hover:text-amber-600"
          )}
        >
          <Trophy size={14} className={filterByCases ? "text-amber-200" : "text-amber-400"} />
          Filtrar por Cases Turbo
          <span className={cn(
            "ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-colors",
            filterByCases ? "bg-amber-400 text-white" : "bg-gray-100 text-gray-400"
          )}>
            {filterByCases ? "ON" : "OFF"}
          </span>
        </button>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-7 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("nichos")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
            activeTab === "nichos"
              ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Compass size={14} />
          Nichos
        </button>
        <button
          onClick={() => setActiveTab("hooks")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
            activeTab === "hooks"
              ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <FishingHook size={14} />
          Banco de Hooks
        </button>
        <button
          onClick={() => setActiveTab("ctas")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
            activeTab === "ctas"
              ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <MessageSquare size={14} />
          Banco de CTAs
        </button>
        <button
          onClick={() => setActiveTab("turbo")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
            activeTab === "turbo"
              ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Trophy size={14} className="text-amber-500" />
          Roteiros Turbo
          {cases.length > 0 && (
            <span className="ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-600">
              {cases.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "hooks" && <BancoDeHooks />}
      {activeTab === "ctas" && <BancoDeCTAs />}
      {activeTab === "turbo" && (
        <RoteirosturboTab
          cases={cases}
          onAddCase={addCase}
          onUpdateCase={updateCase}
          onRemoveCase={removeCase}
        />
      )}

      {activeTab === "nichos" && (
      <div>

      {/* ── Search Bar ────────────────────────────────────────────────────── */}
      <div className="mb-5">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nicho ou subnicho..."
            className={cn(
              "w-full h-10 pl-10 pr-9 rounded-xl text-sm bg-white",
              "ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none",
              "placeholder:text-gray-400 text-gray-900 transition-shadow"
            )}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Grid ──────────────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((nicho) => (
            <NichoCard
              key={nicho.id}
              nicho={nicho}
              onOpen={openDrawer}
              searchTerm={search}
              marcasCount={marcasCountByNicho[nicho.id] || 0}
              caseSubnichos={caseSubnichosByNicho[nicho.id] ?? new Set()}
              caseNamesBySub={caseNamesByNichoAndSub[nicho.id] ?? {}}
              filterByCases={filterByCases}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5 text-3xl select-none">
            👀
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1.5">Nenhum nicho encontrado…</h3>
          <p className="text-sm text-gray-400 max-w-xs mb-5">
            Tente ajustar sua busca ou remover alguns filtros para ver mais resultados.
          </p>
          <button
            onClick={() => setSearch("")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white ring-1 ring-gray-200 text-sm font-medium text-gray-600 hover:ring-gray-300 hover:text-gray-800 transition-all"
          >
            <X size={14} />
            Limpar busca
          </button>
        </div>
      )}

      {/* ── Drawer ────────────────────────────────────────────────────────── */}
      <NichoDrawer
        nicho={activeNicho}
        isOpen={drawerOpen}
        onClose={closeDrawer}
        marcas={marcas}
        onAddMarca={addMarca}
        onRemoveMarca={removeMarca}
        cases={cases}
        onAddCase={addCase}
        onUpdateCase={updateCase}
        onRemoveCase={removeCase}
      />
      </div>
      )}
    </div>
  );
}

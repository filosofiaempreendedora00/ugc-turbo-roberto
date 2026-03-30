"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  Search, Star, X, Compass, ChevronRight, SlidersHorizontal,
  Construction, ExternalLink, Plus, Link2, Trash2,
  FishingHook, Tag, Globe, FileText, Pencil, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SEED_HOOKS, STORAGE_HOOKS, STORAGE_HOOKS_SEEDED } from "@/lib/hooks-seed";
import type { HookEstrutura } from "@/lib/hooks-seed";

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

// ─── Sub-components ────────────────────────────────────────────────────────────

const VISIBLE_TAGS = 4;

function NichoCard({
  nicho,
  isFavorite,
  onToggleFavorite,
  onOpen,
  searchTerm,
  marcasCount,
}: {
  nicho: Nicho;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (nicho: Nicho) => void;
  searchTerm: string;
  marcasCount: number;
}) {
  const visibleSubs = nicho.subnichos.slice(0, VISIBLE_TAGS);
  const hiddenCount = nicho.subnichos.length - VISIBLE_TAGS;

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
      {/* Favorite button */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(nicho.id); }}
        className={cn(
          "absolute top-4 right-4 p-1.5 rounded-lg transition-all duration-150 z-10",
          isFavorite
            ? "text-amber-400 hover:text-amber-500 bg-amber-50"
            : "text-gray-300 hover:text-amber-400 hover:bg-amber-50 opacity-0 group-hover:opacity-100"
        )}
        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        <Star size={15} className={cn("transition-all", isFavorite && "fill-amber-400")} />
      </button>

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
        {visibleSubs.map((sub) => (
          <span
            key={sub}
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ring-1",
              nicho.tagBg, nicho.tagText, nicho.tagRing
            )}
          >
            {highlight(sub)}
          </span>
        ))}
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

// ─── Drawer ────────────────────────────────────────────────────────────────────

function NichoDrawer({
  nicho,
  isOpen,
  isFavorite,
  onToggleFavorite,
  onClose,
  marcas,
  onAddMarca,
  onRemoveMarca,
}: {
  nicho: Nicho | null;
  isOpen: boolean;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  marcas: MarcaRef[];
  onAddMarca: (marca: MarcaRef) => void;
  onRemoveMarca: (id: string) => void;
}) {
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [formNome, setFormNome] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formError, setFormError] = useState("");
  const nomeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (addingTo) { cancelForm(); }
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
  }, [isOpen, onClose, addingTo]);

  // Focus first input when form opens
  useEffect(() => {
    if (addingTo) setTimeout(() => nomeRef.current?.focus(), 50);
  }, [addingTo]);

  // Reset form when drawer closes
  useEffect(() => {
    if (!isOpen) cancelForm();
  }, [isOpen]);

  const cancelForm = () => {
    setAddingTo(null);
    setFormNome("");
    setFormUrl("");
    setFormError("");
  };

  const handleSave = () => {
    if (!formNome.trim()) { setFormError("Informe o nome da marca."); return; }
    if (!formUrl.trim() || !formUrl.startsWith("http")) {
      setFormError("Informe uma URL válida (começa com http).");
      return;
    }
    onAddMarca({
      id: `${nicho!.id}-${Date.now()}`,
      nome: formNome.trim(),
      url: formUrl.trim(),
      nichoId: nicho!.id,
      subnicho: addingTo!,
      addedAt: new Date().toISOString(),
    });
    cancelForm();
  };

  const getMarcasForSub = (sub: string) =>
    marcas.filter((m) => m.nichoId === nicho?.id && m.subnicho === sub);

  const totalMarcas = nicho ? marcas.filter((m) => m.nichoId === nicho.id).length : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 flex flex-col",
          "shadow-2xl shadow-black/10 transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label={nicho?.nome}
      >
        {nicho && (
          <>
            {/* Header */}
            <div className={cn("flex items-start gap-4 p-6 border-b border-gray-100 bg-gradient-to-br to-white", nicho.drawerFrom)}>
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-3xl select-none shrink-0 shadow-sm", nicho.emojiBg)}>
                {nicho.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 text-base leading-snug">{nicho.nome}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">
                    {nicho.subnichos.length} subnicho{nicho.subnichos.length !== 1 ? "s" : ""}
                  </span>
                  {totalMarcas > 0 && (
                    <>
                      <span className="text-gray-200">·</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Link2 size={10} />
                        {totalMarcas} referência{totalMarcas !== 1 ? "s" : ""}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onToggleFavorite(nicho.id)}
                  className={cn("p-2 rounded-xl transition-all", isFavorite ? "text-amber-500 bg-amber-50" : "text-gray-400 hover:text-amber-500 hover:bg-amber-50")}
                  aria-label={isFavorite ? "Remover favorito" : "Favoritar"}
                >
                  <Star size={16} className={cn(isFavorite && "fill-amber-400")} />
                </button>
                <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all" aria-label="Fechar">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                Subnichos &amp; Referências
              </p>

              <ul className="space-y-2">
                {nicho.subnichos.map((sub, i) => {
                  const subMarcas = getMarcasForSub(sub);
                  const isAdding = addingTo === sub;

                  return (
                    <li
                      key={sub}
                      className="rounded-xl ring-1 ring-gray-100 bg-gray-50/50 overflow-hidden transition-all duration-150"
                    >
                      {/* Subnicho row */}
                      <div className="flex items-center gap-3 px-4 py-3">
                        <span className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0", nicho.tagBg, nicho.tagText)}>
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-700 font-medium flex-1">{sub}</span>
                        {!isAdding && (
                          <button
                            onClick={() => { cancelForm(); setAddingTo(sub); }}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                            title="Adicionar marca de referência"
                          >
                            <Plus size={12} />
                            <span className="hidden sm:inline">Marca</span>
                          </button>
                        )}
                      </div>

                      {/* Brands */}
                      {subMarcas.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
                          {subMarcas.map((m) => (
                            <MarcaChip key={m.id} marca={m} onRemove={onRemoveMarca} />
                          ))}
                        </div>
                      )}

                      {/* Add form */}
                      {isAdding && (
                        <div className="px-4 pb-4 pt-1 border-t border-gray-100 bg-white">
                          <p className="text-xs text-gray-500 mb-2.5 font-medium">Nova referência em <span className="text-gray-700">{sub}</span></p>
                          <div className="space-y-2">
                            <input
                              ref={nomeRef}
                              type="text"
                              placeholder="Nome da marca (ex: Sallve)"
                              value={formNome}
                              onChange={(e) => { setFormNome(e.target.value); setFormError(""); }}
                              onKeyDown={(e) => e.key === "Enter" && handleSave()}
                              className="w-full h-9 px-3 rounded-lg text-xs bg-gray-50 ring-1 ring-gray-200 focus:ring-violet-400 focus:outline-none placeholder:text-gray-400 text-gray-800 transition-shadow"
                            />
                            <input
                              type="url"
                              placeholder="URL da Biblioteca de Anúncios"
                              value={formUrl}
                              onChange={(e) => { setFormUrl(e.target.value); setFormError(""); }}
                              onKeyDown={(e) => e.key === "Enter" && handleSave()}
                              className="w-full h-9 px-3 rounded-lg text-xs bg-gray-50 ring-1 ring-gray-200 focus:ring-violet-400 focus:outline-none placeholder:text-gray-400 text-gray-800 transition-shadow"
                            />
                            {formError && (
                              <p className="text-xs text-red-500">{formError}</p>
                            )}
                            <div className="flex gap-2 pt-0.5">
                              <button
                                onClick={handleSave}
                                className="flex-1 h-8 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors"
                              >
                                Salvar
                              </button>
                              <button
                                onClick={cancelForm}
                                className="flex-1 h-8 rounded-lg ring-1 ring-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
              <p className="text-center text-xs text-gray-400">
                Use esses subnichos para direcionar seus roteiros UGC ✨
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── Banco de Hooks ────────────────────────────────────────────────────────────

const CATEGORIAS_HOOK = [
  "Benefício", "Curiosidade", "Dor", "Identificação", "Informação",
  "Objeção", "Oferta", "Pergunta", "Persuasão", "Prova social",
  "Transformação", "Urgência",
];

function BancoDeHooks() {
  const [hooks, setHooks] = useState<HookEstrutura[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchHook, setSearchHook] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
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
        setHooks(JSON.parse(saved));
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
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    saveHooks(hooks.filter((h) => h.id !== id));
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const filtered = hooks.filter((h) => {
    const q = searchHook.toLowerCase();
    const matchQ = !q || h.estrutura.toLowerCase().includes(q) || h.exemplo.toLowerCase().includes(q) || h.nicho.toLowerCase().includes(q);
    const matchCat = !filterCategoria || h.categoria === filterCategoria;
    return matchQ && matchCat;
  });

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchHook}
            onChange={(e) => setSearchHook(e.target.value)}
            placeholder="Buscar estrutura, exemplo, nicho…"
            className="w-full h-10 pl-10 pr-9 rounded-xl text-sm bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none placeholder:text-gray-400 text-gray-900 transition-shadow"
          />
          {searchHook && (
            <button onClick={() => setSearchHook("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-gray-400 hover:text-gray-600 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
        <select
          value={filterCategoria}
          onChange={(e) => setFilterCategoria(e.target.value)}
          className="h-10 px-3 rounded-xl text-sm bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none text-gray-700 transition-shadow"
        >
          <option value="">Todas as categorias</option>
          {CATEGORIAS_HOOK.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          className="h-10 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium flex items-center gap-2 shrink-0 transition-colors shadow-sm"
        >
          <Plus size={15} />
          Adicionar hook
        </button>
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
          <button onClick={() => { setSearchHook(""); setFilterCategoria(""); }} className="mt-3 text-xs text-violet-600 hover:underline font-medium">
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
            ))}
          </div>
          {/* Footer count */}
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400">
              {filtered.length} estrutura{filtered.length !== 1 ? "s" : ""}
              {(searchHook || filterCategoria) ? ` (filtrado de ${hooks.length})` : " no banco"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ReferenciasPage() {
  const [activeTab, setActiveTab] = useState<"nichos" | "hooks">("nichos");
  const [search, setSearch] = useState("");
  const [selectedMacros, setSelectedMacros] = useState<string[]>([]);
  const [selectedSubnichos, setSelectedSubnichos] = useState<string[]>([]);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [marcas, setMarcas] = useState<MarcaRef[]>([]);
  const [activeNicho, setActiveNicho] = useState<Nicho | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSubFilter, setShowSubFilter] = useState(false);

  // ── Persistence ────────────────────────────────────────────────────────────

  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem(STORAGE_FAVORITES);
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

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

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ── Filter logic ───────────────────────────────────────────────────────────

  const toggleMacro = (id: string) => {
    setSelectedMacros((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
    setSelectedSubnichos([]);
  };

  const toggleSubnicho = (sub: string) => {
    setSelectedSubnichos((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const clearAll = () => {
    setSearch("");
    setSelectedMacros([]);
    setSelectedSubnichos([]);
    setOnlyFavorites(false);
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedMacros.length > 0 ||
    selectedSubnichos.length > 0 ||
    onlyFavorites;

  const availableSubnichos = useMemo(() => {
    const base =
      selectedMacros.length > 0
        ? NICHOS_DATA.filter((n) => selectedMacros.includes(n.id))
        : NICHOS_DATA;
    return Array.from(new Set(base.flatMap((n) => n.subnichos)));
  }, [selectedMacros]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return NICHOS_DATA.filter((nicho) => {
      if (onlyFavorites && !favorites.includes(nicho.id)) return false;
      if (selectedMacros.length > 0 && !selectedMacros.includes(nicho.id)) return false;
      if (selectedSubnichos.length > 0) {
        if (!nicho.subnichos.some((s) => selectedSubnichos.includes(s))) return false;
      }
      if (q) {
        const matchMacro = nicho.nome.toLowerCase().includes(q);
        const matchSub = nicho.subnichos.some((s) => s.toLowerCase().includes(q));
        if (!matchMacro && !matchSub) return false;
      }
      return true;
    });
  }, [search, selectedMacros, selectedSubnichos, onlyFavorites, favorites]);

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

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen">
      {/* ── Banner em construção ──────────────────────────────────────────── */}
      <div className="flex items-start gap-3 px-4 py-3 mb-7 rounded-xl bg-amber-50 ring-1 ring-amber-200/70">
        <Construction size={16} className="text-amber-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-800 leading-snug">
            Seção em construção
          </p>
          <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
            Estamos expandindo a Central de Referências. Em breve você poderá salvar referências, acessar exemplos de vídeos por nicho e muito mais.
          </p>
        </div>
      </div>

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
            <Compass size={16} className="text-violet-600" />
          </div>
          <span className="text-xs font-semibold text-violet-500 uppercase tracking-widest">
            Explorar
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1.5">
          Central de Referências
        </h1>
        <p className="text-sm text-gray-400 max-w-lg">
          Nichos de mercado, estruturas de hooks vencedores e referências para seus vídeos UGC.
        </p>
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
      </div>

      {activeTab === "hooks" && <BancoDeHooks />}

      {activeTab === "nichos" && (
      <div>

      {/* ── Search & Filter Bar ────────────────────────────────────────────── */}
      <div className="mb-5 space-y-3">
        {/* Search row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
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

          {/* Favorites toggle */}
          <button
            onClick={() => setOnlyFavorites((v) => !v)}
            className={cn(
              "h-10 px-3.5 rounded-xl text-sm font-medium flex items-center gap-2 shrink-0 ring-1 transition-all duration-150",
              onlyFavorites
                ? "bg-amber-50 text-amber-700 ring-amber-200 hover:bg-amber-100"
                : "bg-white text-gray-500 ring-gray-200 hover:ring-gray-300 hover:text-gray-700"
            )}
          >
            <Star size={14} className={cn(onlyFavorites && "fill-amber-500 text-amber-500")} />
            <span className="hidden sm:inline">Favoritos</span>
            {favorites.length > 0 && (
              <span className={cn("text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center", onlyFavorites ? "bg-amber-200 text-amber-800" : "bg-gray-100 text-gray-500")}>
                {favorites.length}
              </span>
            )}
          </button>

          {/* Sub-filter toggle */}
          <button
            onClick={() => setShowSubFilter((v) => !v)}
            className={cn(
              "h-10 px-3.5 rounded-xl text-sm font-medium flex items-center gap-2 shrink-0 ring-1 transition-all duration-150",
              showSubFilter || selectedSubnichos.length > 0
                ? "bg-violet-50 text-violet-700 ring-violet-200"
                : "bg-white text-gray-500 ring-gray-200 hover:ring-gray-300 hover:text-gray-700"
            )}
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Filtros</span>
            {selectedSubnichos.length > 0 && (
              <span className="text-xs font-bold w-4 h-4 rounded-full bg-violet-200 text-violet-800 flex items-center justify-center">
                {selectedSubnichos.length}
              </span>
            )}
          </button>
        </div>

        {/* Macro filters */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
          <button
            onClick={() => { setSelectedMacros([]); setSelectedSubnichos([]); }}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ring-1 transition-all duration-150",
              selectedMacros.length === 0
                ? "bg-gray-900 text-white ring-gray-900"
                : "bg-white text-gray-500 ring-gray-200 hover:ring-gray-300"
            )}
          >
            Todos
            <span className="opacity-60 text-[10px] font-bold">{NICHOS_DATA.length}</span>
          </button>
          {NICHOS_DATA.map((nicho) => (
            <button
              key={nicho.id}
              onClick={() => toggleMacro(nicho.id)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ring-1 transition-all duration-150",
                selectedMacros.includes(nicho.id)
                  ? "bg-violet-600 text-white ring-violet-600 shadow-sm"
                  : "bg-white text-gray-600 ring-gray-200 hover:ring-gray-300"
              )}
            >
              <span className="text-sm leading-none">{nicho.emoji}</span>
              {nicho.nome}
            </button>
          ))}
        </div>

        {/* Subnicho filters */}
        {showSubFilter && (
          <div className="bg-gray-50/80 rounded-xl p-3 ring-1 ring-gray-100">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 px-1">
              Filtrar por subnicho
              {selectedMacros.length > 0 && (
                <span className="ml-1.5 normal-case text-gray-300">
                  — {selectedMacros.length === 1 ? "1 nicho selecionado" : `${selectedMacros.length} nichos`}
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {availableSubnichos.map((sub) => (
                <button
                  key={sub}
                  onClick={() => toggleSubnicho(sub)}
                  className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ring-1 transition-all duration-150",
                    selectedSubnichos.includes(sub)
                      ? "bg-violet-600 text-white ring-violet-600"
                      : "bg-white text-gray-600 ring-gray-200 hover:ring-gray-300"
                  )}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active filters summary */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between py-1">
            <p className="text-xs text-gray-400">
              {filtered.length === 0
                ? "Nenhum resultado"
                : `${filtered.length} nicho${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`}
            </p>
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-violet-600 transition-colors font-medium"
            >
              <X size={12} />
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* ── Grid ──────────────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((nicho) => (
            <NichoCard
              key={nicho.id}
              nicho={nicho}
              isFavorite={favorites.includes(nicho.id)}
              onToggleFavorite={toggleFavorite}
              onOpen={openDrawer}
              searchTerm={search}
              marcasCount={marcasCountByNicho[nicho.id] || 0}
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
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white ring-1 ring-gray-200 text-sm font-medium text-gray-600 hover:ring-gray-300 hover:text-gray-800 transition-all"
          >
            <X size={14} />
            Limpar filtros
          </button>
        </div>
      )}

      {/* ── Drawer ────────────────────────────────────────────────────────── */}
      <NichoDrawer
        nicho={activeNicho}
        isOpen={drawerOpen}
        isFavorite={activeNicho ? favorites.includes(activeNicho.id) : false}
        onToggleFavorite={toggleFavorite}
        onClose={closeDrawer}
        marcas={marcas}
        onAddMarca={addMarca}
        onRemoveMarca={removeMarca}
      />
      </div>
      )}
    </div>
  );
}

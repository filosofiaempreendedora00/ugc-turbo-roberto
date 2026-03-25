"use client";

import { useState, useEffect, useRef } from "react";
import { updateGuiaMarca } from "@/lib/storage";
import { Cliente, GuiaMarca } from "@/types";
import { Check, Loader2, Save, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Options ──────────────────────────────────────────────────────────────────

const PERCEPCAO_OPTIONS = [
  "Acessível", "Científica", "Divertida", "Inovadora",
  "Jovem", "Minimalista", "Moderna", "Premium", "Sofisticada",
];

const TOM_OPTIONS = [
  "Direta", "Amigável", "Autoridade", "Inspiradora", "Engraçada", "Educativa",
];

const MAX_TOM = 3;
const MAX_ESSENCIA = 120;

// ─── Block Header ──────────────────────────────────────────────────────────────

function BlockHeader({ number, label, done }: { number: string; label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className={cn(
        "w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-200",
        done
          ? "bg-violet-600 text-white shadow-sm shadow-violet-300/60"
          : "bg-gray-100 text-gray-400"
      )}>
        {number}
      </div>
      <p className={cn(
        "text-xs font-semibold uppercase tracking-widest transition-colors duration-200",
        done ? "text-gray-600" : "text-gray-400"
      )}>{label}</p>
    </div>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

function Chip({ label, selected, disabled, onClick }: {
  label: string; selected: boolean; disabled?: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
        selected
          ? "bg-violet-600 text-white shadow-sm shadow-violet-200/60"
          : disabled
            ? "bg-gray-50 text-gray-300 ring-1 ring-gray-100 cursor-not-allowed"
            : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-violet-300 hover:text-violet-700"
      )}
    >
      {selected && <Check size={11} strokeWidth={2.5} className="shrink-0" />}
      {label}
    </button>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface GuiaMarcaFormProps {
  cliente: Cliente;
  onSuccess: (cliente: Cliente) => void;
  onNext?: () => void;
  nextLabel?: string;
  onBack?: () => void;
}

// ─── Main component ────────────────────────────────────────────────────────────

export function GuiaMarcaForm({
  cliente,
  onSuccess,
  onNext,
  nextLabel = "Ir para Produtos",
  onBack,
}: GuiaMarcaFormProps) {
  const [nome, setNome] = useState(cliente.guiaMarca.nome);
  const [percepcoes, setPercepcoes] = useState<string[]>([]);
  const [customPercepcoes, setCustomPercepcoes] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [tons, setTons] = useState<string[]>([]);
  const [customTons, setCustomTons] = useState<string[]>([]);
  const [customTomInput, setCustomTomInput] = useState("");
  const customInputRef = useRef<HTMLInputElement>(null);
  const customTomRef = useRef<HTMLInputElement>(null);
  const [essencia, setEssencia] = useState(cliente.guiaMarca.diferenciais ?? "");
  const [restricoes, setRestricoes] = useState(cliente.guiaMarca.observacoes ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── Parse existing data ───────────────────────────────────────────────────────
  useEffect(() => {
    const storedPerc = cliente.guiaMarca.posicionamento ?? "";
    if (storedPerc) {
      const parts = storedPerc.split(",").map((s) => s.trim()).filter(Boolean);
      setPercepcoes(parts.filter((p) => PERCEPCAO_OPTIONS.includes(p)));
      setCustomPercepcoes(parts.filter((p) => !PERCEPCAO_OPTIONS.includes(p)));
    }
    const storedTom = cliente.guiaMarca.tomDeVoz ?? "";
    if (storedTom) {
      const parts = storedTom.split(",").map((s) => s.trim()).filter(Boolean);
      setTons(parts.filter((t) => TOM_OPTIONS.includes(t)));
      setCustomTons(parts.filter((t) => !TOM_OPTIONS.includes(t)));
    }
  }, []);

  // ── Completion ───────────────────────────────────────────────────────────────
  const block1Done = nome.trim().length > 0 && (percepcoes.length > 0 || customPercepcoes.length > 0);
  const block2Done = tons.length > 0 || customTons.length > 0;
  const block3Done = essencia.trim().length > 0;
  const block4Done = restricoes.trim().length > 0;
  const blocksComplete = [block1Done, block2Done, block3Done, block4Done].filter(Boolean).length;

  // ── Build guia object ────────────────────────────────────────────────────────
  function buildGuia(): GuiaMarca {
    return {
      nome: nome.trim(),
      tomDeVoz: [...tons, ...customTons].join(", "),
      publicoAlvo: cliente.guiaMarca.publicoAlvo ?? "",
      diferenciais: essencia.trim(),
      posicionamento: [...percepcoes, ...customPercepcoes].join(", "),
      observacoes: restricoes.trim(),
    };
  }

  function addCustomTon() {
    const t = customTomInput.trim();
    if (t && !customTons.includes(t)) {
      setCustomTons(p => [...p, t]);
      setCustomTomInput("");
      setSaved(false);
      customTomRef.current?.focus();
    }
  }

  function handleCustomTomKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      addCustomTon();
    }
  }

  function addCustomTag() {
    const t = customInput.trim();
    if (t && !customPercepcoes.includes(t)) {
      setCustomPercepcoes(p => [...p, t]);
      setCustomInput("");
      setSaved(false);
      customInputRef.current?.focus();
    }
  }

  function handleCustomKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      addCustomTag();
    }
  }

  // ── Save ─────────────────────────────────────────────────────────────────────
  async function handleSave(mode: "stay" | "next" | "back" = "stay") {
    if (!nome.trim()) return;
    setLoading(true);
    try {
      const updated = updateGuiaMarca(cliente.id, buildGuia());
      setSaved(true);
      onSuccess(updated);
      if (mode === "next" && onNext) {
        setTimeout(() => onNext(), 300);
      } else if (mode === "back" && onBack) {
        setTimeout(() => onBack(), 300);
      } else {
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSave("stay");
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit}>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-7 pb-6 border-b border-gray-100">
        <div className="flex gap-1.5">
          {[block1Done, block2Done, block3Done, block4Done].map((done, i) => (
            <div key={i} className={cn("h-1.5 w-7 rounded-full transition-all duration-300", done ? "bg-violet-500" : "bg-gray-200")} />
          ))}
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {blocksComplete === 4 ? "Guia completo ✓" : `${blocksComplete} de 4 blocos preenchidos`}
        </span>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

        {/* ── LEFT COLUMN — 01, 02 ─────────────────────────────────────────── */}
        <div className="lg:pr-8 lg:border-r border-gray-100 space-y-0">

          {/* Block 01 — Identidade */}
          <div className="pb-7">
            <BlockHeader number="01" label="Identidade" done={block1Done} />

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Nome da marca</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => { setNome(e.target.value); setSaved(false); }}
                placeholder="Ex: Sallve, Nubank, Leroy Merlin..."
                className={cn(
                  "w-full h-10 px-3.5 rounded-xl text-sm bg-white",
                  "ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none",
                  "placeholder:text-gray-300 text-gray-900 transition-shadow"
                )}
              />
            </div>

            <div>
              <div className="mb-2">
                <label className="text-xs font-medium text-gray-500">Como quer ser percebida?</label>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PERCEPCAO_OPTIONS.map((opt) => (
                  <Chip key={opt} label={opt} selected={percepcoes.includes(opt)}
                    onClick={() => { setPercepcoes(p => p.includes(opt) ? p.filter(x => x !== opt) : [...p, opt]); setSaved(false); }} />
                ))}

                {customPercepcoes.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-50 text-violet-600 border border-dashed border-violet-300 transition-all"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => { setCustomPercepcoes(p => p.filter(x => x !== tag)); setSaved(false); }}
                      className="rounded p-0.5 hover:bg-violet-100 transition-colors"
                    >
                      <X size={10} strokeWidth={2.5} />
                    </button>
                  </span>
                ))}

                <div className="inline-flex items-center rounded-lg border border-dashed border-gray-300 hover:border-violet-400 bg-white transition-colors overflow-hidden">
                  <input
                    ref={customInputRef}
                    type="text"
                    value={customInput}
                    onChange={e => setCustomInput(e.target.value)}
                    onKeyDown={handleCustomKeyDown}
                    placeholder="+ Personalizada..."
                    className="bg-transparent outline-none text-xs text-gray-500 placeholder:text-gray-300 px-2.5 py-1.5 w-32"
                  />
                  {customInput.trim() && (
                    <button
                      type="button"
                      onClick={addCustomTag}
                      className="px-2 py-1.5 text-violet-600 hover:bg-violet-50 transition-colors shrink-0"
                    >
                      <Plus size={12} strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              </div>
              {customPercepcoes.length > 0 && (
                <p className="text-[11px] text-gray-300 mt-1.5">Tags com borda tracejada são personalizadas.</p>
              )}
            </div>
          </div>

          {/* Block 02 — Tom de Voz */}
          <div className="pt-7 border-t border-gray-100">
            <BlockHeader number="02" label="Tom de Voz" done={block2Done} />
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-500">Como a marca se comunica?</label>
                <span className={cn("text-[11px] font-medium transition-colors", tons.length >= MAX_TOM ? "text-violet-500" : "text-gray-300")}>
                  {tons.length}/{MAX_TOM} padrão
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TOM_OPTIONS.map((opt) => (
                  <Chip key={opt} label={opt} selected={tons.includes(opt)}
                    disabled={!tons.includes(opt) && tons.length >= MAX_TOM}
                    onClick={() => {
                      setTons(p => p.includes(opt) ? p.filter(x => x !== opt) : p.length < MAX_TOM ? [...p, opt] : p);
                      setSaved(false);
                    }} />
                ))}

                {customTons.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-50 text-violet-600 border border-dashed border-violet-300 transition-all"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => { setCustomTons(p => p.filter(x => x !== tag)); setSaved(false); }}
                      className="rounded p-0.5 hover:bg-violet-100 transition-colors"
                    >
                      <X size={10} strokeWidth={2.5} />
                    </button>
                  </span>
                ))}

                <div className="inline-flex items-center rounded-lg border border-dashed border-gray-300 hover:border-violet-400 bg-white transition-colors overflow-hidden">
                  <input
                    ref={customTomRef}
                    type="text"
                    value={customTomInput}
                    onChange={e => setCustomTomInput(e.target.value)}
                    onKeyDown={handleCustomTomKeyDown}
                    placeholder="+ Personalizado..."
                    className="bg-transparent outline-none text-xs text-gray-500 placeholder:text-gray-300 px-2.5 py-1.5 w-32"
                  />
                  {customTomInput.trim() && (
                    <button
                      type="button"
                      onClick={addCustomTon}
                      className="px-2 py-1.5 text-violet-600 hover:bg-violet-50 transition-colors shrink-0"
                    >
                      <Plus size={12} strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              </div>
              {tons.length >= MAX_TOM && (
                <p className="text-[11px] text-violet-500 mt-2 font-medium">Máximo de opções padrão atingido — adicione personalizadas ou remova uma.</p>
              )}
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN — 03, 04 ────────────────────────────────────────── */}
        <div className="lg:pl-8 space-y-0 mt-7 lg:mt-0">

          {/* Block 03 — Personalidade */}
          <div className="pb-7">
            <BlockHeader number="03" label="Personalidade" done={block3Done} />
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-500">Essência da marca em 1 frase</label>
                <span className={cn("text-[11px] font-medium tabular-nums", essencia.length > MAX_ESSENCIA ? "text-red-500" : "text-gray-300")}>
                  {essencia.length}/{MAX_ESSENCIA}
                </span>
              </div>
              <textarea value={essencia}
                onChange={(e) => { if (e.target.value.length <= MAX_ESSENCIA) { setEssencia(e.target.value); setSaved(false); } }}
                placeholder="Ex: Marca que simplifica o skincare, focando só no que realmente funciona"
                rows={2}
                className={cn(
                  "w-full px-3.5 py-2.5 rounded-xl text-sm bg-white resize-none",
                  "ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none",
                  "placeholder:text-gray-300 text-gray-900 transition-shadow leading-relaxed"
                )}
              />
              <p className="text-[11px] text-gray-300 mt-1.5">Como a marca se apresentaria em 5 segundos.</p>
            </div>
          </div>

          {/* Block 04 — Regras */}
          <div className="pt-7 border-t border-gray-100">
            <BlockHeader number="04" label="Regras" done={block4Done} />
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                O que <span className="text-red-400">NÃO</span> combina com a marca?
              </label>
              <textarea value={restricoes}
                onChange={(e) => { setRestricoes(e.target.value); setSaved(false); }}
                placeholder="Ex: Não usar humor, evitar promessas milagrosas, sem gírias..."
                rows={4}
                className={cn(
                  "w-full px-3.5 py-3 rounded-xl text-sm bg-white resize-none",
                  "ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none",
                  "placeholder:text-gray-300 text-gray-900 transition-shadow leading-relaxed"
                )}
              />
              <p className="text-[11px] text-gray-300 mt-1.5">Aplicado em todos os roteiros desse cliente.</p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Action buttons ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-6 mt-7 border-t border-gray-100">
        <p className="text-xs text-gray-400 hidden sm:block">
          {blocksComplete === 4
            ? ""
            : `Preencha os ${4 - blocksComplete} blocos restantes para melhores roteiros`}
        </p>

        <div className="flex items-center gap-2 ml-auto">
          {/* Botão secundário: voltar aos clientes (salva antes) OU salvar simples */}
          {onBack ? (
            <button
              type="button"
              disabled={loading || !nome.trim()}
              onClick={() => handleSave("back")}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 h-9 rounded-xl text-sm font-medium transition-all",
                "ring-1 ring-gray-200 bg-white text-gray-600 hover:ring-gray-300 hover:text-gray-800",
                (loading || !nome.trim()) && "opacity-40 cursor-not-allowed"
              )}
            >
              {saved && !loading
                ? <Check size={13} strokeWidth={2.5} className="text-emerald-500" />
                : <ChevronLeft size={13} />}
              {saved && !loading ? "Salvo!" : "Salvar e sair"}
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading || !nome.trim()}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 h-9 rounded-xl text-sm font-medium transition-all",
                "ring-1 ring-gray-200 bg-white text-gray-600 hover:ring-gray-300 hover:text-gray-800",
                (loading || !nome.trim()) && "opacity-40 cursor-not-allowed"
              )}
            >
              {saved && !loading ? <Check size={13} strokeWidth={2.5} className="text-emerald-500" /> : <Save size={13} />}
              {saved && !loading ? "Salvo" : "Salvar"}
            </button>
          )}

          {/* Botão primário: salva e avança para próxima etapa */}
          {onNext && (
            <button
              type="button"
              disabled={loading || !nome.trim()}
              onClick={() => handleSave("next")}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 h-9 rounded-xl text-sm font-semibold transition-all",
                "bg-violet-600 hover:bg-violet-500 text-white shadow-sm shadow-violet-200",
                (loading || !nome.trim()) && "opacity-40 cursor-not-allowed"
              )}
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : null}
              Salvar e ir para {nextLabel}
              <ChevronRight size={13} />
            </button>
          )}
        </div>
      </div>

    </form>
  );
}

"use client";

import { useState, useRef } from "react";
import { updateGuiaProduto } from "@/lib/storage";
import { Produto } from "@/types";
import { Check, ChevronLeft, Loader2, Plus, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_BENEFICIOS = 7;

const SUGESTOES = [
  "ganho de massa",
  "mais energia",
  "saciedade prolongada",
  "praticidade no dia a dia",
  "melhora na aparência",
  "melhora no sono",
  "redução de medidas",
  "pele mais firme",
  "hidratação profunda",
  "foco e concentração",
];

// ─── Block Header ─────────────────────────────────────────────────────────────

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

// ─── Input ────────────────────────────────────────────────────────────────────

function FieldInput({
  label, value, onChange, placeholder, hint,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className={cn(
          "w-full px-3.5 py-2.5 rounded-xl text-sm bg-white resize-none",
          "ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none",
          "placeholder:text-gray-300 text-gray-900 transition-shadow leading-relaxed"
        )}
      />
      {hint && <p className="text-[11px] text-gray-300 mt-1.5">{hint}</p>}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface GuiaProdutoFormProps {
  produto: Produto;
  onSuccess: (produto: Produto) => void;
  onBack?: () => void;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function GuiaProdutoForm({ produto, onSuccess, onBack }: GuiaProdutoFormProps) {

  function parseBeneficios(raw: string): string[] {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch { /* fallthrough */ }
    return raw.split(",").map(s => s.trim()).filter(Boolean);
  }

  const [problema, setProblema]     = useState(produto.guia.doresQueResolve ?? "");
  const [beneficios, setBeneficios] = useState<string[]>(() => parseBeneficios(produto.guia.beneficios));
  const [benefInput, setBenefInput] = useState("");
  const [diferencial, setDiferencial] = useState(produto.guia.diferenciais ?? "");
  const [prova, setProva]           = useState(produto.guia.oferta ?? "");
  const [uso, setUso]               = useState(produto.guia.descricao ?? "");
  const [loading, setLoading]       = useState(false);
  const [saved, setSaved]           = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Completion ───────────────────────────────────────────────────────────────
  const b1Done = problema.trim().length > 0;
  const b2Done = beneficios.length > 0;
  const b3Done = diferencial.trim().length > 0;
  const b4Done = prova.trim().length > 0;
  const b5Done = uso.trim().length > 0;
  const blocksComplete = [b1Done, b2Done, b3Done, b4Done, b5Done].filter(Boolean).length;

  // ── Benefícios handlers ───────────────────────────────────────────────────────
  function addBeneficio(text: string) {
    const t = text.trim();
    if (!t || beneficios.includes(t) || beneficios.length >= MAX_BENEFICIOS) return;
    setBeneficios(prev => [...prev, t]);
    setBenefInput("");
    setSaved(false);
  }

  function removeBeneficio(item: string) {
    setBeneficios(prev => prev.filter(b => b !== item));
    setSaved(false);
  }

  function handleBenefKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      addBeneficio(benefInput);
    } else if (e.key === "Backspace" && benefInput === "" && beneficios.length > 0) {
      removeBeneficio(beneficios[beneficios.length - 1]);
    }
  }

  // ── Save ──────────────────────────────────────────────────────────────────────
  async function handleSave(mode: "stay" | "back" = "stay") {
    setLoading(true);
    try {
      const updated = updateGuiaProduto(produto.id, {
        doresQueResolve: problema.trim(),
        beneficios: JSON.stringify(beneficios),
        diferenciais: diferencial.trim(),
        oferta: prova.trim(),
        descricao: uso.trim(),
        observacoes: produto.guia.observacoes ?? "",
      });
      setSaved(true);
      onSuccess(updated);
      if (mode === "back" && onBack) {
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


  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit}>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-7 pb-6 border-b border-gray-100">
        <div className="flex gap-1.5">
          {[b1Done, b2Done, b3Done, b4Done, b5Done].map((done, i) => (
            <div
              key={i}
              className={cn("h-1.5 w-7 rounded-full transition-all duration-300", done ? "bg-violet-500" : "bg-gray-200")}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {blocksComplete === 5 ? "Guia completo ✓" : `${blocksComplete} de 5 blocos preenchidos`}
        </span>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

        {/* ── LEFT — 01, 02, 03 ─────────────────────────────────────────────── */}
        <div className="lg:pr-8 lg:border-r border-gray-100">

          {/* Block 01 — Problema */}
          <div className="pb-6">
            <BlockHeader number="01" label="Problema" done={b1Done} />
            <FieldInput
              label="Qual problema esse produto resolve?"
              value={problema}
              onChange={v => { setProblema(v); setSaved(false); }}
              placeholder="Ex: Falta de energia no dia a dia e cansaço constante"
            />
          </div>

          {/* Block 02 — Benefícios */}
          <div className="py-6 border-t border-gray-100">
            <BlockHeader number="02" label="Benefícios" done={b2Done} />

          <label className="block text-xs font-medium text-gray-500 mb-2">
            Quais são os principais benefícios?
          </label>

          {/* Tag input box */}
          <div
            className={cn(
              "w-full rounded-xl bg-white ring-1 p-3 cursor-text transition-shadow min-h-[88px]",
              "ring-gray-200 focus-within:ring-2 focus-within:ring-violet-400"
            )}
            onClick={() => inputRef.current?.focus()}
          >
            <div className="flex flex-wrap gap-1.5">
              {beneficios.map(b => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 pl-3 pr-1.5 py-1 rounded-lg text-xs font-medium bg-violet-50 text-violet-700 ring-1 ring-violet-200/80"
                >
                  {b}
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); removeBeneficio(b); }}
                    className="rounded p-0.5 hover:bg-violet-200 transition-colors"
                  >
                    <X size={10} strokeWidth={2.5} />
                  </button>
                </span>
              ))}

              {beneficios.length < MAX_BENEFICIOS && (
                <input
                  ref={inputRef}
                  type="text"
                  value={benefInput}
                  onChange={e => setBenefInput(e.target.value)}
                  onKeyDown={handleBenefKey}
                  placeholder={beneficios.length === 0 ? "Ex: ganho de massa" : "Adicionar..."}
                  className="flex-1 min-w-[140px] text-sm text-gray-900 placeholder:text-gray-300 bg-transparent outline-none py-0.5"
                />
              )}
            </div>
          </div>

          {/* Helper row */}
          <div className="flex items-center justify-between mt-1.5 mb-4">
            <p className="text-[11px] text-gray-300">
              {beneficios.length < MAX_BENEFICIOS
                ? "Enter para adicionar · Backspace para remover"
                : <span className="text-violet-500 font-medium">Máximo atingido — remova um para trocar.</span>
              }
            </p>
            <span className={cn(
              "text-[11px] font-medium tabular-nums",
              beneficios.length >= MAX_BENEFICIOS ? "text-violet-500" : "text-gray-300"
            )}>
              {beneficios.length}/{MAX_BENEFICIOS}
            </span>
          </div>

          {/* Sugestões rápidas */}
          <div>
            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest mb-2">
              Sugestões rápidas
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGESTOES.map(s => {
                const isSelected = beneficios.includes(s);
                const isDisabled = isSelected || beneficios.length >= MAX_BENEFICIOS;
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => !isSelected && addBeneficio(s)}
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all duration-150",
                      isSelected
                        ? "bg-violet-50 text-violet-300 ring-1 ring-violet-100 cursor-default"
                        : beneficios.length >= MAX_BENEFICIOS
                          ? "bg-gray-50 text-gray-300 ring-1 ring-gray-100 cursor-not-allowed"
                          : "text-gray-500 bg-white ring-1 ring-gray-200 hover:ring-violet-300 hover:text-violet-700 hover:bg-violet-50"
                    )}
                  >
                    {!isSelected && <Plus size={9} strokeWidth={2.5} />}
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
          </div>{/* /Block 02 */}

          {/* Block 03 — Diferencial */}
          <div className="py-6 border-t border-gray-100">
            <BlockHeader number="03" label="Diferencial" done={b3Done} />
            <FieldInput
              label="O que faz esse produto funcionar diferente?"
              value={diferencial}
              onChange={v => { setDiferencial(v); setSaved(false); }}
              placeholder="Ex: Fórmula com ativos que aceleram resultados sem efeitos colaterais"
            />
          </div>

        </div>{/* /LEFT */}

        {/* ── RIGHT — 04, 05 ────────────────────────────────────────────────── */}
        <div className="lg:pl-8 mt-6 lg:mt-0">

          {/* Block 04 — Prova Social */}
          <div className="pb-6">
            <BlockHeader number="04" label="Prova Social" done={b4Done} />
            <FieldInput
              label="Por que alguém acreditaria nisso?"
              value={prova}
              onChange={v => { setProva(v); setSaved(false); }}
              placeholder="Ex: +10.000 clientes, avaliações 5 estrelas e resultados comprovados"
              hint="Números, certificações, depoimentos — o que comprova o resultado."
            />
          </div>

          {/* Block 05 — Como Usar */}
          <div className="pt-6 border-t border-gray-100">
            <BlockHeader number="05" label="Como Usar" done={b5Done} />
            <FieldInput
              label="Como esse produto é usado na prática?"
              value={uso}
              onChange={v => { setUso(v); setSaved(false); }}
              placeholder="Ex: Tomar 2 cápsulas por dia pela manhã"
              hint="Quanto mais específico, mais realista fica o roteiro."
            />
          </div>

        </div>{/* /RIGHT */}
      </div>

      {/* ── Action buttons ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-6 mt-7 border-t border-gray-100">
        <p className="text-xs text-gray-400 hidden sm:block">
          {blocksComplete === 5
            ? "✨ Guia completo — roteiros com máxima qualidade"
            : `Preencha os ${5 - blocksComplete} blocos restantes para melhores roteiros`}
        </p>

        <div className="flex items-center gap-2 ml-auto">
          {onBack ? (
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSave("back")}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 h-9 rounded-xl text-sm font-medium transition-all",
                "ring-1 ring-gray-200 bg-white text-gray-600 hover:ring-gray-300 hover:text-gray-800",
                loading && "opacity-40 cursor-not-allowed"
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
              disabled={loading}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 h-9 rounded-xl text-sm font-medium transition-all",
                "ring-1 ring-gray-200 bg-white text-gray-600 hover:ring-gray-300 hover:text-gray-800",
                loading && "opacity-40 cursor-not-allowed"
              )}
            >
              {loading
                ? <Loader2 size={13} className="animate-spin" />
                : saved
                  ? <Check size={13} strokeWidth={2.5} className="text-emerald-500" />
                  : <Save size={13} />}
              {saved && !loading ? "Salvo" : "Salvar"}
            </button>
          )}

          {onBack && (
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSave("back")}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 h-9 rounded-xl text-sm font-semibold transition-all",
                "bg-violet-600 hover:bg-violet-500 text-white shadow-sm shadow-violet-200",
                loading && "opacity-40 cursor-not-allowed"
              )}
            >
              {saved && !loading ? "Salvo!" : "Salvar e ir para Avatares"}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          )}
        </div>
      </div>

    </form>
  );
}

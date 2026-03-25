"use client";

import { useRef, useState } from "react";
import { addAvatar, updateAvatar } from "@/lib/storage";
import { AvatarICP, Cliente } from "@/types";
import { Check, ChevronLeft, Loader2, Plus, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const IDADE_RANGES = ["18–24", "25–34", "35–44", "45–54", "55+"];
const GENERO_OPTIONS = ["Feminino", "Masculino", "Outro"];
const MAX_CHIPS = 5;

const DORES_SUGESTOES = [
  "Falta de tempo",
  "Baixa autoestima",
  "Frustração com resultados",
  "Falta de energia",
  "Ansiedade",
  "Aparência que incomoda",
];

const DESEJOS_SUGESTOES = [
  "Se sentir mais confiante",
  "Melhorar aparência",
  "Ter mais energia",
  "Ter rotina simples",
  "Resultado rápido",
];

const OBJECOES_SUGESTOES = [
  "Medo de não funcionar",
  "Já gastou dinheiro à toa",
  "Falta de tempo",
  "Acha caro",
  "Não confia",
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

// ─── Chip list ────────────────────────────────────────────────────────────────

function ChipList({
  items, onRemove, onAdd,
  inputRef, inputValue, onInputChange, onKeyDown,
  placeholder, sugestoes, max,
}: {
  items: string[];
  onRemove: (item: string) => void;
  onAdd: (item: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputValue: string;
  onInputChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  sugestoes: string[];
  max: number;
}) {
  return (
    <div>
      <div
        className={cn(
          "w-full rounded-xl bg-white ring-1 p-3 cursor-text transition-shadow min-h-[72px]",
          "ring-gray-200 focus-within:ring-2 focus-within:ring-violet-400"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex flex-wrap gap-1.5">
          {items.map(item => (
            <span key={item} className="inline-flex items-center gap-1 pl-3 pr-1.5 py-1 rounded-lg text-xs font-medium bg-violet-50 text-violet-700 ring-1 ring-violet-200/80">
              {item}
              <button
                type="button"
                onClick={e => { e.stopPropagation(); onRemove(item); }}
                className="rounded p-0.5 hover:bg-violet-200 transition-colors"
              >
                <X size={10} strokeWidth={2.5} />
              </button>
            </span>
          ))}
          {items.length < max && (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => onInputChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={items.length === 0 ? placeholder : "Adicionar..."}
              className="flex-1 min-w-[130px] text-sm text-gray-900 placeholder:text-gray-300 bg-transparent outline-none py-0.5"
            />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-1.5 mb-3">
        <p className="text-[11px] text-gray-300">
          {items.length < max
            ? "Enter para adicionar · Backspace para remover"
            : <span className="text-violet-500 font-medium">Máximo atingido</span>}
        </p>
        <span className={cn("text-[11px] font-medium tabular-nums", items.length >= max ? "text-violet-500" : "text-gray-300")}>
          {items.length}/{max}
        </span>
      </div>

      {sugestoes.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {sugestoes.map(s => {
            const isSelected = items.includes(s);
            const isDisabled = isSelected || items.length >= max;
            return (
              <button
                key={s}
                type="button"
                disabled={isDisabled}
                onClick={() => !isSelected && onAdd(s)}
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all duration-150",
                  isSelected
                    ? "bg-violet-50 text-violet-300 ring-1 ring-violet-100 cursor-default"
                    : items.length >= max
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
      )}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface GuiaAvatarFormProps {
  clienteId: string;
  avatar?: AvatarICP;
  onSuccess: (cliente: Cliente) => void;
  onBack: () => void;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function GuiaAvatarForm({ clienteId, avatar, onSuccess, onBack }: GuiaAvatarFormProps) {
  const [nome, setNome]             = useState(avatar?.nome ?? "");
  const [idadeRange, setIdadeRange] = useState(avatar?.idadeRange ?? "");
  const [genero, setGenero]         = useState(avatar?.genero ?? "");
  const [situacao, setSituacao]     = useState(avatar?.situacao ?? avatar?.descricao ?? "");
  const [dores, setDores]           = useState<string[]>(avatar?.dores ?? []);
  const [doreInput, setDoreInput]   = useState("");
  const [desejos, setDesejos]       = useState<string[]>(avatar?.desejos ?? []);
  const [desejoInput, setDesejoInput] = useState("");
  const [objecoes, setObjecoes]     = useState<string[]>(avatar?.objecoes ?? []);
  const [objecaoInput, setObjecaoInput] = useState("");
  const [loading, setLoading]       = useState(false);
  const [saved, setSaved]           = useState(false);

  const doreRef    = useRef<HTMLInputElement>(null);
  const desejoRef  = useRef<HTMLInputElement>(null);
  const objecaoRef = useRef<HTMLInputElement>(null);

  // ── Completion ─────────────────────────────────────────────────────────────
  const b1Done = !!(idadeRange || genero || situacao.trim());
  const b2Done = dores.length > 0;
  const b3Done = desejos.length > 0;
  const b4Done = objecoes.length > 0;
  const blocksComplete = [b1Done, b2Done, b3Done, b4Done].filter(Boolean).length;

  // ── Chip factory ───────────────────────────────────────────────────────────
  function useChips(
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
  ) {
    const add = (text: string) => {
      const t = text.trim();
      if (!t || list.includes(t) || list.length >= MAX_CHIPS) return;
      setList(prev => [...prev, t]);
      setInput("");
    };
    const remove = (item: string) => setList(prev => prev.filter(x => x !== item));
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); add(input); }
      else if (e.key === "Backspace" && input === "" && list.length > 0) remove(list[list.length - 1]);
    };
    return { add, remove, onKeyDown };
  }

  const dore    = useChips(dores, setDores, doreInput, setDoreInput);
  const desejo  = useChips(desejos, setDesejos, desejoInput, setDesejoInput);
  const objecao = useChips(objecoes, setObjecoes, objecaoInput, setObjecaoInput);

  // ── Save ───────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!nome.trim()) return;
    setLoading(true);
    try {
      const data: Omit<AvatarICP, "id"> = {
        nome: nome.trim(),
        descricao: situacao.trim(),
        idadeRange,
        genero,
        situacao: situacao.trim(),
        dores,
        desejos,
        frustracao: "",
        objecoes,
      };
      const updated = avatar
        ? updateAvatar(clienteId, avatar.id, data)
        : addAvatar(clienteId, data);
      setSaved(true);
      onSuccess(updated);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSave();
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit}>

      {/* Nome */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Nome do avatar <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Ex: Mãe Fitness 35+, Empreendedor Digital..."
          autoFocus
          className={cn(
            "w-full h-10 px-3.5 rounded-xl text-sm bg-white",
            "ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none",
            "placeholder:text-gray-300 text-gray-900 transition-shadow"
          )}
        />
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-7 pb-6 border-b border-gray-100">
        <div className="flex gap-1.5">
          {[b1Done, b2Done, b3Done, b4Done].map((done, i) => (
            <div key={i} className={cn("h-1.5 w-7 rounded-full transition-all duration-300", done ? "bg-violet-500" : "bg-gray-200")} />
          ))}
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {blocksComplete === 4 ? "Guia completo ✓" : `${blocksComplete} de 4 blocos preenchidos`}
        </span>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

        {/* ── LEFT — 01, 02, 03 ────────────────────────────────────────────── */}
        <div className="lg:pr-8 lg:border-r border-gray-100">

          {/* 01 — Perfil */}
          <div className="pb-6">
            <BlockHeader number="01" label="Perfil" done={b1Done} />

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-2">Faixa etária</label>
              <div className="flex flex-wrap gap-1.5">
                {IDADE_RANGES.map(r => (
                  <button
                    key={r} type="button"
                    onClick={() => setIdadeRange(idadeRange === r ? "" : r)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      idadeRange === r
                        ? "bg-violet-600 text-white shadow-sm"
                        : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-violet-300 hover:text-violet-700"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-500">Gênero</label>
                <span className="text-[11px] text-gray-300">opcional</span>
              </div>
              <div className="flex gap-1.5">
                {GENERO_OPTIONS.map(g => (
                  <button
                    key={g} type="button"
                    onClick={() => setGenero(genero === g ? "" : g)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      genero === g
                        ? "bg-violet-600 text-white shadow-sm"
                        : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-violet-300 hover:text-violet-700"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Situação atual</label>
              <input
                type="text"
                value={situacao}
                onChange={e => setSituacao(e.target.value)}
                placeholder="Ex: Trabalha muito e não tem tempo pra cuidar da saúde"
                className={cn(
                  "w-full h-10 px-3.5 rounded-xl text-sm bg-white",
                  "ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none",
                  "placeholder:text-gray-300 text-gray-900 transition-shadow"
                )}
              />
            </div>
          </div>

          {/* 02 — Dores */}
          <div className="py-6 border-t border-gray-100">
            <BlockHeader number="02" label="Dores" done={b2Done} />
            <label className="block text-xs font-medium text-gray-500 mb-2">
              O que mais incomoda essa pessoa hoje?
            </label>
            <ChipList
              items={dores} onRemove={dore.remove} onAdd={dore.add}
              inputRef={doreRef} inputValue={doreInput} onInputChange={setDoreInput}
              onKeyDown={dore.onKeyDown}
              placeholder="Ex: cansaço constante"
              sugestoes={DORES_SUGESTOES} max={MAX_CHIPS}
            />
          </div>

          {/* 03 — Desejos */}
          <div className="pt-6 border-t border-gray-100">
            <BlockHeader number="03" label="Desejos" done={b3Done} />
            <label className="block text-xs font-medium text-gray-500 mb-2">
              O que essa pessoa quer alcançar?
            </label>
            <ChipList
              items={desejos} onRemove={desejo.remove} onAdd={desejo.add}
              inputRef={desejoRef} inputValue={desejoInput} onInputChange={setDesejoInput}
              onKeyDown={desejo.onKeyDown}
              placeholder="Ex: ter mais energia no dia a dia"
              sugestoes={DESEJOS_SUGESTOES} max={MAX_CHIPS}
            />
          </div>

        </div>{/* /LEFT */}

        {/* ── RIGHT — 04 ───────────────────────────────────────────────── */}
        <div className="lg:pl-8 mt-6 lg:mt-0">

          {/* 04 — Objeções */}
          <div>
            <BlockHeader number="04" label="Objeções" done={b4Done} />
            <label className="block text-xs font-medium text-gray-500 mb-2">
              O que faz essa pessoa hesitar antes de comprar?
            </label>
            <ChipList
              items={objecoes} onRemove={objecao.remove} onAdd={objecao.add}
              inputRef={objecaoRef} inputValue={objecaoInput} onInputChange={setObjecaoInput}
              onKeyDown={objecao.onKeyDown}
              placeholder="Ex: Não confia em reviews"
              sugestoes={OBJECOES_SUGESTOES} max={MAX_CHIPS}
            />
          </div>

        </div>{/* /RIGHT */}
      </div>

      {/* ── Buttons ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-6 mt-7 border-t border-gray-100">
        <p className="text-xs text-gray-400 hidden sm:block">
          {blocksComplete === 4
            ? "✨ Avatar completo — roteiros com máxima identificação"
            : `Preencha os ${4 - blocksComplete} blocos restantes para melhores roteiros`}
        </p>
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 h-9 rounded-xl text-sm font-medium transition-all",
              "ring-1 ring-gray-200 bg-white text-gray-600 hover:ring-gray-300 hover:text-gray-800",
              loading && "opacity-40 cursor-not-allowed"
            )}
          >
            <ChevronLeft size={13} />
            Voltar
          </button>
          <button
            type="submit"
            disabled={loading || !nome.trim()}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 h-9 rounded-xl text-sm font-semibold transition-all",
              "bg-violet-600 hover:bg-violet-500 text-white shadow-sm shadow-violet-200",
              (loading || !nome.trim()) && "opacity-40 cursor-not-allowed"
            )}
          >
            {loading
              ? <Loader2 size={13} className="animate-spin" />
              : saved
                ? <Check size={13} strokeWidth={2.5} />
                : <Save size={13} />}
            {saved && !loading ? "Salvo!" : "Salvar"}
          </button>
        </div>
      </div>

    </form>
  );
}

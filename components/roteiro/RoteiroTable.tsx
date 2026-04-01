"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CenaRoteiro, Roteiro, FOCO_LABELS, FORMATO_LABELS } from "@/types";
import {
  Check, ChevronDown, ChevronUp, ClipboardCopy, Loader2,
  RefreshCw, Wand2, Zap, Film, Megaphone, Copy, Lock, Unlock,
} from "lucide-react";

interface RoteiroTableProps {
  roteiros: Roteiro[];
  onRegenerateHooks: (locked: { index: number; text: string }[]) => void;
  onRegenerateCenas: (lockedBodyCenas: CenaRoteiro[], ctaLocked: boolean, lockedCta?: CenaRoteiro) => void;
  onGerarNovo: () => void;
  hooksLoading?: boolean;
  cenesGeradas: { [id: string]: CenaRoteiro[] };
  cenesLoading: { [id: string]: boolean };
  onGerarCenas: (roteiroId: string) => void;
}

function formatRoteiroParaTexto(roteiro: Roteiro, cenas?: CenaRoteiro[], includeBriefing = false): string {
  const linhas: string[] = [
    `ROTEIRO: ${roteiro.titulo}`,
    `Foco: ${FOCO_LABELS[roteiro.foco]} | Formato: ${FORMATO_LABELS[roteiro.formato]}`,
    ``,
    `HOOKS:`,
    ``,
  ];

  roteiro.hooks.forEach((hook, i) => {
    linhas.push(`${i + 1}. ${hook}`);
  });

  if (cenas && cenas.length > 0) {
    const bodyCenas = cenas.slice(1, -1);
    const ctaCena = cenas[cenas.length - 1];

    if (bodyCenas.length > 0) {
      linhas.push(``);
      linhas.push(`BODY:`);
      linhas.push(``);
      bodyCenas.forEach((cena) => {
        linhas.push(`🎬 CENA ${cena.cena}`);
        linhas.push(`Fala: ${cena.fala}`);
        if (includeBriefing) linhas.push(`Filmagem: ${cena.briefingFilmagem}`);
        linhas.push(``);
      });
    }

    if (ctaCena) {
      linhas.push(`CTA:`);
      linhas.push(`Fala: ${ctaCena.fala}`);
      if (includeBriefing) linhas.push(`Filmagem: ${ctaCena.briefingFilmagem}`);
    }
  }

  if (roteiro.mensagemObrigatoria) {
    linhas.push(``);
    linhas.push(`📌 Mensagem obrigatória: ${roteiro.mensagemObrigatoria}`);
  }

  return linhas.join("\n");
}

// ── Section header component ───────────────────────────────────────────────────

function SectionHeader({
  label,
  descricao,
  icon,
  color,
  lockState,
  onLockToggle,
  onRegenerate,
  loading,
}: {
  label: string;
  descricao: string;
  icon: React.ReactNode;
  color: "violet" | "slate" | "emerald";
  lockState?: "none" | "some" | "all";
  onLockToggle?: () => void;
  onRegenerate?: () => void;
  loading?: boolean;
}) {
  const colors = {
    violet: {
      badge: "bg-violet-100 text-violet-700 border-violet-200",
      icon: "bg-violet-50 text-violet-500 border-violet-100",
    },
    slate: {
      badge: "bg-slate-100 text-slate-600 border-slate-200",
      icon: "bg-slate-50 text-slate-500 border-slate-100",
    },
    emerald: {
      badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
  }[color];

  return (
    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${colors.icon}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${colors.badge}`}>
          {label}
        </span>
        <p className="text-[11px] text-gray-400 mt-0.5 leading-none">{descricao}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {onLockToggle && lockState !== undefined && (
          <button
            onClick={onLockToggle}
            className={`p-1.5 rounded-lg transition-all ${
              lockState === "all"
                ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                : lockState === "some"
                ? "text-amber-300 bg-amber-50/60 hover:bg-amber-100"
                : "text-gray-300 hover:text-amber-400 hover:bg-amber-50"
            }`}
            title={lockState === "all" ? "Desbloquear todos" : "Travar todos"}
          >
            {lockState === "all" ? <Lock size={13} /> : <Unlock size={13} />}
          </button>
        )}
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            disabled={loading || lockState === "all"}
            className="p-1.5 rounded-lg text-gray-300 hover:text-violet-500 hover:bg-violet-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="Regenerar esta seção"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Connector between sections ─────────────────────────────────────────────────

function SectionConnector() {
  return (
    <div className="flex items-center justify-center py-1">
      <div className="w-px h-5 bg-gray-200" />
    </div>
  );
}

// ── Editable textarea base styles ──────────────────────────────────────────────

const editableBase =
  "w-full text-gray-800 text-sm leading-relaxed resize-none overflow-hidden rounded-lg px-2.5 py-2 border border-dashed border-gray-200 bg-gray-50/60 hover:border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:border-transparent focus:ring-2";

const focusColors = {
  violet: "focus:ring-violet-200 focus:bg-violet-50/50",
  slate: "focus:ring-slate-200 focus:bg-slate-50/50",
  emerald: "focus:ring-emerald-200 focus:bg-emerald-50/50",
};

const lockedStyle = "border-amber-200 bg-amber-50/50 hover:border-amber-300 hover:bg-amber-50/70";

export function RoteiroTable({
  roteiros,
  onRegenerateHooks,
  onRegenerateCenas,
  onGerarNovo,
  hooksLoading,
  cenesGeradas,
  cenesLoading,
  onGerarCenas,
}: RoteiroTableProps) {
  const [copied, setCopied] = useState<{ [id: string]: boolean }>({});
  const [copiedHook, setCopiedHook] = useState<number | null>(null);
  const [showBriefing, setShowBriefing] = useState(false);
  const [editedHooks, setEditedHooks] = useState<string[]>([]);
  const [editedCenas, setEditedCenas] = useState<Record<number, string>>({});
  const [editedCtaFala, setEditedCtaFala] = useState<string>("");

  // Lock states
  const [lockedHooks, setLockedHooks] = useState<Set<number>>(new Set());
  const [lockedCenas, setLockedCenas] = useState<Set<number>>(new Set());
  const [ctaLocked, setCtaLocked] = useState(false);

  const hookRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const cenaRefs = useRef<Record<number, HTMLTextAreaElement | null>>({});
  const ctaRef = useRef<HTMLTextAreaElement | null>(null);

  const roteiro = roteiros[0] ?? null;
  const cenas = roteiro ? cenesGeradas[roteiro.id] : undefined;
  const loadingCenas = roteiro ? cenesLoading[roteiro.id] : false;
  const bodyCenas = cenas && cenas.length > 1 ? cenas.slice(1, -1) : [];
  const ctaCena = cenas && cenas.length > 0 ? cenas[cenas.length - 1] : null;

  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  // Reset locks when a new roteiro is generated (ID changes)
  useEffect(() => {
    setLockedHooks(new Set());
    setLockedCenas(new Set());
    setCtaLocked(false);
  }, [roteiros[0]?.id]); // eslint-disable-line

  // Sync hooks when new roteiro arrives or regen parcial occurs (object reference changes)
  useEffect(() => {
    if (roteiros.length > 0) {
      setEditedHooks([...roteiros[0].hooks]);
    }
  }, [roteiros[0]]); // eslint-disable-line — depende da referência do objeto

  // Sync cenas when they're generated
  useEffect(() => {
    if (cenas && cenas.length > 0) {
      const bodyMap: Record<number, string> = {};
      cenas.slice(1, -1).forEach((c) => { bodyMap[c.cena] = c.fala; });
      setEditedCenas(bodyMap);
      setEditedCtaFala(cenas[cenas.length - 1].fala);
    }
  }, [cenas]); // eslint-disable-line

  // Auto-resize all textareas after state updates
  useEffect(() => {
    hookRefs.current.forEach((el) => { if (el) autoResize(el); });
  }, [editedHooks]);

  useEffect(() => {
    Object.values(cenaRefs.current).forEach((el) => { if (el) autoResize(el); });
  }, [editedCenas]);

  useEffect(() => {
    if (ctaRef.current) autoResize(ctaRef.current);
  }, [editedCtaFala]);

  // ── Lock helpers ──────────────────────────────────────────────────────────────

  function toggleHookLock(i: number) {
    setLockedHooks((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function toggleAllHooksLock() {
    const total = editedHooks.length || roteiro?.hooks.length || 0;
    if (lockedHooks.size === total) {
      setLockedHooks(new Set());
    } else {
      setLockedHooks(new Set(Array.from({ length: total }, (_, i) => i)));
    }
  }

  function toggleCenaLock(cenaNum: number) {
    setLockedCenas((prev) => {
      const next = new Set(prev);
      if (next.has(cenaNum)) next.delete(cenaNum);
      else next.add(cenaNum);
      return next;
    });
  }

  function toggleAllCenasLock() {
    if (lockedCenas.size === bodyCenas.length) {
      setLockedCenas(new Set());
    } else {
      setLockedCenas(new Set(bodyCenas.map((c) => c.cena)));
    }
  }

  // ── Computed for callbacks ────────────────────────────────────────────────────

  function getLockedHooksData(): { index: number; text: string }[] {
    return Array.from(lockedHooks).map((i) => ({
      index: i,
      text: editedHooks[i] ?? roteiro?.hooks[i] ?? "",
    }));
  }

  function getLockedCenasData(): CenaRoteiro[] {
    return bodyCenas
      .filter((c) => lockedCenas.has(c.cena))
      .map((c) => ({ ...c, fala: editedCenas[c.cena] ?? c.fala }));
  }

  function getLockedCtaData(): CenaRoteiro | undefined {
    if (!ctaLocked || !ctaCena) return undefined;
    return { ...ctaCena, fala: editedCtaFala || ctaCena.fala };
  }

  // ── Lock state computations ───────────────────────────────────────────────────

  const totalHooks = editedHooks.length || roteiro?.hooks.length || 0;
  const hookLockState: "none" | "some" | "all" =
    lockedHooks.size === 0 ? "none"
    : lockedHooks.size === totalHooks ? "all"
    : "some";

  const bodyLockState: "none" | "some" | "all" =
    bodyCenas.length === 0 ? "none"
    : lockedCenas.size === 0 ? "none"
    : lockedCenas.size === bodyCenas.length ? "all"
    : "some";

  const ctaLockState: "none" | "all" = ctaLocked ? "all" : "none";

  // ── Edit handlers ─────────────────────────────────────────────────────────────

  function handleHookChange(index: number, value: string) {
    setEditedHooks((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  async function handleCopyHook(index: number) {
    await navigator.clipboard.writeText(editedHooks[index] ?? "");
    setCopiedHook(index);
    setTimeout(() => setCopiedHook(null), 1500);
  }

  async function handleCopy(r: Roteiro) {
    const roteiroComEdits = { ...r, hooks: editedHooks.length > 0 ? editedHooks : r.hooks };
    const cenasComEdits = cenas
      ? cenas.map((c) =>
          c === ctaCena
            ? { ...c, fala: editedCtaFala || c.fala }
            : { ...c, fala: editedCenas[c.cena] ?? c.fala }
        )
      : undefined;
    const texto = formatRoteiroParaTexto(roteiroComEdits, cenasComEdits, showBriefing);
    await navigator.clipboard.writeText(texto);
    setCopied((prev) => ({ ...prev, [r.id]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [r.id]: false })), 2000);
  }

  if (!roteiro) {
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            className="border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-xs"
            onClick={onGerarNovo}
          >
            <Wand2 size={12} className="mr-1.5" />
            Gerar novo
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {cenas && cenas.length > 0 && (
            <button
              onClick={() => setShowBriefing(!showBriefing)}
              className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-violet-600 transition-colors font-medium"
            >
              {showBriefing ? (
                <><ChevronUp size={12} />Ocultar briefing</>
              ) : (
                <><ChevronDown size={12} />Ver briefing</>
              )}
            </button>
          )}
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

      {/* Meta */}
      <div className="flex items-center gap-2 flex-wrap px-1">
        <h3 className="text-sm font-semibold text-gray-700">{roteiro.titulo}</h3>
        <Badge variant="outline" className="text-violet-600 border-violet-200 bg-violet-50 text-xs">
          {FOCO_LABELS[roteiro.foco]}
        </Badge>
        <Badge variant="outline" className="text-sky-600 border-sky-200 bg-sky-50 text-xs">
          {FORMATO_LABELS[roteiro.formato]}
        </Badge>
      </div>

      {/* ── HOOK ──────────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <SectionHeader
          label="Hook"
          descricao="Escolha 1 das 5 opções para abrir o vídeo"
          icon={<Zap size={15} />}
          color="violet"
          lockState={hookLockState}
          onLockToggle={toggleAllHooksLock}
          onRegenerate={() => onRegenerateHooks(getLockedHooksData())}
          loading={hooksLoading}
        />
        <div className="p-5 space-y-2.5">
          {(editedHooks.length > 0 ? editedHooks : roteiro.hooks).map((hook, i) => (
            <div key={i} className="flex gap-3 items-start group/hook">
              <div className="w-6 h-6 rounded-md bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0 mt-2">
                <span className="text-[11px] font-bold text-violet-600">{i + 1}</span>
              </div>
              {/* Lock button per hook */}
              <button
                onClick={() => toggleHookLock(i)}
                className={`p-1.5 rounded-lg transition-all shrink-0 mt-1.5 ${
                  lockedHooks.has(i)
                    ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                    : "text-gray-300 hover:text-amber-400 hover:bg-amber-50"
                }`}
                title={lockedHooks.has(i) ? "Desbloquear" : "Travar este hook"}
              >
                {lockedHooks.has(i) ? <Lock size={13} /> : <Unlock size={13} />}
              </button>
              <div className="flex-1 min-w-0">
                <textarea
                  ref={(el) => { hookRefs.current[i] = el; }}
                  value={hook}
                  onChange={(e) => {
                    handleHookChange(i, e.target.value);
                    autoResize(e.target);
                  }}
                  onFocus={(e) => autoResize(e.target)}
                  rows={1}
                  className={`${editableBase} ${focusColors.violet} ${lockedHooks.has(i) ? lockedStyle : ""}`}
                />
              </div>
              <button
                onClick={() => handleCopyHook(i)}
                className="p-1.5 rounded-lg text-gray-300 hover:text-violet-500 hover:bg-violet-50 transition-all opacity-0 group-hover/hook:opacity-100 shrink-0 mt-1.5"
                title="Copiar hook"
              >
                {copiedHook === i ? <Check size={13} className="text-violet-500" /> : <Copy size={13} />}
              </button>
            </div>
          ))}
        </div>

        {roteiro.mensagemObrigatoria && (
          <div className="mx-5 mb-4 px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-100">
            <p className="text-xs text-amber-700 flex items-start gap-2">
              <span className="font-semibold shrink-0">📌 Mensagem obrigatória:</span>
              <span>{roteiro.mensagemObrigatoria}</span>
            </p>
          </div>
        )}
      </div>

      <SectionConnector />

      {/* ── BODY ──────────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <SectionHeader
          label="Body"
          descricao="O desenvolvimento do vídeo — contexto, solução e prova"
          icon={<Film size={15} />}
          color="slate"
          lockState={bodyLockState}
          onLockToggle={bodyCenas.length > 0 ? toggleAllCenasLock : undefined}
          onRegenerate={
            cenas
              ? () =>
                  onRegenerateCenas(
                    getLockedCenasData(),
                    true,
                    getLockedCtaData() ?? ctaCena ?? undefined
                  )
              : undefined
          }
          loading={loadingCenas || false}
        />

        {loadingCenas ? (
          <div className="px-5 py-6 flex items-center gap-2 text-sm text-gray-400">
            <Loader2 size={14} className="animate-spin text-violet-500" />
            <span>Gerando cenas...</span>
          </div>
        ) : bodyCenas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-16">Cena</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Fala</th>
                  {showBriefing && (
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-2/5">Briefing de Filmagem</th>
                  )}
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bodyCenas.map((cena) => (
                  <tr key={cena.cena} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 align-top">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-500">{cena.cena}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <textarea
                        ref={(el) => { cenaRefs.current[cena.cena] = el; }}
                        value={editedCenas[cena.cena] ?? cena.fala}
                        onChange={(e) => {
                          setEditedCenas((prev) => ({ ...prev, [cena.cena]: e.target.value }));
                          autoResize(e.target);
                        }}
                        onFocus={(e) => autoResize(e.target)}
                        rows={1}
                        className={`${editableBase} ${focusColors.slate} ${lockedCenas.has(cena.cena) ? lockedStyle : ""}`}
                      />
                    </td>
                    {showBriefing && (
                      <td className="px-4 py-4 align-top">
                        <p className="text-gray-500 leading-relaxed text-sm">{cena.briefingFilmagem}</p>
                      </td>
                    )}
                    <td className="px-2 py-4 align-top w-10">
                      <button
                        onClick={() => toggleCenaLock(cena.cena)}
                        className={`p-1.5 rounded-lg transition-all ${
                          lockedCenas.has(cena.cena)
                            ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                            : "text-gray-300 hover:text-amber-400 hover:bg-amber-50"
                        }`}
                        title={lockedCenas.has(cena.cena) ? "Desbloquear" : "Travar esta cena"}
                      >
                        {lockedCenas.has(cena.cena) ? <Lock size={13} /> : <Unlock size={13} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-6 text-sm text-gray-400 italic">
            Cenas serão exibidas após a geração.
          </div>
        )}
      </div>

      <SectionConnector />

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <SectionHeader
          label="CTA"
          descricao="Como fechar o vídeo e direcionar o viewer"
          icon={<Megaphone size={15} />}
          color="emerald"
          lockState={ctaLockState}
          onLockToggle={ctaCena ? () => setCtaLocked((v) => !v) : undefined}
          onRegenerate={
            cenas
              ? () =>
                  onRegenerateCenas(
                    bodyCenas.map((c) => ({ ...c, fala: editedCenas[c.cena] ?? c.fala })),
                    false,
                    undefined
                  )
              : undefined
          }
          loading={loadingCenas || false}
        />

        {loadingCenas ? (
          <div className="px-5 py-6 flex items-center gap-2 text-sm text-gray-400">
            <Loader2 size={14} className="animate-spin text-violet-500" />
            <span>Gerando CTA...</span>
          </div>
        ) : ctaCena ? (
          <div className="p-5 space-y-2">
            <div className="flex gap-2 items-start">
              <textarea
                ref={ctaRef}
                value={editedCtaFala || ctaCena.fala}
                onChange={(e) => {
                  setEditedCtaFala(e.target.value);
                  autoResize(e.target);
                }}
                onFocus={(e) => autoResize(e.target)}
                rows={1}
                className={`flex-1 ${editableBase} ${focusColors.emerald} ${ctaLocked ? lockedStyle : ""}`}
              />
              <button
                onClick={() => setCtaLocked((v) => !v)}
                className={`p-1.5 rounded-lg transition-all shrink-0 mt-1 ${
                  ctaLocked
                    ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                    : "text-gray-300 hover:text-amber-400 hover:bg-amber-50"
                }`}
                title={ctaLocked ? "Desbloquear" : "Travar CTA"}
              >
                {ctaLocked ? <Lock size={13} /> : <Unlock size={13} />}
              </button>
            </div>
            {showBriefing && ctaCena.briefingFilmagem && (
              <p className="text-gray-400 text-xs leading-relaxed pt-2 border-t border-gray-100">
                {ctaCena.briefingFilmagem}
              </p>
            )}
          </div>
        ) : (
          <div className="px-5 py-6 text-sm text-gray-400 italic">
            CTA será exibido após a geração.
          </div>
        )}
      </div>
    </div>
  );
}

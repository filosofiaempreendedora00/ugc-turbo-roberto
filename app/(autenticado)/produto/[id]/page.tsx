"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GuiaProdutoForm } from "@/components/forms/GuiaProdutoForm";
import { Produto, Cliente } from "@/types";
import { getProdutoById, getClienteById, getProdutosByCliente } from "@/lib/storage";
import { ArrowLeft, Package } from "lucide-react";
import { toast } from "sonner";

export default function ProdutoPage() {
  const params   = useParams();
  const router   = useRouter();
  const produtoId = params.id as string;

  const [produto, setProduto]       = useState<Produto | null>(null);
  const [cliente, setCliente]       = useState<Cliente | null>(null);
  const [todosProdutos, setTodosProdutos] = useState<Produto[]>([]);

  async function loadData() {
    const p = await getProdutoById(produtoId);
    if (!p) { router.replace("/dashboard"); return; }
    setProduto(p);
    const [c, ps] = await Promise.all([
      getClienteById(p.clienteId),
      getProdutosByCliente(p.clienteId),
    ]);
    if (c) setCliente(c);
    setTodosProdutos(ps);
  }

  useEffect(() => { loadData(); }, [produtoId]);

  if (!produto || !cliente) return null;

  function handleSuccess(p: Produto) {
    setProduto(p);
    toast.success("Guia do produto salvo!");
  }

  return (
    <>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <Link
          href={`/cliente/${cliente.id}?tab=produtos`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-4 transition-colors"
        >
          <ArrowLeft size={14} />
          Ver todos os produtos
        </Link>

        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                {cliente.nome}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{produto.nome}</h1>
            <p className="text-gray-400 text-sm mt-1">
              Preencha o guia para que os roteiros sejam mais precisos e convertam melhor.
            </p>

            {/* Switcher de produtos — aparece só quando há 2+ */}
            {todosProdutos.length > 1 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-4">
                <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-medium mr-1">
                  <Package size={11} />
                  Outros produtos:
                </span>
                {todosProdutos.map(p => (
                  <Link key={p.id} href={`/produto/${p.id}`}>
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
                      p.id === produto.id
                        ? "bg-violet-600 text-white shadow-sm shadow-violet-200"
                        : "bg-white ring-1 ring-gray-200 text-gray-600 hover:ring-violet-300 hover:text-violet-700"
                    )}>
                      {p.nome}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Form card ───────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white px-8 py-7 shadow-sm">
        <GuiaProdutoForm
          produto={produto}
          onSuccess={handleSuccess}
          onBack={() => router.push(`/cliente/${cliente.id}?tab=avatares`)}
        />
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { GuiaProdutoForm } from "@/components/forms/GuiaProdutoForm";
import { Produto, Cliente } from "@/types";
import { getProdutoById, getClienteById } from "@/lib/storage";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ProdutoPage() {
  const params   = useParams();
  const router   = useRouter();
  const produtoId = params.id as string;

  const [produto, setProduto]   = useState<Produto | null>(null);
  const [cliente, setCliente]   = useState<Cliente | null>(null);

  function loadData() {
    const p = getProdutoById(produtoId);
    if (!p) { router.replace("/dashboard"); return; }
    setProduto(p);
    const c = getClienteById(p.clienteId);
    if (c) setCliente(c);
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
          href={`/cliente/${cliente.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-4 transition-colors"
        >
          <ArrowLeft size={14} />
          Voltar para {cliente.nome}
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                {cliente.nome}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{produto.nome}</h1>
            <p className="text-gray-400 text-sm mt-1">
              Preencha o guia para que os roteiros sejam mais precisos e convertam melhor.
            </p>
          </div>
        </div>
      </div>

      {/* ── Form card ───────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white px-8 py-7 shadow-sm">
        <GuiaProdutoForm
          produto={produto}
          onSuccess={handleSuccess}
          onBack={() => router.push(`/cliente/${cliente.id}`)}
        />
      </div>
    </>
  );
}

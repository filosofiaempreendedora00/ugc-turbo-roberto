"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GuiaProdutoForm } from "@/components/forms/GuiaProdutoForm";
import { Produto, Cliente } from "@/types";
import { getProdutoById, getClienteById } from "@/lib/storage";
import { ArrowLeft, Wand2 } from "lucide-react";
import { toast } from "sonner";

export default function ProdutoPage() {
  const params = useParams();
  const router = useRouter();
  const produtoId = params.id as string;

  const [produto, setProduto] = useState<Produto | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);

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
      <div className="mb-8">
        <Link href={`/cliente/${cliente.id}`} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-4 transition-colors">
          <ArrowLeft size={14} />
          Voltar para {cliente.nome}
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {cliente.nome}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{produto.nome}</h1>
            <p className="text-gray-500 text-sm mt-1">
              Preencha o guia do produto para enriquecer os roteiros gerados.
            </p>
          </div>
          <Link href={`/gerar?clienteId=${cliente.id}&produtoId=${produto.id}`}>
            <Button className="bg-violet-600 hover:bg-violet-500 text-white">
              <Wand2 size={15} className="mr-2" />
              Gerar roteiro
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="font-semibold text-gray-900">Guia do Produto</h2>
          <p className="text-sm text-gray-500 mt-1">
            Quanto mais detalhes você preencher, melhores serão os roteiros gerados para esse produto.
          </p>
        </div>
        <GuiaProdutoForm produto={produto} onSuccess={handleSuccess} />
      </div>
    </>
  );
}

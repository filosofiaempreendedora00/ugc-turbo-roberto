"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GuiaMarcaForm } from "@/components/forms/GuiaMarcaForm";
import { ProdutoForm } from "@/components/forms/ProdutoForm";
import { ProdutoCard } from "@/components/cards/ProdutoCard";
import { Cliente, Produto } from "@/types";
import { getClienteById, getProdutosByCliente, deleteProduto } from "@/lib/storage";
import { ArrowLeft, Package, Plus, BookOpen } from "lucide-react";
import { toast } from "sonner";

export default function ClientePage() {
  const params = useParams();
  const router = useRouter();
  const clienteId = params.id as string;

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduto, setEditProduto] = useState<Produto | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function loadData() {
    const c = getClienteById(clienteId);
    if (!c) { router.replace("/dashboard"); return; }
    setCliente(c);
    setProdutos(getProdutosByCliente(clienteId));
  }

  useEffect(() => { loadData(); }, [clienteId]);

  if (!cliente) return null;

  function handleNewProduto() { setEditProduto(undefined); setDialogOpen(true); }
  function handleEditProduto(produto: Produto) { setEditProduto(produto); setDialogOpen(true); }

  function handleProdutoSuccess(produto: Produto) {
    setDialogOpen(false);
    setEditProduto(undefined);
    loadData();
    toast.success(editProduto ? `${produto.nome} atualizado.` : `${produto.nome} adicionado.`);
  }

  function handleDeleteConfirm() {
    if (!deleteId) return;
    deleteProduto(deleteId);
    toast.success("Produto removido.");
    loadData();
    setDeleteId(null);
  }

  function handleGuiaMarcaSuccess(c: Cliente) {
    setCliente(c);
    toast.success("Guia da marca salvo!");
  }

  return (
    <>
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-4 transition-colors">
          <ArrowLeft size={14} />
          Voltar aos clientes
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{cliente.nome}</h1>
            <p className="text-gray-500 text-sm mt-1">
              {produtos.length} {produtos.length === 1 ? "produto" : "produtos"} cadastrado{produtos.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="guia" className="space-y-6">
        <TabsList className="bg-gray-100 border border-gray-200 p-1">
          <TabsTrigger value="guia" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500">
            <BookOpen size={14} className="mr-2" />
            Guia da marca
          </TabsTrigger>
          <TabsTrigger value="produtos" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500">
            <Package size={14} className="mr-2" />
            Produtos
            {produtos.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full">
                {produtos.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guia">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="font-semibold text-gray-900">Guia da Marca</h2>
              <p className="text-sm text-gray-500 mt-1">
                Essas informações são usadas como base para todos os roteiros desse cliente.
              </p>
            </div>
            <GuiaMarcaForm cliente={cliente} onSuccess={handleGuiaMarcaSuccess} />
          </div>
        </TabsContent>

        <TabsContent value="produtos">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-gray-900">Produtos</h2>
              <p className="text-sm text-gray-500 mt-1">Gerencie os produtos desse cliente e edite os guias.</p>
            </div>
            <Button onClick={handleNewProduto} className="bg-violet-600 hover:bg-violet-500 text-white">
              <Plus size={15} className="mr-2" />
              Adicionar produto
            </Button>
          </div>

          {produtos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-gray-200 bg-white">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Package size={20} className="text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">Nenhum produto ainda</p>
              <p className="text-gray-400 text-sm mt-1 max-w-xs">Adicione um produto para começar a gerar roteiros.</p>
              <Button onClick={handleNewProduto} variant="outline" className="mt-4 border-gray-200 text-gray-600 hover:bg-gray-50">
                <Plus size={14} className="mr-2" />
                Adicionar produto
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {produtos.map((produto) => (
                <ProdutoCard
                  key={produto.id}
                  produto={produto}
                  clienteNome={cliente.nome}
                  onEdit={handleEditProduto}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900">{editProduto ? "Editar produto" : "Novo produto"}</DialogTitle>
          </DialogHeader>
          <ProdutoForm clienteId={clienteId} produto={editProduto} onSuccess={handleProdutoSuccess} onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-white border-gray-200 text-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Remover produto?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              Isso irá remover o produto permanentemente. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-500 text-white">Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

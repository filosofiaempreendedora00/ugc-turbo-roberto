"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GuiaMarcaForm } from "@/components/forms/GuiaMarcaForm";
import { GuiaAvatarForm } from "@/components/forms/GuiaAvatarForm";
import { ProdutoForm } from "@/components/forms/ProdutoForm";
import { ProdutoCard } from "@/components/cards/ProdutoCard";
import { Cliente, Produto, AvatarICP } from "@/types";
import { getClienteById, getProdutosByCliente, deleteProduto, deleteAvatar } from "@/lib/storage";
import { ArrowLeft, Package, Plus, BookOpen, Pencil, Trash2, UserCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export default function ClientePage() {
  const params = useParams();
  const router = useRouter();
  const clienteId = params.id as string;

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // Produto dialog
  const [activeTab, setActiveTab] = useState("guia");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduto, setEditProduto] = useState<Produto | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Avatar dialog
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [editAvatar, setEditAvatar] = useState<AvatarICP | undefined>(undefined);
  const [deleteAvatarId, setDeleteAvatarId] = useState<string | null>(null);

  function loadData() {
    const c = getClienteById(clienteId);
    if (!c) { router.replace("/dashboard"); return; }
    setCliente(c);
    setProdutos(getProdutosByCliente(clienteId));
  }

  useEffect(() => { loadData(); }, [clienteId]);

  if (!cliente) return null;

  // ─── Produto handlers ────────────────────────────────────────────────────────
  function handleNewProduto() { setEditProduto(undefined); setDialogOpen(true); }
  function handleEditProduto(produto: Produto) { setEditProduto(produto); setDialogOpen(true); }

  function handleProdutoSuccess(produto: Produto) {
    setDialogOpen(false);
    setEditProduto(undefined);
    toast.success(editProduto ? `${produto.nome} atualizado.` : `${produto.nome} adicionado.`);
    loadData();
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

  // ─── Avatar handlers ─────────────────────────────────────────────────────────
  function handleNewAvatar() {
    setEditAvatar(undefined);
    setAvatarDialogOpen(true);
  }

  function handleEditAvatar(avatar: AvatarICP) {
    setEditAvatar(avatar);
    setAvatarDialogOpen(true);
  }

  function handleAvatarSuccess(updatedCliente: Cliente) {
    setCliente(updatedCliente);
    setAvatarDialogOpen(false);
    toast.success(editAvatar ? "Avatar atualizado." : "Avatar criado!");
  }

  function handleDeleteAvatarConfirm() {
    if (!deleteAvatarId) return;
    const updated = deleteAvatar(clienteId, deleteAvatarId);
    setCliente(updated);
    toast.success("Avatar removido.");
    setDeleteAvatarId(null);
  }

  const avatares = cliente.avatares ?? [];

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
              {produtos.length} {produtos.length === 1 ? "produto" : "produtos"} · {avatares.length} {avatares.length === 1 ? "avatar (persona)" : "avatares (persona)"}
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-100 border border-gray-200 p-1">
          <TabsTrigger value="guia" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500">
            <span className="mr-1.5 text-[10px] font-bold opacity-40">1</span>
            <BookOpen size={14} className="mr-1.5" />
            Guia da marca
          </TabsTrigger>
          <TabsTrigger value="produtos" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500">
            <span className="mr-1.5 text-[10px] font-bold opacity-40">2</span>
            <Package size={14} className="mr-1.5" />
            Produtos
            {produtos.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full">{produtos.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="avatares" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500">
            <span className="mr-1.5 text-[10px] font-bold opacity-40">3</span>
            <UserCircle size={14} className="mr-1.5" />
            Avatares
            {avatares.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full">{avatares.length}</span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ─── 1. Guia da Marca ────────────────────────────────────────────────── */}
        <TabsContent value="guia">
          <div className="rounded-2xl border border-gray-200 bg-white px-8 py-7 shadow-sm">
            <GuiaMarcaForm
              cliente={cliente}
              onSuccess={handleGuiaMarcaSuccess}
              onBack={() => router.push("/dashboard")}
              onNext={() => setActiveTab("produtos")}
              nextLabel="Produtos"
            />
          </div>
        </TabsContent>

        {/* ─── 2. Produtos ─────────────────────────────────────────────────────── */}
        <TabsContent value="produtos">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-gray-900">Produtos</h2>
              <p className="text-sm text-gray-500 mt-1">Gerencie os produtos desse cliente e edite os guias.</p>
            </div>
            <Button onClick={handleNewProduto} className="bg-violet-600 hover:bg-violet-500 text-white shadow-sm shadow-violet-200">
              <Plus size={15} className="mr-2" />
              Adicionar produto
            </Button>
          </div>

          {produtos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-gray-200 bg-white">
              <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center mb-4">
                <Package size={20} className="text-violet-400" />
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

          <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
            <button onClick={() => setActiveTab("guia")} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
              <ChevronLeft size={14} />
              Voltar ao Guia
            </button>
            <button onClick={() => setActiveTab("avatares")} className="inline-flex items-center gap-1.5 px-4 h-9 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-sm shadow-violet-200 transition-all">
              Ir para Avatares
              <ChevronRight size={14} />
            </button>
          </div>
        </TabsContent>

        {/* ─── 3. Avatares ─────────────────────────────────────────────────────── */}
        <TabsContent value="avatares">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-gray-900">Avatares (Persona)</h2>
              <p className="text-sm text-gray-500 mt-1">
                Defina os perfis de cliente ideal. Ficam disponíveis na hora de gerar roteiros.
              </p>
            </div>
            <Button onClick={handleNewAvatar} className="bg-violet-600 hover:bg-violet-500 text-white shadow-sm shadow-violet-200">
              <Plus size={15} className="mr-2" />
              Adicionar avatar
            </Button>
          </div>

          {avatares.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-gray-200 bg-white">
              <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center mb-4">
                <UserCircle size={22} className="text-violet-400" />
              </div>
              <p className="text-gray-600 font-medium">Nenhum avatar ainda</p>
              <p className="text-gray-400 text-sm mt-1 max-w-xs">
                Crie avatares (personas) para selecionar rapidamente o perfil do cliente ideal.
              </p>
              <Button onClick={handleNewAvatar} variant="outline" className="mt-4 border-gray-200 text-gray-600 hover:bg-gray-50">
                <Plus size={14} className="mr-2" />
                Adicionar avatar
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {avatares.map((avatar, i) => {
                const guiaScore = [avatar.idadeRange || avatar.genero || avatar.situacao, avatar.dores?.length, avatar.desejos?.length, avatar.frustracao, avatar.objecoes?.length].filter(Boolean).length;
                const guiaOk = guiaScore >= 5;
                return (
                  <div key={avatar.id} className="group relative bg-white rounded-2xl ring-1 ring-gray-200/80 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-100/50 hover:ring-violet-200/70">
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-violet-600">{i + 1}</span>
                          </div>
                          <p className="font-semibold text-gray-900 text-sm truncate">{avatar.nome}</p>
                        </div>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-400 hover:text-gray-700 hover:bg-gray-100" onClick={() => handleEditAvatar(avatar)}>
                            <Pencil size={13} />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50" onClick={() => setDeleteAvatarId(avatar.id)}>
                            <Trash2 size={13} />
                          </Button>
                        </div>
                      </div>

                      {/* Guia score */}
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${guiaOk ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${guiaOk ? "bg-emerald-500" : "bg-amber-400"}`} />
                          {guiaOk ? "Guia completo" : `Guia ${guiaScore}/5`}
                        </span>
                        {(avatar.idadeRange || avatar.genero) && (
                          <span className="text-xs text-gray-400">
                            {[avatar.idadeRange, avatar.genero].filter(Boolean).join(" · ")}
                          </span>
                        )}
                      </div>

                      {/* Dores preview */}
                      {avatar.dores && avatar.dores.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {avatar.dores.slice(0, 3).map(d => (
                            <span key={d} className="inline-flex px-2 py-0.5 rounded-md text-xs bg-gray-50 text-gray-500 ring-1 ring-gray-100">{d}</span>
                          ))}
                          {avatar.dores.length > 3 && (
                            <span className="inline-flex px-2 py-0.5 rounded-md text-xs bg-gray-50 text-gray-400 ring-1 ring-gray-100">+{avatar.dores.length - 3}</span>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-300 italic">Dores não definidas ainda.</p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex px-5 py-3 border-t border-gray-100 bg-gray-50/60 group-hover:bg-violet-50/40 transition-colors duration-200">
                      <button
                        onClick={() => handleEditAvatar(avatar)}
                        className="w-full inline-flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium bg-white ring-1 ring-gray-200 text-gray-600 hover:ring-violet-300 hover:text-violet-700 transition-all"
                      >
                        <Pencil size={11} />
                        Editar guia do avatar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-start mt-8 pt-5 border-t border-gray-100">
            <button onClick={() => setActiveTab("produtos")} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
              <ChevronLeft size={14} />
              Voltar a Produtos
            </button>
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── Dialog: Produto ───────────────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900">{editProduto ? "Editar produto" : "Novo produto"}</DialogTitle>
          </DialogHeader>
          <ProdutoForm clienteId={clienteId} produto={editProduto} onSuccess={handleProdutoSuccess} onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* ─── Dialog: Avatar ────────────────────────────────────────────────────── */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 sm:max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              {editAvatar ? "Editar avatar" : "Novo avatar (persona)"}
            </DialogTitle>
          </DialogHeader>
          <GuiaAvatarForm
            clienteId={clienteId}
            avatar={editAvatar}
            onSuccess={handleAvatarSuccess}
            onCancel={() => setAvatarDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* ─── AlertDialog: Delete Produto ───────────────────────────────────────── */}
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

      {/* ─── AlertDialog: Delete Avatar ────────────────────────────────────────── */}
      <AlertDialog open={!!deleteAvatarId} onOpenChange={(open) => !open && setDeleteAvatarId(null)}>
        <AlertDialogContent className="bg-white border-gray-200 text-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Remover avatar?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              O avatar será removido permanentemente deste cliente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAvatarConfirm} className="bg-red-600 hover:bg-red-500 text-white">Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

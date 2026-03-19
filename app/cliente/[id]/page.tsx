"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GuiaMarcaForm } from "@/components/forms/GuiaMarcaForm";
import { ProdutoForm } from "@/components/forms/ProdutoForm";
import { ProdutoCard } from "@/components/cards/ProdutoCard";
import { Cliente, Produto, AvatarICP } from "@/types";
import { getClienteById, getProdutosByCliente, deleteProduto, addAvatar, updateAvatar, deleteAvatar } from "@/lib/storage";
import { ArrowLeft, Package, Plus, BookOpen, Pencil, Trash2, UserCircle } from "lucide-react";
import { toast } from "sonner";

export default function ClientePage() {
  const params = useParams();
  const router = useRouter();
  const clienteId = params.id as string;

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // Produto dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduto, setEditProduto] = useState<Produto | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Avatar dialog
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [editAvatar, setEditAvatar] = useState<AvatarICP | undefined>(undefined);
  const [avatarNome, setAvatarNome] = useState("");
  const [avatarDescricao, setAvatarDescricao] = useState("");
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

  // ─── Avatar handlers ─────────────────────────────────────────────────────────
  function handleNewAvatar() {
    setEditAvatar(undefined);
    setAvatarNome("");
    setAvatarDescricao("");
    setAvatarDialogOpen(true);
  }

  function handleEditAvatar(avatar: AvatarICP) {
    setEditAvatar(avatar);
    setAvatarNome(avatar.nome);
    setAvatarDescricao(avatar.descricao);
    setAvatarDialogOpen(true);
  }

  function handleSaveAvatar() {
    if (!avatarNome.trim()) { toast.error("Informe o nome do avatar."); return; }
    if (editAvatar) {
      const updated = updateAvatar(clienteId, editAvatar.id, { nome: avatarNome.trim(), descricao: avatarDescricao.trim() });
      setCliente(updated);
      toast.success("Avatar atualizado.");
    } else {
      const updated = addAvatar(clienteId, avatarNome.trim(), avatarDescricao.trim());
      setCliente(updated);
      toast.success("Avatar adicionado.");
    }
    setAvatarDialogOpen(false);
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
              {produtos.length} {produtos.length === 1 ? "produto" : "produtos"} · {avatares.length} {avatares.length === 1 ? "avatar ICP" : "avatares ICP"}
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
          <TabsTrigger value="avatares" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500">
            <UserCircle size={14} className="mr-2" />
            ICP / Avatares
            {avatares.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full">
                {avatares.length}
              </span>
            )}
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

        {/* ─── Guia da Marca ─────────────────────────────────────────────────── */}
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

        {/* ─── ICP / Avatares ────────────────────────────────────────────────── */}
        <TabsContent value="avatares">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-gray-900">ICP / Avatares</h2>
              <p className="text-sm text-gray-500 mt-1">
                Defina os perfis de cliente ideal. Eles ficam disponíveis na hora de gerar roteiros.
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
                Crie avatares ICP para selecionar rapidamente o perfil do cliente ideal na geração de roteiros.
              </p>
              <Button onClick={handleNewAvatar} variant="outline" className="mt-4 border-gray-200 text-gray-600 hover:bg-gray-50">
                <Plus size={14} className="mr-2" />
                Adicionar avatar
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {avatares.map((avatar, i) => (
                <div key={avatar.id} className="rounded-xl border border-gray-100 bg-white p-4 flex items-start justify-between gap-3 shadow-sm">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-violet-600">{i + 1}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{avatar.nome}</p>
                      {avatar.descricao && (
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed">{avatar.descricao}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      size="icon" variant="ghost"
                      className="h-7 w-7 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                      onClick={() => handleEditAvatar(avatar)}
                    >
                      <Pencil size={13} />
                    </Button>
                    <Button
                      size="icon" variant="ghost"
                      className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50"
                      onClick={() => setDeleteAvatarId(avatar.id)}
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ─── Produtos ──────────────────────────────────────────────────────── */}
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
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900">{editAvatar ? "Editar avatar" : "Novo avatar ICP"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">Nome do avatar</Label>
              <Input
                placeholder="Ex: Mãe Fitness 35+, Empreendedor Digital..."
                value={avatarNome}
                onChange={(e) => setAvatarNome(e.target.value)}
                className="border-gray-200 bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">Briefing <span className="text-gray-400 font-normal">(opcional)</span></Label>
              <Textarea
                placeholder="Ex: Mulher entre 28-42 anos, mãe de filhos pequenos, preocupada com saúde e bem-estar, usa Instagram e TikTok..."
                value={avatarDescricao}
                onChange={(e) => setAvatarDescricao(e.target.value)}
                rows={4}
                className="border-gray-200 bg-white resize-none text-sm"
              />
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <Button variant="outline" className="border-gray-200 text-gray-600" onClick={() => setAvatarDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveAvatar} className="bg-violet-600 hover:bg-violet-500 text-white shadow-sm shadow-violet-200">
                Salvar
              </Button>
            </div>
          </div>
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

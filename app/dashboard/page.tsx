"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ClienteCard } from "@/components/cards/ClienteCard";
import { ClienteForm } from "@/components/forms/ClienteForm";
import { Cliente, Produto } from "@/types";
import { getClientes, getProdutos, deleteCliente } from "@/lib/storage";
import { Plus, Search, Users, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Cliente | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function loadData() {
    const [cs, ps] = await Promise.all([getClientes(), getProdutos()]);
    setClientes(cs);
    setProdutos(ps);
  }

  useEffect(() => { loadData(); }, []);

  const clientesFiltrados = clientes
    .filter((c) => c.nome.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  function handleEdit(cliente: Cliente) {
    setEditTarget(cliente);
    setDialogOpen(true);
  }

  function handleNewCliente() {
    setEditTarget(undefined);
    setDialogOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    try {
      await deleteCliente(deleteId);
      toast.success("Cliente removido com sucesso.");
      await loadData();
    } catch {
      toast.error("Erro ao remover cliente.");
    }
    setDeleteId(null);
  }

  function handleFormSuccess(cliente: Cliente) {
    setDialogOpen(false);
    setEditTarget(undefined);
    loadData();
    toast.success(editTarget ? `${cliente.nome} atualizado.` : `${cliente.nome} criado com sucesso!`);
  }

  const deleteTarget = clientes.find((c) => c.id === deleteId);

  return (
    <>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Clientes</h1>
          <p className="text-sm text-gray-400 mt-1">
            {clientes.length === 0
              ? "Adicione seu primeiro cliente para começar."
              : `${clientes.length} ${clientes.length === 1 ? "cliente" : "clientes"} cadastrado${clientes.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button
          onClick={handleNewCliente}
          className="bg-violet-600 hover:bg-violet-500 text-white shadow-sm shadow-violet-200 rounded-xl h-9 px-4 text-sm font-medium"
        >
          <Plus size={14} className="mr-1.5" />
          Novo cliente
        </Button>
      </div>


      {/* ── Search ──────────────────────────────────────────────────────── */}
      {clientes.length > 0 && (
        <div className="relative mb-6 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "w-full h-9 pl-9 pr-8 rounded-xl text-sm bg-white",
              "ring-1 ring-gray-200 focus:ring-2 focus:ring-violet-400 focus:outline-none",
              "placeholder:text-gray-400 text-gray-900 transition-shadow"
            )}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-gray-400 hover:text-gray-600"
            >
              <X size={13} />
            </button>
          )}
        </div>
      )}

      {/* ── Empty state ─────────────────────────────────────────────────── */}
      {clientes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-5">
            <Users size={28} className="text-violet-400" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 mb-1.5">Nenhum cliente ainda</h2>
          <p className="text-sm text-gray-400 max-w-xs mb-6">
            Comece criando o primeiro cliente. Cada cliente tem seu guia de marca e lista de produtos.
          </p>
          <Button
            onClick={handleNewCliente}
            className="bg-violet-600 hover:bg-violet-500 text-white shadow-sm shadow-violet-200 rounded-xl"
          >
            <Plus size={14} className="mr-1.5" />
            Criar primeiro cliente
          </Button>
        </div>
      )}

      {/* ── Grid ────────────────────────────────────────────────────────── */}
      {clientesFiltrados.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientesFiltrados.map((cliente) => (
            <ClienteCard
              key={cliente.id}
              cliente={cliente}
              produtos={produtos.filter((p) => p.clienteId === cliente.id)}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      {/* ── No search results ───────────────────────────────────────────── */}
      {clientes.length > 0 && clientesFiltrados.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-gray-400">
            Nenhum cliente encontrado para <span className="font-medium text-gray-600">&ldquo;{search}&rdquo;</span>
          </p>
          <button onClick={() => setSearch("")} className="text-xs text-violet-600 hover:underline mt-1.5">
            Limpar busca
          </button>
        </div>
      )}

      {/* ── Create / Edit dialog ────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              {editTarget ? "Editar cliente" : "Novo cliente"}
            </DialogTitle>
          </DialogHeader>
          <ClienteForm
            cliente={editTarget}
            onSuccess={handleFormSuccess}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* ── Delete confirm ──────────────────────────────────────────────── */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-white border-gray-200 text-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">
              Remover {deleteTarget?.nome ?? "cliente"}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              Isso também irá remover todos os produtos vinculados. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

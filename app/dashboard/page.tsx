"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Cliente | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function loadData() {
    setClientes(getClientes());
    setProdutos(getProdutos());
  }

  useEffect(() => { loadData(); }, []);

  const clientesFiltrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(search.toLowerCase())
  );

  function handleEdit(cliente: Cliente) {
    setEditTarget(cliente);
    setDialogOpen(true);
  }

  function handleNewCliente() {
    setEditTarget(undefined);
    setDialogOpen(true);
  }

  function handleDeleteConfirm() {
    if (!deleteId) return;
    deleteCliente(deleteId);
    toast.success("Cliente removido com sucesso.");
    loadData();
    setDeleteId(null);
  }

  function handleFormSuccess(cliente: Cliente) {
    setDialogOpen(false);
    setEditTarget(undefined);
    loadData();
    toast.success(editTarget ? `${cliente.nome} atualizado.` : `${cliente.nome} criado com sucesso!`);
  }

  return (
    <>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Clientes</h1>
          <p className="text-gray-500 text-sm mt-1">
            {clientes.length === 0
              ? "Nenhum cliente cadastrado ainda."
              : `${clientes.length} ${clientes.length === 1 ? "cliente" : "clientes"} cadastrado${clientes.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button onClick={handleNewCliente} className="bg-violet-600 hover:bg-violet-500 text-white shadow-sm shadow-violet-200">
          <Plus size={15} className="mr-2" />
          Novo cliente
        </Button>
      </div>

      {clientes.length > 0 && (
        <div className="relative mb-6 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar cliente..."
            className="pl-9 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {clientes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-5">
            <Users size={28} className="text-violet-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Nenhum cliente ainda</h2>
          <p className="text-gray-500 text-sm max-w-xs">
            Comece criando o primeiro cliente. Cada cliente tem seu guia de marca e lista de produtos.
          </p>
          <Button onClick={handleNewCliente} className="mt-6 bg-violet-600 hover:bg-violet-500 text-white shadow-sm shadow-violet-200">
            <Plus size={15} className="mr-2" />
            Criar primeiro cliente
          </Button>
        </div>
      )}

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

      {clientes.length > 0 && clientesFiltrados.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400">Nenhum cliente encontrado para &ldquo;{search}&rdquo;</p>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900">{editTarget ? "Editar cliente" : "Novo cliente"}</DialogTitle>
          </DialogHeader>
          <ClienteForm cliente={editTarget} onSuccess={handleFormSuccess} onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-white border-gray-200 text-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Remover cliente?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              Isso também irá remover todos os produtos vinculados. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-500 text-white">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

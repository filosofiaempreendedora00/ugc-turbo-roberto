"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCliente, updateCliente } from "@/lib/storage";
import { Cliente } from "@/types";
import { Loader2 } from "lucide-react";

interface ClienteFormProps {
  cliente?: Cliente;
  onSuccess: (cliente: Cliente) => void;
  onCancel: () => void;
}

export function ClienteForm({ cliente, onSuccess, onCancel }: ClienteFormProps) {
  const [nome, setNome] = useState(cliente?.nome ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      setError("Nome é obrigatório.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      let result: Cliente;
      if (cliente) {
        result = await updateCliente(cliente.id, { nome: nome.trim() });
      } else {
        result = await createCliente(nome.trim());
      }
      onSuccess(result);
    } catch (e) {
      console.error("[ClienteForm] Erro ao salvar cliente:", e);
      setError("Erro ao salvar cliente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome-cliente">Nome da marca / cliente</Label>
        <Input
          id="nome-cliente"
          placeholder="Ex: Glow Beauty, NutriForce, Studio Zen..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          autoFocus
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 size={14} className="mr-2 animate-spin" />}
          {cliente ? "Salvar alterações" : "Criar cliente"}
        </Button>
      </div>
    </form>
  );
}

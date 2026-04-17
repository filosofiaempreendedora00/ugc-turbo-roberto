"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProduto, updateProduto } from "@/lib/storage";
import { Produto } from "@/types";
import { Loader2 } from "lucide-react";

interface ProdutoFormProps {
  clienteId: string;
  produto?: Produto;
  onSuccess: (produto: Produto) => void;
  onCancel: () => void;
}

export function ProdutoForm({ clienteId, produto, onSuccess, onCancel }: ProdutoFormProps) {
  const [nome, setNome] = useState(produto?.nome ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      setError("Nome do produto é obrigatório.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      let result: Produto;
      if (produto) {
        result = await updateProduto(produto.id, { nome: nome.trim() });
      } else {
        result = await createProduto(clienteId, nome.trim());
      }
      onSuccess(result);
    } catch {
      setError("Erro ao salvar produto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome-produto">Nome do produto</Label>
        <Input
          id="nome-produto"
          placeholder="Ex: Sérum Vitamina C, Whey Protein, Perfume X..."
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
          {produto ? "Salvar alterações" : "Adicionar produto"}
        </Button>
      </div>
    </form>
  );
}

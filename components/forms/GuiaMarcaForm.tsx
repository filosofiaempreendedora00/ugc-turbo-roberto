"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateGuiaMarca } from "@/lib/storage";
import { Cliente, GuiaMarca } from "@/types";
import { Loader2, Save } from "lucide-react";

interface GuiaMarcaFormProps {
  cliente: Cliente;
  onSuccess: (cliente: Cliente) => void;
}

export function GuiaMarcaForm({ cliente, onSuccess }: GuiaMarcaFormProps) {
  const [form, setForm] = useState<GuiaMarca>({ ...cliente.guiaMarca });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleChange(field: keyof GuiaMarca, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = updateGuiaMarca(cliente.id, form);
      setSaved(true);
      onSuccess(updated);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="marca-nome" className="text-gray-700">Nome da marca</Label>
          <Input
            id="marca-nome"
            placeholder="Como a marca se chama?"
            value={form.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="marca-tom" className="text-gray-700">Tom de voz</Label>
          <Input
            id="marca-tom"
            placeholder="Ex: divertido, sério, inspirador, educativo..."
            value={form.tomDeVoz}
            onChange={(e) => handleChange("tomDeVoz", e.target.value)}
            className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="marca-publico" className="text-gray-700">Público-alvo</Label>
        <Input
          id="marca-publico"
          placeholder="Ex: Mulheres 25-40 anos, interessadas em skincare e bem-estar..."
          value={form.publicoAlvo}
          onChange={(e) => handleChange("publicoAlvo", e.target.value)}
          className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="marca-diferenciais" className="text-gray-700">Diferenciais da marca</Label>
        <Textarea
          id="marca-diferenciais"
          placeholder="O que torna essa marca única? Quais são seus pontos fortes?"
          value={form.diferenciais}
          onChange={(e) => handleChange("diferenciais", e.target.value)}
          rows={3}
          className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="marca-posicionamento" className="text-gray-700">Posicionamento</Label>
        <Textarea
          id="marca-posicionamento"
          placeholder="Como a marca quer ser percebida no mercado? Qual é a sua proposta de valor?"
          value={form.posicionamento}
          onChange={(e) => handleChange("posicionamento", e.target.value)}
          rows={3}
          className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="marca-obs" className="text-gray-700">Observações adicionais</Label>
        <Textarea
          id="marca-obs"
          placeholder="Palavras a evitar, temas sensíveis, contexto extra..."
          value={form.observacoes}
          onChange={(e) => handleChange("observacoes", e.target.value)}
          rows={2}
          className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="min-w-[140px] bg-violet-600 hover:bg-violet-500 text-white">
          {loading ? (
            <Loader2 size={14} className="mr-2 animate-spin" />
          ) : (
            <Save size={14} className="mr-2" />
          )}
          {saved ? "Salvo!" : "Salvar guia"}
        </Button>
      </div>
    </form>
  );
}

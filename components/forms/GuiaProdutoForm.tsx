"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateGuiaProduto } from "@/lib/storage";
import { GuiaProduto, Produto } from "@/types";
import { Loader2, Save } from "lucide-react";

interface GuiaProdutoFormProps {
  produto: Produto;
  onSuccess: (produto: Produto) => void;
}

export function GuiaProdutoForm({ produto, onSuccess }: GuiaProdutoFormProps) {
  const [form, setForm] = useState<GuiaProduto>({ ...produto.guia });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleChange(field: keyof GuiaProduto, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = updateGuiaProduto(produto.id, form);
      setSaved(true);
      onSuccess(updated);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="prod-desc" className="text-gray-700">Descrição do produto</Label>
        <Textarea
          id="prod-desc"
          placeholder="O que é esse produto? Como funciona? Para que serve?"
          value={form.descricao}
          onChange={(e) => handleChange("descricao", e.target.value)}
          rows={3}
          className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prod-beneficios" className="text-gray-700">
          Benefícios principais{" "}
          <span className="text-gray-400 text-xs font-normal">(separe por vírgula)</span>
        </Label>
        <Textarea
          id="prod-beneficios"
          placeholder="Ex: hidratação profunda, redução de manchas, pele mais firme..."
          value={form.beneficios}
          onChange={(e) => handleChange("beneficios", e.target.value)}
          rows={3}
          className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prod-dores" className="text-gray-700">
          Dores que resolve{" "}
          <span className="text-gray-400 text-xs font-normal">(separe por vírgula)</span>
        </Label>
        <Textarea
          id="prod-dores"
          placeholder="Ex: pele ressecada, falta de energia, insônia, ansiedade..."
          value={form.doresQueResolve}
          onChange={(e) => handleChange("doresQueResolve", e.target.value)}
          rows={3}
          className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prod-diferenciais" className="text-gray-700">Diferenciais do produto</Label>
        <Textarea
          id="prod-diferenciais"
          placeholder="O que diferencia esse produto da concorrência? Fórmula exclusiva, certificação, patente..."
          value={form.diferenciais}
          onChange={(e) => handleChange("diferenciais", e.target.value)}
          rows={3}
          className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prod-oferta" className="text-gray-700">Oferta / condições comerciais</Label>
        <Textarea
          id="prod-oferta"
          placeholder="Ex: 30% OFF, frete grátis, kit completo por R$197, garantia de 30 dias..."
          value={form.oferta}
          onChange={(e) => handleChange("oferta", e.target.value)}
          rows={2}
          className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prod-obs" className="text-gray-700">Observações adicionais</Label>
        <Textarea
          id="prod-obs"
          placeholder="Restrições de uso, contraindicações, informações técnicas, contexto extra..."
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

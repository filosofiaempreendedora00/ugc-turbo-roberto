import { BookMarked } from "lucide-react";

export default function ReferenciasPage() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-5">
        <BookMarked size={28} className="text-violet-400" />
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-2">Central de Referências</h1>
      <p className="text-gray-400 text-sm max-w-sm">
        Em breve você poderá salvar e organizar referências de roteiros, vídeos e criadores aqui.
      </p>
    </div>
  );
}

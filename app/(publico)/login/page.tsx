import { redirect } from "next/navigation";
import { Wand2 } from "lucide-react";
import { getSessao } from "@/lib/auth/session";
import { BotaoEntrarGoogle } from "@/components/BotaoEntrarGoogle";
import { MensagemErroLogin } from "@/components/MensagemErroLogin";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; retorno?: string }>;
}) {
  const { erro, retorno } = await searchParams;
  const sessao = await getSessao();
  if (sessao) redirect(retorno && retorno.startsWith("/") ? retorno : "/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-violet-50 px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm mb-4">
              <Wand2 size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">UGC Studio</h1>
            <p className="text-sm text-gray-500 mt-1">Gerador de Roteiros — Turbo Partners</p>
          </div>

          <div className="space-y-4">
            <BotaoEntrarGoogle retorno={retorno} />
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              Acesso restrito ao time Turbo Partners.
              <br />
              Use seu e-mail <span className="font-medium text-gray-600">@turbopartners.com.br</span>.
            </p>
          </div>

          {erro && <MensagemErroLogin codigo={erro} />}
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">v1.0.0 · UGC Studio</p>
      </div>
    </div>
  );
}

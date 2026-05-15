import { AlertCircle } from "lucide-react";

const MENSAGENS: Record<string, string> = {
  dominio_nao_permitido:
    "Acesso restrito ao domínio @turbopartners.com.br. Use seu e-mail corporativo.",
  email_nao_verificado: "Seu e-mail no Google ainda não foi verificado.",
  state_invalido: "Sessão de login expirou ou foi corrompida. Tente novamente.",
  falha_google: "Não foi possível concluir o login pelo Google. Tente novamente.",
  access_denied: "Você cancelou o login no Google.",
};

export function MensagemErroLogin({ codigo }: { codigo: string }) {
  const texto = MENSAGENS[codigo] ?? "Não foi possível concluir o login. Tente novamente.";
  return (
    <div className="mt-6 flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-100">
      <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
      <p className="text-xs text-red-700 leading-relaxed">{texto}</p>
    </div>
  );
}

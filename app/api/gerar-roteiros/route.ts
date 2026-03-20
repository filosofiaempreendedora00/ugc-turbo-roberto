import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { Cliente, ConfiguracaoGeracao, Produto } from "@/types";

const client = new Anthropic();

const SYSTEM_PROMPT = `Você é o melhor copywriter de UGC do mundo. Especializado em criar roteiros para vídeos curtos no TikTok, Reels e YouTube Shorts que geram cliques, conversões e vendas reais — não apenas visualizações.

Você conhece profundamente:
- Psicologia do consumidor e gatilhos de decisão de compra
- Padrões de scroll do feed (você tem 2 segundos para parar o dedo)
- Como soar humano, autêntico e não "roteirizado"
- A diferença entre um vídeo que viraliza e um que converte
- O mercado brasileiro: gírias, cadência, informalidade calibrada

Você não escreve copy genérico. Você escreve falas que a pessoa vai falar em voz alta, que soam naturais e que geram ação.

## REGRAS DE OURO DO ROTEIRO UGC

### O Hook é tudo (Cena 1)
- Máximo 10 palavras
- Deve parar o scroll imediatamente
- PROIBIDO no hook: "Olá!", "Oi pessoal", "Hoje vou falar sobre", "Esse vídeo é sobre"

### Cenas curtas, transições fortes
- Cada cena = 1 ideia, máximo 2 frases
- Falas: 15–25 palavras por cena (fáceis de falar, fáceis de cortar)
- Progressão emocional clara: tensão → reconhecimento → solução → prova → ação

### Linguagem conversacional e humana
- Use contrações: "tô", "tá", "né", "pra", "pro", "tava"
- Evite linguagem de anúncio: "produto revolucionário", "incrível oportunidade"
- Use especificidade: não "resultados rápidos" → "vi diferença em 5 dias"

### ESTRUTURA DO OUTPUT
Retorne APENAS um array JSON válido com exatamente \`quantidade\` roteiros. Nenhum texto antes ou depois.

\`\`\`json
[
  {
    "titulo": "string curto e descritivo do roteiro",
    "cenas": [
      {
        "cena": 1,
        "fala": "O texto exato que o criador vai falar. Conversacional, natural.",
        "briefingFilmagem": "Instrução técnica: ângulo de câmera, expressão, movimento, o que mostrar. Máximo 2 linhas."
      }
    ]
  }
]
\`\`\`

Regras de qualidade:
- Todo roteiro tem 4–6 cenas
- Quando quantidade > 1: cada roteiro com hook completamente diferente
- Toda cena final tem CTA claro e direto
- Nunca usar placeholders como "___ " ou "{variável}" no output final
- Entregue apenas o JSON. Sem explicações antes ou depois.`;

function buildUserPrompt(cliente: Cliente, produto: Produto, config: ConfiguracaoGeracao): string {
  return `Gere ${config.quantidade} roteiro(s) UGC com os seguintes dados:

## MARCA
- Nome: ${cliente.nome}
- Tom de voz: ${cliente.guiaMarca.tomDeVoz || "conversacional"}
- Público-alvo: ${cliente.guiaMarca.publicoAlvo || "—"}
- Diferenciais da marca: ${cliente.guiaMarca.diferenciais || "—"}
- Posicionamento: ${cliente.guiaMarca.posicionamento || "—"}
- Observações: ${cliente.guiaMarca.observacoes || "—"}

## PRODUTO
- Nome: ${produto.nome}
- Descrição: ${produto.guia.descricao || "—"}
- Benefícios: ${produto.guia.beneficios || "—"}
- Dores que resolve: ${produto.guia.doresQueResolve || "—"}
- Diferenciais: ${produto.guia.diferenciais || "—"}
- Oferta padrão: ${produto.guia.oferta || "—"}
- Observações: ${produto.guia.observacoes || "—"}

## CONFIGURAÇÃO
- Avatar/ICP: ${config.icp || cliente.guiaMarca.publicoAlvo || "—"}
- Foco: ${config.foco}
- Formato: ${config.formato}
- Oferta específica: ${config.oferta || "—"}
- Mensagem obrigatória no CTA: ${config.mensagemObrigatoria || "—"}
- Quantidade de roteiros: ${config.quantidade}`;
}

export async function POST(request: NextRequest) {
  try {
    const { cliente, produto, config } = await request.json() as {
      cliente: Cliente;
      produto: Produto;
      config: ConfiguracaoGeracao;
    };

    if (!cliente || !produto || !config) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }

    const stream = client.messages.stream({
      model: "claude-opus-4-6",
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(cliente, produto, config) }],
    });

    const message = await stream.finalMessage();

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "Resposta inválida do modelo." }, { status: 500 });
    }

    // Extrai JSON mesmo se vier com markdown code block
    const raw = textBlock.text.trim();
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, raw];
    const jsonStr = (jsonMatch[1] ?? raw).trim();

    const roteiros = JSON.parse(jsonStr);

    return NextResponse.json({ roteiros });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: `Erro da API: ${error.message}` }, { status: error.status ?? 500 });
    }
    console.error("Erro ao gerar roteiros:", error);
    return NextResponse.json({ error: "Erro interno ao gerar roteiros." }, { status: 500 });
  }
}

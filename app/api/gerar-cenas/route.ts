import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { CenaRoteiro, Cliente, ConfiguracaoGeracao, Produto, Roteiro } from "@/types";

const client = new Anthropic();

const SYSTEM_PROMPT = `Você é um diretor de UGC especialista em face to camera. Sua função é criar o briefing completo de cenas para um roteiro UGC já estruturado.

Você recebe o contexto da marca/produto e os hooks do roteiro, e deve gerar 4 a 6 cenas que formem um roteiro completo e de alta conversão — do hook ao CTA.

## ESTRUTURA DE CENAS

Cada cena tem:
- **fala**: o texto exato que o criador vai falar (15–25 palavras, conversacional, sem "jabá")
- **briefingFilmagem**: instrução técnica específica (ângulo, expressão, movimento, o que mostrar — máximo 2 linhas)

## PROGRESSÃO EMOCIONAL

As cenas devem seguir:
1. Hook (já definido — use o hook indicado ou crie uma versão dele)
2. Contexto/dor ou situação
3. Apresentação do produto como solução
4. Prova ou benefício concreto
5. CTA direto (sempre na última cena)

## REGRAS DE LINGUAGEM

- Escreva como uma pessoa fala, não como um anúncio
- Use contrações: "tô", "tá", "né", "pra", "pro", "tava"
- Específico > genérico: não "resultados incríveis" → "vi diferença em 5 dias"
- Pauses naturais com "—": "E aí — tudo mudou."

## ESTRUTURA DO OUTPUT

Retorne APENAS um array JSON. Nenhum texto antes ou depois.

\`\`\`json
[
  {
    "cena": 1,
    "fala": "O texto exato. Conversacional, natural.",
    "briefingFilmagem": "Instrução técnica: ângulo, expressão, o que mostrar. Máximo 2 linhas."
  }
]
\`\`\`

Entregue apenas o JSON.`;

function parseBeneficios(raw: string): string {
  if (!raw) return "—";
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr) && arr.length > 0) return arr.map((b: string) => `• ${b}`).join("\n  ");
  } catch { /* fallback */ }
  return raw;
}

function buildPrompt(cliente: Cliente, produto: Produto, config: Pick<ConfiguracaoGeracao, "icp" | "foco" | "formato" | "oferta" | "mensagemObrigatoria">, roteiro: Roteiro): string {
  const hooksTexto = roteiro.hooks.map((h, i) => `Hook ${i + 1}: ${h}`).join("\n");

  return `Gere as cenas para o seguinte roteiro UGC:

## MARCA: ${cliente.nome}
- Tom de voz: ${cliente.guiaMarca.tomDeVoz || "conversacional"}
- Essência / posicionamento: ${cliente.guiaMarca.diferenciais || "—"}
- Percepção de marca: ${cliente.guiaMarca.posicionamento || "—"}
- Público-alvo geral: ${cliente.guiaMarca.publicoAlvo || "—"}
- Regras e restrições (NUNCA violar): ${cliente.guiaMarca.observacoes || "nenhuma"}

## PRODUTO: ${produto.nome}
- Como é usado: ${produto.guia.descricao || "—"}
- Problema que resolve: ${produto.guia.doresQueResolve || "—"}
- Benefícios:
  ${parseBeneficios(produto.guia.beneficios)}
- Diferencial competitivo: ${produto.guia.diferenciais || "—"}
- Prova social: ${produto.guia.oferta || "—"}
- Observações do produto: ${produto.guia.observacoes || "nenhuma"}

## AVATAR/ICP
${config.icp || cliente.guiaMarca.publicoAlvo || "—"}

## ROTEIRO
- Título: ${roteiro.titulo}
- Foco: ${config.foco}
- Formato: face to camera
- Oferta ativa: ${config.oferta || "nenhuma"}
- Mensagem obrigatória no CTA: ${config.mensagemObrigatoria || "nenhuma"}

## HOOKS GERADOS (escolha o mais forte para a cena 1)
${hooksTexto}

Construa a cena 1 com o hook mais forte. Complete com mais 3 a 5 cenas seguindo a progressão emocional. Honre o tom de voz da marca e as dores/desejos do avatar em cada fala.`;
}

export async function POST(request: NextRequest) {
  try {
    const { cliente, produto, config, roteiro } = await request.json() as {
      cliente: Cliente;
      produto: Produto;
      config: Pick<ConfiguracaoGeracao, "icp" | "foco" | "formato" | "oferta" | "mensagemObrigatoria">;
      roteiro: Roteiro;
    };

    if (!cliente || !produto || !config || !roteiro) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }

    const stream = client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildPrompt(cliente, produto, config, roteiro) }],
    });

    const message = await stream.finalMessage();

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "Resposta inválida do modelo." }, { status: 500 });
    }

    const raw = textBlock.text.trim();
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, raw];
    const jsonStr = (jsonMatch[1] ?? raw).trim();

    const cenas: CenaRoteiro[] = JSON.parse(jsonStr);

    return NextResponse.json({ cenas });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: `Erro da API: ${error.message}` }, { status: error.status ?? 500 });
    }
    console.error("Erro ao gerar cenas:", error);
    return NextResponse.json({ error: "Erro interno ao gerar cenas." }, { status: 500 });
  }
}

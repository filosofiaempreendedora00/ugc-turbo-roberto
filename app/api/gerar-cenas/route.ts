import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { CenaRoteiro, Cliente, ConfiguracaoGeracao, Produto, Roteiro } from "@/types";

const client = new Anthropic();

const SYSTEM_PROMPT = `Você é um diretor de UGC especialista em face to camera. Sua função é criar o briefing completo de cenas para um roteiro UGC já estruturado.

Você recebe o contexto da marca/produto e os hooks do roteiro, e deve gerar 4 a 6 cenas que formem um roteiro completo e de alta conversão — do hook ao CTA.

## ESTRUTURA DE CENAS

Cada cena tem:
- **fala**: o texto exato que o criador vai falar (máximo 15 palavras, conversacional, sem "jabá")
- **briefingFilmagem**: instrução técnica específica (ângulo, expressão, movimento, o que mostrar — máximo 2 linhas)

**REGRA DE TAMANHO — INEGOCIÁVEL:**
- Máximo 15 palavras por fala. Não há exceção.
- Máximo 2 frases por cena. Prefira 1.
- Se a ideia não cabe em 15 palavras, corte. Menos é mais.

## CENA 1 — O HOOK (parte mais importante do roteiro)

Use o hook selecionado como base da cena 1.

**LEI DO LOOP ABERTO — princípio central do hook:**
O hook deve criar uma lacuna de informação que só o vídeo fecha. O viewer precisa sentir "tenho que ver o que vem depois" — não "entendi, pode sair".

- ❌ Hook que fecha: "Eu ficava com fome e não perdia peso." → o viewer entende e segue o feed
- ✅ Hook que abre loop: "Fiz tudo certo por 6 meses. Perdi zero. Até entender o que eu tava errando." → precisa saber o quê

O hook deve:
- Ter no máximo 1–2 frases — prender, não explicar
- Entrar no pico da ação, no erro, na virada — nunca no começo da história
- Deixar uma lacuna de informação deliberada
- Nunca ser saudação, nunca descrever dor sem abrir loop

**Validação antes de finalizar a cena 1:**
1. O viewer sente que PRECISA ver o que vem depois?
2. A frase deixa uma lacuna aberta ou fecha a ideia?
3. Tem cara de anúncio ou é genérico?
Se (1) = não, (2) = fecha, ou (3) = sim → reescreva.

## PROGRESSÃO EMOCIONAL

As cenas devem seguir:
1. Hook (cena 1 — use o mais forte da lista, aplique validação acima)
2. Contexto/dor ou situação real
3. Apresentação do produto como solução natural
4. Prova ou benefício concreto e específico
5. CTA sutil e direto (OBRIGATÓRIO na última cena — sempre)

**CTA obrigatório na última cena:**
- Deve existir sempre, independente da configuração
- Tom: recomendação natural, como se fosse uma amiga dizendo onde achou
- PROIBIDO: "link na bio", "clique no link", "acesse agora", qualquer CTA genérico de anúncio
- Sempre direcionar pro site, nunca pra bio
- O CTA deve ter sinergia com o ângulo do roteiro — completar a história, não interromper

Fórmula: [eco da narrativa do roteiro] + [direcionamento pro site como consequência natural]

Exemplos de CTAs que funcionam (adapte ao ângulo):
- "Se você também tá nessa luta, vale entrar no site e ver." (ângulo: dor compartilhada)
- "Eu achei no site deles, entrega rápida e valeu cada centavo." (ângulo: descoberta pessoal)
- "Se quiser testar, é só entrar no site. Foi o que eu fiz." (ângulo: transformação)
- "O site tem todas as informações, eu li tudo antes de comprar." (ângulo: ceticismo/prova)

Exemplos que NÃO funcionam:
- "Link na bio." / "Tá na bio." / "Acesse o link."
- "Adquira agora!", "Não perca essa oportunidade!"
- Qualquer frase desconectada do que foi contado antes

Se houver mensagemObrigatoria preenchida, use-a como base mas mantenha o tom natural.

## REGRAS DE LINGUAGEM

- Escreva como uma pessoa fala, não como um anúncio
- Use contrações: "tô", "tá", "né", "pra", "pro", "tava"
- Específico > genérico: não "resultados incríveis" → "vi diferença em 5 dias"
- Prefira naturalidade a correção gramatical — imperfeições leves são bem-vindas
- Ritmo irregular: alterne frases curtas e médias. Nunca blocos uniformes.
- O produto aparece como descoberta pessoal, nunca como "jabá"

## PROIBIÇÕES ABSOLUTAS

**Nunca use:**
- Travessões (—) para estruturar frases ou fazer pausa
- "Além disso", "por outro lado", "portanto", "no entanto"
- "Este produto…", "essa solução…", "oferece…"
- "Pode ajudar…", "pode ser uma ótima opção…"
- "Os benefícios incluem…", "uma excelente escolha para…"
- "Você já…", "Você sabia…", "Se você quer…"
- "Descubra como…", "Aprenda a…"
- "Você já ouviu falar…?", "Hoje eu vou te mostrar…"
- "Basicamente", "de forma simples"
- Linguagem corporativa: otimizar, potencializar, maximizar, alavancar
- Metáforas clichê: game changer, divisor de águas, revolucionário
- Enumeração explícita: "3 benefícios", "2 razões"

**O texto NÃO pode:**
- Soar como texto escrito — deve soar falado
- Ser perfeitamente estruturado (início, meio e fim óbvios)
- Explicar demais — corte 30% do que você acha que precisa dizer
- Usar conectores formais entre frases
- Ter frases longas e completas demais
- Repetir a mesma estrutura de cena para cena

## COMO O TEXTO DEVE SOAR

Parece conversa (correto):
- Imperfeições naturais de quem está falando
- Frases que terminam de forma inesperada
- Mudanças de ritmo: curta. Curta. Aí uma um pouco mais longa. Curta.
- Linguagem de quem conta algo que aconteceu de verdade

Expressões que funcionam (use com moderação):
- "cara…", "tipo…", "sabe?"
- "eu tava…", "eu testei isso aqui e…", "não tô brincando"
- "foi aí que", "não esperava isso"

## TESTE ANTI-IA (OBRIGATÓRIO antes de entregar)

Valide cada fala:
- Isso parece algo que alguém falaria em voz alta?
- Parece improvisado — ou roteirizado?
- Tem travessão, conector formal ou linguagem corporativa?
- Se parecer texto de blog ou anúncio → reescreva.
- Se parecer conversa → está certo.

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

function buildPrompt(cliente: Cliente, produto: Produto, config: Pick<ConfiguracaoGeracao, "icp" | "foco" | "formato" | "oferta" | "mensagemObrigatoria" | "anguloCentral">, roteiro: Roteiro, ctasDeReferencia?: string[]): string {
  const hooksTexto = roteiro.hooks.map((h, i) => `Hook ${i + 1}: ${h}`).join("\n");

  const anguloSection = config.anguloCentral
    ? `## ÂNGULO CENTRAL — ESPINHA DORSAL DO ROTEIRO (PRIORIDADE MÁXIMA)
${config.anguloCentral}

Este ângulo é o fio condutor de TODAS as cenas. Não é só o gancho — é a narrativa inteira:
- A cena 1 (hook) entra diretamente neste ângulo
- As cenas do meio aprofundam e reforçam este ângulo específico
- Benefícios secundários podem aparecer, mas de forma breve e sem desviar o foco
- O ângulo deve ser sentido em cada fala, não apenas mencionado

`
    : "";

  return `${anguloSection}Gere as cenas para o seguinte roteiro UGC:

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
${ctasDeReferencia && ctasDeReferencia.length > 0
  ? `\n## ESTRUTURAS DE CTA DE REFERÊNCIA\nEsses são os templates do banco de CTAs vencedores selecionados para este foco. Use-os como molduras estruturais para a última cena — adapte ao contexto específico desta marca, produto e à narrativa construída nas cenas anteriores. Não copie literalmente; personalize para que o CTA seja a conclusão natural do roteiro:\n${ctasDeReferencia.map((c, i) => `${i + 1}. ${c}`).join("\n")}`
  : ""}

Construa a cena 1 com o hook mais forte. Complete com mais 3 a 5 cenas seguindo a progressão emocional. Honre o tom de voz da marca e as dores/desejos do avatar em cada fala.`;
}

export async function POST(request: NextRequest) {
  try {
    const { cliente, produto, config, roteiro, ctasDeReferencia } = await request.json() as {
      cliente: Cliente;
      produto: Produto;
      config: Pick<ConfiguracaoGeracao, "icp" | "foco" | "formato" | "oferta" | "mensagemObrigatoria" | "anguloCentral">;
      roteiro: Roteiro;
      ctasDeReferencia?: string[];
    };

    if (!cliente || !produto || !config || !roteiro) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }

    const stream = client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildPrompt(cliente, produto, config, roteiro, ctasDeReferencia) }],
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

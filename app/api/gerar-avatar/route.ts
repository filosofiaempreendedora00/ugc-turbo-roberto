import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const IDADE_RANGES = ["18–24", "25–34", "35–44", "45–54", "55+"];
const GENERO_OPTIONS = ["Feminino", "Masculino", "Outro"];
const MAX_CHIPS = 5;

// ── POST handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { guiaMarca, nomeProduto, guiaProduto, avatarIndex } = body;

    if (!guiaProduto && !guiaMarca) {
      return NextResponse.json(
        { error: "É necessário ao menos o guia da marca ou do produto para gerar um avatar." },
        { status: 400 }
      );
    }

    // ── Build context strings ─────────────────────────────────────────────────

    const marcaCtx = guiaMarca
      ? [
          guiaMarca.nome ? `Marca: ${guiaMarca.nome}` : "",
          guiaMarca.posicionamento ? `Percepções da marca: ${guiaMarca.posicionamento}` : "",
          guiaMarca.tomDeVoz ? `Tom de voz: ${guiaMarca.tomDeVoz}` : "",
          guiaMarca.diferenciais ? `Essência: ${guiaMarca.diferenciais}` : "",
          guiaMarca.publicoAlvo ? `Público-alvo declarado: ${guiaMarca.publicoAlvo}` : "",
          guiaMarca.observacoes ? `Restrições da marca: ${guiaMarca.observacoes}` : "",
        ].filter(Boolean).join("\n")
      : "Nenhum guia de marca disponível.";

    let beneficiosList = "";
    if (guiaProduto?.beneficios) {
      try {
        const parsed = JSON.parse(guiaProduto.beneficios);
        if (Array.isArray(parsed)) beneficiosList = parsed.join(", ");
      } catch {
        beneficiosList = guiaProduto.beneficios;
      }
    }

    const produtoCtx = guiaProduto
      ? [
          nomeProduto ? `Produto: ${nomeProduto}` : "",
          guiaProduto.doresQueResolve ? `Problema que resolve: ${guiaProduto.doresQueResolve}` : "",
          beneficiosList ? `Benefícios: ${beneficiosList}` : "",
          guiaProduto.diferenciais ? `Diferencial: ${guiaProduto.diferenciais}` : "",
          guiaProduto.oferta ? `Prova social: ${guiaProduto.oferta}` : "",
          guiaProduto.descricao ? `Modo de uso: ${guiaProduto.descricao}` : "",
        ].filter(Boolean).join("\n")
      : "Nenhum guia de produto disponível.";

    // ── Prompt ────────────────────────────────────────────────────────────────

    const prompt = `Você é especialista em comportamento do consumidor e copywriting de resposta direta. Sua tarefa é criar um avatar (persona) extremamente realista e específico do comprador ideal de um produto, com base nos dados abaixo.

## DADOS DA MARCA

${marcaCtx}

## DADOS DO PRODUTO

${produtoCtx}

---

## TAREFA

Com base nesses dados, identifique QUEM é a pessoa mais propensa a comprar esse produto. Não crie um avatar genérico — pense em alguém específico e real, com motivações concretas, rotina identificável e emoções genuínas.

Pense: quem está ativamente sofrendo o problema que esse produto resolve? Que situação de vida a levou até essa dor? O que ela já tentou antes? O que a faz hesitar? O que ela mais quer sentir quando o problema for resolvido?

---

## CAMPOS A PREENCHER

**nomeBase** — Um apelido curto e descritivo para o avatar (2-4 palavras), que capture a essência dessa persona. Exemplos: "Mãe Executiva 35+", "Jovem Fitness", "Empreendedor Estressado", "Mulher Madura Ativa". Seja específico e humano.

**idadeRange** — Faixa etária mais provável. Escolha EXATAMENTE uma das opções:
${IDADE_RANGES.map(r => `- "${r}"`).join("\n")}

**genero** — Gênero predominante desse comprador. Escolha uma das opções ou deixe vazio se for misto:
${GENERO_OPTIONS.map(g => `- "${g}"`).join("\n")}

**situacao** — Uma frase direta que descreve a situação atual dessa pessoa na vida. Deve soar como algo que ela diria: o que ela está vivendo, sentindo e enfrentando no dia a dia ANTES de conhecer o produto. Máximo 120 caracteres.

**dores** — Entre 3 e ${MAX_CHIPS} dores reais e específicas dessa persona (o que incomoda, frustra ou limita). Frases curtas e diretas. Prefira dores emocionais e funcionais concretas.

**desejos** — Entre 3 e ${MAX_CHIPS} desejos genuínos dessa persona (o que ela quer alcançar, sentir ou se tornar). Prefira desejos que esse produto pode ajudar a realizar.

**objecoes** — Entre 2 e ${MAX_CHIPS} objeções que essa persona teria na hora de comprar. Seja realista: medo de gastar dinheiro à toa, desconfiança, experiências ruins passadas, dificuldade de encaixar na rotina, etc.

---

## FORMATO DE RESPOSTA

Responda APENAS com JSON válido. Sem markdown, sem texto antes ou depois.

{
  "nomeBase": "apelido curto descritivo",
  "idadeRange": "uma das faixas válidas",
  "genero": "Feminino | Masculino | Outro | (vazio)",
  "situacao": "situação atual em até 120 caracteres",
  "dores": ["dor 1", "dor 2", "dor 3"],
  "desejos": ["desejo 1", "desejo 2", "desejo 3"],
  "objecoes": ["objeção 1", "objeção 2", "objeção 3"]
}`;

    // ── Call Claude ───────────────────────────────────────────────────────────

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text.trim() : "";

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Não foi possível gerar o avatar. Tente novamente." },
        { status: 500 }
      );
    }

    const data = JSON.parse(jsonMatch[0]);

    // ── Sanitize ──────────────────────────────────────────────────────────────

    const nomeBase = String(data.nomeBase ?? "Avatar").trim().slice(0, 60);
    const nome = `Avatar ${avatarIndex ?? 1} — ${nomeBase}`;

    const idadeRange = IDADE_RANGES.includes(data.idadeRange) ? data.idadeRange : "";
    const genero = GENERO_OPTIONS.includes(data.genero) ? data.genero : "";
    const situacao = String(data.situacao ?? "").trim().slice(0, 200);

    const sanitizeChips = (arr: unknown): string[] => {
      if (!Array.isArray(arr)) return [];
      return arr
        .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
        .map(x => x.trim())
        .slice(0, MAX_CHIPS);
    };

    const result = {
      nome,
      idadeRange,
      genero,
      situacao,
      dores: sanitizeChips(data.dores),
      desejos: sanitizeChips(data.desejos),
      objecoes: sanitizeChips(data.objecoes),
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("[gerar-avatar] erro:", err);
    return NextResponse.json({ error: "Erro interno ao gerar o avatar." }, { status: 500 });
  }
}

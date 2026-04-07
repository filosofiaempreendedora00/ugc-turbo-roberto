import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const MAX_BENEFICIOS = 7;

// Sugestões disponíveis no form — Claude deve preferir essas quando aplicável
const SUGESTOES_BENEFICIOS = [
  "ganho de massa",
  "mais energia",
  "saciedade prolongada",
  "praticidade no dia a dia",
  "melhora na aparência",
  "melhora no sono",
  "redução de medidas",
  "pele mais firme",
  "hidratação profunda",
  "foco e concentração",
];

// ── Strip HTML to readable text ───────────────────────────────────────────────

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?(h[1-6]|p|li|div|section|article|header|footer|nav|main|ul|ol)[^>]*>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return "https://" + trimmed;
  }
  return trimmed;
}

// ── POST handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUrl: string = body.url ?? "";
    if (!rawUrl.trim()) {
      return NextResponse.json({ error: "URL obrigatória." }, { status: 400 });
    }

    const url = normalizeUrl(rawUrl);

    try { new URL(url); } catch {
      return NextResponse.json(
        { error: "URL inválida. Use o formato: https://loja.com.br/produto" },
        { status: 400 }
      );
    }

    // ── Fetch product page HTML ───────────────────────────────────────────────

    let rawHtml = "";
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
        },
        signal: AbortSignal.timeout(20000),
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: `O site retornou erro ${response.status}. Verifique a URL.` },
          { status: 400 }
        );
      }

      rawHtml = await response.text();
    } catch (fetchErr: unknown) {
      const msg = fetchErr instanceof Error ? fetchErr.message : "";
      if (msg.includes("timeout") || msg.includes("abort")) {
        return NextResponse.json(
          { error: "O site demorou demais para responder. Tente novamente." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Não foi possível acessar a página. Verifique a URL e tente novamente." },
        { status: 400 }
      );
    }

    // ── Clean and truncate ────────────────────────────────────────────────────

    const pageText = htmlToText(rawHtml).slice(0, 20000);

    if (pageText.length < 80) {
      return NextResponse.json(
        { error: "A página não retornou conteúdo legível. Pode ser uma página que requer JavaScript." },
        { status: 400 }
      );
    }

    // ── Claude analysis ───────────────────────────────────────────────────────

    const prompt = `Você é um especialista em copywriting e análise de produtos. Analise a página de produto abaixo e extraia as informações para montar um guia de produto completo, que será usado para gerar roteiros UGC de alta conversão.

PÁGINA ANALISADA: ${url}

CONTEÚDO DA PÁGINA:
${pageText}

---

## TAREFA

Preencha cada campo com base EXCLUSIVAMENTE no que está na página. Não invente dados. Se uma informação não estiver clara na página, use o que mais se aproxima ou deixe uma descrição genérica baseada no contexto.

---

## CAMPOS A PREENCHER

**1. problema** — Qual dor, problema ou necessidade esse produto resolve?
Extraia da linguagem da página: o que ela sugere que o cliente sente ANTES de usar o produto. Foco na dor emocional e funcional do avatar.

**2. beneficios** — Lista dos principais benefícios do produto (máximo ${MAX_BENEFICIOS} itens).
IMPORTANTE: prefira usar os termos abaixo quando aplicável, pois são os rótulos padrão do sistema:
${SUGESTOES_BENEFICIOS.map(s => `- "${s}"`).join("\n")}
Se o benefício não se encaixa em nenhum desses, crie um rótulo curto e direto (máximo 4 palavras).

**3. diferencial** — O que faz esse produto diferente dos concorrentes?
Extraia: tecnologia exclusiva, ingredientes únicos, método próprio, patentes, origem, processo de fabricação, certificações especiais.

**4. prova** — Por que alguém acreditaria que esse produto funciona?
Extraia: número de clientes, avaliações, estrelas, depoimentos, antes/depois, prêmios, aprovação científica, garantia.

**5. uso** — Como o produto é usado na prática?
Extraia: posologia, frequência, quantidade, modo de uso, quando usar, com o quê combinar.

---

## FORMATO DE RESPOSTA

Responda APENAS com JSON válido. Sem markdown, sem explicações, sem texto antes ou depois.

{
  "problema": "descrição clara da dor/problema que o produto resolve",
  "beneficios": ["benefício 1", "benefício 2", "...até ${MAX_BENEFICIOS} itens"],
  "diferencial": "o que torna esse produto único ou superior",
  "prova": "evidências sociais e credibilidade — números, avaliações, certificações",
  "uso": "modo de uso prático e específico"
}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text.trim() : "";

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Não foi possível interpretar a página. Tente novamente." },
        { status: 500 }
      );
    }

    const data = JSON.parse(jsonMatch[0]);

    // Sanitize and validate
    const beneficios = Array.isArray(data.beneficios)
      ? data.beneficios
          .filter((b: unknown) => typeof b === "string" && b.trim().length > 0)
          .map((b: string) => b.trim())
          .slice(0, MAX_BENEFICIOS)
      : [];

    const result = {
      problema:    String(data.problema    ?? "").trim(),
      beneficios,
      diferencial: String(data.diferencial ?? "").trim(),
      prova:       String(data.prova       ?? "").trim(),
      uso:         String(data.uso         ?? "").trim(),
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("[analisar-produto] erro:", err);
    return NextResponse.json({ error: "Erro interno ao analisar a página." }, { status: 500 });
  }
}

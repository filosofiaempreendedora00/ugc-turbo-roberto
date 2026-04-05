import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const PERCEPCAO_OPTIONS = [
  "Acessível", "Científica", "Divertida", "Inovadora",
  "Jovem", "Minimalista", "Moderna", "Premium", "Sofisticada",
];

const TOM_OPTIONS = [
  "Direta", "Amigável", "Autoridade", "Inspiradora", "Engraçada", "Educativa",
];

// ── Strips HTML to readable plain text ────────────────────────────────────────

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    // Preserve meaningful line breaks
    .replace(/<\/?(h[1-6]|p|li|div|section|article|header|footer|nav|main)[^>]*>/gi, "\n")
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

// ── Normalise URL ─────────────────────────────────────────────────────────────

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

    // Validate URL format
    try { new URL(url); } catch {
      return NextResponse.json({ error: "URL inválida. Use o formato: https://seusite.com.br" }, { status: 400 });
    }

    // ── Fetch site HTML ───────────────────────────────────────────────────────

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
        { error: "Não foi possível acessar o site. Verifique a URL e tente novamente." },
        { status: 400 }
      );
    }

    // ── Clean and truncate ────────────────────────────────────────────────────

    const siteText = htmlToText(rawHtml).slice(0, 18000);

    if (siteText.length < 100) {
      return NextResponse.json(
        { error: "O site não retornou conteúdo legível. Pode ser um site que requer JavaScript." },
        { status: 400 }
      );
    }

    // ── Claude analysis ───────────────────────────────────────────────────────

    const prompt = `Você é um especialista em branding e posicionamento de marca. Analise o conteúdo extraído deste site e preencha o guia de marca com precisão.

SITE ANALISADO: ${url}

CONTEÚDO EXTRAÍDO:
${siteText}

---

## TAREFA

Extraia as informações de marca com base EXCLUSIVAMENTE no que está no conteúdo. Não invente. Se não houver evidência clara, deixe o campo vazio ou escolha a opção mais próxima com cautela.

---

## OPÇÕES DISPONÍVEIS

**percepcoes** — Como a marca quer ser percebida (selecione todas que se aplicam, máximo 5):
${PERCEPCAO_OPTIONS.join(" | ")}

Critérios de seleção:
- Acessível: linguagem simples, preços acessíveis mencionados, "para todos"
- Científica: estuda/pesquisa, ingredientes técnicos, evidências, laboratório
- Divertida: humor, emojis, linguagem descontraída, entretenimento
- Inovadora: tecnologia, primeiro, novo, revolucionário, disruptivo
- Jovem: linguagem jovem, referências pop, TikTok, geração Z/millennial
- Minimalista: menos é mais, essencial, clean, simplicidade
- Moderna: atual, contemporânea, tendência, design moderno
- Premium: exclusiva, alta qualidade, sofisticada, luxury
- Sofisticada: requintada, elegante, curadoria

**tons** — Tom de comunicação (selecione até 3):
${TOM_OPTIONS.join(" | ")}

Critérios:
- Direta: vai direto ao ponto, objetiva, sem rodeios
- Amigável: próxima, calorosa, usa "você", conversa
- Autoridade: expertise, confiança, referência no setor
- Inspiradora: transforma vidas, sonhos, motivação
- Engraçada: piadas, ironia, leveza
- Educativa: explica, ensina, informa com profundidade

---

## FORMATO DE RESPOSTA

Responda APENAS com JSON válido. Sem markdown, sem explicações, sem texto antes ou depois.

{
  "nome": "nome exato da marca (ex: Sallve, Nubank, Nívea)",
  "percepcoes": ["opções da lista que claramente se aplicam"],
  "customPercepcoes": ["até 2 percepções relevantes que NÃO estão na lista padrão"],
  "tons": ["até 3 opções da lista de tons"],
  "customTons": ["até 1 tom relevante que NÃO está na lista padrão"],
  "essencia": "essência da marca em 1 frase, máximo 120 caracteres",
  "restricoes": "o que NÃO combina com esta marca — baseado no posicionamento e valores observados"
}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text.trim() : "";

    // Extract JSON even if there's surrounding text
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Não foi possível interpretar o site. Tente novamente." }, { status: 500 });
    }

    const data = JSON.parse(jsonMatch[0]);

    // Validate and sanitize strictly
    const result = {
      nome: String(data.nome ?? "").slice(0, 80).trim(),
      percepcoes: Array.isArray(data.percepcoes)
        ? data.percepcoes.filter((p: unknown) => typeof p === "string" && PERCEPCAO_OPTIONS.includes(p))
        : [],
      customPercepcoes: Array.isArray(data.customPercepcoes)
        ? data.customPercepcoes.filter((p: unknown) => typeof p === "string" && p.length > 0).slice(0, 2)
        : [],
      tons: Array.isArray(data.tons)
        ? data.tons.filter((t: unknown) => typeof t === "string" && TOM_OPTIONS.includes(t)).slice(0, 3)
        : [],
      customTons: Array.isArray(data.customTons)
        ? data.customTons.filter((t: unknown) => typeof t === "string" && t.length > 0).slice(0, 1)
        : [],
      essencia: String(data.essencia ?? "").slice(0, 120).trim(),
      restricoes: String(data.restricoes ?? "").trim(),
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("[analisar-site] erro:", err);
    return NextResponse.json({ error: "Erro interno ao analisar o site." }, { status: 500 });
  }
}

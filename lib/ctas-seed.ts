export interface CtaEstrutura {
  id: string;
  texto: string;
  tipo: string;
  exemplo: string;
  addedAt: string;
}

export const STORAGE_CTAS = "ugc:referencias:ctas";
export const STORAGE_CTAS_SEEDED = "ugc:referencias:ctas:seeded:v4";

function c(id: number, texto: string, tipo: string, exemplo = ""): CtaEstrutura {
  return { id: `seed-cta-${id}`, texto, tipo, exemplo, addedAt: "2025-01-01T00:00:00.000Z" };
}

export const SEED_CTAS: CtaEstrutura[] = [
  // ── Base sólida ───────────────────────────────────────────────────────────
  c(1,  "Se você tá passando por [DOR], vale dar uma conferida agora no site da [MARCA]", "dor"),
  c(2,  "Se você quer [BENEFÍCIO] de verdade, entra no site da [MARCA] e dá uma conferida", "desejo"),
  // ── Impulso imediato ──────────────────────────────────────────────────────
  c(3,  "Se você ainda tá com [DOR], eu entraria agora no site da [MARCA] pra dar uma conferida", "dor"),
  c(4,  "Se você quer resolver [DOR], vai no site da [MARCA] agora que você entende melhor como funciona", "dor"),
  // ── Identificação direta ──────────────────────────────────────────────────
  c(5,  "Se isso de [DOR] é sua realidade hoje, entra no site da [MARCA] e dá uma conferida", "dor"),
  c(6,  "Se você tá buscando [BENEFÍCIO], vale abrir agora o site da [MARCA] e ver como funciona", "desejo"),
  // ── Validação pessoal ─────────────────────────────────────────────────────
  c(7,  "Se você tá com [DOR], entra no site da [MARCA] — foi o que eu fiz e fez total sentido", "dor"),
  c(8,  "Se você quer [BENEFÍCIO], dá uma conferida no site da [MARCA], foi lá que eu entendi melhor", "desejo"),
  // ── Curiosidade com contexto ──────────────────────────────────────────────
  c(9,  "Se você tá com [DOR], entra no site da [MARCA] que lá explica direitinho como resolver isso", "dor"),
  c(10, "Se você quer [BENEFÍCIO], vale ver no site da [MARCA], porque tem detalhes que fazem diferença", "desejo"),
  // ── Baixa fricção ─────────────────────────────────────────────────────────
  c(11, "Se você tá com [DOR], entra no site da [MARCA], é bem rápido de entender", "dor"),
  c(12, "Se você quer [BENEFÍCIO], no site da [MARCA] dá pra ver tudo de forma bem direta", "desejo"),
  // ── Recomendação natural ──────────────────────────────────────────────────
  c(13, "Se você tá com [DOR], eu daria uma conferida no site da [MARCA]", "dor"),
  c(14, "Se você quer [BENEFÍCIO], eu iria agora no site da [MARCA] dar uma olhada melhor", "desejo"),
  // ── Leve urgência ─────────────────────────────────────────────────────────
  c(15, "Se você tá com [DOR], aproveita agora e entra no site da [MARCA] pra dar uma conferida", "dor"),
  c(16, "Se você quer [BENEFÍCIO], enquanto ainda tá rolando, entra no site da [MARCA] e vê como funciona", "desejo"),
  // ── Continuidade lógica ───────────────────────────────────────────────────
  c(17, "Se você tá com [DOR], faz o que eu fiz: entra no site da [MARCA] e dá uma conferida", "dor"),
  c(18, "Se você quer [BENEFÍCIO], faz sentido entrar no site da [MARCA] e entender melhor como funciona", "desejo"),
  // ── Curto, mas completo ───────────────────────────────────────────────────
  c(19, "Se você tá com [DOR], entra no site da [MARCA] e dá uma conferida", "dor"),
  c(20, "Se você quer [BENEFÍCIO], confere no site da [MARCA]", "desejo"),
];

export const TIPOS_CTA = ["dor", "desejo"];

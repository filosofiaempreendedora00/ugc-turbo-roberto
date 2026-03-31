export interface CtaEstrutura {
  id: string;
  texto: string;
  tipo: string;
  exemplo: string;
  addedAt: string;
}

export const STORAGE_CTAS = "ugc:referencias:ctas";
export const STORAGE_CTAS_SEEDED = "ugc:referencias:ctas:seeded:v2";

function c(id: number, texto: string, tipo: string, exemplo = ""): CtaEstrutura {
  return { id: `seed-cta-${id}`, texto, tipo, exemplo, addedAt: "2025-01-01T00:00:00.000Z" };
}

export const SEED_CTAS: CtaEstrutura[] = [
  // ── Natural / Despretensioso ──────────────────────────────────────────────
  c(1,  "se quiser testar, dá uma olhada no site", "Natural / Despretensioso"),
  c(2,  "eu peguei direto no site", "Natural / Despretensioso"),
  c(3,  "tá tudo lá no site", "Natural / Despretensioso"),
  c(4,  "depois dá uma olhada no site", "Natural / Despretensioso"),
  c(5,  "eu vi tudo no site antes de testar", "Natural / Despretensioso"),
  c(6,  "se quiser ver como funciona, tá no site", "Natural / Despretensioso"),
  c(7,  "tem tudo explicadinho no site", "Natural / Despretensioso"),
  c(8,  "foi lá no site que eu entendi melhor", "Natural / Despretensioso"),
  c(9,  "dá uma olhada lá no site depois", "Natural / Despretensioso"),
  c(10, "eu achei isso no site", "Natural / Despretensioso"),
  // ── Recomendação (Indireta) ───────────────────────────────────────────────
  c(11, "eu, no seu lugar, testaria isso", "Recomendação (Indireta)"),
  c(12, "se fosse você, eu daria uma chance pra isso", "Recomendação (Indireta)"),
  c(13, "eu teria começado por isso", "Recomendação (Indireta)"),
  c(14, "sinceramente, eu iria nisso aqui", "Recomendação (Indireta)"),
  c(15, "se eu tivesse conhecido antes, teria ido nisso", "Recomendação (Indireta)"),
  c(16, "eu começaria por aqui", "Recomendação (Indireta)"),
  c(17, "eu faria exatamente isso", "Recomendação (Indireta)"),
  c(18, "acho que vale testar isso aqui", "Recomendação (Indireta)"),
  c(19, "pra mim, fez sentido começar por isso", "Recomendação (Indireta)"),
  c(20, "eu não pensaria duas vezes nisso", "Recomendação (Indireta)"),
  // ── Identificação ─────────────────────────────────────────────────────────
  c(21, "se você tá passando por isso, vale testar", "Identificação"),
  c(22, "se for seu caso, dá uma olhada nisso", "Identificação"),
  c(23, "se você se identificou, testa isso", "Identificação"),
  c(24, "se isso aqui é sua realidade, considera testar", "Identificação"),
  c(25, "se você também sofre com isso, tenta isso", "Identificação"),
  c(26, "se você já tentou de tudo, talvez isso aqui te ajude", "Identificação"),
  c(27, "se você tá nessa situação, eu testaria isso", "Identificação"),
  c(28, "se isso faz sentido pra você, vale testar", "Identificação"),
  c(29, "se você vive isso, dá uma chance pra isso", "Identificação"),
  c(30, "se você chegou até aqui, testa isso", "Identificação"),
  // ── Curiosidade ───────────────────────────────────────────────────────────
  c(31, "depois vê lá no site e me fala o que achou", "Curiosidade"),
  c(32, "entra no site e olha com calma", "Curiosidade"),
  c(33, "dá uma olhada no site e vê se faz sentido", "Curiosidade"),
  c(34, "vê lá no site depois e tira sua própria conclusão", "Curiosidade"),
  c(35, "eu só fui entender quando vi no site", "Curiosidade"),
  c(36, "entra no site e vê por você mesmo", "Curiosidade"),
  c(37, "depois você me conta o que achou", "Curiosidade"),
  c(38, "dá uma olhada no site pra entender melhor", "Curiosidade"),
  c(39, "vale ver no site como isso funciona na prática", "Curiosidade"),
  c(40, "depois dá uma olhada no site com calma", "Curiosidade"),
  // ── Urgência Leve ─────────────────────────────────────────────────────────
  c(41, "aproveita que ainda tá rolando [condição] no site", "Urgência Leve"),
  c(42, "se ainda tiver disponível no site, vale pegar", "Urgência Leve"),
  c(43, "eu não sei até quando vai ter no site, mas…", "Urgência Leve"),
  c(44, "enquanto ainda tá disponível no site, vale testar", "Urgência Leve"),
  c(45, "antes que acabe no site, dá uma olhada", "Urgência Leve"),
  c(46, "se ainda tiver isso lá no site, eu aproveitaria", "Urgência Leve"),
  c(47, "enquanto ainda dá tempo no site, vale testar", "Urgência Leve"),
  c(48, "se você pegar agora no site, ainda aproveita [condição]", "Urgência Leve"),
  c(49, "não sei até quando isso fica assim no site", "Urgência Leve"),
  c(50, "se ainda estiver assim no site, vale muito", "Urgência Leve"),
  // ── Direto (Mas Ainda Humano) ─────────────────────────────────────────────
  c(51, "corre lá no site", "Direto (Mas Ainda Humano)"),
  c(52, "pega direto no site", "Direto (Mas Ainda Humano)"),
  c(53, "vai lá no site e vê", "Direto (Mas Ainda Humano)"),
  c(54, "entra no site e garante o seu", "Direto (Mas Ainda Humano)"),
  c(55, "já pega o seu lá no site", "Direto (Mas Ainda Humano)"),
  c(56, "vai direto no site", "Direto (Mas Ainda Humano)"),
  c(57, "entra no site e testa", "Direto (Mas Ainda Humano)"),
  c(58, "pega isso direto no site", "Direto (Mas Ainda Humano)"),
  c(59, "vai lá no site e dá uma olhada", "Direto (Mas Ainda Humano)"),
  c(60, "acessa o site e vê", "Direto (Mas Ainda Humano)"),
  // ── Experiência Pessoal ───────────────────────────────────────────────────
  c(61, "foi assim que eu comecei", "Experiência Pessoal"),
  c(62, "foi isso que eu fiz", "Experiência Pessoal"),
  c(63, "eu comecei por aqui", "Experiência Pessoal"),
  c(64, "eu fiz exatamente isso", "Experiência Pessoal"),
  c(65, "foi assim que resolveu pra mim", "Experiência Pessoal"),
  c(66, "foi isso que funcionou comigo", "Experiência Pessoal"),
  c(67, "foi o que mudou pra mim", "Experiência Pessoal"),
  c(68, "foi aqui que virou a chave", "Experiência Pessoal"),
  c(69, "foi esse o ponto de virada", "Experiência Pessoal"),
  c(70, "foi quando eu testei isso que mudou", "Experiência Pessoal"),
];

export const TIPOS_CTA = [
  "Natural / Despretensioso",
  "Recomendação (Indireta)",
  "Identificação",
  "Curiosidade",
  "Urgência Leve",
  "Direto (Mas Ainda Humano)",
  "Experiência Pessoal",
];

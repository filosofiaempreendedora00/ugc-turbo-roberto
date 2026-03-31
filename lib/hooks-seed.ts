// Shared seed data for the Hook Bank.
// Imported by both the referências page (for seeding localStorage)
// and the roteiro generator (as a direct fallback when localStorage is empty).

export interface HookEstrutura {
  id: string;
  estrutura: string;
  categoria: string;
  nicho: string;
  exemplo: string;
  addedAt: string;
}

export const STORAGE_HOOKS = "ugc:referencias:hooks";
export const STORAGE_HOOKS_SEEDED = "ugc:referencias:hooks:seeded:v2";

function s(id: number, estrutura: string, categoria: string, nicho: string, exemplo = ""): HookEstrutura {
  return { id: `seed-${id}`, estrutura, categoria, nicho, exemplo, addedAt: "2025-01-01T00:00:00.000Z" };
}

export const SEED_HOOKS: HookEstrutura[] = [
  // ── Hooks Gerais — Beleza & Higiene ──────────────────────────────────────
  s(1,  "Coisas que eu fiz pra ter um glow up e que realmente fizeram diferença pra mim", "Transformação", "Beleza & Higiene"),
  s(2,  "Esse é o produto que eu vou comprar pro resto da minha vida", "Prova social", "Beleza & Higiene"),
  s(3,  "O segredo pra ter [resultado] não é o que você pensa, e eu vou te provar", "Curiosidade", "Beleza & Higiene", "O segredo pra ter unhas fortes não é a sua base fortalecedora e eu vou te provar"),
  s(4,  "Foi isso aqui que acelerou o meu glow up", "Transformação", "Beleza & Higiene"),
  s(5,  "Esse é o erro que todo mundo comete na hora de [cuidado]", "Objeção", "Beleza & Higiene", "Esse é o erro que todo mundo comete na hora de cuidar da pele"),
  s(6,  "Esse é o achadinho de [nicho] que eu não conto pra ninguém, mas vou mostrar pra vocês", "Curiosidade", "Beleza & Higiene"),
  s(7,  "Esse é o produto que eu indico de olhos fechados para todas as minhas amigas", "Prova social", "Beleza & Higiene"),
  s(8,  "Esse foi o melhor investimento que fiz na minha [área] este ano", "Benefício", "Beleza & Higiene", "Esse foi o melhor investimento que fiz na minha pele este ano"),
  s(9,  "Se uma amiga me pedisse UMA dica de [nicho], eu daria essa aqui", "Benefício", "Beleza & Higiene"),
  s(10, "Esse aqui é o meu hábito de [nicho] INEGOCIÁVEL", "Prova social", "Beleza & Higiene"),
  s(11, "A base de toda a minha rotina de [nicho] começa com isso aqui", "Benefício", "Beleza & Higiene"),
  s(12, "Esse é o melhor investimento que eu fiz na minha [área]", "Benefício", "Beleza & Higiene"),
  // ── Hooks Gerais — Geral ─────────────────────────────────────────────────
  s(13, "Esse é o produto que tá sempre no meu carrinho de compras", "Prova social", "Geral"),
  s(14, "Vim influenciar vocês a comprarem o que realmente funciona", "Prova social", "Geral"),
  s(15, "Esse era o sinal que você precisava para finalmente comprar um [produto]", "Urgência", "Geral"),
  s(16, "Essa sou eu depois de descobrir COMO ACABAR COM [problema]", "Transformação", "Geral"),
  s(17, "Isso é o que eu faria se eu quisesse acabar com [problema]", "Dor", "Geral"),
  s(18, "Foi isso que eu descobri pra acabar com [problema]", "Transformação", "Geral"),
  s(19, "Se eu pudesse te dar um único conselho sobre [tema], seria este", "Benefício", "Geral"),
  s(20, "Isso aqui vai te fazer economizar TEMPO e dinheiro", "Benefício", "Geral"),
  // ── Hooks Gerais — Saúde & Bem-estar ─────────────────────────────────────
  s(21, "Você nunca mais vai ser refém de [problema] com isso aqui", "Dor", "Saúde & Bem-estar"),
  s(22, "Eu não sei mais o que é [problema] depois de ter conhecido isso aqui", "Transformação", "Saúde & Bem-estar"),
  s(23, "Foi depois de incluir esse hábito nas minhas manhãs que a minha [área] mudou de verdade", "Transformação", "Saúde & Bem-estar"),
  s(24, "Esse é o hack de saúde pra quem vive na correria", "Benefício", "Saúde & Bem-estar"),
  s(25, "Essa é a dica de ouro para quem tem preguiça de ser saudável", "Identificação", "Saúde & Bem-estar"),
  s(26, "Eu parei de gastar com vários [produtos] diferentes depois que descobri isso aqui", "Benefício", "Saúde & Bem-estar"),
  s(27, "Isso aqui é a única coisa que eu realmente preciso para os meus cuidados diários", "Benefício", "Saúde & Bem-estar"),
  s(28, "Se eu pudesse dar um único conselho de [área] para todas as minhas amigas, seria esse aqui", "Benefício", "Saúde & Bem-estar"),
  s(29, "Esse vídeo é pra você que vive reclamando de [problema]", "Identificação", "Saúde & Bem-estar"),
  s(30, "Coisas que eu queria que tivessem me falado sobre [produto/tema] quando eu comecei", "Informação", "Saúde & Bem-estar"),
  s(31, "Se a preguiça de [ação] pudesse ser derrotada por um produto, seria por este aqui", "Identificação", "Saúde & Bem-estar"),
  s(32, "Você fez tudo certinho mas no fim do dia continuou [problema]?", "Identificação", "Saúde & Bem-estar"),
  s(33, "Eu vou te mostrar como eu [ação] em menos de 30 segundos", "Benefício", "Saúde & Bem-estar"),
  s(34, "Nem todo [produto] é igual e hoje eu vou te mostrar o por quê", "Curiosidade", "Saúde & Bem-estar"),
  s(35, "Foi com ISSO AQUI que os resultados do meu [área] mudaram", "Transformação", "Saúde & Bem-estar"),
  s(36, "Se a sua rotina de [área] está travada, a gente precisa conversar", "Identificação", "Saúde & Bem-estar"),
  s(37, "Se você cuida da [área] e ela nunca melhora, eu vou te mostrar uma coisa que vai te ajudar", "Dor", "Saúde & Bem-estar"),
  s(38, "Esse é o produto que eu indico de olhos fechados para quem [contexto]", "Prova social", "Saúde & Bem-estar"),
  // ── Hooks Gerais — UGC Ad Ideas ──────────────────────────────────────────
  s(39, "Preciso da sua opinião sobre isso", "Curiosidade", "Geral"),
  s(40, "Opinião impopular: [afirmação]", "Curiosidade", "Geral"),
  s(41, "Não cometa esse erro: [erro]", "Objeção", "Geral"),
  s(42, "O que você faria se [cenário]?", "Pergunta", "Geral"),
  s(43, "A sutil arte de [benefício]", "Benefício", "Geral"),
  s(44, "[Produto] no site vs. vida real", "Curiosidade", "Geral"),
  s(45, "[Pior alternativa] vs. [produto da marca]", "Objeção", "Geral"),
  s(46, "Este é o melhor [produto] de todos e vou te contar o porquê", "Prova social", "Geral"),
  s(47, "Ninguém consegue me convencer de que existe um [produto] melhor", "Prova social", "Geral"),
  s(48, "Testando o [produto] viral", "Curiosidade", "Geral"),
  s(49, "Essa é a razão pela qual o [produto da marca] viralizou", "Curiosidade", "Geral"),
  s(50, "Chamando todos os [público-alvo]", "Identificação", "Geral"),
  s(51, "Todo [público-alvo] precisa de um desses", "Identificação", "Geral"),
  s(52, "Caro [público-alvo]: você vai ficar feliz em saber [benefício]", "Benefício", "Geral"),
  s(53, "Aviso [público-alvo]: não compre isso", "Curiosidade", "Geral"),
  s(54, "Não compre isso a menos que você queira [benefício]", "Persuasão", "Geral"),
  s(55, "Este [produto] é um código de trapaça para [benefício]", "Benefício", "Geral"),
  s(56, "Nunca mais vou comprar este [produto]", "Curiosidade", "Geral"),
  s(57, "Este [produto] arruinou minha vida", "Curiosidade", "Geral"),
  s(58, "Me diga que você é dono de um [produto] sem me dizer que você é dono de um [produto]", "Identificação", "Geral"),
  s(59, "Só compre isso se você quiser se livrar de [dor]", "Dor", "Geral"),
  s(60, "Não deixe [pior alternativa] te fazer [dor]", "Dor", "Geral"),
  s(61, "Eu não fazia ideia de quanto o [produto] mudou isso", "Transformação", "Geral"),
  s(62, "Me diga outro [produto] por aí que tenha [benefício único]", "Benefício", "Geral"),
  s(63, "Se você ainda não experimentou [produto da marca], assista isso", "Curiosidade", "Geral"),
  s(64, "Você já testou [produto], mas ainda não experimentou [produto da marca]", "Objeção", "Geral"),
  s(65, "Posso estar errado, mas este produto é muito melhor que [pior alternativa]", "Prova social", "Geral"),
  s(66, "Ainda dá tempo de entrar na onda do [produto da marca] — aqui estão 3 razões", "Urgência", "Geral"),
  s(67, "Você nunca ouviu falar do [produto da marca]? Aqui estão 3 razões pelas quais você está perdendo", "Curiosidade", "Geral"),
  s(68, "Como este [produto] me tornou um profissional em [benefício]", "Transformação", "Geral"),
  s(69, "Se você sofre com [dor], pare de rolar — com [produto], fica muito mais fácil de lidar", "Dor", "Geral"),
  s(70, "Nunca foi tão fácil conseguir [benefício]", "Benefício", "Geral"),
  s(71, "Nunca foi tão fácil se livrar de [dor]", "Dor", "Geral"),
  s(72, "Todos nós lutamos com [dor], mas este [produto] pode te ajudar", "Dor", "Geral"),
  s(73, "Eu sofria com [dor] até descobrir o [produto da marca]", "Transformação", "Geral"),
  s(74, "Então é por isso que todo mundo está falando sobre o [produto da marca]", "Curiosidade", "Geral"),
  s(75, "Todo mundo está falando sobre [produto da marca], então eu tive que experimentar", "Prova social", "Geral"),
  s(76, "Uma avaliação honesta do [produto da marca]", "Prova social", "Geral"),
  s(77, "Nunca houve um [produto] melhor em entregar [benefício]", "Benefício", "Geral"),
  s(78, "Prepare-se para dizer adeus ao seu [dor] se você comprar este [produto]", "Dor", "Geral"),
  s(79, "Quer [benefício]? Pare de rolar", "Benefício", "Geral"),
  s(80, "Quer evitar [dor]? Pare de rolar", "Dor", "Geral"),
  s(81, "Você não vai acreditar no que acontece quando uso o [produto da marca]", "Curiosidade", "Geral"),
  s(82, "Fiquei chocado(a) quando usei o [produto da marca] pela primeira vez", "Curiosidade", "Geral"),
  s(83, "Prometo que este [produto] vai mudar sua vida", "Transformação", "Geral"),
  s(84, "Ainda usando [pior alternativa]? Aqui estão 3 razões para mudar para o [produto da marca]", "Objeção", "Geral"),
  s(85, "Vida feita: acabei de encontrar este [produto] que tem [benefício único]", "Benefício", "Geral"),
  s(86, "Está lutando com [dor]? Você precisa colocar as mãos neste [produto da marca]", "Dor", "Geral"),
  s(87, "Os 'faça e não faça' de [produto]", "Informação", "Geral"),
  s(88, "Este truque simples vai te economizar horas", "Benefício", "Geral"),
  s(89, "Como consegui [benefício] em [período de tempo]", "Benefício", "Geral"),
  s(90, "Como se livrar de [dor] em [período de tempo]", "Dor", "Geral"),
  s(91, "Se você quer [benefício] até o final de [prazo], então precisa deste [produto]", "Urgência", "Geral"),
  s(92, "Por que [produto] torna [benefício] mais fácil", "Benefício", "Geral"),
  s(93, "Quer tornar [benefício] mais fácil?", "Pergunta", "Geral"),
  s(94, "[Benefício] fácil? Só use este [produto]", "Benefício", "Geral"),
  s(95, "Como você pode se livrar de [dor] super rápido", "Dor", "Geral"),
  s(96, "Quer [benefício]? Este é o jeito infalível de conseguir", "Benefício", "Geral"),
  s(97, "Eu nunca esperei que este [produto] fosse tão bom", "Prova social", "Geral"),
  s(98, "Sentindo [emoção]? Este [produto] pode resolver isso pra você", "Identificação", "Geral"),
  s(99, "Nunca um [produto] me fez sentir tanta [emoção]", "Transformação", "Geral"),
  s(100, "Mude sua rotina para sempre com este [produto]", "Transformação", "Geral"),
  s(101, "Este [produto] vai tornar sua rotina diária 10x mais fácil", "Benefício", "Geral"),
  s(102, "Minha rotina diária nunca mais foi a mesma desde que experimentei [produto da marca]", "Transformação", "Geral"),
  s(103, "A verdade sobre [produto]", "Curiosidade", "Geral"),
  s(104, "Mitos sobre [produto] que precisam ser esclarecidos", "Objeção", "Geral"),
  s(105, "Não perca o lançamento mais recente do [produto da marca]", "Urgência", "Geral"),
  s(106, "Como [produto] transformou meu [área/benefício]", "Transformação", "Geral"),
  s(107, "Pare de sofrer com [dor]", "Dor", "Geral"),
  s(108, "Descubra por que o [produto da marca] é um divisor de águas para [público-alvo]", "Benefício", "Geral"),
];

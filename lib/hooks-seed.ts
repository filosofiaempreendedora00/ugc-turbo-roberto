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
export const STORAGE_HOOKS_SEEDED = "ugc:referencias:hooks:seeded:v3";

function s(id: number, estrutura: string, categoria: string, nicho: string, exemplo = ""): HookEstrutura {
  return { id: `seed-${id}`, estrutura, categoria, nicho, exemplo, addedAt: "2025-01-01T00:00:00.000Z" };
}

export const SEED_HOOKS: HookEstrutura[] = [
  // ── Hooks Gerais — Beleza & Higiene ──────────────────────────────────────
  s(1,  "Coisas que eu fiz pra ter um glow up e que realmente fizeram diferença pra mim", "Desejo","Beleza & Higiene"),
  s(2,  "Esse é o produto que eu vou comprar pro resto da minha vida", "Desejo","Beleza & Higiene"),
  s(3,  "O segredo pra ter [resultado] não é o que você pensa, e eu vou te provar", "Desejo","Beleza & Higiene", "O segredo pra ter unhas fortes não é a sua base fortalecedora e eu vou te provar"),
  s(4,  "Foi isso aqui que acelerou o meu glow up", "Desejo","Beleza & Higiene"),
  s(5,  "Esse é o erro que todo mundo comete na hora de [cuidado]", "Desejo","Beleza & Higiene", "Esse é o erro que todo mundo comete na hora de cuidar da pele"),
  s(6,  "Esse é o achadinho de [nicho] que eu não conto pra ninguém, mas vou mostrar pra vocês", "Desejo","Beleza & Higiene"),
  s(7,  "Esse é o produto que eu indico de olhos fechados para todas as minhas amigas", "Desejo","Beleza & Higiene"),
  s(8,  "Esse foi o melhor investimento que fiz na minha [área] este ano", "Desejo","Beleza & Higiene", "Esse foi o melhor investimento que fiz na minha pele este ano"),
  s(9,  "Se uma amiga me pedisse UMA dica de [nicho], eu daria essa aqui", "Desejo","Beleza & Higiene"),
  s(10, "Esse aqui é o meu hábito de [nicho] INEGOCIÁVEL", "Desejo","Beleza & Higiene"),
  s(11, "A base de toda a minha rotina de [nicho] começa com isso aqui", "Desejo","Beleza & Higiene"),
  s(12, "Esse é o melhor investimento que eu fiz na minha [área]", "Desejo","Beleza & Higiene"),
  // ── Hooks Gerais — Geral ─────────────────────────────────────────────────
  s(13, "Esse é o produto que tá sempre no meu carrinho de compras", "Desejo","Geral"),
  s(14, "Vim influenciar vocês a comprarem o que realmente funciona", "Desejo","Geral"),
  s(15, "Esse era o sinal que você precisava para finalmente comprar um [produto]", "Desejo","Geral"),
  s(16, "Essa sou eu depois de descobrir COMO ACABAR COM [problema]", "Desejo","Geral"),
  s(17, "Isso é o que eu faria se eu quisesse acabar com [problema]", "Dor", "Geral"),
  s(18, "Foi isso que eu descobri pra acabar com [problema]", "Desejo","Geral"),
  s(19, "Se eu pudesse te dar um único conselho sobre [tema], seria este", "Desejo","Geral"),
  s(20, "Isso aqui vai te fazer economizar TEMPO e dinheiro", "Desejo","Geral"),
  // ── Hooks Gerais — Saúde & Bem-estar ─────────────────────────────────────
  s(21, "Você nunca mais vai ser refém de [problema] com isso aqui", "Dor", "Saúde & Bem-estar"),
  s(22, "Eu não sei mais o que é [problema] depois de ter conhecido isso aqui", "Desejo","Saúde & Bem-estar"),
  s(23, "Foi depois de incluir esse hábito nas minhas manhãs que a minha [área] mudou de verdade", "Desejo","Saúde & Bem-estar"),
  s(24, "Esse é o hack de saúde pra quem vive na correria", "Desejo","Saúde & Bem-estar"),
  s(25, "Essa é a dica de ouro para quem tem preguiça de ser saudável", "Desejo","Saúde & Bem-estar"),
  s(26, "Eu parei de gastar com vários [produtos] diferentes depois que descobri isso aqui", "Desejo","Saúde & Bem-estar"),
  s(27, "Isso aqui é a única coisa que eu realmente preciso para os meus cuidados diários", "Desejo","Saúde & Bem-estar"),
  s(28, "Se eu pudesse dar um único conselho de [área] para todas as minhas amigas, seria esse aqui", "Desejo","Saúde & Bem-estar"),
  s(29, "Esse vídeo é pra você que vive reclamando de [problema]", "Desejo","Saúde & Bem-estar"),
  s(30, "Coisas que eu queria que tivessem me falado sobre [produto/tema] quando eu comecei", "Desejo","Saúde & Bem-estar"),
  s(31, "Se a preguiça de [ação] pudesse ser derrotada por um produto, seria por este aqui", "Desejo","Saúde & Bem-estar"),
  s(32, "Você fez tudo certinho mas no fim do dia continuou [problema]?", "Desejo","Saúde & Bem-estar"),
  s(33, "Eu vou te mostrar como eu [ação] em menos de 30 segundos", "Desejo","Saúde & Bem-estar"),
  s(34, "Nem todo [produto] é igual e hoje eu vou te mostrar o por quê", "Desejo","Saúde & Bem-estar"),
  s(35, "Foi com ISSO AQUI que os resultados do meu [área] mudaram", "Desejo","Saúde & Bem-estar"),
  s(36, "Se a sua rotina de [área] está travada, a gente precisa conversar", "Desejo","Saúde & Bem-estar"),
  s(37, "Se você cuida da [área] e ela nunca melhora, eu vou te mostrar uma coisa que vai te ajudar", "Dor", "Saúde & Bem-estar"),
  s(38, "Esse é o produto que eu indico de olhos fechados para quem [contexto]", "Desejo","Saúde & Bem-estar"),
  // ── Hooks Gerais — UGC Ad Ideas ──────────────────────────────────────────
  s(39, "Preciso da sua opinião sobre isso", "Desejo","Geral"),
  s(40, "Opinião impopular: [afirmação]", "Desejo","Geral"),
  s(41, "Não cometa esse erro: [erro]", "Desejo","Geral"),
  s(42, "O que você faria se [cenário]?", "Desejo","Geral"),
  s(43, "A sutil arte de [benefício]", "Desejo","Geral"),
  s(44, "[Produto] no site vs. vida real", "Desejo","Geral"),
  s(45, "[Pior alternativa] vs. [produto da marca]", "Desejo","Geral"),
  s(46, "Este é o melhor [produto] de todos e vou te contar o porquê", "Desejo","Geral"),
  s(47, "Ninguém consegue me convencer de que existe um [produto] melhor", "Desejo","Geral"),
  s(48, "Testando o [produto] viral", "Desejo","Geral"),
  s(49, "Essa é a razão pela qual o [produto da marca] viralizou", "Desejo","Geral"),
  s(50, "Chamando todos os [público-alvo]", "Desejo","Geral"),
  s(51, "Todo [público-alvo] precisa de um desses", "Desejo","Geral"),
  s(52, "Caro [público-alvo]: você vai ficar feliz em saber [benefício]", "Desejo","Geral"),
  s(53, "Aviso [público-alvo]: não compre isso", "Desejo","Geral"),
  s(54, "Não compre isso a menos que você queira [benefício]", "Desejo","Geral"),
  s(55, "Este [produto] é um código de trapaça para [benefício]", "Desejo","Geral"),
  s(56, "Nunca mais vou comprar este [produto]", "Desejo","Geral"),
  s(57, "Este [produto] arruinou minha vida", "Desejo","Geral"),
  s(58, "Me diga que você é dono de um [produto] sem me dizer que você é dono de um [produto]", "Desejo","Geral"),
  s(59, "Só compre isso se você quiser se livrar de [dor]", "Dor", "Geral"),
  s(60, "Não deixe [pior alternativa] te fazer [dor]", "Dor", "Geral"),
  s(61, "Eu não fazia ideia de quanto o [produto] mudou isso", "Desejo","Geral"),
  s(62, "Me diga outro [produto] por aí que tenha [benefício único]", "Desejo","Geral"),
  s(63, "Se você ainda não experimentou [produto da marca], assista isso", "Desejo","Geral"),
  s(64, "Você já testou [produto], mas ainda não experimentou [produto da marca]", "Desejo","Geral"),
  s(65, "Posso estar errado, mas este produto é muito melhor que [pior alternativa]", "Desejo","Geral"),
  s(66, "Ainda dá tempo de entrar na onda do [produto da marca] — aqui estão 3 razões", "Desejo","Geral"),
  s(67, "Você nunca ouviu falar do [produto da marca]? Aqui estão 3 razões pelas quais você está perdendo", "Desejo","Geral"),
  s(68, "Como este [produto] me tornou um profissional em [benefício]", "Desejo","Geral"),
  s(69, "Se você sofre com [dor], pare de rolar — com [produto], fica muito mais fácil de lidar", "Dor", "Geral"),
  s(70, "Nunca foi tão fácil conseguir [benefício]", "Desejo","Geral"),
  s(71, "Nunca foi tão fácil se livrar de [dor]", "Dor", "Geral"),
  s(72, "Todos nós lutamos com [dor], mas este [produto] pode te ajudar", "Dor", "Geral"),
  s(73, "Eu sofria com [dor] até descobrir o [produto da marca]", "Desejo","Geral"),
  s(74, "Então é por isso que todo mundo está falando sobre o [produto da marca]", "Desejo","Geral"),
  s(75, "Todo mundo está falando sobre [produto da marca], então eu tive que experimentar", "Desejo","Geral"),
  s(76, "Uma avaliação honesta do [produto da marca]", "Desejo","Geral"),
  s(77, "Nunca houve um [produto] melhor em entregar [benefício]", "Desejo","Geral"),
  s(78, "Prepare-se para dizer adeus ao seu [dor] se você comprar este [produto]", "Dor", "Geral"),
  s(79, "Quer [benefício]? Pare de rolar", "Desejo","Geral"),
  s(80, "Quer evitar [dor]? Pare de rolar", "Dor", "Geral"),
  s(81, "Você não vai acreditar no que acontece quando uso o [produto da marca]", "Desejo","Geral"),
  s(82, "Fiquei chocado(a) quando usei o [produto da marca] pela primeira vez", "Desejo","Geral"),
  s(83, "Prometo que este [produto] vai mudar sua vida", "Desejo","Geral"),
  s(84, "Ainda usando [pior alternativa]? Aqui estão 3 razões para mudar para o [produto da marca]", "Desejo","Geral"),
  s(85, "Vida feita: acabei de encontrar este [produto] que tem [benefício único]", "Desejo","Geral"),
  s(86, "Está lutando com [dor]? Você precisa colocar as mãos neste [produto da marca]", "Dor", "Geral"),
  s(87, "Os 'faça e não faça' de [produto]", "Desejo","Geral"),
  s(88, "Este truque simples vai te economizar horas", "Desejo","Geral"),
  s(89, "Como consegui [benefício] em [período de tempo]", "Desejo","Geral"),
  s(90, "Como se livrar de [dor] em [período de tempo]", "Dor", "Geral"),
  s(91, "Se você quer [benefício] até o final de [prazo], então precisa deste [produto]", "Desejo","Geral"),
  s(92, "Por que [produto] torna [benefício] mais fácil", "Desejo","Geral"),
  s(93, "Quer tornar [benefício] mais fácil?", "Desejo","Geral"),
  s(94, "[Benefício] fácil? Só use este [produto]", "Desejo","Geral"),
  s(95, "Como você pode se livrar de [dor] super rápido", "Dor", "Geral"),
  s(96, "Quer [benefício]? Este é o jeito infalível de conseguir", "Desejo","Geral"),
  s(97, "Eu nunca esperei que este [produto] fosse tão bom", "Desejo","Geral"),
  s(98, "Sentindo [emoção]? Este [produto] pode resolver isso pra você", "Desejo","Geral"),
  s(99, "Nunca um [produto] me fez sentir tanta [emoção]", "Desejo","Geral"),
  s(100, "Mude sua rotina para sempre com este [produto]", "Desejo","Geral"),
  s(101, "Este [produto] vai tornar sua rotina diária 10x mais fácil", "Desejo","Geral"),
  s(102, "Minha rotina diária nunca mais foi a mesma desde que experimentei [produto da marca]", "Desejo","Geral"),
  s(103, "A verdade sobre [produto]", "Desejo","Geral"),
  s(104, "Mitos sobre [produto] que precisam ser esclarecidos", "Desejo","Geral"),
  s(105, "Não perca o lançamento mais recente do [produto da marca]", "Desejo","Geral"),
  s(106, "Como [produto] transformou meu [área/benefício]", "Desejo","Geral"),
  s(107, "Pare de sofrer com [dor]", "Dor", "Geral"),
  s(108, "Descubra por que o [produto da marca] é um divisor de águas para [público-alvo]", "Desejo","Geral"),
];

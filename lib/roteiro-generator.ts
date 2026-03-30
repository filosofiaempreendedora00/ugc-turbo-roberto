mport {
  CenaRoteiro,
        Cliente,
        ConfiguracaoGeracao,
        FocoRoteiro,
        FormatoRoteiro,
        Produto,
        Roteiro,
        FOCO_LABELS,
        FORMATO_LABELS,
      } from "@/types";

// ─── Banco de templates por foco ─────────────────────────────────────────────

const HOOKS_POR_FOCO: Record<FocoRoteiro, string[]> = {
      dor: [
              "Você já cansou de {dor}?",
              "Se você sofre com {dor}, esse vídeo é pra você.",
              "Eu passei muito tempo lidando com {dor} até descobrir isso.",
              "O que ninguém te conta sobre {dor}...",
              "{dor}? Isso não precisa mais ser sua realidade.",
            ],
      "benefício": [
              "Imagina {beneficio} sem esforço nenhum.",
              "Esse produto me ajudou a {beneficio} em poucos dias.",
              "Finalmente consegui {beneficio} e vou te contar como.",
              "{beneficio} é possível — eu sou prova disso.",
              "O segredo pra {beneficio} que ninguém fala.",
            ],
      "transformação": [
              "Antes eu {antes}. Hoje eu {depois}. Esse produto mudou tudo.",
              "Minha transformação com {produto} em {tempo}.",
              "Não acreditei que ia funcionar, mas olha o resultado.",
              "Do {antes} pro {depois}: minha história com {produto}.",
              "Isso foi o que precisei pra sair do {antes} e chegar no {depois}.",
            ],
      prova: [
              "{numero} pessoas já comprovaram isso.",
              "Esse é o produto mais bem avaliado por {publico}.",
              "Olha o que dizem quem já usou {produto}.",
              "Com {numero} avaliações positivas, isso fala por si só.",
              "Eu duvidei. Mas o resultado real me convenceu.",
            ],
      oferta: [
              "Essa oferta é por tempo limitado — não deixa passar.",
              "Nunca vi {produto} tão acessível assim.",
              "Última chamada: {produto} com condição especial.",
              "Se você quer {beneficio}, agora é a hora.",
              "Hoje tem {desconto} em {produto}. Aproveita.",
            ],
      "objeção": [
              "Eu também achei que não era pra mim. Até tentar.",
              "Achou caro? Deixa eu te mostrar o quanto isso vale.",
              "\"Não tenho tempo pra isso\" — era eu antes de descobrir {produto}.",
              "Achei que era mais do mesmo. Errei feio.",
              "Sua maior dúvida sobre {produto} — respondida aqui.",
            ],
};

const CENAS_POR_FORMATO: Record<FormatoRoteiro, (ctx: GeracaoContext) => CenaRoteiro[]> = {
      face_to_camera: (ctx) => gerarFaceToCamera(ctx),
      tiktok_style: (ctx) => gerarTikTokStyle(ctx),
      lifestyle: (ctx) => gerarLifestyle(ctx),
      demo: (ctx) => gerarDemo(ctx),
      unboxing: (ctx) => gerarUnboxing(ctx),
      looks: (ctx) => gerarLooks(ctx),
};

interface GeracaoContext {
      cliente: Cliente;
      produto: Produto;
      config: ConfiguracaoGeracao;
      variacao: number;
}

function pick<T>(arr: T[], seed: number): T {
      return arr[seed % arr.length];
}

function gerarHook(ctx: GeracaoContext): string {
      const hooks = HOOKS_POR_FOCO[ctx.config.foco];
      const hook = pick(hooks, ctx.variacao);
      const dores = ctx.produto.guia.doresQueResolve || "esse problema";
      const beneficios = ctx.produto.guia.beneficios || "resultados incríveis";
      return hook
        .replace("{dor}", dores.split(",")[0]?.trim() || dores)
        .replace("{beneficio}", beneficios.split(",")[0]?.trim() || beneficios)
        .replace("{produto}", ctx.produto.nome)
        .replace("{antes}", "me sentir presa")
        .replace("{depois}", "ter liberdade de verdade")
        .replace("{tempo}", "30 dias")
        .replace("{numero}", String(847 + ctx.variacao * 13))
        .replace("{publico}", ctx.cliente.guiaMarca.publicoAlvo || "nossos clientes")
        .replace("{desconto}", "30% OFF")
        .replace("{desconto}", "desconto especial");
}

function gerarCTA(ctx: GeracaoContext): string {
      const ctas = [
              ctx.config.mensagemObrigatoria || `Clica no link e conhece o ${ctx.produto.nome}.`,
              `Arrasta o dedo e garante o ${ctx.produto.nome} agora.`,
              `Link na bio — não deixa pra depois.`,
              `Salva esse vídeo e vai lá conferir.`,
              `Comenta aqui se você se identificou!`,
            ];
      if (ctx.config.mensagemObrigatoria) return ctx.config.mensagemObrigatoria;
      return pick(ctas, ctx.variacao + 1);
}

// ─── Templates de formato ─────────────────────────────────────────────────────

function gerarFaceToCamera(ctx: GeracaoContext): CenaRoteiro[] {
      const hook = gerarHook(ctx);
      const cta = gerarCTA(ctx);
      const beneficios = ctx.produto.guia.beneficios || "benefícios únicos";
      const dores = ctx.produto.guia.doresQueResolve || "problemas comuns";
      return [
          {
                    cena: 1,
                    fala: hook,
                    briefingFilmagem: "Close no rosto, câmera na altura dos olhos. Fundo limpo ou ambiente de lifestyle. Expressão intensa ou curiosa. Primeiros 2 segundos sem corte.",
          },
          {
                    cena: 2,
                    fala: `Deixa eu te contar: ${dores} era o que me impedia de avançar. Eu precisava de algo que realmente funcionasse.`,
                    briefingFilmagem: "Muda levemente o ângulo. Mostrar expressão de frustração ao falar do problema. Gestos naturais com as mãos.",
          },
          {
                    cena: 3,
                    fala: `Aí eu conheci o ${ctx.produto.nome}. E o que mudou foi: ${beneficios}.`,
                    briefingFilmagem: "Segurar ou apontar para o produto. Sorrir genuinamente. Pode cortar entre fala e produto em mão.",
          },
          {
                    cena: 4,
                    fala: `${ctx.config.oferta || "A oferta tá disponível agora e vale muito a pena."}`,
                    briefingFilmagem: "Olhar direto para câmera. Tom mais sério e convincente. Pode bater palma levemente para dar ritmo.",
          },
          {
                    cena: 5,
                    fala: cta,
                    briefingFilmagem: "Apontar para baixo (link na bio). Encerrar com sorriso. Câmera pode afastar um pouco para mostrar mais do corpo.",
          },
            ];
}

function gerarTikTokStyle(ctx: GeracaoContext): CenaRoteiro[] {
      const hook = gerarHook(ctx);
      const cta = gerarCTA(ctx);
      return [
          {
                    cena: 1,
                    fala: hook,
                    briefingFilmagem: "Corte rápido, câmera próxima. Pode usar movimento de aproximação (zoom in). Ritmo acelerado desde o início. Adicionar texto na tela com o hook.",
          },
          {
                    cena: 2,
                    fala: `POV: você descobre o ${ctx.produto.nome} pela primeira vez.`,
                    briefingFilmagem: "Câmera do ponto de vista do criador. Mostrar produto sendo descoberto. Expressão de surpresa ou entusiasmo. Corte rápido.",
          },
          {
                    cena: 3,
                    fala: `${ctx.produto.guia.beneficios || "Olha só o que esse produto faz"} — eu não tô brincando.`,
                    briefingFilmagem: "Demonstração rápida em 3-4 cortes. Cada benefício = 1 segundo na tela. Adicionar texto animado para reforçar cada ponto.",
          },
          {
                    cena: 4,
                    fala: `${ctx.produto.guia.diferenciais || "Não tem nada igual no mercado."}`,
                    briefingFilmagem: "Câmera angled, fundo dinâmico ou movimento. Expressão confiante. Texto na tela: 'diferencial' em destaque.",
          },
          {
                    cena: 5,
                    fala: cta,
                    briefingFilmagem: "Corte final rápido. Apontar para câmera. Adicionar sticker de link ou flecha animada. Encerrar com energia alta.",
          },
            ];
}

function gerarLifestyle(ctx: GeracaoContext): CenaRoteiro[] {
      const hook = gerarHook(ctx);
      const cta = gerarCTA(ctx);
      const publico = ctx.cliente.guiaMarca.publicoAlvo || "pessoas que buscam qualidade";
      return [
          {
                    cena: 1,
                    fala: hook,
                    briefingFilmagem: "Ambiente externo ou doméstico cuidadoso (café da manhã, sala arrumada, jardim). Câmera em plano médio ou aberto. Luz natural preferida.",
          },
          {
                    cena: 2,
                    fala: `Faz parte da minha rotina agora. Como ${publico}, eu precisava de algo que se encaixasse no meu dia a dia.`,
                    briefingFilmagem: "Mostrar rotina: acordando, arrumando ambiente, tomando café. Produto integrado de forma natural ao cenário.",
          },
          {
                    cena: 3,
                    fala: `${ctx.produto.nome} é exatamente isso: ${ctx.produto.guia.descricao || "um produto que transforma sua rotina"}.`,
                    briefingFilmagem: "Plano detalhe do produto em uso. Mãos interagindo com o produto de forma suave. Câmera lenta (se possível).",
          },
          {
                    cena: 4,
                    fala: `O resultado é ${ctx.produto.guia.beneficios?.split(",")[0] || "visível"} — e as pessoas à minha volta notaram.`,
                    briefingFilmagem: "Expressão relaxada e satisfeita. Ambiente de bem-estar. Luz quente. Câmera afastada mostrando contexto completo.",
          },
          {
                    cena: 5,
                    fala: cta,
                    briefingFilmagem: "Segurar produto de forma natural (não forçada). Olhar para câmera com naturalidade. Encerrar no mesmo ambiente do início.",
          },
            ];
}

function gerarDemo(ctx: GeracaoContext): CenaRoteiro[] {
      const hook = gerarHook(ctx);
      const cta = gerarCTA(ctx);
      const beneficios = ctx.produto.guia.beneficios?.split(",") || ["resultado", "praticidade", "qualidade"];
      return [
          {
                    cena: 1,
                    fala: hook,
                    briefingFilmagem: "Abrir com produto visível. Fundo limpo (branco ou neutro). Câmera estável. Mostrar produto completo nos primeiros frames.",
          },
          {
                    cena: 2,
                    fala: `Vou te mostrar exatamente como o ${ctx.produto.nome} funciona — sem enrolação.`,
                    briefingFilmagem: "Câmera de cima (flat lay) ou plano médio. Mãos preparando o produto. Iluminação direta e clara.",
          },
          {
                    cena: 3,
                    fala: `Passo 1: ${beneficios[0]?.trim() || "Veja como usar"}.`,
                    briefingFilmagem: "Plano detalhe das mãos usando o produto. Câmera próxima. Movimento lento e deliberado para mostrar clareza.",
          },
          {
                    cena: 4,
                    fala: `E o resultado: ${beneficios[1]?.trim() || "incrível"}. Olha aqui.`,
                    briefingFilmagem: "Revelar o resultado do uso. Câmera se aproxima do resultado. Expressão de satisfação visível.",
          },
          {
                    cena: 5,
                    fala: `${ctx.produto.guia.diferenciais || "Simples assim. Nenhum outro produto entrega isso."}`,
                    briefingFilmagem: "Voltar ao rosto. Câmera média. Tom assertivo. Produto visível na mão ou ao fundo.",
          },
          {
                    cena: 6,
                    fala: cta,
                    briefingFilmagem: "Encerrar com produto em destaque. Texto na tela com oferta ou link. Smile genuíno.",
          },
            ];
}

function gerarUnboxing(ctx: GeracaoContext): CenaRoteiro[] {
      const hook = gerarHook(ctx);
      const cta = gerarCTA(ctx);
      return [
          {
                    cena: 1,
                    fala: hook,
                    briefingFilmagem: "Câmera de cima mostrando caixa fechada. Mãos na caixa. Iluminação bem distribuída. Câmera estável (tripé recomendado).",
          },
          {
                    cena: 2,
                    fala: `Acabou de chegar o ${ctx.produto.nome} — vou abrir aqui com vocês.`,
                    briefingFilmagem: "Começar a abrir a embalagem. Mostrar textura da caixa. Câmera levemente inclinada para mostrar profundidade.",
          },
          {
                    cena: 3,
                    fala: `Primeira impressão: ${ctx.produto.guia.descricao?.slice(0, 80) || "muito melhor do que esperava"}.`,
                    briefingFilmagem: "Retirar produto da embalagem em câmera lenta. Expressão de surpresa positiva. Revelar produto com cuidado.",
          },
          {
                    cena: 4,
                    fala: `O que me chamou atenção foi ${ctx.produto.guia.diferenciais?.split(",")[0]?.trim() || "a qualidade do acabamento"}.`,
                    briefingFilmagem: "Detalhe do produto: textura, cor, embalagem interna. Câmera se move pelo produto devagar.",
          },
          {
                    cena: 5,
                    fala: `E esse é o ponto principal: ${ctx.produto.guia.beneficios?.split(",")[0]?.trim() || "ele entrega o que promete"}.`,
                    briefingFilmagem: "Câmera volta ao rosto. Tom mais direto. Produto em mãos visível.",
          },
          {
                    cena: 6,
                    fala: cta,
                    briefingFilmagem: "Produto aberto em destaque na mesa. Câmera média no rosto. Encerrar com produto visível ao fundo.",
          },
            ];
}

function gerarLooks(ctx: GeracaoContext): CenaRoteiro[] {
      const hook = gerarHook(ctx);
      const cta = gerarCTA(ctx);
      const tom = ctx.cliente.guiaMarca.tomDeVoz || "descontraído";
      return [
          {
                    cena: 1,
                    fala: hook,
                    briefingFilmagem: "Plano americano (da cintura pra cima) ou corpo inteiro. Ambiente de moda: quarto estiloso, espelho, closet. Postura segura.",
          },
          {
                    cena: 2,
                    fala: `Esse é o tipo de item que transforma qualquer look. Deixa eu te mostrar.`,
                    briefingFilmagem: "Girar ou apresentar o produto/look de diferentes ângulos. Câmera se move ao redor. Ritmo dinâmico.",
          },
          {
                    cena: 3,
                    fala: `Com ${ctx.produto.nome}, o resultado é ${tom === "divertido" ? "incrível e cheio de personalidade" : "elegante e sofisticado"}.`,
                    briefingFilmagem: "Close no detalhe do produto em uso (mãos, rosto, acessório). Câmera suave. Luz quente.",
          },
          {
                    cena: 4,
                    fala: `${ctx.produto.guia.beneficios?.split(",")[0]?.trim() || "Faz toda a diferença"} — qualquer pessoa consegue usar.`,
                    briefingFilmagem: "Variações do look ou do produto. Cortes entre cada variação. Música dinâmica ao fundo (edição).",
          },
          {
                    cena: 5,
                    fala: cta,
                    briefingFilmagem: "Posição final confiante. Produto em destaque. Olhar direto para câmera. Encerrar com energia e sorriso.",
          },
            ];
}

// ─── Gerador principal ────────────────────────────────────────────────────────

export function gerarRoteiros(
      cliente: Cliente,
      produto: Produto,
      config: ConfiguracaoGeracao
    ): Omit<Roteiro, "id" | "geradoEm">[] {
      const quantidade = Math.min(Math.max(config.quantidade ?? 1, 1), 10);
      return Array.from({ length: quantidade }, (_, i) => {
              const ctx: GeracaoContext = { cliente, produto, config, variacao: i };
              const cenas = CENAS_POR_FORMATO[config.formato](ctx);
              const titulo = `Roteiro ${i + 1} — ${FOCO_LABELS[config.foco]} (${FORMATO_LABELS[config.formato]})`;
              return {
                        titulo,
                        clienteId: config.clienteId,
                        produtoId: config.produtoId,
                        icp: config.icp,
                        foco: config.foco,
                        formato: config.formato,
                        mensagemObrigatoria: config.mensagemObrigatoria,
                        hooks: [],
                        cenas,
              };
      });
}

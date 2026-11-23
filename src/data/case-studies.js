/*
 * Case studies: Problem → decisions → result, in English and Portuguese.
 *
 * Every fact here comes from the project's own repository (README,
 * .claude/memory/decisions.md, tests). Numbers are counted, not estimated:
 * re-count them when the project changes.
 */

export const caseStudies = {
  arriba: {
    en: {
      summary:
        "Support work kept hitting the same walls: a bank file rejected without saying where, a CSV that “looked fine”, a query nobody could safely try. Arriba turns each of those into a small tool that runs in the browser.",
      problem: [
        "In IT support, most tickets about files and integrations come down to a few questions: which field in this fixed-width bank file is wrong? Is this CSV malformed, or is its content wrong? What would this SQL return?",
        "The usual answers were manual: counting positions in a text editor, opening files in a spreadsheet that silently changes them, or asking someone with database access. Slow, error-prone, and some of those files carry personal data that should not be uploaded anywhere."
      ],
      decisions: [
        {
          title: "Everything runs in the browser",
          body: "Files are parsed client-side. Nothing is uploaded, so there is no server to secure, no data to leak and no hosting cost — the privacy argument and the cost argument point the same way."
        },
        {
          title: "No framework, no build step",
          body: "Plain HTML, CSS and ES modules. The tools are forms plus local processing; a framework would add a build to break and state to manage. The trade-off: no compiler, so `node --check` runs on every file in CI."
        },
        {
          title: "One engine for every bank",
          body: "The difference between banks is a table, not an algorithm. A generic fixed-width engine reads and generates files; each bank is a config file. The engine assumes no record length, so a 600-position layout reuses it too."
        },
        {
          title: "Two questions, two modules",
          body: "The CSV validator keeps “is the file well formed?” (a real RFC 4180 parser) apart from “is the content right?” (rules). Splitting on `;` would break any quoted address with a semicolon in it — a common case, not an edge case."
        },
        {
          title: "Measure contrast, don't eyeball it",
          body: "A script opens every page in both themes and measures the contrast of what is actually painted. It found what screenshots hid: the brand orange gave 4.27 as text on sand (needs 4.5), and fixed white on it failed in 23 buttons in dark mode. The fix was a palette rule: every accent has a fill colour and a separate text colour."
        }
      ],
      result: [
        "17 browser tools open to every visitor, across files, data, code, SQL and networking, live at arriba.jm.dev.br.",
        "159 automated tests for the parsers and engines, plus the contrast check, run on every pull request.",
        "16 architecture decisions written down as ADRs, each with the alternative that was rejected.",
        "A private Node.js API for the few features that need a server, behind HttpOnly cookie login — no secret in the public site."
      ],
      next: "Turn the most-used validators into a documented API, and move the AI chat for visitors to the server so the provider key never lives in a browser."
    },
    pt: {
      summary:
        "O suporte batia sempre nas mesmas paredes: arquivo bancário recusado sem dizer onde, CSV que “parecia certo”, consulta que ninguém podia testar com segurança. A Arriba transforma cada uma delas numa ferramenta pequena que roda no navegador.",
      problem: [
        "No suporte de TI, boa parte dos chamados sobre arquivos e integrações se resume a poucas perguntas: qual campo deste arquivo bancário de posição fixa está errado? Este CSV está mal formado ou é o conteúdo que está errado? O que esta consulta SQL devolveria?",
        "As respostas eram manuais: contar posições num editor de texto, abrir o arquivo numa planilha que o altera sem avisar, ou pedir para quem tem acesso ao banco. Lento, sujeito a erro — e alguns desses arquivos têm dado pessoal que não deveria ser enviado para lugar nenhum."
      ],
      decisions: [
        {
          title: "Tudo roda no navegador",
          body: "O arquivo é processado no próprio navegador. Nada é enviado, então não há servidor para proteger, dado para vazar nem custo de hospedagem — o argumento de privacidade e o de custo apontam para o mesmo lado."
        },
        {
          title: "Sem framework e sem build",
          body: "HTML, CSS e ES modules puros. As ferramentas são formulário mais processamento local; um framework traria um build para quebrar e estado para gerenciar. O preço: não há compilador, então `node --check` roda em todo arquivo no CI."
        },
        {
          title: "Um motor para todos os bancos",
          body: "A diferença entre bancos é tabela, não algoritmo. Um motor genérico de posição fixa lê e gera os arquivos; cada banco é um arquivo de configuração. O motor não assume o tamanho do registro, e por isso um layout de 600 posições também o reaproveita."
        },
        {
          title: "Duas perguntas, dois módulos",
          body: "O validador de CSV separa “o arquivo está bem formado?” (um parser RFC 4180 de verdade) de “o conteúdo está certo?” (as regras). Separar por `;` quebraria qualquer endereço entre aspas com ponto e vírgula — caso comum, não exceção."
        },
        {
          title: "Medir o contraste, não olhar",
          body: "Um script abre cada página nos dois temas e mede o contraste do que está de fato pintado. Ele achou o que a captura de tela escondia: o laranja da marca dava 4,27 como texto sobre a areia (o mínimo é 4,5), e o branco fixo em cima dele reprovava em 23 botões no tema escuro. A correção virou regra de paleta: todo acento tem uma cor de preenchimento e outra de texto."
        }
      ],
      result: [
        "17 ferramentas no navegador, abertas a qualquer visitante, de arquivos, dados, código, SQL e rede, no ar em arriba.jm.dev.br.",
        "159 testes automatizados dos parsers e motores, mais a conferência de contraste, rodando em todo pull request.",
        "16 decisões de arquitetura registradas como ADRs, cada uma com a alternativa que foi rejeitada.",
        "Uma API privada em Node.js para o pouco que precisa de servidor, com login por cookie HttpOnly — nenhum segredo no site público."
      ],
      next: "Transformar os validadores mais usados numa API documentada e levar o chat com IA dos visitantes para o servidor, para a chave do provedor nunca morar no navegador."
    }
  },

  "arriba-jump": {
    en: {
      summary:
        "A course challenge — make a character jump over pipes — that I kept building until it became my own game: original character, six São Paulo scenes, five playable colleagues and an ending on the beach.",
      problem: [
        "The starting point was a guided exercise: one sprite, one obstacle, one CSS animation. It taught the basics, but it was someone else's game, and it fell apart on small screens because of fixed widths and heights.",
        "The goal I set: a complete game I could hand to friends from work — no engine, no framework, playable on a phone — and a codebase I could keep extending without it turning into one giant file."
      ],
      decisions: [
        {
          title: "Canvas, not DOM animation",
          body: "Moving from CSS animations to a canvas game loop gave control over timing, collision and drawing order, and made the game behave the same at any screen size."
        },
        {
          title: "One module per responsibility",
          body: "About 3,000 lines of JavaScript split into 16 modules: input, physics, obstacles, collision, scenes, characters, leaderboard, audio, game loop. Adding a scene or an obstacle is one image plus one line in a list."
        },
        {
          title: "Tunable numbers live in one file",
          body: "Jump strength, speed, lives and the number of obstacles to win sit in `config.js`. Balancing the game is editing numbers, not hunting through logic."
        },
        {
          title: "No backend for the leaderboard",
          body: "The Hall of Fame is stored in the browser, with monthly, all-time and best-run rankings. To move it between computers, it exports and imports a plain text file — a real need solved without a server or accounts."
        },
        {
          title: "Lighter art, same look",
          body: "Artwork is converted from PNG to WebP by a small Python tool kept in the repo, so new art goes through the same step every time."
        }
      ],
      result: [
        "Live at arriba-jump.jm.dev.br, playable with keyboard, mouse or touch.",
        "Campaign and endless modes, optional rising difficulty, three lives with invulnerability frames.",
        "Five playable characters, each with its own animations and ending, plus a hidden unlock.",
        "Interface in Portuguese, English, Spanish and French; sound effects generated in code."
      ],
      next: "An online leaderboard behind the Arriba API, and automated tests for the collision and scoring rules."
    },
    pt: {
      summary:
        "Um desafio de curso — fazer um personagem pular canos — que continuei construindo até virar um jogo meu: personagem original, seis cenários de São Paulo, cinco colegas jogáveis e um final na praia.",
      problem: [
        "O ponto de partida foi um exercício guiado: um sprite, um obstáculo, uma animação em CSS. Ensinou o básico, mas era o jogo de outra pessoa — e quebrava em tela pequena por causa de largura e altura fixas.",
        "A meta que defini: um jogo completo para entregar aos colegas de trabalho — sem engine, sem framework, jogável no celular — e um código que eu pudesse continuar ampliando sem virar um arquivo gigante."
      ],
      decisions: [
        {
          title: "Canvas, não animação de DOM",
          body: "Trocar as animações de CSS por um laço de jogo em canvas deu controle sobre tempo, colisão e ordem de desenho, e fez o jogo se comportar igual em qualquer tamanho de tela."
        },
        {
          title: "Um módulo por responsabilidade",
          body: "Cerca de 3.000 linhas de JavaScript em 16 módulos: entrada, física, obstáculos, colisão, cenários, personagens, placar, áudio, laço do jogo. Acrescentar cenário ou obstáculo é uma imagem e uma linha numa lista."
        },
        {
          title: "Os números ajustáveis moram num arquivo só",
          body: "Força do pulo, velocidade, vidas e quantos obstáculos para vencer ficam em `config.js`. Equilibrar o jogo é mudar número, não caçar lógica."
        },
        {
          title: "Placar sem backend",
          body: "O Hall da Fama fica no navegador, com classificação do mês, de todos os tempos e de recordes. Para levar de um computador a outro, ele exporta e importa um arquivo de texto — uma necessidade real resolvida sem servidor nem conta."
        },
        {
          title: "Arte mais leve, mesma aparência",
          body: "As artes são convertidas de PNG para WebP por uma ferramenta pequena em Python que fica no repositório, para toda arte nova passar pelo mesmo passo."
        }
      ],
      result: [
        "No ar em arriba-jump.jm.dev.br, jogável com teclado, mouse ou toque.",
        "Modos Campanha e Infinito, dificuldade crescente opcional, três vidas com tempo de invulnerabilidade.",
        "Cinco personagens jogáveis, cada um com animações e final próprios, e um desbloqueio secreto.",
        "Interface em português, inglês, espanhol e francês; efeitos sonoros gerados por código."
      ],
      next: "Um placar online pela Arriba API e testes automatizados das regras de colisão e pontuação."
    }
  }
};

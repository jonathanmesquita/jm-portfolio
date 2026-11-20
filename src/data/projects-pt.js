/*
 * Portuguese (pt-BR) text for the catalog. English in projects.js is the
 * source; this file only translates. A missing key falls back to English,
 * so a new project shows up in both languages from day one.
 */

export const projectsPt = {
  arriba: {
    category: "Plataforma full-stack",
    description:
      "Uma plataforma de estudos com ferramentas técnicas que nasceram de problemas reais de suporte: validadores de arquivo, geradores de dados de teste, um sandbox de SQL com curso, um editor com preview ao vivo e um chat com IA. Tudo roda no navegador — nenhum arquivo sai da máquina.",
    highlights: [
      "Motor de arquivo bancário CNAB 400 para três bancos, com leitura, geração e conferência do trailer",
      "Parser de CSV RFC 4180 separado das regras de conteúdo",
      "API privada em Node.js com login por cookie HttpOnly",
      "Contraste WCAG conferido nos dois temas em todo pull request"
    ]
  },
  "arriba-jump": {
    category: "Jogo de navegador",
    description:
      "Um corredor em pixel art por seis cenários de São Paulo, da Avenida Paulista ao final na praia. Feito com HTML, CSS e JavaScript puros — sem engine, sem framework.",
    highlights: [
      "Cinco personagens jogáveis, cada um com animações e final próprios",
      "Modos Campanha e Infinito, com dificuldade crescente opcional",
      "Hall da Fama local, com exportação e importação do placar",
      "Interface em português, inglês, espanhol e francês"
    ]
  },
  "cnab-400": {
    title: "Validador CNAB 400",
    category: "Arriba · Arquivo bancário",
    description:
      "Lê e gera arquivos bancários de posição fixa (remessa e retorno) campo a campo, explicando cada posição — o formato que os bancos brasileiros usam na cobrança.",
    highlights: [
      "Motor genérico mais um arquivo de configuração por banco",
      "A conferência do trailer pega arquivo truncado ou editado à mão",
      "Campo sem confirmação fica marcado, nunca é estimado"
    ]
  },
  "csv-validator": {
    title: "Validador de CSV",
    category: "Arriba · Qualidade de dados",
    description:
      "Responde duas perguntas separadas sobre um CSV: o arquivo está bem formado? E o conteúdo está certo? Reconhece o layout e confere tipo, obrigatório, único e padrão.",
    highlights: [
      "Parser RFC 4180 de verdade — aspas, aspas escapadas, quebra de linha dentro do campo",
      "Layouts compartilhados com o gerador, então todo arquivo gerado passa"
    ]
  },
  "sql-playground": {
    category: "Arriba · SQL",
    description:
      "Escreva e rode SQL contra um banco de cobrança fictício, inteiro no navegador. Histórico e consultas salvas ficam na máquina de quem usa.",
    highlights: [
      "Motor AlaSQL semeado a partir de um único módulo",
      "Exporta o resultado em CSV"
    ]
  },
  "sql-course": {
    title: "Curso de SQL",
    category: "Arriba · Aprendizado",
    description:
      "Um curso prático de T-SQL sobre as mesmas tabelas de exemplo, com pontos, medalhas e progresso — sem conta, sem backend.",
    highlights: [
      "Motor de gamificação reaproveitável, por trilha",
      "Toda consulta das lições testada no motor do navegador"
    ]
  },
  "web-editor": {
    title: "Editor HTML, CSS e JS",
    category: "Arriba · Código",
    description:
      "Três abas, um preview ao vivo. O código de quem usa roda de verdade, dentro de um iframe isolado com origem opaca, e o console volta para a página por postMessage.",
    highlights: [
      "Sandbox sem allow-same-origin, de propósito",
      "Baixa o resultado como um único arquivo HTML"
    ]
  },
  "dns-checker": {
    title: "Conferir DNS e e-mail",
    category: "Arriba · Rede",
    description:
      "Confere se os registros de DNS que o provedor pediu estão publicados e analisa o e-mail do domínio (SPF, DKIM, DMARC, MX) — direto do navegador, por DNS sobre HTTPS.",
    highlights: [
      "Detecta enganos comuns, como o domínio repetido no nome do registro",
      "Resposta de terceiro escrita como texto, nunca como HTML"
    ]
  },
  "test-data": {
    title: "Gerador de dados de teste",
    category: "Arriba · QA",
    description:
      "Gera dados brasileiros fictícios — nomes, CPF e CNPJ com dígito válido, RG, telefone, CEP e endereço — prontos para copiar ou baixar.",
    highlights: [
      "Geradores num módulo sem DOM, com testes unitários",
      "Gera de novo a cada opção mudada, nunca mostra dado velho"
    ]
  },
  "focus-jm": {
    category: "Produtividade / Notion",
    description:
      "Um timer Pomodoro pequeno: 25 minutos de foco, 5 de pausa, alternando sozinho. Funciona no navegador e dentro do Notion como embed.",
    highlights: [
      "Conta o tempo pela hora final da fase, então aba em segundo plano e embed não atrasam",
      "Regras do timer num módulo sem DOM, com testes; nenhuma dependência"
    ]
  }
};

export const rowsPt = {
  top: "Destaques",
  "arriba-tools": "Por dentro da Arriba Platform",
  soon: "Desbloqueia em breve"
};

export const filtersPt = {
  all: "Todos",
  live: "No ar",
  tool: "Ferramentas",
  game: "Jogos",
  data: "Dados",
  building: "Em breve"
};

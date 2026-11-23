/*
 * English / Portuguese switch for the home page.
 *
 * The HTML is written in English and stays the source. Switching to
 * Portuguese walks the text nodes (and a few attributes) outside the catalog
 * and swaps each one whose whitespace-normalised text is in `PT` below.
 * The originals are kept, so switching back restores the exact markup.
 *
 * Consequence: changing an English sentence in index.html means changing its
 * key here too, or that sentence simply stays in English. The catalog
 * translates from src/data/projects-pt.js instead (it is rendered by JS).
 */

const STORAGE_KEY = "jm:lang";

export const LANGS = ["en", "pt"];

const PT = {
  "Skip to content": "Pular para o conteúdo",
  "JM. — Jonathan Mesquita — Home": "JM. — Jonathan Mesquita — Início",
  "Primary navigation": "Navegação principal",
  Work: "Projetos",
  About: "Sobre",
  Experience: "Experiência",
  Capabilities: "Competências",
  Contact: "Contato",
  "Software developer": "Desenvolvedor de software",
  "Open to opportunities": "Aberto a oportunidades",
  "Support taught me": "O suporte me ensinou",
  "where software breaks.": "onde o software quebra.",
  "Development is how I fix it.": "Desenvolvimento é como eu conserto.",
  "I build useful web products with JavaScript, Node.js, SQL and APIs, combining technical experience with practical problem solving.":
    "Construo produtos web úteis com JavaScript, Node.js, SQL e APIs, unindo experiência técnica e resolução prática de problemas.",
  "Selected work ↓": "Projetos ↓",
  "About me": "Sobre mim",
  "Selected Work": "Projetos",
  Catalog: "Catálogo",
  "Browse it like a streaming catalog: hover a title for a silent preview, open it for the story, the stack and the links.":
    "Navegue como num catálogo de streaming: passe o mouse num título para ver uma prévia sem som e abra para ver a história, a stack e os links.",
  "Support → Development": "Suporte → Desenvolvimento",
  "BEFORE I BUILT SOFTWARE, I SUPPORTED IT.": "ANTES DE CONSTRUIR SOFTWARE, EU DAVA SUPORTE A ELE.",
  "I learned technology from the side where things actually break.":
    "Aprendi tecnologia do lado em que as coisas de fato quebram.",
  "My background in IT support put me close to users, systems, integrations and real operational problems.":
    "Minha experiência em suporte de TI me deixou perto de usuários, sistemas, integrações e problemas reais de operação.",
  "That experience taught me to look beyond the interface, understand what is failing and focus on practical solutions.":
    "Essa experiência me ensinou a olhar além da interface, entender o que está falhando e focar em soluções práticas.",
  "Today I bring that perspective into software development, building web products with JavaScript, Node.js, SQL and APIs.":
    "Hoje levo essa perspectiva para o desenvolvimento de software, construindo produtos web com JavaScript, Node.js, SQL e APIs.",
  "Pixel art and game development are creative hobbies of mine.":
    "Pixel art e desenvolvimento de jogos são hobbies criativos meus.",
  "See the games on Play →": "Veja os jogos no Play →",
  Location: "Localização",
  "São Paulo — Brazil": "São Paulo — Brasil",
  Focus: "Foco",
  "Current path": "Caminho atual",
  "Support → Software Development": "Suporte → Desenvolvimento de software",
  Goal: "Objetivo",
  "Remote international development": "Desenvolvimento remoto internacional",
  "Work → Systems → Development": "Trabalho → Sistemas → Desenvolvimento",
  Current: "Atual",
  "IT Support Analyst": "Analista de Suporte de TI",
  "Technical support focused on ERP workflows, SQL, logs, APIs, integrations and financial operations, including CNAB 240/400 processes.":
    "Suporte técnico com foco em fluxos de ERP, SQL, logs, APIs, integrações e operações financeiras, incluindo processos CNAB 240/400.",
  "Technical Documentation": "Documentação técnica",
  "Hospitality Operations": "Operações de hotelaria",
  "Customer-facing operations that strengthened communication, problem solving and service ownership before my transition into technology.":
    "Atendimento direto ao cliente, que fortaleceu comunicação, resolução de problemas e responsabilidade pelo serviço antes da minha transição para a tecnologia.",
  "Customer Experience": "Experiência do cliente",
  "Early professional experience working directly with people, operations and high-volume service environments.":
    "Primeira experiência profissional, trabalhando diretamente com pessoas, operações e ambientes de atendimento de alto volume.",
  Operations: "Operações",
  "Build → Integrate → Ship": "Construir → Integrar → Entregar",
  "PRACTICAL STACK": "STACK NA PRÁTICA",
  "Tools matter when they help turn real problems into working software.":
    "Ferramenta importa quando ajuda a transformar problema real em software funcionando.",
  "Let's build something useful": "Vamos construir algo útil",
  "OPEN TO OPPORTUNITIES": "ABERTO A OPORTUNIDADES",
  "Have a problem worth solving?": "Tem um problema que vale resolver?",
  "I'm interested in software development opportunities, especially remote teams where I can combine technical problem solving, product thinking and real operational experience.":
    "Tenho interesse em oportunidades de desenvolvimento de software, especialmente em times remotos onde eu possa unir resolução técnica de problemas, visão de produto e experiência real de operação.",
  "Professional profile ↗": "Perfil profissional ↗",
  "Code & projects ↗": "Código e projetos ↗",
  "Featured project ↗": "Projeto em destaque ↗",
  "Available for remote opportunities": "Disponível para vagas remotas",
  "Back to top": "Voltar ao topo",

  /* Capabilities (rendered from src/data/capabilities.js) */
  Interface: "Interface",
  "Responsive and accessible interfaces built with semantic HTML, modern CSS and JavaScript.":
    "Interfaces responsivas e acessíveis com HTML semântico, CSS moderno e JavaScript.",
  "Responsive Design": "Design responsivo",
  Accessibility: "Acessibilidade",
  Integration: "Integração",
  "Server-side logic and integrations focused on practical workflows, APIs and external services.":
    "Lógica no servidor e integrações voltadas a fluxos práticos, APIs e serviços externos.",
  Integrations: "Integrações",
  "Data & Systems": "Dados e sistemas",
  "Experience investigating systems through data, logs, financial workflows and operational rules.":
    "Experiência investigando sistemas por dados, logs, fluxos financeiros e regras de operação.",
  Delivery: "Entrega",
  Infrastructure: "Infraestrutura",
  "From local development to version control, deployment, domains and production environments.":
    "Do desenvolvimento local ao controle de versão, deploy, domínios e ambientes de produção.",
  "Applied in": "Aplicado em",
  "jm.dev.br ecosystem": "ecossistema jm.dev.br"
};

/* Catalog chrome (labels built in catalog.js). */
export const UI = {
  en: {
    featured: "Featured project",
    openLive: "Open live",
    moreInfo: "More info & preview",
    viewCode: "View code",
    caseStudy: "Read the case study",
    projectPage: "Project page",
    copyLink: "Copy link",
    copied: "Link copied",
    close: "Close details",
    moreLikeThis: "More like this",
    stack: "Stack",
    status: "Status",
    titles: "titles",
    toolsInCatalog: (n) => `${n} tools in this catalog`,
    scrollBack: (row) => `Scroll ${row} back`,
    scrollForward: (row) => `Scroll ${row} forward`,
    newTab: " (opens in a new tab)",
    preview: (title) => `Silent preview of ${title}`,
    filterLabel: "Filter projects",
    showingAll: (n) => `Showing all ${n} titles in rows.`,
    filtered: (label, n) => `${label}: ${n} titles.`,
    unlocksSoon: "Unlocks soon",
    lockedNote: "Still in the workshop. This title unlocks as soon as it ships.",
    lockedStatus: "Locked · in development",
    status_live: "Live",
    status_building: "Locked",
    status_archive: "Archive",
    switchTo: "Português",
    switchLabel: "Ver em português"
  },
  pt: {
    featured: "Projeto em destaque",
    openLive: "Abrir no ar",
    moreInfo: "Mais informações e prévia",
    viewCode: "Ver código",
    caseStudy: "Ler o estudo de caso",
    projectPage: "Página do projeto",
    copyLink: "Copiar link",
    copied: "Link copiado",
    close: "Fechar detalhes",
    moreLikeThis: "Títulos parecidos",
    stack: "Stack",
    status: "Situação",
    titles: "títulos",
    toolsInCatalog: (n) => `${n} ferramentas neste catálogo`,
    scrollBack: (row) => `Voltar a fileira ${row}`,
    scrollForward: (row) => `Avançar a fileira ${row}`,
    newTab: " (abre em nova aba)",
    preview: (title) => `Prévia sem som de ${title}`,
    filterLabel: "Filtrar projetos",
    showingAll: (n) => `Mostrando todos os ${n} títulos em fileiras.`,
    filtered: (label, n) => `${label}: ${n} títulos.`,
    unlocksSoon: "Em breve",
    lockedNote: "Ainda na oficina. Este título desbloqueia assim que for lançado.",
    lockedStatus: "Bloqueado · em desenvolvimento",
    status_live: "No ar",
    status_building: "Bloqueado",
    status_archive: "Arquivo",
    switchTo: "English",
    switchLabel: "View in English"
  }
};

export function storedLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch {
    /* storage blocked: fall through to the browser language */
  }
  return null;
}

/* First visit: Portuguese for Portuguese browsers, English for everyone else. */
export function initialLang() {
  return storedLang() || (/^pt\b/i.test(navigator.language || "") ? "pt" : "en");
}

export function rememberLang(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* convenience only */
  }
}

const originals = new WeakMap();
const originalAttributes = new WeakMap();
const TRANSLATED_ATTRIBUTES = ["aria-label", "title"];

function normalise(text) {
  return text.replace(/\s+/g, " ").trim();
}

/* Translate (or restore) every text node and attribute under `root`,
   skipping subtrees marked with data-i18n-skip (the catalog). */
export function translatePage(root, lang) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.hasAttribute("data-i18n-skip") || node.tagName === "SCRIPT" || node.tagName === "NOSCRIPT") {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  for (let node = walker.currentNode; node; node = walker.nextNode()) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!originals.has(node)) originals.set(node, node.nodeValue);
      const original = originals.get(node);
      const translated = PT[normalise(original)];

      if (lang === "pt" && translated) {
        /* Keep the surrounding whitespace so inline spacing doesn't change. */
        const lead = original.match(/^\s*/)[0];
        const trail = original.match(/\s*$/)[0];
        node.nodeValue = `${lead}${translated}${trail}`;
      } else {
        node.nodeValue = original;
      }
      continue;
    }

    for (const attribute of TRANSLATED_ATTRIBUTES) {
      if (!node.hasAttribute(attribute)) continue;
      if (!originalAttributes.has(node)) originalAttributes.set(node, {});
      const saved = originalAttributes.get(node);
      if (!(attribute in saved)) saved[attribute] = node.getAttribute(attribute);
      const original = saved[attribute];
      node.setAttribute(attribute, lang === "pt" ? PT[normalise(original)] || original : original);
    }
  }
}

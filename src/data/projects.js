/*
 * Project catalog — single source for the "Selected Work" section.
 *
 * Every project is declared once in `projects`; rows only reference slugs.
 * Media lives in /public/catalog/<slug>.webp (poster, 640×360) and
 * /public/catalog/<slug>.mp4 (muted preview, ~7 s). How to record new media:
 * docs/catalog-media.md.
 *
 * status: "live" | "building" | "archive"
 *   "building" renders the title locked: blurred poster, padlock, no preview,
 *   no links. Switching it to "live" unlocks it — nothing else to change.
 * genres: used by the filter chips — "web", "tool", "game", "data"
 */

const GITHUB = "https://github.com/jonathanmesquita";
const ARRIBA = "https://arriba.jm.dev.br";

export const projects = [
  {
    slug: "arriba",
    title: "Arriba Platform",
    category: "Full-stack platform",
    year: "2025 — 2026",
    status: "live",
    genres: ["web", "tool"],
    description:
      "A study platform of technical tools born from real support problems: file validators, test-data generators, a SQL sandbox with a course, a live-preview editor and an AI chat. Every tool runs in the browser — no file leaves the machine.",
    highlights: [
      "CNAB 400 bank-file engine for three banks, with reader, generator and trailer check",
      "RFC 4180 CSV parser kept separate from the content rules",
      "Private Node.js API behind HttpOnly cookie login",
      "Both themes checked for WCAG contrast on every pull request"
    ],
    stack: ["JavaScript", "Node.js", "Express", "SQL", "Bootstrap"],
    links: { live: ARRIBA, code: `${GITHUB}/arriba_platform` },
    media: { poster: "arriba", video: "arriba", billboard: "arriba-billboard" }
  },
  {
    slug: "arriba-jump",
    title: "Arriba Jump",
    category: "Browser game",
    year: "2026",
    status: "live",
    genres: ["game", "web"],
    description:
      "A pixel-art runner across six São Paulo scenes, from Avenida Paulista to the beach ending. Built with plain HTML, CSS and JavaScript — no engine, no framework.",
    highlights: [
      "Five playable characters, each with its own animations and ending",
      "Campaign and endless modes with optional rising difficulty",
      "Local Hall of Fame with export and import of the leaderboard",
      "Interface in Portuguese, English, Spanish and French"
    ],
    stack: ["JavaScript", "Canvas", "HTML", "CSS"],
    links: { live: "https://arriba-jump.jm.dev.br", code: `${GITHUB}/arriba-jump` },
    media: { poster: "arriba-jump", video: "arriba-jump" }
  },
  {
    slug: "nexus",
    title: "Project Nexus 2027",
    category: "Interactive story",
    year: "2026",
    status: "building",
    genres: ["game", "web"],
    description:
      "An autobiographical gamebook as a web app: a time-loop story told through system logs, collectible files and branching choices.",
    highlights: [
      "Branching narrative engine driven by data nodes",
      "Inventory, status monitor and file system as story devices",
      "Typed with TypeScript, bundled with Vite"
    ],
    stack: ["React", "TypeScript", "Vite"],
    links: { live: null, code: `${GITHUB}/nexus2027` },
    media: { poster: "nexus", video: "nexus" }
  },
  {
    slug: "cnab-400",
    title: "CNAB 400 Validator",
    category: "Arriba · Bank files",
    year: "2026",
    status: "live",
    genres: ["tool"],
    description:
      "Reads and generates fixed-width bank files (remittance and return) field by field, explaining each position — the format Brazilian banks use for billing.",
    highlights: [
      "Generic engine plus one config file per bank",
      "Trailer check catches truncated or hand-edited files",
      "Unconfirmed fields are flagged, never guessed"
    ],
    stack: ["JavaScript", "ES Modules"],
    links: { live: `${ARRIBA}/tools/cobranca/cnab400/cnab400.html`, code: `${GITHUB}/arriba_platform` },
    media: { poster: "cnab-400", video: "cnab-400" }
  },
  {
    slug: "csv-validator",
    title: "CSV Validator",
    category: "Arriba · Data quality",
    year: "2026",
    status: "live",
    genres: ["tool", "data"],
    description:
      "Answers two separate questions about a CSV file: is it well formed, and is the content right? Detects the layout, then checks types, required fields, uniqueness and patterns.",
    highlights: [
      "Real RFC 4180 parsing — quotes, escaped quotes, line breaks inside fields",
      "Layouts shared with the CSV generator, so generated files always pass"
    ],
    stack: ["JavaScript", "RFC 4180"],
    links: { live: `${ARRIBA}/tools/dados/csv-validator/csv-validator.html`, code: `${GITHUB}/arriba_platform` },
    media: { poster: "csv-validator", video: "csv-validator" }
  },
  {
    slug: "sql-playground",
    title: "SQL Playground",
    category: "Arriba · SQL",
    year: "2026",
    status: "live",
    genres: ["tool", "data"],
    description:
      "Write and run SQL against a fictional billing database, entirely in the browser. Query history and saved queries stay on the visitor's machine.",
    highlights: [
      "AlaSQL engine seeded from a single source module",
      "Export results to CSV"
    ],
    stack: ["SQL", "AlaSQL", "JavaScript"],
    links: { live: `${ARRIBA}/tools/cobranca/sql-playground/sql-playground.html`, code: `${GITHUB}/arriba_platform` },
    media: { poster: "sql-playground", video: "sql-playground" }
  },
  {
    slug: "sql-course",
    title: "SQL Course",
    category: "Arriba · Learning",
    year: "2026",
    status: "live",
    genres: ["tool", "data"],
    description:
      "A hands-on T-SQL course over the same sample tables, with points, badges and progress tracking — no account, no backend.",
    highlights: [
      "Reusable gamification engine keyed by track",
      "Every lesson query tested against the in-browser engine"
    ],
    stack: ["SQL", "JavaScript", "localStorage"],
    links: { live: `${ARRIBA}/tools/cobranca/treinamento-sql/treinamento-sql.html`, code: `${GITHUB}/arriba_platform` },
    media: { poster: "sql-course", video: "sql-course" }
  },
  {
    slug: "web-editor",
    title: "HTML, CSS & JS Editor",
    category: "Arriba · Code",
    year: "2026",
    status: "live",
    genres: ["tool", "web"],
    description:
      "Three tabs, one live preview. User code really runs, inside a sandboxed iframe with an opaque origin, and its console is bridged back through postMessage.",
    highlights: [
      "Sandbox without allow-same-origin, on purpose",
      "Download the result as a single HTML file"
    ],
    stack: ["JavaScript", "iframe sandbox", "postMessage"],
    links: { live: `${ARRIBA}/tools/dados/editor-web/editor-web.html`, code: `${GITHUB}/arriba_platform` },
    media: { poster: "web-editor", video: "web-editor" }
  },
  {
    slug: "dns-checker",
    title: "DNS & E-mail Checker",
    category: "Arriba · Network",
    year: "2026",
    status: "live",
    genres: ["tool"],
    description:
      "Checks whether the DNS records a provider asked for are published, and audits a domain's e-mail setup (SPF, DKIM, DMARC, MX) — straight from the browser via DNS over HTTPS.",
    highlights: [
      "Detects common mistakes, like the domain repeated in the record name",
      "Third-party responses rendered as text, never as HTML"
    ],
    stack: ["JavaScript", "DNS over HTTPS"],
    links: { live: `${ARRIBA}/tools/rede/dns/dns.html`, code: `${GITHUB}/arriba_platform` },
    media: { poster: "dns-checker", video: "dns-checker" }
  },
  {
    slug: "test-data",
    title: "Test Data Generator",
    category: "Arriba · QA",
    year: "2026",
    status: "live",
    genres: ["tool", "data"],
    description:
      "Generates fictional Brazilian test data — names, CPF and CNPJ with valid check digits, ID numbers, phones, postcodes and addresses — ready to copy or download.",
    highlights: [
      "Generators in a DOM-free module with unit tests",
      "Regenerates as options change, never shows stale data"
    ],
    stack: ["JavaScript", "Node test runner"],
    links: { live: `${ARRIBA}/tools/cobranca/massa-dados/massa-dados.html`, code: `${GITHUB}/arriba_platform` },
    media: { poster: "test-data", video: "test-data" }
  },
  {
    slug: "store-analysis",
    title: "Store Performance Analysis",
    category: "Data analysis",
    year: "2025",
    status: "archive",
    genres: ["data"],
    description:
      "Compares four stores of a retail chain by revenue, category, customer rating and shipping cost to recommend which one to sell.",
    highlights: ["Exploratory analysis in a Jupyter notebook", "Charts with Matplotlib"],
    stack: ["Python", "Pandas", "Matplotlib", "Jupyter"],
    links: { live: null, code: `${GITHUB}/Challenge--Alura-Store` },
    media: { poster: "store-analysis", video: "store-analysis" }
  },
  {
    slug: "churn-analysis",
    title: "Customer Churn Analysis",
    category: "Data analysis",
    year: "2025",
    status: "archive",
    genres: ["data"],
    description:
      "Investigates why telecom customers cancel, crossing contract, demographic and billing data to find churn patterns.",
    highlights: ["Data cleaning and feature inspection", "Distribution analysis with Seaborn"],
    stack: ["Python", "Pandas", "Seaborn", "Jupyter"],
    links: { live: null, code: `${GITHUB}/Challenge-Alura-TelecomXBR` },
    media: { poster: "churn-analysis", video: "churn-analysis" }
  },
  {
    slug: "base64",
    title: "Base64 Decoder",
    category: "Small tool",
    year: "2025",
    status: "live",
    genres: ["tool"],
    description: "Decodes Base64 strings locally in the browser, with no server involved.",
    highlights: [],
    stack: ["JavaScript", "HTML", "CSS"],
    links: { live: "https://jonathanmesquita.github.io/DecodificacaoBase64/", code: `${GITHUB}/DecodificacaoBase64` },
    media: { poster: "base64", video: "base64" }
  },
  {
    slug: "case-converter",
    title: "Case Converter",
    category: "Small tool",
    year: "2025",
    status: "archive",
    genres: ["tool"],
    description: "Converts text to upper case, lower case or sentence case in one click.",
    highlights: [],
    stack: ["JavaScript", "HTML", "CSS"],
    links: { live: null, code: `${GITHUB}/convertor-maiusculas-minusculas` },
    media: { poster: "case-converter", video: "case-converter" }
  },
  {
    slug: "secret-friend",
    title: "Secret Friend Draw",
    category: "Course challenge",
    year: "2025",
    status: "live",
    genres: ["game", "web"],
    description: "Add friends, draw a name. A JavaScript logic challenge from the Oracle Next Education program.",
    highlights: [],
    stack: ["JavaScript", "HTML", "CSS"],
    links: {
      live: "https://jonathanmesquita.github.io/challenge-amigo-secreto/",
      code: `${GITHUB}/challenge-amigo-secreto`
    },
    media: { poster: "secret-friend", video: "secret-friend" }
  },
  {
    slug: "profile-card",
    title: "3D Profile Card",
    category: "CSS study",
    year: "2024",
    status: "live",
    genres: ["web"],
    description: "A personal card with a tilt effect that follows the cursor — an early study in CSS layout and motion.",
    highlights: [],
    stack: ["CSS", "JavaScript", "Vanilla Tilt"],
    links: { live: "https://jonathanmesquita.github.io/cartao_mesquita/", code: `${GITHUB}/cartao_mesquita` },
    media: { poster: "profile-card", video: "profile-card" }
  },
  {
    slug: "focus-jm",
    title: "Focus JM",
    category: "Productivity / Notion",
    year: "2026",
    status: "building",
    genres: ["web"],
    description: "A distraction-free Pomodoro study timer connected to my Notion workflow.",
    highlights: [],
    stack: ["JavaScript", "Node.js", "Notion API"],
    links: { live: null, code: null },
    media: null
  }
];

export const featuredSlug = "arriba";

/* `ranked: true` shows Top-10 style numerals next to the posters. */
export const catalogRows = [
  {
    id: "top",
    title: "Top picks",
    ranked: true,
    items: ["arriba", "arriba-jump", "cnab-400", "sql-playground", "nexus"]
  },
  {
    id: "arriba-tools",
    title: "Inside Arriba Platform",
    items: ["cnab-400", "csv-validator", "sql-playground", "sql-course", "web-editor", "dns-checker", "test-data"]
  },
  {
    id: "games",
    title: "Games & interactive stories",
    items: ["arriba-jump", "nexus", "secret-friend"]
  },
  {
    id: "data",
    title: "Data analysis with Python",
    items: ["store-analysis", "churn-analysis", "sql-course"]
  },
  {
    id: "origins",
    title: "Where it started",
    items: ["base64", "case-converter", "secret-friend", "profile-card"]
  },
  {
    id: "soon",
    title: "Unlocking soon",
    items: ["focus-jm", "nexus"]
  }
];

export const genreFilters = [
  { id: "all", label: "All" },
  { id: "live", label: "Live now" },
  { id: "tool", label: "Tools" },
  { id: "game", label: "Games" },
  { id: "data", label: "Data" },
  { id: "building", label: "Unlocks soon" }
];

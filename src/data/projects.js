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
      "CNAB 400 bank-file engine for five bank layouts, plus CNAB 240 for two, with reader, generator and trailer check",
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
    slug: "focus-jm",
    title: "Focus JM",
    category: "Productivity / Notion",
    year: "2026",
    status: "live",
    genres: ["web", "tool"],
    description:
      "A small Pomodoro timer: 25 minutes of focus, 5 of break, switching on its own. Runs in the browser and inside Notion as an embed.",
    highlights: [
      "Keeps time from the phase's end time, so background tabs and embeds stay accurate",
      "Timer rules in a DOM-free module with tests; no dependencies"
    ],
    stack: ["HTML", "CSS", "JavaScript", "localStorage"],
    links: { live: "https://focus.jm.dev.br", code: `${GITHUB}/focus-jm` },
    media: { poster: "focus-jm", video: "focus-jm" }
  },
  {
    slug: "nutri-jm",
    title: "Nutri JM",
    category: "Health / PWA",
    year: "2026",
    status: "building",
    genres: ["web", "tool"],
    description:
      "A nutrition planner that works offline: daily energy needs, a calorie target and macro goals from your own profile, with meals, a food database from the Brazilian TACO table, body measurements, a shopping list and JSON backup. No login — data stays on the device.",
    highlights: [
      "Formulas in a DOM-free module with tests; never invents a nutritional value",
      "Installable PWA with a strict Content Security Policy and no dependencies"
    ],
    stack: ["HTML", "CSS", "JavaScript", "PWA", "localStorage"],
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
    items: ["arriba", "arriba-jump", "cnab-400", "sql-playground"]
  },
  {
    id: "arriba-tools",
    title: "Inside Arriba Platform",
    items: ["cnab-400", "csv-validator", "sql-playground", "sql-course", "web-editor", "dns-checker", "test-data"]
  },
  {
    id: "more",
    title: "More projects",
    items: ["nutri-jm", "focus-jm", "arriba-jump"]
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

# 💼 jm.dev.br — Portfolio

Professional developer portfolio for **Jonathan Mesquita**, focused on software development, technical experience and practical projects.

Current version: **v1.1.0**

Last update: **2026.11.18**

## Objective

Centralize my professional presence at `jm.dev.br` and organize independent projects through subdomains, keeping each application isolated and independently deployable.

## Current sections

- Hero
- Selected Work
- About
- Experience
- Capabilities
- Contact

## Selected work — the catalog

Projects are presented like a streaming catalog:

- **Billboard** with the featured project (Arriba Platform).
- **Genre filters** — All, Live now, Tools, Games, Data, In progress.
- **Rows** that scroll sideways: Top picks, Inside Arriba Platform, Games & interactive
  stories, Data analysis with Python, Where it started, Coming soon.
- **Title cards** that play a silent preview on hover or keyboard focus.
- **Details dialog** with a looping preview, highlights, stack, live and code links, and
  "More like this". Every title has a shareable link: `jm.dev.br/#work/<slug>`.

17 titles, declared once in `src/data/projects.js`. Posters and previews are recorded from the
real projects — see [docs/catalog-media.md](docs/catalog-media.md). Videos load only when a
preview starts, and nothing autoplays with reduced motion or Save-Data.

Highlights:

| Title | What it is | Link |
|---|---|---|
| Arriba Platform | Browser-based technical tools: CNAB 400, CSV, SQL sandbox, editor, AI chat | `arriba.jm.dev.br` |
| Arriba Jump | Pixel-art runner across São Paulo, plain JavaScript | `arriba-jump.jm.dev.br` |
| Project Nexus 2027 | Interactive autobiographical gamebook (React + TypeScript) | in development |
| Data analysis | Retail and churn studies in Python / Pandas | GitHub |
| Focus JM | Pomodoro timer connected to Notion | in development |

## Capabilities

### Front-end

- HTML
- CSS
- JavaScript
- Responsive Design
- Accessibility
- Vite

### Back-end & APIs

- Node.js
- Express
- REST APIs
- JSON
- Web Services
- Integrations

### Data & Systems

- SQL
- PostgreSQL
- T-SQL
- ERP
- CNAB 240/400
- Logs

### Delivery

- Git
- GitHub
- Vercel
- Render
- Cloudflare
- DNS

## Professional links

- GitHub — `github.com/jonathanmesquita`
- LinkedIn — `linkedin.com/in/jonathanmesquita`
- Featured project — `arriba.jm.dev.br`

## Contact

Email:

`jonathan-mesquita@live.com`

Location:

São Paulo — Brazil

Available for remote software development opportunities.

## SEO and accessibility

The portfolio currently includes:

- semantic HTML;
- descriptive page title;
- meta description;
- canonical URL;
- Open Graph metadata;
- Twitter social metadata;
- Schema.org structured data;
- keyboard focus styles;
- skip-to-content navigation;
- reduced-motion support (no video autoplay);
- details dialog on native `<dialog>` with focus return;
- responsive layouts;
- semantic section structure.

## Visual direction

Minimal **Tech Boho** design system combining warm organic colors with restrained technical elements.

Core principles:

- clarity before decoration;
- strong typography;
- generous whitespace;
- subtle interaction;
- responsive design;
- accessibility;
- projects and evidence before tool lists.

## Stack

- Semantic HTML
- Modern CSS
- JavaScript ES Modules
- Vite
- Self-hosted fonts via Fontsource (Inter, Manrope, IBM Plex Mono)

## Project structure

```text
jm-portfolio/
├── docs/
│   └── catalog-media.md      # how posters and previews are recorded
├── public/
│   └── catalog/              # <slug>.webp posters + <slug>.mp4 previews
├── scripts/
│   └── catalog/              # capture.mjs (Playwright) + encode.sh (ffmpeg)
├── src/
│   ├── data/
│   │   ├── capabilities.js
│   │   └── projects.js       # catalog: titles, rows and filters
│   ├── styles/
│   │   ├── base.css
│   │   ├── catalog.css
│   │   ├── components.css
│   │   └── tokens.css
│   ├── catalog.js
│   └── main.js
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

## Version history

- `v0.1.0` — Foundation / Hero
- `v0.2.0` — Selected Work
- `v0.3.0` — About
- `v0.4.0` — Experience
- `v0.5.0` — Capabilities
- `v0.6.0` — Contact
- `v0.7.0` — SEO and accessibility baseline
- `v0.8.0` — QA, contrast fixes, favicon, social preview, robots and sitemap
- `v0.9.0` — Vercel deployment, Git integration and production preparation
- `v1.0.0` — Production release at `jm.dev.br`
- `v1.1.0` — Streaming-style project catalog with video previews, self-hosted fonts

## Roadmap

Post-v1 improvements will focus on stronger case studies, production-ready projects and measured improvements to the portfolio experience.

A dedicated Lab section is intentionally postponed until there are experiments strong enough to support the professional portfolio.

## Status

🟢 Live in production — **v1.0.0** · **v1.1.0** ready on branch

Local production build passed. Lighthouse mobile: Performance 95, Accessibility 100, Best Practices 100, SEO 100. axe reported zero violations on mobile and desktop; npm audit reported zero vulnerabilities.

See [QA report](docs/QA-v0.8.0.md) for evidence, limitations and preview checks.

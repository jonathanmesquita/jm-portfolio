# 💼 jm.dev.br — Portfolio

Professional developer portfolio for **Jonathan Mesquita**, focused on software development, technical experience and practical projects.

Current version: **v1.2.0**

Last update: **2026.11.19**

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
- **Genre filters** — All, Live now, Tools, Games, Data, Unlocks soon.
- **Rows** that scroll sideways: Top picks, Inside Arriba Platform, Data analysis with Python,
  Unlocking soon.
- **Title cards** that play a silent preview on hover or keyboard focus.
- **Locked titles** — projects still being built (today, Focus JM) show a blurred
  poster with a padlock and "Unlocks soon": no preview, no links. Changing `status` from
  `"building"` to `"live"` in `src/data/projects.js` unlocks them.
- **Details dialog** with a looping preview, highlights, stack, live and code links, and
  "More like this". Every title has a shareable link: `jm.dev.br/#work/<slug>`.

12 titles, declared once in `src/data/projects.js`. Posters and previews are recorded from the
real projects — see [docs/catalog-media.md](docs/catalog-media.md). Videos load only when a
preview starts, and nothing autoplays with reduced motion or Save-Data.

Highlights:

| Title | What it is | Link |
|---|---|---|
| Arriba Platform | Browser-based technical tools: CNAB 400, CSV, SQL sandbox, editor, AI chat | `arriba.jm.dev.br` |
| Arriba Jump | Pixel-art runner across São Paulo, plain JavaScript | `arriba-jump.jm.dev.br` |
| Data analysis | Retail and churn studies in Python / Pandas | GitHub |
| Focus JM | Pomodoro timer connected to Notion | 🔒 unlocks soon |

## Project pages and case studies

Every title also has its own static page, generated at build time from the same data
(`scripts/pages`, a Vite plugin):

- `jm.dev.br/work/<slug>/` in English and `jm.dev.br/pt/work/<slug>/` in Portuguese;
- its own 1200×630 social image (`public/og`, `npm run og`), canonical and hreflang, so a
  link shared on LinkedIn shows that project;
- for Arriba Platform and Arriba Jump, a case study — problem, key decisions, result,
  what's next — in `src/data/case-studies.js`, with facts counted from each repository.

## Languages

EN/PT switch in the header. Portuguese browsers start in Portuguese and the choice is
remembered. The HTML stays in English; `src/i18n.js` translates it by text lookup, and the
catalog uses `src/data/projects-pt.js` (anything untranslated falls back to English).

## Analytics

Vercel Web Analytics (cookieless). Page views need **Analytics** enabled in the Vercel
project. Named events — Open title, Filter, Outbound, Language, Copy link — are recorded only
on plans that include custom events; otherwise they are a no-op. See `src/analytics.js`.

## Tests and CI

```bash
npm test            # build + end-to-end checks with Chromium and axe
```

`.github/workflows/ci.yml` runs `node --check`, the tests and `npm audit` on every pull
request. `.github/workflows/catalog-media.yml` re-records the previews of projects whose
repository changed, every Monday, and opens a pull request — see
[docs/catalog-media.md](docs/catalog-media.md).

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
├── .github/workflows/        # ci.yml (tests on every PR), catalog-media.yml (weekly media refresh)
├── docs/                     # catalog-media.md, design-system.md, QA reports
├── public/
│   ├── catalog/              # <slug>.webp posters, <slug>.mp4 previews, sources.lock.json
│   └── og/                   # 1200×630 social images, en and pt/
├── scripts/
│   ├── catalog/              # update.mjs + capture.mjs + titles.json (media pipeline)
│   ├── og/                   # render-og.mjs (social images)
│   └── pages/                # Vite plugin: /work/<slug>/ pages and sitemap.xml
├── src/
│   ├── data/
│   │   ├── capabilities.js
│   │   ├── case-studies.js   # Problem → decisions → result, en + pt
│   │   ├── projects.js       # catalog: titles, rows and filters (source)
│   │   └── projects-pt.js    # Portuguese text for the catalog
│   ├── styles/               # tokens, base, components, catalog, case
│   ├── analytics.js
│   ├── catalog.js
│   ├── i18n.js
│   ├── main.js               # home page
│   ├── project-text.js       # language helpers shared with the page generator
│   └── work-page.js          # project pages
├── tests/site.test.mjs       # end-to-end checks (Playwright + axe)
├── index.html
├── vite.config.js
└── package.json
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
- `v1.2.0` — Case studies, project pages with social images, Portuguese version, analytics,
  end-to-end tests in CI, automatic media refresh, CSV Reader

## Roadmap

Post-v1 improvements will focus on stronger case studies, production-ready projects and measured improvements to the portfolio experience.

A dedicated Lab section is intentionally postponed until there are experiments strong enough to support the professional portfolio.

## Status

🟢 Live in production — **v1.2.0**

Local production build passed. Lighthouse mobile: Performance 95, Accessibility 100, Best Practices 100, SEO 100. axe reported zero violations on mobile and desktop; npm audit reported zero vulnerabilities.

See the QA reports: [v1.2.0](docs/QA-v1.2.0.md), [v1.1.0](docs/QA-v1.1.0.md), [v0.8.0](docs/QA-v0.8.0.md) for evidence, limitations and preview checks.

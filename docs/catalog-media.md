# Catalog media

The "Selected Work" catalog shows, for every title, a **poster** and a **silent preview**:

| File | Format | Size |
|---|---|---|
| `public/catalog/<slug>.webp` | WebP, 640×360 | 2–35 KB |
| `public/catalog/<slug>.mp4` | H.264, 640×360, 24 fps, no audio, `faststart` | 15–360 KB |

Videos are never downloaded with the page: a card sets `src` only when its preview starts
(hover after 450 ms, or keyboard focus). With `prefers-reduced-motion` or Save-Data on, nothing
autoplays — the details dialog shows the video with controls instead.

## Where each piece comes from

Everything is recorded from the projects themselves; nothing is a mock-up.

- **Web projects** — `scripts/catalog/capture.mjs` opens each project in Chromium (Playwright),
  performs a short scripted interaction (type, click, play) and saves a screenshot plus the
  recorded `.webm`. Small projects are recorded at 960×540 so the UI fills the frame.
- **Notebooks** (`store-analysis`, `churn-analysis`) — the chart outputs embedded in the
  `.ipynb` (base64 PNG) become a slow-zoom slideshow.
- **Arriba Platform** — poster and billboard are crops of the platform's own hero art
  (`arriba_platform/assets/img/capas-wallpaper-menus/arriba-hero-bg.webp`); the preview is the
  recorded site.
- **Focus JM** — no media yet; the card renders a typographic placeholder.

## Recording again

```bash
# 1. Serve the clones (the folder that holds arriba_platform, arriba-jump, ...)
cd .. && python3 -m http.server 8800

# 2. Nexus is a Vite app: build it and serve dist/ on 8801
cd ../nexus2027 && npm install && npx vite build && cd dist && python3 -m http.server 8801

# 3. Record (all jobs, or only the ones named)
node scripts/catalog/capture.mjs jump cnab

# 4. Encode into public/catalog
bash scripts/catalog/encode.sh
```

Playwright is not a dependency of this project on purpose — the site has no test or capture
runtime. Use a global install (`npm i -g playwright`) or the one your machine already has.

## Adding a title

1. Add the object to `projects` in `src/data/projects.js` (slug, status, genres, links, media).
2. Reference the slug in one or more `catalogRows`.
3. Add a job to `capture.mjs` and a line to `encode.sh`, record, and check the poster reads
   well at 300 px wide — the title is printed over the bottom 60%.

Data in a capture is always fictional (the CSV in `scripts/catalog/sample.csv`, the names in
the secret-friend draw).

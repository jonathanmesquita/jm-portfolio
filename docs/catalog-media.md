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
`scripts/catalog/titles.json` is the single source for the pipeline: for every slug it names
the source repository, how the media is made and the encoding window.

- **Web projects** — `scripts/catalog/capture.mjs` opens each project in Chromium (Playwright),
  performs a short scripted interaction (type, click, play) and saves a screenshot plus the
  recorded `.webm`. Small projects (`"viewport": "small"`) are recorded at 960×540 so the UI
  fills the frame; the rest at 1280×720. The video is cut from `video.start` for
  `video.duration` seconds; the poster is the screenshot named in `poster`.
- **Notebooks** (`store-analysis`, `churn-analysis`) — the chart outputs embedded in the
  `.ipynb` (base64 PNG), in order, become a slow-zoom slideshow (`secondsPerChart` each); the
  first chart is the poster.
- **Arriba Platform** — poster and billboard are crops of the platform's own hero art
  (`arriba_platform/assets/img/capas-wallpaper-menus/arriba-hero-bg.webp`); the preview is the
  recorded site.
- **Vite apps** — a title whose `titles.json` entry declares `build` and `"serve": "dist"` is
  built and served from its `dist/` on a second port. No current title needs it.
- **Focus JM** — no media yet; the card renders a typographic placeholder.

## When media is refreshed

`public/catalog/sources.lock.json` records, per slug, the repository and the commit the
current media was recorded from. A title is re-recorded only when its repository's `HEAD`
moved past that commit. Re-encoding a video produces different bytes every time, so
recording an unchanged title would only create noise.

A repository change re-records every title from it: a commit to `arriba_platform`
refreshes all eight Arriba titles.

### Automatically

`.github/workflows/catalog-media.yml` runs every Monday at 09:17 UTC and can be started by
hand (Actions → Catalog media → Run workflow, optionally with space-separated slugs). It
installs ffmpeg, ImageMagick and Playwright 1.63.0 with Chromium, runs
`update.mjs --changed` (or the slugs given) and, when `public/catalog` changed, pushes a
`catalog-media/<date>` branch and opens a pull request titled
`chore(catalog): refresh media for <slugs>`. Nothing changed means no branch and no PR.
A title that fails keeps its old media and lock entry; the others still go to the PR and
the run is marked as failed.

Two settings are needed on GitHub:

- **Settings → Actions → General → Workflow permissions:** enable
  "Allow GitHub Actions to create and approve pull requests". Without it `gh pr create`
  is refused.
- Pull requests opened with `GITHUB_TOKEN` do not start other workflows. If a check is
  required to merge, close and reopen the PR (or push to it) to trigger it.

Review the posters and previews before merging. If a refresh PR is left open, the next run
starts from the lock on the default branch and records the same titles again.

### By hand

```bash
node scripts/catalog/update.mjs                 # same as --changed
node scripts/catalog/update.mjs --all           # every title
node scripts/catalog/update.mjs arriba-jump cnab-400    # just these, changed or not
node scripts/catalog/update.mjs --dry-run       # what would be recorded
```

`update.mjs` does the whole job: clones or fetches the source repositories, serves them
on `localhost` (from port 8800 up, skipping ports in use; Nexus from 8801 up), builds Nexus
when it is among the titles, records, encodes into `public/catalog`, writes the lock, stops
the servers and prints each updated file with its size, resolution and duration.

| Option | Effect |
|---|---|
| `--repos <dir>` | Use the clones in `<dir>` as they are (missing ones are cloned). Without it, a cache in `scripts/catalog/repos/` (ignored by git) is cloned and fetched on every run. |
| `--fetch` | With `--repos`: fetch and reset those clones to the remote `HEAD` too (discards local changes there). |
| `--lock-only` | Write the lock from the current `HEAD`s without recording — to mark the media already in place as up to date. |
| `--encode-only` | Re-encode from the captures already in `scripts/catalog/raw/`, without recording or touching the lock — to tune `video.start`/`duration`. `bash scripts/catalog/encode.sh [slug...]` is the same. |

Requirements: Node 22, git, ffmpeg/ffprobe, ImageMagick (`convert`) and Playwright with
Chromium. Playwright is a dev dependency (pinned to 1.63.0, shared with `npm test`), so
`npm ci && npx playwright install chromium` is enough; `capture.mjs` also accepts
`PLAYWRIGHT_DIR` or a global install.
`cdn.jsdelivr.net` requests are answered from `npm pack` (cached in `scripts/catalog/cdn/`),
for machines where the CDN is blocked.

`capture.mjs` still runs on its own against servers you started yourself
(`CATALOG_BASE=http://localhost:8800 CATALOG_NEXUS=http://localhost:8801 node scripts/catalog/capture.mjs jump`).

## Adding a title

1. Add the object to `projects` in `src/data/projects.js` (slug, status, genres, links, media).
2. Reference the slug in one or more `catalogRows`.
3. Add a job to `jobs` in `capture.mjs` (web projects) and the slug to `titles.json`
   (`repo`, `job` or `"kind": "notebook"`, `viewport`, `video`, `poster`).
4. `node scripts/catalog/update.mjs <slug>` and check the poster reads well at 300 px wide —
   the title is printed over the bottom 60%. Commit the media together with
   `sources.lock.json`.

Data in a capture is always fictional (for example, the CSV in `scripts/catalog/sample.csv`).

/*
 * Social preview images (1200×630) for every project page, in both languages:
 *   public/og/<slug>.jpg  and  public/og/pt/<slug>.jpg
 *
 * Rendered by Chromium from an HTML template so the type is the site's own
 * (fonts read from node_modules/@fontsource*). Run after changing a title,
 * a category or a poster:
 *
 *   node scripts/og/render-og.mjs
 *
 * Playwright comes from devDependencies (falls back to a global install).
 */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { projects } from "../../src/data/projects.js";
import { localize } from "../../src/project-text.js";
import { esc } from "../pages/render.mjs";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  const { execSync } = await import("node:child_process");
  const globalRoot = execSync("npm root -g").toString().trim();
  ({ chromium } = require(path.join(globalRoot, "playwright")));
}

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const OUT = path.join(ROOT, "public/og");
const font = (rel) => `file://${path.join(ROOT, "node_modules", rel)}`;

const LABEL = {
  en: { live: "Live", building: "Unlocks soon", archive: "Archive" },
  pt: { live: "No ar", building: "Em breve", archive: "Arquivo" }
};

function template(project, lang) {
  const text = localize(project, lang);
  const poster = project.media ? `file://${path.join(ROOT, "public/catalog", `${project.media.poster}.webp`)}` : null;
  const locked = project.status === "building";
  const url = `jm.dev.br${lang === "pt" ? "/pt" : ""}/work/${project.slug}`;

  return `<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face { font-family: Manrope; src: url(${font("@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2")}); font-weight: 200 800; }
    @font-face { font-family: Plex; src: url(${font("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2")}); }
    * { box-sizing: border-box; margin: 0; }
    body { width: 1200px; height: 630px; overflow: hidden; background: #1B1D1A; color: #F2EEE6; font-family: Manrope, sans-serif; position: relative; }
    .art { position: absolute; inset: 0 0 0 38%; background: #0d1418 ${poster ? `url(${poster})` : ""} top center / cover;
           ${locked ? "filter: blur(5px) brightness(.8);" : ""} }
    .fade { position: absolute; inset: 0; background: linear-gradient(90deg, #1B1D1A 36%, rgba(27,29,26,.85) 52%, rgba(27,29,26,0) 78%); }
    .copy { position: absolute; left: 72px; top: 64px; bottom: 64px; width: 640px; display: flex; flex-direction: column; }
    .mark { display: flex; align-items: center; gap: 14px; font: 400 20px Plex, monospace; letter-spacing: .14em; text-transform: uppercase; color: #D8CFC2; }
    .mark b { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 3px; background: #A66A4C; font: 800 20px Manrope; letter-spacing: -.04em; color: #F2EEE6; }
    h1 { margin-top: auto; font-size: ${text.title.length > 22 ? 76 : 96}px; font-weight: 700; line-height: .95; letter-spacing: -.05em; }
    .meta { margin-top: 28px; display: flex; gap: 18px; align-items: center; font: 400 22px Plex, monospace; color: #D8CFC2; }
    .badge { padding: 4px 12px; border-radius: 3px; background: ${locked ? "#D8CFC2" : "#C48D6E"}; color: #1B1D1A; text-transform: uppercase; letter-spacing: .08em; font-size: 18px; }
    .url { margin-top: 40px; font: 400 20px Plex, monospace; color: #C9C2B6; }
  </style></head><body>
    <div class="art"></div><div class="fade"></div>
    <div class="copy">
      <div class="mark"><b>JM</b>Jonathan Mesquita</div>
      <h1>${esc(text.title)}</h1>
      <div class="meta"><span class="badge">${LABEL[lang][project.status]}</span><span>${esc(text.category)}</span></div>
      <div class="url">${url}</div>
    </div>
  </body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
fs.mkdirSync(path.join(OUT, "pt"), { recursive: true });

const tmp = path.join(OUT, ".tmp.html");
for (const project of projects) {
  for (const lang of ["en", "pt"]) {
    fs.writeFileSync(tmp, template(project, lang));
    await page.goto(`file://${tmp}`);
    await page.evaluate(() => document.fonts.ready);
    const file = path.join(OUT, lang === "pt" ? "pt" : "", `${project.slug}.jpg`);
    await page.screenshot({ path: file, type: "jpeg", quality: 82 });
  }
}
fs.rmSync(tmp);
await browser.close();
console.log(`og images: ${projects.length * 2} written to public/og`);

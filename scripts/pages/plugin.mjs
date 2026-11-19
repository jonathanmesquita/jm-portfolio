/*
 * Vite plugin: writes the project pages before Vite reads its inputs, adds
 * them to the build, and emits sitemap.xml with every page.
 *
 * The generated HTML lives in /work and /pt at the project root (ignored by
 * git): Vite needs real files to bundle them, and the dev server then serves
 * /work/<slug>/ exactly like production.
 */

import fs from "node:fs";
import path from "node:path";
import { allPages, renderPage } from "./render.mjs";
import { SITE } from "../../src/project-text.js";

const GENERATED_DIRS = ["work", "pt"];

function writePages(root) {
  for (const dir of GENERATED_DIRS) {
    fs.rmSync(path.join(root, dir), { recursive: true, force: true });
  }

  const pages = allPages();
  for (const page of pages) {
    const file = path.join(root, page.file);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, renderPage(page.project, page.lang));
  }
  return pages;
}

function sitemap(pages) {
  const alternates = (slug) =>
    [
      ["en", `${SITE}/work/${slug}/`],
      ["pt-BR", `${SITE}/pt/work/${slug}/`]
    ]
      .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`)
      .join("\n");

  const urls = [
    `  <url>\n    <loc>${SITE}/</loc>\n    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/"/>\n    <xhtml:link rel="alternate" hreflang="pt-BR" href="${SITE}/?lang=pt"/>\n  </url>`,
    ...pages.map((page) => `  <url>\n    <loc>${page.url}</loc>\n${alternates(page.project.slug)}\n  </url>`)
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
}

export function projectPages() {
  let pages = [];

  return {
    name: "project-pages",

    config(config) {
      const root = path.resolve(config.root || process.cwd());
      pages = writePages(root);

      const input = { main: path.join(root, "index.html") };
      for (const page of pages) {
        input[`${page.lang}-${page.project.slug}`] = path.join(root, page.file);
      }

      return { build: { rollupOptions: { input } } };
    },

    generateBundle() {
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap(pages) });
    }
  };
}

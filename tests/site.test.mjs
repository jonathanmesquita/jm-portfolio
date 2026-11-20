/*
 * End-to-end checks of the built site: `npm test` builds, serves dist/ with
 * `vite preview` and drives it with Chromium. Runs on every pull request
 * (.github/workflows/ci.yml).
 *
 * What it guards: the catalog renders and behaves (previews, locked titles,
 * dialog, deep links, filters), the language switch, every project page and
 * its social image, no horizontal scroll, no console errors, and axe finds
 * no WCAG A/AA violation in the main states.
 *
 * `vite preview` sends the production headers from vercel.json, so every page
 * here runs under the real Content Security Policy; a blocked resource shows
 * up as an error. Only the axe check bypasses it, to inject axe itself.
 */

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { preview } from "vite";
import { chromium } from "playwright";
import { projects, catalogRows } from "../src/data/projects.js";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const AXE = fs.readFileSync(path.join(ROOT, "node_modules/axe-core/axe.min.js"), "utf8");

let server;
let browser;
let base;

before(async () => {
  server = await preview({ root: ROOT, preview: { port: 0, host: "127.0.0.1" }, logLevel: "silent" });
  base = server.resolvedUrls.local[0].replace(/\/$/, "");
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  await server?.close();
});

/* Opens a page and collects real errors (the analytics script only exists on Vercel). */
async function open(url, { viewport = { width: 1440, height: 900 }, reducedMotion, bypassCSP = false } = {}) {
  const context = await browser.newContext({ viewport, reducedMotion, bypassCSP });
  await context.addInitScript(() =>
    document.addEventListener("securitypolicyviolation", (e) =>
      console.error(`CSP blocked ${e.violatedDirective} ${e.blockedURI}`)
    )
  );
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && message.text().startsWith("CSP")) errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400 && !response.url().includes("/_vercel/")) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });
  await page.goto(`${base}${url}`, { waitUntil: "networkidle" });
  return { page, errors, close: () => context.close() };
}

async function axeViolations(page) {
  await page.addScriptTag({ content: AXE });
  return page.evaluate(async () => {
    const result = await window.axe.run(document, {
      runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"]
    });
    return result.violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes[0].target.join(" ")}`);
  });
}

test("production headers are served, and no page breaks the Content Security Policy", async () => {
  const response = await (await browser.newContext()).request.get(`${base}/`);
  assert.match(response.headers()["content-security-policy"], /script-src 'self';/);
  assert.equal(response.headers()["x-content-type-options"], "nosniff");

  for (const url of ["/", "/#work/arriba-jump", "/pt/work/focus-jm/", "/work/nutri-jm/", "/#work/nutri-jm"]) {
    const { page, errors, close } = await open(url);
    await page.locator('[data-row="arriba-tools"] .title-card').first().hover().catch(() => {});
    await page.waitForTimeout(800);
    assert.deepEqual(errors, [], url);
    await close();
  }
});

test("home renders every row and title without errors", async () => {
  const { page, errors, close } = await open("/");

  assert.equal(await page.locator(".catalog-row").count(), catalogRows.length);

  const slugs = await page.$$eval(".title-card", (cards) => [...new Set(cards.map((c) => c.dataset.slug))]);
  const inRows = new Set(catalogRows.flatMap((row) => row.items));
  assert.deepEqual(new Set(slugs), inRows);

  assert.deepEqual(errors, []);
  await close();
});

test("hovering a live title plays its preview; locked titles have none", async () => {
  const { page, close } = await open("/");

  const live = page.locator('[data-row="arriba-tools"] .title-card').first();
  await live.hover();
  await page.waitForFunction(
    (el) => el.classList.contains("is-previewing") && !el.querySelector("video").paused,
    await live.elementHandle(),
    { timeout: 5000 }
  );

  for (const project of projects.filter((p) => p.status === "building")) {
    const card = page.locator(`.title-card[data-slug="${project.slug}"]`).first();
    assert.equal(await card.locator("video").count(), 0, `${project.slug} must not have a preview`);
    assert.ok(await card.evaluate((el) => el.classList.contains("is-locked")));
  }
  await close();
});

test("dialog opens, links to the project page and returns focus on Esc", async () => {
  const { page, close } = await open("/");

  const card = page.locator('[data-row="top"] .title-card[data-slug="arriba-jump"]');
  await card.click();
  assert.ok(await page.locator("dialog.title-dialog").evaluate((d) => d.open));
  assert.equal(await page.evaluate(() => location.hash), "#work/arriba-jump");
  assert.equal(await page.locator(".dialog-page-link").getAttribute("href"), "/work/arriba-jump/");

  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog.title-dialog").evaluate((d) => d.open), false);
  assert.equal(await page.evaluate(() => document.activeElement.dataset.slug), "arriba-jump");
  await close();
});

test("locked titles show no links in the dialog", async (t) => {
  const locked = projects.find((p) => p.status === "building");
  if (!locked) {
    t.skip("no locked title in the catalog right now");
    return;
  }
  const { page, close } = await open(`/#work/${locked.slug}`);
  assert.ok(await page.locator("dialog.title-dialog").evaluate((d) => d.open));
  assert.equal(await page.locator(".dialog-actions a").count(), 0);
  assert.equal(await page.locator(".dialog-note").count(), 1);
  await close();
});

test("filters switch rows to a grid of matching titles", async () => {
  const { page, close } = await open("/");
  await page.click('.genre-chip[data-filter="data"]');
  const shown = await page.$$eval(".catalog-grid .title-card", (cards) => cards.map((c) => c.dataset.slug));
  const expected = projects.filter((p) => p.genres.includes("data")).map((p) => p.slug);
  assert.deepEqual(shown, expected);
  assert.ok(await page.locator(".catalog-rows").evaluate((el) => el.hidden));
  await close();
});

test("language switch translates the page and keeps an open dialog", async () => {
  const { page, close } = await open("/#work/arriba-jump");

  await page.evaluate(() => document.querySelector("#lang-switch").click());
  assert.equal(await page.evaluate(() => document.documentElement.lang), "pt-BR");
  assert.match(await page.textContent(".hero-line-primary"), /O suporte me ensinou/);
  assert.ok(await page.locator("dialog.title-dialog").evaluate((d) => d.open), "dialog stays open");
  assert.match(await page.textContent(".dialog-page-link"), /estudo de caso/i);

  await page.keyboard.press("Escape");
  await page.click("#lang-switch");
  assert.equal(await page.evaluate(() => document.documentElement.lang), "en");
  assert.match(await page.textContent(".hero-line-primary"), /Support taught me/);
  await close();
});

test("reduced motion: nothing autoplays", async () => {
  const { page, close } = await open("/#work/arriba-jump", { reducedMotion: "reduce" });
  const video = await page.locator(".dialog-video").evaluate((v) => ({ autoplay: v.autoplay, controls: v.controls }));
  assert.deepEqual(video, { autoplay: false, controls: true });
  await close();
});

test("every project page exists in both languages with its social image", async () => {
  const context = await browser.newContext();
  for (const project of projects) {
    for (const prefix of ["", "/pt"]) {
      const url = `${prefix}/work/${project.slug}/`;
      const response = await context.request.get(`${base}${url}`);
      assert.equal(response.status(), 200, url);
      const html = await response.text();

      const og = html.match(/property="og:image" content="https:\/\/jm\.dev\.br([^"]+)"/)[1];
      assert.equal((await context.request.get(`${base}${og}`)).status(), 200, `${url} → ${og}`);
      assert.match(html, /<link rel="canonical" href="https:\/\/jm\.dev\.br\//);
    }
  }

  const sitemap = await (await context.request.get(`${base}/sitemap.xml`)).text();
  assert.equal((sitemap.match(/<loc>/g) || []).length, projects.length * 2 + 1);
  await context.close();
});

test("no horizontal scroll at 320 px", async () => {
  for (const url of ["/", "/work/arriba/", "/pt/work/arriba-jump/"]) {
    const { page, close } = await open(url, { viewport: { width: 320, height: 700 } });
    const scrolled = await page.evaluate(() => {
      window.scrollTo(9999, 0);
      return window.scrollX;
    });
    assert.equal(scrolled, 0, url);
    await close();
  }
});

test("axe: no WCAG A/AA violations in the main states", async () => {
  const states = [
    ["/", null],
    ["/?lang=pt", null],
    ["/#work/arriba", "dialog"],
    ["/work/arriba/", null],
    ["/pt/work/focus-jm/", null],
    ["/#work/focus-jm", "dialog"]
  ];

  for (const viewport of [{ width: 1440, height: 900 }, { width: 375, height: 812 }]) {
    for (const [url] of states) {
      const { page, close } = await open(url, { viewport, bypassCSP: true });
      assert.deepEqual(await axeViolations(page), [], `${url} at ${viewport.width}px`);
      await close();
    }
  }
});

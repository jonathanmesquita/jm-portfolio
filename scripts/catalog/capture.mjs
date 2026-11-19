/*
 * Records the catalog media (poster screenshot + preview video) by driving
 * each project in a real browser. See docs/catalog-media.md.
 *
 *   REPOS=..  (folder with the project clones, served on :8800)
 *   NEXUS_DIST=../nexus2027/dist  (built Nexus, served on :8801)
 *   node scripts/catalog/capture.mjs [job ...]
 *
 * Output: scripts/catalog/raw/<job>.png and raw/v-<job>/*.webm — inputs for
 * encode.sh. Playwright is not a project dependency on purpose.
 */
import { chromium } from 'playwright';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(HERE, 'raw'); fs.mkdirSync(OUT, { recursive: true });
/* cdn.jsdelivr.net may be blocked where this runs: packages come from npm instead. */
const CACHE = path.join(HERE, 'cdn'); fs.mkdirSync(CACHE, { recursive: true });
const B = 'http://localhost:8800';
const NX = 'http://localhost:8801';
const wait = (ms) => new Promise(r => setTimeout(r, ms));

function cdnFile(spec, file) {
  const dir = path.join(CACHE, spec.replace(/[\/@]/g, '_'));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    const tgz = execSync(`npm pack ${spec} --silent`, { cwd: dir }).toString().trim().split('\n').pop();
    execSync(`tar xzf ${tgz}`, { cwd: dir });
  }
  return path.join(dir, 'package', file);
}
async function routeCdn(ctx) {
  await ctx.route(/cdn\.jsdelivr\.net\/npm\//, async (route) => {
    const u = new URL(route.request().url());
    const m = u.pathname.match(/^\/npm\/((?:@[^/]+\/)?[^/@]+@[^/]+)\/(.+)$/);
    try {
      const f = cdnFile(m[1], m[2]);
      const ct = f.endsWith('.css') ? 'text/css' : f.endsWith('.js') ? 'application/javascript' : f.endsWith('.woff2') ? 'font/woff2' : 'application/octet-stream';
      await route.fulfill({ body: fs.readFileSync(f), contentType: ct, headers: { 'access-control-allow-origin': '*' } });
    } catch (e) { console.warn('cdn miss', u.href, e.message); await route.abort(); }
  });
}

const jobs = {

  async cnab(page) { await page.goto(`${B}/arriba_platform/tools/cobranca/cnab400/cnab400.html`, { waitUntil: 'networkidle' }); await wait(800);
    const opts = await page.$$eval('#bankSelect option', o => o.map(x => x.value).filter(Boolean)); if (opts[0]) await page.selectOption('#bankSelect', opts[0]); await wait(800);
    const d = await page.$$eval('#direcaoSelect option', o => o.map(x => x.value).filter(Boolean)); if (d[0]) await page.selectOption('#direcaoSelect', d[0]).catch(()=>{}); await wait(900);
    await page.click('#btnModeGenerator').catch(()=>{}); await wait(1200); await page.screenshot({ path: `${OUT}/cnab.png` });
    for (let i = 0; i < 10; i++) { await page.mouse.wheel(0, 50); await wait(100); } await wait(600); },
  async csvval(page) { await page.goto(`${B}/arriba_platform/tools/dados/csv-validator/csv-validator.html`, { waitUntil: 'networkidle' }); await wait(1500);
    const ex = page.getByRole('button', { name: /exemplo/i }).first(); if (await ex.count()) { await ex.click().catch(()=>{}); await wait(1500); }
    await page.screenshot({ path: `${OUT}/csvval.png` }); for (let i = 0; i < 10; i++) { await page.mouse.wheel(0, 50); await wait(100); } await wait(800); },
  async sql(page) { await page.goto(`${B}/arriba_platform/tools/cobranca/sql-playground/sql-playground.html`, { waitUntil: 'networkidle' }); await wait(1500);
    const run = page.getByRole('button', { name: /executar|rodar|run/i }).first(); if (await run.count()) { await run.click().catch(()=>{}); await wait(1500); }
    await page.screenshot({ path: `${OUT}/sql.png` }); for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 50); await wait(100); } await wait(800); },
  async curso(page) { await page.goto(`${B}/arriba_platform/tools/cobranca/treinamento-sql/treinamento-sql.html`, { waitUntil: 'networkidle' }); await wait(1500);
    await page.screenshot({ path: `${OUT}/curso.png` }); for (let i = 0; i < 10; i++) { await page.mouse.wheel(0, 50); await wait(100); } await wait(800); },
  async editor(page) { await page.goto(`${B}/arriba_platform/tools/dados/editor-web/editor-web.html`, { waitUntil: 'networkidle' }); await wait(2000);
    await page.screenshot({ path: `${OUT}/editor.png` }); for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 50); await wait(100); } await wait(1000); },
  async dns(page) { await page.goto(`${B}/arriba_platform/tools/rede/dns/dns.html`, { waitUntil: 'networkidle' }); await wait(1500);
    await page.screenshot({ path: `${OUT}/dns.png` }); for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 50); await wait(100); } await wait(800); },
  async massa(page) { await page.goto(`${B}/arriba_platform/tools/cobranca/massa-dados/massa-dados.html`, { waitUntil: 'networkidle' }); await wait(1500);
    await page.screenshot({ path: `${OUT}/massa.png` }); const b = page.locator('.side-item, [data-generator]'); const n = Math.min(await b.count(), 4);
    for (let i = 1; i < n; i++) { await b.nth(i).click().catch(()=>{}); await wait(900); } await wait(600); },
  async arriba(page) {
    await page.goto(`${B}/arriba_platform/index.html`, { waitUntil: 'networkidle' });
    await wait(1200);
    await page.screenshot({ path: `${OUT}/arriba.png` });
    for (let i = 0; i < 18; i++) { await page.mouse.wheel(0, 60); await wait(90); }
    await wait(800);
    await page.goto(`${B}/arriba_platform/tools/dados/editor-web/editor-web.html`, { waitUntil: 'networkidle' }).catch(() => {});
    await wait(2500);
  },
  async jump(page) {
    await page.goto(`${B}/arriba-jump/index.html`, { waitUntil: 'networkidle' });
    await wait(1500);
    await page.screenshot({ path: `${OUT}/jump-menu.png` });
    await page.click('.btn-play');
    await wait(1500);
    for (let i = 0; i < 9; i++) { await page.keyboard.down('Space'); await wait(260); await page.keyboard.up('Space'); await wait(700); if (i === 4) await page.screenshot({ path: `${OUT}/jump.png` }); }
  },
  async nexus(page) {
    await page.goto(`${NX}/`, { waitUntil: 'networkidle' });
    await wait(2600);
    await page.getByText(/INICIAR/).first().click().catch(e => console.log('nx', e.message));
    await wait(1800);
    await page.screenshot({ path: `${OUT}/nexus.png` });
    for (let i = 0; i < 6; i++) { await page.mouse.click(480, 300); await wait(700); }
    await page.screenshot({ path: `${OUT}/nexus2.png` });
    const c = page.getByText(/caderno/i).last(); if (await c.count()) { await c.click().catch(()=>{}); }
    await wait(1800);
  },
  async base64(page) {
    await page.goto(`${B}/DecodificacaoBase64/index.html`, { waitUntil: 'networkidle' });
    await wait(800);
    await page.fill('#encoded', '');
    await page.type('#encoded', 'QXJyaWJhISBEZWNvZGlmaWNhZG8gbm8gbmF2ZWdhZG9yLg==', { delay: 45 });
    await wait(400); await page.click('button'); await wait(1600);
    await page.screenshot({ path: `${OUT}/base64.png` });
  },
  async moedas(page) {
    page.on('dialog', d => d.type() === 'prompt' ? d.accept('250000') : d.accept());
    await page.goto(`${B}/conversor-moedas/index.html`, { waitUntil: 'load' });
    await wait(1200); await page.click('button').catch(() => {}); await wait(1500);
    await page.screenshot({ path: `${OUT}/moedas.png` });
  },
  async caixa(page) {
    await page.goto(`${B}/convertor-maiusculas-minusculas/index.html`, { waitUntil: 'networkidle' });
    await wait(600);
    await page.type('#inputText', 'o suporte ensinou onde o software quebra.', { delay: 35 });
    for (const fn of ['converterMaiusculas', 'converterPrimeiraLetra', 'converterMinusculas']) { await page.click(`button[onclick^="${fn}"]`); await wait(900); if (fn === 'converterPrimeiraLetra') await page.screenshot({ path: `${OUT}/caixa.png` }); }
  },
  async csv(page) {
    await page.goto(`${B}/leitor-csv/index.html`, { waitUntil: 'networkidle' });
    await wait(1000);
    await page.setInputFiles('#csvFile', path.join(HERE, 'sample.csv'));
    await wait(1800);
    await page.screenshot({ path: `${OUT}/csv.png` });
    for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 60); await wait(120); }
    await wait(800);
  },
  async amigo(page) {
    await page.goto(`${B}/challenge-amigo-secreto/index.html`, { waitUntil: 'networkidle' });
    await wait(800);
    if (await page.locator('#nome').isVisible().catch(() => false)) { await page.type('#nome', 'Ana', { delay: 40 }); await page.click('button[onclick^="salvarNome"]'); await wait(500); }
    for (const n of ['Bruno', 'Carla', 'Diego', 'Elisa']) { await page.type('#amigo', n, { delay: 40 }); await page.click('button[onclick^="adicionarAmigo"]'); await wait(250); }
    await page.click('.button-draw'); await wait(300); await page.locator('#resultado').scrollIntoViewIfNeeded(); await wait(1400);
    await page.screenshot({ path: `${OUT}/amigo.png` });
  },
  async cartao(page) {
    await page.goto(`${B}/cartao_mesquita/index.html`, { waitUntil: 'networkidle' });
    await wait(1000);
    await page.screenshot({ path: `${OUT}/cartao.png` });
    for (let t = 0; t < 60; t++) { const a = t / 60 * Math.PI * 2; await page.mouse.move(480 + Math.cos(a) * 180, 270 + Math.sin(a) * 120); await wait(70); }
  },
};

const only = process.argv.slice(2);
const browser = await chromium.launch();
for (const [name, job] of Object.entries(jobs)) {
  if (only.length && !only.includes(name)) continue;
  const small = ['base64','caixa','amigo','cartao','nexus'].includes(name); const vp = small ? { width: 960, height: 540 } : { width: 1280, height: 720 };
  const ctx = await browser.newContext({ viewport: vp, recordVideo: { dir: `${OUT}/v-${name}`, size: vp } });
  await routeCdn(ctx);
  const page = await ctx.newPage();
  const t0 = Date.now();
  try { await job(page); } catch (e) { console.error(name, e.message); }
  await ctx.close();
  console.log(name, 'ok', Date.now() - t0, 'ms');
}
await browser.close();

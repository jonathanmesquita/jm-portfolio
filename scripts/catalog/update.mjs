/*
 * Refreshes the catalog media (public/catalog/<slug>.webp + .mp4) for the
 * titles whose source repository changed. See docs/catalog-media.md.
 *
 *   node scripts/catalog/update.mjs [--changed | --all | <slug>...] [options]
 *
 *   --changed        (default) only titles whose repo HEAD differs from
 *                    public/catalog/sources.lock.json
 *   --all            every title in titles.json
 *   <slug>...        just these titles, changed or not
 *   --repos <dir>    folder with the clones (default: scripts/catalog/repos/,
 *                    a cache this script clones into and fetches every run).
 *                    Clones in a folder you pass are used as they are; missing
 *                    ones are cloned. Add --fetch to update them too.
 *   --lock-only      write the lock from the current HEADs, record nothing
 *   --encode-only    re-encode from scripts/catalog/raw/ without recording
 *                    (to tune start/duration); the lock is left alone
 *   --dry-run        print what would be recorded and stop
 *
 * Needs Node 22, git, ffmpeg/ffprobe, ImageMagick (`convert`) and Playwright
 * with Chromium (not a project dependency; see capture.mjs).
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { capture, jobs as captureJobs } from './capture.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const OUT = path.join(ROOT, 'public/catalog');
const RAW = path.join(HERE, 'raw');
const LOCK = path.join(OUT, 'sources.lock.json');
const CACHE_REPOS = path.join(HERE, 'repos');
const config = JSON.parse(fs.readFileSync(path.join(HERE, 'titles.json'), 'utf8'));
const TITLES = config.titles;

/* ---------- arguments ---------- */

function parseArgs(argv) {
  const a = { mode: null, slugs: [], repos: null, fetch: false, lockOnly: false, encodeOnly: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (x === '--all' || x === '--changed') a.mode = x.slice(2);
    else if (x === '--repos') a.repos = path.resolve(argv[++i] ?? '');
    else if (x === '--fetch') a.fetch = true;
    else if (x === '--lock-only') a.lockOnly = true;
    else if (x === '--encode-only') a.encodeOnly = true;
    else if (x === '--dry-run') a.dryRun = true;
    else if (x === '-h' || x === '--help') { console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0]); process.exit(0); }
    else if (x.startsWith('-')) die(`unknown option ${x}`);
    else a.slugs.push(x);
  }
  for (const s of a.slugs) if (!TITLES[s]) die(`unknown slug "${s}" — known: ${Object.keys(TITLES).join(', ')}`);
  if (a.slugs.length && a.mode) die('pass slugs or --all/--changed, not both');
  a.mode ??= a.slugs.length ? 'slugs' : (a.lockOnly || a.encodeOnly ? 'all' : 'changed');
  return a;
}

function die(msg) { console.error(`update.mjs: ${msg}`); process.exit(2); }

/* ---------- processes ---------- */

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: opts.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit', encoding: 'utf8', ...opts });
  if (r.error) throw new Error(`${cmd}: ${r.error.message}`);
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} exited ${r.status}${r.stderr ? `\n${r.stderr.trim()}` : ''}`);
  return opts.capture ? r.stdout.trim() : '';
}
const git = (dir, ...args) => run('git', ['-C', dir, ...args], { capture: true });

/* ---------- repositories ---------- */

function ensureRepo(name, reposDir, fetch) {
  const dir = path.join(reposDir, name);
  const url = `${config.github}/${name}.git`;
  if (!fs.existsSync(path.join(dir, '.git'))) {
    console.log(`clone ${url}`);
    fs.mkdirSync(reposDir, { recursive: true });
    run('git', ['clone', '--quiet', '--depth', '1', url, dir]);
  } else if (fetch) {
    console.log(`fetch ${name}`);
    git(dir, 'fetch', '--quiet', '--depth', '1', 'origin', 'HEAD');
    git(dir, 'reset', '--quiet', '--hard', 'FETCH_HEAD');
    git(dir, 'clean', '-qffdx');
  }
  return { dir, commit: git(dir, 'rev-parse', 'HEAD') };
}

/* ---------- static servers ---------- */

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg',
  '.wav': 'audio/wav', '.mp4': 'video/mp4', '.webm': 'video/webm', '.csv': 'text/csv', '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm', '.map': 'application/json',
};

/* Serves `root` on 127.0.0.1, from `port` upwards until one is free. */
async function serve(root, port) {
  const server = http.createServer((req, res) => {
    let rel;
    try { rel = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400).end(); return; }
    let file = path.join(root, path.normalize(rel));
    if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
    try {
      if (fs.statSync(file).isDirectory()) {
        if (!rel.endsWith('/')) { res.writeHead(301, { location: `${rel}/` }).end(); return; }
        file = path.join(file, 'index.html');
      }
      const body = fs.readFileSync(file);
      res.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream', 'content-length': body.length, 'cache-control': 'no-store' });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch { res.writeHead(404, { 'content-type': 'text/plain' }).end('not found'); }
  });
  for (let p = port; p < port + 50; p++) {
    const ok = await new Promise((resolve) => {
      server.once('error', () => resolve(false));
      server.listen(p, '127.0.0.1', () => resolve(true));
    });
    if (ok) return { url: `http://localhost:${p}`, close: () => new Promise(r => server.close(r)) };
  }
  throw new Error(`no free port from ${port}`);
}

/* ---------- encoding (the parameters encode.sh used) ---------- */

const PAD = 'scale=640:360:force_original_aspect_ratio=decrease:flags=lanczos,pad=640:360:(ow-iw)/2:(oh-ih)/2:color=0x1b1d1a,fps=24,format=yuv420p';

function encodeVideo(slug, job, start, duration) {
  const dir = path.join(RAW, `v-${job}`);
  const webm = fs.existsSync(dir) && fs.readdirSync(dir).filter(f => f.endsWith('.webm')).sort()[0];
  if (!webm) throw new Error(`no recording in ${path.relative(ROOT, dir)}`);
  run('ffmpeg', ['-v', 'error', '-y', '-ss', String(start), '-i', path.join(dir, webm), '-t', String(duration), '-an',
    '-vf', PAD, '-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-profile:v', 'main', '-movflags', '+faststart',
    path.join(OUT, `${slug}.mp4`)]);
}

function encodePoster(slug, png) {
  if (!fs.existsSync(png)) throw new Error(`no screenshot ${path.relative(ROOT, png)}`);
  run('convert', [png, '-resize', '640x360^', '-gravity', 'north', '-extent', '640x360', '-quality', '78', path.join(OUT, `${slug}.webp`)]);
}

/* Poster/billboard cut from an image in the source repo (Arriba's hero art). */
function encodeArt(file, image, spec) {
  if (!fs.existsSync(image)) throw new Error(`no image ${image}`);
  const args = spec.crop
    ? [image, '-crop', spec.crop, '+repage', '-resize', '640x360!']
    : [image, '-resize', `${spec.size}^`, '-gravity', 'center', '-extent', spec.size];
  run('convert', [...args, '-quality', '78', file]);
}

/* Notebook: the PNG outputs embedded in the .ipynb, as a slow-zoom slideshow on white. */
function encodeNotebook(slug, nbPath, secondsPerChart) {
  const nb = JSON.parse(fs.readFileSync(nbPath, 'utf8'));
  const pngs = [];
  for (const cell of nb.cells ?? []) for (const o of cell.outputs ?? []) {
    const d = o.data?.['image/png'];
    if (d) pngs.push(Buffer.from(Array.isArray(d) ? d.join('') : d, 'base64'));
  }
  if (!pngs.length) throw new Error(`no chart outputs in ${nbPath}`);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `catalog-${slug}-`));
  try {
    pngs.forEach((buf, i) => {
      const src = path.join(tmp, `src-${i}.png`);
      fs.writeFileSync(src, buf);
      run('convert', [src, '-resize', '600x330', '-background', 'white', '-gravity', 'center', '-extent', '640x360', path.join(tmp, `${i}.png`)]);
    });
    run('ffmpeg', ['-v', 'error', '-y', '-framerate', `1/${secondsPerChart}`, '-i', path.join(tmp, '%d.png'),
      '-vf', "fps=24,format=yuv420p,zoompan=z='min(zoom+0.0008,1.06)':d=1:s=640x360:fps=24",
      '-c:v', 'libx264', '-crf', '30', '-preset', 'slow', '-movflags', '+faststart', path.join(OUT, `${slug}.mp4`)]);
    run('convert', [path.join(tmp, '0.png'), '-quality', '80', path.join(OUT, `${slug}.webp`)]);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

function encodeTitle(slug, t, repoDir) {
  if (t.kind === 'notebook') return encodeNotebook(slug, path.join(repoDir, t.notebook), t.video?.secondsPerChart ?? 2.2);
  encodeVideo(slug, t.job, t.video.start, t.video.duration);
  if (typeof t.poster === 'string') encodePoster(slug, path.join(RAW, `${t.poster}.png`));
  else encodeArt(path.join(OUT, `${slug}.webp`), path.join(repoDir, t.poster.image), t.poster);
  if (t.billboard) encodeArt(path.join(OUT, `${slug}-billboard.webp`), path.join(repoDir, t.billboard.image), t.billboard);
}

function outputsOf(slug, t) {
  return [`${slug}.webp`, `${slug}.mp4`, ...(t.billboard ? [`${slug}-billboard.webp`] : [])];
}

function describe(file) {
  const p = path.join(OUT, file);
  const kb = (fs.statSync(p).size / 1024).toFixed(1);
  if (file.endsWith('.mp4')) {
    const [w, h, dur] = run('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration',
      '-of', 'csv=p=0', p], { capture: true }).split(/[\n,]/);
    return `${file} ${w}x${h} ${Number(dur).toFixed(2)}s ${kb} KB`;
  }
  return `${file} ${run('identify', ['-format', '%wx%h', p], { capture: true })} ${kb} KB`;
}

/* ---------- lock ---------- */

function readLock() {
  try { return JSON.parse(fs.readFileSync(LOCK, 'utf8')); } catch { return {}; }
}
function writeLock(lock) {
  const ordered = {};
  for (const s of Object.keys(TITLES)) if (lock[s]) ordered[s] = { repo: lock[s].repo, commit: lock[s].commit };
  fs.writeFileSync(LOCK, `${JSON.stringify(ordered, null, 2)}\n`);
}

/* ---------- main ---------- */

const args = parseArgs(process.argv.slice(2));
const managed = !args.repos;
const reposDir = args.repos ?? CACHE_REPOS;
const fetch = managed || args.fetch;
const candidates = args.mode === 'slugs' ? args.slugs : Object.keys(TITLES);
const lock = readLock();

const repos = {};
for (const name of new Set(candidates.map(s => TITLES[s].repo))) {
  repos[name] = ensureRepo(name, reposDir, fetch && !args.encodeOnly);
}

if (args.lockOnly) {
  for (const s of candidates) lock[s] = { repo: TITLES[s].repo, commit: repos[TITLES[s].repo].commit };
  writeLock(lock);
  console.log(`lock written for ${candidates.length} title(s): ${path.relative(ROOT, LOCK)}`);
  process.exit(0);
}

const selected = args.mode === 'changed'
  ? candidates.filter(s => lock[s]?.commit !== repos[TITLES[s].repo].commit)
  : candidates;

if (args.mode === 'changed') {
  for (const s of candidates) {
    const was = lock[s]?.commit?.slice(0, 7) ?? 'none', now = repos[TITLES[s].repo].commit.slice(0, 7);
    console.log(`${selected.includes(s) ? 'changed  ' : 'unchanged'} ${s.padEnd(15)} ${was} -> ${now}`);
  }
}
if (!selected.length) {
  console.log('nothing changed — all titles match sources.lock.json');
  writeGithubOutput([]);
  process.exit(0);
}
if (args.dryRun) { console.log(`would update: ${selected.join(' ')}`); process.exit(0); }

const recorded = selected.filter(s => TITLES[s].kind !== 'notebook');
const jobNames = [...new Set(recorded.map(s => TITLES[s].job))];
for (const j of jobNames) if (!captureJobs[j]) die(`titles.json names unknown capture job "${j}"`);

const failed = {};
let servers = [];
try {
  if (jobNames.length && !args.encodeOnly) {
    const site = await serve(reposDir, 8800);
    servers.push(site);
    let nexusBase;
    const built = recorded.filter(s => TITLES[s].build);
    for (const s of built) {
      const t = TITLES[s], dir = repos[t.repo].dir;
      console.log(`build ${t.repo}: ${t.build}`);
      try { run('sh', ['-c', t.build], { cwd: dir }); } catch (e) { failed[s] = `build: ${e.message}`; continue; }
      const srv = await serve(path.join(dir, t.serve ?? '.'), 8801);
      servers.push(srv);
      nexusBase = srv.url;
    }
    console.log(`serving ${reposDir} at ${site.url}${nexusBase ? `, nexus at ${nexusBase}` : ''}`);
    /* No stale input: encodeVideo takes the first .webm, encodePoster the named .png. */
    for (const j of jobNames) fs.rmSync(path.join(RAW, `v-${j}`), { recursive: true, force: true });
    for (const s of recorded) if (typeof TITLES[s].poster === 'string') fs.rmSync(path.join(RAW, `${TITLES[s].poster}.png`), { force: true });
    const toCapture = jobNames.filter(j => !recorded.some(s => failed[s] && TITLES[s].job === j));
    const viewport = (name) => recorded.map(s => TITLES[s]).find(t => t.job === name)?.viewport ?? 'large';
    const res = toCapture.length ? await capture(toCapture, { base: site.url, nexusBase, out: RAW, viewport }) : {};
    for (const s of recorded) if (!failed[s] && !res[TITLES[s].job]?.ok) failed[s] = `capture ${TITLES[s].job}: ${res[TITLES[s].job]?.error}`;
  }
} finally {
  await Promise.all(servers.map(s => s.close()));
}

const updated = [];
for (const s of selected) {
  if (failed[s]) continue;
  const t = TITLES[s];
  try {
    encodeTitle(s, t, repos[t.repo].dir);
    updated.push(s);
    if (!args.encodeOnly) lock[s] = { repo: t.repo, commit: repos[t.repo].commit };
  } catch (e) { failed[s] = e.message; }
}
if (!args.encodeOnly) writeLock(lock);

console.log('\n== catalog media ==');
for (const s of updated) {
  console.log(`updated ${s} @ ${repos[TITLES[s].repo].commit.slice(0, 7)}`);
  for (const f of outputsOf(s, TITLES[s])) console.log(`  ${describe(f)}`);
}
for (const [s, why] of Object.entries(failed)) console.log(`FAILED  ${s}: ${why}`);
writeGithubOutput(updated);
if (Object.keys(failed).length) process.exitCode = 1;

function writeGithubOutput(list) {
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `updated=${list.join(' ')}\n`);
}

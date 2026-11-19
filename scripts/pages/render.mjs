/*
 * Renders one static HTML page per project and language, at build time.
 *   /work/<slug>/      English
 *   /pt/work/<slug>/   Portuguese
 *
 * Static HTML on purpose: link previews (LinkedIn, WhatsApp, Slack) read the
 * <head> without running JavaScript, and the case study is readable with
 * JavaScript off. Every value goes through `esc()`.
 */

import { projects } from "../../src/data/projects.js";
import { UI } from "../../src/i18n.js";
import { localize, caseStudyFor, pagePath, pageUrl, SITE } from "../../src/project-text.js";

const PAGE_TEXT = {
  en: {
    htmlLang: "en",
    caseStudy: "Case study",
    project: "Project",
    allProjects: "All projects",
    problem: "The problem",
    decisions: "Key decisions",
    result: "Result",
    next: "What's next",
    highlights: "Highlights",
    links: "Links",
    more: "More projects",
    switchTo: "Português",
    switchLabel: "Ler em português",
    home: "/#work",
    titleSuffix: "Jonathan Mesquita",
    footer: "Built by Jonathan Mesquita · São Paulo — Brazil"
  },
  pt: {
    htmlLang: "pt-BR",
    caseStudy: "Estudo de caso",
    project: "Projeto",
    allProjects: "Todos os projetos",
    problem: "O problema",
    decisions: "Decisões principais",
    result: "Resultado",
    next: "Próximos passos",
    highlights: "Destaques",
    links: "Links",
    more: "Mais projetos",
    switchTo: "English",
    switchLabel: "Read in English",
    home: "/?lang=pt#work",
    titleSuffix: "Jonathan Mesquita",
    footer: "Feito por Jonathan Mesquita · São Paulo — Brasil"
  }
};

export function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* `code` spans in case-study text: escape first, then mark up backticks. */
function inline(text) {
  return esc(text).replace(/`([^`]+)`/g, "<code>$1</code>");
}

const isLocked = (project) => project.status === "building";

export function ogImagePath(slug, lang) {
  return `/og/${lang === "pt" ? "pt/" : ""}${slug}.jpg`;
}

function similar(project) {
  return projects
    .filter((other) => other.slug !== project.slug && other.media && !isLocked(other))
    .map((other) => ({
      other,
      score: other.genres.filter((genre) => project.genres.includes(genre)).length
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ other }) => other);
}

function externalButton(href, label, variant, lang, kind, slug) {
  return `<a class="button ${variant}" href="${esc(href)}" target="_blank" rel="noopener noreferrer" data-outbound="${kind}" data-slug="${esc(slug)}">${esc(label)}<span aria-hidden="true"> ↗</span><span class="visually-hidden">${esc(UI[lang].newTab)}</span></a>`;
}

const LOCK_SVG =
  '<svg class="lock-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.5 10.5V7.75a4.5 4.5 0 0 1 9 0v2.75"/><rect x="4.5" y="10.5" width="15" height="10.5" rx="2"/><path d="M12 14.5v2.5"/></svg>';

export function renderPage(project, lang) {
  const t = PAGE_TEXT[lang];
  const ui = UI[lang];
  const text = localize(project, lang);
  const study = caseStudyFor(project.slug, lang);
  const locked = isLocked(project);
  const other = lang === "pt" ? "en" : "pt";
  const kind = study ? t.caseStudy : t.project;
  const pageTitle = `${text.title} — ${kind} | ${t.titleSuffix}`;
  const description = study ? study.summary : text.description;
  const canonical = pageUrl(project.slug, lang);
  const status = locked ? ui.lockedStatus : ui[`status_${project.status}`];

  const media = locked
    ? `<div class="case-locked">${
        project.media ? `<img src="/catalog/${esc(project.media.poster)}.webp" alt="" width="640" height="360">` : ""
      }<span class="lock-overlay" aria-hidden="true">${LOCK_SVG}<span class="lock-text">${esc(ui.unlocksSoon)}</span></span></div>`
    : project.media
    ? `<video class="case-video" src="/catalog/${esc(project.media.video)}.mp4" poster="/catalog/${esc(
        project.media.poster
      )}.webp" muted loop playsinline controls preload="none" width="640" height="360" aria-label="${esc(
        ui.preview(text.title)
      )}"></video>`
    : "";

  const actions = locked
    ? `<p class="dialog-note">${LOCK_SVG}${esc(ui.lockedNote)}</p>`
    : [
        project.links.live ? externalButton(project.links.live, ui.openLive, "button-light", lang, "live", project.slug) : "",
        project.links.code ? externalButton(project.links.code, ui.viewCode, "button-ghost", lang, "code", project.slug) : ""
      ].join("");

  const body = study
    ? `
      <p class="case-lead">${inline(study.summary)}</p>

      <section class="case-section" aria-labelledby="problem">
        <h2 id="problem"><span aria-hidden="true">01</span>${esc(t.problem)}</h2>
        ${study.problem.map((p) => `<p>${inline(p)}</p>`).join("\n        ")}
      </section>

      <section class="case-section" aria-labelledby="decisions">
        <h2 id="decisions"><span aria-hidden="true">02</span>${esc(t.decisions)}</h2>
        <ol class="case-decisions">
          ${study.decisions
            .map((d) => `<li><h3>${inline(d.title)}</h3><p>${inline(d.body)}</p></li>`)
            .join("\n          ")}
        </ol>
      </section>

      <section class="case-section" aria-labelledby="result">
        <h2 id="result"><span aria-hidden="true">03</span>${esc(t.result)}</h2>
        <ul class="case-results">
          ${study.result.map((r) => `<li>${inline(r)}</li>`).join("\n          ")}
        </ul>
      </section>

      <section class="case-section" aria-labelledby="next">
        <h2 id="next"><span aria-hidden="true">04</span>${esc(t.next)}</h2>
        <p>${inline(study.next)}</p>
      </section>`
    : text.highlights.length
    ? `
      <section class="case-section" aria-labelledby="highlights">
        <h2 id="highlights">${esc(t.highlights)}</h2>
        <ul class="case-results">
          ${text.highlights.map((item) => `<li>${inline(item)}</li>`).join("\n          ")}
        </ul>
      </section>`
    : "";

  const more = similar(project)
    .map((p) => {
      const pt = localize(p, lang);
      return `<li><a class="similar-card" href="${pagePath(p.slug, lang)}"><img src="/catalog/${esc(
        p.media.poster
      )}.webp" alt="" width="640" height="360" loading="lazy"><span>${esc(pt.title)}</span></a></li>`;
    })
    .join("");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: text.title,
    description,
    url: canonical,
    inLanguage: t.htmlLang,
    image: `${SITE}${ogImagePath(project.slug, lang)}`,
    keywords: project.stack.join(", "),
    author: { "@type": "Person", name: "Jonathan Mesquita", url: `${SITE}/` },
    ...(project.links.live && !locked ? { sameAs: project.links.live } : {})
  };

  return `<!doctype html>
<html lang="${t.htmlLang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(pageTitle)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="author" content="Jonathan Mesquita" />
  <meta name="theme-color" content="#1B1D1A" />
  <link rel="canonical" href="${canonical}" />
  <link rel="alternate" hreflang="en" href="${pageUrl(project.slug, "en")}" />
  <link rel="alternate" hreflang="pt-BR" href="${pageUrl(project.slug, "pt")}" />
  <link rel="alternate" hreflang="x-default" href="${pageUrl(project.slug, "en")}" />

  <meta property="og:type" content="article" />
  <meta property="og:title" content="${esc(`${text.title} — ${kind}`)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:site_name" content="Jonathan Mesquita" />
  <meta property="og:locale" content="${lang === "pt" ? "pt_BR" : "en_US"}" />
  <meta property="og:image" content="${SITE}${ogImagePath(project.slug, lang)}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${esc(`${text.title} — ${text.category}`)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(`${text.title} — ${kind}`)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${SITE}${ogImagePath(project.slug, lang)}" />

  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
  <script type="module" src="/src/work-page.js"></script>
</head>
<body class="case-page" data-slug="${esc(project.slug)}" data-lang="${lang}">
  <a class="skip-link" href="#main-content">${lang === "pt" ? "Pular para o conteúdo" : "Skip to content"}</a>

  <header class="case-header">
    <a class="brand" href="${lang === "pt" ? "/?lang=pt" : "/"}" aria-label="JM. — Jonathan Mesquita">JM<span>.</span></a>
    <a class="case-back" href="${t.home}"><span aria-hidden="true">← </span>${esc(t.allProjects)}</a>
    <a class="lang-switch" href="${pagePath(project.slug, other)}" hreflang="${PAGE_TEXT[other].htmlLang}" lang="${
      PAGE_TEXT[other].htmlLang
    }" data-lang-switch="${other}" aria-label="${esc(t.switchLabel)}" title="${esc(t.switchLabel)}">${other.toUpperCase()}</a>
  </header>

  <main id="main-content" tabindex="-1">
    <section class="case-hero${locked ? " is-locked" : ""}">
      <div class="case-hero-copy">
        <p class="billboard-meta">
          <span class="title-badge title-badge-${project.status}">${esc(ui[`status_${project.status}`])}</span>
          <span>${esc(kind)}</span>
          <span>${esc(text.category)}</span>
          <span>${esc(project.year)}</span>
        </p>
        <h1>${esc(text.title)}</h1>
        <p class="case-description">${esc(text.description)}</p>
        <div class="dialog-actions">${actions}</div>
      </div>
      <div class="case-media">${media}</div>
    </section>

    <div class="case-layout">
      <article class="case-body">${body}
      </article>

      <aside class="case-facts" aria-label="${esc(ui.stack)}">
        <dl class="dialog-facts">
          <dt>${esc(ui.stack)}</dt>
          <dd>${esc(project.stack.join(" · "))}</dd>
          <dt>${esc(ui.status)}</dt>
          <dd>${esc(status)}</dd>
          <dt>${esc(t.links)}</dt>
          <dd>
            <button type="button" class="dialog-copy" data-copy="${canonical}"><span class="copy-label" aria-live="polite">${esc(
              ui.copyLink
            )}</span></button>
          </dd>
        </dl>
      </aside>
    </div>

    ${
      more
        ? `<section class="case-more" aria-labelledby="more">
      <h2 id="more">${esc(t.more)}</h2>
      <ul class="case-more-list" role="list">${more}</ul>
    </section>`
        : ""
    }
  </main>

  <footer class="site-meta case-footer">
    <span>JM.DEV.BR</span>
    <span>${esc(t.footer)}</span>
  </footer>
</body>
</html>
`;
}

export function allPages() {
  return projects.flatMap((project) =>
    ["en", "pt"].map((lang) => ({
      project,
      lang,
      file: `${lang === "pt" ? "pt/" : ""}work/${project.slug}/index.html`,
      url: pageUrl(project.slug, lang)
    }))
  );
}

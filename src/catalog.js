/*
 * Streaming-style project catalog: billboard, genre filters, scrollable rows
 * of title cards with hover previews, and a details dialog.
 *
 * Everything is built with DOM APIs (no innerHTML), so project text can never
 * be interpreted as markup. Text comes in English or Portuguese (see
 * src/project-text.js); switching language re-renders the catalog.
 */

import {
  projects,
  featuredSlug,
  catalogRows,
  genreFilters
} from "./data/projects.js";
import { UI } from "./i18n.js";
import {
  localize,
  rowTitle,
  filterLabel,
  caseStudyFor,
  pagePath,
  pageUrl
} from "./project-text.js";
import { track } from "./analytics.js";

const MEDIA_PATH = "/catalog/";
const PREVIEW_DELAY_MS = 450;

const bySlug = new Map(projects.map((project) => [project.slug, project]));

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

let lang = "en";
const ui = () => UI[lang];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function h(tag, attributes = {}, ...children) {
  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(attributes)) {
    if (value === null || value === undefined || value === false) continue;

    if (key === "class") element.className = value;
    else if (key === "dataset") Object.assign(element.dataset, value);
    else if (key.startsWith("on")) element.addEventListener(key.slice(2), value);
    else if (value === true) element.setAttribute(key, "");
    else element.setAttribute(key, value);
  }

  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    element.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }

  return element;
}

function mediaUrl(name, extension) {
  return `${MEDIA_PATH}${name}.${extension}`;
}

function canAutoplayPreview() {
  const saveData = navigator.connection && navigator.connection.saveData;
  return !reducedMotion.matches && !saveData;
}

function statusLabel(project) {
  return ui()[`status_${project.status}`];
}

function statusBadge(project) {
  return h("span", { class: `title-badge title-badge-${project.status}` }, statusLabel(project));
}

/* Projects still being built are shown locked: blurred art, a padlock,
   no preview and no links until they ship. */
function isLocked(project) {
  return project.status === "building";
}

const SVG_NS = "http://www.w3.org/2000/svg";

function lockIcon() {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.classList.add("lock-icon");

  const shackle = document.createElementNS(SVG_NS, "path");
  shackle.setAttribute("d", "M7.5 10.5V7.75a4.5 4.5 0 0 1 9 0v2.75");
  const body = document.createElementNS(SVG_NS, "rect");
  Object.entries({ x: "4.5", y: "10.5", width: "15", height: "10.5", rx: "2" })
    .forEach(([key, value]) => body.setAttribute(key, value));
  const keyhole = document.createElementNS(SVG_NS, "path");
  keyhole.setAttribute("d", "M12 14.5v2.5");

  svg.append(shackle, body, keyhole);
  return svg;
}

function lockOverlay() {
  return h(
    "span",
    { class: "lock-overlay", "aria-hidden": "true" },
    lockIcon(),
    h("span", { class: "lock-text" }, ui().unlocksSoon)
  );
}

function placeholderPoster() {
  return h(
    "span",
    { class: "title-placeholder", "aria-hidden": "true" },
    h("span", { class: "title-placeholder-mark" }, "JM.")
  );
}

function externalLink(href, label, variant, onclick) {
  return h(
    "a",
    { class: `button ${variant}`, href, target: "_blank", rel: "noopener noreferrer", onclick },
    label,
    h("span", { "aria-hidden": "true" }, " ↗"),
    h("span", { class: "visually-hidden" }, ui().newTab)
  );
}

/* ------------------------------------------------------------------ */
/* Title card                                                          */
/* ------------------------------------------------------------------ */

function startPreview(card) {
  const video = card.querySelector("video");
  if (!video || !canAutoplayPreview()) return;

  card._previewTimer = window.setTimeout(() => {
    if (!video.src) video.src = video.dataset.src;

    const playing = video.play();
    if (playing && typeof playing.catch === "function") playing.catch(() => {});

    card.classList.add("is-previewing");
  }, PREVIEW_DELAY_MS);
}

function stopPreview(card) {
  window.clearTimeout(card._previewTimer);

  const video = card.querySelector("video");
  if (video) video.pause();

  card.classList.remove("is-previewing");
}

function titleCard(project, { rank } = {}) {
  const locked = isLocked(project);
  const text = localize(project, lang);

  const media = project.media
    ? [
        h("img", {
          src: mediaUrl(project.media.poster, "webp"),
          alt: "",
          width: "640",
          height: "360",
          loading: "lazy",
          decoding: "async"
        }),
        project.media.video && !locked
          ? h("video", {
              "data-src": mediaUrl(project.media.video, "mp4"),
              muted: true,
              loop: true,
              playsinline: true,
              preload: "none",
              "aria-hidden": "true",
              tabindex: "-1"
            })
          : null
      ]
    : [placeholderPoster()];

  if (locked) media.push(lockOverlay());

  const card = h(
    "button",
    {
      type: "button",
      class: `title-card${locked ? " is-locked" : ""}`,
      "aria-haspopup": "dialog",
      dataset: { slug: project.slug }
    },
    h("span", { class: "title-media" }, media),
    h(
      "span",
      { class: "title-info" },
      statusBadge(project),
      h("span", { class: "title-name" }, text.title),
      h("span", { class: "title-meta" }, `${text.category} · ${project.year}`)
    )
  );

  /* `muted` as an attribute is not enough for autoplay in every browser. */
  const video = card.querySelector("video");
  if (video) video.muted = true;

  card.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse" && finePointer.matches) startPreview(card);
  });
  card.addEventListener("pointerleave", () => stopPreview(card));
  card.addEventListener("focus", () => {
    if (card.matches(":focus-visible")) startPreview(card);
  });
  card.addEventListener("blur", () => stopPreview(card));

  if (rank) {
    return h(
      "li",
      { class: "title-item title-item-ranked" },
      h("span", { class: "title-rank", "aria-hidden": "true" }, String(rank)),
      card
    );
  }

  return h("li", { class: "title-item" }, card);
}

/* ------------------------------------------------------------------ */
/* Rows                                                                */
/* ------------------------------------------------------------------ */

function updateRowArrows(track, previous, next) {
  const maxScroll = track.scrollWidth - track.clientWidth - 2;

  previous.disabled = track.scrollLeft <= 2;
  next.disabled = track.scrollLeft >= maxScroll;
}

function catalogRow(row) {
  const items = row.items.map((slug) => bySlug.get(slug)).filter(Boolean);
  const headingId = `row-${row.id}`;
  const title = rowTitle(row, lang);

  const track = h(
    "ul",
    { class: "row-track", role: "list", "aria-labelledby": headingId },
    items.map((project, index) => titleCard(project, { rank: row.ranked ? index + 1 : null }))
  );

  const scrollBy = (direction) => {
    track.scrollBy({
      left: direction * track.clientWidth * 0.85,
      behavior: reducedMotion.matches ? "auto" : "smooth"
    });
  };

  const arrow = (direction, label, glyph) =>
    h(
      "button",
      {
        type: "button",
        class: `row-arrow row-arrow-${direction > 0 ? "next" : "prev"}`,
        "aria-label": label,
        onclick: () => scrollBy(direction)
      },
      h("span", { "aria-hidden": "true" }, glyph)
    );

  const previous = arrow(-1, ui().scrollBack(title), "‹");
  const next = arrow(1, ui().scrollForward(title), "›");

  track.addEventListener("scroll", () => updateRowArrows(track, previous, next), { passive: true });

  const section = h(
    "section",
    { class: `catalog-row${row.ranked ? " catalog-row-ranked" : ""}`, dataset: { row: row.id } },
    h(
      "div",
      { class: "row-heading" },
      h("h3", { id: headingId }, title),
      h("span", { class: "row-count" }, `${items.length} ${ui().titles}`)
    ),
    h("div", { class: "row-viewport" }, previous, track, next)
  );

  section._refreshArrows = () => updateRowArrows(track, previous, next);

  return section;
}

/* ------------------------------------------------------------------ */
/* Billboard                                                           */
/* ------------------------------------------------------------------ */

function billboard(project, openDetails) {
  const text = localize(project, lang);
  const toolCount = catalogRows.find((row) => row.id === "arriba-tools")?.items.length;
  const hasCase = Boolean(caseStudyFor(project.slug, lang));

  return h(
    "div",
    { class: "billboard" },
    project.media?.billboard
      ? h("img", {
          class: "billboard-art",
          src: mediaUrl(project.media.billboard, "webp"),
          alt: "",
          width: "1600",
          height: "900",
          fetchpriority: "low",
          decoding: "async"
        })
      : null,
    h(
      "div",
      { class: "billboard-copy" },
      h(
        "p",
        { class: "billboard-kicker" },
        h("span", { class: "billboard-mark", "aria-hidden": "true" }, "JM"),
        ui().featured
      ),
      h("h3", { class: "billboard-title" }, text.title),
      h(
        "p",
        { class: "billboard-meta" },
        statusBadge(project),
        h("span", {}, project.year),
        h("span", {}, text.category),
        toolCount ? h("span", {}, ui().toolsInCatalog(toolCount)) : null
      ),
      h("p", { class: "billboard-description" }, text.description),
      h(
        "div",
        { class: "billboard-actions" },
        project.links.live
          ? h(
              "a",
              {
                class: "button button-light",
                href: project.links.live,
                target: "_blank",
                rel: "noopener noreferrer",
                onclick: () => track("Outbound", { slug: project.slug, kind: "live" })
              },
              h("span", { "aria-hidden": "true" }, "▶"),
              ui().openLive,
              h("span", { class: "visually-hidden" }, ui().newTab)
            )
          : null,
        h(
          "button",
          {
            type: "button",
            class: "button button-ghost",
            "aria-haspopup": "dialog",
            onclick: (event) => openDetails(project.slug, event.currentTarget, "billboard")
          },
          h("span", { "aria-hidden": "true" }, "ⓘ"),
          ui().moreInfo
        ),
        hasCase
          ? h("a", { class: "billboard-link", href: pagePath(project.slug, lang) }, ui().caseStudy, h("span", { "aria-hidden": "true" }, " →"))
          : null
      )
    )
  );
}

/* ------------------------------------------------------------------ */
/* Details dialog                                                      */
/* ------------------------------------------------------------------ */

function createDialog() {
  const dialog = h("dialog", {
    class: "title-dialog",
    "aria-labelledby": "title-dialog-heading"
  });

  /* Click on the backdrop (the dialog box itself, outside the panel) closes. */
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  return dialog;
}

function similarTo(project) {
  return projects
    .filter(
      (other) =>
        other.slug !== project.slug &&
        other.media &&
        !isLocked(other) &&
        other.genres.some((genre) => project.genres.includes(genre))
    )
    .slice(0, 3);
}

async function copyLink(button, url) {
  const label = button.querySelector(".copy-label");
  try {
    await navigator.clipboard.writeText(url);
    label.textContent = ui().copied;
  } catch {
    /* Clipboard blocked: show the URL so it can be copied by hand. */
    label.textContent = url;
  }
  window.setTimeout(() => {
    label.textContent = ui().copyLink;
  }, 2200);
}

function fillDialog(dialog, project, openDetails) {
  const allowAutoplay = canAutoplayPreview();
  const locked = isLocked(project);
  const text = localize(project, lang);
  const hasCase = Boolean(caseStudyFor(project.slug, lang));

  const media = locked
    ? h(
        "div",
        { class: "dialog-locked" },
        project.media
          ? h("img", { src: mediaUrl(project.media.poster, "webp"), alt: "", width: "640", height: "360" })
          : placeholderPoster(),
        lockOverlay()
      )
    : project.media
    ? h("video", {
        class: "dialog-video",
        src: mediaUrl(project.media.video, "mp4"),
        poster: mediaUrl(project.media.poster, "webp"),
        muted: true,
        loop: true,
        playsinline: true,
        autoplay: allowAutoplay,
        controls: !allowAutoplay,
        preload: allowAutoplay ? "auto" : "none",
        width: "640",
        height: "360",
        "aria-label": ui().preview(text.title)
      })
    : h("div", { class: "dialog-placeholder" }, placeholderPoster());

  const outbound = (kind) => () => track("Outbound", { slug: project.slug, kind });

  const actions = locked
    ? []
    : [
        project.links.live ? externalLink(project.links.live, ui().openLive, "button-light", outbound("live")) : null,
        project.links.code ? externalLink(project.links.code, ui().viewCode, "button-ghost", outbound("code")) : null
      ].filter(Boolean);

  const pageLinks = h(
    "div",
    { class: "dialog-page-links" },
    h(
      "a",
      { class: "dialog-page-link", href: pagePath(project.slug, lang) },
      hasCase ? ui().caseStudy : ui().projectPage,
      h("span", { "aria-hidden": "true" }, " →")
    ),
    h(
      "button",
      {
        type: "button",
        class: "dialog-copy",
        onclick: (event) => {
          copyLink(event.currentTarget, pageUrl(project.slug, lang));
          track("Copy link", { slug: project.slug });
        }
      },
      h("span", { class: "copy-label", "aria-live": "polite" }, ui().copyLink)
    )
  );

  const similar = similarTo(project);

  dialog.replaceChildren(
    h(
      "div",
      { class: "dialog-panel", lang: lang === "pt" ? "pt-BR" : "en" },
      h(
        "button",
        { type: "button", class: "dialog-close", "aria-label": ui().close, onclick: () => dialog.close() },
        h("span", { "aria-hidden": "true" }, "×")
      ),
      h("div", { class: "dialog-media" }, media),
      h(
        "div",
        { class: "dialog-body" },
        h(
          "div",
          { class: "dialog-main" },
          h(
            "p",
            { class: "billboard-meta" },
            statusBadge(project),
            h("span", {}, project.year),
            h("span", {}, text.category)
          ),
          h("h3", { id: "title-dialog-heading" }, text.title),
          h("p", { class: "dialog-description" }, text.description),
          text.highlights.length
            ? h("ul", { class: "dialog-highlights" }, text.highlights.map((item) => h("li", {}, item)))
            : null,
          actions.length
            ? h("div", { class: "dialog-actions" }, actions)
            : h("p", { class: "dialog-note" }, lockIcon(), ui().lockedNote),
          pageLinks
        ),
        h(
          "dl",
          { class: "dialog-facts" },
          h("dt", {}, ui().stack),
          h("dd", {}, project.stack.join(" · ")),
          h("dt", {}, ui().status),
          h("dd", {}, locked ? ui().lockedStatus : statusLabel(project))
        )
      ),
      similar.length
        ? h(
            "div",
            { class: "dialog-similar" },
            h("h4", {}, ui().moreLikeThis),
            h(
              "ul",
              { role: "list" },
              similar.map((other) =>
                h(
                  "li",
                  {},
                  h(
                    "button",
                    { type: "button", class: "similar-card", onclick: () => openDetails(other.slug, null, "similar") },
                    h("img", {
                      src: mediaUrl(other.media.poster, "webp"),
                      alt: "",
                      width: "640",
                      height: "360",
                      loading: "lazy"
                    }),
                    h("span", {}, localize(other, lang).title)
                  )
                )
              )
            )
          )
        : null
    )
  );

  /* Same muted-property caveat as the cards. */
  const video = dialog.querySelector("video");
  if (video) video.muted = true;
}

/* ------------------------------------------------------------------ */
/* Filters                                                             */
/* ------------------------------------------------------------------ */

function matchesFilter(project, filterId) {
  if (filterId === "all") return true;
  if (filterId === "live" || filterId === "building") return project.status === filterId;
  return project.genres.includes(filterId);
}

/* ------------------------------------------------------------------ */
/* Mount                                                               */
/* ------------------------------------------------------------------ */

export function mountCatalog(root, { initialLang = "en" } = {}) {
  if (!root) return { setLang() {} };

  lang = initialLang;

  const dialog = createDialog();
  let returnFocusTo = null;
  let currentSlug = null;
  let currentFilter = "all";
  let rows = [];
  let rowsWrap;
  let grid;
  let status;
  let chips = [];

  const hashFor = (slug) => `#work/${slug}`;

  function openDetails(slug, opener, source = "card") {
    const project = bySlug.get(slug);
    if (!project) return;

    if (!dialog.open) returnFocusTo = opener || document.activeElement;
    currentSlug = slug;

    fillDialog(dialog, project, openDetails);

    if (!dialog.open) dialog.showModal();
    dialog.querySelector(".dialog-close").focus();
    dialog.scrollTop = 0;

    if (location.hash !== hashFor(slug)) history.replaceState(null, "", hashFor(slug));

    track("Open title", { slug, source });
  }

  dialog.addEventListener("close", () => {
    dialog.querySelector("video")?.pause();
    currentSlug = null;

    if (location.hash.startsWith("#work/")) {
      history.replaceState(null, "", `${location.pathname}${location.search}#work`);
    }

    if (returnFocusTo && document.contains(returnFocusTo)) returnFocusTo.focus();
    returnFocusTo = null;
  });

  function applyFilter(filterId, { announce = true } = {}) {
    currentFilter = filterId;

    for (const chip of chips) {
      chip.setAttribute("aria-pressed", String(chip.dataset.filter === filterId));
    }

    if (filterId === "all") {
      grid.hidden = true;
      rowsWrap.hidden = false;
      rows.forEach((row) => row._refreshArrows());
      if (announce) status.textContent = ui().showingAll(projects.length);
      return;
    }

    const matches = projects.filter((project) => matchesFilter(project, filterId));
    grid.replaceChildren(...matches.map((project) => titleCard(project)));
    grid.hidden = false;
    rowsWrap.hidden = true;

    const label = filterLabel(genreFilters.find((filter) => filter.id === filterId), lang);
    if (announce) status.textContent = ui().filtered(label, matches.length);
  }

  function render() {
    rows = catalogRows.map(catalogRow);
    rowsWrap = h("div", { class: "catalog-rows" }, rows);
    grid = h("ul", { class: "catalog-grid", role: "list", hidden: true });
    status = h("p", { class: "visually-hidden", role: "status" });

    /* A filter with no matching title is not shown ("Unlocks soon" disappears
       while nothing is locked, and comes back with the next locked title). */
    const usefulFilters = genreFilters.filter(
      (filter) => filter.id === "all" || projects.some((project) => matchesFilter(project, filter.id))
    );

    chips = usefulFilters.map((filter) =>
      h(
        "button",
        {
          type: "button",
          class: "genre-chip",
          "aria-pressed": "false",
          dataset: { filter: filter.id }
        },
        filterLabel(filter, lang)
      )
    );

    const filterBar = h("div", { class: "genre-bar", role: "group", "aria-label": ui().filterLabel }, chips);

    filterBar.addEventListener("click", (event) => {
      const chip = event.target.closest(".genre-chip");
      if (!chip) return;
      applyFilter(chip.dataset.filter);
      track("Filter", { filter: chip.dataset.filter });
    });

    content.replaceChildren(billboard(bySlug.get(featuredSlug), openDetails), filterBar, status, rowsWrap, grid);

    applyFilter(currentFilter, { announce: false });
  }

  /* One delegated listener opens details for every card (rows and grid). */
  root.addEventListener("click", (event) => {
    const card = event.target.closest(".title-card");
    if (card) {
      stopPreview(card);
      openDetails(card.dataset.slug, card);
    }
  });

  /* The dialog stays outside the re-rendered part, so switching language
     while it is open doesn't remove it from the top layer. */
  const content = h("div", { class: "catalog-content" });
  root.replaceChildren(content, dialog);

  render();

  window.addEventListener("resize", () => rows.forEach((row) => row._refreshArrows()), { passive: true });

  /* Deep link: jm.dev.br/#work/arriba-jump opens that title. */
  function openFromHash() {
    const match = location.hash.match(/^#work\/([\w-]+)$/);
    if (match && bySlug.has(match[1])) {
      document.getElementById("work")?.scrollIntoView({ block: "start" });
      openDetails(match[1], null, "link");
    }
  }

  window.addEventListener("hashchange", openFromHash);
  openFromHash();

  return {
    setLang(newLang) {
      if (newLang === lang) return;
      lang = newLang;
      const openSlug = currentSlug;
      render();
      if (openSlug) fillDialog(dialog, bySlug.get(openSlug), openDetails);
    }
  };
}

export const catalogSize = projects.length;

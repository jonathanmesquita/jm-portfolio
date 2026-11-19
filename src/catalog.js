/*
 * Streaming-style project catalog: billboard, genre filters, scrollable rows
 * of title cards with hover previews, and a details dialog.
 *
 * Everything is built with DOM APIs (no innerHTML), so project text can never
 * be interpreted as markup.
 */

import {
  projects,
  featuredSlug,
  catalogRows,
  genreFilters
} from "./data/projects.js";

const MEDIA_PATH = "/catalog/";
const PREVIEW_DELAY_MS = 450;

const STATUS_LABEL = {
  live: "Live",
  building: "Locked",
  archive: "Archive"
};

const bySlug = new Map(projects.map((project) => [project.slug, project]));

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

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

function statusBadge(project) {
  return h(
    "span",
    { class: `title-badge title-badge-${project.status}` },
    STATUS_LABEL[project.status]
  );
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
    h("span", { class: "lock-text" }, "Unlocks soon")
  );
}

function placeholderPoster() {
  return h(
    "span",
    { class: "title-placeholder", "aria-hidden": "true" },
    h("span", { class: "title-placeholder-mark" }, "JM.")
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
      h("span", { class: "title-name" }, project.title),
      h("span", { class: "title-meta" }, `${project.category} · ${project.year}`)
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

  const track = h(
    "ul",
    { class: "row-track", role: "list", "aria-labelledby": headingId },
    items.map((project, index) =>
      titleCard(project, { rank: row.ranked ? index + 1 : null })
    )
  );

  const scrollBy = (direction) => {
    track.scrollBy({
      left: direction * track.clientWidth * 0.85,
      behavior: reducedMotion.matches ? "auto" : "smooth"
    });
  };

  const previous = h(
    "button",
    {
      type: "button",
      class: "row-arrow row-arrow-prev",
      "aria-label": `Scroll ${row.title} back`,
      onclick: () => scrollBy(-1)
    },
    h("span", { "aria-hidden": "true" }, "‹")
  );

  const next = h(
    "button",
    {
      type: "button",
      class: "row-arrow row-arrow-next",
      "aria-label": `Scroll ${row.title} forward`,
      onclick: () => scrollBy(1)
    },
    h("span", { "aria-hidden": "true" }, "›")
  );

  track.addEventListener("scroll", () => updateRowArrows(track, previous, next), {
    passive: true
  });

  const section = h(
    "section",
    { class: `catalog-row${row.ranked ? " catalog-row-ranked" : ""}`, dataset: { row: row.id } },
    h(
      "div",
      { class: "row-heading" },
      h("h3", { id: headingId }, row.title),
      h("span", { class: "row-count" }, `${items.length} titles`)
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
  const toolCount = catalogRows
    .find((row) => row.id === "arriba-tools")
    ?.items.length;

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
        "Featured project"
      ),
      h("h3", { class: "billboard-title" }, project.title),
      h(
        "p",
        { class: "billboard-meta" },
        statusBadge(project),
        h("span", {}, project.year),
        h("span", {}, project.category),
        toolCount ? h("span", {}, `${toolCount} tools in this catalog`) : null
      ),
      h("p", { class: "billboard-description" }, project.description),
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
                rel: "noopener noreferrer"
              },
              h("span", { "aria-hidden": "true" }, "▶ "),
              "Open live",
              h("span", { class: "visually-hidden" }, " (opens in a new tab)")
            )
          : null,
        h(
          "button",
          {
            type: "button",
            class: "button button-ghost",
            "aria-haspopup": "dialog",
            onclick: (event) => openDetails(project.slug, event.currentTarget)
          },
          h("span", { "aria-hidden": "true" }, "ⓘ "),
          "More info & preview"
        )
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

function linkButton(href, label, variant) {
  return h(
    "a",
    {
      class: `button ${variant}`,
      href,
      target: "_blank",
      rel: "noopener noreferrer"
    },
    label,
    h("span", { "aria-hidden": "true" }, " ↗"),
    h("span", { class: "visually-hidden" }, " (opens in a new tab)")
  );
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

function fillDialog(dialog, project, openDetails) {
  const allowAutoplay = canAutoplayPreview();
  const locked = isLocked(project);

  const media = locked
    ? h(
        "div",
        { class: "dialog-locked" },
        project.media
          ? h("img", {
              src: mediaUrl(project.media.poster, "webp"),
              alt: "",
              width: "640",
              height: "360"
            })
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
        "aria-label": `Silent preview of ${project.title}`
      })
    : h("div", { class: "dialog-placeholder" }, placeholderPoster());

  const actions = locked ? [] : [
    project.links.live ? linkButton(project.links.live, "Open live", "button-light") : null,
    project.links.code ? linkButton(project.links.code, "View code", "button-ghost") : null
  ].filter(Boolean);

  const similar = similarTo(project);

  dialog.replaceChildren(
    h(
      "div",
      { class: "dialog-panel" },
      h(
        "button",
        {
          type: "button",
          class: "dialog-close",
          "aria-label": "Close details",
          onclick: () => dialog.close()
        },
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
            h("span", {}, project.category)
          ),
          h("h3", { id: "title-dialog-heading" }, project.title),
          h("p", { class: "dialog-description" }, project.description),
          project.highlights.length
            ? h(
                "ul",
                { class: "dialog-highlights" },
                project.highlights.map((item) => h("li", {}, item))
              )
            : null,
          actions.length
            ? h("div", { class: "dialog-actions" }, actions)
            : h(
                "p",
                { class: "dialog-note" },
                lockIcon(),
                "Still in the workshop. This title unlocks as soon as it ships."
              )
        ),
        h(
          "dl",
          { class: "dialog-facts" },
          h("dt", {}, "Stack"),
          h("dd", {}, project.stack.join(" · ")),
          h("dt", {}, "Status"),
          h("dd", {}, locked ? "Locked · in development" : STATUS_LABEL[project.status])
        )
      ),
      similar.length
        ? h(
            "div",
            { class: "dialog-similar" },
            h("h4", {}, "More like this"),
            h(
              "ul",
              { role: "list" },
              similar.map((other) =>
                h(
                  "li",
                  {},
                  h(
                    "button",
                    {
                      type: "button",
                      class: "similar-card",
                      onclick: () => openDetails(other.slug)
                    },
                    h("img", {
                      src: mediaUrl(other.media.poster, "webp"),
                      alt: "",
                      width: "640",
                      height: "360",
                      loading: "lazy"
                    }),
                    h("span", {}, other.title)
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

export function mountCatalog(root) {
  if (!root) return;

  const dialog = createDialog();
  let returnFocusTo = null;

  const hashFor = (slug) => `#work/${slug}`;

  function openDetails(slug, opener) {
    const project = bySlug.get(slug);
    if (!project) return;

    if (!dialog.open) returnFocusTo = opener || document.activeElement;

    fillDialog(dialog, project, openDetails);

    if (!dialog.open) dialog.showModal();
    dialog.querySelector(".dialog-close").focus();
    dialog.scrollTop = 0;

    if (location.hash !== hashFor(slug)) {
      history.replaceState(null, "", hashFor(slug));
    }
  }

  dialog.addEventListener("close", () => {
    dialog.querySelector("video")?.pause();

    if (location.hash.startsWith("#work/")) {
      history.replaceState(null, "", `${location.pathname}${location.search}#work`);
    }

    if (returnFocusTo && document.contains(returnFocusTo)) returnFocusTo.focus();
    returnFocusTo = null;
  });

  const rows = catalogRows.map(catalogRow);
  const rowsWrap = h("div", { class: "catalog-rows" }, rows);

  const grid = h("ul", { class: "catalog-grid", role: "list", hidden: true });
  const status = h("p", { class: "visually-hidden", role: "status" });

  const chips = genreFilters.map((filter) =>
    h(
      "button",
      {
        type: "button",
        class: "genre-chip",
        "aria-pressed": filter.id === "all" ? "true" : "false",
        dataset: { filter: filter.id }
      },
      filter.label
    )
  );

  function applyFilter(filterId) {
    for (const chip of chips) {
      chip.setAttribute("aria-pressed", String(chip.dataset.filter === filterId));
    }

    if (filterId === "all") {
      grid.hidden = true;
      rowsWrap.hidden = false;
      rows.forEach((row) => row._refreshArrows());
      status.textContent = `Showing all ${projects.length} titles in rows.`;
      return;
    }

    const matches = projects.filter((project) => matchesFilter(project, filterId));
    grid.replaceChildren(...matches.map((project) => titleCard(project)));
    grid.hidden = false;
    rowsWrap.hidden = true;

    const label = genreFilters.find((filter) => filter.id === filterId).label;
    status.textContent = `${label}: ${matches.length} titles.`;
  }

  const filterBar = h(
    "div",
    { class: "genre-bar", role: "group", "aria-label": "Filter projects" },
    chips
  );

  filterBar.addEventListener("click", (event) => {
    const chip = event.target.closest(".genre-chip");
    if (chip) applyFilter(chip.dataset.filter);
  });

  /* One delegated listener opens details for every card (rows and grid). */
  root.addEventListener("click", (event) => {
    const card = event.target.closest(".title-card");
    if (card) {
      stopPreview(card);
      openDetails(card.dataset.slug, card);
    }
  });

  root.replaceChildren(
    billboard(bySlug.get(featuredSlug), openDetails),
    filterBar,
    status,
    rowsWrap,
    grid,
    dialog
  );

  const refreshAll = () => rows.forEach((row) => row._refreshArrows());
  refreshAll();
  window.addEventListener("resize", refreshAll, { passive: true });

  /* Deep link: jm.dev.br/#work/arriba-jump opens that title. */
  function openFromHash() {
    const match = location.hash.match(/^#work\/([\w-]+)$/);
    if (match && bySlug.has(match[1])) {
      document.getElementById("work")?.scrollIntoView({ block: "start" });
      openDetails(match[1]);
    }
  }

  window.addEventListener("hashchange", openFromHash);
  openFromHash();
}

export const catalogSize = projects.length;

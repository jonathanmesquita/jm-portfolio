/*
 * Behaviour for the static project pages (/work/<slug>/, /pt/work/<slug>/).
 * The pages are complete without this file; it only adds the niceties.
 */

import "@fontsource-variable/inter";
import "@fontsource-variable/manrope";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/catalog.css";
import "./styles/case.css";

import { rememberLang, UI } from "./i18n.js";
import { startAnalytics, track } from "./analytics.js";

const slug = document.body.dataset.slug;
const lang = document.body.dataset.lang === "pt" ? "pt" : "en";

/* Autoplay the silent preview only when motion and data allow it. */
const video = document.querySelector(".case-video");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const saveData = navigator.connection && navigator.connection.saveData;

if (video) {
  video.muted = true;
  if (!reducedMotion && !saveData) {
    video.preload = "auto";
    video.play().catch(() => {});
  }
}

/* Following the EN/PT link also remembers the choice for the home page. */
document.querySelector("[data-lang-switch]")?.addEventListener("click", (event) => {
  const next = event.currentTarget.dataset.langSwitch;
  rememberLang(next);
  track("Language", { lang: next });
});

/* Keep the home page in the same language when going back to the catalog. */
rememberLang(lang);

document.querySelectorAll("[data-outbound]").forEach((link) => {
  link.addEventListener("click", () => track("Outbound", { slug, kind: link.dataset.outbound }));
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const label = button.querySelector(".copy-label");
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      label.textContent = UI[lang].copied;
    } catch {
      label.textContent = button.dataset.copy;
    }
    track("Copy link", { slug });
    window.setTimeout(() => {
      label.textContent = UI[lang].copyLink;
    }, 2200);
  });
});

startAnalytics();

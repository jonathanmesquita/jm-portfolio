import "@fontsource-variable/inter";
import "@fontsource-variable/manrope";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/catalog.css";

import { mountCatalog, catalogSize } from "./catalog.js";
import { initialLang, rememberLang, translatePage, UI } from "./i18n.js";
import { startAnalytics, track } from "./analytics.js";
import { capabilities } from "./data/capabilities.js";

const catalogRoot = document.querySelector("#catalog");
const workCount = document.querySelector("#work-count");
const capabilitiesContainer = document.querySelector("#capabilities-list");
const backToTopButton = document.querySelector("#back-to-top");

function renderCapabilities() {
  if (!capabilitiesContainer) return;

  capabilitiesContainer.innerHTML = capabilities
    .map(
      (capability) => `
        <article class="capability">
          <div class="capability-index">
            ${capability.id}
          </div>

          <div class="capability-main">
            <p class="capability-label">
              ${capability.label}
            </p>

            <h3>
              ${capability.title}
            </h3>

            <p class="capability-description">
              ${capability.description}
            </p>

            <ul class="capability-skills">
              ${capability.skills
                .map(
                  (skill) => `
                    <li>
                      ${skill}
                    </li>
                  `
                )
                .join("")}
            </ul>
          </div>

          <div class="capability-proof">
            <span>
              Applied in
            </span>

            <strong>
              ${capability.proof}
            </strong>
          </div>
        </article>
      `
    )
    .join("");
}

function updateBackToTopButton() {
  if (!backToTopButton) return;

  const shouldShowButton = window.scrollY > 500;

  backToTopButton.classList.toggle(
    "is-visible",
    shouldShowButton
  );

  backToTopButton.setAttribute(
    "aria-hidden",
    String(!shouldShowButton)
  );

  backToTopButton.tabIndex = shouldShowButton
    ? 0
    : -1;
}

function scrollToTop() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion
      ? "auto"
      : "smooth"
  });
}

/* ?lang=pt (used by the hreflang alternate) wins over the stored choice. */
const requestedLang = new URLSearchParams(location.search).get("lang");
let lang = requestedLang === "pt" || requestedLang === "en" ? requestedLang : initialLang();

const catalog = mountCatalog(catalogRoot, { initialLang: lang });
const langSwitch = document.querySelector("#lang-switch");

function applyLang(nextLang) {
  lang = nextLang;
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";

  translatePage(document.body, lang);
  catalog.setLang(lang);

  if (workCount) workCount.textContent = `${catalogSize} ${UI[lang].titles}`;

  if (langSwitch) {
    const target = lang === "pt" ? "en" : "pt";
    langSwitch.textContent = target.toUpperCase();
    langSwitch.lang = target === "pt" ? "pt-BR" : "en";
    langSwitch.setAttribute("aria-label", UI[lang].switchLabel);
    langSwitch.title = UI[lang].switchLabel;
  }
}

langSwitch?.addEventListener("click", () => {
  const next = lang === "pt" ? "en" : "pt";
  rememberLang(next);
  applyLang(next);
  track("Language", { lang: next });
});

renderCapabilities();
applyLang(lang);
startAnalytics();

if (backToTopButton) {
  window.addEventListener(
    "scroll",
    updateBackToTopButton,
    { passive: true }
  );

  backToTopButton.addEventListener(
    "click",
    scrollToTop
  );

  updateBackToTopButton();
}
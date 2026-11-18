import "@fontsource-variable/inter";
import "@fontsource-variable/manrope";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/catalog.css";

import { mountCatalog, catalogSize } from "./catalog.js";
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

mountCatalog(catalogRoot);

if (workCount) workCount.textContent = `${catalogSize} titles`;
renderCapabilities();

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
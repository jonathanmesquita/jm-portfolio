import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";

import { projects } from "./data/projects.js";
import { capabilities } from "./data/capabilities.js";

const projectsContainer = document.querySelector("#projects");
const capabilitiesContainer = document.querySelector("#capabilities-list");
const backToTopButton = document.querySelector("#back-to-top");

function renderProjects() {
  if (!projectsContainer) return;

  projectsContainer.innerHTML = projects
    .map(
      (project) => `
        <article
          class="project ${project.featured ? "project-featured" : ""}"
        >
          <div class="project-index">
            ${project.id}
          </div>

          <div class="project-content">
            ${
              project.featured
                ? `
                  <span class="project-featured-label">
                    Featured project
                  </span>
                `
                : ""
            }

            <div class="project-meta">
              <span>
                ${project.category}
              </span>

              <span>
                ${project.year}
              </span>
            </div>

            <h3>
              ${project.title}
            </h3>

            <p class="project-description">
              ${project.description}
            </p>

            <ul class="project-stack">
              ${project.stack
                .map(
                  (technology) => `
                    <li>
                      ${technology}
                    </li>
                  `
                )
                .join("")}
            </ul>
          </div>

          <div class="project-actions">
            <span class="project-status">
              <span
                class="project-status-dot"
                aria-hidden="true"
              ></span>

              ${project.status}
            </span>

            ${
              project.liveUrl
                ? `
                  <a
                    class="project-link"
                    href="${project.liveUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View project ↗
                  </a>
                `
                : `
                  <span class="project-coming">
                    In development
                  </span>
                `
            }
          </div>
        </article>
      `
    )
    .join("");
}

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

renderProjects();
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
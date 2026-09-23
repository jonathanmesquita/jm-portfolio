import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";

import { projects } from "./data/projects.js";

const projectsContainer = document.querySelector("#projects");

function renderProjects() {
  projectsContainer.innerHTML = projects
    .map(
      (project) => `
        <article class="project">
          <div class="project-index">
            ${project.id}
          </div>

          <div class="project-content">
            <div class="project-meta">
              <span>${project.category}</span>
              <span>${project.year}</span>
            </div>

            <h3>${project.title}</h3>

            <p class="project-description">
              ${project.description}
            </p>

            <ul class="project-stack">
              ${project.stack
                .map((technology) => `<li>${technology}</li>`)
                .join("")}
            </ul>
          </div>

          <div class="project-actions">
            <span class="project-status">
              ${project.status}
            </span>

            ${
              project.liveUrl
                ? `
                  <a
                    href="${project.liveUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live ↗
                  </a>
                `
                : ""
            }
          </div>
        </article>
      `
    )
    .join("");
}

renderProjects();
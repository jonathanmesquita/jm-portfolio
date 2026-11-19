/*
 * Language helpers shared by the catalog (browser) and the project-page
 * generator (Node, at build time). No DOM here.
 */

import { projectsPt, rowsPt, filtersPt } from "./data/projects-pt.js";
import { caseStudies } from "./data/case-studies.js";

export const SITE = "https://jm.dev.br";

/* Title, category, description and highlights in the requested language;
   anything not translated falls back to English. */
export function localize(project, lang) {
  const pt = lang === "pt" ? projectsPt[project.slug] || {} : {};
  return {
    title: pt.title || project.title,
    category: pt.category || project.category,
    description: pt.description || project.description,
    highlights: pt.highlights || project.highlights
  };
}

export function rowTitle(row, lang) {
  return (lang === "pt" && rowsPt[row.id]) || row.title;
}

export function filterLabel(filter, lang) {
  return (lang === "pt" && filtersPt[filter.id]) || filter.label;
}

export function caseStudyFor(slug, lang) {
  const study = caseStudies[slug];
  return study ? study[lang] || study.en : null;
}

/* /work/<slug>/ in English, /pt/work/<slug>/ in Portuguese. */
export function pagePath(slug, lang) {
  return `${lang === "pt" ? "/pt" : ""}/work/${slug}/`;
}

export function pageUrl(slug, lang) {
  return `${SITE}${pagePath(slug, lang)}`;
}

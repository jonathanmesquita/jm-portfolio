/*
 * Vercel Web Analytics: cookieless page views, plus a few named events.
 *
 * Page views need "Analytics" switched on in the Vercel project (Analytics
 * tab). Custom events (`track`) are only recorded on plans that include them;
 * on other plans the call is a no-op, so the code stays the same either way.
 *
 * Events sent (no personal data, only which title/filter):
 *   Open title {slug, source}  Filter {filter}  Outbound {slug, kind}
 *   Language {lang}            Copy link {slug}
 */

import { inject, track as vercelTrack } from "@vercel/analytics";

let started = false;

export function startAnalytics() {
  if (started) return;
  started = true;
  inject({ mode: import.meta.env.PROD ? "production" : "development", debug: false });
}

export function track(name, properties) {
  try {
    vercelTrack(name, properties);
  } catch {
    /* Analytics must never break the page. */
  }
}

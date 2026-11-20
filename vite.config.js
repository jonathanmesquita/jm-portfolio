import fs from "node:fs";
import { defineConfig } from "vite";
import { projectPages } from "./scripts/pages/plugin.mjs";

/* `vite preview` (used by the tests) sends the same headers Vercel sends in production,
   so the end-to-end tests run under the real Content Security Policy. */
const vercel = JSON.parse(fs.readFileSync(new URL("./vercel.json", import.meta.url), "utf8"));
const productionHeaders = Object.fromEntries(
  vercel.headers.find((rule) => rule.source === "/(.*)").headers.map((h) => [h.key, h.value])
);

export default defineConfig({
  plugins: [projectPages()],
  preview: { headers: productionHeaders }
});

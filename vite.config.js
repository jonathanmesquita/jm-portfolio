import { defineConfig } from "vite";
import { projectPages } from "./scripts/pages/plugin.mjs";

export default defineConfig({
  plugins: [projectPages()]
});

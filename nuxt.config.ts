import { fileURLToPath } from "node:url";
import { defineNuxtConfig } from "nuxt/config";

import untheme from "./config/untheme";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-06",

  // Explicit imports only — no auto-import of components, composables, or Vue/Nuxt APIs.
  // Framework symbols are pulled from "#imports"; foundation-owned code from "#foundation/*".
  imports: { autoImport: false },
  components: false,

  modules: ["@vueuse/nuxt", "@untheme/nuxt"],

  untheme,

  alias: {
    // Absolute path so the alias keeps resolving to the foundation package when this
    // layer is extended by a consumer app (a shared "@"/"~" would resolve to the consumer).
    "#foundation": fileURLToPath(new URL("./app", import.meta.url)),
  },
});

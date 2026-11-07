import { fileURLToPath } from "node:url";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-06",

  modules: ["@icon-sheets/nuxt", "@untheme/nuxt", "@prosary/nuxt"],

  imports: { autoImport: false, scan: false },

  components: {
    dirs: [],
    transform: { exclude: [/./] },
  },

  iconSheets: { preset: "@zoobzio/icons" },

  untheme: { preset: "@zoobzio/theme" },

  prosary: { build: "@zoobzio/prose" },

  css: [fileURLToPath(new URL("./app/assets/css/reset.css", import.meta.url))],

  build: {
    transpile: ["@zoobzio/vue"],
  },

  vite: {
    optimizeDeps: {
      // `objectively` is left out of the dev pre-bundle: Vite keys a
      // pre-bundled dependency by its bare name, and @untheme and
      // @icon-sheets pin older versions than this layer and @zoobzio/vue
      // import, so whichever version Vite met first was served to every
      // importer. Served as source instead, each import resolves to its
      // own version. It is dependency-free ESM, so nothing else is lost.
      exclude: ["@zoobzio/nuxt", "@zoobzio/vue", "objectively"],
    },
    $server: {
      define: {
        // Nuxt's server build replaces `navigator` with `undefined`. Tiptap
        // reads `navigator.platform` while it builds its keymap, as the
        // editor is constructed, so a page that holds an editor crashed on
        // the server in a production build. The runtime's own navigator
        // stands in, and an inert one where the runtime has none.
        navigator: '(globalThis.navigator ?? { platform: "", userAgent: "" })',
      },
    },
  },
});

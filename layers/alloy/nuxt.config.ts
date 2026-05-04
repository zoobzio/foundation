import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-06",
  extends: ["@zoobz-io/ore"],
  imports: {
    dirs: ["types"],
  },
  modules: [
    "@vueuse/nuxt",
  ],
  vite: {
    optimizeDeps: {
      exclude: ["#build/iconic.config.mjs"],
    },
  },
});

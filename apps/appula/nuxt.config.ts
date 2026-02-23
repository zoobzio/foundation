import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-17",
  extends: ["@foundation/blocks"],
  modules: ["@pinia/nuxt"],
  devtools: { enabled: false },
  css: ["@foundation/appula/assets/components/index.css"],
});

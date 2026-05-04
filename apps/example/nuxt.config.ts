import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-06",
  extends: ["@zoobz-io/foundry"],
  imports: {
    dirs: ["stores"],
  },
  css: [
    "~/assets/components/index.css",
    "~/assets/example.css",
  ],
});

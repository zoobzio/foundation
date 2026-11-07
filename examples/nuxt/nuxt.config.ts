import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-06",

  extends: ["@zoobzio/nuxt"],

  css: ["~/assets/css/app.css", "~/assets/css/editor.css"],
});

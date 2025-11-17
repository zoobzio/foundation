import { defineNuxtConfig } from "nuxt/config";
import unthemePreset from "@foundation/untheme/preset";
import vanilla from "@foundation/untheme/themes/vanilla";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-06",
  imports: {
    dirs: ["types", "recipes"],
  },
  modules: [
    "@foundation/untheme/module",
    "@pinia/nuxt",
    "@unocss/nuxt",
    "reka-ui/nuxt",
  ],
  unocss: {
    presets: [unthemePreset],
  },
  untheme: vanilla,
  vite: {
    optimizeDeps: {
      exclude: ["#build/untheme.config.mjs", "#build/iconic.config.mjs"],
    },
  },
});
